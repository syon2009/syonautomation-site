/* Savings calculators for TechProof, RungWise and PlantProof product pages.
   All defaults are either published prices / cited figures or clearly labelled examples the visitor replaces.
   Developed by Syon Automation LLC. */
(function () {
  'use strict';
  var $ = function (r, s) { return r.querySelector(s); };
  var money = function (v) { return (v < 0 ? '-$' : '$') + Math.round(Math.abs(v)).toLocaleString('en-US'); };
  var num = function (el, min) { var v = parseFloat(String(el.value).replace(/[^0-9.]/g, '')); if (!isFinite(v)) v = 0; return Math.max(min || 0, v); };

  // RungWise: cheapest edition for n learners (Personal $249 / Team 5-Pack $995 + $179 per extra seat / Site $4,950)
  function rungwise(n) {
    if (n <= 0) return { cost: 0, name: '' };
    if (n === 1) return { cost: 249, name: 'Personal Edition' };
    var team = 995 + Math.max(0, n - 5) * 179;
    return team <= 4950 ? { cost: team, name: n <= 5 ? 'Team 5-Pack' : 'Team 5-Pack + ' + (n - 5) + ' seats' } : { cost: 4950, name: 'Site license' };
  }

  function bind(root, calc) {
    var run = function () { calc(root); };
    root.querySelectorAll('input,select').forEach(function (el) { el.addEventListener('input', run); el.addEventListener('change', run); });
    run();
  }

  var C = {
    techproof: function (r) {
      var n = Math.round(num($(r, '[name=techs]'), 1));
      var tuition = num($(r, '[name=tuition]')), years = num($(r, '[name=years]')), extra = num($(r, '[name=extra]'));
      var pkg = parseFloat($(r, '[name=pkg]').value), addRw = $(r, '[name=rw]').checked;
      var school = n * (tuition * years + extra);
      var rw = addRw ? rungwise(n) : { cost: 0, name: '' };
      var ours = pkg + rw.cost, save = school - ours;
      $(r, '[data-o=school]').textContent = money(school);
      $(r, '[data-o=ours]').textContent = money(ours);
      $(r, '[data-o=rwname]').textContent = addRw ? 'incl. RungWise ' + rw.name + ' ' + money(rw.cost) : 'TechProof only';
      var big = $(r, '[data-o=save]'); big.textContent = money(save); big.classList.toggle('neg', save < 0);
      $(r, '[data-o=roi]').textContent = save > 0 && ours > 0 ? Math.round(save / ours * 100) + '% return in year one' : 'No savings at these numbers';
      var per = tuition * years + extra;
      $(r, '[data-o=be]').textContent = per > 0 ? 'Pays for itself at ' + Math.ceil(ours / per) + ' technician' + (Math.ceil(ours / per) === 1 ? '' : 's') : '';
    },
    rungwise: function (r) {
      var n = Math.round(num($(r, '[name=learners]'), 1));
      var fee = num($(r, '[name=fee]')), travel = num($(r, '[name=travel]')), days = num($(r, '[name=days]')), wage = num($(r, '[name=wage]'));
      var outside = n * (fee + travel + days * 8 * wage);
      var rw = rungwise(n), save = outside - rw.cost;
      $(r, '[data-o=outside]').textContent = money(outside);
      $(r, '[data-o=ours]').textContent = money(rw.cost);
      $(r, '[data-o=edition]').textContent = rw.name;
      var big = $(r, '[data-o=save]'); big.textContent = money(save); big.classList.toggle('neg', save < 0);
      $(r, '[data-o=roi]').textContent = save > 0 ? Math.round(save / rw.cost * 100) + '% return' : 'No savings at these numbers';
    },
    plantproof: function (r) {
      var plcs = Math.round(num($(r, '[name=plcs]'), 1));
      var hrs = num($(r, '[name=hours]')), cost = num($(r, '[name=cost]')), pct = Math.min(100, num($(r, '[name=pct]')));
      var price = plcs <= 3 ? 995 : 3495, ed = plcs <= 3 ? 'Pilot (up to 3 PLCs)' : 'Site (any number of PLCs)';
      var yearly = hrs * 12 * cost, saved = yearly * pct / 100;
      $(r, '[data-o=yearly]').textContent = money(yearly);
      $(r, '[data-o=ours]').textContent = money(price);
      $(r, '[data-o=edition]').textContent = ed;
      var big = $(r, '[data-o=save]'); big.textContent = money(saved - price); big.classList.toggle('neg', saved - price < 0);
      $(r, '[data-o=roi]').textContent = saved > 0 ? 'Pays for itself in about ' + Math.max(1, Math.ceil(price / (saved / 12))) + ' month' + (Math.ceil(price / (saved / 12)) <= 1 ? '' : 's') : 'Enter your downtime numbers';
    }
  };
  document.querySelectorAll('[data-roi]').forEach(function (r) { var f = C[r.getAttribute('data-roi')]; if (f) bind(r, f); });
})();
