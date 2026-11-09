/* Shopping cart for syonautomation.com. The cart lives in this browser only (localStorage) and holds item ids;
   prices and names always come from the license service (licenses.syonautomation.com/api/cart), which also opens the one Stripe Checkout.
   Adds "Add to cart" next to every new-license Buy button, a Cart link in the header, and runs cart.html.
   Developed by Syon Automation LLC. */
(function () {
  'use strict';
  var API = 'https://licenses.syonautomation.com', KEY = 'syCart', MAX = 25;
  // Stripe payment links (new licenses only; renewals stay Buy-only) -> cart ids
  var LINKS = {
    eVqeVd0jF1XRfsv0hlgQE0N: 'aoifoundry.personal', '00w9ATaYj0TN2FJ1lpgQE0O': 'aoifoundry.pro', '3cIdR9c2n1XRdknfcfgQE0P': 'aoifoundry.site',
    '5kQ6oH4zVcCveor6FJgQE0w': 'datacast.usb', '7sY3cv4zV31V8030hlgQE0x': 'datacast.starter', '7sYbJ1d6r31Vcgjd47gQE0y': 'datacast.plant', '9B66oH8Qb5a30xB6FJgQE0z': 'datacast.site',
    '5kQaEXeavcCv3JNd47gQE0g': 'datumlab.standard', '8x27sL1nJ8mf4NRd47gQE0F': 'datumlab.plant', cNi7sL6I3eKDbcf0hlgQE0i: 'datumlab.unlimited',
    '6oU00j6I3gSL5RV6FJgQE0H': 'academy.standard', bJe14n8Qb5a36VZ3txgQE0I: 'academy.plant', '8x200jgiD1XRcgjfcfgQE0J': 'academy.unlimited',
    aFa8wP8Qb31V8034xBgQE0K: 'bundle.labstd', '3cIfZhaYjgSLgwzfcfgQE0L': 'bundle.labplant', '28E7sL0jF9qjcgjc03gQE0M': 'bundle.labunl',
    cNi5kDaYj31V8032ptgQE09: 'datumline.professional', aFafZhaYj31V4NR3txgQE0a: 'datumline.team', '8x25kD0jF9qj6VZ9RVgQE0b': 'datumline.site',
    bJebJ1giD6e7803ggjgQE01: 'depthforge.standard', aFacN50jF1XR4NR7JNgQE00: 'depthforge.business',
    '5kQ7sL9UfeKDfsve8bgQE0m': 'linkscout.pro', '00wbJ1aYj1XR3JN8NRgQE0l': 'linkscout.site',
    dRm5kD6I3eKD5RV7JNgQE05: 'plantproof.pilot', '00wdR9d6r0TNdkn3txgQE06': 'plantproof.site',
    bJe6oH8Qb31Va8bggjgQE0v: 'rungwise.personal', '7sY8wPgiD7ib0xBc03gQE0u': 'rungwise.team', bJefZh3vR9qj3JN9RVgQE0t: 'rungwise.site',
    dRm00jc2neKDgwz1lpgQE0s: 'sitewatch.starter', cNifZh2rN9qja8bggjgQE0r: 'sitewatch.plant', '5kQ5kDaYj6e7cgj6FJgQE0q': 'sitewatch.site'
  };
  var SELL = { techproof: 1, womailer: 1, controldraft: 1, portproof: 1 };

  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a.filter(function (x) { return typeof x === 'string'; }).slice(0, MAX) : []; } catch (e) { return mem; } }
  var mem = [];
  function save(a) { mem = a; try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} badge(); }
  function has(id) { return load().indexOf(id) >= 0; }
  function add(id) { var a = load(); if (a.indexOf(id) < 0) { if (a.length >= MAX) return false; a.push(id); save(a); } return true; }
  function remove(id) { save(load().filter(function (x) { return x !== id; })); }

  /** The cart id a Buy link sells, or '' if it is not sold through the cart (renewals, quotes). */
  function idFor(href) {
    if (!href) return '';
    var m = href.match(/^https:\/\/buy\.stripe\.com\/([A-Za-z0-9]+)/);
    if (m) return LINKS[m[1]] || '';
    if (href.indexOf('https://licenses.syonautomation.com/buy?') !== 0) return '';
    var q = new URL(href).searchParams, p = q.get('product') || '';
    if (p === 'rwaddon') return q.get('item') && q.get('edition') ? 'rwaddon.' + q.get('item') + '.' + q.get('edition') : '';
    if (!SELL[p] || !q.get('plan')) return '';
    if (p === 'techproof' && q.get('plan') === 'single') return q.get('course') ? 'techproof.single.' + q.get('course').toUpperCase() : '';
    return p + '.' + q.get('plan');
  }

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  var CART_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path d="M3 4h2.2l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.4-1.1L20.5 8H6.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="19.5" r="1.4" fill="currentColor"/><circle cx="17" cy="19.5" r="1.4" fill="currentColor"/></svg>';

  // header link: shown once something is in the cart (and always on the cart page)
  var link;
  function badge() {
    var n = load().length;
    if (!link) {
      var wrap = document.querySelector('header.top .wrap'); if (!wrap) return;
      link = el('a', 'cartlink'); link.href = 'cart';
      link.innerHTML = CART_SVG + '<span>Cart</span><b class="cartn"></b>';
      var soc = wrap.querySelector('.socials'); wrap.insertBefore(link, soc || null);
      if (/\/cart(\.html)?$/.test(location.pathname)) link.setAttribute('aria-current', 'page');
    }
    link.hidden = !n && !/\/cart(\.html)?$/.test(location.pathname);
    link.querySelector('.cartn').textContent = n ? String(n) : '';
    link.setAttribute('aria-label', 'Cart, ' + n + ' item' + (n === 1 ? '' : 's'));
  }

  var toastEl, toastT;
  function toast(name) {
    if (!toastEl) {
      toastEl = el('div', 'carttoast'); toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '';
    toastEl.appendChild(el('span', '', name ? name + ' is in your cart.' : 'Added to your cart.'));
    var v = el('a', 'btn primary sm', 'View cart & check out'); v.href = 'cart';
    var k = el('button', 'btn sm', 'Keep shopping'); k.type = 'button'; k.onclick = function () { toastEl.classList.remove('on'); };
    toastEl.appendChild(v); toastEl.appendChild(k);
    toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 9000);
  }

  function label(btn, id, small) {
    var inCart = has(id);
    btn.classList.toggle('in', inCart);
    if (small) { btn.innerHTML = CART_SVG; btn.title = inCart ? 'In your cart' : 'Add to cart'; btn.setAttribute('aria-label', (inCart ? 'In your cart: ' : 'Add to cart: ') + (btn.dataset.name || '')); }
    else btn.innerHTML = CART_SVG + '<span>' + (inCart ? 'In cart ✓' : 'Add to cart') + '</span>';
  }
  function wire(btn, getId, small) {
    btn.type = 'button';
    var refresh = function () { var id = getId(); btn.disabled = !id; if (id) label(btn, id, small); };
    btn.addEventListener('click', function () {
      var id = getId(); if (!id) return;
      if (has(id)) { location.href = 'cart'; return; }
      if (!add(id)) { alert('Your cart is full (' + MAX + ' items). Check out first, then add more.'); return; }
      refresh(); document.querySelectorAll('.cartadd').forEach(function (b) { if (b._r) b._r(); });
      toast(btn.dataset.name || '');
    });
    btn._r = refresh; refresh();
  }

  function decorate() {
    // 1) pricing-card Buy buttons and other full-size Buy links
    document.querySelectorAll('a[href^="https://buy.stripe.com/"], a[href^="https://licenses.syonautomation.com/buy?"]').forEach(function (a) {
      if (a.dataset.cartDone || !idFor(a.getAttribute('href'))) return;
      a.dataset.cartDone = '1';
      var small = a.classList.contains('pbuy');
      var b = el('button', small ? 'cartadd mini' : 'btn cartadd' + (a.classList.contains('sm') ? ' sm' : ''));
      var card = a.closest('.price,.bcard,.card,tr');
      var h = card && card.querySelector('h3,th[scope=row]');
      b.dataset.name = (a.getAttribute('aria-label') || '').replace(/^Buy\s+/, '') || (h ? h.textContent.trim() : a.textContent.trim().replace(/^Buy\s+/, ''));
      a.insertAdjacentElement('afterend', b);
      wire(b, function () { return idFor(a.getAttribute('href')); }, small);   // read the href each time (TechProof course picker changes it)
    });
    // 2) explicit buttons: <button data-cart="bundle.maint" data-name="...">
    document.querySelectorAll('[data-cart]').forEach(function (b) {
      if (b.dataset.cartDone) return; b.dataset.cartDone = '1'; b.classList.add('cartadd');
      wire(b, function () { return b.getAttribute('data-cart'); }, false);
    });
    // course picker on TechProof: refresh the label when the course changes
    var tc = document.getElementById('tpCourse'); if (tc) tc.addEventListener('change', function () { setTimeout(function () { document.querySelectorAll('.cartadd').forEach(function (b) { if (b._r) b._r(); }); }, 0); });
  }

  /* ---------- cart.html ---------- */
  var money = function (c) { return '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: c % 100 ? 2 : 0, maximumFractionDigits: 2 }); };
  function page() {
    var root = document.getElementById('cartapp'); if (!root) return;
    var q = new URLSearchParams(location.search);
    var done = q.get('done') || '';
    if (/^cs_(live|test)_[A-Za-z0-9]{10,200}$/.test(done)) {   // back from Stripe: empty the cart, then show the keys
      save([]); root.innerHTML = '<div class="card"><p>Payment received. Opening your license keys…</p></div>';
      location.replace(API + '/thanks?session_id=' + encodeURIComponent(done)); return;
    }
    if (q.get('test') === 'paid') { save([]); }
    render(root, q.get('test') === 'paid');
  }
  function render(root, testPaid) {
    var ids = load();
    if (!ids.length) {
      root.innerHTML = '<div class="card cartempty">' + (testPaid ? '<p><b>Test checkout finished.</b> Nothing was charged.</p>' : '') +
        '<h2>Your cart is empty</h2><p class="muted">Add apps from their pricing sections with the <b>Add to cart</b> button, then check out once for all of them.</p>' +
        '<div class="btns"><a class="btn primary" href="industrial">Industrial software</a><a class="btn" href="/#bundles">Bundles</a><a class="btn" href="depthforge">Maker software</a></div></div>';
      return;
    }
    root.innerHTML = '<div class="card"><p class="muted">Loading your cart…</p></div>';
    fetch(API + '/api/cart?i=' + encodeURIComponent(ids.join(',')), { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).then(function (j) {
      if (j.bad && j.bad.length) save(ids.filter(function (x) { return j.bad.indexOf(x) < 0; }));
      if (!j.items.length) { render(root); return; }
      var h = '<div class="cartgrid"><div class="card cartlist"><h2>Your cart</h2><ul>';
      j.items.forEach(function (it) {
        h += '<li><div class="ci"><a href="' + it.page + '"><b></b></a><span class="muted"></span></div><div class="cp">' +
          (it.list > it.cents ? '<s>' + money(it.list) + '</s>' : '') + '<b>' + money(it.cents) + '</b></div>' +
          '<button type="button" class="cartrm" data-id="" aria-label="Remove">Remove</button></li>';
      });
      h += '</ul>' + (j.bad && j.bad.length ? '<p class="muted">Some items were no longer available and were taken out.</p>' : '') +
        '<p class="muted cartnote">Each app is a one-time license with 12 months of updates. Your license keys appear on the next page right after payment.</p></div>' +
        '<div class="card cartsum"><h2>Order total</h2><div class="ctot">' + money(j.total) + '</div><p class="muted">US dollars. Sales tax, if any, is worked out at checkout.</p>' +
        '<a class="btn primary" id="cartgo" href="#">Check out securely</a>' +
        '<p class="muted cfine">Stripe processes the payment. At checkout, type the name or company the licenses are for.</p>' +
        '<a class="btn" href="industrial">Keep shopping</a></div></div>';
      root.innerHTML = h;
      var lis = root.querySelectorAll('.cartlist li');
      j.items.forEach(function (it, i) {
        lis[i].querySelector('.ci b').textContent = it.name;
        lis[i].querySelector('.ci .muted').textContent = it.desc;
        var rm = lis[i].querySelector('.cartrm'); rm.dataset.id = it.id; rm.setAttribute('aria-label', 'Remove ' + it.name);
        rm.onclick = function () { remove(it.id); render(root); };
      });
      root.querySelector('#cartgo').href = API + '/cart?i=' + encodeURIComponent(j.items.map(function (x) { return x.id; }).join(','));
    }).catch(function () {
      root.innerHTML = '<div class="card"><h2>Your cart couldn’t load</h2><p class="muted">Please refresh the page in a minute. Nothing is lost: your items are saved in this browser.</p></div>';
    });
  }

  function start() { badge(); decorate(); page(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('storage', function (e) { if (e.key === KEY) { badge(); document.querySelectorAll('.cartadd').forEach(function (b) { if (b._r) b._r(); }); } });
})();
