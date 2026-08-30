#!/usr/bin/env python3
"""Entry point. Fill/inpaint commands stay disabled until a template dump exists."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import dump_psd_tree
import parse_character


def cmd_fill(_args: argparse.Namespace) -> int:
    print(
        "fill is blocked (gate G1 / G5).\n"
        "Give the official Reallusion Human Template PSD path, run dump-psd,\n"
        "then layer names from that dump can be wired. No G3 tree is invented.",
        file=sys.stderr,
    )
    return 2


def main() -> int:
    parser = argparse.ArgumentParser(prog="cta5-g3-app")
    sub = parser.add_subparsers(dest="command", required=True)

    p_dump = sub.add_parser("dump-psd", help="Print official template layer tree")
    p_dump.add_argument("psd", type=Path)

    p_parse = sub.add_parser("parse", help="Write human-parsing masks")
    p_parse.add_argument("image", type=Path)
    p_parse.add_argument("--out-dir", type=Path, default=Path("masks"))
    p_parse.add_argument("--model", default=parse_character.DEFAULT_MODEL)

    sub.add_parser("fill", help="Blocked until template dump is available")

    args = parser.parse_args()
    if args.command == "dump-psd":
        return dump_psd_tree.dump(args.psd)
    if args.command == "parse":
        return parse_character.parse_image(args.image, args.out_dir, args.model)
    if args.command == "fill":
        return cmd_fill(args)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
