(function () {
  "use strict";

  /* ───────── Mobile nav toggle ───────── */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close the menu after tapping a link (mobile).
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ───────── Screenshot lightbox ───────── */
  var shots = Array.prototype.slice.call(
    document.querySelectorAll("#shots .shot img")
  );
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var btnClose = document.getElementById("lightboxClose");
  var btnPrev = document.getElementById("lightboxPrev");
  var btnNext = document.getElementById("lightboxNext");
  var current = 0;

  function show(index) {
    if (!shots.length) return;
    current = (index + shots.length) % shots.length;
    var img = shots[current];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  }

  function open(index) {
    show(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  shots.forEach(function (img, i) {
    img.addEventListener("click", function () {
      open(i);
    });
  });

  if (btnClose) btnClose.addEventListener("click", close);
  if (btnPrev) btnPrev.addEventListener("click", function () { show(current - 1); });
  if (btnNext) btnNext.addEventListener("click", function () { show(current + 1); });

  if (lightbox) {
    // Click on the dark backdrop (not the image/buttons) closes.
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  /* ───────── Footer year (keeps copyright current) ───────── */
  // Static "© 2026" is fine for launch; this keeps it fresh without a build step.
  var copy = document.querySelector(".site-footer__copy");
  if (copy) {
    var year = new Date().getFullYear();
    if (year > 2026) {
      copy.textContent = "© 2026–" + year + " Mourad Ghafiri. All rights reserved.";
    }
  }
})();
