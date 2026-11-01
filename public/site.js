/* Syon Automation site: product filters and gentle reveal on scroll. Developed by Syon Automation. */
(function(){
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) { els.forEach(function(e){ e.classList.add("in"); }); }
  else {
    var io = new IntersectionObserver(function(es){ es.forEach(function(x){ if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach(function(e){ io.observe(e); });
  }
  document.querySelectorAll(".filters").forEach(function(bar){
    bar.addEventListener("click", function(ev){
      var b = ev.target.closest("button[data-f]"); if (!b) return;
      var f = b.getAttribute("data-f");
      bar.querySelectorAll("button").forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      document.querySelectorAll(".pcard[data-cat], .pdet[data-cat]").forEach(function(c){
        c.hidden = !(f === "all" || c.getAttribute("data-cat") === f);
        if (!c.hidden) c.classList.add("in");
      });
    });
  });
})();
/* inquiry form: posts to the license service, which e-mails sales@ */
(function(){
  var f = document.getElementById("inqForm"); if (!f) return;
  var m = location.search.match(/[?&]topic=([^&]+)/);
  if (m) { var t = decodeURIComponent(m[1].replace(/\+/g, " ")), map = { "PLC programming": "PLC programming", "Custom applications": "Custom application", "ERP connectors": "ERP connector", "Data migration and connector scripts": "Data migration" };
    var v = map[t] || t; Array.prototype.forEach.call(f.type.options, function(o){ if (o.text === v) o.selected = true; }); }
  var ab = location.search.match(/[?&]about=([^&]+)/);
  if (ab && !f.message.value) { var name = decodeURIComponent(ab[1].replace(/\+/g, " "));
    f.message.value = /Notify/.test(f.type.value) ? "Please e-mail me when " + name + " is available." : "I have a question about " + name + ": "; }
  var msg = document.getElementById("inqMsg");
  f.addEventListener("submit", function(ev){
    ev.preventDefault();
    var d = {}; Array.prototype.forEach.call(f.elements, function(e){ if (e.name) d[e.name] = e.value; }); d.page = location.href;
    if (!d.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) || (d.message || "").trim().length < 5) { msg.className = "inqmsg err"; msg.textContent = "Please fill in your name, a valid e-mail address and what you need."; return; }
    var btn = f.querySelector("button[type=submit]"); btn.disabled = true; msg.className = "inqmsg"; msg.textContent = "Sending…";
    fetch("https://licenses.syonautomation.com/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function(r){ return r.json().then(function(j){ return [r.ok, j]; }); })
      .then(function(x){ if (x[0] && x[1].ok) { f.reset(); msg.className = "inqmsg ok"; msg.textContent = "Thank you! Your inquiry was sent. We'll reply to " + d.email + " within 2 business days."; }
        else { msg.className = "inqmsg err"; msg.textContent = (x[1] && x[1].message) || "Couldn't send. Please e-mail sales@syonautomation.com."; } })
      .catch(function(){ msg.className = "inqmsg err"; msg.textContent = "Couldn't send from this connection. Please e-mail sales@syonautomation.com."; })
      .then(function(){ btn.disabled = false; });
  });
})();

/* unique visitor counter (footer). One POST per browser; afterwards only the count is read. No cookies. */
(function(){
  var box = document.getElementById("visits"), out = document.getElementById("vcount"); if (!box || !out || !window.fetch) return;
  var API = "https://licenses.syonautomation.com/api/visit", seen = false;
  try { seen = localStorage.getItem("sy_visit") === "1"; } catch (e) {}
  fetch(API, seen ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "text/plain" }, body: "1", cache: "no-store" })
    .then(function(r){ return r.json(); })
    .then(function(j){
      if (typeof j.unique !== "number" || j.unique < 1) return;
      try { localStorage.setItem("sy_visit", "1"); } catch (e) {}
      out.textContent = String(j.unique).padStart(6, "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      box.hidden = false;
    }).catch(function(){});
})();

/* video players: swap the thumbnail for the self-hosted video on click (v44: new logo versions) */
(function(){
  document.addEventListener("click", function(ev){
    var b = ev.target.closest && ev.target.closest("button.yt[data-mp4]"); if (!b) return;
    var v = document.createElement("video");
    v.src = b.getAttribute("data-mp4"); v.controls = true; v.autoplay = true; v.playsInline = true;
    v.poster = b.getAttribute("data-poster") || "";
    v.setAttribute("aria-label", b.getAttribute("aria-label") || "Video");
    v.style.cssText = "position:absolute;inset:0;width:100%;height:100%;background:#000;border:0";
    var d = document.createElement("div"); d.className = b.className; d.appendChild(v);
    b.parentNode.replaceChild(d, b); v.play && v.play().catch(function(){});
  });
})();

/* ===== v27: logo nova burst, The Lab animations, Manuals page. Developed by Syon Automation. ===== */
var SY_REDUCE = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
var SY_NS = "http://www.w3.org/2000/svg";
function syEl(tag, attrs, parent){ var e = document.createElementNS(SY_NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }

/* header logo: a nova burst after "Syon", then a spark draws the swoosh along its own curve; loops every 6.5 s */
(function(){
  var svg = document.querySelector(".brand svg"); if (!svg || SY_REDUCE) return;
  var sw = svg.querySelector('path[d^="M58 13"]'); if (!sw || !sw.getTotalLength) return;
  var g = sw.parentNode, defs = svg.querySelector("defs") || syEl("defs", {}, svg);
  var f = syEl("filter", { id: "synova", x: "-200%", y: "-200%", width: "500%", height: "500%" }, defs);
  syEl("feGaussianBlur", { stdDeviation: "1.4", result: "b" }, f);
  var mg = syEl("feMerge", {}, f); syEl("feMergeNode", { in: "b" }, mg); syEl("feMergeNode", { in: "b" }, mg); syEl("feMergeNode", { in: "SourceGraphic" }, mg);
  var rays = syEl("g", { stroke: "#d8f6ff", "stroke-width": "0.6", "stroke-linecap": "round", filter: "url(#synova)" }, g), R = [];
  for (var i = 0; i < 10; i++) R.push(syEl("line", {}, rays));
  var ring = syEl("circle", { cx: 58, cy: 13, r: 0, fill: "none", stroke: "#d8f6ff", "stroke-width": "0.5", filter: "url(#synova)" }, g);
  var hd = syEl("circle", { cx: 58, cy: 13, r: 1.5, fill: "#ffffff", filter: "url(#synova)" }, g);
  var L = sw.getTotalLength(), T = 6500; sw.style.strokeDasharray = L;
  function ease(x){ return 1 - Math.pow(1 - x, 3); }
  function frame(t){
    var a = t % T, k = 0, bo = 0, br = 0, ho = 0, so = 1;
    if (a < 700) { br = a / 700; bo = 1 - br; ho = Math.min(1, br * 2); }
    else if (a < 2600) { k = ease((a - 700) / 1900); ho = 1; }
    else { k = 1; ho = Math.max(0, 1 - (a - 2600) / 500); }
    if (a > 5800) so = 1 - (a - 5800) / 700;
    sw.style.strokeDashoffset = L * (1 - k); sw.style.opacity = so;
    for (var i = 0; i < 10; i++) { var an = i * 36 * Math.PI / 180, r0 = 1 + br * 2, r1 = 1 + br * (i % 2 ? 5 : 8);
      R[i].setAttribute("x1", 58 + Math.cos(an) * r0); R[i].setAttribute("y1", 13 + Math.sin(an) * r0);
      R[i].setAttribute("x2", 58 + Math.cos(an) * r1); R[i].setAttribute("y2", 13 + Math.sin(an) * r1); R[i].style.opacity = bo; }
    ring.setAttribute("r", br * 7); ring.style.opacity = bo;
    var p = sw.getPointAtLength(L * k); hd.setAttribute("cx", p.x); hd.setAttribute("cy", p.y); hd.style.opacity = ho;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* The Lab: small self-running drawings on the project cards, the hero data packet, and the results counter */
(function(){
  if (!document.querySelector("[data-lab]")) return;
  var $ = function(id){ return document.getElementById(id); };
  var hp = $("lhPath"), pk = $("lhPk"), HL = hp && hp.getTotalLength ? hp.getTotalLength() : 0;
  var tr = []; for (var i = 0; i < 45; i++) tr.push(40);
  var c1 = $("lcBatch"), c2 = $("lcStall"), countStart = null, last = 0;
  function trendPts(){ return tr.map(function(y, i){ return (i * 5) + "," + y.toFixed(1); }).join(" "); }
  if ($("lmTrend")) $("lmTrend").setAttribute("points", trendPts());
  if (c1 && "IntersectionObserver" in window && !SY_REDUCE) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && countStart === null) { countStart = performance.now(); io.disconnect(); } }); }, { threshold: .5 });
    io.observe(c1);
  } else if (c1) { c1.textContent = "3.0 min"; c2.textContent = "0"; }
  function frame(t){
    if (HL && pk) { var q = hp.getPointAtLength(HL * ((t / 2600) % 1)); pk.setAttribute("cx", q.x); pk.setAttribute("cy", q.y); }
    if (countStart !== null && c1) { var c = Math.min(1, (t - countStart) / 2600), e = 1 - Math.pow(1 - c, 3);
      c1.textContent = (12 - 9 * e).toFixed(1) + " min"; c2.textContent = String(Math.round(8 - 8 * e)); }
    var sw = $("lmSine"); if (sw) { var d = "M84 40", ph = t / 300; for (var x = 84; x <= 214; x += 2) d += " L" + x + " " + (40 - 24 * Math.sin((x - 84) / 130 * 5 * Math.PI - ph)).toFixed(1); sw.setAttribute("d", d); }
    var nd = $("lmNeedle"); if (nd) { var ma = 12 + 7.5 * Math.sin(t / 1500); nd.setAttribute("transform", "rotate(" + ((ma - 12) / 8 * 90).toFixed(1) + " 110 72)"); $("lmMa").textContent = ma.toFixed(2) + " mA"; }
    if (t - last > 350 && $("lmTrend")) { last = t; tr.push(Math.max(12, Math.min(68, tr[tr.length - 1] + (Math.random() - .5) * 12))); tr.shift(); $("lmTrend").setAttribute("points", trendPts()); }
    requestAnimationFrame(frame);
  }
  if (!SY_REDUCE) requestAnimationFrame(frame);
  else { if (pk && HL) { var q = hp.getPointAtLength(HL / 2); pk.setAttribute("cx", q.x); pk.setAttribute("cy", q.y); } }
})();

