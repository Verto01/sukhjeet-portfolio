(function () {
  'use strict';
  var sec = document.getElementById('about');
  if (!sec) return;
  var nums = sec.querySelectorAll('[data-count]');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;
  sec.classList.add('ab-js');
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var start = null, dur = 1100;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    sec.classList.add('ab-in');
    if (!reduce) nums.forEach(countUp);
    io.disconnect();
  }, { threshold: 0.35 });
  io.observe(sec.querySelector('.ab-stats') || sec);
})();