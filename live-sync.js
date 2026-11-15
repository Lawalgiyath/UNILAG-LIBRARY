/* ============================================================
   UNILAG LIBRARY · Real-Time OPAC & News Syndication Engine
   Automatically populates "New on the Shelves" from UNILAG OPAC
   and auto-updates the "What Happens in the Library" news section
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------------- 1. DYNAMIC OPAC RECENT BOOKS ---------------- */
  async function loadRecentOpacBooks() {
    const rail = $(".rail");
    if (!rail) return;

    try {
      let resp = await fetch("/api/opac-recent").catch(() => null);
      if (!resp || !resp.ok) {
        resp = await fetch("data/opac_recent_books.json").catch(() => null);
      }
      if (!resp || !resp.ok) return;
      const data = await resp.json();
      const books = data.books || [];
      if (!books.length) return;

      // Update sync indicator
      const pill = $("#opacSyncPill");
      if (pill) {
        pill.innerHTML = `<span class="dot-pulse"></span> Live from OPAC Catalogue &bull; ${books.length} Books Synced`;
        pill.title = `Last synced: ${data.last_updated_display || "Just now"}`;
      }

      // Render book cards dynamically with .in class so they are immediately visible
      rail.innerHTML = books.map((b, idx) => {
        const cover = b.cover || 'assets/covers/bk_algorithms.jpg';
        const searchUrl = b.searchUrl || `search.html?q=${encodeURIComponent(b.title)}`;
        const callNo = b.callNumber ? `<span class="b-call mono">${escapeHtml(b.callNumber)}</span>` : '';
        const tag = b.tag || b.discipline || 'Recent Acquisition';

        return `
          <div class="book-card in" data-reveal>
            <a class="book" href="${searchUrl}" title="View ${escapeHtml(b.title)} in Library Catalogue">
              <div class="arch arch--soft">
                <img src="${cover}" alt="${escapeHtml(b.title)} cover" loading="lazy">
                <span class="book-badge mono">OPAC</span>
              </div>
              <div class="b-meta">
                <h3>${escapeHtml(b.title)}</h3>
                <div class="b-auth">${escapeHtml(b.author)}</div>
                <div class="b-sub-meta">
                  <span class="b-tag">${escapeHtml(tag)}</span>
                  ${callNo}
                </div>
              </div>
            </a>
            <div class="book-actions">
              <a href="${b.opacUrl || '#'}" target="_blank" rel="noopener" class="btn-opac mono">
                <span>View in OPAC</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
              </a>
              <button class="btn-borrow-quick mono" data-borrow-title="${escapeHtml(b.title)}" data-borrow-call="${escapeHtml(b.callNumber || 'LIB-STKS')}">Reserve</button>
            </div>
          </div>
        `;
      }).join("");

      rail.querySelectorAll(".book-card").forEach(el => el.classList.add("in"));

      // Wire quick reserve buttons
      rail.querySelectorAll(".btn-borrow-quick").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const title = btn.getAttribute("data-borrow-title");
          const call = btn.getAttribute("data-borrow-call");
          if (window.openBookReserveModal) {
            window.openBookReserveModal({ title: title, callNo: call, author: 'University Collection' });
          } else {
            window.location.href = `search.html?q=${encodeURIComponent(title)}`;
          }
        });
      });

      // Re-trigger GSAP / intersection observer for newly injected cards
      if (window.gsap && window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }

    } catch (e) {
      console.warn("OPAC live fetch error (serving cached catalogue):", e);
    }
  }

  /* ---------------- 2. DYNAMIC UNILAG LIBRARY NEWS ---------------- */
  async function loadLibraryNews() {
    const newsGrid = $(".news-grid");
    const newsList = $(".n-list");
    if (!newsGrid && !newsList) return;

    try {
      let resp = await fetch("/api/news-sync").catch(() => null);
      if (!resp || !resp.ok) {
        resp = await fetch("data/library_news.json").catch(() => null);
      }
      if (!resp || !resp.ok) return;
      const data = await resp.json();
      const notices = data.notices || [];
      if (!notices.length) return;

      // Update news badge indicator
      const newsBadge = $("#newsSyncBadge");
      if (newsBadge) {
        newsBadge.innerHTML = `<span class="dot-pulse"></span> Live News Feed &bull; Auto-Updated`;
      }

      // If on news.html (has .n-list)
      if (newsList) {
        const nonLead = notices.filter(n => !n.lead);
        newsList.innerHTML = nonLead.map(n => {
          const isExternal = n.link && (n.link.startsWith("http://") || n.link.startsWith("https://"));
          const targetAttr = isExternal ? 'target="_blank" rel="noopener"' : '';
          return `
            <a class="n-row in" href="${n.link}" ${targetAttr} data-reveal>
              <span class="nr-date mono">${escapeHtml(n.displayDate || n.date)}</span>
              <h3>${escapeHtml(n.title)}</h3>
              <span class="nr-cat">${escapeHtml(n.category)}</span>
              <span class="nr-ar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17L17 7M9 7h8v8"/></svg></span>
            </a>
          `;
        }).join("");
        newsList.querySelectorAll(".n-row").forEach(el => el.classList.add("in"));
      }

      // If on index.html (has .news-grid)
      if (newsGrid) {
        // Keep the primary landmark lead card (Multimedia Studio) and side cards intact,
        // and add a live updates ticker or feed banner!
        const liveTicker = $("#newsLiveTicker");
        if (liveTicker) {
          const liveItems = notices.filter(n => n.isLiveFeed);
          if (liveItems.length) {
            liveTicker.innerHTML = `
              <div class="news-ticker-bar mono">
                <span class="ntb-label"><span class="dot-pulse"></span> RECENT UNILAG LIBRARY NOTICES:</span>
                <div class="ntb-scroll">
                  ${liveItems.map(item => `
                    <a href="${item.link}" target="_blank" rel="noopener" class="ntb-item">
                      <span class="ntb-date">${escapeHtml(item.displayDate)}:</span> ${escapeHtml(item.title)}
                    </a>
                  `).join(" &nbsp;&bull;&nbsp; ")}
                </div>
              </div>
            `;
          }
        }
      }

    } catch (e) {
      console.warn("Library news live syndication error:", e);
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Run on page initialization
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadRecentOpacBooks();
      loadLibraryNews();
    });
  } else {
    loadRecentOpacBooks();
    loadLibraryNews();
  }

  // Expose manual triggers
  window.refreshOpacBooks = loadRecentOpacBooks;
  window.refreshLibraryNews = loadLibraryNews;
})();
