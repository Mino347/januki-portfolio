#!/usr/bin/env python3
"""Write 480 / 960 / 1600 WebP files for one photo, without upscaling.

Example:
  python3 scripts/make_srcset.py photo.jpg images/deus/cover
Writes images/deus/cover-480.webp and any larger widths the source supports.
"""

import sys
from pathlib import Path

from PIL import Image


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: python3 scripts/make_srcset.py INPUT OUTPUT_BASENAME")
    source = Path(sys.argv[1])
    base = Path(sys.argv[2])
    im = Image.open(source).convert("RGB")
    width, height = im.size
    targets = [size for size in (480, 960, 1600) if size <= width]
    if not targets:
        targets = [width]
    elif width not in targets and width < 1600:
        targets.append(width)
    base.parent.mkdir(parents=True, exist_ok=True)
    for target in sorted(set(targets)):
        scaled_h = max(1, round(height * (target / width)))
        frame = im if target == width else im.resize((target, scaled_h), Image.Resampling.LANCZOS)
        dest = Path(f"{base}-{target}.webp")
        frame.save(dest, "WEBP", quality=76, method=5)
        print(f"{dest} {frame.size[0]}x{frame.size[1]}")


if __name__ == "__main__":
    main()
