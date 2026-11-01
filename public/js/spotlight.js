/* Home page product spotlight. Syon Automation LLC.
   Shows one product at a time and changes every 15 minutes on the clock (:00, :15, :30, :45),
   so every visitor sees the same product at the same time. The page updates itself; no reload needed.
   To change the line-up: edit, add, remove or reorder the entries below. */
(function () {
  var MINUTES = 15;
  var P = [
    { name: "AOI Foundry", kicker: "New · AOI Foundry", h: "Write the AOI.<br>Skip the week.",
      lead: "Describe it in plain English. Get tested ladder logic, a guide and an L5X ready for Studio 5000.",
      url: "aoifoundry.html", watch: "aoifoundry.html#watch", from: "Free 14-day trial · from $99 · Personal, Pro and Site editions",
      img: "img/aoi/home.webp", w: 1440, hgt: 864, alt: "AOI Foundry start screen" },
    { name: "PlantProof", kicker: "PlantProof", h: "Run it.<br>Prove it.",
      lead: "SCADA, historian, alarms, OEE and maintenance in one install, on your own network.",
      url: "plantproof.html", watch: "plantproof.html#watch", from: "Free 30-day evaluation · from $995",
      img: "img/pp/runtime.webp", w: 1400, hgt: 831, alt: "PlantProof live process screen" },
    { name: "DepthForge", kicker: "DepthForge", h: "Light in.<br>Depth out.",
      lead: "Turn photos and logos into 3D relief engravings in steel, brass, titanium and stone.",
      url: "depthforge.html", watch: "depthforge.html#watch", from: "Free 14-day trial · $49",
      img: "img/coin-hero.webp", w: 1000, hgt: 1000, alt: "Eagle coin relief engraved in steel", narrow: true },
    { name: "SiteWatch", kicker: "SiteWatch", h: "Every sensor.<br>One screen.",
      lead: "Wireless LoRaWAN temperature, corrosion and gas sensors, with alarms, trends and signal health.",
      url: "sitewatch.html", watch: "sitewatch.html#watch", from: "Free 14-day trial · from $595",
      img: "img/sw/dashboard.webp", w: 1440, hgt: 900, alt: "SiteWatch dashboard" },
    { name: "DatumLab", kicker: "DatumLab", h: "Live plant data,<br>ready to analyze.",
      lead: "Pull live tags from your PLCs over OPC UA, then run loop, FFT, SPC and capability analysis in one click.",
      url: "datumlab.html", watch: "datumlab.html#watch", from: "Free 14-day trial · from $495",
      img: "img/lab/loop.webp", w: 1291, hgt: 856, alt: "DatumLab loop performance analysis" },
    { name: "LinkScout", kicker: "LinkScout", h: "Know the link<br>before you trust it.",
      lead: "Find every LoRaWAN device your gateways hear and grade each link PASS, MARGINAL or FAIL, with the fix.",
      url: "linkscout.html", watch: "linkscout.html#watch", from: "Free 14-day trial · from $495",
      img: "img/ls/mine.webp", w: 1440, hgt: 872, alt: "LinkScout device list with signal grades" },
    { name: "Datumline", kicker: "Datumline", h: "Every hour,<br>on the record.",
      lead: "A time clock, field journal and pay-period timesheets that e-mail themselves on schedule.",
      url: "datumline.html", watch: "datumline.html#watch", from: "Free 30-day trial · from $149",
      img: "img/dl/hero.webp", w: 1400, hgt: 980, alt: "Datumline time clock and journal" },
    { name: "DataCast", kicker: "DataCast", h: "Put your data<br>on every screen.",
      lead: "TV displays with videos, menu boards and live PLC data over OPC UA, sent to every screen in the building.",
      url: "datacast.html", watch: "", from: "Free trial · from $79",
      img: "img/dc/tvplay.webp", w: 1600, hgt: 900, alt: "DataCast playing on a TV" },
    { name: "RungWise", kicker: "RungWise PLC Academy", h: "PLC skills,<br>rung by rung.",
      lead: "Ladder training for Studio 5000, Siemens TIA Portal, Micro800, CLICK and SLC 500 / PLC-5, with live simulations, auto-graded labs and a quiz after every module.",
      url: "rungwise.html", watch: "rungwise.html#watch", from: "Free 14-day trial · from $249",
      img: "img/rw/sealin.webp", w: 1290, hgt: 684, alt: "RungWise seal-in circuit lesson" },
    { name: "WO Mailer", kicker: "WO Mailer", h: "The work order,<br>in the subject line.",
      lead: "Reads the Work Order # off your HMI screenshots and e-mails the whole picture to the right people.",
      url: "wo-mailer.html", watch: "", from: "Free 14-day trial · from $149",
      img: "img/wm/email.webp", w: 1580, hgt: 920, alt: "WO Mailer e-mail with the work order screenshot" }
  ];
  var root = document.getElementById("spot"); if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var slotMs = MINUTES * 60000, cur = -1, timer = null;
  var dots = $(".sdots");
  P.forEach(function (p, i) {
    var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Show " + p.name);
    b.addEventListener("click", function () { show(i, true); }); dots.appendChild(b);
  });
  $(".sprev").addEventListener("click", function () { show((cur - 1 + P.length) % P.length, true); });
  $(".snext").addEventListener("click", function () { show((cur + 1) % P.length, true); });
  function clockIndex() { return Math.floor(Date.now() / slotMs) % P.length; }
  function fill(p) {
    $(".new").textContent = p.kicker;
    $("h1").innerHTML = p.h;
    $(".lead").textContent = p.lead;
    var a = $(".sgo"); a.href = p.url; a.textContent = "See " + p.name;
    var w = $(".swatch"); w.href = p.watch || p.url; w.textContent = p.watch ? "Watch the film ›" : "Learn more ›";
    $(".from").textContent = p.from;
    var im = $(".pic img"); im.src = p.img; im.width = p.w; im.height = p.hgt; im.alt = p.alt;
    $(".pic").classList.toggle("narrow", !!p.narrow);
    [].forEach.call(dots.children, function (d, i) { d.setAttribute("aria-current", i === cur ? "true" : "false"); });
  }
  function show(i, manual) {
    if (i === cur) return;
    cur = i;
    var nxt = new Image(); nxt.src = P[(i + 1) % P.length].img; // preload the next one
    if (cur === -1 || !root.dataset.ready) { fill(P[i]); root.dataset.ready = "1"; return; }
    root.classList.add("fade");
    setTimeout(function () { fill(P[i]); root.classList.remove("fade"); }, 350);
  }
  function schedule() { // wake up right on the next 15-minute mark, then switch
    clearTimeout(timer);
    timer = setTimeout(function () { show(clockIndex()); schedule(); }, slotMs - (Date.now() % slotMs) + 500);
  }
  show(clockIndex());
  schedule();
  // a laptop that slept or a background tab catches up as soon as it is looked at again
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { show(clockIndex()); schedule(); } });
})();
