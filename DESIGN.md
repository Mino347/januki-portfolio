# Design notes

Editorial portfolio for Januki De Silva. The work carries the colour. The interface stays on warm paper and near-black ink, with one stitched line that connects the page the way a thread connects a garment.

Reference principles only, from the Tubik fashion-portfolio study: offset project columns, a giant outlined word used as texture, and small two-line captions. The site stays on a light ground so text meets WCAG contrast. Nothing is copied from that shot.

## 1. Rationale

### Concept

Recruiters should see work immediately and reach a project in one click, then a person in a second click. The home page is a single scrolling document: hero, selected work, about, illustration, tech packs, contact. Each of the four projects has its own URL and follows the same process: overview, concept, research, development, final collection, next project. Editorial styling has no research or development boards in the portfolio, so those sections are not invented.

The signature is a hairline dashed stroke, fixed to the left edge from tablet width up. Scroll progress draws it. Reduced motion shows the line already drawn and still.

### Palette

| Role | Hex | Use |
| --- | --- | --- |
| Paper | `#f3eee6` | Page background |
| Paper deep | `#e7e0d6` | Chips, quiet fills |
| Ink | `#1c1714` | Text, buttons, focus |
| Muted | `#4f4944` | Secondary text, 7.7:1 on paper |
| Line | `#d4cdc2` | Rules and chip borders |
| Thread | `#b7aa9c` | Decorative stroke only |
| Parasomnia | `#6e2433` | Burgundy accent, 9.3:1 on paper |
| Parasomnia slate | `#3d4750` | Secondary accent |
| Sacred Skin | `#5c4034` | Stone accent for text |
| Cosmic indigo | `#1c2340` | Primary accent, 13.3:1 on paper |
| Cosmic vivid | `#b4233a` | Decorative accent only, not small text |
| Editorial navy | `#1b2a4a` | Primary accent |
| Editorial burgundy | `#7a2432` | Secondary accent, 8.6:1 on paper |

White paper text on ink, burgundy, indigo and navy is above 9:1. Accent colours used for small kickers are the dark values above, checked against `#f3eee6`.

### Type scale

Two families, self-hosted and subset. Cormorant Garamond 600 for headings. Inter 400 for text and labels. The word “meaning” is italicised from that roman, so the first view downloads two font files. Both stylesheets are inlined into each page (`scripts/inline_css.py`) because together they are about 22KB and would otherwise block the first paint.

| Token | Size |
| --- | --- |
| Small / labels | `clamp(0.78rem, 0.74rem + 0.15vw, 0.875rem)` |
| Body | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` |
| Lead | `clamp(1.15rem, 1.02rem + 0.55vw, 1.45rem)` |
| Heading 3 | `clamp(1.4rem, 1.15rem + 1vw, 1.85rem)` |
| Heading 2 | `clamp(2.1rem, 1.4rem + 2.2vw, 3.4rem)` |
| Heading 1 | `clamp(2.7rem, 1.15rem + 6.4vw, 6.25rem)` |

Labels are uppercase with `0.14em` tracking. Headings use tight line-height (`0.96`) and a slight negative tracking. Body line-height is `1.6`. `font-display: swap`. One file, Cormorant 600 latin, is preloaded.

### Spacing

A 4px base, expressed as rem: 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4.5, and a fluid section gap `clamp(4.5rem, 8vw, 7rem)`. Text measure is `38rem`. Content column is `min(72rem, 100% - 2rem)`, widening to `76rem` at 1200px. Image sections use a wider column, `min(86rem, …)`, then `92rem`.

## 2. Wireframes

### Desktop, about 1280–1440px

```
[ logo                          Work  About  Illustration  Tech packs  Contact ]
|  thread
|  [ name, role, one line, View work ]     [ tall Parasomnia photograph ]
|
|  WORK (outlined, behind)
|  [ Parasomnia card, tall ]  [ Sacred Skin ]
|                             [ Cosmic Heirloom ]
|  [ Editorial Styling, full width of the grid ]
|
|  [ portrait ]  [ three short paragraphs, practice chips, tool chips, PDF ]
|  [ illustration gallery, three columns, lightbox ]
|  [ two tech-pack boards ]
|  Fashion, for me, begins with meaning.
|  [ email, LinkedIn, Behance ]   [ name, email, message form ]
|  footer links, including Illustration Instagram
```

The header is fixed, hides on scroll down, returns on scroll up, and stays put while it contains focus. Project cards scale the image and reveal “View project”. A fine pointer also gets a small preview that follows the cursor. It is not shown for touch or reduced motion.

A project page replaces the home sections with the process column: title and hero, then concept, a full-width research board, development, the lookbook (horizontal snap, previous/next, arrow keys), and a large next-project link. Parasomnia keeps a sustainability block and a film slot that stays hidden until a source is added.

### Mobile, 320–390px

```
[ Januki De Silva            Menu ]
[ photograph, full width ]
Fashion Design Undergraduate
Januki
De Silva
Every collection starts from a story or a feeling.
[ View work ]

