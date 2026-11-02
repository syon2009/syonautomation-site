/* AOI Foundry: hardware warning before buying Pro or Site (the editions with the built-in AI).
   Shows the hardware the built-in AI needs and a short yes/no questionnaire.
   All yes -> continue to checkout. Any no -> stop and advise, with "Purchase anyway" to continue.
   Developed by Syon Automation LLC. */
(function () {
  'use strict';
  var IDS = ['00w9ATaYj0TN2FJ1lpgQE0O', '3cIdR9c2n1XRdknfcfgQE0P']; // Pro, Site payment links
  var SKEY = 'syAoiHwOk';
  var isAi = function (href) { href = href || ''; return IDS.some(function (id) { return href.indexOf(id) >= 0; }); };
  var ok = function () { try { return sessionStorage.getItem(SKEY) === '1'; } catch (e) { return false; } };
  var remember = function () { try { sessionStorage.setItem(SKEY, '1'); } catch (e) { } };
  var QS = [
    'My PC runs Windows 10 or Windows 11, 64-bit',
    'My PC has 16 GB of memory (RAM) or more',
    'My PC has an NVIDIA or AMD graphics card with 8 GB of video memory or more',
    'My PC has 10 GB of free space on an SSD drive'
  ];
  var css = '#bwOv{position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:9999;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 16px}' +
    '#bwBox{background:#101215;color:#f5f7fa;border:1px solid #2a3038;border-radius:14px;max-width:720px;width:100%;padding:22px 22px 18px;font-size:15px;line-height:1.5;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    '#bwBox h3{margin:0 0 6px;font-size:21px}#bwBox p{margin:8px 0;color:#c3cbd3}#bwBox table{width:100%;border-collapse:collapse;margin:8px 0 4px;font-size:14px}' +
    '#bwBox td,#bwBox th{padding:5px 6px;border-bottom:1px solid #1d2126;text-align:left}#bwBox th{color:#a7b0ba;font-weight:600}' +
    '#bwBox .bwbar{height:8px;border-radius:4px;background:#1d2126;overflow:hidden;min-width:60px}#bwBox .bwbar i{display:block;height:100%}' +
    '#bwBox .q{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1d2126;flex-wrap:wrap}' +
    '#bwBox .q span{flex:1 1 260px}#bwBox .q label{margin-left:10px;white-space:nowrap;cursor:pointer}#bwBox .yn{white-space:nowrap}' +
    '#bwBox .bwbtns{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end;margin-top:16px}' +
    '#bwBox button{font:inherit;font-weight:600;border-radius:9px;padding:10px 16px;cursor:pointer;border:1px solid #3a424c;background:#16191d;color:#f5f7fa}' +
    '#bwBox button.pri{background:#fff;color:#000;border-color:#fff}#bwBox button:disabled{opacity:.45;cursor:not-allowed}' +
    '#bwBox .stop{border:1px solid #c0392b;background:#2a1210;border-radius:10px;padding:12px 14px;margin-top:12px}#bwBox .note{font-size:13px;color:#a7b0ba}';
  var ROWS = [['NVIDIA RTX 4090 (24 GB)', 135, 1], ['NVIDIA RTX 3090 (24 GB)', 95, 1], ['NVIDIA RTX 4070 Super (12 GB)', 75, 1], ['NVIDIA RTX 4060 Ti (16 GB)', 55, 1], ['NVIDIA RTX 3060 (12 GB), measured', 42, 1],
    ['No graphics card: desktop, DDR5', 12, 0], ['No graphics card: desktop, DDR4', 9, 0], ['No graphics card: laptop', 6, 0]];
  var aoi = function (tps) { var s = Math.round(2500 / tps + 6000 / (tps * 12)); return s < 90 ? s + ' s' : (s / 60).toFixed(1) + ' min'; };
  function open(go) {
    if (!document.getElementById('bwCss')) { var st = document.createElement('style'); st.id = 'bwCss'; st.textContent = css; document.head.appendChild(st); }
    var ov = document.createElement('div'); ov.id = 'bwOv'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'bwT');
    ov.innerHTML = '<div id="bwBox"><h3 id="bwT">Before you buy: does your PC suit the built-in AI?</h3>' +
      '<p>AOI Foundry Pro and Site include a <b>built-in AI</b> that runs on your own PC, with no internet and no API key. How fast it designs an AOI depends on your hardware. Everything else in AOI Foundry runs on any Windows 10/11 PC, and the AI can also use Claude in the cloud, which is fast on any PC.</p>' +
      '<table><tr><th>Hardware (7-8B model)</th><th>Speed (tokens/s)</th><th>Typical AOI</th></tr>' +
      ROWS.map(function (r) { return '<tr><td>' + r[0] + '</td><td><div style="display:flex;gap:8px;align-items:center"><div class="bwbar" style="flex:1"><i style="width:' + Math.max(3, r[1] / 1.35) + '%;background:' + (r[2] ? '#4fd39a' : '#e05a47') + '"></i></div>' + r[1] + '</div></td><td>' + aoi(r[1]) + '</td></tr>'; }).join('') +
      '</table><p class="note">Published llama.cpp speeds for a 7-8B model at Q4 (sources: Hardware Corner and Jeff Geerling measurements; GPU and CPU-only comparison tables). A typical AOI design is about 6,000 tokens read and 2,500 written; the rule checker may ask for 1–2 corrections. <b>Test my PC</b> in AOI Foundry measures your own PC during the free trial.</p>' +
      '<p style="margin-top:14px"><b>Please answer for the PC you will use:</b></p>' +
      QS.map(function (q, i) { return '<div class="q"><span>' + q + '</span><span class="yn"><label><input type="radio" name="bwq' + i + '" value="y"> Yes</label><label><input type="radio" name="bwq' + i + '" value="n"> No</label></span></div>'; }).join('') +
      '<div id="bwStop"></div><div class="bwbtns"><button type="button" id="bwCancel">Cancel</button><button type="button" id="bwSkip">I\'ll use Claude (cloud) or no AI</button><button type="button" class="pri" id="bwGo" disabled>Continue to checkout</button></div></div>';
    document.body.appendChild(ov);
    var prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    var close = function () { ov.remove(); document.body.style.overflow = prevOverflow; document.removeEventListener('keydown', esc); };
    var esc = function (e) { if (e.key === 'Escape') close(); }; document.addEventListener('keydown', esc);
    var proceed = function () { remember(); close(); go(); };
    var ans = function () { return QS.map(function (q, i) { var r = ov.querySelector('input[name=bwq' + i + ']:checked'); return r ? r.value : null; }); };
    var goBtn = ov.querySelector('#bwGo'), stop = ov.querySelector('#bwStop');
    ov.addEventListener('change', function () { var a = ans(); goBtn.disabled = a.indexOf(null) >= 0; stop.innerHTML = ''; goBtn.textContent = 'Continue to checkout'; });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.querySelector('#bwCancel').onclick = close;
    ov.querySelector('#bwSkip').onclick = proceed;
    goBtn.onclick = function () {
      var a = ans(); if (a.indexOf(null) >= 0) return;
      if (a.indexOf('n') < 0) { proceed(); return; }
      var miss = QS.filter(function (q, i) { return a[i] === 'n'; });
      stop.innerHTML = '<div class="stop"><b>Stop: this PC is below what the built-in AI needs to run well.</b><ul style="margin:6px 0 6px 18px;padding:0">' + miss.map(function (q) { return '<li>' + q.replace(/^My PC (has|runs) /, 'Needs ') + '</li>'; }).join('') + '</ul>' +
        '<div>Our advice: <b>download the free 14-day trial first</b> and click <b>Settings → 🖥 Test my PC</b> to measure the real speed on your PC. Without a suitable graphics card the built-in AI still works but takes several minutes per AOI. You can also use Claude in the cloud (fast on any PC), or choose the <b>Personal</b> edition if you do not need the Pro Tools.</div>' +
        '<div class="bwbtns" style="justify-content:flex-start"><button type="button" id="bwTrial">Get the free trial</button><button type="button" class="pri" id="bwAnyway">Purchase anyway</button></div></div>';
      ov.querySelector('#bwAnyway').onclick = proceed;
      ov.querySelector('#bwTrial').onclick = function () { close(); var p = document.getElementById('pricing'); if (p) p.scrollIntoView({ behavior: 'smooth' }); };
      goBtn.disabled = true;
    };
    var first = ov.querySelector('input'); if (first) first.focus();
  }
  // capture phase: runs before the page's own handlers (cart buttons, link navigation)
  document.addEventListener('click', function (e) {
    if (ok() || e.defaultPrevented) return;
    var t = e.target && e.target.closest ? e.target : null; if (!t) return;
    var a = t.closest('a[href]');
    if (a && isAi(a.getAttribute('href'))) { e.preventDefault(); e.stopImmediatePropagation(); var href = a.href, tgt = a.target; open(function () { if (tgt === '_blank') window.open(href, '_blank', 'noopener'); else location.href = href; }); return; }
    var b = t.closest('button.cartadd');
    if (b) { var prev = b.previousElementSibling; if (prev && prev.tagName === 'A' && isAi(prev.getAttribute('href'))) { e.preventDefault(); e.stopImmediatePropagation(); open(function () { b.click(); }); } }
  }, true);
})();
