#!/usr/bin/env python3
"""Composite visible image pixels from a filled official PSD (not bone markers)."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def collect_visible_pixels(layer, acc: list) -> None:
    kind = getattr(layer, "kind", None)
    if kind == "pixel" and getattr(layer, "visible", True):
        acc.append(layer)
        return
    if kind == "group":
        children = list(layer)
        for child in reversed(children):
            collect_visible_pixels(child, acc)


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--psd", type=Path, required=True)
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--bg", default="transparent")
    args = p.parse_args()

    from psd_tools import PSDImage

    psd = PSDImage.open(str(args.psd))
    bg = (10, 10, 11, 255) if args.bg == "studio" else (0, 0, 0, 0)
    canvas = Image.new("RGBA", (psd.width, psd.height), bg)
    fills: list = []
    image_root = next((layer for layer in psd if layer.name == "RL_ImageV2"), None)
    if image_root is None:
        for root in reversed(list(psd)):
            collect_visible_pixels(root, fills)
    else:
        collect_visible_pixels(image_root, fills)
    painted = 0
    for layer in fills:
        try:
            tile = layer.composite()
        except Exception:
            tile = layer.topil()
        if tile is None:
            continue
        tile = tile.convert("RGBA")
        canvas.paste(tile, (layer.left, layer.top), tile)
        painted += 1
    args.out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(args.out)
    print(f"wrote {args.out} visible={painted}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
