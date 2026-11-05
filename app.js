/* University of Lagos Library · interaction layer */
(function () {
  "use strict";
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- preloader ---------------- */
  const pre = $("#pre");
  const bar = $("#preBar");
  const num = $("#preNum");
  if (pre) {
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (bar) bar.style.transform = "scaleX(" + p / 100 + ")";
      if (num) num.textContent = String(Math.round(p)).padStart(2, "0");
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          pre.classList.add("done");
          document.body.classList.add("loaded");
          const hero = $(".hero");
          if (hero) hero.classList.add("ready");
          setTimeout(() => pre.remove(), 1300);
        }, 220);
      }
    }, 130);
  }

  /* ---------------- cursor ---------------- */
  const cur = $(".cur"), dot = $(".cur-dot");
  if (cur && dot && window.matchMedia("(hover:hover)").matches) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = "translate3d(" + (mx - 2) + "px," + (my - 2) + "px,0)"; });
    (function loop() {
      cx += (mx - cx) * 0.16; cy += (my - cy) * 0.16;
      cur.style.transform = "translate3d(" + (cx - cur.offsetWidth / 2) + "px," + (cy - cur.offsetHeight / 2) + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", (e) => {
      cur.classList.toggle("is-hot", !!e.target.closest("a,button,.arch-card,.q-item,.n-row"));
    });
  }

  /* ---------------- header + totop ---------------- */
  const head = $("#head"), totop = $("#totop");
  const onScroll = () => {
    const y = window.scrollY;
    if (head) head.classList.toggle("raised", y > 12);
    if (totop) totop.classList.toggle("on", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (totop) totop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------- drawer ---------------- */
  const burger = $("#burger");
  if (burger) burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    document.body.classList.toggle("is-locked", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  /* ---------------- marquee: duplicate ---------------- */
  $$(".ticker-track").forEach((tr) => {
    const html = tr.innerHTML;
    tr.innerHTML = html + html + html + html;
  });

  /* ---------------- reveal ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add("in");
      if (el.classList.contains("stagger") || el.hasAttribute("data-stagger")) {
        $$(":scope > *", el).forEach((c, i) => {
          c.style.setProperty("--i", i);
          c.classList.add("in");
        });
      }
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal], .line-mask, .stagger").forEach((el) => {
    if (el.classList.contains("stagger")) {
      $$(":scope > *", el).forEach((c, i) => {
        c.style.setProperty("--i", i);
      });
    }
    io.observe(el);
  });

  /* ---------------- parallax ---------------- */
  const pxEls = $$("[data-parallax]");
  if (pxEls.length) {
    let raf = null;
    const run = () => {
      const vh = window.innerHeight;
      pxEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const sp = parseFloat(el.getAttribute("data-parallax")) || 0.12;
        const mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = "translate3d(0," + (-mid * sp).toFixed(2) + "px,0)";
      });
      raf = null;
    };
    const onPx = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", onPx, { passive: true });
    window.addEventListener("resize", onPx);
    run();
  }

  /* ---------------- counters ---------------- */
  const cio = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseFloat(el.getAttribute("data-count"));
      const dec = (el.getAttribute("data-dec") || "0") | 0;
      const dur = 1500; const t0 = performance.now();
      const step = (t) => {
        const k = clamp((t - t0) / dur, 0, 1);
        const e2 = 1 - Math.pow(1 - k, 3);
        el.textContent = (target * e2).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* ---------------- accordion ---------------- */
  $$(".acc-item").forEach((item) => {
    const btn = $(".acc-btn", item), panel = $(".acc-panel", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$(".acc-item").forEach((o) => {
        o.classList.remove("open");
        const p = $(".acc-panel", o); if (p) p.style.height = "0px";
      });
      if (!open) { item.classList.add("open"); panel.style.height = panel.scrollHeight + "px"; }
    });
  });

  /* ---------------- rail / carousel ---------------- */
  $$(".rail-wrap").forEach((wrap) => {
    const rail = $(".rail", wrap);
    if (!rail) return;
    const sec = wrap.closest("section") || wrap.parentElement || document;

    function getStep() {
      const firstCard = $(".book", rail);
      if (!firstCard) return 300;
      const gap = parseFloat(window.getComputedStyle(rail).gap) || 24;
      return (firstCard.offsetWidth + gap) * 1.5;
    }

    $$(".rail-nav button", sec).forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        const dir = b.getAttribute("data-dir") === "prev" ? -1 : 1;
        rail.scrollBy({ left: dir * getStep(), behavior: "smooth" });
      });
    });

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let velX = 0;
    let lastX = 0;
    let hasMoved = false;

    // Prevent native image and link drag
    rail.addEventListener("dragstart", (e) => e.preventDefault());

    rail.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      isDown = true;
      hasMoved = false;
      startX = e.clientX;
      lastX = e.clientX;
      scrollStart = rail.scrollLeft;
      velX = 0;
      rail.classList.add("is-dragging");
      try {
        rail.setPointerCapture(e.pointerId);
      } catch (_) { }
    });

    rail.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) {
        hasMoved = true;
      }
      velX = e.clientX - lastX;
      lastX = e.clientX;
      rail.scrollLeft = scrollStart - dx;
    });

    const endDrag = (e) => {
      if (!isDown) return;
      isDown = false;
      rail.classList.remove("is-dragging");
      if (e && e.pointerId) {
        try {
          rail.releasePointerCapture(e.pointerId);
        } catch (_) { }
      }
      // Momentum coasting after release
      if (Math.abs(velX) > 2) {
        rail.scrollBy({ left: -velX * 7, behavior: "smooth" });
      }
    };

    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);

    // Prevent navigation if dragged
    rail.addEventListener("click", (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    }, true);

    // Trackpad / vertical mousewheel translates into horizontal scroll
    rail.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 5) {
        rail.scrollBy({ left: e.deltaY > 0 ? 180 : -180, behavior: "smooth" });
      }
    }, { passive: true });
  });

  /* ---------------- filters ---------------- */
  $$(".filters").forEach((bar) => {
    const cards = $$("[data-cat]");
    $$("button", bar).forEach((b) => {
      b.addEventListener("click", () => {
        $$("button", bar).forEach((o) => o.classList.remove("on"));
        b.classList.add("on");
        const f = b.getAttribute("data-filter");
        cards.forEach((c) => {
          const show = f === "all" || c.getAttribute("data-cat") === f;
          c.style.display = show ? "" : "none";
          if (show) { c.classList.remove("in"); void c.offsetWidth; c.classList.add("in"); }
        });
      });
    });
  });

  /* ---------------- magnetic buttons ---------------- */
  if (!reduced) $$(".btn").forEach((b) => {
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      b.style.transform = "translate(" + (x * 5).toFixed(2) + "px," + (y * 4).toFixed(2) + "px)";
    });
    b.addEventListener("mouseleave", () => { b.style.transform = ""; });
  });

  /* ---------------- page transition ---------------- */
  const pt = $("#pt");
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
    if (a.target === "_blank" || e.metaKey || e.ctrlKey) return;
    if (!pt) return;
    e.preventDefault();
    pt.classList.add("run");
    setTimeout(() => { window.location.href = href; }, 430);
  });

  /* ---------------- search ---------------- */
  const INDEX = [
    { t: "Home", k: "Page", u: "index.html", d: "The University of Lagos Library, Akoka. Explore our library." },
    { t: "About the Library", k: "Page", u: "about.html", d: "Welcome from the University Librarian, vision and mission." },
    { t: "Vision and Mission", k: "Page", u: "about.html#vision", d: "Primary and foremost source of reliable information for the University community." },
    { t: "Departments and Units", k: "Page", u: "departments.html", d: "Readers Services, Technical Services, Research and Bibliographic, Automation." },
    { t: "Our Services", k: "Page", u: "services.html", d: "Loan request, reference, document delivery, disability support, bindery." },
    { t: "Circulation", k: "Service", u: "services.html#circulation", d: "Borrowing, returns, renewals and recalls at the Circulation Desk." },
    { t: "Loan Request", k: "Service", u: "services.html#loan", d: "Long term loan, short term loan and interlibrary loan." },
    { t: "Reference Service", k: "Service", u: "services.html#reference", d: "Chat-a-Librarian, email and Zoom virtual meetings." },
    { t: "Scan and Deliver", k: "Service", u: "services.html#document", d: "Digitised chapters and articles by email within five working days." },
    { t: "Reprographic", k: "Service", u: "services.html#repro", d: "Photocopying and printing within the library." },
    { t: "Bindery", k: "Service", u: "services.html#bindery", d: "Binding, repair and restoration of books and print materials." },
    { t: "Support for Users with Disabilities", k: "Service", u: "accessibility.html", d: "Braille conversion, assistive tools, extended loans and ramps." },
    { t: "Libraries", k: "Page", u: "libraries.html", d: "Faculty libraries, liaison librarians and opening hours." },
    { t: "University Librarian", k: "Library", u: "about.html", d: "Prof Olatokunbo Christopher Okiki, University Librarian (CLN)." },
    { t: "Pod seats", k: "Library", u: "index.html", d: "Pod seats at the Main Library, Main Library reading space." },
    { t: "Catalogue OPAC", k: "Search", u: "search.html", d: "Search the live UNILAG Online Public Access Catalogue." },
    { t: "Repository search", k: "Search", u: "search.html", d: "Search the institutional repository in DSpace at ir.unilag.edu.ng." },
    { t: "Faculty Libraries", k: "Library", u: "libraries.html", d: "Nineteen faculty libraries across campus with dedicated liaison services." },
    { t: "Faculty of Law Library", k: "Library", u: "libraries.html", d: "Constitutional law, jurisprudence, Nigerian legal system and reports, situated at the basement." },
    { t: "College of Medicine Library", k: "Library", u: "libraries.html", d: "Library card registration point for medical students, Idi Araba." },
    { t: "Archives", k: "Page", u: "archives.html", d: "University Archives and Special Collections, Gandhi Library." },
    { t: "Special Collections", k: "Page", u: "archives.html", d: "Fagunwa, Olabimtan, Sofoluwe, Babalola and other bequeathed collections." },
    { t: "Museum", k: "Page", u: "museum.html", d: "Over 123 artefacts, Akintunde Ojo Building." },
    { t: "Ori Olokun", k: "Artefact", u: "museum.html", d: "Abayomi Barber, plaster of Paris, 1973, 46cm." },
    { t: "Open Educational Resources", k: "Page", u: "oer.html", d: "OER across nineteen faculties." },
    { t: "Where to Publish (Accredited Journals)", k: "Research", u: "journals-accredited.html", d: "Guide for lecturers and researchers to search Scopus, Web of Science, DOAJ, and NUC-accredited journals." },
    { t: "Accredited Journals Finder", k: "Research", u: "journals-accredited.html", d: "Search accredited high-impact peer-reviewed journals, CiteScore metrics, and automated manuscript matchers." },
    { t: "Subscribed Databases", k: "Page", u: "databases.html" , d: "ScienceDirect, iG Publishing, Emerald, Research4life, HeinOnline, JSTOR, ProQuest, ASME, Brill, Springer Nature." },
    { t: "ScienceDirect", k: "Database", u: "databases.html#sciencedirect", d: "More than 15 million scientific articles, over 900,000 open access." },
    { t: "JSTOR", k: "Database", u: "databases.html#jstor", d: "More than 2,000 journals, nearly 20,000 books, two million primary sources." },
    { t: "HeinOnline", k: "Database", u: "databases.html#heinonline", d: "More than 3,300 multidisciplinary periodicals and government documents." },
    { t: "ProQuest Central", k: "Database", u: "databases.html#proquest", d: "Largest multidisciplinary full text database, over 100,000 dissertations." },
    { t: "Emerald Insight", k: "Database", u: "databases.html#emerald", d: "Management, business, education, library studies, health care and engineering." },
    { t: "Research4life", k: "Database", u: "databases.html#research4life", d: "AGORA, HINARI, OARE, GOALI and ARDI. Username and password from the Automation Unit." },
    { t: "Springer Nature", k: "Database", u: "databases.html#springer", d: "Science, technology, medicine, social sciences and humanities." },
    { t: "News and Events", k: "Page", u: "news.html", d: "Notices from the University of Lagos Library." },
    { t: "Library Makerspace", k: "News", u: "news.html", d: "Interactive learning on the first floor of the university library." },
            { t: "Contact", k: "Page", u: "contact.html", d: "P.M.B 1012, Akoka, Lagos. library@unilag.edu.ng. 0906 396 9206." },
    { t: "Opening Hours", k: "Page", u: "contact.html", d: "Monday to Saturday, 8:00 a.m. to 9:00 p.m." },
    { t: "FAQs", k: "Page", u: "help.html#faqs", d: "Access, borrowing limits, loan duration, renewals, fines and charges." },
    { t: "Library Card", k: "Help", u: "help.html#faqs", d: "Obtain a card at the Circulation Desk, Faculty of Education or College of Medicine Library." },
    { t: "Fines and Charges", k: "Help", u: "help.html#faqs", d: "Twenty naira per item per day for students, fifty naira for staff. Pay via Remita." },
    { t: "Research Help", k: "Help", u: "help.html#research", d: "Request a research appointment with a librarian." },
    { t: "Request a Purchase", k: "Help", u: "help.html#purchase", d: "Suggest a book, journal or database for the collection." },
    { t: "Interlibrary Loan", k: "Service", u: "services.html#loan", d: "Borrow a copy of an item from another library, print or electronic." },
    { t: "International Business: Competing in the Global Marketplace", k: "Book", u: "search.html?q=International%20Business", d: "Marketing and international business collection." },
    { t: "Foundations of Modern Physics", k: "Book", u: "search.html?q=Weinberg", d: "Steven Weinberg, Cambridge University Press, 2021, 250 pages." },
    { t: "The Adult Learner", k: "Book", u: "search.html?q=Adult%20Learner", d: "The Definitive Classic in Adult Education and Human Resource Development." },
    { t: "Oil and Gas Processing Equipment", k: "Book", u: "search.html?q=Oil%20and%20Gas", d: "Risk Assessment with Bayesian Networks." },
    { t: "The History of Islam in Africa", k: "Book", u: "search.html?q=Islam%20in%20Africa", d: "Edited by Nehemia Levtzion and Randall L. Pouwels, Ohio University Press, 2000, 604 pages." },
    { t: "Christianity in the Modern World", k: "Book", u: "search.html?q=Christianity", d: "Changes and Controversies." }
,
    { t: "Faculty of Architecture OER", k: "OER", u: "oer-architecture.html", d: "Architectural Design, Environmental Systems & Sustainable Urbanism — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Arts OER", k: "OER", u: "oer-arts.html", d: "Languages, History, Philosophy, Linguistics & Cultural Studies — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Basic Clinical Sciences OER", k: "OER", u: "oer-basic-clinical-sciences.html", d: "Microbiology, Pathology, Pharmacology, Toxicology & Hematology — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Basic Medical Sciences OER", k: "OER", u: "oer-basic-medical-sciences.html", d: "Human Anatomy, Medical Biochemistry & Systems Physiology — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Clinical Sciences OER", k: "OER", u: "oer-clinical-sciences.html", d: "Internal Medicine, Surgery, Paediatrics, Obstetrics & Psychiatry — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Communication & Media Studies OER", k: "OER", u: "oer-communication-media-studies.html", d: "Journalism, Broadcasting, Public Relations, Advertising & Digital Media — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Computing & Informatics OER", k: "OER", u: "oer-computing-informatics.html", d: "Computer Science, Software Engineering, AI, Cybersecurity & Data Science — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Creative Arts OER", k: "OER", u: "oer-creative-arts.html", d: "Theatre Arts, Musicology, Visual Arts, Textile Design & Art History — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Dental Sciences OER", k: "OER", u: "oer-dental-sciences.html", d: "Oral Surgery, Restorative Dentistry, Periodontology & Child Dental Health — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Education OER", k: "OER", u: "oer-education.html", d: "Curriculum Studies, Educational Foundations, Science Education & Human Kinetics — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Engineering OER", k: "OER", u: "oer-engineering.html", d: "Civil, Mechanical, Electrical, Chemical, Petroleum & Systems Engineering — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Environmental Sciences OER", k: "OER", u: "oer-environmental-sciences.html", d: "Building, Estate Management, Quantity Surveying & Urban Planning — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Health Professions OER", k: "OER", u: "oer-health-professions.html", d: "Nursing Science, Physiotherapy, Radiography & Medical Laboratory Science — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Law OER", k: "OER", u: "oer-law.html", d: "Jurisprudence, Commercial Law, Public Law & International Human Rights — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Life Sciences OER", k: "OER", u: "oer-life-sciences.html", d: "Biochemistry, Botany, Cell Biology, Genetics, Marine Sciences, Microbiology & Zoology — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Management Sciences OER", k: "OER", u: "oer-management-sciences.html", d: "Accounting, Actuarial Science, Business Administration, HR & Corporate Finance — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Pharmacy OER", k: "OER", u: "oer-pharmacy.html", d: "Pharmaceutics, Pharmaceutical Chemistry, Pharmacognosy, Pharmacology & Clinical Pharmacy — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Physical & Earth Sciences OER", k: "OER", u: "oer-physical-earth-sciences.html", d: "Chemistry, Geosciences, Mathematics, Physics & Statistics — Open textbooks, courseware, and repositories." },
    { t: "Faculty of Social Sciences OER", k: "OER", u: "oer-social-sciences.html", d: "Economics, Geography, Political Science, Psychology & Sociology — Open textbooks, courseware, and repositories." }
  ];
  window.ULINDEX = INDEX;

  const sov = $("#sov"), sovIn = $("#sovInput"), sovRes = $("#sovRes");
  function renderResults(q, host, limit) {
    const term = q.trim().toLowerCase();
    if (!host) return;
    if (!term) { host.innerHTML = ""; return; }
    const hits = INDEX.filter((it) => (it.t + " " + it.d + " " + it.k).toLowerCase().includes(term)).slice(0, limit || 9);
    if (!hits.length) { host.innerHTML = '<div class="empty" style="color:rgba(246,242,233,.5)">No results for that. Try a shorter word, or ask at the Circulation Desk.</div>'; return; }
    host.innerHTML = hits.map((h) =>
      '<a href="' + h.u + '"><span class="sr-ty">' + h.k + '</span><span><span class="sr-t">' + h.t + '</span><span class="sr-d">' + h.d + '</span></span><span class="mono" style="color:rgba(246,242,233,.4)">&#8599;</span></a>'
    ).join("");
  }
  if (sov) {
    const open = () => { sov.classList.add("open"); document.body.classList.add("is-locked"); setTimeout(() => sovIn && sovIn.focus(), 260); };
    const close = () => { sov.classList.remove("open"); document.body.classList.remove("is-locked"); };
    $$("[data-search-open]").forEach((b) => b.addEventListener("click", open));
    $$("[data-search-close]").forEach((b) => b.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); open(); }
    });
    if (sovIn) sovIn.addEventListener("input", () => renderResults(sovIn.value, sovRes, 9));
  }

  /* ---------------- search page ---------------- */
  const pageRes = $("#pageRes"), pageIn = $("#pageIn"), pageMeta = $("#pageMeta");
  if (pageRes) {
    const params = new URLSearchParams(location.search);
    const q0 = params.get("q") || "";
    if (pageIn) pageIn.value = q0;
    function draw(q) {
      const term = q.trim().toLowerCase();
      if (!term) {
        pageRes.innerHTML = '<div class="empty">Start typing to search ' + INDEX.length + ' indexed pages, services, databases, books and artefacts.</div>';
        if (pageMeta) pageMeta.textContent = INDEX.length + " entries indexed";
        return;
      }
      const hits = INDEX.filter((it) => (it.t + " " + it.d + " " + it.k).toLowerCase().includes(term));
      if (pageMeta) pageMeta.textContent = hits.length + (hits.length === 1 ? " result" : " results") + " for \u201c" + q.trim() + "\u201d";
      pageRes.innerHTML = hits.length ? hits.map((h) =>
        '<a class="res-item" href="' + h.u + '"><span class="r-ty">' + h.k + '</span><span><h3>' + h.t + '</h3><p>' + h.d + '</p></span></a>'
      ).join("") : '<div class="empty">Nothing matched that. Try catalogue, databases, archives, fines, card, loan.</div>';
    }
    window.drawSiteSearch = draw;
    draw(q0);
    if (pageIn) {
      pageIn.addEventListener("input", () => draw(pageIn.value));
      pageIn.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); history.replaceState(null, "", "search.html?q=" + encodeURIComponent(pageIn.value)); draw(pageIn.value); }
      });
    }
    $$("[data-sugg]").forEach((b) => b.addEventListener("click", () => {
      if (!pageIn) return;
      pageIn.value = b.getAttribute("data-sugg");
      draw(pageIn.value);
      history.replaceState(null, "", "search.html?q=" + encodeURIComponent(pageIn.value));
    }));
  }

  /* ---------------- forms ---------------- */
  $$("form[data-demo]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = $(".form-ok", f.parentNode) || $(".form-ok", f);
      if (ok) ok.classList.add("on");
      f.reset();
    });
  });

  /* ---------------- year ---------------- */
  const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- deterministic reveal for headless capture ---------------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      $$("[data-reveal], .line-mask, .stagger").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.2) el.classList.add("in");
      });
    }, 900);
  });
})();
