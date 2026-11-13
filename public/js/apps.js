/* App previews and app-interest counts for syonautomation.com. Developed by Syon Automation LLC.
   1) Hover over an app card (mouse) or tab to it (keyboard): a box pops out describing what the software is.
   2) Counts which apps people look at: product page views, previews (box open 0.8 s or more), clicks to an app page,
      and Buy / Add to cart clicks. Sent to /api/event (this site's own Worker). No cookies, no IP address kept,
      each action counted once per app per browser session. Honors Global Privacy Control. The owner's own browser
      is skipped after signing in on the owner page. Shown on /downloads-admin. */
(function () {
  'use strict';
  // What each app is, in the words of its own product page (lead paragraph and price line).
  var APPS = {
    plantproof: { name: 'PlantProof', tag: 'Run it. Prove it.', what: 'SCADA, historian, alarms, OEE and maintenance in one install, for Allen-Bradley, Siemens, Mitsubishi, CLICK, Modbus and OPC UA. It runs on your own network, with licence keys that never need the internet.', price: 'From $995, one-time', trial: 'Free 30-day evaluation' },
    datumline: { name: 'Datumline', tag: 'Field journal and time clock.', what: 'A time clock, a field journal and pay-period timesheets in one Windows app, built for field-service and controls technicians. Timesheets e-mail themselves on schedule, with a sent log as proof.', price: 'From $149, one-time', trial: 'Free 30-day trial' },
    datumlab: { name: 'DatumLab', tag: '', what: 'MATLAB-style computing that pulls live tags straight from your PLCs over OPC UA, then runs loop performance, FFT, SPC and capability analysis in one click. No exports, no spreadsheets, no big-name license.', price: 'From $495, one-time', trial: 'Free 14-day trial' },
    techproof: { name: 'TechProof', tag: '', what: 'Sixty-three plant-floor courses, from electrical safety and situational awareness through PID control to the reliability-management skills that run a maintenance department, in a locked reader your technicians open on any training PC. One license covers your whole facility.', price: 'From $695; launch pricing until Dec 6, 2026', trial: '' },
    linkscout: { name: 'LinkScout', tag: '', what: 'A LoRaWAN scanner for commissioning and maintenance. It finds every device your gateways hear and grades each link PASS, MARGINAL or FAIL against the recommended signal limits, with the reason and the fix.', price: 'From $495, one-time', trial: 'Free 14-day trial' },
    sitewatch: { name: 'SiteWatch', tag: '', what: 'One dashboard for wireless LoRaWAN temperature (TempWatch), corrosion (CorroWatch) and gas (GasWatch) sensors, with alarms, trends, uptime and signal health, running on your own PC.', price: 'From $595, one-time', trial: 'Free 14-day trial' },
    datacast: { name: 'DataCast', tag: '', what: 'Build interactive TV displays on your PC, with videos, menu boards and live PLC data over OPC UA, and send them to every screen in the building. Or put a looping advert on a USB stick for a single TV.', price: 'From $79, one-time', trial: 'Free 14-day trial' },
    rungwise: { name: 'RungWise PLC Academy', tag: '', what: 'Ladder logic training from the first contact to live PID. The core course is Allen-Bradley Studio 5000, and add-on packs cover Siemens TIA Portal, Micro800, AutomationDirect CLICK, Productivity and DirectLOGIC, and legacy SLC 500 / PLC-5. Live simulations, auto-graded labs and a quiz at the end of every module.', price: 'From $249, one-time', trial: 'Free 14-day trial' },
    'wo-mailer': { name: 'WO Mailer', tag: '', what: 'Your HMIs already e-mail screenshots. WO Mailer receives them on the plant network, reads the Work Order # and timestamp off the screen, and sends the whole picture in the message body to the right people, through Microsoft 365 or any mail server.', price: 'From $149, one-time', trial: 'Free 14-day trial' },
    portproof: { name: 'PortProof', tag: '', what: 'Every port the programs on your PC are listening on, the app that owns it, a real health check, and a one-click link that opens it in Google Chrome. Connect-only checks for Modbus, EtherNet/IP and OPC UA.', price: 'From $39, one-time', trial: 'Free 14-day trial' },
    aoifoundry: { name: 'AOI Foundry', tag: '', what: 'Builds Rockwell Studio 5000 Add-On Instructions that pass every Rockwell AOI rule: templates, drawn ladder, live rule checking, simulation, install files and guides, with AI when you want it.', price: 'From $99', trial: 'Free 14-day trial' },
    depthforge: { name: 'DepthForge', tag: '', what: 'Turn photos, logos and artwork into 3D relief engravings in steel, brass, titanium and stone. DepthForge works out the depth, the passes and the laser settings, then hands a ready job to LightBurn, EZCAD or MeerK40t.', price: '$49', trial: 'Free 14-day trial' }
  };
  var BYNAME = {}; Object.keys(APPS).forEach(function (k) { BYNAME[APPS[k].name.toLowerCase()] = k; });
  BYNAME['rungwise'] = 'rungwise';

  /* ---------- interest counts ---------- */
  var nav = navigator, here = location.pathname.replace(/^\/+/, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';
  var off = (nav.globalPrivacyControl === true) || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(nav.userAgent || '');
  try { if (localStorage.getItem('syNoTrack') === '1') off = true; } catch (e) {}
  var sent = {}; try { sent = JSON.parse(sessionStorage.getItem('syEv') || '{}') || {}; } catch (e) { sent = {}; }
  function send(t, p) {
    if (off || !APPS[p]) return;
    var k = t + ':' + p; if (sent[k]) return; sent[k] = 1;
    try { sessionStorage.setItem('syEv', JSON.stringify(sent)); } catch (e) {}
    var ref = ''; try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    if (ref === location.hostname) ref = '';
    var body = JSON.stringify({ t: t, p: p, s: here, ref: ref, d: (window.matchMedia && matchMedia('(pointer:coarse)').matches) ? 'phone/tablet' : 'computer' });
    try { if (nav.sendBeacon && nav.sendBeacon('/api/event', new Blob([body], { type: 'text/plain' }))) return; } catch (e) {}
    try { fetch('/api/event', { method: 'POST', body: body, keepalive: true, headers: { 'content-type': 'text/plain' } }); } catch (e) {}
  }
  if (APPS[here]) send('view', here);

  function slugFromHref(href) {
    var u; try { u = new URL(href, location.href); } catch (e) { return ''; }
    if (u.hostname === location.hostname) { var s = u.pathname.replace(/^\/+/, '').replace(/\.html$/, '').replace(/\/$/, ''); return APPS[s] ? s : ''; }
    if (u.hostname === 'licenses.syonautomation.com') {
      var pr = (u.searchParams.get('product') || '').toLowerCase();
      if (pr === 'womailer') return 'wo-mailer';
      if (pr === 'rwaddon') return 'rungwise';
      if (APPS[pr]) return pr;
      var i = u.searchParams.get('i') || ''; return cartSlug(i.split(',')[0]);
    }
    return '';
  }
  function cartSlug(id) {
    var a = String(id || '').split('.')[0].toLowerCase();
    if (a === 'rwaddon' || a === 'bundle') return 'rungwise';
    if (a === 'womailer') return 'wo-mailer';
    return APPS[a] ? a : '';
  }
  function cardSlug(el) {
    var c = el && el.closest && el.closest('.pcard,.pdet,.bcard');
    if (!c) return '';
    if (c.classList.contains('bcard')) return 'rungwise';
    var h = c.querySelector('h3,h2'); return h ? (BYNAME[h.textContent.trim().toLowerCase()] || '') : '';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('a,button'); if (!b) return;
    var label = (b.textContent || '').trim().toLowerCase();
    if (b.matches('[data-cart],.cartadd')) { send('buy', cartSlug(b.getAttribute('data-cart')) || cardSlug(b) || (APPS[here] ? here : '')); return; }
    if (b.tagName !== 'A') return;
    var href = b.getAttribute('href') || '';
    if (/licenses\.syonautomation\.com\/(buy|cart)|buy\.stripe\.com/.test(href) || /^buy\b|buy now/.test(label)) { send('buy', slugFromHref(href) || cardSlug(b) || (APPS[here] ? here : '')); return; }
    var s = slugFromHref(href); if (s && s !== here) send('click', s);
  }, true);

  /* ---------- hover preview box ---------- */
  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  var cards = document.querySelectorAll('.pcard');
  if (!cards.length) return;
  var box = document.createElement('div'); box.className = 'apppop'; box.setAttribute('role', 'tooltip'); box.id = 'apppop'; box.hidden = true;
  document.body.appendChild(box);
  var showT = 0, seenT = 0, cur = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(card, slug) {
    var a = APPS[slug], img = card.querySelector('.ptop img');
    var badge = card.querySelector('.badge');
    box.innerHTML = '<div class="aph">' + (img ? '<img src="' + esc(img.getAttribute('src')) + '" alt="" width="44" height="44">' : '') +
      '<div><b>' + esc(a.name) + '</b>' + (badge ? '<span class="apb">' + esc(badge.textContent.trim()) + '</span>' : '') + '</div></div>' +
      '<span class="apk">What it is</span><p>' + esc(a.what) + '</p>' +
      '<div class="apf">' + esc(a.price) + (a.trial ? ' · ' + esc(a.trial) : '') + '</div>' +
      '<div class="apn">Full details and pricing are on the ' + esc(a.name) + ' page.</div>';
  }
  function place(card) {
    var r = card.getBoundingClientRect(), w = box.offsetWidth, h = box.offsetHeight, gap = 14, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var left = r.right + gap; if (left + w > vw - 10) left = r.left - gap - w;          // right of the card, else left of it
    var top = r.top + 20;
    if (left < 10) { left = Math.max(10, Math.min(vw - w - 10, r.left + (r.width - w) / 2)); top = r.top - h - gap; if (top < 10) top = r.bottom + gap; } // no room at the sides: above, else below
    var hd = document.querySelector('header.top'), minTop = hd ? Math.max(10, hd.getBoundingClientRect().bottom + 8) : 10;  // never under the sticky header
    top = Math.max(minTop, Math.min(vh - h - 10, top));
    box.style.left = (left + window.scrollX) + 'px'; box.style.top = (top + window.scrollY) + 'px';
  }
  function show(card, slug) {
    clearTimeout(showT); clearTimeout(seenT);
    showT = setTimeout(function () {
      cur = card; fill(card, slug); box.hidden = false; box.classList.remove('on'); place(card);
      requestAnimationFrame(function () { box.classList.add('on'); });
      card.setAttribute('aria-describedby', 'apppop');
      seenT = setTimeout(function () { send('preview', slug); }, 800);
    }, 250);
  }
  function hide(card) {
    clearTimeout(showT); clearTimeout(seenT);
    if (cur && card && cur !== card) return;
    box.classList.remove('on'); box.hidden = true; if (cur) cur.removeAttribute('aria-describedby'); cur = null;
  }
  Array.prototype.forEach.call(cards, function (card) {
    var slug = cardSlug(card); if (!slug) return;   // only apps that are for sale have a box
    if (fine) { card.addEventListener('mouseenter', function () { show(card, slug); }); card.addEventListener('mouseleave', function () { hide(card); }); }
    card.addEventListener('focusin', function () { show(card, slug); });
    card.addEventListener('focusout', function (e) { if (!card.contains(e.relatedTarget)) hide(card); });
  });
  window.addEventListener('scroll', function () { if (cur) place(cur); }, { passive: true });
  window.addEventListener('resize', function () { if (cur) place(cur); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
})();
