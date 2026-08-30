#!/usr/bin/env python3
"""Fill official HumanwithSpriteHand.psd groups with parsed RGBA parts.

Layer names are taken from a dump of the official Reallusion template.
This script does not create new G3 group names.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image


def find_named(root, name: str):
    hits = []
    for layer in root.descendants():
        if layer.name == name:
            hits.append(layer)
    return hits


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


def apply_mask(rgb: Image.Image, mask: Image.Image) -> Image.Image:
    if mask.size != rgb.size:
        mask = mask.resize(rgb.size)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(mask)
    return rgba


def opaque_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def fit_sprite(sprite: Image.Image, dest_box: tuple[int, int, int, int], canvas_size: tuple[int, int]) -> Image.Image:
    src_box = opaque_bbox(sprite)
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    if src_box is None:
        return canvas
    crop = sprite.crop(src_box)
    dest_w = max(1, dest_box[2] - dest_box[0])
    dest_h = max(1, dest_box[3] - dest_box[1])
    scale = min(dest_w / crop.width, dest_h / crop.height)
    new_w = max(1, int(crop.width * scale))
    new_h = max(1, int(crop.height * scale))
    fitted = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = dest_box[0] + (dest_w - new_w) // 2
    y = dest_box[1] + (dest_h - new_h) // 2
    canvas.paste(fitted, (x, y), fitted)
    return canvas


def replace_in_group(psd, group_name: str, sprite: Image.Image, preferred_pixel=(), mode: str = "fit"):
    group = first_group(psd, group_name)
    if group is None:
        raise SystemExit(f"group not in template: {group_name}")
    target = first_pixel_in_group(group, preferred_pixel)
    if target is not None and target.width > 0 and target.height > 0:
        dest = target.bbox
    else:
        dest = group.bbox
    if target is not None:
        target.visible = False
    left, top, right, bottom = dest
    if right <= left or bottom <= top:
        raise SystemExit(f"empty bbox for group {group_name}: {dest}")
    if mode == "align":
        cropped = sprite.crop(dest)
    else:
        placed = fit_sprite(sprite, dest, (psd.width, psd.height))
        cropped = placed.crop(dest)
    layer = psd.create_pixel_layer(cropped, name=f"{group_name}_fill", top=top, left=left)
    group.append(layer)
    return dest


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


def hide_non_fill_pixels(root) -> int:
    hidden = 0
    for layer in root.descendants():
        if getattr(layer, "kind", None) != "pixel":
            continue
        if layer.name.endswith("_fill"):
            continue
        if getattr(layer, "visible", True):
            layer.visible = False
            hidden += 1
    return hidden


def centroid(box) -> tuple[int, int]:
    left, top, right, bottom = box
    return (left + right) // 2, (top + bottom) // 2


def move_pixel(layer, cx: int, cy: int) -> None:
    w = max(1, layer.width)
    h = max(1, layer.height)
    layer.left = cx - w // 2
    layer.top = cy - h // 2


def main() -> int:
    parser = argparse.ArgumentParser(description="Fill official G3 template groups. Does not invent layer names.")
    parser.add_argument("--template", type=Path, required=True)
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--masks", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--view", choices=("front", "back"), required=True)
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

    def place(label_keys, group_name, preferred_pixel=(), union=False, mode="fit"):
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
        dests[group_name] = replace_in_group(psd, group_name, part, preferred_pixel, mode=mode)
        placed.append(group_name)

    for layer in psd:
        if layer.name == "BeforeExport Delete this Image":
            layer.visible = False

    # Face includes hair so the forehead hole from the parser split is covered.
    place(("face", "hair"), "Face", union=True)
    if args.view == "back":
        place(("hair",), "BackHair")
    else:
        place(("hair",), "FrontHair")
    place(("torso", "top", "dress", "pants", "skirt", "belt"), "Hip", union=True, mode="align")

    if "arms" in masks:
        l_mask, r_mask = split_lr(masks["arms"], args.view)
        masks["larm"], masks["lforearm"] = split_ud(l_mask, 0.5)
        masks["rarm"], masks["rforearm"] = split_ud(r_mask, 0.5)
        place(("larm",), "LArm")
        place(("rarm",), "RArm")
        place(("lforearm",), "LForearm")
        place(("rforearm",), "RForearm")
    if "hands" in masks:
        l_mask, r_mask = split_lr(masks["hands"], args.view)
        masks["lhand"] = l_mask
        masks["rhand"] = r_mask
        place(("lhand",), "LHand", ("00Relaxed",))
        place(("rhand",), "RHand", ("00Relaxed",))
    if "legs" in masks:
        l_mask, r_mask = split_lr(masks["legs"], args.view)
        masks["lthigh"], masks["lshank"] = split_ud(l_mask, 0.42)
        masks["rthigh"], masks["rshank"] = split_ud(r_mask, 0.42)
        place(("lthigh",), "LThigh", mode="align")
        place(("rthigh",), "RThigh", mode="align")
        # Dummy shank boxes sit below the compact standing pose — fit socks/calves into them.
        place(("lshank",), "LShank", mode="fit")
        place(("rshank",), "RShank", mode="fit")
    if "feet" in masks:
        l_mask, r_mask = split_lr(masks["feet"], args.view)
        masks["lfoot"] = l_mask
        masks["rfoot"] = r_mask
        place(("lfoot",), "LFoot", mode="align")
        place(("rfoot",), "RFoot", mode="align")

    hidden = hide_non_fill_pixels(image_root)
    print(f"hid {hidden} dummy image pixels")

    bone_root = first_group(psd, "RL_Bone_HumanV2")
    head_root = first_group(psd, "RL_Bone_HeadV2")
    moved = 0
    if bone_root is not None:
        mapping = {
            "Hip": "Hip",
            "Torso": "Hip",
            "LArm": "LArm",
            "RArm": "RArm",
            "LForearm": "LForearm",
            "RForearm": "RForearm",
            "LHand": "LHand",
            "RHand": 