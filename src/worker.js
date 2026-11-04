// syonautomation.com Worker. Developed by Syon Automation LLC.
// Static pages come from ./public (ASSETS). This script only answers:
//   POST /api/download        download sign-in form (who downloaded what) -> KV "DL"
//   GET  /downloads-admin     owner page: download counts and visitor list (needs the owner key)
//   GET  /api/downloads       data for that page (header X-Admin-Key): downloads, guide sign-ups, reviews
//   POST /api/lead            free-guide sign-up (email, optional name/company) -> KV "ld:"
//   POST /api/review          customer review (kept private until the owner chooses to publish it) -> KV "rv:"
//   POST /api/event           app interest from js/apps.js: product page view, hover preview, click to an app page, Buy / Add to cart click -> KV "ev:"
//   GET  /api/events          owner: app-interest totals for the last N days and the recent activity list (header X-Admin-Key)
// The owner key itself is NOT in this public repo; only its SHA-256 hash is.
const ADMIN_HASH = "041b1b7792067d26196a244920c80fe2b40e44d337fce8f1b001bc7788bc0578";
const MAX = { product: 60, file: 200, url: 400, name: 120, address: 300, email: 160, comment: 2000, page: 300 };
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const sha256 = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");
const clip = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/download" && request.method === "POST") return record(request, env);
    if (url.pathname === "/api/lead" && request.method === "POST") return lead(request, env);
    if (url.pathname === "/api/review" && request.method === "POST") return review(request, env);
    if (url.pathname === "/api/event" && request.method === "POST") return event(request, env);
    if (url.pathname === "/api/events" && request.method === "GET") return events(request, env, url);
    if (url.pathname === "/api/downloads" && request.method === "GET") return list(request, env, url);
    if (url.pathname === "/api/downloads" && request.method === "DELETE") return remove(request, env, url);
    if (url.pathname === "/downloads-admin") return new Response(ADMIN_PAGE, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
    return env.ASSETS.fetch(request);
  },
};

async function record(request, env) {
  let b; try { b = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
  const r = {}; for (const k of Object.keys(MAX)) r[k] = clip(b[k], MAX[k]);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) return json({ ok: false, error: "missing" }, 400);
  if (!r.product) r.product = "Unknown";
  const cf = request.cf || {}; const h = request.headers;
  const now = Date.now();
  Object.assign(r, {
    at: new Date(now).toISOString(), ip: h.get("cf-connecting-ip") || "", country: cf.country || "", region: cf.region || "", city: cf.city || "",
    postal: cf.postalCode || "", timezone: cf.timezone || "", org: cf.asOrganization || "", ua: clip(h.get("user-agent"), 300), lang: clip(h.get("accept-language"), 80), referer: clip(h.get("referer"), 300),
  });
  const id = String(9999999999999 - now).padStart(13, "0") + "-" + crypto.randomUUID().slice(0, 8); // newest first in KV listings
  await env.DL.put("dl:" + id, JSON.stringify(r), { expirationTtl: 94608000 }); // 3 years, as the privacy policy says
  const key = "count:" + r.product.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const c = (parseInt(await env.DL.get(key), 10) || 0) + 1; await env.DL.put(key, String(c), { metadata: { product: r.product } });
  const t = (parseInt(await env.DL.get("count-total"), 10) || 0) + 1; await env.DL.put("count-total", String(t));
  return json({ ok: true });
}

