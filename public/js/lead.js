/* Free guide sign-up: posts the email to /api/lead, then opens the PDF. Developed by Syon Automation LLC. */
(function () {
  'use strict';
  var GUIDES = { 'line-down-50-checks': 'guides/line-down-50-checks.pdf' };
  document.querySelectorAll('form[data-lead]').forEach(function (f) {
    var msg = f.parentNode.querySelector('.gmsg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var key = f.getAttribute('data-lead'), url = GUIDES[key];
      var d = { email: f.email.value.trim(), company: f.company ? f.company.value.trim() : '', website: f.website ? f.website.value : '', guide: key, page: location.pathname };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { msg.textContent = 'Please enter a valid email address.'; f.email.focus(); return; }
      var b = f.querySelector('button'); b.disabled = true; b.textContent = 'Sending…';
      var done = function () {
        msg.innerHTML = 'Thanks! Your guide is ready: <a href="' + url + '" target="_blank" rel="noopener">Open the PDF</a>';
        b.textContent = 'Sent'; window.open(url, '_blank', 'noopener');
      };
      Promise.race([
        fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) }),
        new Promise(function (r) { setTimeout(r, 3000); })
      ]).then(done, done);
    });
  });
})();
