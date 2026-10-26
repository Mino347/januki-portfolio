/* Click-to-load film. Imported only when .video-slot[data-video-src] is non-empty.
   There is no autoplay. */

export function mount(slot) {
  const src = slot.getAttribute("data-video-src");
  if (!src) return;
  slot.hidden = false;
  const button = slot.querySelector("[data-video-button]");
  if (!button) return;
  const poster = slot.getAttribute("data-video-poster");
  if (poster) {
    const img = document.createElement("img");
    img.src = poster;
    img.alt = "";
    button.prepend(img);
  }
  button.addEventListener("click", () => {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.src = src;
    if (poster) video.poster = poster;
    const title = slot.getAttribute("data-video-title") || "Project film";
    video.setAttribute("aria-label", title);
    button.replaceWith(video);
    video.play().catch(() => {
      /* The controls stay available if playback is blocked. */
    });
  });
}