/* Manuals: ask for a one-time link; or, when opened from that link (?t=), stamp every page and save the PDF */
(function(){
  var form = document.getElementById("manForm"); if (!form) return;
  var API = "https://licenses.syonautomation.com/api/manual/";
  var msg = document.getElementById("manMsg"), box = document.getElementById("manReady");
  var pre = location.search.match(/[?&]p=([a-z]+)/); if (pre) form.product.value = pre[1];
  form.addEventListener("submit", function(ev){
    ev.preventDefault();
    var d = { product: form.product.value, key: form.key.value.trim(), email: form.email.value.trim(), website: form.website.value };
    if (!d.product || d.key.length < 8 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) { msg.className = "inqmsg err"; msg.textContent = "Choose your product, paste your whole license key, and type the e-mail address you bought with."; return; }
    var btn = form.querySelector("button[type=submit]"); btn.disabled = true; msg.className = "inqmsg"; msg.textContent = "Checking…";
    fetch(API + "request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function(r){ return r.json(); })
      .then(function(j){
        if (j.status === "support_ended") { msg.className = "inqmsg warn"; msg.innerHTML = ""; msg.appendChild(document.createTextNode(j.message + " "));
          var a = document.createElement("a"); a.href = j.renew_url; a.textContent = "Renew support"; a.className = "btn sm primary"; a.style.marginTop = "10px"; msg.appendChild(document.createElement("br")); msg.appendChild(a); return; }
        if (j.ok) { form.key.value = ""; msg.className = "inqmsg ok"; msg.textContent = j.message; }
        else { msg.className = "inqmsg err"; msg.textContent = j.message || "Couldn't check that right now. Please e-mail support@syonautomation.com."; }
      })
      .catch(function(){ msg.className = "inqmsg err"; msg.textContent = "Couldn't reach the license service from this connection. Please e-mail support@syonautomation.com."; })
      .then(function(){ btn.disabled = false; });
  });

  var tm = location.search.match(/[?&]t=([a-f0-9]{48})/); if (!tm || !box) return;
  var token = tm[1], info = null;
  var SAMPLE = "Licensed to Your Name  ·  License #  ·  you@example.com\nIssued (date)  ·  Support through (date)  ·  Page 1 of N";
  box.hidden = false;
  var bmsg = document.getElementById("manDlMsg"), bt = document.getElementById("manDl");
  function say(cls, t){ bmsg.className = "inqmsg " + cls; bmsg.textContent = t; }
  fetch(API + "fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token }) })
    .then(function(r){ return r.json(); })
    .then(function(j){
      if (!j.ok) { document.getElementById("manDoc").hidden = true; bt.hidden = true; say("err", j.message); document.getElementById("manStamp").textContent = SAMPLE; return; }
      info = j; document.getElementById("manTitle").textContent = j.app + " manual" + (j.version ? " " + j.version : "");
      document.getElementById("manFor").textContent = "For " + (j.name || "your license") + " · link expires " + new Date(j.expires).toLocaleString();
      document.getElementById("manStamp").textContent = j.stamp.top + "\n" + j.stamp.bottom.replace("{n}", "1").replace("{total}", "…");
      bt.disabled = false;
    }).catch(function(){ document.getElementById("manStamp").textContent = SAMPLE; say("err", "Couldn't reach the license service. Please try again in a minute."); });
  function loadLib(cb){ if (window.PDFLib) return cb(); var s = document.createElement("script"); s.src = "js/pdf-lib.min.js"; s.onload = cb; s.onerror = function(){ say("err", "Couldn't load the PDF tool. Please reload the page and press Download again."); bt.disabled = false; }; document.head.appendChild(s); }
  function clean(font, s){ var out = ""; for (var i = 0; i < s.length; i++) { var ch = s[i]; try { font.encodeText(ch); out += ch; } catch (e) { out += "?"; } } return out; }
  bt.addEventListener("click", function(){
    if (!info) return; bt.disabled = true; say("", "Preparing your stamped copy…");
    loadLib(function(){
      var stamp = info.stamp;
      fetch(API + "fetch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: token, download: 1 }) })
        .then(function(r){ if (!r.ok) return r.json().then(function(j){ throw new Error(j.message || "Download failed."); }); var h = r.headers.get("X-Stamp"); if (h) { try { stamp = JSON.parse(decodeURIComponent(h)); } catch (e) {} } return r.arrayBuffer(); })
        .then(function(buf){ return PDFLib.PDFDocument.load(buf, { ignoreEncryption: true }); })
        .then(function(doc){
          return doc.embedFont(PDFLib.StandardFonts.Helvetica).then(function(font){
            var pages = doc.getPages(), n = pages.length, red = PDFLib.rgb(1, 0.42, 0.29), size = 8;
            pages.forEach(function(pg, i){
              var w = pg.getWidth(), h = pg.getHeight(), top = clean(font, stamp.top), bot = clean(font, stamp.bottom.replace("{n}", i + 1).replace("{total}", n));
              var tw = font.widthOfTextAtSize(top, size), bw = font.widthOfTextAtSize(bot, size);
              var ts = tw > w - 24 ? size * (w - 24) / tw : size, bs = bw > w - 24 ? size * (w - 24) / bw : size;
              pg.drawText(top, { x: (w - font.widthOfTextAtSize(top, ts)) / 2, y: h - 18, size: ts, font: font, color: red, opacity: 1 });
              pg.drawText(bot, { x: (w - font.widthOfTextAtSize(bot, bs)) / 2, y: 12, size: bs, font: font, color: red, opacity: 1 });
            });
            doc.setSubject(stamp.top); doc.setKeywords(["Licensed copy", stamp.top]);
            return doc.save();
          });
        })
        .then(function(bytes){
          var url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })), a = document.createElement("a");
          a.href = url; a.download = stamp.file || "manual.pdf"; document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function(){ URL.revokeObjectURL(url); }, 60000);
          say("ok", "Saved to your Downloads folder as “" + (stamp.file || "manual.pdf") + "”. This link has now been used; ask again below if you need another copy.");
        })
        .catch(function(e){ say("err", e.message || "Download failed. Please e-mail support@syonautomation.com."); });
    });
  });
})();

