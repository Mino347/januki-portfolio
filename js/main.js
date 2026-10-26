(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var navToggle = document.querySelector(".nav-toggle");
  var projectDialog = document.getElementById("project-dialog");
  var projectRoot = document.getElementById("project-dialog-root");
  var projectKicker = document.getElementById("project-dialog-kicker");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxCount = document.getElementById("lightbox-count");
  var lastProjectTrigger = null;
  var lastLightboxTrigger = null;
  var lightboxItems = [];
  var lightboxIndex = 0;
  var openDetail = null;
  var openArticle = null;
  var touchStartX = null;
  var touchStartY = null;

  document.querySelectorAll('[data-visible="false"]').forEach(function (el) {
    el.hidden = true;
  });

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 12);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav && nav.classList.contains("is-open")) {
      closeNav();
      if (navToggle) navToggle.focus();
    }
  });

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      closeNav();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  var sections = ["about", "work", "illustration", "tech-packs", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          document.querySelectorAll(".site-nav a").forEach(function (link) {
            var current = link.getAttribute("href") === "#" + id;
            if (current) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) { spy.observe(section); });
  }

  function closeProject() {
    if (!projectDialog.open) return;
    projectDialog.close();
  }

  function openProject(article, trigger) {
    if (!article || article.getAttribute("data-visible") === "false") return;
    var detail = article.querySelector(".project-detail");
    if (!detail) return;
    if (openDetail && openArticle) {
      openDetail.hidden = true;
      openArticle.appendChild(openDetail);
    }
    openDetail = detail;
    openArticle = article;
    lastProjectTrigger = trigger || article.querySelector(".work-open");
    detail.hidden = false;
    projectRoot.appendChild(detail);
    var title = detail.querySelector("h2");
    var kicker = detail.querySelector(".kicker");
    projectKicker.textContent = kicker ? kicker.textContent : (title ? title.textContent : "Project");
    if (title) projectDialog.setAttribute("aria-labelledby", title.id);
    projectDialog.showModal();
    var closeBtn = projectDialog.querySelector("[data-close-project]");
    if (closeBtn) closeBtn.focus();
  }

  document.querySelectorAll(".work-open").forEach(function (button) {
    button.addEventListener("click", function () {
      openProject(button.closest(".work-card"), button);
    });
  });

  projectDialog.addEventListener("close", function () {
    if (openDetail && openArticle) {
      openDetail.hidden = true;
      openArticle.appendChild(openDetail);
    }
    openDetail = null;
    openArticle = null;
    if (lastProjectTrigger) lastProjectTrigger.focus();
  });

  projectDialog.querySelector("[data-close-project]").addEventListener("click", closeProject);

  function largestFrom(img) {
    if (img.dataset.full) return img.dataset.full;
    if (img.currentSrc) return img.currentSrc;
    return img.src;
  }

  function renderLightbox() {
    var trigger = lightboxItems[lightboxIndex];
    if (!trigger) return;
    var img = trigger.querySelector("img");
    var full = largestFrom(img);
    lightboxImg.src = full;
    lightboxImg.alt = img.alt;
    lightboxImg.setAttribute("width", img.getAttribute("width") || "1600");
    lightboxImg.setAttribute("height", img.getAttribute("height") || "900");
    var caption = trigger.getAttribute("data-caption") || img.alt;
    lightboxCaption.textContent = caption;
    lightboxCount.textContent = (lightboxIndex + 1) + " / " + lightboxItems.length;
  }

  function openLightbox(trigger) {
    var group = trigger.getAttribute("data-lightbox-group");
    lightboxItems = Array.prototype.slice.call(
      document.querySelectorAll('[data-lightbox-group="' + group + '"]')
    );
    lightboxIndex = lightboxItems.indexOf(trigger);
    if (lightboxIndex < 0) lightboxIndex = 0;
    lastLightboxTrigger = trigger;
    renderLightbox();
    lightbox.showModal();
    var closeBtn = lightbox.querySelector("[data-close-lightbox]");
    if (closeBtn) closeBtn.focus();
  }

  function stepLightbox(delta) {
    if (!lightboxItems.length) return;
    lightboxIndex = (lightboxIndex + delta + lightboxItems.length) % lightboxItems.length;
    renderLightbox();
  }

  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-lightbox-group]");
    if (!trigger) return;
    event.preventDefault();
    openLightbox(trigger);
  });

  lightbox.querySelector("[data-close-lightbox]").addEventListener("click", function () {
    lightbox.close();
  });
  lightbox.querySelector("[data-prev]").addEventListener("click", function () {
    stepLightbox(-1);
  });
  lightbox.querySelector("[data-next]").addEventListener("click", function () {
    stepLightbox(1);
  });

  lightbox.addEventListener("close", function () {
    lightboxImg.removeAttribute("src");
    if (lastLightboxTrigger) lastLightboxTrigger.focus();
  });

  lightbox.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    }
  });

  lightbox.addEventListener("touchstart", function (event) {
    if (!event.changedTouches || !event.changedTouches.length) return;
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener("touchend", function (event) {
    if (touchStartX == null || !event.changedTouches || !event.changedTouches.length) return;
    var dx = event.changedTouches[0].clientX - touchStartX;
    var dy = event.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
    stepLightbox(dx < 0 ? 1 : -1);
  }, { passive: true });

  var hash = window.location.hash.replace("#", "");
  if (hash) {
    var fromHash = document.getElementById(hash);
    if (fromHash && fromHash.classList.contains("work-card")) {
      openProject(fromHash);
    }
  }
})();
