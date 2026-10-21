/* site.js — Dr. Sinchan Ghosh
   theme · drawer · custom cursor · lantern · the living margin (plants, pond, insects, bee-eater flock, deer, moose, wolves, wild dogs, rat) ·
   chapter reveal · dimmed long pages · magnetic links · parallax · tabs · count-up
   Everything motion-related is gated on pointer:fine and prefers-reduced-motion. */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.remove('no-js');

  var mq = function (q) { return window.matchMedia(q); };
  var reduced = mq('(prefers-reduced-motion: reduce)').matches;
  var finePointer = mq('(pointer: fine)').matches && !mq('(hover: none)').matches;
  if (reduced) html.classList.add('reduced');

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ------------------------------------------------------------ theme */
  var themeBtn = document.querySelector('[data-theme-toggle]');
  function currentTheme() {
    var t = html.getAttribute('data-theme');
    if (t) return t;
    return mq('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  }
  var savedTheme = store.get('sg-theme');
  if (savedTheme) applyTheme(savedTheme);
  else if (themeBtn) themeBtn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var t = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(t); store.set('sg-theme', t);
  });

  /* ------------------------------------------------------------ drawer */
  var menuBtn = document.querySelector('[data-menu]');
  var drawer = document.getElementById('drawer');
  function setMenu(open) {
    if (!drawer || !menuBtn) return;
    drawer.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () { setMenu(!drawer.classList.contains('is-open')); });
    Array.prototype.forEach.call(drawer.querySelectorAll('a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ------------------------------------------------------------ topbar */
  var topbar = document.querySelector('.topbar');
  function onScrollBar() { if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 12); }
  onScrollBar();
  window.addEventListener('scroll', onScrollBar, { passive: true });

  /* ------------------------------------------------------------ pointer state (shared) */
  var mx = window.innerWidth / 2, my = window.innerHeight / 2, hasMouse = false;

  /* ------------------------------------------------------------ custom cursor + lantern */
  if (finePointer && !reduced) {
    var cur = document.querySelector('.cursor');
    var lantern = document.getElementById('lantern');
    var lanternBtn = document.querySelector('[data-lantern-toggle]');
    var lanternOn = store.get('sg-lantern') !== 'off';
    function applyLantern(on) {
      html.classList.toggle('lantern-on', on);
      if (lanternBtn) lanternBtn.setAttribute('aria-pressed', String(on));
    }
    applyLantern(lanternOn);
    if (lanternBtn) lanternBtn.addEventListener('click', function () {
      lanternOn = !lanternOn; applyLantern(lanternOn); store.set('sg-lantern', lanternOn ? 'on' : 'off');
    });

    if (cur) {
      var dot = cur.querySelector('.cursor__dot');
      var ring = cur.querySelector('.cursor__ring');
      html.classList.add('has-cursor');
      var rx = mx, ry = my, lx = mx, ly = my;
      window.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY; hasMouse = true;
        cur.classList.remove('is-hidden');
        dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      }, { passive: true });
      document.addEventListener('mouseleave', function () { cur.classList.add('is-hidden'); });
      document.addEventListener('mouseenter', function () { cur.classList.remove('is-hidden'); });
      window.addEventListener('mousedown', function () { cur.classList.add('is-down'); });
      window.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });
      var linkSel = 'a, button, [role="button"], input, select, textarea, label, summary';
      var textSel = 'p, li, h1, h2, h3, h4, dd, dt, figcaption, blockquote, .figure__n';
      document.addEventListener('mouseover', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.tagName === 'IFRAME') { cur.classList.add('is-hidden'); return; }
        var link = t.closest(linkSel);
        cur.classList.toggle('is-link', !!link);
        cur.classList.toggle('is-text', !link && !!t.closest(textSel));
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target && e.target.tagName === 'IFRAME') cur.classList.remove('is-hidden');
      });
      (function loop() {
        rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        if (lantern) {
          lx += (mx - lx) * 0.08; ly += (my - ly) * 0.08;
          lantern.style.setProperty('--lx', lx.toFixed(1) + 'px');
          lantern.style.setProperty('--ly', ly.toFixed(1) + 'px');
        }
        requestAnimationFrame(loop);
      })();
    }
  } else {
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; hasMouse = true; }, { passive: true });
  }

  /* ------------------------------------------------------------ the living margin
     One fixed canvas behind the page carries every system this site is about, drawn in two Bengali idioms:
     Jamini Roy's flat colours with lamp-black contours, almond eyes and painted dots (the deer, the painted dogs,
     the fish, the bees and beetles), and the bold black brush line of the Sahaj Path primer (the wolves, the moose,
     the rat, the pond with its lotus pads and reeds, the butterflies and dragonflies).
       · plants grow from the ground line — a flowering shrub, paddy, the black alder (farmland, forage, forest)
       · a pond with fish that grow on a logistic curve and drifting plankton (Bakreswar, growth models)
       · bees, butterflies, dragonflies; alder leaf beetles that build up and are thinned by the parasitoid (AlderIPM)
       · bee-eaters flock above (Boids; Reynolds 1987) and dive for insects on the wing (plant–insect–bird)
       · a roe deer grazes; a white rat scurries by (the helminth work)
       · crossings one at a time: the wolf pack, a moose that browses the alder, a red stag, a pair of African wild dogs;
         the roe deer flees the carnivores (Taiga, Serengeti)
     Nothing is ever painted over text: the blocks of the page are measured and masked out of the canvas, so the scene
     lives only in the margins and the gaps, on a phone as on a wide screen; the flock steers clear of them as well.
     Sized to the window, muted tones pre-mixed with the paper, calmer (never frozen) under prefers-reduced-motion. */
  try { (function ecosystem() {
    var canvas = document.getElementById('flock');
    if (!canvas || !canvas.getContext || typeof Path2D === 'undefined') return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var W = 0, H = 0, dpr = 1, base = 24, k = 1, ground = 0, seeded = false, P = {}, T = 0;
    var birds = [], insects = [], plants = [], tufts = [], fishes = [], plankton = [], deer = null, rat = null, cross = null, pond = null, col = {};
    var calm = reduced, margin = 0, colL = 0, colR = 0, R = Math.random, TAU = Math.PI * 2, nomask = /nomask/.test(location.search);
    function rnd(a, b) { return a + R() * (b - a); }
    function pick(arr) { return arr[Math.floor(R() * arr.length)]; }
    function cw() { return Math.max(1.2, 1.3 * k); }

    function tune() {
      base = Math.max(24, Math.min(44, 14 + Math.min(W, H) / 40)); k = base / 24; ground = H - 2 * k;
      P = { maxV: 1.2 * k, minV: 0.45 * k, see: 84 * k, sep: 50 * k, wSep: 0.55 * k, wAli: 0.05, wCoh: 0.0025,
            cursorR: 150 * k, wCur: 0.42 * k, lampR: Math.max(420, Math.min(W, H) * 0.62), wLamp: 0.006 * k,
            edge: 90 * k, wEdge: 0.06 * k, wander: 0.04 * k, line: 1.2 + 0.3 * k, keep: 34 * k, wKeep: 0.12 * k,
            hunt: Math.min(W, H) * 0.55, wHunt: 0.1 * k, huntV: 2.1 * k, insectV: 0.55 * k, pace: 1 };
      if (calm) { P.pace = 0.6; P.maxV *= 0.6; P.minV *= 0.6; P.insectV *= 0.6; P.wLamp = 0; P.wCur *= 0.5; P.wander *= 0.6; }
    }
    function hex(c) { var m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return null; var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    function mix(c, p, a) { var x = hex(c), y = hex(p); if (!x || !y) return c; return 'rgb(' + Math.round(x[0] * a + y[0] * (1 - a)) + ',' + Math.round(x[1] * a + y[1] * (1 - a)) + ',' + Math.round(x[2] * a + y[2] * (1 - a)) + ')'; }
    function rgbhex(s) { var m = /rgb\((\d+),(\d+),(\d+)\)/.exec(s); return m ? '#' + ((1 << 24) + (+m[1] << 16) + (+m[2] << 8) + +m[3]).toString(16).slice(1) : s; }
    function getColors() {
      var cs = getComputedStyle(html), v = function (n, d) { return cs.getPropertyValue(n).trim() || d; };
      var paper = v('--paper', '#F4ECDB'), ink = v('--ink', '#1E2430'), leaf = v('--leaf', '#2E6B49'), haldi = v('--haldi', '#D19A1E'),
          terra = v('--terra', '#B3432A'), indigo = v('--indigo', '#2C4078'), dark = cs.getPropertyValue('color-scheme').trim() === 'dark';
      var brown = rgbhex(mix(ink, haldi, 0.62));
      col = { bird: v('--bird', 'rgba(46,107,73,.6)'), birdLine: v('--bird-line', 'rgba(30,36,48,.62)'), paper: paper, dark: dark,
              ink: mix(ink, paper, 0.74), ink2: mix(ink, paper, 0.5), line: mix(ink, paper, 0.56), eye: mix(ink, paper, 0.85),
              leaf: mix(leaf, paper, 0.56), stem: mix(v('--leaf-deep', '#235339'), paper, 0.62),
              terra: mix(terra, paper, 0.7), haldi: mix(haldi, paper, 0.78), haldiSoft: mix(haldi, paper, 0.6), indigo: mix(indigo, paper, 0.62),
              water: mix(indigo, paper, dark ? 0.22 : 0.1),
              deer: mix(haldi, paper, 0.66), red: mix(rgbhex(mix(terra, haldi, 0.55)), paper, 0.68),
              dog: mix(brown, paper, 0.6), dogDark: mix(ink, paper, 0.66), dogPale: mix(haldi, paper, 0.5),
              fish: mix(haldi, paper, 0.76), fin: mix(terra, paper, 0.72), fin2: mix(leaf, paper, 0.7),
              beetle: mix(indigo, paper, 0.8), wing: mix(ink, paper, 0.22) };
    }
    getColors();
    if (window.MutationObserver) new MutationObserver(getColors).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia && mq('(prefers-color-scheme: dark)').addEventListener) mq('(prefers-color-scheme: dark)').addEventListener('change', getColors);

    /* ================================================================ drawing helpers */
    function spline(pts, closed) {                           /* a smooth curve through points; a third element 1 marks a corner */
      var n = pts.length, segs = closed ? n : n - 1, t = 0.5;
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
      for (var i = 0; i < segs; i++) {
        var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
        if (!closed) { if (i === 0) p0 = p1; if (i === n - 2) p3 = p2; }
        var c1x = p1[2] ? p1[0] : p1[0] + (p2[0] - p0[0]) * t / 3, c1y = p1[2] ? p1[1] : p1[1] + (p2[1] - p0[1]) * t / 3;
        var c2x = p2[2] ? p2[0] : p2[0] - (p3[0] - p1[0]) * t / 3, c2y = p2[2] ? p2[1] : p2[1] - (p3[1] - p1[1]) * t / 3;
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2[0], p2[1]);
      }
      if (closed) ctx.closePath();
    }
    function blob(pts, fill, line) { spline(pts, true); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) { ctx.strokeStyle = line; ctx.stroke(); } }
    function limb(px, py, len, wTop, wBot, ang, fill, line) {   /* a tapered leg hanging from a pivot, swung by ang */
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
      ctx.beginPath(); ctx.moveTo(-wTop / 2, 0); ctx.quadraticCurveTo(-wBot / 2 - 1, len * 0.5, -wBot / 2, len); ctx.lineTo(wBot / 2, len); ctx.quadraticCurveTo(wBot / 2 + 1, len * 0.5, wTop / 2, 0); ctx.closePath();
      ctx.fillStyle = fill; ctx.fill(); if (line) { ctx.strokeStyle = line; ctx.stroke(); }
      ctx.restore();
    }
    function brush(x0, y0, x1, y1, w0, w1, fill) {               /* a tapered brush stroke */
      var dx = x1 - x0, dy = y1 - y0, d = Math.sqrt(dx * dx + dy * dy) || 1, nx = -dy / d, ny = dx / d, bx = (x0 + x1) / 2 + nx * (w0 + w1) * 0.3, by = (y0 + y1) / 2 + ny * (w0 + w1) * 0.3;
      ctx.beginPath(); ctx.moveTo(x0 + nx * w0 / 2, y0 + ny * w0 / 2); ctx.quadraticCurveTo(bx, by, x1 + nx * w1 / 2, y1 + ny * w1 / 2); ctx.lineTo(x1 - nx * w1 / 2, y1 - ny * w1 / 2);
      ctx.quadraticCurveTo((x0 + x1) / 2 - nx * (w0 + w1) * 0.1, (y0 + y1) / 2 - ny * (w0 + w1) * 0.1, x0 - nx * w0 / 2, y0 - ny * w0 / 2); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    }
    function almond(x, y, rx, ry, rot, fill, pupil) { ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = pupil; ctx.beginPath(); ctx.arc(x + rx * 0.2, y, ry * 0.5, 0, TAU); ctx.fill(); }
    function figure(x, dir, h, fn) {                             /* draw fn in a 100-unit box: feet on y = 100, facing +x */
      var s = h / 100; ctx.save(); ctx.translate(x, ground); ctx.scale(s * dir, s); ctx.translate(0, -100); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = cw() / s; fn(s); ctx.restore();
    }

    /* ================================================================ the text mask: the page's blocks are measured and cut out of the canvas */
    var mask = document.createElement('canvas'), mctx = mask.getContext('2d'), blocks = [], rects = [], maskDirty = true, maskAt = -9, fine = false;
    function collectBlocks() {
      var sel = fine ? 'main .ledger > div > *' : 'main .wrap';   /* narrow screens: each block of a column; wide ones: the whole column */
      blocks = Array.prototype.slice.call(document.querySelectorAll(sel + ', .topbar, .colophon__grid > *, .colophon__bottom, .scrollcue, .rail')).filter(function (el) { return !el.closest('.portrait'); });   /* the portrait is a picture, not text */
    }
    function measure() {
      var drawer = document.getElementById('drawer'), pad = (fine ? 12 : 8) * k, out = [], i, r;
      for (i = 0; i < blocks.length; i++) {
        r = blocks[i].getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.bottom < -pad || r.top > H + pad || r.right < -pad || r.left > W + pad) continue;
        out.push({ l: r.left - pad, t: r.top - pad, r: r.right + pad, b: r.bottom + pad });
      }
      if (drawer && drawer.classList.contains('is-open')) out.push({ l: 0, t: 0, r: W, b: H });
      rects = out;
      mask.width = Math.round(W * dpr); mask.height = Math.round(H * dpr); mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.globalCompositeOperation = 'source-over'; mctx.fillStyle = '#fff'; mctx.fillRect(0, 0, W, H);
      mctx.globalCompositeOperation = 'destination-out';
      try { mctx.filter = 'blur(' + (3 * k).toFixed(1) + 'px)'; } catch (e) {}
      for (i = 0; i < rects.length; i++) { r = rects[i]; mctx.fillRect(r.l, r.t, r.r - r.l, r.b - r.t); }
      try { mctx.filter = 'none'; } catch (e) {}
      mctx.globalCompositeOperation = 'source-over';
      maskDirty = false; maskAt = T;
    }
    window.addEventListener('scroll', function () { maskDirty = true; }, { passive: true });
    document.addEventListener('click', function () { maskDirty = true; });

    /* ================================================================ plants: calligraphic leaves, Sahaj Path grass at the foot */
    function makePlant(fx, kind) {
      var h = rnd(0.11, 0.17) * Math.min(H, 900) * (kind === 2 ? 1.2 : 1), n = 5 + Math.floor(R() * 3), leaves = [];
      for (var i = 0; i < n; i++) leaves.push({ t: 0.2 + 0.68 * i / (n - 1) + rnd(-0.03, 0.03), side: i % 2 ? 1 : -1, len: rnd(0.26, 0.4) * h * (kind === 1 ? 1.25 : 1), ang: rnd(0.5, 0.9), ph: R() * TAU });
      return { fx: fx, x: fx * W, h: h, g: 0, rate: 1 / rnd(16, 32), lean: rnd(-0.14, 0.14), ph: R() * TAU, leaves: leaves, kind: kind, spawnAt: T + rnd(3, 9) };
    }
    function plantRot(p) { return p.lean * p.g + Math.sin(T * 0.7 + p.ph) * 0.03 * p.g; }
    function leafDir(l) { return [l.side * Math.sin(l.ang), -Math.cos(l.ang)]; }
    function leafPoint(p, l, u) {
      var r = plantRot(p), y0 = p.h * l.t, d = leafDir(l), grown = Math.min(1, Math.max(0, (p.g - l.t) / 0.12)), len = l.len * grown * u;
      var ax = y0 * Math.sin(r), ay = -y0 * Math.cos(r), dx = d[0] * Math.cos(r) - d[1] * Math.sin(r), dy = d[0] * Math.sin(r) + d[1] * Math.cos(r);
      return [p.x + ax + dx * len, ground + ay + dy * len];
    }
    function leafTip(p, l) { return leafPoint(p, l, 1); }
    function leafPath(len, w) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(len * 0.3, -w * 1.5, len * 0.78, -w * 0.9, len, 0); ctx.bezierCurveTo(len * 0.7, w * 0.55, len * 0.3, w * 0.75, 0, 0); ctx.closePath(); }
    function drawPlant(p) {
      if (p.g <= 0.02) return;
      var hh = p.h * p.g, lw = Math.max(1, 0.9 * k);
      ctx.save(); ctx.translate(p.x, ground); ctx.rotate(plantRot(p)); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      brush(0, 0, -p.lean * 20 * p.g, -hh, Math.max(2.2, 3.2 * k), Math.max(1, 1.2 * k), col.stem);
      for (var i = 0; i < p.leaves.length; i++) {
        var l = p.leaves[i]; if (l.t >= p.g) continue;
        var u = Math.min(1, (p.g - l.t) / 0.12), len = l.len * u, d = leafDir(l), fl = Math.sin(T * 1.4 + l.ph) * 0.05;
        ctx.save(); ctx.translate(0, -p.h * l.t); ctx.rotate(Math.atan2(d[1], d[0]) + fl * l.side); if (l.side < 0) ctx.scale(1, -1);
        leafPath(len, len * (p.kind === 1 ? 0.1 : p.kind === 2 ? 0.26 : 0.2));
        ctx.fillStyle = col.leaf; ctx.fill(); ctx.lineWidth = lw; ctx.strokeStyle = col.line; ctx.stroke();
        if (p.kind !== 1) brush(len * 0.08, 0, len * 0.72, -len * 0.04, lw * 1.2, lw * 0.3, col.stem);
        ctx.restore();
      }
      if (p.g > 0.86) {
        var s = Math.min(1, (p.g - 0.86) / 0.14), r = 4.2 * k * s;
        ctx.save(); ctx.translate(0, -hh); ctx.lineWidth = lw; ctx.strokeStyle = col.line;
        if (p.kind === 0) {
          ctx.fillStyle = col.terra;
          for (var j = 0; j < 5; j++) { var a = j / 5 * TAU - Math.PI / 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3, r * 0.9, r * 0.55, a, 0, TAU); ctx.fill(); ctx.stroke(); }
          ctx.fillStyle = col.haldi; ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TAU); ctx.fill(); ctx.stroke();
        } else if (p.kind === 1) {
          ctx.fillStyle = col.haldi;
          for (var m = 0; m < 7; m++) { var yy = -m * r * 0.9, xx = (m % 2 ? 1 : -1) * r * 0.55; ctx.beginPath(); ctx.ellipse(xx, yy, r * 0.5, r * 0.32, -0.6 * (m % 2 ? 1 : -1), 0, TAU); ctx.fill(); ctx.stroke(); }
        } else {
          ctx.fillStyle = col.terra; ctx.beginPath(); ctx.ellipse(r * 0.4, r * 0.6, r * 0.5, r * 1.3, 0.35, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col.leaf; ctx.beginPath(); ctx.ellipse(-r * 0.6, -r * 0.2, r * 1.1, r * 0.75, -0.5, 0, TAU); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }
    function drawTuft(t) {                                       /* three brush strokes of grass */
      ctx.save(); ctx.translate(t.x, ground);
      for (var i = 0; i < 3; i++) { var a = (i - 1) * 0.5 + t.lean, h = t.h * (i === 1 ? 1 : 0.7); brush(0, 0, Math.sin(a) * h, -Math.cos(a) * h, Math.max(1.6, 2 * k), 0.6, col.ink2); }
      ctx.restore();
    }

    /* ================================================================ the pond: Sahaj Path water lines, lotus pads and reeds; Jamini fish */
    function makePond(x) { var rx = Math.max(70, Math.min(190, W * 0.11)); return { x: x, y: ground - rx * 0.16, rx: rx, ry: rx * 0.28, ph: R() * TAU, reeds: R() < 0.5 ? -1 : 1 }; }
    function drawPond(q) {
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(q.x, q.y, q.rx, q.ry, 0, 0, TAU); ctx.fillStyle = col.water; ctx.fill();      /* the faintest wash */
      for (var i = 0; i < 4; i++) {                                                                                  /* rhythmic brush lines */
        var yy = q.y - q.ry * 0.6 + i * q.ry * 0.42, len = q.rx * (0.62 + 0.3 * Math.sin(i * 1.7 + 0.8)), x0 = q.x - len + (i % 2 ? 0.12 : -0.08) * q.rx + Math.sin(T * 0.4 + q.ph + i) * q.rx * 0.06, wl = 34 * k, amp = 1.4 * k, th = Math.max(1, 1.1 * k);
        ctx.beginPath();
        for (var x = 0; x <= 2 * len; x += 4) ctx.lineTo(x0 + x, yy + Math.sin(x / wl * TAU + i) * amp);
        for (var x2 = 2 * len; x2 >= 0; x2 -= 4) { var tw = th * Math.pow(Math.sin(Math.PI * x2 / (2 * len)), 0.6) + 0.3; ctx.lineTo(x0 + x2, yy + Math.sin(x2 / wl * TAU + i) * amp + tw); }
        ctx.closePath(); ctx.fillStyle = col.ink; ctx.fill();
      }
      for (var j = 0; j < 2; j++) {                                                                                  /* lotus pads: a flat disc with its notch */
        var px = q.x + (j ? 0.5 : -0.4) * q.rx, py = q.y + (j ? -0.15 : 0.4) * q.ry, pr = (j ? 6.5 : 8.5) * k, pa = j ? -0.9 : 0.6;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.arc(px, py, pr, pa + 0.32, pa - 0.32 + TAU); ctx.closePath(); ctx.fillStyle = col.ink; ctx.fill();
        ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(px, py, Math.max(1, pr * 0.14), 0, TAU); ctx.fill();
        if (j === 0) { ctx.fillStyle = col.terra; ctx.beginPath(); ctx.ellipse(px + pr * 0.9, py - pr * 0.8, pr * 0.42, pr * 0.3, -0.5, 0, TAU); ctx.fill(); ctx.strokeStyle = col.line; ctx.lineWidth = Math.max(0.8, 0.8 * k); ctx.stroke(); }   /* and one bud */
      }
      var rx0 = q.x + q.reeds * q.rx * 0.88;                                                                         /* reeds at one end */
      for (var n = 0; n < 4; n++) { var hx = rx0 + (n - 1.5) * 5 * k, hh = (46 + n * 9 + 8 * Math.sin(n * 2.1)) * k, sway = Math.sin(T * 0.9 + n) * 2 * k;
        brush(hx, q.y, hx + sway + (n - 1.5) * 2 * k, q.y - hh, Math.max(1.4, 1.8 * k), 0.5, col.ink);
        if (n % 2) brush(hx + sway * 0.5, q.y - hh * 0.55, hx + sway + q.reeds * 9 * k, q.y - hh * 0.75, Math.max(1.4, 1.6 * k), 0.4, col.ink); }
      ctx.restore();
    }
    function makeFish(q) { return { x: q.x + rnd(-0.5, 0.5) * q.rx, y: q.y + rnd(-0.3, 0.5) * q.ry, dir: R() < 0.5 ? -1 : 1, v: rnd(0.25, 0.45) * k, ph: R() * TAU, s: 0.4, smax: rnd(0.8, 1.05), born: T }; }
    function stepFish(f, dt) {
      var q = pond, a = T - f.born;
      f.s = 0.25 + f.smax / (1 + Math.exp(-(a - 35) / 10));                                  /* logistic growth */
      f.x += f.dir * f.v * P.pace * dt; f.y += Math.sin(T * 0.8 + f.ph) * 0.08 * k * dt;
      var lim = q.rx * 0.74 - base * f.s * 0.6;
      if (f.x > q.x + lim) f.dir = -1; else if (f.x < q.x - lim) f.dir = 1;
      f.y = Math.max(q.y - q.ry * 0.4, Math.min(q.y + q.ry * 0.6, f.y));
    }
    function drawFish(f) {
      var L = base * 1.15 * f.s, wag = Math.sin(T * 6 * P.pace + f.ph) * 0.12;
      ctx.save(); ctx.translate(f.x, f.y); ctx.scale(L * f.dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = cw() / L; ctx.strokeStyle = col.line;
      ctx.fillStyle = col.fin; ctx.beginPath(); ctx.moveTo(-0.32, 0); ctx.lineTo(-0.58, -0.22 + wag); ctx.lineTo(-0.5, 0); ctx.lineTo(-0.58, 0.22 + wag); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.fish; ctx.beginPath(); ctx.moveTo(0.5, 0); ctx.quadraticCurveTo(0.05, -0.34, -0.34, 0); ctx.quadraticCurveTo(0.05, 0.34, 0.5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.fin2; ctx.beginPath(); ctx.moveTo(-0.05, -0.21); ctx.quadraticCurveTo(0.08, -0.38, 0.22, -0.23); ctx.lineTo(0.08, -0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.lineWidth = cw() * 0.6 / L; for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-0.08 + i * 0.1, 0, 0.1, -1.1, 1.1); ctx.stroke(); }
      ctx.lineWidth = cw() / L; almond(0.3, -0.03, 0.07, 0.07, 0, col.paper, col.eye);
      ctx.restore();
    }
    function makePlankter(q) { return { x: q.x + rnd(-0.7, 0.7) * q.rx, y: q.y + rnd(-0.45, 0.6) * q.ry, ph: R() * TAU, kind: Math.floor(R() * 3), s: rnd(0.9, 1.4) }; }
    function drawPlankter(z) {
      var q = pond, x = z.x + Math.sin(T * 0.6 + z.ph) * 4 * k, y = z.y + Math.cos(T * 0.45 + z.ph) * 2 * k, r = 1.5 * k * z.s;
      if (Math.abs(x - q.x) > q.rx * 0.85) return;
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col.ink; ctx.fillStyle = col.paper; ctx.lineWidth = Math.max(0.8, 0.7 * k);
      if (z.kind === 0) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); }
      else if (z.kind === 1) { ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r * 0.8, 0.6, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(r * 2.2, r * 0.8); ctx.stroke(); }
      else { ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.3, 0, TAU); ctx.fillStyle = col.ink; ctx.fill(); }
      ctx.restore();
    }

    /* ================================================================ insects */
    function freeLeaf(p) { var ok = p.leaves.filter(function (l) { return l.t < p.g - 0.1; }); return ok.length ? pick(ok) : null; }
    function makeInsect(kind, p, l) {
      var t = p ? leafTip(p, l) : [pond.x + rnd(-0.6, 0.6) * pond.rx, pond.y - pond.ry - rnd(8, 30) * k];
      return { kind: kind, x: t[0], y: t[1], plant: p, leaf: l, state: kind === 'beetle' ? 'crawl' : (p ? 'leaf' : 'hover'), u: rnd(0.3, 0.9), ph: R() * TAU, next: T + rnd(5, 14), born: T, life: kind === 'beetle' ? rnd(25, 60) : 1e9, tp: null, tl: null, dead: false };
    }
    function alders() { return plants.filter(function (p) { return p.kind === 2 && p.g > 0.6; }); }
    function stepInsect(n, dt) {
      if (T - n.born > n.life) { n.dead = true; return; }
      if (n.state === 'leaf' || n.state === 'crawl') {
        if (n.kind === 'beetle') {
          n.u += Math.sin(T * 0.3 + n.ph) * 0.004 * dt; n.u = Math.max(0.25, Math.min(0.95, n.u));
          var c = leafPoint(n.plant, n.leaf, n.u); n.x = c[0]; n.y = c[1] - 2.5 * k;
          if (T > n.next) { var al = alders(), q0 = al.length ? pick(al) : null, l0 = q0 ? freeLeaf(q0) : null;
            if (l0 && q0 === n.plant) { n.leaf = l0; n.next = T + rnd(8, 18); } else if (l0 && R() < 0.35) { n.tp = q0; n.tl = l0; n.state = 'fly'; } else n.next = T + rnd(5, 10); }
          return;
        }
        var t = leafTip(n.plant, n.leaf); n.x = t[0] + Math.sin(T * 2.1 + n.ph) * 2 * k; n.y = t[1] - 3 * k + Math.cos(T * 1.7 + n.ph) * 1.5 * k;
        if (T > n.next && plants.length > 1) { var q = pick(plants), ql = q !== n.plant ? freeLeaf(q) : null; if (ql) { n.tp = q; n.tl = ql; n.state = 'fly'; } else n.next = T + rnd(3, 6); }
      } else if (n.state === 'hover') {
        n.x += Math.sin(T * 1.3 + n.ph) * 0.9 * k * dt; n.y += Math.cos(T * 2.7 + n.ph) * 0.5 * k * dt;
        n.x = Math.max(pond.x - pond.rx, Math.min(pond.x + pond.rx, n.x)); n.y = Math.max(pond.y - pond.ry - 40 * k, Math.min(pond.y - pond.ry - 4 * k, n.y));
        if (T > n.next && plants.length) { var qp = pick(plants), qq = freeLeaf(qp); if (qq) { n.tp = qp; n.tl = qq; n.state = 'fly'; } else n.next = T + rnd(4, 8); }
      } else {
        var tt = n.tp ? leafTip(n.tp, n.tl) : [pond.x, pond.y - pond.ry - 16 * k], dx = tt[0] - n.x, dy = tt[1] - 4 * k - n.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var v = P.insectV * (n.kind === 'dragonfly' ? 1.6 : n.kind === 'butterfly' ? 0.8 : n.kind === 'beetle' ? 0.7 : 1) * dt;
        var wob = Math.sin(T * (n.kind === 'butterfly' ? 9 : 5) + n.ph) * (n.kind === 'butterfly' ? 1.8 : 0.9) * k;
        n.x += dx / d * v + (-dy / d) * wob * 0.2; n.y += dy / d * v + (dx / d) * wob * 0.2 - 0.25 * k * dt * (d > 40 * k ? 1 : 0);
        if (d < 3 * k) {
          if (n.tp) { n.plant = n.tp; n.leaf = n.tl; n.state = n.kind === 'beetle' ? 'crawl' : 'leaf'; n.next = T + rnd(8, 20); if (n.kind === 'dragonfly') n.next = T + rnd(3, 6); }
          else { n.state = 'hover'; n.next = T + rnd(10, 25); }
        }
      }
    }
    function drawInsect(n) {
      var s = 0.4 * base, flap = Math.sin(T * 40 + n.ph), lw = Math.max(1, 0.9 * k);
      ctx.save(); ctx.translate(n.x, n.y); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = col.eye;
      if (n.kind === 'bee') {                                      /* Jamini: flat ochre, ink stripes */
        if (n.state === 'fly' && n.tp) { var tt = leafTip(n.tp, n.tl); ctx.rotate(Math.atan2(tt[1] - n.y, tt[0] - n.x) * 0.25); }
        ctx.fillStyle = col.wing;
        ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), -0.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s * 0.14, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), 0.5, 0, TAU); ctx.fill();
        ctx.fillStyle = col.haldi; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.26, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.24); ctx.lineTo(-s * 0.12, s * 0.24); ctx.moveTo(s * 0.08, -s * 0.25); ctx.lineTo(s * 0.08, s * 0.25); ctx.stroke();
        ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(s * 0.48, 0, s * 0.14, 0, TAU); ctx.fill();
      } else if (n.kind === 'butterfly') {                        /* Sahaj Path: a black line drawing, paper inside */
        var sp = 0.35 + 0.65 * Math.abs(Math.sin(T * 9 + n.ph)), ws = s * 1.5;
        ctx.lineWidth = Math.max(1.1, 1.1 * k); ctx.strokeStyle = col.ink;
        for (var sd = -1; sd <= 1; sd += 2) {
          ctx.save(); ctx.scale(sd * sp, 1); ctx.fillStyle = col.paper;
          blob([[0, -ws * 0.1], [ws * 0.3, -ws * 0.55], [ws * 0.8, -ws * 0.5], [ws * 0.9, -ws * 0.15], [ws * 0.55, ws * 0.05], [ws * 0.75, ws * 0.4], [ws * 0.45, ws * 0.55], [ws * 0.1, ws * 0.3]], col.paper, col.ink);
          ctx.beginPath(); ctx.moveTo(ws * 0.15, -ws * 0.1); ctx.quadraticCurveTo(ws * 0.5, -ws * 0.5, ws * 0.8, -ws * 0.35); ctx.moveTo(ws * 0.15, ws * 0.1); ctx.quadraticCurveTo(ws * 0.45, ws * 0.2, ws * 0.65, ws * 0.45); ctx.stroke();
          ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(ws * 0.62, -ws * 0.28, ws * 0.07, 0, TAU); ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = col.ink; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.11, s * 0.42, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.quadraticCurveTo(-s * 0.2, -s * 0.7, -s * 0.3, -s * 0.8); ctx.moveTo(0, -s * 0.4); ctx.quadraticCurveTo(s * 0.2, -s * 0.7, s * 0.3, -s * 0.8); ctx.stroke();
      } else if (n.kind === 'dragonfly') {                        /* Sahaj Path: thin body, four outlined wings */
        var hd = n.state === 'fly' && n.tp ? leafTip(n.tp, n.tl) : [n.x + 1, n.y]; ctx.rotate(Math.atan2(hd[1] - n.y, hd[0] - n.x) * 0.5);
        var wl = s * 1.3, wf = 0.55 + 0.45 * Math.abs(flap);
        ctx.strokeStyle = col.ink; ctx.lineWidth = Math.max(1, 0.9 * k); ctx.fillStyle = col.paper;
        for (var sw = -1; sw <= 1; sw += 2) { ctx.beginPath(); ctx.ellipse(-s * 0.15, sw * s * 0.26 * wf, wl * 0.5, s * 0.13, sw * 0.3, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(s * 0.25, sw * s * 0.24 * wf, wl * 0.42, s * 0.11, sw * 0.18, 0, TAU); ctx.fill(); ctx.stroke(); }
        ctx.lineWidth = Math.max(1.6, 1.7 * k); ctx.beginPath(); ctx.moveTo(s * 0.3, 0); ctx.lineTo(-s * 1.15, 0); ctx.stroke();
        ctx.lineWidth = Math.max(0.8, 0.8 * k); for (var sg = 1; sg < 5; sg++) { ctx.beginPath(); ctx.moveTo(-s * 0.25 * sg, -s * 0.1); ctx.lineTo(-s * 0.25 * sg, s * 0.1); ctx.stroke(); }
        ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(s * 0.38, 0, s * 0.17, 0, TAU); ctx.fill();
        ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(s * 0.44, -s * 0.07, s * 0.06, 0, TAU); ctx.fill();
      } else {                                                     /* the alder leaf beetle, Jamini: flat blue-black */
        var bs = s * 0.7;
        ctx.fillStyle = col.beetle; ctx.beginPath(); ctx.ellipse(0, 0, bs * 0.55, bs * 0.38, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-bs * 0.15, -bs * 0.36); ctx.lineTo(-bs * 0.15, bs * 0.36); ctx.stroke();
        ctx.beginPath(); ctx.arc(bs * 0.6, 0, bs * 0.17, 0, TAU); ctx.fill(); ctx.stroke();
        if (n.state === 'fly') { ctx.fillStyle = col.wing; ctx.beginPath(); ctx.ellipse(-bs * 0.1, -bs * 0.45, bs * 0.45, bs * 0.18, -0.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-bs * 0.1, bs * 0.45, bs * 0.45, bs * 0.18, 0.4, 0, TAU); ctx.fill(); }
      }
      ctx.restore();
    }

    /* ================================================================ the four-legged figures (100-unit boxes, feet on y = 100) */
    function legs(pivots, len, wTop, wBot, ph, gait, fill, line, far) {   /* four legs; the far pair first, a touch lighter */
      for (var i = 0; i < 4; i++) {
        var isFar = i === 0 || i === 2; if ((far && !isFar) || (!far && isFar)) continue;
        var sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        limb(pivots[i][0], pivots[i][1], len - Math.max(0, sw) * len * 0.12, wTop, wBot, sw, fill, line);
      }
    }
    /* -- deer, Jamini Roy: roe (ochre) and red stag (rust, antlers) */
    function drawDeer(x, dir, kind, neck, gait, ph, hs) {
      var red = kind === 'red', fill = red ? col.red : col.deer, line = col.line, bob = Math.sin(ph) * gait * 6;
      figure(x, dir, base * (red ? 2.8 : 2.1) * (hs || 1), function () {
        ctx.strokeStyle = line;
        var piv = [[18, 62 + bob], [26, 62 + bob], [50, 62 + bob], [57, 62 + bob]];
        legs(piv, 38, 7, 3.5, ph, gait, mix(rgbhex(fill), col.paper, 0.85), line, true);
        ctx.translate(0, bob);
        blob([[34, 44], [50, 43], [60, 47], [64, 55], [60, 64], [48, 68], [30, 68], [18, 65], [12, 57], [15, 48], [24, 44]], fill, line);
        ctx.fillStyle = mix(col.paper, fill, 0.5); ctx.beginPath(); ctx.ellipse(16, 56, 4, 6.5, 0, 0, TAU); ctx.fill();            /* pale rump */
        ctx.fillStyle = mix(col.paper, fill, 0.6); for (var j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(28 + j * 9, 55 + (j % 2) * 4, 1.6, 0, TAU); ctx.fill(); }   /* Jamini dots */
        blob([[14, 50], [9, 46], [6, 51], [11, 54]], fill, line);                                                                /* tail */
        var a = neck, nx = 52 + 32 * Math.cos(a), ny = 48 - 32 * Math.sin(a), px = Math.sin(a), py = Math.cos(a);
        ctx.beginPath(); ctx.moveTo(46 - 7 * px, 46 - 7 * py); ctx.lineTo(nx - 4 * px, ny - 4 * py); ctx.lineTo(nx + 4 * px, ny + 4 * py); ctx.lineTo(58 + 7 * px, 52 + 7 * py); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.stroke();   /* neck */
        ctx.translate(0, -bob);
        legs(piv, 38, 7, 3.5, ph, gait, fill, line, false);
        ctx.translate(nx, ny + bob); ctx.rotate(-a);                                                                              /* head */
        blob([[-7, -5], [3, -8], [13, -6], [19, -2], [17, 3], [8, 6], [-4, 5]], fill, line);
        blob([[-3, -6, 1], [-11, -22, 1], [2, -8, 1]], fill, line); blob([[3, -7, 1], [1, -24, 1], [9, -7, 1]], fill, line);       /* ears */
        if (red) { ctx.lineWidth *= 1.4; ctx.strokeStyle = line;
          for (var s2 = -1; s2 <= 1; s2 += 2) { var ax = s2 < 0 ? -2 : 4; ctx.beginPath(); ctx.moveTo(ax, -8); ctx.quadraticCurveTo(ax + s2 * 6, -22, ax + s2 * 2, -34); ctx.moveTo(ax + s2 * 3, -16); ctx.lineTo(ax + s2 * 11, -22); ctx.moveTo(ax + s2 * 4, -26); ctx.lineTo(ax + s2 * 10, -32); ctx.stroke(); }
          ctx.lineWidth /= 1.4; }
        almond(7, -1.5, 3, 1.8, 0, col.paper, col.eye);
        ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(18, -0.5, 1.3, 0, TAU); ctx.fill();
      });
    }
    /* -- the wolf, Sahaj Path: a black brush silhouette, white eye */
    function drawWolf(x, dir, s0, ph, moving) {
      var gait = moving ? 0.28 : 0, bob = Math.sin(ph * 2) * (moving ? 2 : 0);
      figure(x, dir, base * 1.9 * s0, function () {
        var piv = [[14, 60 + bob], [22, 60 + bob], [52, 60 + bob], [60, 60 + bob]];
        legs(piv, 40, 9, 5, ph, gait, col.ink2, null, true);
        ctx.translate(0, bob);
        blob([[8, 48], [2, 52], [-6, 60], [-12, 74], [-9, 85], [-3, 83], [1, 72], [7, 60], [13, 52]], col.ink, null);                        /* tail */
        blob([[26, 40], [44, 36], [58, 38], [68, 46], [70, 56], [64, 64], [48, 68], [28, 68], [14, 66], [6, 58], [8, 48], [16, 42]], col.ink, null);   /* body */
        blob([[62, 40], [70, 32], [80, 32], [92, 40], [102, 48], [104, 52, 1], [96, 55], [82, 56], [70, 56], [64, 50]], col.ink, null);        /* head */
        blob([[70, 33, 1], [72, 15, 1], [81, 32, 1]], col.ink, null); blob([[80, 32, 1], [88, 17, 1], [93, 36, 1]], col.ink, null);      /* ears */
        ctx.translate(0, -bob);
        legs(piv, 40, 9, 5, ph, gait, col.ink, null, false);
        ctx.translate(0, bob);
        ctx.strokeStyle = col.paper; ctx.lineWidth = cw() * 0.8 / (base * 1.9 * s0 / 100);
        almond(84, 42, 3.4, 1.9, 0.1, col.paper, col.ink);                                                                                /* the eye */
        ctx.beginPath(); ctx.moveTo(40, 46); ctx.lineTo(46, 50); ctx.moveTo(46, 44); ctx.lineTo(52, 48); ctx.stroke();                       /* fur marks */
      });
    }
    /* -- the moose, Sahaj Path: tall silhouette with palmate antlers and the bell */
    function drawMoose(x, dir, ph, moving, browse) {
      var gait = moving ? 0.22 : 0, bob = Math.sin(ph * 2) * (moving ? 1.5 : 0), nod = browse ? 0.1 + Math.sin(T * 1.5) * 0.04 : 0;
      figure(x, dir, base * 3.1, function () {
        var piv = [[20, 60 + bob], [28, 60 + bob], [58, 60 + bob], [66, 60 + bob]];
        legs(piv, 40, 10, 6, ph, gait, col.ink2, null, true);
        ctx.translate(0, bob);
        blob([[40, 34], [56, 28], [70, 32], [78, 40], [78, 54], [70, 62], [52, 66], [30, 66], [16, 62], [10, 52], [14, 42], [26, 36]], col.ink, null);   /* hump and body */
        blob([[12, 44], [6, 48], [8, 54], [14, 52]], col.ink, null);                                                                        /* stub tail */
        ctx.save(); ctx.translate(76, 40); ctx.rotate(nod);
        blob([[-2, -4], [8, -10], [18, -6], [28, 4], [34, 14], [32, 22, 1], [24, 24], [14, 20], [6, 14], [0, 6]], col.ink, null);             /* the long head, roman nose */
        blob([[12, 22, 1], [16, 34, 1], [20, 22, 1]], col.ink, null);                                                                       /* the bell */
        blob([[6, -9, 1], [4, -22, 1], [14, -10, 1]], col.ink, null);                                                                       /* ear */
        blob([[8, -12], [2, -24], [-4, -32], [-2, -38, 1], [4, -34], [8, -40, 1], [12, -32], [18, -36, 1], [18, -26], [14, -14]], col.ink, null);   /* antlers */
        blob([[14, -12], [20, -24], [26, -32], [32, -36, 1], [34, -28], [40, -30, 1], [36, -22], [40, -16, 1], [32, -12], [22, -10]], col.ink, null);
        ctx.strokeStyle = col.paper; ctx.lineWidth = cw() * 0.8 / (base * 3.1 / 100);
        almond(10, 2, 3, 1.8, 0.2, col.paper, col.ink);
        ctx.restore();
        ctx.translate(0, -bob);
        legs(piv, 40, 10, 6, ph, gait, col.ink, null, false);
      });
    }
    /* -- the painted dog, Jamini Roy: blotched coat, round ears, white tail tip */
    function drawWildDog(x, dir, s0, ph, moving) {
      var gait = moving ? 0.3 : 0, bob = Math.sin(ph * 2) * (moving ? 2 : 0);
      figure(x, dir, base * 1.7 * s0, function () {
        var piv = [[16, 60 + bob], [24, 60 + bob], [52, 60 + bob], [60, 60 + bob]];
        legs(piv, 40, 7, 4, ph, gait, mix(rgbhex(col.dog), col.paper, 0.85), col.line, true);
        ctx.translate(0, bob);
        blob([[10, 48], [4, 54], [-4, 64], [-10, 76], [-6, 82], [0, 78], [4, 66], [10, 56], [14, 52]], col.dog, col.line);                       /* tail */
        ctx.fillStyle = col.paper; ctx.beginPath(); ctx.ellipse(-7, 78, 4, 3, 0.9, 0, TAU); ctx.fill();                                       /* white tip */
        var bodyPts = [[26, 42], [44, 38], [58, 40], [68, 48], [68, 58], [60, 66], [44, 69], [26, 69], [14, 66], [8, 58], [10, 48], [16, 44]];
        blob(bodyPts, col.dog, col.line);
        ctx.save(); spline(bodyPts, true); ctx.clip();                                                                                     /* the painted patches */
        ctx.fillStyle = col.dogDark; ctx.beginPath(); ctx.ellipse(24, 52, 10, 7, 0.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(56, 62, 9, 5, -0.4, 0, TAU); ctx.fill();
        ctx.fillStyle = col.dogPale; ctx.beginPath(); ctx.ellipse(44, 46, 9, 5, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(16, 64, 7, 5, 0, 0, TAU); ctx.fill();
        ctx.restore();
        blob([[62, 42], [70, 36], [80, 36], [92, 44], [98, 50, 1], [92, 54], [80, 56], [70, 56], [64, 52]], col.dog, col.line);              /* head */
        ctx.fillStyle = col.dog; ctx.beginPath(); ctx.ellipse(72, 28, 7, 8, -0.2, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.ellipse(82, 28, 6.5, 7.5, 0.2, 0, TAU); ctx.fill(); ctx.stroke();   /* round ears */
        almond(84, 44, 3.4, 1.9, 0.1, col.haldiSoft, col.eye);
        ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(97, 49, 1.6, 0, TAU); ctx.fill();
        ctx.translate(0, -bob);
        legs(piv, 40, 7, 4, ph, gait, col.dog, col.line, false);
      });
    }
    /* -- the white rat, Sahaj Path: a brush-line drawing */
    function drawRat(x, dir, ph, moving, sniff) {
      var gait = moving ? 0.5 : 0, nod = sniff ? Math.sin(T * 8) * 0.08 : 0;
      figure(x, dir, base * 1.0, function (s) {
        ctx.strokeStyle = col.ink; ctx.lineWidth = Math.max(1.3, 1.4 * k) / s; ctx.fillStyle = col.paper;
        ctx.beginPath(); ctx.moveTo(14, 82); ctx.bezierCurveTo(-10, 78, -36, 60, -58, 84); ctx.stroke();                                 /* tail */
        var piv = [[26, 86], [34, 86], [66, 86], [74, 86]];
        for (var i = 0; i < 4; i++) { var sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait; ctx.beginPath(); ctx.moveTo(piv[i][0], piv[i][1]); ctx.lineTo(piv[i][0] + sw * 10, 100); ctx.stroke(); }
        blob([[20, 70], [44, 60], [66, 60], [82, 64], [98, 76], [106, 84, 1], [98, 90], [80, 92], [60, 96], [36, 96], [18, 92], [10, 84], [12, 76]], col.paper, col.ink);
        ctx.beginPath(); ctx.arc(84, 62, 6, 0, TAU); ctx.fill(); ctx.stroke();                                                                 /* ear */
        ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(94, 75, 1.8, 0, TAU); ctx.fill();                                                   /* eye */
        ctx.beginPath(); ctx.moveTo(103, 82); ctx.lineTo(114, 78 + nod * 20); ctx.moveTo(103, 84); ctx.lineTo(115, 86 + nod * 20); ctx.stroke();   /* whiskers */
      });
    }

    /* ================================================================ behaviours */
    function makeDeer() { return { x: rnd(W * 0.2, W * 0.8), dir: R() < 0.5 ? -1 : 1, state: 'graze', until: T + rnd(6, 14), ph: R() * TAU, neck: -0.9, target: 0 }; }
    function predatorNear(x) { return cross && cross.on && (cross.kind === 'wolf' || cross.kind === 'wilddog') && Math.abs(cross.x - x) < Math.min(W * 0.36, 520 * k); }
    function stepDeer(d, dt) {
      var L = 2.1 * base;
      if (d.state === 'gone') { if (T > d.until) { d.state = 'walk'; d.dir = R() < 0.5 ? 1 : -1; d.x = d.dir > 0 ? -L : W + L; d.target = plants.length ? pick(plants).x : W / 2; } return; }
      if (predatorNear(d.x) && d.state !== 'flee') { d.state = 'flee'; d.dir = d.x < cross.x ? -1 : 1; }
      var want = d.state === 'graze' ? -0.95 : d.state === 'walk' ? 0.5 : 0.12;
      d.neck += (want - d.neck) * Math.min(1, 0.06 * dt);
      if (d.state === 'graze') { if (T > d.until) { d.state = 'walk'; var p = pick(plants); d.target = p ? p.x + (R() < 0.5 ? -1 : 1) * L * 0.6 : W / 2; d.dir = d.target > d.x ? 1 : -1; } }
      else if (d.state === 'walk') { d.x += d.dir * 0.3 * k * P.pace * dt; if ((d.dir > 0 && d.x >= d.target) || (d.dir < 0 && d.x <= d.target)) { d.state = 'graze'; d.until = T + rnd(7, 16); } }
      else if (d.state === 'flee') { d.x += d.dir * 1.9 * k * P.pace * dt; if (d.x < -L * 1.5 || d.x > W + L * 1.5) { d.state = 'gone'; d.until = T + rnd(24, 48); } }
    }
    var KINDS = ['wolf', 'moose', 'wilddog', 'reddeer'], queue = [];
    function nextKind() { if (!queue.length) { queue = KINDS.slice(); for (var i = queue.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), t = queue[i]; queue[i] = queue[j]; queue[j] = t; } } return queue.pop(); }
    function makeCross() { return { on: false, until: T + rnd(12, 24), kind: null, x: 0, dir: 1, n: 1, m: [], v: 0, L: 0, state: 'walk', pauseUntil: 0, browsed: false }; }
    function startCross(c, kind) {
      c.kind = kind || nextKind(); c.on = true; c.dir = R() < 0.5 ? 1 : -1; c.browsed = false; c.state = 'walk'; c.m = [];
      if (c.kind === 'wolf') { c.n = 3 + (R() < 0.5 ? 1 : 0); c.L = 2.2 * base; c.v = 0.36 * k; }
      else if (c.kind === 'wilddog') { c.n = 2 + (R() < 0.4 ? 1 : 0); c.L = 2.0 * base; c.v = 0.5 * k; }
      else if (c.kind === 'moose') { c.n = 1; c.L = 3.3 * base; c.v = 0.3 * k; }
      else { c.n = 1; c.L = 3.0 * base; c.v = 0.32 * k; }
      for (var i = 0; i < c.n; i++) c.m.push({ off: -i * rnd(1.3, 1.7), ph: R() * TAU, s: rnd(0.92, 1.06) });
      var span = (c.n + 1) * 1.7 * c.L; c.x = c.dir > 0 ? -span * 0.2 - c.L : W + span * 0.2 + c.L;
    }
    function stepCross(c, dt) {
      if (!c.on) { if (T > c.until) startCross(c); return; }
      var span = (c.n + 1) * 1.7 * c.L;
      if (c.state === 'pause') { if (T > c.pauseUntil) c.state = 'walk'; return; }
      c.x += c.dir * c.v * P.pace * dt;
      if (c.kind === 'moose' && !c.browsed) { var al = alders(); for (var i = 0; i < al.length; i++) if (Math.abs(al[i].x - (c.x + c.dir * c.L * 0.6)) < 4 * k) { c.browsed = true; c.state = 'pause'; c.pauseUntil = T + rnd(6, 10); break; } }
      else if (R() < 0.0012 * dt) { c.state = 'pause'; c.pauseUntil = T + rnd(1.5, 4); }
      if ((c.dir > 0 && c.x - span > W + c.L) || (c.dir < 0 && c.x + span < -c.L)) { c.on = false; c.until = T + rnd(18, 40); }
    }
    function drawCross(c) {
      if (!c.on) return;
      var moving = c.state === 'walk';
      for (var i = c.m.length - 1; i >= 0; i--) {
        var w = c.m[i], x = c.x + w.off * c.L * c.dir, ph = T * 7 * P.pace + w.ph;
        if (c.kind === 'wolf') drawWolf(x, c.dir, w.s, ph, moving);
        else if (c.kind === 'wilddog') drawWildDog(x, c.dir, w.s, ph, moving);
        else if (c.kind === 'moose') drawMoose(x, c.dir, ph, moving, c.state === 'pause' && c.browsed);
        else drawDeer(x, c.dir, 'red', c.state === 'pause' ? -0.9 : 0.45, moving ? 0.25 : 0, ph, 1);
      }
    }
    function makeRat() { return { on: false, until: T + rnd(20, 45), x: 0, dir: 1, state: 'run', target: 0, pauseUntil: 0, ph: R() * TAU, hops: 0 }; }
    function stepRat(r, dt) {
      var L = 1.15 * base;
      if (!r.on) { if (T > r.until) { r.on = true; r.dir = R() < 0.5 ? 1 : -1; r.x = r.dir > 0 ? -L : W + L; r.hops = 2 + Math.floor(R() * 3); r.state = 'run'; r.target = plants.length ? pick(plants).x + rnd(-20, 20) * k : W / 2; r.dir = r.target > r.x ? 1 : -1; } return; }
      if (r.state === 'pause') { if (T > r.pauseUntil) { r.state = 'run'; if (r.hops-- <= 0) { r.target = r.dir > 0 ? W + L * 2 : -L * 2; } else { r.target = plants.length ? pick(plants).x + rnd(-20, 20) * k : W / 2; r.dir = r.target > r.x ? 1 : -1; } } return; }
      r.x += r.dir * 1.3 * k * P.pace * dt;
      if ((r.dir > 0 && r.x >= r.target) || (r.dir < 0 && r.x <= r.target)) { if (r.x < -L || r.x > W + L) { r.on = false; r.until = T + rnd(40, 90); } else { r.state = 'pause'; r.pauseUntil = T + rnd(1.5, 3.5); } }
    }

    /* ================================================================ the flock */
    function inBlock(x, y, pad) { for (var i = 0; i < rects.length; i++) { var r = rects[i]; if (x > r.l - pad && x < r.r + pad && y > r.t - pad && y < r.b + pad) return r; } return null; }
    function makeBird() { var b = { x: R() * W, y: R() * H * 0.8, vx: rnd(-0.7, 0.7) * k, vy: rnd(-0.7, 0.7) * k, ph: R() * TAU, s: rnd(0.8, 1.25), hunt: null, full: 0 }; for (var i = 0; i < 12 && inBlock(b.x, b.y, 0); i++) { b.x = R() * W; b.y = R() * H; } return b; }
    var body = new Path2D('M-.42 0C-.3 -.07 .15 -.08 .34 -.02L.53 -.03L.34 .03C.15 .08 -.3 .07 -.42 0Z');
    var wing = new Path2D('M.05 -.02C.02 -.27 -.14 -.45 -.41 -.53C-.31 -.3 -.21 -.12 -.08 0Z');
    var tail = new Path2D('M-.4 0L-.68 -.035M-.4 0L-.63 .04');
    var compose = !!(window.DOMMatrix && body.addPath), glyphs = [], STEPS = 12;
    if (compose) for (var gi = 0; gi <= STEPS; gi++) { var fl = 0.25 + 0.62 * gi / STEPS, g = new Path2D(body); g.addPath(wing, new DOMMatrix([1, 0, 0, fl, 0, 0])); g.addPath(wing, new DOMMatrix([1, 0, 0, -fl, 0, 0])); glyphs.push(g); }
    function drawBird(b) {
      var size = base * b.s, f = Math.abs(Math.sin(b.ph));
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx)); ctx.scale(size, size);
      ctx.fillStyle = col.bird; ctx.strokeStyle = col.birdLine; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = P.line / size;
      if (compose) { var g = glyphs[Math.round(f * STEPS)]; ctx.fill(g); ctx.stroke(g); }
      else { var flap = 0.25 + 0.62 * f; ctx.fill(body); ctx.save(); ctx.scale(1, flap); ctx.fill(wing); ctx.stroke(wing); ctx.scale(1, -1); ctx.fill(wing); ctx.stroke(wing); ctx.restore(); ctx.stroke(body); }
      ctx.lineWidth = (P.line - 0.2) / size; ctx.stroke(tail);
      ctx.restore();
    }
    function stepBirds(dt, lamp) {
      var hunting = 0, i, j;
      for (i = 0; i < birds.length; i++) if (birds[i].hunt) hunting++;
      for (i = 0; i < birds.length; i++) {
        var b = birds[i], sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, n = 0;
        for (j = 0; j < birds.length; j++) {
          if (i === j) continue;
          var o = birds[j], dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < P.see * P.see) { n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y; if (d2 < P.sep * P.sep) { var d = Math.sqrt(d2) || 1, q = (P.sep - d) / P.sep; sx -= dx / d * q; sy -= dy / d * q; } }
        }
        if (n) { ax /= n; ay /= n; cx /= n; cy /= n; b.vx += (ax - b.vx) * P.wAli * dt + (cx - b.x) * P.wCoh * dt; b.vy += (ay - b.vy) * P.wAli * dt + (cy - b.y) * P.wCoh * dt; }
        b.vx += sx * P.wSep * dt; b.vy += sy * P.wSep * dt;
        if (hasMouse) {
          var ddx = b.x - mx, ddy = b.y - my, dd2 = ddx * ddx + ddy * ddy;
          if (dd2 < P.cursorR * P.cursorR) { var dd = Math.sqrt(dd2) || 1, f = 1 - dd / P.cursorR; b.vx += ddx / dd * f * P.wCur * dt; b.vy += ddy / dd * f * P.wCur * dt; }
          else if (lamp && !b.hunt && dd2 < P.lampR * P.lampR) { var dl = Math.sqrt(dd2), u = (dl - P.cursorR) / (P.lampR - P.cursorR), a = Math.sin(u * Math.PI) * P.wLamp; b.vx -= ddx / dl * a * dt; b.vy -= ddy / dl * a * dt; }
        }
        /* keep out of the page's text blocks: steer for the nearest edge of any block the bird is in or near */
        for (j = 0; j < rects.length; j++) {
          var r = rects[j], pad = P.keep;
          if (b.x < r.l - pad || b.x > r.r + pad || b.y < r.t - pad || b.y > r.b + pad) continue;
          var eL = b.x - r.l, eR = r.r - b.x, eT = b.y - r.t, eB = r.b - b.y, inside = eL > 0 && eR > 0 && eT > 0 && eB > 0, m = Math.min(eL, eR, eT, eB);
          var str = inside ? P.wKeep * 2.5 : P.wKeep * (1 + m / pad);
          if (m === eL) b.vx -= str * dt; else if (m === eR) b.vx += str * dt; else if (m === eT) b.vy -= str * dt; else b.vy += str * dt;
        }
        if (b.hunt && (b.hunt.dead || b.hunt.state !== 'fly')) b.hunt = null;
        if (!calm && !b.hunt && hunting < 2 && T > b.full && R() < 0.01 * dt) {
          var best = null, bd = P.hunt * P.hunt;
          for (j = 0; j < insects.length; j++) { var ins = insects[j]; if (ins.state !== 'fly') continue; var ex = ins.x - b.x, ey = ins.y - b.y, e2 = ex * ex + ey * ey; if (e2 < bd) { bd = e2; best = ins; } }
          if (best) { b.hunt = best; hunting++; }
        }
        var vmax = P.maxV;
        if (b.hunt) { var hx = b.hunt.x - b.x, hy = b.hunt.y - b.y, hd = Math.sqrt(hx * hx + hy * hy) || 1; b.vx += hx / hd * P.wHunt * dt; b.vy += hy / hd * P.wHunt * dt; vmax = P.huntV; if (hd < base * 0.55) { b.hunt.dead = true; b.hunt = null; b.full = T + rnd(18, 40); } }
        if (b.x < P.edge) b.vx += (P.edge - b.x) / P.edge * P.wEdge * dt;
        if (b.x > W - P.edge) b.vx -= (b.x - (W - P.edge)) / P.edge * P.wEdge * dt;
        if (b.y < P.edge) b.vy += (P.edge - b.y) / P.edge * P.wEdge * dt;
        if (b.y > H - P.edge) b.vy -= (b.y - (H - P.edge)) / P.edge * P.wEdge * dt;
        b.vx += (R() - 0.5) * P.wander * dt; b.vy += (R() - 0.5) * P.wander * dt;
        var v = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 1e-6, tv = Math.max(P.minV, Math.min(vmax, v));
        b.vx = b.vx / v * tv; b.vy = b.vy / v * tv;
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.ph += (0.16 + 0.1 * tv / P.maxV) * dt;
        var mm = base * 2;
        if (b.x < -mm) b.x = W + mm; else if (b.x > W + mm) b.x = -mm;
        if (b.y < -mm) b.y = H + mm; else if (b.y > H + mm) b.y = -mm;
      }
    }

    /* ================================================================ world */
    function layout() {                                          /* where is the page's column, and how wide are the margins? */
      var wrap = document.querySelector('main .wrap'), r = wrap ? wrap.getBoundingClientRect() : null;
      colL = r ? r.left : 0; colR = r ? r.right : W; margin = r ? Math.min(colL, W - colR) : 0;
      fine = margin < 110;
      collectBlocks(); maskDirty = true;
    }
    function populate() {
      var N = calm ? Math.max(6, Math.min(14, Math.round((W * H) / 110000))) : Math.max(9, Math.min(30, Math.round((W * H) / 55000)));
      while (birds.length < N) birds.push(makeBird());
      if (birds.length > N) birds.length = N;
      var side = R() < 0.5 ? -1 : 1, rx = Math.max(70, Math.min(190, W * 0.11));
      if (!pond) pond = makePond(margin >= rx * 2 + 30 * k ? (side < 0 ? margin / 2 : W - margin / 2) : (side < 0 ? Math.max(W * 0.5, W - rx - 24 * k) : Math.min(W * 0.5, rx + 24 * k)));
      if (!plants.length) {
        var kinds = [2, 0, 1], spots = [];
        if (margin >= 110) {                                       /* in the margins of the page */
          var per = Math.max(1, Math.min(4, Math.round(margin / 120)));
          for (var a = 0; a < per; a++) { spots.push((0.15 + 0.7 * (a + 0.5) / per) * colL); spots.push(colR + (0.15 + 0.7 * (a + 0.5) / per) * (W - colR)); }
        } else { var np = Math.max(3, Math.min(6, Math.round(W / 300))); for (var i = 0; i < np; i++) spots.push((i + 0.5 + rnd(-0.25, 0.25)) / np * W); }
        for (var s = 0; s < spots.length; s++) { var x = spots[s]; if (Math.abs(x - pond.x) < pond.rx + 14 * k) x = pond.x + (x < pond.x ? -1 : 1) * (pond.rx + 18 * k); if (x < 10 * k || x > W - 10 * k) continue; plants.push(makePlant(x / W, kinds[s % 3])); }
        tufts = []; for (var tI = 0; tI < Math.round(W / 140); tI++) tufts.push({ fx: R(), x: 0, h: rnd(7, 13) * k, lean: rnd(-0.2, 0.2) });
      }
      for (var j = 0; j < plants.length; j++) plants[j].x = plants[j].fx * W;
      for (var tj = 0; tj < tufts.length; tj++) tufts[tj].x = tufts[tj].fx * W;
      if (!fishes.length) for (var f = 0; f < 3; f++) fishes.push(makeFish(pond));
      if (!plankton.length) for (var z = 0; z < 9; z++) plankton.push(makePlankter(pond));
      if (!deer) deer = makeDeer();
      if (!rat) rat = makeRat();
      if (!cross) cross = makeCross();
      seeded = true;
    }
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      if (!w || !h) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var old = W; W = w; H = h;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tune(); layout();
      if (old && Math.abs(W - old) > 40) { pond = null; fishes = []; plankton = []; plants = []; insects = []; }   /* a new window, a new margin */
      populate(); measure();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i;
      for (i = 0; i < tufts.length; i++) drawTuft(tufts[i]);
      drawCross(cross);
      if (deer.state !== 'gone') drawDeer(deer.x, deer.dir, 'roe', deer.neck, deer.state === 'walk' ? 0.25 : deer.state === 'flee' ? 0.5 : 0, T * (deer.state === 'flee' ? 14 : 6) * P.pace + deer.ph, 1);
      if (rat.on) drawRat(rat.x, rat.dir, T * 16 * P.pace + rat.ph, rat.state === 'run', rat.state === 'pause');
      drawPond(pond);                                          /* the water lies in front: the animals pass behind it */
      for (i = 0; i < plankton.length; i++) drawPlankter(plankton[i]);
      for (i = 0; i < fishes.length; i++) drawFish(fishes[i]);
      for (i = 0; i < plants.length; i++) drawPlant(plants[i]);
      for (i = 0; i < insects.length; i++) drawInsect(insects[i]);
      for (i = 0; i < birds.length; i++) drawBird(birds[i]);
      if (!nomask) { ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }   /* nothing over the text */
    }
    function simulate(dt) {
      T += dt / 60;
      if (maskDirty || T - maskAt > 1.5) measure();
      var lamp = hasMouse && html.classList.contains('lantern-on'), i, cap = Math.min(14, 4 + plants.length * 2), dragonflies = 0;
      for (i = 0; i < plants.length; i++) {
        var p = plants[i];
        if (p.g < 1) p.g = Math.min(1, p.g + p.rate * dt / 60);
        if (p.g > 0.5 && T > p.spawnAt) { p.spawnAt = T + rnd(9, 20); if (insects.length < cap) { var l = freeLeaf(p); if (l) insects.push(makeInsect(p.kind === 2 && R() < 0.6 ? 'beetle' : (R() < 0.3 ? 'butterfly' : 'bee'), p, l)); } }
      }
      for (i = insects.length - 1; i >= 0; i--) { if (insects[i].dead) insects.splice(i, 1); else { stepInsect(insects[i], dt); if (insects[i].kind === 'dragonfly') dragonflies++; } }
      if (T > 8 && dragonflies < 2 && R() < 0.004 * dt) insects.push(makeInsect('dragonfly', null, null));
      for (i = 0; i < fishes.length; i++) stepFish(fishes[i], dt);
      stepBirds(dt, lamp);
      stepCross(cross, dt);
      stepDeer(deer, dt);
      stepRat(rat, dt);
    }

    resize();
    if (/ecodebug/.test(location.search)) window.__eco = function () { return { T: T, cross: cross, deer: deer, rat: rat, pond: pond, plants: plants, insects: insects, birds: birds, fishes: fishes, rects: rects, margin: margin, start: startCross, draw: { wolf: drawWolf, dog: drawWildDog, deer: drawDeer, moose: drawMoose, rat: drawRat, fish: drawFish, insect: drawInsect, plant: drawPlant, pond: drawPond, tuft: drawTuft, clear: function () { ctx.clearRect(0, 0, W, H); } } }; };
    window.addEventListener('resize', resize);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { if (!seeded) resize(); });

    var last = performance.now(), running = !document.hidden, frame = 0, queued = false;
    function schedule() { if (!queued) { queued = true; requestAnimationFrame(step); } }
    function wake() { running = !document.hidden; last = performance.now(); if (running) schedule(); }
    document.addEventListener('visibilitychange', wake);
    window.addEventListener('pageshow', wake);
    window.addEventListener('focus', wake);
    function step(now) {
      queued = false;
      if (!running) return;
      if (!seeded) { resize(); if (!seeded) { schedule(); return; } }
      frame++;
      if (!finePointer && (frame % 2)) { schedule(); return; }
      var dt = Math.min(2.5, (now - last) / 16.67); last = now;
      simulate(dt); draw();
      schedule();
    }
    schedule();
  })(); } catch (e) { /* a quiet margin is better than a halted script */ }

  /* ------------------------------------------------------------ chapters (home): reveal + rail */
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  if (chapters.length && 'IntersectionObserver' in window) {
    var ioIn = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('is-in'); });
    }, { threshold: 0.2 });
    chapters.forEach(function (c) { ioIn.observe(c); });
    var rail = document.querySelector('.rail');
    if (rail) {
      var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
      var ioRail = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (l) { l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id); });
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      chapters.forEach(function (c) { ioRail.observe(c); });
    }
  } else {
    chapters.forEach(function (c) { c.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------ sheets (long pages): the section under the reading line is in full ink */
  var sheets = Array.prototype.slice.call(document.querySelectorAll('.sheet'));
  if (sheets.length && !reduced) {
    html.classList.add('focus-dim');
    var current = sheets[0]; current.classList.add('is-focus');
    var ticking = false;
    function pickSheet() {
      ticking = false;
      var line = window.innerHeight * 0.4, best = null;
      for (var i = 0; i < sheets.length; i++) {
        var r = sheets[i].getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) { best = sheets[i]; break; }
      }
      if (!best) {
        var first = sheets[0].getBoundingClientRect(), lastR = sheets[sheets.length - 1].getBoundingClientRect();
        if (first.top > line) best = sheets[0];                      /* above the first sheet (page header) */
        else if (lastR.bottom < line) best = sheets[sheets.length - 1]; /* past the last sheet (colophon) */
      }
      if (best && best !== current) { current.classList.remove('is-focus'); best.classList.add('is-focus'); current = best; }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(pickSheet); } }, { passive: true });
    window.addEventListener('resize', pickSheet);
    pickSheet();
  }

  /* ------------------------------------------------------------ count-up figures */
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    if (reduced || !('IntersectionObserver' in window)) { el.textContent = target; return; }
    el.textContent = '0';
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.disconnect();
        var t0 = performance.now(), dur = 1400;
        (function tick(now) {
          var p = Math.min(1, (now - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * ease);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.25 });
    io.observe(el);
  });

  /* ------------------------------------------------------------ magnetic links + parallax (fine pointer only) */
  if (finePointer && !reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('.magnet'), function (el) {
      var pull = 0.26;
      el.addEventListener('mousemove', function (e) {
        var b = el.getBoundingClientRect();
        var dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
        el.style.transition = 'transform .15s ease-out';
        el.style.transform = 'translate(' + (dx * pull).toFixed(1) + 'px,' + (dy * pull).toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .7s cubic-bezier(.22,.72,.18,1)';
        el.style.transform = '';
      });
    });
    var px = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    if (px.length) {
      var pxTick = false;
      window.addEventListener('mousemove', function () {
        if (pxTick) return; pxTick = true;
        requestAnimationFrame(function () {
          pxTick = false;
          var dx = mx / window.innerWidth - 0.5, dy = my / window.innerHeight - 0.5;
          px.forEach(function (el) {
            var d = parseFloat(el.getAttribute('data-depth')) || 0;
            el.style.transform = 'translate(' + (dx * d * 70).toFixed(1) + 'px,' + (dy * d * 70).toFixed(1) + 'px)';
          });
        });
      }, { passive: true });
    }
  }

  /* ------------------------------------------------------------ liquid glass: cursor-tracked specular, tilt, bring-forward */
  var glass = Array.prototype.slice.call(document.querySelectorAll('.glass'));
  if (glass.length) {
    if (finePointer && !reduced) {
      glass.forEach(function (el) {
        var raf = false, ev = null;
        el.addEventListener('mousemove', function (e) {
          ev = e; if (raf) return; raf = true;
          requestAnimationFrame(function () {
            raf = false;
            var r = el.getBoundingClientRect();
            var x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
            el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            var tilt = Math.min(3.2, 1200 / Math.max(r.width, r.height));   /* small panes tilt a little more */
            el.style.setProperty('--ry', ((x - 0.5) * 2 * tilt).toFixed(2) + 'deg');
            el.style.setProperty('--rx', ((0.5 - y) * 2 * tilt).toFixed(2) + 'deg');
          });
        }, { passive: true });
        el.addEventListener('mouseleave', function () { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
      });
    }
    function releaseFront() {
      Array.prototype.forEach.call(document.querySelectorAll('.glass.is-front'), function (o) { o.classList.remove('is-front'); });
      Array.prototype.forEach.call(document.querySelectorAll('.has-front'), function (o) { o.classList.remove('has-front'); });
    }
    glass.forEach(function (el) {
      if (el.tagName === 'A' || el.closest('a')) return;             /* links navigate; no toggle */
      el.addEventListener('click', function (e) {
        if (e.target.closest('a, button, input, select, textarea, label, summary, iframe, .leaflet-container')) return;
        var was = el.classList.contains('is-front');
        releaseFront();
        if (!was) {
          el.classList.add('is-front');
          var scope = el.closest('section, header, footer') || el.parentElement;
          if (scope) scope.classList.add('has-front');
        }
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest('.glass')) releaseFront(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') releaseFront(); });
  }

  /* ------------------------------------------------------------ language choice */
  Array.prototype.forEach.call(document.querySelectorAll('a[data-lang]'), function (a) {
    a.addEventListener('click', function () { store.set('sg-lang', a.getAttribute('data-lang')); });
  });

  /* ------------------------------------------------------------ tabs */
  Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('.tab'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x, j) {
          x.setAttribute('aria-selected', String(i === j));
          if (panels[j]) panels[j].classList.toggle('is-active', i === j);
        });
        window.dispatchEvent(new CustomEvent('sg:tab', { detail: panels[i] }));
      });
    });
  });
})();
