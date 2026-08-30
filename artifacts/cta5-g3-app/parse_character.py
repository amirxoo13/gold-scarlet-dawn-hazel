#!/usr/bin/env python3
"""Segment a character image into body/clothing masks.

Default model (Hub model card): fashn-ai/fashn-human-parser
API source: transformers.pipeline("image-segmentation") as shown on that card.

This script does not write a PSD and does not invent G3 layer names.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


DEFAULT_MODEL = "fashn-ai/fashn-human-parser"

# Labels published on the fashn-ai/fashn-human-parser model card.
FASHN_LABELS = (
    "background",
    "face",
    "hair",
    "top",
    "dress",
    "skirt",
    "pants",
    "belt",
    "bag",
    "hat",
    "scarf",
    "glasses",
    "arms",
    "hands",
    "legs",
    "feet",
    "torso",
    "jewelry",
)


def safe_filename(label: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", label.strip())
    return cleaned or "unnamed"


def parse_image(image_path: Path, out_dir: Path, model_id: str) -> int:
    if not image_path.is_file():
        print(f"file not found: {image_path}", file=sys.stderr)
        return 2

    try:
        from PIL import Image
        from transformers import pipeline
    except ImportError as exc:
        print(
            "missing dependency. Run: pip install -r requirements.txt\n"
            f"import error: {exc}",
            file=sys.stderr,
        )
        return 2

    image = Image.open(image_path).convert("RGB")
    width, height = image.size

    try:
        segmenter = pipeline("image-segmentation", model=model_id)
        result = segmenter(image)
    except Exception as exc:
        print(f"segmentation failed for model {model_id}: {exc}", file=sys.stderr)
        return 1

    if not isinstance(result, list):
        print(f"unexpected pipeline output type: {type(result)!r}", file=sys.stderr)
        return 1

    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = {
        "source": str(image_path.resolve()),
        "model": model_id,
        "size": [width, height],
        "parts": [],
        "notes": [
            "No left/right split is invented when the model returns a single 'arms' or 'legs' mask.",
            "This output is not a G3 PSD.",
        ],
    }

    for index, item in enumerate(result):
        if not isinstance(item, dict):
            print(f"skip non-dict item at {index}: {type(item)!r}", file=sys.stderr)
            continue
        label = item.get("label")
        mask = item.get("mask")
        score = item.get("score")
        if label is None or mask is None:
            print(f"skip item {index}: missing label or mask", file=sys.stderr)
            continue
        if not hasattr(mask, "save"):
            print(f"skip item {index}: mask is not a PIL image", file=sys.stderr)
            continue
        if mask.size != (width, height):
            mask = mask.resize((width, height))
        filename = f"{index:02d}_{safe_filename(str(label))}.png"
        dest = out_dir / filename
        mask.save(dest)
        manifest["parts"].append(
            {
                "index": index,
                "label": str(label),
                "score": None if score is None else float(score),
                "file": filename,
            }
        )

    manifest_path = out_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(manifest['parts'])} masks + {manifest_path}")
    if model_id == DEFAULT_MODEL:
        known = {label.lower() for label in FASHN_LABELS}
        seen = {part["label"].lower() for part in manifest["parts"]}
        extra = sorted(seen - known)
        if extra:
            print("labels not on the published FASHN card: " + ", ".join(extra))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Save human-parsing masks. Does not create a Cartoon Animator PSD."
    )
    parser.add_argument("image", type=Path, help="Input character image (PNG/JPEG)")
    parser.add_argument("--out-dir", type=Path, default=Path("masks"), help="Directory for mask PNGs")
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help="Hub model id. Default is fashn-ai/fashn-human-parser",
    )
    args = parser.parse_args()
    return parse_image(args.image, args.out_dir, args.model)


if __name__ == "__main__":
    raise SystemExit(main())
