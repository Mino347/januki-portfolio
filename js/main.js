/* Site behaviour. Lightbox and the film player load only when needed.
   janukiphoto.png is not part of any project. Do not use it yet. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");

function setNavOpen(open) {
  if (!nav || !navToggle) return;
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.textContent = open ? "Close" : "Menu";
  header?.classList.toggle("nav-open", open);
}

navToggle?.addEventListener("click", () => {
  setNavOpen(!nav.classList.contains("is-open"));
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setNavOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("is-open")) {
    setNavOpen(false);
    navToggle?.focus();
  }
});

/* Header hides while scrolling down and returns on the way up. */
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  if (header && !header.classList.contains("nav-open")) {
    const goingDown = y > lastY && y > 120;
    header.classList.toggle("is-hidden", goingDown);
  }
  lastY = y;
  document.querySelector(".to-top")?.classList.toggle("is-on", y > 700);
  if (!reduceMotion) drawThread();
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
}, { passive: true });

function drawThread() {
  const path = document.querySelector(".thread path");
  if (!path) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? window.scrollY / max : 1;
  path.style.strokeDashoffset = String(1 - progress);
}

if (reduceMotion) {
  const path = document.querySelector(".thread path");
  if (path) path.style.strokeDashoffset = "0";
} else {
  drawThread();
}

/* Active section in the header (home) and the in-page project nav. */
const navLinks = [...document.querySelectorAll("a[data-nav]")];
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const seen = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      seen.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });
    let current = "";
    let best = 0;
    seen.forEach((ratio, id) => {
      if (ratio > best) {
        best = ratio;
        current = id;
      }
    });
    navLinks.forEach((link) => {
      if (link.dataset.nav === current) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.75] });
  sections.forEach((section) => observer.observe(section));
}

/* Scroll reveals. Content stays visible if JS never runs. */
if (!reduceMotion && "IntersectionObserver" in window) {
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      reveal.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));
} else {
  document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-in"));
}

/* Desktop cursor preview on the project list. */
const preview = document.querySelector(".cursor-preview");
const work = document.querySelector("#work");
if (preview && work && finePointer && !reduceMotion) {
  let previewImg = null;
  let frame = 0;
  let px = 0;
  let py = 0;
  const place = () => {
    frame = 0;
    const rectW = 220;
    const x = Math.min(px + 18, window.innerWidth - rectW - 12);
    const y = Math.min(py + 18, window.innerHeight - 280);
    preview.style.transform = `translate3d(${Math.max(8, x)}px, ${Math.max(8, y)}px, 0)`;
  };
  work.addEventListener("pointermove", (event) => {
    if (!preview.classList.contains("is-on")) return;
    px = event.clientX;
    py = event.clientY;
    if (!frame) frame = requestAnimationFrame(place);
  });
  work.querySelectorAll(".work-card").forEach((card) => {
    card.addEventListener("pointerenter", () => {
      const src = card.dataset.preview;
      if (!src) return;
      if (!previewImg) {
        previewImg = document.createElement("img");
        previewImg.alt = "";
        previewImg.decoding = "async";
        preview.append(previewImg);
      }
      previewImg.src = src;
      preview.classList.add("is-on");
    });
    card.addEventListener("pointerleave", () => preview.classList.remove("is-on"));
  });
}

/* Horizontal lookbook: buttons, and arrow keys while focus is inside. */
document.querySelectorAll(".lookbook").forEach((book) => {
  const track = book.querySelector(".lookbook-track");
  if (!track) return;
  const step = () => {
    const slide = track.querySelector("li");
    return slide ? slide.getBoundingClientRect().width + 16 : track.clientWidth * 0.8;
  };
  const scrollBy = (direction) => {
    track.scrollBy({ left: direction * step(), behavior: reduceMotion ? "auto" : "smooth" });
  };
  book.querySelector("[data-look-prev]")?.addEventListener("click", () => scrollBy(-1));
  book.querySelector("[data-look-next]")?.addEventListener("click", () => scrollBy(1));
  book.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollBy(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollBy(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      track.scrollTo({ left: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } else if (event.key === "End") {
      event.preventDefault();
      track.scrollTo({ left: track.scrollWidth, behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
});

/* Lightbox code is fetched on the first open. */
let lightboxModule = null;
document.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-lightbox-group]");
  if (!button) return;
  event.preventDefault();
  if (!lightboxModule) lightboxModule = await import("/js/lightbox.js");
  lightboxModule.open(button);
});

/* Film slot. An empty data-video-src means the block stays hidden. */
const videoSlot = document.querySelector(".video-slot");
if (videoSlot && videoSlot.getAttribute("data-video-src")) {
  import("/js/video.js").then((mod) => mod.mount(videoSlot));
}

/* Contact form. Valid input opens the visitor's mail app. Nothing is stored. */
const form = document.querySelector("#contact-form");
if (form) {
  const status = document.querySelector("#form-status");
  const fields = [...form.querySelectorAll("input, textarea")];
  fields.forEach((field) => {
    field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      const error = document.getElementById(`${field.id}-error`);
      if (error) error.hidden = true;
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid = null;
    fields.forEach((field) => {
      const error = document.getElementById(`${field.id}-error`);
      if (field.checkValidity()) {
        field.removeAttribute("aria-invalid");
        if (error) error.hidden = true;
        return;
      }
      field.setAttribute("aria-invalid", "true");
      if (error) {
        error.hidden = false;
        error.textContent = field.validity.valueMissing
          ? error.dataset.missing
          : error.dataset.invalid;
      }
      if (!firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      if (status) status.textContent = "Check the highlighted fields.";
      return;
    }
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const body = `${message}\n\n— ${name}\n${email}`;
    const href = `mailto:janukidsilva@gmail.com?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent(body)}`;
    if (status) status.textContent = "Opening your email app with this message ready to send.";
    window.location.href = href;
  });
}
