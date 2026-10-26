# Januki De Silva — fashion portfolio

A portfolio for Januki De Silva, a third-year Fashion Design undergraduate. It is static HTML, CSS and a small script, served from the root of this repository on GitHub Pages:

https://januki-desilva.github.io/

Asset paths start with `/`, so the site is served from the domain root. `.nojekyll` is in the root so Pages will not run Jekyll.

## View it locally

From the repository root:

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/

## Swap a photograph

Optimised files live under `images/`. Do not commit camera originals. The script writes AVIF, WebP and JPEG at the widths you list, never upscales, and keeps each file inside the kilobyte cap.

```bash
python3 scripts/optimize_images.py photo.jpg images/parasomnia/hero --widths 480,960,1365 --max-kb 150
```

Gallery images use `--max-kb 200`. Hero images, including each project hero, use `--max-kb 150`.

Then, in the page that shows the photograph:

1. Point every `src` and `srcset` at the new files. Widths in `srcset` must be the real pixel widths.
2. Set `width` and `height` to the largest file’s pixel size so the layout does not jump.
3. Set `alt` to what is actually in the frame.
4. Set the `--tone` colour on the figure to the dominant colour printed by the script. That colour is the placeholder before the file arrives.
5. If the picture is a hero, change the `<link rel="preload">` in that page’s head to the same AVIF `srcset`.

`data-full` on a lightbox button should be the largest `.webp`. The lightbox derives the AVIF and JPEG names from it.

`janukiphoto.png` is not part of any project. Do not use it yet.

## Add a project

1. Copy `parasomnia/index.html` to a new folder, for example `new-project/index.html`.
2. Give the page its own `<title>`, description, canonical URL and Open Graph image.
3. Set `data-project` on `<body>` and, if it needs its own colours, add a matching block in `css/styles.css`.
4. Replace the copy and the image slots. Keep the order Overview, Concept, Research, Design development, Final collection, then a “Next project” link. Leave out any section the work does not actually have.
5. Add a card in the selected-work grid on `index.html`. One link is enough: the whole card goes to the project page.
6. Point the previous project’s “Next project” link at the new page, and point the new page onward.
7. Add the URL to `sitemap.xml`.

Research boards are full-page collages. Keep them as one zoomable image inside a lightbox button, not sliced into tiles.

## Portfolio PDF

`portfolio/Januki-De-Silva-Portfolio.pdf` is the redacted 34-page portfolio offered for download. Leave that file in place. Do not render or upload the cover, the introduction spread, or the closing thank-you spread from an unredacted export: those spreads carry personal contact details that must not be published.

The pages inline `css/fonts.css` and `css/styles.css` so the first paint does not wait on a stylesheet. After editing either file, refresh the pages:

```bash
python3 scripts/inline_css.py
```

## Publish

GitHub Pages should use the `main` branch and the `/` root.
