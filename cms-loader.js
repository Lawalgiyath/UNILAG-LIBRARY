/* ============================================================
   UNILAG LIBRARY · Dynamic CMS Section Loader
   Renders custom media blocks, shapes, and sections
   published via the Staff Admin CMS.
   ============================================================ */

(function () {
  'use strict';

  function getCurrentPageName() {
    var p = window.location.pathname.split('/').pop() || 'index.html';
    if (!p || p === '') p = 'index.html';
    return p;
  }

  function getShapeStyles(media) {
    if (!media) return { ratio: '16/10', radius: '0px', shapeClass: '' };
    var shape = media.shape || 'editorial';
    var ratio = media.aspect_ratio || '16/10';
    var radius = media.radius || '0px';

    if (shape === 'arch') {
      radius = '60px 60px 0 0';
    } else if (shape === 'pill') {
      radius = '18px';
    } else if (shape === 'sharp') {
      radius = '0px';
    }
    return { ratio: ratio, radius: radius, shape: shape };
  }

  function buildCmsSectionHtml(sec) {
    var m = sec.media || {};
    var shape = getShapeStyles(m);
    var placement = m.placement || 'media-right';
    var isMediaLeft = placement === 'media-left';
    var isMediaCenter = placement === 'media-center';

    var ctaHtml = '';
    if (sec.cta && sec.cta.text && sec.cta.url) {
      var btnClass = sec.cta.style === 'solid' ? 'btn btn--solid' :
                     sec.cta.style === 'ghost' ? 'btn btn--ghost' : 'btn btn--light';
      ctaHtml = '<div style="margin-top:24px"><a href="' + sec.cta.url + '" class="' + btnClass + '" data-hover>' +
                sec.cta.text + ' &rarr;</a></div>';
    }

    var mediaHtml = '';
    if (m.url) {
      mediaHtml = 
        '<div class="cms-media-col" style="flex:1;min-width:min(100%,320px)">' +
          '<div class="cms-frame" style="overflow:hidden;border:1px solid var(--line);position:relative;aspect-ratio:' + shape.ratio + ';border-radius:' + shape.radius + ';background:#e8e2d6">' +
            '<img src="' + m.url + '" alt="' + (sec.title || 'UNILAG Library Space') + '" style="width:100%;height:100%;object-fit:cover;display:block">' +
            '<span class="tick tl" style="position:absolute;top:0;left:0;width:10px;height:10px;border-top:2px solid var(--ink);border-left:2px solid var(--ink)"></span>' +
            '<span class="tick br" style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-bottom:2px solid var(--ink);border-right:2px solid var(--ink)"></span>' +
          '</div>' +
          (m.caption ? '<div class="mono" style="font-size:0.75rem;color:var(--ink-50);letter-spacing:.12em;text-transform:uppercase;margin-top:10px;line-height:1.4">' + m.caption + '</div>' : '') +
        '</div>';
    }

    var textHtml = 
      '<div class="cms-text-col" style="flex:1.1;min-width:min(100%,340px)">' +
        (sec.eyebrow ? '<div class="mono" style="color:var(--oxblood);font-weight:700;font-size:0.75rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px;display:inline-flex;align-items:center;gap:8px"><span style="width:20px;height:2px;background:var(--oxblood)"></span>' + sec.eyebrow + '</div>' : '') +
        '<h2 class="display" style="font-size:clamp(2rem,4.2vw,3.2rem);line-height:1.06;margin-bottom:18px">' + (sec.title || '') + '</h2>' +
        '<p class="lede" style="font-size:1.05rem;line-height:1.65;color:var(--ink-70);margin-bottom:16px">' + (sec.body || '') + '</p>' +
        ctaHtml +
      '</div>';

    var flexDir = isMediaLeft ? 'row-reverse' : 'row';
    if (isMediaCenter) {
      return (
        '<section class="cms-section sec-pad" id="' + sec.id + '" style="border-top:1px solid var(--line);background:var(--cream);padding:clamp(48px,7vw,84px) 0">' +
          '<div class="wrap">' +
            '<div style="max-width:820px;margin:0 auto 36px auto;text-align:center">' +
              (sec.eyebrow ? '<div class="mono" style="color:var(--oxblood);font-weight:700;font-size:0.75rem;letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px">' + sec.eyebrow + '</div>' : '') +
              '<h2 class="display" style="font-size:clamp(2.2rem,4.5vw,3.5rem);line-height:1.06;margin-bottom:18px">' + (sec.title || '') + '</h2>' +
              '<p class="lede" style="font-size:1.05rem;line-height:1.65;color:var(--ink-70)">' + (sec.body || '') + '</p>' +
            '</div>' +
            (m.url ? 
              '<div style="max-width:980px;margin:0 auto">' +
                '<div class="cms-frame" style="overflow:hidden;border:1px solid var(--line);position:relative;aspect-ratio:' + shape.ratio + ';border-radius:' + shape.radius + ';background:#e8e2d6">' +
                  '<img src="' + m.url + '" alt="' + (sec.title || 'UNILAG Library Space') + '" style="width:100%;height:100%;object-fit:cover;display:block">' +
                '</div>' +
                (m.caption ? '<div class="mono center" style="font-size:0.75rem;color:var(--ink-50);letter-spacing:.12em;text-transform:uppercase;margin-top:12px;text-align:center">' + m.caption + '</div>' : '') +
              '</div>' : '') +
            (ctaHtml ? '<div class="center" style="margin-top:28px;text-align:center">' + ctaHtml + '</div>' : '') +
          '</div>' +
        '</section>'
      );
    }

    return (
      '<section class="cms-section sec-pad" id="' + sec.id + '" style="border-top:1px solid var(--line);background:var(--cream);padding:clamp(48px,7vw,84px) 0">' +
        '<div class="wrap">' +
          '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:clamp(32px,5vw,64px);flex-direction:' + flexDir + '">' +
            textHtml +
            mediaHtml +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function injectCmsSections(sections) {
    if (!sections || !sections.length) return;

    var sorted = sections.slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });

    sorted.forEach(function (sec) {
      if (sec.status !== 'published') return;
      if (document.getElementById(sec.id)) return; // already injected

      var html = buildCmsSectionHtml(sec);
      var pos = sec.position || 'middle';

      var temp = document.createElement('div');
      temp.innerHTML = html;
      var secNode = temp.firstElementChild;
      if (!secNode) return;

      if (pos === 'top') {
        var hero = document.querySelector('.hero--bg, .page-hero, .hero-sub, header');
        if (hero && hero.nextElementSibling) {
          hero.parentNode.insertBefore(secNode, hero.nextElementSibling);
        } else {
          document.body.insertBefore(secNode, document.body.firstChild);
        }
      } else if (pos === 'bottom') {
        var footer = document.querySelector('footer, .ftr');
        if (footer) {
          footer.parentNode.insertBefore(secNode, footer);
        } else {
          document.body.appendChild(secNode);
        }
      } else {
        // 'middle'
        var main = document.querySelector('main');
        var footer = document.querySelector('footer, .ftr');
        if (main) {
          main.appendChild(secNode);
        } else if (footer) {
          footer.parentNode.insertBefore(secNode, footer);
        } else {
          document.body.appendChild(secNode);
        }
      }
    });
  }

  function loadCmsData() {
    var page = getCurrentPageName();
    
    // Check localStorage cache first
    try {
      var cached = localStorage.getItem('unilag_cms_content');
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed.pages && parsed.pages[page]) {
          injectCmsSections(parsed.pages[page]);
        }
      }
    } catch (e) {}

    // Fetch live from server
    fetch('/api/cms?page=' + encodeURIComponent(page))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.sections) {
          injectCmsSections(data.sections);
          // Update cache
          try {
            var full = JSON.parse(localStorage.getItem('unilag_cms_content') || '{"pages":{}}');
            full.pages[page] = data.sections;
            localStorage.setItem('unilag_cms_content', JSON.stringify(full));
          } catch (e) {}
        }
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCmsData);
  } else {
    loadCmsData();
  }
})();

