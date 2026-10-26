/* Keyboard lightbox. Loaded the first time a picture is opened.
   Esc and focus return are handled by the native dialog. */

const dialog = document.querySelector("#lightbox");
const image = document.querySelector("#lightbox-img");
const avif = document.querySelector("#lightbox-avif");
const webp = document.querySelector("#lightbox-webp");
const caption = document.querySelector("#lightbox-caption");
const count = document.querySelector("#lightbox-count");
const prev = document.querySelector("[data-lightbox-prev]");
const next = document.querySelector("[data-lightbox-next]");

let items = [];
let index = 0;
let lastFocus = null;
let touchX = 0;

function withExt(url, ext) {
  return url.replace(/\.(webp|avif|jpe?g)$/i, `.${ext}`);
}

function show(nextIndex) {
  if (!items.length) return;
  index = (nextIndex + items.length) % items.length;
  const item = items[index];
  const full = item.dataset.full;
  if (avif) avif.srcset = withExt(full, "avif");
  if (webp) webp.srcset = full;
  image.src = withExt(full, "jpg");
  const sourceImg = item.querySelector("img");
  image.alt = sourceImg?.alt || item.dataset.caption || "Portfolio image";
  if (sourceImg?.width && sourceImg?.height) {
    image.width = sourceImg.width;
    image.height = sourceImg.height;
  }
  const label = item.dataset.caption || "";
  const position = `Image ${index + 1} of ${items.length}`;
  caption.textContent = label ? `${label}. ${position}` : position;
  count.textContent = `${index + 1} / ${items.length}`;
  const single = items.length < 2;
  prev.hidden = single;
  next.hidden = single;
}

export function open(button) {
  const group = button.dataset.lightboxGroup;
  items = [...document.querySelectorAll(`[data-lightbox-group="${CSS.escape(group)}"]`)];
  index = Math.max(0, items.indexOf(button));
  lastFocus = button;
  show(index);
  if (!dialog.open) dialog.showModal();
  dialog.querySelector("[data-lightbox-close]")?.focus();
}

prev?.addEventListener("click", () => show(index - 1));
next?.addEventListener("click", () => show(index + 1));
dialog?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog?.addEventListener("close", () => {
  image.removeAttribute("src");
  lastFocus?.focus();
});

dialog?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    show(index + 1);
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    show(index - 1);
  }
});

const stage = document.querySelector(".lightbox-stage");
stage?.addEventListener("touchstart", (event) => {
  touchX = event.changedTouches[0].clientX;
}, { passive: true });
stage?.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchX;
  if (Math.abs(delta) < 48) return;
  show(index + (delta < 0 ? 1 : -1));
}, { passive: true });
