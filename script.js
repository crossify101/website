(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ───────── Mobile nav toggle ───────── */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });

    // Close the menu after tapping a link (mobile).
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Tapping anywhere outside the open menu dismisses it.
    document.addEventListener("click", function (e) {
      if (menu.classList.contains("open") && !e.target.closest(".nav")) setMenu(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ───────── Screenshot strip controls ───────── */
  var strip = document.getElementById("shots");
  var stripNav = document.getElementById("shotsNav");
  var stripPrev = document.getElementById("shotsPrev");
  var stripNext = document.getElementById("shotsNext");

  function updateStripNav() {
    var max = strip.scrollWidth - strip.clientWidth;
    stripNav.hidden = max <= 2;
    stripPrev.disabled = strip.scrollLeft <= 2;
    stripNext.disabled = strip.scrollLeft >= max - 2;
  }

  function scrollStrip(dir) {
    strip.scrollBy({
      left: dir * strip.clientWidth * 0.8,
      behavior: reduceMotion.matches ? "auto" : "smooth"
    });
  }

  if (strip && stripNav && stripPrev && stripNext) {
    stripPrev.addEventListener("click", function () { scrollStrip(-1); });
    stripNext.addEventListener("click", function () { scrollStrip(1); });
    strip.addEventListener("scroll", updateStripNav, { passive: true });
    window.addEventListener("resize", updateStripNav);
    updateStripNav();
  }

  /* ───────── Screenshot lightbox ───────── */
  var shots = Array.prototype.slice.call(
    document.querySelectorAll("#shots .shot")
  );
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.createElement("img");
  var caption = document.getElementById("lightboxCaption");
  var btnClose = document.getElementById("lightboxClose");
  var btnPrev = document.getElementById("lightboxPrev");
  var btnNext = document.getElementById("lightboxNext");
  var current = 0;
  var returnFocus = null;

  function show(index) {
    if (!shots.length) return;
    current = (index + shots.length) % shots.length;
    var img = shots[current].querySelector("img");
    var label = shots[current].querySelector("figcaption");
    lightboxImg.src = img.getAttribute("data-full") || img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    caption.textContent = label ? label.textContent : "";
    var count = document.createElement("span");
    count.className = "lightbox__count";
    count.textContent = (current + 1) + " / " + shots.length;
    caption.appendChild(count);
  }

  function open(index) {
    returnFocus = document.activeElement;
    show(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    btnClose.focus();
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    if (returnFocus && returnFocus.focus) returnFocus.focus();
  }

  function isOpen() {
    return lightbox && lightbox.classList.contains("open");
  }

  if (lightbox && shots.length) {
    // The viewer image is created here so the page never ships an <img> without a src.
    lightboxImg.className = "lightbox__img";
    lightboxImg.width = 1284;
    lightboxImg.height = 2778;
    lightboxImg.alt = "";
    lightbox.insertBefore(lightboxImg, lightbox.querySelector(".lightbox__bar"));

    shots.forEach(function (shot, i) {
      shot.querySelector(".shot__open").addEventListener("click", function () {
        open(i);
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { show(current - 1); });
    btnNext.addEventListener("click", function () { show(current + 1); });

    // Click on the dark backdrop (not the image/buttons) closes.
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    // Horizontal swipe on the image steps through screens (touch).
    var startX = null, startY = null;
    lightboxImg.addEventListener("pointerdown", function (e) {
      startX = e.clientX;
      startY = e.clientY;
    });
    lightboxImg.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = startY = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    });

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
      else if (e.key === "Tab") {
        // Keep focus inside the viewer while it is open.
        var stops = [btnClose, btnPrev, btnNext];
        var at = stops.indexOf(document.activeElement);
        var next = e.shiftKey ? at - 1 : at + 1;
        e.preventDefault();
        stops[(next + stops.length) % stops.length].focus();
      }
    });
  }

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
