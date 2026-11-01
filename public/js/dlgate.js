/* Download sign-in: asks for name, email, address and an optional comment before any software download,
   records it (POST /api/download) and then starts the download. Developed by Syon Automation LLC. */
(function () {
  'use strict';
  const IS_DL = /(\/releases\/download\/|^\/?download\/|\/download\/)[^?#]+\.(exe|msi|zip)(\?|#|$)/i;
  const productOf = (href) => {
    const f = decodeURIComponent(href.split(/[?#]/)[0].split('/').pop() || '');
    return { file: f, product: f.replace(/[-_ ]?Setup.*$/i, '').replace(/\.(exe|msi|zip)$/i, '').replace(/[-_]+/g, ' ').trim() || 'Software' };
  };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('syon.dl') || '{}') || {}; } catch (e) { saved = {}; }
  const css = `
.dlg-back{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)}
.dlg{width:100%;max-width:520px;max-height:calc(100vh - 32px);overflow:auto;background:#0b0f16;border:1px solid #24354f;border-radius:20px;padding:24px;color:#e8eef5;font-family:inherit;box-shadow:0 30px 90px rgba(0,0,0,.6)}
.dlg h2{margin:0 0 4px;font-size:22px;line-height:1.25}.dlg p{margin:0 0 16px;color:#9fb0bf;font-size:14px;line-height:1.5}
.dlg label{display:block;font-size:13px;font-weight:600;margin:12px 0 6px;color:#cfd8e2}.dlg label i{font-style:normal;color:#36cfc9}
.dlg input,.dlg textarea{width:100%;box-sizing:border-box;background:#0c1626;color:#e8eef5;border:1px solid #24354f;border-radius:12px;padding:11px 13px;font:inherit;font-size:15px}
.dlg input:focus,.dlg textarea:focus{outline:none;border-color:#2fa4ff;box-shadow:0 0 0 3px rgba(47,164,255,.2)}
.dlg textarea{min-height:72px;resize:vertical}.dlg .err{color:#ff9b9b;font-size:13px;min-height:18px;margin-top:10px}
.dlg .row{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;margin-top:14px}
.dlg button{border-radius:999px;padding:11px 20px;font:700 15px inherit;font-family:inherit;cursor:pointer;border:1px solid #2b3a50;background:transparent;color:#e8eef5}
.dlg button.go{background:#2fa4ff;border-color:#2fa4ff;color:#03111f}.dlg .fine{font-size:12px;color:#8a9bb0;margin:14px 0 0}.dlg .fine a{color:#2fa4ff}`;
  function open(a, href) {
    const { product, file } = productOf(href);
    if (!document.getElementById('dlg-css')) { const st = document.createElement('style'); st.id = 'dlg-css'; st.textContent = css; document.head.appendChild(st); }
    const back = document.createElement('div'); back.className = 'dlg-back';
    back.innerHTML = `<form class="dlg" role="dialog" aria-modal="true" aria-labelledby="dlg-t" novalidate>
      <h2 id="dlg-t">Download ${esc(product)}</h2>
      <p>Tell us who you are and your download starts right away. We use this to support you and to send important updates. We never sell it.</p>
      <label for="dlg-n">Name <i>*</i></label><input id="dlg-n" name="name" autocomplete="name" required value="${esc(saved.name)}">
      <label for="dlg-e">Email <i>*</i></label><input id="dlg-e" name="email" type="email" autocomplete="email" required value="${esc(saved.email)}">
      <label for="dlg-a">Address <i>*</i></label><input id="dlg-a" name="address" autocomplete="street-address" placeholder="Street, city, state or province, ZIP, country" required value="${esc(saved.address)}">
      <label for="dlg-c">Comments</label><textarea id="dlg-c" name="comment" placeholder="Your experience, what you'll use it for, or a question (optional)"></textarea>
      <div class="err" id="dlg-err" aria-live="polite"></div>
      <div class="row"><button type="button" class="no">Cancel</button><button type="submit" class="go">Continue to download</button></div>
      <p class="fine">Syon Automation LLC also records the download, the file, the time and the approximate location of your internet connection. See our <a href="privacy.html" target="_blank" rel="noopener">privacy policy</a>.</p>
    </form>`;
    document.body.appendChild(back); const f = back.querySelector('form'); const prev = document.activeElement;
    const close = () => { back.remove(); document.removeEventListener('keydown', onKey); if (prev && prev.focus) prev.focus(); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    back.addEventListener('mousedown', (e) => { if (e.target === back) close(); });
    f.querySelector('.no').onclick = close;
    setTimeout(() => (f.querySelector(saved.name ? '#dlg-c' : '#dlg-n')).focus(), 30);
    f.onsubmit = async (e) => {
      e.preventDefault();
      const q = (id) => f.querySelector('#' + id); const d = { name: q('dlg-n').value.trim(), email: q('dlg-e').value.trim(), address: q('dlg-a').value.trim(), comment: q('dlg-c').value.trim() };
      const err = f.querySelector('#dlg-err');
      if (!d.name) { err.textContent = 'Please enter your name.'; q('dlg-n').focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { err.textContent = 'Please enter a valid email address.'; q('dlg-e').focus(); return; }
      if (!d.address) { err.textContent = 'Please enter your address.'; q('dlg-a').focus(); return; }
      try { localStorage.setItem('syon.dl', JSON.stringify({ name: d.name, email: d.email, address: d.address })); saved = d; } catch (x) { }
      const btn = f.querySelector('.go'); btn.disabled = true; btn.textContent = 'Starting download…';
      try {
        await Promise.race([
          fetch('/api/download', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign(d, { product, file, url: href, page: location.pathname })) }),
          new Promise((r) => setTimeout(r, 2500))
        ]);
      } catch (x) { /* never block the download */ }
      close(); window.location.href = href;
    };
  }
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.hasAttribute('data-no-gate')) return;
    const href = a.href; if (!IS_DL.test(new URL(href, location.href).pathname)) return;
    e.preventDefault(); open(a, href);
  }, true);
})();
