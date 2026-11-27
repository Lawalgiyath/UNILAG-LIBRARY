/* Ogbon Floating Agentic AI Widget — University of Lagos Library */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.OGBON_FULL_PAGE || /(?:^|\/)ogbon\.html$/i.test(window.location.pathname)) {
    return;
  }
  if (document.getElementById('ogbon-widget-root')) return;

  var STORAGE_KEY = 'unilag_ogbon_widget_v1';
  var TOOL_LABELS = {
    faq: 'Library Policy KB',
    journals: 'Accredited Journals',
    openalex: 'OpenAlex Research',
    wikipedia: 'Wikipedia Reference',
    unilag_opac_and_ir: 'UNILAG OPAC & IR'
  };

  var style = document.createElement('style');
  style.textContent = [
    '#ogbon-widget-root{position:fixed;right:18px;bottom:74px;z-index:9990;font-family:"Inter",system-ui,-apple-system,sans-serif;}',
    '#ogbon-fab{display:inline-flex;align-items:center;gap:9px;padding:11px 16px;border-radius:999px;background:#6C0000;color:#fff;border:1px solid rgba(197,155,39,0.55);box-shadow:0 10px 28px rgba(24,10,10,0.28);cursor:pointer;font-size:13px;font-weight:600;letter-spacing:0.01em;transition:transform .2s ease,background .2s ease,box-shadow .2s ease;}',
    '#ogbon-fab:hover{background:#520000;transform:translateY(-2px);box-shadow:0 14px 34px rgba(24,10,10,0.34);}',
    '#ogbon-fab svg{width:17px;height:17px;color:#C59B27;flex-shrink:0;}',
    '#ogbon-fab .og-badge{font-family:"IBM Plex Mono",monospace;font-size:10px;padding:2px 6px;border-radius:999px;background:rgba(197,155,39,0.2);color:#F7E5AE;border:1px solid rgba(197,155,39,0.4);}',
    '#ogbon-panel{position:fixed;right:18px;bottom:128px;width:min(410px,calc(100vw - 28px));height:min(590px,calc(100vh - 150px));background:#FCFBF8;border:1px solid rgba(28,22,19,0.14);border-radius:16px;box-shadow:0 24px 60px rgba(20,12,10,0.24);display:none;flex-direction:column;overflow:hidden;z-index:9991;}',
    '#ogbon-panel.open{display:flex;}',
    '.ogw-head{background:#6C0000;color:#fff;padding:13px 15px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:2px solid #C59B27;}',
    '.ogw-title{display:flex;flex-direction:column;gap:2px;}',
    '.ogw-title strong{font-family:"Instrument Serif",Georgia,serif;font-size:20px;font-weight:400;line-height:1.1;letter-spacing:0.01em;}',
    '.ogw-title span{font-family:"IBM Plex Mono",monospace;font-size:10.5px;color:rgba(255,255,255,0.78);text-transform:uppercase;letter-spacing:0.06em;}',
    '.ogw-head-actions{display:flex;align-items:center;gap:6px;}',
    '.ogw-link{color:#F7E5AE;font-size:11px;font-weight:600;text-decoration:none;padding:5px 8px;border-radius:6px;border:1px solid rgba(247,229,174,0.35);}',
    '.ogw-link:hover{background:rgba(255,255,255,0.12);}',
    '.ogw-close{background:transparent;border:none;color:#fff;font-size:20px;line-height:1;cursor:pointer;padding:2px 6px;border-radius:6px;}',
    '.ogw-close:hover{background:rgba(255,255,255,0.15);}',
    '.ogw-modes{display:flex;gap:6px;padding:9px 12px;background:#F3EFE6;border-bottom:1px solid rgba(28,22,19,0.08);overflow-x:auto;}',
    '.ogw-mode{border:1px solid rgba(28,22,19,0.15);background:#fff;color:#2c2520;font-size:11.5px;font-weight:500;padding:4px 10px;border-radius:999px;cursor:pointer;white-space:nowrap;}',
    '.ogw-mode.active{background:#6C0000;color:#fff;border-color:#6C0000;}',
    '.ogw-body{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:11px;background:#FCFBF8;}',
    '.ogw-msg{max-width:92%;padding:10px 12px;border-radius:12px;font-size:13px;line-height:1.52;color:#1e1916;}',
    '.ogw-msg.user{align-self:flex-end;background:#6C0000;color:#fff;border-bottom-right-radius:4px;}',
    '.ogw-msg.bot{align-self:flex-start;background:#fff;border:1px solid rgba(28,22,19,0.1);border-bottom-left-radius:4px;}',
    '.ogw-msg.bot h3,.ogw-msg.bot h4{margin:8px 0 4px;font-size:13.5px;font-weight:600;color:#6C0000;}',
    '.ogw-msg.bot h3:first-child,.ogw-msg.bot h4:first-child{margin-top:0;}',
    '.ogw-msg.bot p{margin:0 0 7px;}',
    '.ogw-msg.bot ul,.ogw-msg.bot ol{margin:4px 0 8px 18px;padding:0;}',
    '.ogw-msg.bot li{margin-bottom:4px;}',
    '.ogw-msg.bot a{color:#6C0000;text-decoration:underline;font-weight:500;word-break:break-word;}',
    '.ogw-msg.bot code{font-family:"IBM Plex Mono",monospace;font-size:11.5px;background:#F3EFE6;padding:1px 4px;border-radius:4px;}',
    '.ogw-tools{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px;padding-top:6px;border-top:1px dashed rgba(28,22,19,0.12);}',
    '.ogw-tool{font-family:"IBM Plex Mono",monospace;font-size:10px;background:#F5EFE2;color:#5c4514;padding:2px 6px;border-radius:4px;border:1px solid rgba(197,155,39,0.35);}',
    '.ogw-starters{display:flex;flex-direction:column;gap:6px;margin-top:4px;}',
    '.ogw-starter{text-align:left;background:#fff;border:1px solid rgba(28,22,19,0.13);border-radius:8px;padding:8px 10px;font-size:12px;color:#2c2520;cursor:pointer;transition:border-color .15s ease,background .15s ease;}',
    '.ogw-starter:hover{border-color:#6C0000;background:#FFF9F7;}',
    '.ogw-foot{padding:10px 12px;border-top:1px solid rgba(28,22,19,0.1);background:#fff;display:flex;gap:8px;align-items:flex-end;}',
    '.ogw-input{flex:1;border:1px solid rgba(28,22,19,0.2);border-radius:10px;padding:8px 10px;font-family:inherit;font-size:13px;resize:none;max-height:90px;min-height:38px;outline:none;}',
    '.ogw-input:focus{border-color:#6C0000;}',
    '.ogw-send{background:#6C0000;color:#fff;border:none;border-radius:10px;padding:0 14px;height:38px;font-size:12.5px;font-weight:600;cursor:pointer;}',
    '.ogw-send:disabled{opacity:0.55;cursor:not-allowed;}',
    '@media(max-width:560px){#ogbon-panel{right:10px;left:10px;width:auto;bottom:124px;}#ogbon-widget-root{right:12px;bottom:68px;}}'
  ].join('\n');
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'ogbon-widget-root';
  root.innerHTML = [
    '<div id="ogbon-panel" role="dialog" aria-label="Ogbon UNILAG Library AI Assistant">',
    '  <div class="ogw-head">',
    '    <div class="ogw-title">',
    '      <strong>&#7884;gb&#7885;&#769;n AI</strong>',
    '      <span>UNILAG Study, Search &amp; Library Agent</span>',
    '    </div>',
    '    <div class="ogw-head-actions">',
    '      <a class="ogw-link" href="ogbon.html">Full View</a>',
    '      <button type="button" class="ogw-close" id="ogwClose" aria-label="Close assistant">&times;</button>',
    '    </div>',
    '  </div>',
    '  <div class="ogw-modes" id="ogwModes">',
    '    <button type="button" class="ogw-mode active" data-mode="auto">All-in-One</button>',
    '    <button type="button" class="ogw-mode" data-mode="study">Study Companion</button>',
    '    <button type="button" class="ogw-mode" data-mode="publish">Where to Publish</button>',
    '    <button type="button" class="ogw-mode" data-mode="faq">Library FAQ</button>',
    '  </div>',
    '  <div class="ogw-body" id="ogwBody"></div>',
    '  <form class="ogw-foot" id="ogwForm">',
    '    <textarea class="ogw-input" id="ogwInput" rows="1" placeholder="Ask Ogbon anything about research, study, journals, or library rules..."></textarea>',
    '    <button type="submit" class="ogw-send" id="ogwSend">Ask</button>',
    '  </form>',
    '</div>',
    '<button type="button" id="ogbon-fab" aria-expanded="false" aria-controls="ogbon-panel">',
    '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L14.8 8.5L21.5 11.2L14.8 14L12 20.5L9.2 14L2.5 11.2L9.2 8.5L12 2Z"/></svg>',
    '  <span>Ask &#7884;gb&#7885;&#769;n</span>',
    '  <span class="og-badge">AI</span>',
    '</button>'
  ].join('\n');
  document.body.appendChild(root);

  var panel = document.getElementById('ogbon-panel');
  var fab = document.getElementById('ogbon-fab');
  var closeBtn = document.getElementById('ogwClose');
  var bodyEl = document.getElementById('ogwBody');
  var formEl = document.getElementById('ogwForm');
  var inputEl = document.getElementById('ogwInput');
  var sendBtn = document.getElementById('ogwSend');
  var modesEl = document.getElementById('ogwModes');

  var state = { mode: 'auto', messages: [] };
  try {
    var saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Array.isArray(saved.messages)) {
      state.messages = saved.messages.slice(-12);
      if (saved.mode) state.mode = saved.mode;
    }
  } catch (e) {}

  function saveState() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        mode: state.mode,
        messages: state.messages.slice(-12)
      }));
    } catch (e) {}
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMessages() {
    if (!state.messages.length) {
      bodyEl.innerHTML = [
        '<div class="ogw-msg bot">',
        '  <p>Welcome. I am <strong>&#7884;gb&#7885;&#769;n</strong>, the University of Lagos Library AI assistant.</p>',
        '  <p>I can answer UNILAG Library policies, search OPAC &amp; OpenAlex academic literature, explain study concepts, and recommend accredited Scopus/AJOL journals.</p>',
        '</div>',
        '<div class="ogw-starters">',
        '  <button type="button" class="ogw-starter" data-q="What are UNILAG Library borrowing limits, overdue fines, and Multimedia Studio rules?">Library borrowing limits, fines &amp; Multimedia Studio rules</button>',
        '  <button type="button" class="ogw-starter" data-q="Explain solar microgrids and find recent OpenAlex papers plus study questions." data-m="study">Study guide: Solar microgrids + OpenAlex papers &amp; quiz</button>',
        '  <button type="button" class="ogw-starter" data-q="Where can I publish research in financial econometrics or Nigerian public health?" data-m="publish">Recommend Scopus/AJOL accredited journals for my paper</button>',
        '</div>'
      ].join('\n');
      return;
    }

    var html = [];
    state.messages.forEach(function (m) {
      if (m.role === 'user') {
        html.push('<div class="ogw-msg user">' + escapeHtml(m.content) + '</div>');
      } else {
        var toolsHtml = '';
        if (m.tools && m.tools.length) {
          toolsHtml = '<div class="ogw-tools">' + m.tools.map(function (t) {
            return '<span class="ogw-tool">' + escapeHtml(TOOL_LABELS[t] || t) + '</span>';
          }).join('') + '</div>';
        }
        html.push('<div class="ogw-msg bot">' + (m.html || '<p>' + escapeHtml(m.content) + '</p>') + toolsHtml + '</div>');
      }
    });
    bodyEl.innerHTML = html.join('\n');
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function syncModeUI() {
    Array.prototype.forEach.call(modesEl.querySelectorAll('.ogw-mode'), function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === state.mode);
    });
  }

  function setOpen(open) {
    panel.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      renderMessages();
      setTimeout(function () { inputEl.focus(); }, 40);
    }
  }

  async function askOgbon(queryText) {
    var q = String(queryText || '').trim();
    if (!q || sendBtn.disabled) return;

    state.messages.push({ role: 'user', content: q });
    saveState();
    renderMessages();

    var loadingNode = document.createElement('div');
    loadingNode.className = 'ogw-msg bot';
    loadingNode.innerHTML = '<p><em>Searching UNILAG Knowledge Base, OPAC, OpenAlex &amp; Journals...</em></p>';
    bodyEl.appendChild(loadingNode);
    bodyEl.scrollTop = bodyEl.scrollHeight;

    sendBtn.disabled = true;
    inputEl.value = '';

    var histPayload = state.messages.slice(-7, -1).map(function (m) {
      return { role: m.role, content: m.content };
    });

    try {
      var res = await fetch('/api/ogbon/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          mode: state.mode,
          history: histPayload
        })
      });
      var data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Request failed');
      }
      state.messages.push({
        role: 'assistant',
        content: data.reply_markdown || '',
        html: data.reply_html || '',
        tools: data.tools_used || []
      });
      saveState();
    } catch (err) {
      state.messages.push({
        role: 'assistant',
        content: 'Unable to reach Ogbon backend right now: ' + err.message,
        html: '<p>Unable to reach &#7884;gb&#7885;&#769;n right now (' + escapeHtml(err.message) + '). Please try again or visit <a href="ogbon.html">the full &#7884;gb&#7885;&#769;n workspace</a>.</p>',
        tools: []
      });
    } finally {
      sendBtn.disabled = false;
      renderMessages();
    }
  }

  fab.addEventListener('click', function () {
    setOpen(!panel.classList.contains('open'));
  });
  closeBtn.addEventListener('click', function () { setOpen(false); });

  modesEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.ogw-mode');
    if (!btn) return;
    state.mode = btn.getAttribute('data-mode') || 'auto';
    syncModeUI();
    saveState();
  });

  bodyEl.addEventListener('click', function (e) {
    var starter = e.target.closest('.ogw-starter');
    if (!starter) return;
    var m = starter.getAttribute('data-m');
    if (m) {
      state.mode = m;
      syncModeUI();
    }
    askOgbon(starter.getAttribute('data-q'));
  });

  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    askOgbon(inputEl.value);
  });

  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askOgbon(inputEl.value);
    }
  });

  syncModeUI();
})();
