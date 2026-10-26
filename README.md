# Januki De Silva — fashion portfolio

A one-page portfolio for Januki De Silva, a third-year Fashion Design undergraduate. It is static HTML, CSS and a small script, meant to be served from the root of this repository on GitHub Pages:

https://mino347.github.io/januki-portfolio/

Paths are relative, so the same files work locally and under the `/januki-portfolio/` project-site base. There is no build step.

## View it locally

From the repository root:

```bash
python3 -m http.server 8765
```

Open http://localhost:8765/

## Add a project

Deus ex Machina is already in `index.html` as the fifth work card, with `data-visible="false"` and the `hidden` attribute, so it does not appear on the site. The Canva contents page spells it “Dues ex machina”; the site title to use is Deus ex Machina.

1. Export photographs as WebP srcsets:

   ```bash
   python3 scripts/make_srcset.py my-photo.jpg images/deus/cover
   ```

   The script writes 480, 960 and 1600 widths when the source is large enough, and never upscales.

2. In `index.html`, find `id="deus-ex-machina"`.
3. Put a cover image inside the card button, using `src`, `srcset`, `sizes`, `width`, `height`, `alt`, and `loading="lazy"`.
4. Fill the concept paragraphs and uncomment or add gallery figures inside `.gallery`. Each figure’s button needs `data-lightbox-group="deus-ex-machina"` and the image needs `data-full` pointing at the largest file.
5. Set `data-visible="true"` and remove `hidden` from that `<article>`.

Copy the markup of Parasomnia if you would rather add a different sixth project. Give the article a new `id`, `data-project`, detail `id`s, and a matching `data-lightbox-group`.

## Swap a photograph

1. Run `scripts/make_srcset.py` with a new basename, or overwrite the existing `images/...-480.webp` set.
2. Update that `<img>`: `src`, `srcset`, `width` and `height` (use the real pixel size so the layout does not jump), `alt`, and `data-full`.
3. Do not upscale a small original into a fake 1600-wide file. If the photo is only 800 pixels wide, stop there and say `800w` in `srcset`.

The hero is preloaded. If you replace it, change the `<link rel="preload">` in the document head to the same `srcset`.

## Portfolio PDF

`portfolio/Januki-De-Silva-Portfolio.pdf` is a compressed copy of the 34-page portfolio. The phone number and home address that sat on the contact strips have been covered and are not in the file’s text. Leave them out of the HTML as well.

## Publish

GitHub Pages should use the `main` branch and the `/` root. `.nojekyll` is in the root so Pages will not try to run Jekyll.