const newId = (now) => String(9999999999999 - now).padStart(13, "0") + "-" + crypto.randomUUID().slice(0, 8);
const where = (request) => { const cf = request.cf || {}; const h = request.headers; return { ip: h.get("cf-connecting-ip") || "", country: cf.country || "", region: cf.region || "", city: cf.city || "", org: cf.asOrganization || "", ua: clip(h.get("user-agent"), 300) }; };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Free guide sign-up: email required; name, company and source page optional.
async function lead(request, env) {
  let b; try { b = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
  if (b.website) return json({ ok: true }); // honeypot: bots fill every field
  const r = { email: clip(b.email, 160), name: clip(b.name, 120), company: clip(b.company, 160), guide: clip(b.guide, 80), page: clip(b.page, 300) };
  if (!EMAIL.test(r.email)) return json({ ok: false, error: "email" }, 400);
  const now = Date.now(); Object.assign(r, { at: new Date(now).toISOString() }, where(request));
  await env.DL.put("ld:" + newId(now), JSON.stringify(r), { expirationTtl: 94608000 }); // 3 years
  return json({ ok: true });
}

// Customer review: stays private; the owner decides what (if anything) is published.
async function review(request, env) {
  let b; try { b = await request.json(); } catch (e) { return json({ ok: false, error: "bad_json" }, 400); }
  if (b.website) return json({ ok: true });
  const r = { name: clip(b.name, 120), role: clip(b.role, 120), company: clip(b.company, 160), email: clip(b.email, 160), product: clip(b.product, 60), text: clip(b.text, 3000), rating: Math.max(1, Math.min(5, parseInt(b.rating, 10) || 5)), publish: !!b.publish };
  if (!r.name || r.text.length < 10) return json({ ok: false, error: "missing" }, 400);
  if (r.email && !EMAIL.test(r.email)) return json({ ok: false, error: "email" }, 400);
  const now = Date.now(); Object.assign(r, { at: new Date(now).toISOString() }, where(request));
  await env.DL.put("rv:" + newId(now), JSON.stringify(r));
  return json({ ok: true });
}

// App interest. One KV key per action; everything lives in the key's metadata so the owner page can read it from a listing.
// No IP address is stored, only the approximate place and network name Cloudflare reports. Kept about 13 months.
const APPS = ["plantproof", "datumline", "datumlab", "techproof", "linkscout", "sitewatch", "datacast", "rungwise", "wo-mailer", "controldraft", "portproof", "aoifoundry", "depthforge"];
const EV_TYPES = ["view", "preview", "click", "buy"];
async function event(request, env) {
  let b; try { b = JSON.parse(await request.text()); } catch (e) { return json({ ok: false }, 400); }
  const ua = request.headers.get("user-agent") || "";
  if (/bot|crawl|spider|slurp|headless|lighthouse/i.test(ua)) return json({ ok: true });
  const t = clip(b.t, 10), p = clip(b.p, 30);
  if (!EV_TYPES.includes(t) || !APPS.includes(p)) return json({ ok: false }, 400);
  const cf = request.cf || {}; const now = Date.now();
  const m = { at: now, t, p, s: clip(b.s, 60), ref: clip(b.ref, 80), d: clip(b.d, 20), c: cf.country || "", r: clip(cf.region, 40), ci: clip(cf.city, 40), o: clip(cf.asOrganization, 80) };
  await env.DL.put("ev:" + newId(now), "1", { metadata: m, expirationTtl: 34300000 }); // about 13 months
  return json({ ok: true });
}
async function events(request, env, url) {
  if (!(await isOwner(request))) return json({ ok: false, error: "key" }, 403);
  const days = Math.max(1, Math.min(400, parseInt(url.searchParams.get("days"), 10) || 30));
  const since = Date.now() - days * 86400000;
  const tot = {}; const recent = []; let cur, n = 0, done = false, calls = 0;
  do {
    const pg = await env.DL.list({ prefix: "ev:", cursor: cur, limit: 1000 }); calls++;
    for (const k of pg.keys) {
      const m = k.metadata; if (!m) continue;
      if (m.at < since) { done = true; break; }
      const a = tot[m.p] || (tot[m.p] = { view: 0, preview: 0, click: 0, buy: 0 }); if (m.t in a) a[m.t]++;
      n++; if (recent.length < 300) recent.push(Object.assign({ id: k.name }, m));
    }
    cur = pg.list_complete || done ? null : pg.cursor;
  } while (cur && calls < 60);
  return json({ ok: true, days, events: n, totals: tot, recent });
}

// The owner can sign in with this page's own key OR the License console password (ADMIN_TOKEN of licenses.syonautomation.com).
// The console password is never stored here: it is checked by asking the license service, which answers 401 when it is wrong.
const OK_KEYS = new Map(); // sha256(key) -> time it was confirmed (kept 10 minutes per Worker instance)
const isOwner = async (request) => {
  const k = (request.headers.get("x-admin-key") || "").trim(); if (k.length < 8) return false;
  const h = await sha256(k); if (h === ADMIN_HASH) return true;
  const t = OK_KEYS.get(h); if (t && Date.now() - t < 600000) return true;
  try {
    const r = await fetch("https://licenses.syonautomation.com/admin/api/owner-check", { headers: { Authorization: "Bearer " + k } });
    if (r.status === 401) return false;
    const j = await r.json().catch(() => ({}));
    if (j.error === "unknown_action") { OK_KEYS.set(h, Date.now()); return true; }
  } catch (e) {}
  return false;
};

// Delete one download record (test entries) and take it off the counts.
async function remove(request, env, url) {
  if (!(await isOwner(request))) return json({ ok: false, error: "key" }, 403);
  const id = url.searchParams.get("id") || "";
  if (/^(ld|rv):[0-9]{13}-[0-9a-f]{8}$/.test(id)) { await env.DL.delete(id); return json({ ok: true }); }
  if (!/^dl:[0-9]{13}-[0-9a-f]{8}$/.test(id)) return json({ ok: false, error: "id" }, 400);
  const v = await env.DL.get(id); if (!v) return json({ ok: false, error: "gone" }, 404);
  const r = JSON.parse(v); await env.DL.delete(id);
  const key = "count:" + String(r.product || "Unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const meta = (await env.DL.getWithMetadata(key)).metadata || { product: r.product };
  const c = Math.max(0, (parseInt(await env.DL.get(key), 10) || 0) - 1);
  if (c) await env.DL.put(key, String(c), { metadata: meta }); else await env.DL.delete(key);
  const t = Math.max(0, (parseInt(await env.DL.get("count-total"), 10) || 0) - 1); await env.DL.put("count-total", String(t));
  return json({ ok: true });
}

async function list(request, env, url) {
  if (!(await isOwner(request))) return json({ ok: false, error: "key" }, 403);
  const counts = []; let cur;
  do { const p = await env.DL.list({ prefix: "count:", cursor: cur }); for (const x of p.keys) counts.push({ product: (x.metadata && x.metadata.product) || x.name.slice(6), count: parseInt(await env.DL.get(x.name), 10) || 0 }); cur = p.list_complete ? null : p.cursor; } while (cur);
  const limit = Math.min(1000, parseInt(url.searchParams.get("limit"), 10) || 300);
  const rows = []; cur = undefined;
  do { const p = await env.DL.list({ prefix: "dl:", cursor: cur, limit: Math.min(1000, limit - rows.length) }); for (const x of p.keys) { const v = await env.DL.get(x.name); if (v) rows.push(Object.assign(JSON.parse(v), { id: x.name })); } cur = p.list_complete || rows.length >= limit ? null : p.cursor; } while (cur);
  const grab = async (prefix) => { const out = []; let c; do { const p = await env.DL.list({ prefix, cursor: c, limit: 1000 }); for (const x of p.keys) { const v = await env.DL.get(x.name); if (v) out.push(Object.assign(JSON.parse(v), { id: x.name })); } c = p.list_complete || out.length >= 1000 ? null : p.cursor; } while (c); return out; };
  return json({ ok: true, total: parseInt(await env.DL.get("count-total"), 10) || 0, counts: counts.filter((c) => c.count > 0).sort((a, b) => b.count - a.count), rows, leads: await grab("ld:"), reviews: await grab("rv:") });
}

const ADMIN_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Owner page · Syon Automation LLC</title><style>
:root{color-scheme:dark}body{margin:0;background:#000;color:#e8eef5;font:15px/1.5 Manrope,Segoe UI,system-ui,sans-serif}
.w{max-width:1200px;margin:0 auto;padding:28px 16px}h1{font-size:26px;margin:0 0 4px}.m{color:#8a9bb0}
input{background:#0c1626;color:#e8eef5;border:1px solid #24354f;border-radius:999px;padding:10px 16px;font:inherit;width:260px}
button{background:#2fa4ff;color:#03111f;border:0;border-radius:999px;padding:10px 18px;font:700 14px inherit;cursor:pointer;margin-left:6px}
.cards{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}.c{background:#0b1220;border:1px solid #24354f;border-radius:14px;padding:12px 16px;min-width:150px}.c b{display:block;font-size:26px;color:#36cfc9}
.tw{overflow:auto;border:1px solid #24354f;border-radius:14px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{padding:8px 10px;border-bottom:1px solid #1b2a40;text-align:left;vertical-align:top}th{background:#0b1220;position:sticky;top:0}
td.cm{max-width:320px;white-space:pre-wrap}button.del{background:transparent;color:#ff9b9b;border:1px solid #7a2626;margin:0;padding:6px 12px;font-size:12px}button.del:hover{background:#2a0f0f}.err{color:#ff9b9b}select{background:#0c1626;color:#e8eef5;border:1px solid #24354f;border-radius:999px;padding:9px 14px;font:inherit}.bar{height:10px;border-radius:6px;background:linear-gradient(90deg,#2fa4ff,#36cfc9)}td.n{text-align:right;font-variant-numeric:tabular-nums}
</style></head><body><div class="w"><h1>Website owner page</h1><p class="m">Which apps visitors look at, who downloaded which software, who asked for the free guide, and what customers wrote, all from syonautomation.com. Developed by Syon Automation LLC.</p>
<p><input id="k" type="password" placeholder="Owner key or License console password" autocomplete="current-password"><button id="go">Show</button><button id="csv" style="display:none">Save as CSV</button> <span id="msg" class="err"></span></p>
<div id="ai" style="display:none"><h2 style="margin:24px 0 6px">What visitors look at</h2><p class="m">Which apps people open, preview and click on syonautomation.com. <b>Page views</b>: the app's own page was opened. <b>Previews</b>: the description box was open on an app card for at least 0.8 s. <b>Clicks</b>: a link to the app's page was clicked from another page. <b>Buy clicks</b>: a Buy, Buy now or Add to cart button for that app. <b>Downloads</b>: free-trial downloads in the same period. Each is counted once per app per visit. Your own browser is not counted once you sign in here.</p>
<p><select id="days"><option value="1">Last 24 hours</option><option value="7">Last 7 days</option><option value="30" selected>Last 30 days</option><option value="90">Last 90 days</option><option value="365">Last 12 months</option></select> <button id="ecsv" style="font-size:12px;padding:6px 12px">Save activity as CSV</button> <span id="emsg" class="m"></span></p>
<div class="tw"><table><thead><tr><th>App</th><th>Page views</th><th>Previews</th><th>Clicks</th><th>Buy clicks</th><th>Downloads</th><th style="width:34%">Interest <span class="m" style="font-weight:400">(buy clicks and downloads count 3 times)</span></th></tr></thead><tbody id="eb"></tbody></table></div>
<h3 style="margin:22px 0 6px">Recent activity</h3><div class="tw" style="max-height:420px"><table><thead><tr><th>When (your time)</th><th>App</th><th>What they did</th><th>On page</th><th>Location (from IP)</th><th>Company network</th><th>Came from</th><th>Device</th></tr></thead><tbody id="er"></tbody></table></div><h2 style="margin:30px 0 6px">Downloads</h2></div>
<div id="cards" class="cards"></div><div class="tw" id="tw" style="display:none"><table><thead><tr><th>When (your time)</th><th>Product</th><th>Name</th><th>Email</th><th>Address</th><th>Comment</th><th>Location (from IP)</th><th>Company network</th><th>IP</th><th>Device</th><th></th></tr></thead><tbody id="tb"></tbody></table></div>
<div id="more" style="display:none"><h2 style="margin:30px 0 8px">Reviews</h2><p class="m">Customer reviews stay private. "OK to publish" means the customer gave permission; tell Claude which ones to put on the website.</p><div class="tw"><table><thead><tr><th>When</th><th>Product</th><th>Stars</th><th>Review</th><th>Name</th><th>Role / company</th><th>Email</th><th>OK to publish</th><th></th></tr></thead><tbody id="rb"></tbody></table></div>
<h2 style="margin:30px 0 8px">Free guide sign-ups <button id="lcsv" style="font-size:12px;padding:6px 12px">Save as CSV</button></h2><p class="m">People who asked for the free troubleshooting guide. Email them about a trial or a new release.</p><div class="tw"><table><thead><tr><th>When</th><th>Email</th><th>Name</th><th>Company</th><th>Location (from IP)</th><th>Company network</th><th></th></tr></thead><tbody id="lb"></tbody></table></div></div></div>
<script>
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));let D=null;
try{const s=sessionStorage.getItem('dlk');if(s)document.getElementById('k').value=s}catch(e){}
async function load(){const k=document.getElementById('k').value.trim();if(!k)return;const r=await fetch('/api/downloads?limit=1000',{headers:{'X-Admin-Key':k}});const j=await r.json();
if(!j.ok){document.getElementById('msg').textContent='That key is not right. Use your License console password or this page\\'s owner key.';return}try{sessionStorage.setItem('dlk',k)}catch(e){}document.getElementById('msg').textContent='';D=j;
document.getElementById('cards').innerHTML='<div class="c">All downloads<b>'+j.total+'</b></div>'+j.counts.map(c=>'<div class="c">'+E(c.product)+'<b>'+c.count+'</b></div>').join('');
document.getElementById('tb').innerHTML=j.rows.map(r=>'<tr><td>'+E(new Date(r.at).toLocaleString())+'</td><td>'+E(r.product)+'<div class="m">'+E(r.file)+'</div></td><td>'+E(r.name)+'</td><td><a style="color:#2fa4ff" href="mailto:'+E(r.email)+'">'+E(r.email)+'</a></td><td>'+E(r.address)+'</td><td class="cm">'+E(r.comment)+'</td><td>'+E([r.city,r.region,r.postal,r.country].filter(Boolean).join(', '))+'</td><td>'+E(r.org)+'</td><td>'+E(r.ip)+'</td><td class="m">'+E(r.ua)+'</td><td><button class="del" data-id="'+E(r.id)+'" title="Delete this entry">Delete</button></td></tr>').join('')||'<tr><td colspan="11" class="m">No downloads yet.</td></tr>';
document.getElementById('tw').style.display='';document.getElementById('csv').style.display='';
document.getElementById('rb').innerHTML=(j.reviews||[]).map(r=>'<tr><td>'+E(new Date(r.at).toLocaleString())+'</td><td>'+E(r.product)+'</td><td>'+'★'.repeat(r.rating||0)+'</td><td class="cm">'+E(r.text)+'</td><td>'+E(r.name)+'</td><td>'+E([r.role,r.company].filter(Boolean).join(', '))+'</td><td>'+E(r.email)+'</td><td>'+(r.publish?'Yes':'No')+'</td><td><button class="del" data-id="'+E(r.id)+'">Delete</button></td></tr>').join('')||'<tr><td colspan="9" class="m">No reviews yet.</td></tr>';
document.getElementById('lb').innerHTML=(j.leads||[]).map(r=>'<tr><td>'+E(new Date(r.at).toLocaleString())+'</td><td><a style="color:#2fa4ff" href="mailto:'+E(r.email)+'">'+E(r.email)+'</a></td><td>'+E(r.name)+'</td><td>'+E(r.company)+'</td><td>'+E([r.city,r.region,r.country].filter(Boolean).join(', '))+'</td><td>'+E(r.org)+'</td><td><button class="del" data-id="'+E(r.id)+'">Delete</button></td></tr>').join('')||'<tr><td colspan="7" class="m">No sign-ups yet.</td></tr>';
document.getElementById('more').style.display='';try{localStorage.setItem('syNoTrack','1')}catch(e){}loadEv()}
const NAMES={plantproof:'PlantProof',datumline:'Datumline',datumlab:'DatumLab',techproof:'TechProof',linkscout:'LinkScout',sitewatch:'SiteWatch',datacast:'DataCast',rungwise:'RungWise PLC Academy','wo-mailer':'WO Mailer',controldraft:'ControlDraft',portproof:'PortProof',aoifoundry:'AOI Foundry',depthforge:'DepthForge'};
const ACT={view:'Opened the app page',preview:'Read the preview box',click:'Clicked through to the app',buy:'Clicked Buy / Add to cart'};
const slugOf=n=>{n=String(n||'').toLowerCase();if(!n)return'';for(const k in NAMES){const v=NAMES[k].toLowerCase();if(n===v||n===k||n.replace(/[^a-z]/g,'')===k.replace(/-/g,'')||v.startsWith(n))return k}return''};let EV=null;
async function loadEv(){const k=document.getElementById('k').value.trim();const days=+document.getElementById('days').value;document.getElementById('emsg').textContent='Loading…';
const r=await fetch('/api/events?days='+days,{headers:{'X-Admin-Key':k}});const j=await r.json().catch(()=>({}));if(!j.ok){document.getElementById('emsg').textContent='Could not load app interest.';return}EV=j;
const since=Date.now()-days*864e5;const dl={};(D&&D.rows||[]).forEach(x=>{if(new Date(x.at).getTime()>=since){const s=slugOf(x.product);if(s)dl[s]=(dl[s]||0)+1}});
const rows=Object.keys(NAMES).map(s=>{const t=j.totals[s]||{};return{s,v:t.view||0,p:t.preview||0,c:t.click||0,b:t.buy||0,d:dl[s]||0}}).map(x=>Object.assign(x,{score:x.v+x.p+x.c+x.b*3+x.d*3})).sort((a,b)=>b.score-a.score||NAMES[a.s].localeCompare(NAMES[b.s]));
const mx=Math.max(1,...rows.map(x=>x.score));
document.getElementById('eb').innerHTML=rows.map(x=>'<tr><td><b>'+E(NAMES[x.s])+'</b></td><td class="n">'+x.v+'</td><td class="n">'+x.p+'</td><td class="n">'+x.c+'</td><td class="n">'+x.b+'</td><td class="n">'+x.d+'</td><td><div class="bar" style="width:'+(x.score?Math.max(2,Math.round(100*x.score/mx)):0)+'%"></div></td></tr>').join('');
document.getElementById('er').innerHTML=j.recent.map(e=>'<tr><td>'+E(new Date(e.at).toLocaleString())+'</td><td>'+E(NAMES[e.p]||e.p)+'</td><td>'+E(ACT[e.t]||e.t)+'</td><td class="m">'+E(e.s==='index'?'Home':e.s)+'</td><td>'+E([e.ci,e.r,e.c].filter(Boolean).join(', '))+'</td><td>'+E(e.o)+'</td><td class="m">'+E(e.ref||'')+'</td><td class="m">'+E(e.d)+'</td></tr>').join('')||'<tr><td colspan="8" class="m">Nothing yet in this period. Counting started when this page was added.</td></tr>';
document.getElementById('emsg').textContent=j.events+' actions in this period';document.getElementById('ai').style.display=''}
document.getElementById('days').onchange=loadEv;
document.getElementById('ecsv').onclick=()=>{if(!EV)return;const c=['at','p','t','s','ci','r','c','o','ref','d'];const h=['when','app','action','page','city','region','country','company network','came from','device'];const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';const t=[h.join(',')].concat(EV.recent.map(e=>c.map(k=>q(k==='at'?new Date(e.at).toISOString():k==='t'?ACT[e.t]:k==='p'?NAMES[e.p]:e[k])).join(','))).join('\\r\\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='syon-app-interest.csv';a.click()};
document.getElementById('go').onclick=load;
document.querySelector('.w').addEventListener('click',async e=>{const b=e.target.closest('.del');if(!b)return;if(!confirm(b.dataset.id.startsWith('dl:')?'Delete this download entry? It is also taken off the counts. This cannot be undone.':'Delete this entry? This cannot be undone.'))return;b.disabled=true;b.textContent='Deleting…';const r=await fetch('/api/downloads?id='+encodeURIComponent(b.dataset.id),{method:'DELETE',headers:{'X-Admin-Key':document.getElementById('k').value.trim()}});const j=await r.json().catch(()=>({}));if(j.ok)load();else{b.disabled=false;b.textContent='Delete';document.getElementById('msg').textContent='Could not delete ('+(j.error||r.status)+').'}});document.getElementById('k').addEventListener('keydown',e=>{if(e.key==='Enter')load()});if(document.getElementById('k').value)load();
document.getElementById('csv').onclick=()=>{if(!D)return;const cols=['at','product','file','name','email','address','comment','city','region','postal','country','org','ip','ua','page'];const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
document.getElementById('lcsv').onclick=()=>{if(!D)return;const c2=['at','email','name','company','city','region','country','org'];const q2=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';const t=[c2.join(',')].concat((D.leads||[]).map(r=>c2.map(c=>q2(r[c])).join(','))).join('\\r\\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download='syon-guide-signups.csv';a.click()};
const csv=[cols.join(',')].concat(D.rows.map(r=>cols.map(c=>q(r[c])).join(','))).join('\\r\\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='syon-downloads.csv';a.click()};
</script></body></html>`;