/* v32: after-hours banner status. After-hours = weekdays before 7 AM or from 5 PM, and all weekend (US Eastern time). */
(function(){
  var el = document.getElementById("erStat"); if (!el) return;
  function upd(){
    var p = {}; try { new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date()).forEach(function(x){ p[x.type] = x.value; }); } catch (e) { return; }
    var h = parseInt(p.hour, 10) % 24, wk = p.weekday === "Sat" || p.weekday === "Sun", open = wk || h < 7 || h >= 17;
    el.hidden = false; el.className = "erstat" + (open ? " open" : "");
    el.textContent = open ? "\u25CF After-hours line open now" : "After-hours line opens 5 PM ET";
  }
  upd(); setInterval(upd, 60000);
})();

/* v32: emergency request form -> license service (/api/emergency). Developed by Syon Automation LLC. */
(function(){
  var f = document.getElementById("emForm"); if (!f) return;
  var msg = document.getElementById("emMsg"), other = document.getElementById("payOther"), dn = document.getElementById("distNote");
  f.pay_auth.addEventListener("change", function(){ other.hidden = !/Someone else/.test(f.pay_auth.value); });
  f.distance.addEventListener("change", function(){ var v = f.distance.value;
    dn.textContent = v === "Within 30 miles" ? "If we need to come on site: flat $75 trip charge." : v === "30 to 100 miles" ? "If we need to come on site: travel $95/hr portal to portal plus 72.5¢/mile." : v === "Over 100 miles" ? "If we need to come on site, travel is quoted before we go." : ""; });
  f.addEventListener("submit", function(ev){
    ev.preventDefault();
    var d = {}; Array.prototype.forEach.call(f.elements, function(e){ if (!e.name) return; d[e.name] = e.type === "checkbox" ? (e.checked ? "yes" : "") : e.value; });
    var miss = [];
    if (!d.name) miss.push("contact person"); if ((d.phone || "").replace(/\D/g, "").length < 10) miss.push("mobile number");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email || "")) miss.push("e-mail"); if (!d.company) miss.push("company / plant"); if (!d.location) miss.push("plant location");
    if (!d.distance) miss.push("distance"); if (!d.plc_brand) miss.push("PLC brand"); if (!d.plc_version) miss.push("firmware / software version");
    if ((d.message || "").trim().length < 10) miss.push("description of the problem"); if (!d.vpn) miss.push("VPN answer"); if (!d.pay_auth) miss.push("payment authority");
    if (/Someone else/.test(d.pay_auth) && (!d.pay_name || !d.pay_contact)) miss.push("who authorizes payment and how to reach them");
    if (d.agree !== "yes") miss.push("the after-hours rate box");
    if (miss.length) { msg.className = "inqmsg err"; msg.textContent = "Please fill in: " + miss.join(", ") + "."; return; }
    var btn = f.querySelector("button[type=submit]"); btn.disabled = true; msg.className = "inqmsg"; msg.textContent = "Sending…";
    fetch("https://licenses.syonautomation.com/api/emergency", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function(r){ return r.json().then(function(j){ return [r.ok, j]; }); })
      .then(function(x){
        if (!(x[0] && x[1].ok)) { msg.className = "inqmsg err"; msg.textContent = (x[1] && x[1].message) || "Couldn't send. Please text 470-228-2167."; btn.disabled = false; return; }
        var n = x[1].number, body = "EMERGENCY " + n + " - " + d.company + " - " + d.plc_brand + (d.vfd ? " / " + d.vfd : "") + " - call-back " + d.phone + " (" + d.name + ")";
        msg.className = "inqmsg"; msg.innerHTML = "";
        var box = document.createElement("div"); box.className = "emok";
        box.innerHTML = "Request received: <b></b><br>Now send the text below so it's seen right away. The payment link goes to the person who authorizes payment.";
        box.querySelector("b").textContent = n; msg.appendChild(box);
        var a = document.getElementById("emSms"); a.href = "sms:+14702282167?&body=" + encodeURIComponent(body);
        document.getElementById("emText").hidden = false; btn.hidden = true;
      })
      .catch(function(){ msg.className = "inqmsg err"; msg.textContent = "Couldn't reach the server from this connection. Please text 470-228-2167."; btn.disabled = false; });
  });
})();
