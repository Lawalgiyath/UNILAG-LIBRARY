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
})();
