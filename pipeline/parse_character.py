#!/usr/bin/env python3
"""Parse a full-body photo into FASHN (+ optional L/R) masks via Hugging Face.

Never writes the token to disk. Reads HF_TOKEN or HUGGING_FACE_HUB_TOKEN.
Stops with exit 2 if the token or model is missing.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from PIL import Image, ImageFilter


FASHN_MODEL = "fashn-ai/fashn-human-parser"
CLOTHES_LR_MODEL = "mattmdjaga/segformer_b2_clothes"

# FASHN class colors for studio overlays (not G3 layer names).
FASHN_COLORS = {
    "background": (24, 24, 28, 0),
    "face": (244, 196, 168, 220),
    "hair": (58, 42, 36, 220),
    "top": (214, 64, 64, 200),
    "pants": (48, 48, 56, 200),
    "arms": (232, 176, 140, 200),
    "hands": (212, 160, 122, 220),
    "legs": (232, 232, 236, 200),
    "feet": (28, 28, 32, 220),
    "torso": (176, 48, 48, 160),
}

LR_ALIAS = {
    "left-arm": "larm",
    "right-arm": "rarm",
    "left-leg": "lleg",
    "right-leg": "rleg",
    "left-shoe": "lfoot",
    "right-shoe": "rfoot",
}


def require_token() -> str:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
    if not token:
        print("HF_TOKEN missing — stop. Do not invent a parser.", file=sys.stderr)
        raise SystemExit(2)
    return token


def mask_from_element(element) -> Image.Image:
    mask = getattr(element, "mask", None)
    if mask is None:
        raise RuntimeError("segmentation element has no mask")
    if mask.mode != "L":
        mask = mask.convert("L")
    return mask


def run_model(client, image_path: Path, model: str) -> dict[str, Image.Image]:
    result = client.image_segmentation(image=str(image_path), model=model)
    parts: dict[str, Image.Image] = {}
    for element in result:
        label = str(getattr(element, "label", "")).strip().lower()
        if not label:
            continue
        parts[label] = mask_from_element(element)
    return parts


def save_parts(parts: dict[str, Image.Image], out_dir: Path, prefix: str) -> list[dict]:
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = []
    for index, (label, mask) in enumerate(sorted(parts.items())):
        filename = f"{index:02d}_{label.replace(' ', '-')}.png"
        path = out_dir / filename
        mask.save(path)
        bbox = mask.point(lambda p: 255 if p else 0).getbbox()
        coverage = 0.0
        if mask.size[0] and mask.size[1]:
            # mean of binary mask
            extrema = mask.getextrema()
            coverage = float(sum(mask.point(lambda p: 1 if p else 0).tobytes())) / (mask.size[0] * mask.size[1])
            _ = extrema
        manifest.append(
            {
                "label": label,
                "file": filename,
                "bbox": list(bbox) if bbox else None,
                "coverage": round(coverage, 6),
                "source": prefix,
            }
        )
    (out_dir / "manifest.json").write_text(
        json.dumps({"model": prefix, "parts": manifest}, indent=2),
        encoding="utf-8",
    )
    return manifest


def compose_overlay(rgb: Image.Image, parts: dict[str, Image.Image], colors: dict[str, tuple]) -> Image.Image:
    base = rgb.convert("RGBA")
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    for label, mask in parts.items():
        if label == "background":
            continue
        color = colors.get(label, (160, 180, 200, 180))
        layer = Image.new("RGBA", base.size, color)
        alpha = mask.filter(ImageFilter.MedianFilter(size=3))
        layer.putalpha(alpha.point(lambda p: color[3] if p else 0))
        overlay = Image.alpha_composite(overlay, layer)
    return Image.alpha_composite(base, overlay)


def cutout(rgb: Image.Image, background: Image.Image | None) -> Image.Image:
    rgba = rgb.convert("RGBA")
    if background is None:
        return rgba
    alpha = background.point(lambda p: 0 if p else 255)
    rgba.putalpha(alpha)
    return rgba


def main() -> int:
    parser = argparse.ArgumentParser(description="FASHN human parse via Hugging Face Inference.")
    parser.add_argument("--image", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--view", choices=("front", "back"), required=True)
    args = parser.parse_args()

    token = require_token()
    try:
        from huggingface_hub import InferenceClient
    except ImportError:
        print("install huggingface_hub first", file=sys.stderr)
        return 2

    if not args.image.is_file():
        print(f"image not found: {args.image}", file=sys.stderr)
        return 2

    client = InferenceClient(provider="hf-inference", token=token, timeout=120)
    print(f"parse {args.view} with {FASHN_MODEL}")
    fashn = run_model(client, args.image, FASHN_MODEL)
    if "face" not in fashn and "hair" not in fashn:
        print(f"FASHN returned no body parts: {sorted(fashn)}", file=sys.stderr)
        return 2

    clothes: dict[str, Image.Image] = {}
    try:
        print(f"L/R assist {CLOTHES_LR_MODEL}")
        clothes = run_model(client, args.image, CLOTHES_LR_MODEL)
    except Exception as exc:
        print(f"L/R assist skipped: {type(exc).__name__}: {exc}")

    merged = dict(fashn)
    for src, dest in LR_ALIAS.items():
        if src in clothes:
            merged[dest] = clothes[src]
            merged[src] = clothes[src]

    args.out.mkdir(parents=True, exist_ok=True)
    rgb = Image.open(args.image).convert("RGB")
    fashn_manifest = save_parts(fashn, args.out, FASHN_MODEL)
    if clothes:
        save_parts({k: v for k, v in merged.items() if k in LR_ALIAS or k in LR_ALIAS.values()}, args.out / "lr", CLOTHES_LR_MODEL)

    overlay = compose_overlay(rgb, fashn, FASHN_COLORS)
    overlay.save(args.out / "overlay.png")
    isolated = cutout(rgb, fashn.get("background"))
    isolated.save(args.out / "cutout.png")

    # Combined manifest used by fill_template.py
    fill_parts = []
    for label, mask in merged.items():
        filename = f"fill_{label.replace(' ', '-')}.png"
        mask.save(args.out / filename)
        fill_parts.append({"label": label, "file": filename})
    (args.out / "manifest.json").write_text(
        json.dumps(
            {
                "view": args.view,
                "image": str(args.image),
                "parser": FASHN_MODEL,
                "lr_parser": CLOTHES_LR_MODEL if clothes else None,
                "parts": fill_parts,
                "fashn": fashn_manifest,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"wrote {args.out} parts={sorted(merged)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
