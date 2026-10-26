#!/usr/bin/env python3
"""Inline css/fonts.css and css/styles.css into every HTML page.

The stylesheets stay in css/ so they are easy to edit. After a change, run:

    python3 scripts/inline_css.py

Inlining keeps the first paint from waiting on a stylesheet request.
Font URLs in css/fonts.css are root-absolute so they work from any page.
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
START = "<!-- site-css:start -->"
END = "<!-- site-css:end -->"


def block() -> str:
    css = (ROOT / "css" / "fonts.css").read_text() + "\n" + (ROOT / "css" / "styles.css").read_text()
    css = css.replace("</", "<\\/")
    return f"{START}\n<style>\n{css}</style>\n{END}"


def main() -> None:
    fresh = block()
    for path in sorted(ROOT.rglob("*.html")):
        text = path.read_text()
        if START in text and END in text:
            pre, rest = text.split(START, 1)
            _, post = rest.split(END, 1)
            path.write_text(pre + fresh + post)
        else:
            old = '  <link rel="stylesheet" href="/css/fonts.css">\n  <link rel="stylesheet" href="/css/styles.css">\n'
            if old not in text:
                raise SystemExit(f"no stylesheet links in {path}")
            path.write_text(text.replace(old, fresh + "\n", 1))
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
