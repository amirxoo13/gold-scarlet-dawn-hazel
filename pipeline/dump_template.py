#!/usr/bin/env python3
"""Dump the official HumanwithSpriteHand.psd tree. Does not invent names."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def walk(layer, depth=0):
    kind = getattr(layer, "kind", "?")
    node = {
        "name": layer.name,
        "kind": kind,
        "visible": bool(getattr(layer, "visible", True)),
        "bbox": list(layer.bbox) if getattr(layer, "bbox", None) else None,
        "children": [],
    }
    if kind == "group":
        for child in layer:
            node["children"].append(walk(child, depth + 1))
    return node


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--template", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    from psd_tools import PSDImage

    psd = PSDImage.open(str(args.template))
    tree = {
        "file": "HumanwithSpriteHand.psd",
        "source": "Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
        "url": "https://file.reallusion.com/cta/Cartoon_Animator_5_PSD_Pipeline_Resource.zip",
        "size": [psd.width, psd.height],
        "roots": [walk(layer) for layer in psd],
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(tree), encoding="utf-8")
    print(f"wrote {args.out} roots={[layer.name for layer in psd]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
