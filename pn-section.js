/* Personal Note: journey behaviour (Batch B)
   Vanilla JS, no libraries, no globals. Safe to load with defer.
   Expects: #personal-note > .pn-stage > .pn-cards-row > .pn-card (x4, CSS var --accent),
   .pn-rail > .pn-rail-node (x4) + .pn-rail-marker, and .pn-toolbar > .pn-pause-btn.
   If a required element is missing the script exits quietly and the static layout stays. */
(function () {
  'use strict';

  var section = document.getElementById('personal-note');
  if (!section) return;

  var stage = section.querySelector('.pn-stage');
  var cardsRow = section.querySelector('.pn-cards-row') || stage;
  var cards = Array.prototype.slice.call(section.querySelectorAll('.pn-card'));
  var rail = section.querySelector('.pn-rail');
  var nodes = Array.prototype.slice.call(section.querySelectorAll('.pn-rail-node'));
  var marker = section.querySelector('.pn-rail-marker');
  var btn = section.querySelector('.pn-pause-btn');
  if (!stage || cards.length < 2) return;

  var INTERVAL = 2600;
  var COUNT = cards.length;
  var active = 0;
  var timer = null;
  var flags = {
    user: false,                       // paused with the button
    hover: false,                      // mouse over the cards
    focus: false,                      // keyboard focus on a card
    offscreen: false,                  // section not visible
    hidden: document.hidden === true,  // tab in background
    reduced: false                     // prefers-reduced-motion
  };
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  var PAUSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<rect x="6" y="5" width="4" height="14" rx="1" fill="#0F172A"/>' +
    '<rect x="14" y="5" width="4" height="14" rx="1" fill="#0F172A"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<path d="M8 5.5v13l11-6.5z" fill="#0F172A"/></svg>';

  function accentOf(card) {
    var v = getComputedStyle(card).getPropertyValue('--accent').trim();
    if (v) return v;
    var strip = card.querySelector('.pn-card-strip');
    return strip ? getComputedStyle(strip).backgroundColor : '';
  }

  function haloOf(color) {
    var r, g, b, m;
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if ((m = color.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/))) {
      r = +m[1]; g = +m[2]; b = +m[3];
    } else {
      return '';
    }
    return '0 0 0 8px rgba(' + r + ',' + g + ',' + b + ',.2)';
  }

  /* Centre the marker on node i by measuring the real DOM, so it stays correct
     whatever the CSS uses to centre it (margin, transform or plain offsets). */
  function placeMarker(i, instant) {
    if (!marker || !rail || !nodes[i] || rail.offsetParent === null) return;
    var parent = marker.offsetParent || rail;
    var pr = parent.getBoundingClientRect();
    var nr = nodes[i].getBoundingClientRect();
    var mr = marker.getBoundingClientRect();
    var curLeft = parseFloat(getComputedStyle(marker).left) || 0;
    var offset = (mr.left + mr.width / 2 - pr.left) - curLeft;
    var left = (nr.left + nr.width / 2 - pr.left) - offset;
    if (instant) marker.style.transition = 'none';
    marker.style.left = left + 'px';
    if (instant) {
      void marker.offsetWidth;
      marker.style.transition = '';
    }
  }

  function setActive(i, instant) {
    active = i;
    cards.forEach(function (card, k) {
      var on = k === i;
      card.classList.toggle('on', on);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    nodes.forEach(function (node, k) {
      var color = accentOf(cards[k] || cards[i]);
      node.classList.toggle('on', k <= i);
      if (k < i) {                       // reached: coloured border
        node.style.borderColor = color;
        node.style.background = '';
      } else if (k === i) {              // current: filled
        node.style.borderColor = color;
        node.style.background = color;
      } else {                           // not reached: CSS default
        node.style.borderColor = '';
        node.style.background = '';
      }
    });

    if (marker) {
      var accent = accentOf(cards[i]);
      if (accent) {
        marker.style.background = accent;
        var halo = haloOf(accent);
        if (halo) marker.style.boxShadow = halo;
      }
    }
    placeMarker(i, instant);
  }

  function canRun() {
    return !(flags.user || flags.hover || flags.focus || flags.offscreen || flags.hidden || flags.reduced);
  }

  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (!canRun()) return;
    timer = setTimeout(function () {
      setActive((active + 1) % COUNT);
      schedule();
    }, INTERVAL);
  }

  function syncButton() {
    if (!btn) return;
    btn.setAttribute('aria-label', flags.user ? 'Play journey animation' : 'Pause journey animation');
    btn.innerHTML = flags.user ? PLAY_ICON : PAUSE_ICON;
  }

  function applyReducedMotion() {
    flags.reduced = !!(mq && mq.matches);
    if (btn) btn.style.display = flags.reduced ? 'none' : '';
    schedule();
  }

  /* Card selection (native buttons: Enter and Space already fire click) */
  cards.forEach(function (card, k) {
    card.addEventListener('click', function () {
      setActive(k);
      schedule();
    });
  });

  /* Hover and focus pause apply to the cards only, so the Play button still works
     while the pointer or focus is on it. Touch taps do not count as hover. */
  cardsRow.addEventListener('pointerenter', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    flags.hover = true;
    schedule();
  });
  cardsRow.addEventListener('pointerleave', function () {
    flags.hover = false;
    schedule();
  });
  cardsRow.addEventListener('focusin', function (e) {
    var keyboard = true;
    try { keyboard = e.target.matches(':focus-visible'); } catch (err) { keyboard = true; }
    flags.focus = keyboard;
    schedule();
  });
  cardsRow.addEventListener('focusout', function () {
    flags.focus = false;
    schedule();
  });

  /* Pause / play button */
  if (btn) {
    btn.removeAttribute('inert');
    btn.addEventListener('click', function () {
      flags.user = !flags.user;
      syncButton();
      schedule();
    });
  }

  /* Pause when offscreen or when the tab is hidden */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      flags.offscreen = !entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.35 }).observe(stage);
  }
  document.addEventListener('visibilitychange', function () {
    flags.hidden = document.hidden === true;
    schedule();
  });

  /* Reduced motion (live) */
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', applyReducedMotion);
    else if (mq.addListener) mq.addListener(applyReducedMotion);
  }

  /* Keep the marker aligned on resize and after full load */
  var raf = 0;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () { placeMarker(active, true); });
  });
  window.addEventListener('load', function () { placeMarker(active, true); });

  /* Init */
  setActive(0, true);
  syncButton();
  applyReducedMotion();
})();