01 — Selected work
[ stacked cards, image then two-line caption ]

02 — About
[ portrait ]
[ copy, chips, PDF ]

03 — Illustration
[ single column, then two columns from 720px ]

04 — Tech packs
05 — Contact headline, link list, form
```

The menu opens under the header. The thread is hidden so it does not steal width. The lookbook is a sideways scroller with Previous look / Next look underneath, each at least 44px tall. Nothing on the page scrolls sideways except that strip.

## 4. Requirement checklist

| Requirement | Where it is met |
| --- | --- |
| Plain HTML, CSS, vanilla JS, GitHub Pages, free fonts | Root files, `css/fonts.css`, no framework |
| No personal contact number, no street, no unredacted cover or thank-you renders | Copy, images, JSON-LD; redacted PDF kept for download |
| Fifth project removed, no placeholder slot | Not in the nav, the grid, or the script |
| No invented awards, clients or quotes | Copy trimmed from the brief and the portfolio text |
| Illustration Instagram kept as a small secondary link | Footer and the illustration section, labelled “Illustration Instagram” |
| Film slot, click-to-load, hidden while `data-video-src` is empty | `parasomnia/index.html`, `js/video.js` loaded only when a source is set |
| `janukiphoto.png` unused, with a note | Comments in `index.html`, `parasomnia/index.html`, and this file’s sibling README |
| Home: hero, selected work, about, illustration, tech packs, contact | `index.html` |
| Hero: name, role, one line, one image, “View work” | Hero section, Parasomnia backlight photograph |
| Project index with large cards, title, one-line concept, tag | `.work-grid` |
| About: bio, photo, chips, PDF | `#about` |
| Contact headline is “Fashion, for me, begins with meaning.” | `#contact` |
| Email, LinkedIn, Behance | Contact list, footer, and the form which opens a mailto |
| One page per project, clean URLs | `/parasomnia/`, `/sacred-skin/`, `/cosmic-heirloom/`, `/editorial-styling/` |
| Process sections and next project | Each project page |
| Parasomnia hero is also the site hero; Sacred Skin hero is the fringed hat; Cosmic hero is the back view | Image slots named in those pages |
| Research boards are full-width and open in the lightbox | Project research sections |
| Neutral base, per-project accent | `data-project` tokens in `css/styles.css` |
| Serif + sans, two families, `clamp`, `font-display: swap`, one preload | `css/fonts.css` and the head of each page |
| Stitched thread, scroll-drawn, off when motion is reduced | `.thread`, `js/main.js` |
| Reveals, 200–500ms, ease-out, transform and opacity only | `[data-reveal]` |
| Card hover scale and caption reveal | `.work-card` |
| Cursor-following preview on the project list, desktop only | `.cursor-preview` |
| Lookbook: snap, touch, keyboard | `.lookbook`, arrow keys, previous/next buttons |
| Lightbox: Esc, arrows, swipe, focus trap, captions | `js/lightbox.js`, native `<dialog>` |
| View Transitions where supported, no effect when motion is reduced | `@view-transition` inside `prefers-reduced-motion: no-preference` |
| Sticky header, hide on scroll down, active section, scroll-margin | `.site-header`, `data-nav` |
| No preloader, no autoplay audio, no scroll hijacking | — |
| Work within the first scroll, one click to a project, back to top, next project | Hero height, card links, footer and `.to-top` |
| 320 to 1920, 44px targets, no page-level horizontal scroll | Fluid columns, tested at those widths |
| Visible focus, skip link, landmarks, heading order, alt text, form labels and errors | Shared header, main, footer, contact form |
| Meaningful 404 | `404.html` |
| AVIF, WebP, JPEG, srcset, width/height, dominant-colour placeholder | `<picture>` and `--tone` |
| Hero ≤ 150KB, gallery ≤ 200KB, lazy below the fold, `fetchpriority` only on the hero | `scripts/optimize_images.py` |
| LCP image preloaded, critical font preloaded, JS deferred as a module, lightbox and film loaded on demand | Document heads, `js/main.js` |
| Unique titles and descriptions, Open Graph image per page, favicon, Person data, sitemap, robots | Head of each page, `images/og/`, `sitemap.xml`, `robots.txt` |
| `.nojekyll` kept | Repository root |
| Commented image slots and an edit guide | HTML comments, README |
