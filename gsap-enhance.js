/* GSAP layer: clean entrance reveals, stats counter & rotating search prompt */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.to(".hero h1 .row > span", { y: 0, duration: 0.85, ease: "expo.out", stagger: 0.06, delay: 0.05 });
  gsap.from(".hero-meta", { y: 14, opacity: 0, duration: 0.65, ease: "power3.out", delay: 0.1 });

  document.querySelectorAll(".phero h1").forEach(function (h) {
    gsap.from(h, { y: 28, opacity: 0, duration: 0.7, ease: "expo.out", delay: 0.05 });
  });

  /* section headings draw in (one-shot) */
  document.querySelectorAll("h2.display").forEach(function (h) {
    gsap.from(h, {
      y: 26, opacity: 0, duration: 0.75, ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 92%", once: true }
    });
  });

  /* Animated Stats Counter */
  document.querySelectorAll(".stat .num span[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(obj.val);
          }
        });
      }
    });
  });

  /* Rotating Search Placeholder */
  var searchInput = document.querySelector(".searchbar input[name='q']");
  if (searchInput) {
    var placeholders = [
      "Search books, journals, the site...",
      "Search UNILAG OPAC catalogue by title or author...",
      "Search UNILAG Institutional Repository (DSpace)...",
      "Search 15+ subscribed databases & iGLibrary eBooks...",
      "Find Scopus & AJOL accredited journals...",
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

      var speed = isDeleting ? 28 : 55;
      if (!isDeleting && charIdx === fullTxt.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        pIdx = (pIdx + 1) % placeholders.length;
        speed = 380;
      }
      setTimeout(typeLoop, speed);
    }
    setTimeout(typeLoop, 1800);
  }
})();
