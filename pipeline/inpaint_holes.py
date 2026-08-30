#!/usr/bin/env python3
"""Build underarm/forehead hole masks and fill them with Telea inpaint.

Uses OpenCV cv2.INPAINT_TELEA on geometric holes derived from FASHN masks.
Does not invent G3 layer names. Does not write HF tokens to disk.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def load_l(path: Path) -> np.ndarray:
    return np.array(Image.open(path).convert("L")) > 127


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    size = radius * 2 + 1
    image = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    return np.array(image.filter(ImageFilter.MaxFilter(size))) > 127


def erode(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    size = radius * 2 + 1
    image = Image.fromarray((mask.astype(np.uint8) * 255), "L")
    return np.array(image.filter(ImageFilter.MinFilter(size))) > 127


def save_mask(path: Path, mask: np.ndarray) -> None:
    Image.fromarray((mask.astype(np.uint8) * 255), "L").save(path)


def underarm_holes(parts: dict[str, np.ndarray]) -> np.ndarray:
    jersey = parts.get("top", False) | parts.get("torso", False)
    arms = parts.get("arms", np.zeros_like(jersey, dtype=bool))
    hands = parts.get("hands", np.zeros_like(jersey, dtype=bool))
    pants = parts.get("pants", np.zeros_like(jersey, dtype=bool))
    if not np.any(jersey):
        return np.zeros_like(arms, dtype=bool)

    # Morphological close ≈ the jersey silhouette if hanging arms had not bitten it.
    closed = erode(dilate(jersey, 8), 8)
    # Occlusion: arm/hand pixels that sit inside that restored torso, plus true gaps.
    hole = (arms | hands) & closed
    hole |= closed & ~jersey
    hole &= ~pants
    hole &= ~erode(jersey, 3)
    return hole


def forehead_holes(parts: dict[str, np.ndarray]) -> np.ndarray:
    face = parts.get("face", np.zeros((1, 1), dtype=bool))
    hair = parts.get("hair", np.zeros_like(face, dtype=bool))
    if face.shape != hair.shape:
        return np.zeros_like(face, dtype=bool)
    if not np.any(face) or not np.any(hair):
        return np.zeros_like(face, dtype=bool)

    gap = dilate(face, 6) & dilate(hair, 6) & ~face & ~hair
    # Vertical band between hair lower edge and face upper edge.
    hair_rows = np.where(hair.any(axis=1))[0]
    face_rows = np.where(face.any(axis=1))[0]
    if hair_rows.size and face_rows.size:
        y_hair_bottom = int(hair_rows[-1])
        y_face_top = int(face_rows[0])
        y0 = min(y_hair_bottom, y_face_top)
        y1 = max(y_hair_bottom, y_face_top)
        band = np.zeros_like(face, dtype=bool)
        cols = np.where(face.any(axis=0) | hair.any(axis=0))[0]
        if cols.size:
            x0, x1 = int(cols[0]), int(cols[-1])
            band[y0 : y1 + 1, x0 : x1 + 1] = True
            band &= dilate(face | hair, 8)
            band &= ~face & ~hair
            gap |= band
    gap &= ~parts.get("background", np.zeros_like(face, dtype=bool))
    return gap


def telea_inpaint(rgb: Image.Image, hole: np.ndarray) -> Image.Image:
    try:
        import cv2
    except ImportError:
        print("install opencv-python-headless first", file=sys.stderr)
        raise SystemExit(2)

    bgr = cv2.cvtColor(np.array(rgb.convert("RGB")), cv2.COLOR_RGB2BGR)
    mask = (hole.astype(np.uint8) * 255)
    if not np.any(mask):
        return rgb.convert("RGB")
    # Slight dilate so Telea has a closed region.
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(mask, kernel, iterations=1)
    filled = cv2.inpaint(bgr, mask, inpaintRadius=6, flags=cv2.INPAINT_TELEA)
    rgb_filled = cv2.cvtColor(filled, cv2.COLOR_BGR2RGB)
    # Feather the seam against the original.
    alpha = cv2.GaussianBlur(mask, (0, 0), 2.2).astype(np.float32) / 255.0
    alpha = alpha[..., None]
    orig = np.array(rgb.convert("RGB"), dtype=np.float32)
    blend = orig * (1.0 - alpha) + rgb_filled.astype(np.float32) * alpha
    return Image.fromarray(np.clip(blend, 0, 255).astype(np.uint8), "RGB")


def overlay_holes(rgb: Image.Image, underarm: np.ndarray, forehead: np.ndarray) -> Image.Image:
    paint = np.zeros((rgb.size[1], rgb.size[0], 4), dtype=np.uint8)
    if np.any(underarm):
        paint[underarm] = (196, 176, 138, 160)
    if np.any(forehead):
        paint[forehead] = (196, 138, 138, 180)
    return Image.fromarray(paint, "RGBA")


def load_parts(mask_dir: Path) -> dict[str, np.ndarray]:
    manifest = json.loads((mask_dir / "manifest.json").read_text(encoding="utf-8"))
    parts: dict[str, np.ndarray] = {}
    for item in manifest.get("parts", []):
        label = str(item["label"]).lower()
        path = mask_dir / item["file"]
        if path.is_file():
            parts[label] = load_l(path)
    return parts


def main() -> int:
    parser = argparse.ArgumentParser(description="Telea inpaint of FASHN underarm/forehead holes.")
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--masks", type=Path, required=True)
    parser.add_argument("--out-image", type=Path, required=True)
    parser.add_argument("--out-overlay", type=Path, required=True)
    parser.add_argument("--out-report", type=Path, required=True)
    args = parser.parse_args()

    parts = load_parts(args.masks)
    rgb = Image.open(args.image).convert("RGB")
    underarm = underarm_holes(parts)
    forehead = forehead_holes(parts)
    hole = underarm | forehead

    inpainted = telea_inpaint(rgb, hole)
    overlay = overlay_holes(rgb, underarm, forehead)

    # Expand Hip / Face coverage so fill uses the repaired pixels.
    if "top" in parts:
        save_mask(args.masks / "fill_top.png", parts["top"] | underarm)
    if "torso" in parts:
        save_mask(args.masks / "fill_torso.png", parts["torso"] | underarm)
    if "face" in parts:
        save_mask(args.masks / "fill_face.png", parts["face"] | forehead)
    save_mask(args.masks / "fill_underarm.png", underarm)
    save_mask(args.masks / "fill_forehead.png", forehead)

    manifest_path = args.masks / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    extra = [
        {"label": "underarm", "file": "fill_underarm.png"},
        {"label": "forehead", "file": "fill_forehead.png"},
    ]
    labels = {item["label"] for item in manifest.get("parts", [])}
    for item in extra:
        if item["label"] not in labels:
            manifest.setdefault("parts", []).append(item)
    manifest["inpaint"] = {
        "method": "opencv.INPAINT_TELEA",
        "underarmPixels": int(underarm.sum()),
        "foreheadPixels": int(forehead.sum()),
    }
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    args.out_image.parent.mkdir(parents=True, exist_ok=True)
    inpainted.save(args.out_image)
    overlay.save(args.out_overlay)
    args.out_report.parent.mkdir(parents=True, exist_ok=True)
    args.out_report.write_text(
        json.dumps(
            {
                "method": "opencv.INPAINT_TELEA",
                "underarmPixels": int(underarm.sum()),
                "foreheadPixels": int(forehead.sum()),
                "image": str(args.out_image),
                "overlay": str(args.out_overlay),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(
        f"inpaint {args.image.name}: underarm={int(underarm.sum())} forehead={int(forehead.sum())} -> {args.out_image}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
