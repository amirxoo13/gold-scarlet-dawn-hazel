#!/usr/bin/env python3
"""Print the layer tree of an official Reallusion G3 template PSD.

API source: psd-tools documentation — PSDImage.open, descendants, kind, name, bbox.
Does not create or modify files.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path


def dump(path: Path) -> int:
    try:
        from psd_tools import PSDImage
    except ImportError:
        print("psd-tools is not installed. Run: pip install 'psd-tools[composite]'", file=sys.stderr)
        return 2

    if not path.is_file():
        print(f"file not found: {path}", file=sys.stderr)
        return 2

    psd = PSDImage.open(str(path))
    print(f"file\t{path}")
    print(f"size\t{psd.width}x{psd.height}")
    print(f"mode\t{psd.color_mode}")
    print("index\tkind\tname\tbbox\tvisible")

    for index, layer in enumerate(psd.descendants()):
        name = layer.name.replace("\t", " ")
        kind = getattr(layer, "kind", "?")
        bbox = getattr(layer, "bbox", None)
        visible = getattr(layer, "visible", None)
        print(f"{index}\t{kind}\t{name}\t{bbox}\t{visible}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Dump PSD layer tree for a CTA G3 template.")
    parser.add_argument("psd", type=Path, help="Path to the official Human Template PSD")
    args = parser.parse_args()
    return dump(args.psd)


if __name__ == "__main__":
    raise SystemExit(main())
