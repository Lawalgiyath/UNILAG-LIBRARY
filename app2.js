/* ============================================================
   UNILAG LIBRARY · layer 2
   live hours · search tabs to real OPAC + repository ·
   reading streak · shelf order game · flip cards
   ============================================================ */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- opening hours status (WAT, UTC+1) ---------------- */
  function nowWAT() {
    var d = new Date();
    return new Date(d.getTime() + (d.getTimezoneOffset() + 60) * 60000);
  }
  function hoursState() {
    var w = nowWAT();
    var day = w.getDay();          /* 0 Sun .. 6 Sat */
    var h = w.getHours() + w.getMinutes() / 60;
    var openDay = day >= 1 && day <= 6;   /* Mon to Sat */
    if (openDay && h >= 8 && h < 21) {
      return { open: true, text: "Open now \u00b7 closes 9:00 p.m." };
    }
    if (openDay && h < 8) {
      return { open: false, text: "Closed \u00b7 opens 8:00 a.m." };
    }
    if (day === 0) {
      return { open: false, text: "Sunday \u00b7 opens Monday 8:00 a.m." };
    }
    return { open: false, text: "Closed \u00b7 opens 8:00 a.m." };
  }
  $$("[data-status]").forEach(function (el) {
    var s = hoursState();
    el.className = "status " + (s.open ? "open" : "closed") + (el.className.indexOf("hero-hours") > -1 ? "" : "");
    el.innerHTML = '<span class="d"></span>' + s.text;
  });

  /* ---------------- search tabs ---------------- */
  var stabs = $$(".stabs button");
  if (stabs.length) {
    stabs.forEach(function (b) {
      b.addEventListener("click", function () {
        stabs.forEach(function (o) { o.classList.remove("on"); o.setAttribute("aria-selected", "false"); });
        b.classList.add("on"); b.setAttribute("aria-selected", "true");
        $$(".spane").forEach(function (p) { p.classList.remove("on"); });
        var t = $("#" + b.getAttribute("data-pane"));
        if (t) t.classList.add("on");
      });
    });
  }

  /* ---------------- result tiles pulled from the live repository ----------------
     The DSpace /server/api endpoint on ir.unilag.edu.ng answers 404 and neither
     host sends CORS headers, so a static page cannot read results directly.
     We submit to the real search URL instead, in a new tab. No invented results. */

  /* ---------------- reading streak ---------------- */
  var streakEl = $("#streak");
  if (streakEl) {
    var KEY = "unilag-reading-streak";
    var store = { days: [] };
    try { store = JSON.parse(localStorage.getItem(KEY) || '{"days":[]}'); } catch (e) { store = { days: [] }; }
    if (!store.days) store.days = [];
    function ymd(d) { return d.toISOString().slice(0, 10); }
    function render() {
      var today = ymd(nowWAT());
      var days = store.days.slice(-7);
      var num = $("#streakNum"), daysBox = $("#streakDays"), btn = $("#streakBtn");
      var run = 0;
      var sorted = store.days.slice().sort();
      for (var i = sorted.length - 1; i >= 0; i--) {
        var expect = ymd(new Date(nowWAT().getTime() - run * 86400000));
        if (sorted[i] === expect) run++; else break;
      }
      if (num) num.textContent = run;
      if (daysBox) {
        var out = "";
        for (var k = 6; k >= 0; k--) {
          var d = new Date(nowWAT().getTime() - k * 86400000);
          var key = ymd(d);
          var cls = store.days.indexOf(key) > -1 ? "done" : (key === today ? "today" : "");
          out += '<i class="' + cls + '">' + ["S", "M", "T", "W", "T", "F", "S"][d.getDay()] + "</i>";
        }
        daysBox.innerHTML = out;
      }
      if (btn) {
        if (store.days.indexOf(today) > -1) {
          btn.classList.add("checked");
          btn.innerHTML = '<svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg> Checked in today';
        } else {
          btn.classList.remove("checked");
          btn.innerHTML = '<svg class="ico ico-sm" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Check in today';
        }
      }
    }
    var b2 = $("#streakBtn");
    if (b2) b2.addEventListener("click", function () {
      var today = ymd(nowWAT());
      if (store.days.indexOf(today) === -1) {
        store.days.push(today);
        store.days = store.days.slice(-90);
        try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
      }
      render();
    });
    render();
  }

  /* ---------------- shelf order game ---------------- */
  var game = $("#game");
  if (game) {
    var ANSWER = ["DT515.9.L3 A37 2001", "KTA68 .O35 2019", "PR9387.9.A23 T55 1966", "QA76.73.J38 S34 2020"];
    var pool = ANSWER.slice();
    function shuffle(a) {
      var b = a.slice();
      for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
      return b;
    }
    var state = { pool: shuffle(ANSWER), shelf: [] };
    function paint() {
      var p = $("#gPool"), s = $("#gShelf");
      if (p) p.innerHTML = state.pool.map(function (c) {
        return '<button class="g-chip" data-c="' + c + '">' + c + "</button>";
      }).join("") || '<span class="mono" style="color:var(--ink-50);padding:12px 0">All four placed</span>';
      if (s) s.innerHTML = state.shelf.map(function (c, i) {
        return '<button class="g-chip placed" data-r="' + c + '"><span class="g-n">' + (i + 1) + "</span>" + c + "</button>";
      }).join("") || '<span class="mono" style="color:var(--ink-50);padding:12px 0">Click a call number to place it here, left to right</span>';
      var msg = $("#gMsg");
      if (msg) {
        if (state.shelf.length === ANSWER.length) {
          var ok = state.shelf.join("|") === ANSWER.join("|");
          msg.className = "g-msg " + (ok ? "ok" : "no");
          msg.textContent = ok ? "Correct. The shelf runs left to right in call number order." : "Not yet. Read the class letters first, then the numbers.";
        } else { msg.className = "g-msg"; msg.textContent = ""; }
      }
    }
    game.addEventListener("click", function (e) {
      var pick = e.target.closest("[data-c]");
      if (pick) {
        var c = pick.getAttribute("data-c");
        state.pool = state.pool.filter(function (x) { return x !== c; });
        state.shelf.push(c);
        paint();
        return;
      }
      var back = e.target.closest("[data-r]");
      if (back) {
        var r = back.getAttribute("data-r");
        state.shelf = state.shelf.filter(function (x) { return x !== r; });
        state.pool.push(r);
        paint();
        return;
      }
      if (e.target.closest("#gReset")) { state = { pool: shuffle(ANSWER), shelf: [] }; paint(); }
      if (e.target.closest("#gHint")) {
        var m = $("#gMsg");
        if (m) { m.className = "g-msg"; m.textContent = "Class letters come first. DT before KTA before PR before QA."; }
      }
    });
    paint();
  }

  /* ---------------- flip cards: click for keyboard and touch ---------------- */
  $$(".flip").forEach(function (f) {
    f.setAttribute("tabindex", "0");
    f.addEventListener("click", function () { f.classList.toggle("on"); });
    f.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f.classList.toggle("on"); }
    });
  });

  /* ---------------- database marquee: duplicate for seamless loop ---------------- */
  $$(".dm-track").forEach(function (t) { t.innerHTML = t.innerHTML + t.innerHTML; });

  /* ---------------- hero bg parallax ---------------- */
  var hb = $(".hero-bg");
  if (hb && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < 1200) hb.style.transform = "translate3d(0," + (y * 0.16).toFixed(1) + "px,0)";
        ticking = false;
      });
    }, { passive: true });
  }
})();
