// Syon Automation LLC — gated R&D viewer. Developed by Syon Automation LLC.
// Everything here is served ONLY by the worker after a password check; no R&D content or media lives in the public
// repo or in /public. Access: a master password (owner only, set in-browser) OR a single-use guest password the owner
// generates on demand. A guest password works once, opens a 30-minute view session, then the page re-locks until a new
// one is generated. View-only: media streams from a private R2 bucket behind the session cookie, marked no-store/noindex.
'use strict';

const enc = new TextEncoder();
const GUEST_TTL = 30 * 60;        // 30-minute guest view window
const MASTER_TTL = 8 * 60 * 60;   // owner stays in for 8 hours
const SESS = 'rdsess';

const jx = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
const sha256hex = async (t) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(t)))].map((b) => b.toString(16).padStart(2, '0')).join('');
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function signingKey(env) {
  let k = await env.DL.get('rd:sk');
  if (!k) { k = b64url(crypto.getRandomValues(new Uint8Array(32))); await env.DL.put('rd:sk', k); }
  return crypto.subtle.importKey('raw', fromB64url(k), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function makeToken(env, role, ttlSec) {
  const body = role + '.' + (Date.now() + ttlSec * 1000);
  const sig = b64url(await crypto.subtle.sign('HMAC', await signingKey(env), enc.encode(body)));
  return body + '.' + sig;
}
async function readToken(env, tok) {
  if (!tok) return null;
  const i = tok.lastIndexOf('.'); if (i < 0) return null;
  const body = tok.slice(0, i), sig = tok.slice(i + 1);
  const ok = await crypto.subtle.verify('HMAC', await signingKey(env), fromB64url(sig), enc.encode(body)).catch(() => false);
  if (!ok) return null;
  const [role, exp] = body.split('.');
  if (Date.now() > +exp) return null;
  return { role, exp: +exp };
}
const getCookie = (request, name) => { const m = (request.headers.get('cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]+)')); return m ? m[1] : null; };
const setCookie = (val, maxAge) => `${SESS}=${val}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
const session = (request, env) => readToken(env, getCookie(request, SESS));

// a readable one-time password: 3 short words + 2 digits, e.g. "amber-rotor-delta-47"
const WORDS = ['amber', 'rotor', 'delta', 'cobalt', 'quartz', 'ember', 'harbor', 'vector', 'copper', 'summit', 'cedar', 'falcon', 'ingot', 'lumen', 'onyx', 'pivot', 'relay', 'sigma', 'tidal', 'umber', 'verge', 'willow', 'axion', 'basalt'];
function makeGuestPassword() {
  const r = crypto.getRandomValues(new Uint8Array(4));
  return `${WORDS[r[0] % WORDS.length]}-${WORDS[r[1] % WORDS.length]}-${WORDS[r[2] % WORDS.length]}-${10 + (r[3] % 90)}`;
}

// manifest in KV 'rd:manifest' = { lines:[{ id, name, note, items:[{ id, type:'image'|'video', title, key, poster }] }] }
async function manifest(env) { try { return JSON.parse(await env.DL.get('rd:manifest')) || { lines: [] }; } catch (e) { return { lines: [] }; } }
async function findItem(env, id) {
  const m = await manifest(env);
  for (const line of m.lines) for (const it of line.items || []) if (it.id === id) return it;
  return null;
}

async function owner(request, env, isOwner) {
  const s = await session(request, env);
  if (s && s.role === 'master') return true;
  return isOwner ? isOwner(request, env) : false;
}

export async function handleRD(request, env, url, isOwner) {
  const p = url.pathname;

  if (p === '/rd' || p === '/rd/') return new Response(RD_PAGE, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow, noarchive' } });

  if (p === '/api/rd/status' && request.method === 'GET') {
    const s = await session(request, env);
    const otp = JSON.parse((await env.DL.get('rd:otp')) || 'null');
    return jx({ ok: true, role: s ? s.role : null, masterSet: !!(await env.DL.get('rd:master')), guestActive: !!(otp && !otp.used), ownerAuthed: await owner(request, env, isOwner) });
  }

  if (p === '/api/rd/enter' && request.method === 'POST') {
    let b; try { b = await request.json(); } catch (e) { return jx({ ok: false, error: 'bad' }, 400); }
    const pw = String(b.password || '').trim(); if (pw.length < 4) return jx({ ok: false, error: 'bad' }, 400);
    const h = await sha256hex(pw);
    const master = await env.DL.get('rd:master');
    if (master && h === master) { return jxCookie({ ok: true, role: 'master' }, 200, await makeToken(env, 'master', MASTER_TTL), MASTER_TTL); }
    const otp = JSON.parse((await env.DL.get('rd:otp')) || 'null');
    if (otp && !otp.used && h === otp.hash) {
      otp.used = true; otp.usedAt = Date.now(); await env.DL.put('rd:otp', JSON.stringify(otp));   // single use: consumed now
      return jxCookie({ ok: true, role: 'guest' }, 200, await makeToken(env, 'guest', GUEST_TTL), GUEST_TTL);
    }
    return jx({ ok: false, error: 'denied' }, 401);
  }

  if (p === '/api/rd/logout' && request.method === 'POST') return new Response('{"ok":true}', { headers: { 'content-type': 'application/json', 'set-cookie': setCookie('x', 0), 'cache-control': 'no-store' } });

  // ---- owner-only (master session or the site console password) ----
  if (p === '/api/rd/set-master' && request.method === 'POST') {
    if (!(await owner(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    let b; try { b = await request.json(); } catch (e) { return jx({ ok: false, error: 'bad' }, 400); }
    const pw = String(b.password || ''); if (pw.length < 8) return jx({ ok: false, error: 'too_short' }, 400);
    await env.DL.put('rd:master', await sha256hex(pw));
    return jx({ ok: true });
  }
  if (p === '/api/rd/gen' && request.method === 'POST') {
    if (!(await owner(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    const pw = makeGuestPassword();
    await env.DL.put('rd:otp', JSON.stringify({ hash: await sha256hex(pw), used: false, at: Date.now() }));  // overwrites any previous: only the newest works
    return jx({ ok: true, password: pw });
  }
  if (p === '/api/rd/revoke' && request.method === 'POST') {
    if (!(await owner(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    await env.DL.delete('rd:otp'); return jx({ ok: true });
  }
  // Owner generates a short-lived UPLOAD TOKEN (while signed in as master) so media can be loaded in without the
  // console password ever leaving the owner's hands. The token lasts 3 hours and only authorizes /api/rd/upload.
  if (p === '/api/rd/gen-upload' && request.method === 'POST') {
    if (!(await owner(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    const t = b64url(crypto.getRandomValues(new Uint8Array(18)));
    await env.DL.put('rd:upt', JSON.stringify({ hash: await sha256hex(t), exp: Date.now() + 3 * 3600 * 1000 }));
    return jx({ ok: true, token: t, expiresInMin: 180 });
  }
  // upload one media file (owner session or a valid upload token). Stored in KV under 'rdm:<key>' (<=25 MB each).
  if (p === '/api/rd/upload' && request.method === 'PUT') {
    if (!(await uploadAuthed(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    const key = url.searchParams.get('key'); if (!key || !/^[a-z0-9/_.\-]+$/i.test(key)) return jx({ ok: false, error: 'key' }, 400);
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 25 * 1024 * 1024) return jx({ ok: false, error: 'too_big', bytes: buf.byteLength }, 413);
    await env.DL.put('rdm:' + key, buf, { metadata: { ct: url.searchParams.get('ct') || 'application/octet-stream' } });
    return jx({ ok: true, key, bytes: buf.byteLength });
  }
  if (p === '/api/rd/manifest' && request.method === 'PUT') {
    if (!(await owner(request, env, isOwner))) return jx({ ok: false, error: 'auth' }, 403);
    let b; try { b = await request.json(); } catch (e) { return jx({ ok: false, error: 'bad' }, 400); }
    await env.DL.put('rd:manifest', JSON.stringify(b));
    return jx({ ok: true, lines: (b.lines || []).length });
  }

  // ---- viewing (any valid session) ----
  const sess = await session(request, env);
  if (p === '/api/rd/content' && request.method === 'GET') {
    if (!sess) return jx({ ok: false, error: 'locked' }, 401);
    const m = await manifest(env);
    const lines = m.lines.map((l) => ({ id: l.id, name: l.name, note: l.note || '', items: (l.items || []).map((it) => ({ id: it.id, type: it.type, title: it.title })) }));
    return jx({ ok: true, role: sess.role, expires: sess.exp, lines });
  }
  if (p === '/api/rd/media' && request.method === 'GET') {
    if (!sess) return new Response('locked', { status: 401 });
    const it = await findItem(env, url.searchParams.get('id') || ''); if (!it) return new Response('not found', { status: 404 });
    const r = await env.DL.getWithMetadata('rdm:' + it.key, { type: 'arrayBuffer' });
    if (!r || !r.value) return new Response('gone', { status: 404 });
    const full = r.value; const total = full.byteLength;
    const ct = (r.metadata && r.metadata.ct) || (it.type === 'video' ? 'video/mp4' : 'image/jpeg');
    const base = { 'cache-control': 'no-store, private', 'x-robots-tag': 'noindex', 'content-disposition': 'inline', 'content-type': ct, 'accept-ranges': 'bytes' };
    const range = request.headers.get('range');
    if (range) {
      const m2 = /bytes=(\d+)-(\d*)/.exec(range) || [];
      const start = +m2[1] || 0; const end = m2[2] ? Math.min(+m2[2], total - 1) : total - 1;
      return new Response(full.slice(start, end + 1), { status: 206, headers: { ...base, 'content-range': `bytes ${start}-${end}/${total}`, 'content-length': String(end - start + 1) } });
    }
    return new Response(full, { headers: { ...base, 'content-length': String(total) } });
  }
  return null; // not an RD route
}

// upload is allowed for the master session OR a valid, unexpired upload token (X-Upload-Token)
async function uploadAuthed(request, env, isOwner) {
  if (await owner(request, env, isOwner)) return true;
  const t = request.headers.get('x-upload-token'); if (!t) return false;
  const rec = JSON.parse((await env.DL.get('rd:upt')) || 'null');
  if (!rec || Date.now() > rec.exp) return false;
  return (await sha256hex(t)) === rec.hash;
}

// jx variant that also sets the session cookie
function jxCookie(o, s, tok, ttl) { const h = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }; if (tok) h['set-cookie'] = setCookie(tok, ttl); return new Response(JSON.stringify(o), { status: s || 200, headers: h }); }

export const RD_PAGE = `<!doctype html><html lang="en" data-theme="dark"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive">
<title>Syon Automation R&amp;D</title>
<style>
:root{--bg:#0b1220;--panel:#111c2e;--panel2:#16233a;--line:#223150;--text:#e6eef8;--muted:#93a4ba;--gold:#ffc53d;--accent:#2fa4ff;--red:#ff6b5a;--green:#4fd39a}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
a{color:var(--accent)}.wrap{max-width:1180px;margin:0 auto;padding:22px 16px}
header{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line);padding:14px 16px}
.brand{font-weight:800;letter-spacing:.2px}.brand b{color:var(--gold)}
.tag{margin-left:auto;font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:3px 10px}
.gate{max-width:430px;margin:9vh auto;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:26px}
.gate h1{font-size:20px;margin:0 0 4px}.gate p{color:var(--muted);margin:0 0 18px}
input[type=password],input[type=text]{width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:10px;color:var(--text);padding:11px 12px;font-size:15px}
.btn{background:var(--panel2);border:1px solid var(--line);border-radius:10px;color:var(--text);padding:10px 16px;cursor:pointer;font-size:15px}
.btn:hover{border-color:var(--accent)}.btn.primary{background:var(--gold);border-color:var(--gold);color:#1a1205;font-weight:700}
.btn.big{padding:12px 20px;font-size:16px;width:100%;margin-top:14px}
.msg{min-height:20px;margin-top:10px;font-size:14px;color:var(--red)}
.ownerbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:14px 0}
.ownerbar .grow{flex:1}.pwout{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:18px;color:var(--gold);background:#0c1626;border:1px dashed var(--line);border-radius:8px;padding:8px 12px}
.line{margin:26px 0}.line h2{font-size:17px;margin:0 0 2px}.line .note{color:var(--muted);font-size:13px;margin:0 0 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:12px;overflow:hidden}
.tile .m{position:relative;background:#000;aspect-ratio:16/10;display:flex;align-items:center;justify-content:center}
.tile img,.tile video{max-width:100%;max-height:100%;display:block;-webkit-user-drag:none;user-select:none}
.tile .cap{padding:9px 11px;font-size:13px;color:var(--muted)}
.wm{position:absolute;inset:0;pointer-events:none;display:flex;align-items:center;justify-content:center;font-size:12px;color:rgba(255,255,255,.14);transform:rotate(-20deg);letter-spacing:2px}
.foot{color:var(--muted);font-size:12px;border-top:1px solid var(--line);padding:16px;text-align:center}
.hidden{display:none}.countdown{color:var(--muted);font-size:13px}
</style></head>
<body oncontextmenu="return false" ondragstart="return false">
<header><span class="brand">Syon <b>Automation</b> LLC</span><span class="tag">R&amp;D · Confidential</span></header>

<div id="gate" class="gate">
  <h1>R&amp;D access</h1>
  <p>Enter your access password. This area is confidential and access is logged.</p>
  <input id="pw" type="password" autocomplete="off" placeholder="Access password" autofocus>
  <button class="btn primary big" id="go">Unlock</button>
  <div class="msg" id="m"></div>
  <div id="setup" class="hidden" style="margin-top:16px;border-top:1px solid var(--line);padding-top:14px">
    <p style="color:var(--muted);font-size:13px;margin:0 0 8px">No master password is set yet. Set one using your owner console password.</p>
    <input id="ck" type="password" autocomplete="off" placeholder="Owner console password" style="margin-bottom:8px">
    <input id="nm" type="password" autocomplete="off" placeholder="New master password (8+ characters)">
    <button class="btn big" id="setBtn">Set master password</button>
  </div>
</div>

<div id="app" class="wrap hidden">
  <div class="ownerbar" id="obar">
    <div class="grow"><b>Owner controls</b> <span class="countdown" id="cd"></span></div>
    <button class="btn" id="genBtn">Generate guest password</button>
    <button class="btn" id="uptBtn" title="Short-lived token to load media into this page">Upload token</button>
    <button class="btn" id="chgBtn">Change master</button>
    <button class="btn" id="out">Lock</button>
  </div>
  <div id="genout" class="ownerbar hidden"><div class="grow">Give this one-time password to the viewer. It works once, for 30 minutes, then the page re-locks.<br><span class="pwout" id="pwv"></span></div><button class="btn" id="copy">Copy</button></div>
  <div id="uptout" class="ownerbar hidden"><div class="grow">Upload token (valid 3 hours) &mdash; used only to load media into this page:<br><span class="pwout" id="uptv"></span></div><button class="btn" id="uptcopy">Copy</button></div>
  <div id="guestbar" class="ownerbar hidden"><div class="grow">Viewing as guest. <span class="countdown" id="cd2"></span> View only — downloading is disabled.</div><button class="btn" id="out2">Leave</button></div>
  <div id="content"></div>
  <div class="foot">Syon Automation LLC — confidential R&amp;D. Developed by Syon Automation.</div>
</div>

<script>
const $=s=>document.querySelector(s); let ROLE=null, EXP=0, tick=null;
async function api(path,opts){const r=await fetch(path,Object.assign({credentials:'same-origin',headers:{'content-type':'application/json'}},opts));return r.json().catch(()=>({ok:false}));}
async function status(){return api('/api/rd/status');}
function fmtLeft(){const s=Math.max(0,Math.floor((EXP-Date.now())/1000));const m=Math.floor(s/60),ss=String(s%60).padStart(2,'0');return m+':'+ss;}
function startCountdown(){clearInterval(tick);const upd=()=>{const t='Session ends in '+fmtLeft();const a=$('#cd'),b=$('#cd2');if(a)a.textContent=t;if(b)b.textContent=t;if(Date.now()>EXP)location.reload();};upd();tick=setInterval(upd,1000);}
async function boot(){const s=await status();if(s.role){ROLE=s.role;EXP=s.expires||(Date.now()+ (s.role==='guest'?1800:28800)*1000);return show();}
  $('#gate').classList.remove('hidden');$('#app').classList.add('hidden');
  if(!s.masterSet){$('#setup').classList.remove('hidden');}}
async function show(){const c=await api('/api/rd/content');if(!c.ok){return boot();}
  ROLE=c.role;if(c.expires)EXP=c.expires;$('#gate').classList.add('hidden');$('#app').classList.remove('hidden');
  $('#obar').classList.toggle('hidden',ROLE!=='master');$('#guestbar').classList.toggle('hidden',ROLE!=='guest');startCountdown();
  const wrap=$('#content');wrap.innerHTML=(c.lines||[]).map(function(l){return '<div class=line><h2>'+esc(l.name)+'</h2><p class=note>'+esc(l.note||'')+'</p><div class=grid>'+
    (l.items||[]).map(function(it){return '<div class=tile><div class=m data-id="'+it.id+'" data-type="'+it.type+'"><div class=wm>SYON · CONFIDENTIAL</div></div><div class=cap>'+esc(it.title||'')+'</div></div>';}).join('')+'</div></div>';}).join('')||'<p class=note>No items yet.</p>';
  loadMedia();}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);}
async function loadMedia(){for(const el of document.querySelectorAll('.m[data-id]')){const id=el.dataset.id,type=el.dataset.type;const src='/api/rd/media?id='+encodeURIComponent(id);
  if(type==='video'){const v=document.createElement('video');v.src=src;v.controls=true;v.preload='metadata';v.setAttribute('controlsList','nodownload noremoteplayback noplaybackrate');v.disablePictureInPicture=true;v.oncontextmenu=()=>false;el.insertBefore(v,el.firstChild);}
  else{try{const r=await fetch(src,{credentials:'same-origin'});const b=await r.blob();const img=document.createElement('img');img.src=URL.createObjectURL(b);img.oncontextmenu=()=>false;el.insertBefore(img,el.firstChild);}catch(e){}}}}
$('#go').onclick=async()=>{const pw=$('#pw').value.trim();if(!pw)return;$('#m').textContent='';const r=await api('/api/rd/enter',{method:'POST',body:JSON.stringify({password:pw})});if(r.ok){location.reload();}else{$('#m').textContent='That password is not valid or has already been used.';}};
$('#pw').addEventListener('keydown',e=>{if(e.key==='Enter')$('#go').click();});
$('#setBtn')&&($('#setBtn').onclick=async()=>{const ck=$('#ck').value.trim(),nm=$('#nm').value;if(nm.length<8){$('#m').textContent='Master password must be at least 8 characters.';return;}const r=await fetch('/api/rd/set-master',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json','x-admin-key':ck},body:JSON.stringify({password:nm})}).then(x=>x.json()).catch(()=>({ok:false}));if(r.ok){$('#m').style.color='var(--green)';$('#m').textContent='Master password set. Enter it above to unlock.';$('#setup').classList.add('hidden');}else{$('#m').textContent=r.error==='auth'?'Owner console password was not accepted.':'Could not set it ('+(r.error||'error')+').';}});
$('#genBtn')&&($('#genBtn').onclick=async()=>{const r=await api('/api/rd/gen',{method:'POST'});if(r.ok){$('#genout').classList.remove('hidden');$('#pwv').textContent=r.password;}});
$('#copy')&&($('#copy').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($('#pwv').textContent);$('#copy').textContent='Copied';setTimeout(()=>$('#copy').textContent='Copy',1500);});
$('#uptBtn')&&($('#uptBtn').onclick=async()=>{const r=await api('/api/rd/gen-upload',{method:'POST'});if(r.ok){$('#uptout').classList.remove('hidden');$('#uptv').textContent=r.token;}});
$('#uptcopy')&&($('#uptcopy').onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText($('#uptv').textContent);$('#uptcopy').textContent='Copied';setTimeout(()=>$('#uptcopy').textContent='Copy',1500);});
$('#chgBtn')&&($('#chgBtn').onclick=()=>{const np=prompt('New master password (8+ characters):');if(np&&np.length>=8){fetch('/api/rd/set-master',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({password:np})}).then(x=>x.json()).then(r=>alert(r.ok?'Master password changed.':'Failed.'));}else if(np){alert('Too short.');}});
const lock=async()=>{await api('/api/rd/logout',{method:'POST'});location.reload();};
$('#out')&&($('#out').onclick=lock);$('#out2')&&($('#out2').onclick=lock);
boot();
</script></body></html>`;
