/* GSAP layer: smooth scroll, pinned reveals, image parallax, magnetic nav */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on("scroll", ST.update);
  }

  gsap.to(".hero h1 .row > span", { y: 0, duration: 1.3, ease: "expo.out", stagger: 0.12, delay: 0.95 });
  gsap.from(".hero-meta", { y: 16, opacity: 0, duration: 1, ease: "power3.out", delay: 0.9 });

  document.querySelectorAll(".phero h1").forEach(function (h) {
    gsap.from(h, { y: 40, opacity: 0, duration: 1.1, ease: "expo.out", delay: 0.85 });
  });

  /* image scale-on-scroll inside arch frames */
  document.querySelectorAll(".arch img, .frame img").forEach(function (img) {
    gsap.fromTo(img, { scale: 1.16 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 0.6 }
    });
  });

  /* subtle section drift */
  document.querySelectorAll("[data-parallax]").forEach(function (el) {
    var sp = parseFloat(el.getAttribute("data-parallax")) || -0.05;
    gsap.to(el, {
      y: function () { return window.innerHeight * sp * -0.55; },
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 }
    });
  });

  /* staggered grid reveals handled by gsap when present */
  document.querySelectorAll(".stagger").forEach(function (g) {
    gsap.from(g.children, {
      y: 26, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.07,
      scrollTrigger: { trigger: g, start: "top 88%" }
    });
  });

  /* section headings draw in */
  document.querySelectorAll("h2.display").forEach(function (h) {
    gsap.from(h, {
      y: 34, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 92%" }
    });
  });

  /* marquee speed reacts to scroll */
  var tracks = document.querySelectorAll(".ticker-track");
  if (tracks.length) {
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) {
        var v = self.getVelocity() / 3000;
        tracks.forEach(function (t) {
          t.style.animationDuration = Math.max(12, 42 - Math.abs(v) * 8) + "s";
        });
      }
    });
  }

  /* ---------------- Interactive Magnetic Elements ---------------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn, .icon-btn, .n-more, .rail-nav button, .live-pill").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.28,
          y: y * 0.28,
          rotation: x * 0.04,
          duration: 0.35,
          ease: "power2.out"
        });
      });
      btn.addEventListener("mouseleave", function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)"
        });
      });
    });

    /* 3D Tilt on Cards */
    document.querySelectorAll(".n-card, .book-card, .arch-card, .fac-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: x * 7,
          rotationX: -y * 7,
          transformPerspective: 900,
          duration: 0.4,
          ease: "power2.out"
        });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.7,
          ease: "power3.out"
        });
      });
    });
  }

  /* ---------------- Animated Stats Counter ---------------- */
  document.querySelectorAll(".stat .num span[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(obj.val);
          }
        });
      }
    });
  });

  /* ---------------- Rotating Search Placeholder ---------------- */
  var searchInput = document.querySelector(".searchbar input[name='q']");
  if (searchInput) {
    var placeholders = [
      "Search books, journals, the site...",
      "Search UNILAG OPAC catalogue by title, author, or class number...",
      "Search UNILAG Institutional Repository (DSpace 7)...",
      "Search 15+ subscribed databases & e-journals...",
      "Find Scopus & Web of Science accredited journals...",
      "Explore 19 Faculty & College libraries..."
    ];
    var pIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var currentPlaceholder = "";

    function typeLoop() {
      if (document.activeElement === searchInput) {
        setTimeout(typeLoop, 1500);
        return;
      }
      var fullTxt = placeholders[pIdx];
      if (isDeleting) {
        currentPlaceholder = fullTxt.substring(0, charIdx - 1);
        charIdx--;
      } else {
        currentPlaceholder = fullTxt.substring(0, charIdx + 1);
        charIdx++;
      }
      searchInput.setAttribute("placeholder", currentPlaceholder);

      var speed = isDeleting ? 30 : 60;
      if (!isDeleting && charIdx === fullTxt.length) {
        speed = 2200; // Pause at end of sentence
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        pIdx = (pIdx + 1) % placeholders.length;
        speed = 400; // Pause before next sentence
      }
      setTimeout(typeLoop, speed);
    }
    setTimeout(typeLoop, 2000);
  }
})();
