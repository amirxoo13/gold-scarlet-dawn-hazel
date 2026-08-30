#!/usr/bin/env python3
"""Fill official HumanwithSpriteHand.psd — CTA5 G3 pipeline.

Rules from the official Reallusion PSD pipeline:
  - Do not invent G3 group names.
  - Do not move bone markers. Library motions are authored on the dummy T-pose.
  - FIT photo parts into dummy dest boxes (arms rotated to T-pose).
  - Replace official pixels in place (psd-tools frompil) so Face/Center stays valid.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


ANGLE_GROUP_NAMES = {
    "Center",
    "CenterLeft",
    "CenterRight",
    "Left",
    "Right",
    "Up",
    "Down",
    "UpLeft",
    "UpRight",
    "DownLeft",
    "DownRight",
    "UpperLeft",
    "UpperRight",
    "LowerLeft",
    "LowerRight",
}


def find_named(root, name: str):
    return [layer for layer in root.descendants() if layer.name == name]


def first_group(root, name: str):
    for layer in find_named(root, name):
        if getattr(layer, "kind", None) == "group":
            return layer
    return None


def first_pixel_in_group(group, preferred_names=()):
    pixels = [layer for layer in group.descendants() if getattr(layer, "kind", None) == "pixel"]
    for preferred in preferred_names:
        for layer in pixels:
            if layer.name == preferred:
                return layer
    for layer in pixels:
        if getattr(layer, "visible", True):
            return layer
    return pixels[0] if pixels else None


def union_masks(masks: dict[str, Image.Image], keys: tuple[str, ...]) -> Image.Image | None:
    selected = [masks[key] for key in keys if key in masks]
    if not selected:
        return None
    acc = selected[0].point(lambda p: 255 if p else 0)
    for extra in selected[1:]:
        extra = extra.point(lambda p: 255 if p else 0)
        acc = Image.composite(extra, acc, extra)
    return acc


def subtract_mask(base: Image.Image | None, cut: Image.Image | None, dilate: int = 0) -> Image.Image | None:
    if base is None:
        return None
    binary = base.point(lambda p: 255 if p else 0)
    if cut is None:
        return binary
    cutb = cut.point(lambda p: 255 if p else 0)
    if dilate:
        size = dilate * 2 + 1
        if size % 2 == 0:
            size += 1
        cutb = cutb.filter(ImageFilter.MaxFilter(size))
    return ImageChops.subtract(binary, cutb)


def scale_l_mask(mask: Image.Image, canvas_size: tuple[int, int], content_box) -> Image.Image:
    rgba = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    rgba.putalpha(mask.convert("L"))
    return build_canvas(rgba, canvas_size, content_box).split()[-1]


def load_mask_parts(mask_dir: Path) -> dict[str, Image.Image]:
    manifest_path = mask_dir / "manifest.json"
    if not manifest_path.is_file():
        raise FileNotFoundError(f"missing {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    parts = {}
    for item in manifest.get("parts", []):
        label = str(item["label"]).lower()
        image = Image.open(mask_dir / item["file"])
        parts[label] = image.convert("L")
    return parts


def split_lr(mask: Image.Image, view: str) -> tuple[Image.Image, Image.Image]:
    width, height = mask.size
    mid = width // 2
    left_px = Image.new("L", (width, height), 0)
    right_px = Image.new("L", (width, height), 0)
    data = mask.load()
    left_data = left_px.load()
    right_data = right_px.load()
    for y in range(height):
        for x in range(width):
            value = data[x, y]
            if value == 0:
                continue
            viewer_left = x < mid
            if view == "front":
                if viewer_left:
                    right_data[x, y] = value
                else:
                    left_data[x, y] = value
            else:
                if viewer_left:
                    left_data[x, y] = value
                else:
                    right_data[x, y] = value
    return left_px, right_px


def split_ud(mask: Image.Image, upper_ratio: float = 0.45) -> tuple[Image.Image, Image.Image]:
    box = mask.getbbox()
    upper = Image.new("L", mask.size, 0)
    lower = Image.new("L", mask.size, 0)
    if box is None:
        return upper, lower
    _l, top, _r, bottom = box
    split_y = top + max(1, int((bottom - top) * upper_ratio))
    data = mask.load()
    upper_data = upper.load()
    lower_data = lower.load()
    for y in range(top, bottom):
        dest = upper_data if y < split_y else lower_data
        for x in range(_l, _r):
            value = data[x, y]
            if value:
                dest[x, y] = value
    return upper, lower


def overlap_ud(mask: Image.Image, upper_end: float = 0.55, lower_start: float = 0.35) -> tuple[Image.Image, Image.Image]:
    """Split a vertical limb so thigh and shank share an overlap (dummy dests overlap at the knee)."""
    box = mask.getbbox()
    upper = Image.new("L", mask.size, 0)
    lower = Image.new("L", mask.size, 0)
    if box is None:
        return upper, lower
    _l, top, _r, bottom = box
    height = bottom - top
    y_upper_end = top + max(1, int(height * upper_end))
    y_lower_start = top + max(1, int(height * lower_start))
    data = mask.load()
    upper_data = upper.load()
    lower_data = lower.load()
    for y in range(top, bottom):
        for x in range(_l, _r):
            value = data[x, y]
            if not value:
                continue
            if y < y_upper_end:
                upper_data[x, y] = value
            if y >= y_lower_start:
                lower_data[x, y] = value
    return upper, lower
    box = mask.getbbox()
    upper = Image.new("L", mask.size, 0)
    lower = Image.new("L", mask.size, 0)
    if box is None:
        return upper, lower
    _l, top, _r, bottom = box
    split_y = top + max(1, int((bottom - top) * upper_ratio))
    data = mask.load()
    upper_data = upper.load()
    lower_data = lower.load()
    for y in range(top, bottom):
        dest = upper_data if y < split_y else lower_data
        for x in range(_l, _r):
            value = data[x, y]
            if value:
                dest[x, y] = value
    return upper, lower


def apply_mask(rgb: Image.Image, mask: Image.Image) -> Image.Image:
    if mask.size != rgb.size:
        mask = mask.resize(rgb.size)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def opaque_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def rotate_part(sprite: Image.Image, degrees: float) -> Image.Image:
    box = opaque_bbox(sprite)
    if box is None or degrees == 0:
        return sprite
    crop = sprite.crop(box).rotate(degrees, expand=True, resample=Image.Resampling.BICUBIC)
    canvas = Image.new("RGBA", sprite.size, (0, 0, 0, 0))
    canvas.paste(crop, (0, 0), crop)
    return canvas


def fit_sprite(sprite: Image.Image, dest_box: tuple[int, int, int, int], canvas_size: tuple[int, int]) -> Image.Image:
    """Stretch the opaque crop to fill the dummy dest.

    Contain-fit left transparent padding. Photopea/CTA5 trim that padding and
    pin the leftover at dest origin — that is the disconnected T-pose the user
    saw. Dummy dests already overlap at joints; filling them reconnects the body.
    """
    src_box = opaque_bbox(sprite)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    if src_box is None:
        return canvas
    crop = sprite.crop(src_box)
    dest_w = max(1, dest_box[2] - dest_box[0])
    dest_h = max(1, dest_box[3] - dest_box[1])
    fitted = crop.resize((dest_w, dest_h), Image.Resampling.LANCZOS)
    canvas.paste(fitted, (dest_box[0], dest_box[1]), fitted)
    return canvas


def replace_in_group(psd, group_name: str, sprite: Image.Image, preferred_pixel=(), mode: str = "fit"):
    from psd_tools.api.layers import PixelLayer

    group = first_group(psd, group_name)
    if group is None:
        print(f"skip {group_name}: missing group")
        return None, None
    target = first_pixel_in_group(group, preferred_pixel)
    parent = target.parent if target is not None else group
    official_name = target.name if target is not None else group_name
    if target is not None and target.width > 0 and target.height > 0:
        slot = target.bbox
    else:
        slot = group.bbox
    left, top, right, bottom = slot
    if right <= left or bottom <= top:
        print(f"skip {group_name}: empty dest {slot}")
        return None, None
    if mode == "align":
        cropped = sprite.crop(slot)
    else:
        placed = fit_sprite(sprite, slot, (psd.width, psd.height))
        cropped = placed.crop(slot)

    idx = parent.index(target) if target is not None else None
    if target is not None:
        parent.remove(target)
    layer = PixelLayer.frompil(
        cropped.convert("RGBA"),
        parent=parent,
        name=official_name,
        top=top,
        left=left,
    )
    layer.visible = True
    if idx is not None:
        current = parent.index(layer)
        if current != idx:
            parent.remove(layer)
            parent.insert(idx, layer)
    return slot, slot


def erase_pixel_layer(layer) -> None:
    from psd_tools.api.layers import PixelLayer

    parent = layer.parent
    if parent is None:
        layer.visible = False
        return
    idx = parent.index(layer)
    name = layer.name
    top, left = layer.top, layer.left
    width = max(1, layer.width)
    height = max(1, layer.height)
    parent.remove(layer)
    empty = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    new = PixelLayer.frompil(empty, parent=parent, name=name, top=top, left=left)
    new.visible = False
    current = parent.index(new)
    if current != idx:
        parent.remove(new)
        parent.insert(idx, new)


def erase_unplaced_head_dummies(psd, placed: list[str]) -> int:
    image_root = first_group(psd, "RL_ImageV2")
    if image_root is None:
        return 0
    head = first_group(image_root, "RL_ImageHeadV2")
    if head is None:
        return 0
    keep = set(placed)
    erased = 0
    for feature in head:
        if feature.name in keep:
            continue
        pixels = [layer for layer in feature.descendants() if getattr(layer, "kind", None) == "pixel"]
        for layer in pixels:
            erase_pixel_layer(layer)
            erased += 1
    return erased


def hide_other_hand_poses(psd, group_name: str, keep: str = "00Relaxed") -> int:
    group = first_group(psd, group_name)
    if group is None:
        return 0
    erased = 0
    for layer in list(group.descendants()):
        if getattr(layer, "kind", None) == "pixel" and layer.name != keep:
            erase_pixel_layer(layer)
            erased += 1
    return erased


def validate_angle_groups(psd) -> list[str]:
    errors: list[str] = []
    image_root = first_group(psd, "RL_ImageV2")
    if image_root is None:
        return ["missing RL_ImageV2"]
    head = first_group(image_root, "RL_ImageHeadV2")
    if head is None:
        return ["missing RL_ImageHeadV2"]
    for feature in head:
        if getattr(feature, "kind", None) != "group":
            continue
        for child in feature:
            kind = getattr(child, "kind", None)
            name = child.name
            if kind == "group":
                if name not in ANGLE_GROUP_NAMES:
                    errors.append(f"{feature.name}/{name} is not a valid angle group")
            else:
                errors.append(f"{feature.name} has non-group child {name!r} ({kind})")
    return errors


def lr_pair(masks: dict[str, Image.Image], combined: str, left_keys: tuple[str, ...], right_keys: tuple[str, ...], view: str):
    left = next((masks[key] for key in left_keys if key in masks), None)
    right = next((masks[key] for key in right_keys if key in masks), None)
    if left is not None and right is not None:
        return left, right, "parser-lr"
    if combined in masks:
        left, right = split_lr(masks[combined], view)
        return left, right, "midline"
    return None, None, "missing"


def build_canvas(character: Image.Image, canvas_size: tuple[int, int], content_box) -> Image.Image:
    cw, ch = canvas_size
    left, top, right, bottom = content_box
    box_w = right - left
    box_h = bottom - top
    scale = min(box_w / character.width, box_h / character.height)
    new_w = max(1, int(character.width * scale))
    new_h = max(1, int(character.height * scale))
    resized = character.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    x = left + (box_w - new_w) // 2
    y = top + (box_h - new_h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def main() -> int:
    parser = argparse.ArgumentParser(description="Fill official G3 template. Does not move bones.")
    parser.add_argument("--template", type=Path, required=True)
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--masks", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--view", choices=("front", "back"), required=True)
    parser.add_argument("--report", type=Path, default=None)
    parser.add_argument("--preview", type=Path, default=None)
    args = parser.parse_args()

    try:
        from psd_tools import PSDImage
    except ImportError:
        print("install psd-tools first", file=sys.stderr)
        return 2

    if not args.template.is_file():
        print(f"template not found: {args.template}", file=sys.stderr)
        return 2

    psd = PSDImage.open(str(args.template))
    roots = {layer.name for layer in psd}
    if "RL_ImageV2" not in roots:
        print(f"template missing RL_ImageV2, found {sorted(roots)}", file=sys.stderr)
        return 2

    image_root = first_group(psd, "RL_ImageV2")
    content_box = image_root.bbox
    character = Image.open(args.image).convert("RGBA")
    canvas = build_canvas(character, (psd.width, psd.height), content_box)
    masks = load_mask_parts(args.masks)

    rgb = canvas.convert("RGB")
    placed: list[str] = []
    dests: dict[str, tuple[int, int, int, int]] = {}
    slots: dict[str, list[int]] = {}
    modes: dict[str, str] = {}
    splits: dict[str, str] = {}

    def place(label_keys, group_name, preferred_pixel=(), union=False, mode="fit", rotate=0):
        if union:
            mask = union_masks(masks, label_keys)
        else:
            mask = None
            for key in label_keys:
                if key in masks:
                    mask = masks[key]
                    break
        if mask is None:
            print(f"skip {group_name}: no mask in {label_keys}")
            return
        scaled_mask = scale_l_mask(mask, canvas.size, content_box)
        part = apply_mask(rgb, scaled_mask)
        if rotate:
            part = rotate_part(part, rotate)
        dest, slot = replace_in_group(psd, group_name, part, preferred_pixel, mode=mode)
        if dest is None:
            return
        dests[group_name] = dest
        slots[group_name] = list(slot)
        placed.append(group_name)
        modes[group_name] = f"{mode}|rot{rotate}" if rotate else mode

    for layer in psd:
        if layer.name == "BeforeExport Delete this Image":
            layer.visible = False

    # Face = complete photo head fitted into dummy Face. No extra feature sprites.
    face = union_masks(masks, ("face", "hair", "forehead"))
    if face is not None:
        masks["head_full"] = face
        place(("head_full",), "Face")
    else:
        place(("face", "hair"), "Face", union=True)

    # Hip = jersey + shorts. Socks go to shanks so knees can bend.
    hip_parts = ["torso", "top", "dress", "skirt", "belt", "underarm"]
    pants = masks.get("pants")
    calf = None
    if pants is not None:
        shorts, calf = split_ud(pants, 0.38)
        masks["shorts"] = shorts
        hip_parts.append("shorts")
    else:
        hip_parts.append("pants")
    hip = union_masks(masks, tuple(hip_parts))
    for drop_key in ("arms", "hands", "larm", "rarm", "left-arm", "right-arm"):
        hip = subtract_mask(hip, masks.get(drop_key), dilate=2)
    if hip is not None:
        masks["hip"] = hip
        place(("hip",), "Hip")
    else:
        place(("torso", "top", "pants"), "Hip", union=True)

    # Standing-pose arms are vertical. Dummy T-pose arms are horizontal.
    # Rotate so library motions (authored on T-pose) do not tangle the limbs.
    l_arm, r_arm, arm_split = lr_pair(masks, "arms", ("larm", "left-arm"), ("rarm", "right-arm"), args.view)
    splits["arms"] = arm_split
    if l_arm is not None:
        masks["larm"], masks["lforearm"] = overlap_ud(l_arm, 0.58, 0.42)
        masks["rarm"], masks["rforearm"] = overlap_ud(r_arm, 0.58, 0.42)

    l_hand, r_hand, hand_split = lr_pair(masks, "hands", ("lhand", "left-hand", "glove"), ("rhand", "right-hand"), args.view)
    splits["hands"] = hand_split
    if l_hand is not None:
        masks["lhand"] = l_hand
        masks["rhand"] = r_hand
        if "lforearm" in masks:
            masks["lforearm"] = subtract_mask(masks["lforearm"], l_hand, dilate=1) or masks["lforearm"]
            masks["rforearm"] = subtract_mask(masks["rforearm"], r_hand, dilate=1) or masks["rforearm"]
        place(("lhand",), "LHand", ("00Relaxed",), rotate=90)
        place(("rhand",), "RHand", ("00Relaxed",), rotate=-90)
        hide_other_hand_poses(psd, "LHand")
        hide_other_hand_poses(psd, "RHand")

    if l_arm is not None:
        place(("larm",), "LArm", rotate=90)
        place(("rarm",), "RArm", rotate=-90)
        place(("lforearm",), "LForearm", rotate=90)
        place(("rforearm",), "RForearm", rotate=-90)

    if "feet" in masks:
        l_foot, r_foot = split_lr(masks["feet"], args.view)
        splits["feet"] = "feet-midline"
    else:
        l_foot, r_foot, foot_split = lr_pair(masks, "feet", ("lfoot", "left-shoe"), ("rfoot", "right-shoe"), args.view)
        splits["feet"] = foot_split
    if l_foot is not None:
        masks["lfoot"] = l_foot
        masks["rfoot"] = r_foot
        place(("lfoot",), "LFoot")
        place(("rfoot",), "RFoot")

    l_leg, r_leg, leg_split = lr_pair(masks, "legs", ("lleg", "left-leg"), ("rleg", "right-leg"), args.view)
    splits["legs"] = leg_split
    if calf is not None:
        l_calf, r_calf = split_lr(calf, args.view)
        if l_leg is None:
            l_leg, r_leg = l_calf, r_calf
        else:
            l_leg = union_masks({"a": l_leg, "b": l_calf}, ("a", "b"))
            r_leg = union_masks({"a": r_leg, "b": r_calf}, ("a", "b"))
    if l_leg is not None:
        if l_foot is not None:
            l_leg = subtract_mask(l_leg, l_foot, dilate=2) or l_leg
            r_leg = subtract_mask(r_leg, r_foot, dilate=2) or r_leg
        masks["lthigh"], masks["lshank"] = overlap_ud(l_leg, 0.58, 0.38)
        masks["rthigh"], masks["rshank"] = overlap_ud(r_leg, 0.58, 0.38)
        place(("lthigh",), "LThigh")
        place(("rthigh",), "RThigh")
        place(("lshank",), "LShank")
        place(("rshank",), "RShank")

    hidden = erase_unplaced_head_dummies(psd, placed)
    print(f"erased {hidden} unused dummy head pixels (CTA5 ignores hide)")

    angle_errors = validate_angle_groups(psd)
    if angle_errors:
        print("ANGLE GROUP ERRORS (CTA5 will reject the face):", file=sys.stderr)
        for item in angle_errors:
            print(f"  - {item}", file=sys.stderr)
        return 3
    print("angle groups: ok")
    print("bones were not moved (library motions need the official T-pose skeleton)")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    psd.save(str(args.out))
    print(f"wrote {args.out}")
    print("placed groups: " + ", ".join(placed) if placed else "placed groups: none")

    preview_path = None
    if args.preview is not None:
        composite = psd.composite()
        args.preview.parent.mkdir(parents=True, exist_ok=True)
        composite.save(args.preview)
        preview_path = str(args.preview)
        print(f"wrote preview {args.preview}")

    def bone_centers(root):
        out = {}
        if root is None:
            return out
        for child in root:
            if getattr(child, "kind", None) == "pixel":
                out[child.name] = [child.left + child.width // 2, child.top + child.height // 2]
        return out

    if args.report is not None:
        report = {
            "view": args.view,
            "template": str(args.template),
            "out": str(args.out),
            "preview": preview_path,
            "canvas": [psd.width, psd.height],
            "contentBox": list(content_box),
            "placed": placed,
            "modes": modes,
            "splits": splits,
            "hiddenDummyPixels": hidden,
            "movedBones": 0,
            "angleErrors": angle_errors,
            "dests": {k: list(v) for k, v in dests.items()},
            "slots": slots,
            "bonesHuman": bone_centers(first_group(psd, "RL_Bone_HumanV2")),
            "bonesHead": bone_centers(first_group(psd, "RL_Bone_HeadV2")),
        }
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(f"wrote report {args.report}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
