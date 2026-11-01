/* "Have a project in mind?" left-side tab + scoping form. Syon Automation LLC.
   Sends through the same inquiry service as the Services page (e-mailed to the owner). */
(function () {
  var tab = document.getElementById("projTab"), pan = document.getElementById("projPanel"); if (!tab || !pan) return;
  var f = document.getElementById("projForm"), msg = document.getElementById("projMsg"), last = null;
  function open() { last = document.activeElement; pan.hidden = false; requestAnimationFrame(function(){ pan.classList.add("on"); });
    tab.setAttribute("aria-expanded", "true"); setTimeout(function(){ f.name.focus(); }, 250); document.addEventListener("keydown", esc); }
  function close() { pan.classList.remove("on"); tab.setAttribute("aria-expanded", "false"); document.removeEventListener("keydown", esc);
    setTimeout(function(){ pan.hidden = true; }, 250); if (last && last.focus) last.focus(); }
  function esc(e) { if (e.key === "Escape") close(); }
  tab.addEventListener("click", open);
  pan.querySelector(".pclose").addEventListener("click", close);
  pan.querySelector(".pshade").addEventListener("click", close);
  if (location.hash === "#project") open();
  f.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var g = function (n) { return (f[n] && f[n].value || "").trim(); };
    if (!g("name") || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g("email")) || g("about").length < 10) {
      msg.className = "inqmsg err"; msg.textContent = "Please add your name, a valid e-mail address and a few lines about the project."; return; }
    var d = { name: g("name"), email: g("email"), company: g("company"), phone: g("phone"), website: g("website"),
      type: "Project scoping and budget", timeline: g("timeline"), page: location.href,
      message: ["PROJECT SCOPING REQUEST", "Kind of project: " + g("kind"), "Where they are: " + g("stage"), "Budget range: " + g("budget"),
        "Plant location: " + (g("where") || "-"), "", g("about")].join("\n") };
    var b = f.querySelector("button[type=submit]"); b.disabled = true; msg.className = "inqmsg"; msg.textContent = "Sending…";
    fetch("https://licenses.syonautomation.com/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().then(function (j) { return [r.ok, j]; }); })
      .then(function (x) { if (x[0] && x[1].ok) { f.reset(); msg.className = "inqmsg ok"; msg.textContent = "Thank you! Your project is on its way. You'll hear back at " + d.email + " within 2 business days."; }
        else { msg.className = "inqmsg err"; msg.textContent = (x[1] && x[1].message) || "Couldn't send. Please e-mail sales@syonautomation.com."; } })
      .catch(function () { msg.className = "inqmsg err"; msg.textContent = "Couldn't send from this connection. Please e-mail sales@syonautomation.com."; })
      .then(function () { b.disabled = false; });
  });
})();
