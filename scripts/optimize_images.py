#!/usr/bin/env python3
"""Build AVIF, WebP and JPEG srcsets without upscaling.

Examples
  python3 scripts/optimize_images.py photo.jpg images/parasomnia/hero --widths 480,960,1365 --max-kb 150
  python3 scripts/optimize_images.py board.png images/parasomnia/research --widths 800,1600 --max-kb 200

Writes images/parasomnia/hero-480.avif (and .webp, .jpg) for every width the
source actually supports. Prints one JSON line: width, height, bytes, tone.
EXIF is dropped. Nothing is upscaled.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from PIL import Image


def dominant(im: Image.Image) -> str:
    small = im.convert("RGB").resize((1, 1), Image.Resampling.BOX)
    r, g, b = small.getpixel((0, 0))
    return f"#{r:02x}{g:02x}{b:02x}"


def save_under(frame: Image.Image, dest: Path, kind: str, max_bytes: int) -> int:
    """Encode, lowering quality until the file fits the budget."""
    if kind == "avif":
        ladder = (50, 42, 36, 30, 26, 22, 18, 14)
        save = lambda q: frame.save(dest, "AVIF", quality=q)
    elif kind == "webp":
        ladder = (74, 66, 58, 50, 44, 38, 32, 26)
        save = lambda q: frame.save(dest, "WEBP", quality=q, method=4)
    else:
        ladder = (76, 68, 60, 52, 46, 40, 34, 28)
        save = lambda q: frame.save(dest, "JPEG", quality=q, optimize=True, progressive=True)
    last = 0
    for quality in ladder:
        save(quality)
        last = dest.stat().st_size
        if last <= max_bytes:
            return last
    return last


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("basename", type=Path, help="output path without width or extension")
    parser.add_argument("--widths", default="480,960,1600")
    parser.add_argument("--max-kb", type=int, default=200)
    args = parser.parse_args()

    im = Image.open(args.source)
    im = im.convert("RGB")
    width, height = im.size
    tone = dominant(im)
    requested = [int(part) for part in args.widths.split(",") if part.strip()]
    targets = sorted({size for size in requested if size <= width} or {width})
    if width not in targets and width <= max(requested, default=width):
        targets.append(width)
        targets = sorted(set(targets))
    args.basename.parent.mkdir(parents=True, exist_ok=True)
    max_bytes = args.max_kb * 1024
    files = []
    for target in targets:
        scaled_h = max(1, round(height * (target / width)))
        frame = im if target == width else im.resize((target, scaled_h), Image.Resampling.LANCZOS)
        for kind in ("avif", "webp", "jpg"):
            dest = Path(f"{args.basename}-{target}.{kind}")
            size = save_under(frame, dest, kind, max_bytes)
            files.append({"file": dest.as_posix(), "width": frame.size[0], "height": frame.size[1], "bytes": size, "kind": kind})
            if size > max_bytes:
                print(f"OVER BUDGET {dest} {size}", file=sys.stderr)
    payload = {
        "source_width": width,
        "source_height": height,
        "tone": tone,
        "max_kb": args.max_kb,
        "files": files,
    }
    print(json.dumps(payload))


if __name__ == "__main__":
    main()
