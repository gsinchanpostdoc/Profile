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

  /* ------------------------------------------------------------ the living margin: a Jamini Roy bestiary of the research
     One fixed canvas behind the page carries every system this site is about, as flat figures with lamp-black
     contours, almond eyes and painted dots:
       · plants grow from the ground line — a flowering shrub, paddy, and the black alder (farmland, forage, forest)
       · a pond at one side with Jamini fish that grow on a logistic curve, and drifting plankton (Bakreswar, growth models)
       · bees, butterflies and dragonflies hatch at leaves and pond and cross between plants; alder leaf beetles build up on
         the alder and are thinned by the parasitoid — the eco-epidemic (Merops prey, AlderIPM)
       · bee-eaters flock above (Boids; Reynolds 1987) and dive for insects on the wing (plant–insect–bird)
       · a roe deer grazes and walks between the plants; a white rat scurries along the ground now and then (helminth work)
       · crossings along the ground, one at a time: the wolf pack, a moose that stops to browse the alder, a red deer stag,
         and a pair of African wild dogs — the deer flees from the carnivores (predator–prey, Taiga, Serengeti)
     Everything is sized to the window (phone and 4K alike), drawn in muted tones pre-mixed with the paper, and kept behind
     the content. With the lantern lit the flock is drawn to the light; the cursor itself is a predator. Visitors who prefer
     reduced motion get the same scene, calmer: slower, fewer birds, no swirl, no dives. */
  try { (function ecosystem() {
    var canvas = document.getElementById('flock');
    if (!canvas || !canvas.getContext || typeof Path2D === 'undefined') return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var W = 0, H = 0, dpr = 1, base = 24, k = 1, ground = 0, seeded = false, P = {}, T = 0;
    var birds = [], insects = [], plants = [], fishes = [], plankton = [], deer = null, rat = null, cross = null, pond = null, col = {};
    var calm = reduced;                                    /* reduced motion: slower and quieter, not frozen */
    var R = Math.random, TAU = Math.PI * 2;
    function rnd(a, b) { return a + R() * (b - a); }
    function pick(arr) { return arr[Math.floor(R() * arr.length)]; }
    function cw() { return Math.max(1.2, 1.3 * k); }          /* contour width in CSS px */

    function tune() {
      base = Math.max(24, Math.min(44, 14 + Math.min(W, H) / 40)); k = base / 24; ground = H - 2 * k;
      P = { maxV: 1.2 * k, minV: 0.45 * k, see: 84 * k, sep: 50 * k, wSep: 0.55 * k, wAli: 0.05, wCoh: 0.0025,
            cursorR: 150 * k, wCur: 0.42 * k, lampR: Math.max(420, Math.min(W, H) * 0.62), wLamp: 0.006 * k,
            edge: 90 * k, wEdge: 0.06 * k, wander: 0.04 * k, line: 1.2 + 0.3 * k,
            hunt: Math.min(W, H) * 0.55, wHunt: 0.1 * k, huntV: 2.1 * k, insectV: 0.55 * k, pace: 1 };
      if (calm) { P.pace = 0.6; P.maxV *= 0.6; P.minV *= 0.6; P.insectV *= 0.6; P.wLamp = 0; P.wCur *= 0.5; P.wander *= 0.6; }
    }
    function hex(c) { var m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return null; var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    function mix(c, p, a) {                                  /* c over p at alpha a → opaque rgb() */
      var x = hex(c), y = hex(p); if (!x || !y) return c;
      return 'rgb(' + Math.round(x[0] * a + y[0] * (1 - a)) + ',' + Math.round(x[1] * a + y[1] * (1 - a)) + ',' + Math.round(x[2] * a + y[2] * (1 - a)) + ')';
    }
    function rgbhex(s) { var m = /rgb\((\d+),(\d+),(\d+)\)/.exec(s); return m ? '#' + ((1 << 24) + (+m[1] << 16) + (+m[2] << 8) + +m[3]).toString(16).slice(1) : s; }
    function getColors() {
      var cs = getComputedStyle(html), v = function (n, d) { return cs.getPropertyValue(n).trim() || d; };
      var paper = v('--paper', '#F4ECDB'), ink = v('--ink', '#1E2430'), leaf = v('--leaf', '#2E6B49'), haldi = v('--haldi', '#D19A1E'),
          terra = v('--terra', '#B3432A'), indigo = v('--indigo', '#2C4078'), grey = v('--ink-3', '#6E7687'), dark = cs.getPropertyValue('color-scheme').trim() === 'dark';
      var brown = rgbhex(mix(ink, haldi, 0.62));            /* moose and wild-dog ground colour */
      col = { bird: v('--bird', 'rgba(46,107,73,.6)'), birdLine: v('--bird-line', 'rgba(30,36,48,.62)'), paper: paper, ink: ink, haldi: haldi, dark: dark,
              leaf: mix(leaf, paper, 0.58), stem: mix(v('--leaf-deep', '#235339'), paper, 0.6), line: mix(ink, paper, 0.52), eye: mix(ink, paper, 0.8),
              terra: mix(terra, paper, 0.7), haldiSoft: mix(haldi, paper, 0.72), indigo: mix(indigo, paper, 0.6),
              water: mix(indigo, paper, dark ? 0.35 : 0.2), waterLine: mix(indigo, paper, 0.5),
              wolf: mix(grey, paper, 0.5), wolfLine: mix(ink, paper, 0.55),
              deer: mix(haldi, paper, 0.66), deerLine: mix(ink, paper, 0.58),
              red: mix(rgbhex(mix(terra, haldi, 0.55)), paper, 0.66),
              moose: mix(brown, paper, 0.7), moosePale: mix(brown, paper, 0.4),
              dog: mix(brown, paper, 0.62), dogDark: mix(ink, paper, 0.62), dogPale: mix(haldi, paper, 0.5),
              rat: mix(paper, ink, 0.9), ratPink: mix(terra, paper, 0.45),
              fish: mix(haldi, paper, 0.75), fin: mix(terra, paper, 0.72), fishFin2: mix(leaf, paper, 0.7),
              beetle: mix(indigo, paper, 0.82), wing: mix(ink, paper, 0.3) };
    }
    getColors();
    if (window.MutationObserver) new MutationObserver(getColors).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia && mq('(prefers-color-scheme: dark)').addEventListener) mq('(prefers-color-scheme: dark)').addEventListener('change', getColors);

    /* ================================================================ plants */
    function makePlant(fx, kind) {
      var h = rnd(0.11, 0.17) * Math.min(H, 900) * (kind === 2 ? 1.2 : 1), n = 5 + Math.floor(R() * 3), leaves = [];
      for (var i = 0; i < n; i++) leaves.push({ t: 0.2 + 0.68 * i / (n - 1) + rnd(-0.03, 0.03), side: i % 2 ? 1 : -1,
        len: rnd(0.26, 0.4) * h * (kind === 1 ? 1.25 : 1), ang: rnd(0.5, 0.9), ph: R() * TAU });
      return { fx: fx, x: fx * W, h: h, g: 0, rate: 1 / rnd(16, 32), lean: rnd(-0.14, 0.14), ph: R() * TAU, leaves: leaves, kind: kind, spawnAt: T + rnd(3, 9) };
    }
    function plantRot(p) { return p.lean * p.g + Math.sin(T * 0.7 + p.ph) * 0.03 * p.g; }
    function leafDir(l) { return [l.side * Math.sin(l.ang), -Math.cos(l.ang)]; }
    function leafPoint(p, l, u) {                              /* world position u (0..1) along a leaf */
      var r = plantRot(p), y0 = p.h * l.t, d = leafDir(l), grown = Math.min(1, Math.max(0, (p.g - l.t) / 0.12)), len = l.len * grown * u;
      var ax = y0 * Math.sin(r), ay = -y0 * Math.cos(r);
      var dx = d[0] * Math.cos(r) - d[1] * Math.sin(r), dy = d[0] * Math.sin(r) + d[1] * Math.cos(r);
      return [p.x + ax + dx * len, ground + ay + dy * len];
    }
    function leafTip(p, l) { return leafPoint(p, l, 1); }
    function leafPath(len, w) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -w, len, 0); ctx.quadraticCurveTo(len * 0.5, w, 0, 0); ctx.closePath(); }
    function drawPlant(p) {
      if (p.g <= 0.02) return;
      var hh = p.h * p.g, lw = Math.max(1.1, 1.1 * k);
      ctx.save(); ctx.translate(p.x, ground); ctx.rotate(plantRot(p));
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-p.lean * 40 * p.g, -hh * 0.55, 0, -hh);
      ctx.lineWidth = Math.max(1.6, 2.4 * k); ctx.strokeStyle = col.stem; ctx.stroke();
      for (var i = 0; i < p.leaves.length; i++) {
        var l = p.leaves[i]; if (l.t >= p.g) continue;
        var u = Math.min(1, (p.g - l.t) / 0.12), len = l.len * u, d = leafDir(l), fl = Math.sin(T * 1.4 + l.ph) * 0.05;
        ctx.save(); ctx.translate(0, -p.h * l.t); ctx.rotate(Math.atan2(d[1], d[0]) + fl * l.side);
        leafPath(len, len * (p.kind === 1 ? 0.12 : p.kind === 2 ? 0.3 : 0.24));
        ctx.fillStyle = col.leaf; ctx.fill();
        ctx.lineWidth = lw; ctx.strokeStyle = col.line; ctx.stroke();
        if (p.kind !== 1) { ctx.beginPath(); ctx.moveTo(len * 0.1, 0); ctx.lineTo(len * 0.8, 0); ctx.lineWidth = lw * 0.7; ctx.strokeStyle = col.stem; ctx.stroke(); }
        ctx.restore();
      }
      if (p.g > 0.86) {                                      /* the crown: flower, paddy ear or alder catkin */
        var s = Math.min(1, (p.g - 0.86) / 0.14), r = 4.2 * k * s;
        ctx.save(); ctx.translate(0, -hh); ctx.lineWidth = lw; ctx.strokeStyle = col.line;
        if (p.kind === 0) {
          ctx.fillStyle = col.terra;
          for (var j = 0; j < 5; j++) { var a = j / 5 * TAU - Math.PI / 2; ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3, r * 0.9, r * 0.55, a, 0, TAU); ctx.fill(); ctx.stroke(); }
          ctx.fillStyle = col.haldiSoft; ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TAU); ctx.fill(); ctx.stroke();
        } else if (p.kind === 1) {
          ctx.fillStyle = col.haldiSoft;
          for (var m = 0; m < 7; m++) { var yy = -m * r * 0.9, xx = (m % 2 ? 1 : -1) * r * 0.55; ctx.beginPath(); ctx.ellipse(xx, yy, r * 0.5, r * 0.32, -0.6 * (m % 2 ? 1 : -1), 0, TAU); ctx.fill(); ctx.stroke(); }
        } else {
          ctx.fillStyle = col.terra; ctx.beginPath(); ctx.ellipse(r * 0.4, r * 0.6, r * 0.5, r * 1.3, 0.35, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col.leaf; ctx.beginPath(); ctx.ellipse(-r * 0.6, -r * 0.2, r * 1.1, r * 0.75, -0.5, 0, TAU); ctx.fill(); ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }

    /* ================================================================ the pond: fish and plankton */
    function makePond() {
      var rx = Math.max(70, Math.min(190, W * 0.11)), ry = rx * 0.28, left = W > 900 && R() < 0.5;   /* on a wide screen it may sit in the left margin */
      var cx = left ? Math.min(W * 0.5, rx + 24 * k) : Math.max(W * 0.5, W - rx - 24 * k);
      return { x: cx, y: ground - ry * 0.55, rx: rx, ry: ry, ph: R() * TAU };
    }
    function drawPond(q) {
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.ellipse(q.x, q.y, q.rx, q.ry, 0, 0, TAU); ctx.fillStyle = col.water; ctx.fill();
      ctx.lineWidth = cw(); ctx.strokeStyle = col.waterLine; ctx.stroke();
      ctx.lineWidth = Math.max(1, 0.9 * k);                                                     /* ripples */
      for (var i = 0; i < 3; i++) { var yy = q.y - q.ry * 0.5 + i * q.ry * 0.5, w = q.rx * (0.35 + 0.15 * i), ox = Math.sin(T * 0.5 + q.ph + i) * q.rx * 0.12;
        ctx.beginPath(); ctx.moveTo(q.x - w + ox, yy); ctx.quadraticCurveTo(q.x - w * 0.5 + ox, yy - 2 * k, q.x + ox, yy); ctx.quadraticCurveTo(q.x + w * 0.5 + ox, yy + 2 * k, q.x + w + ox, yy); ctx.stroke(); }
      ctx.restore();
    }
    function makeFish(q) { return { x: q.x + rnd(-0.5, 0.5) * q.rx, y: q.y + rnd(-0.3, 0.5) * q.ry, dir: R() < 0.5 ? -1 : 1, v: rnd(0.25, 0.45) * k, ph: R() * TAU, s: 0.4, smax: rnd(0.8, 1.05), born: T }; }
    function stepFish(f, dt) {
      var q = pond, a = T - f.born;
      f.s = 0.25 + f.smax / (1 + Math.exp(-(a - 35) / 10));                                  /* logistic growth: the fish grows in the pond */
      f.x += f.dir * f.v * P.pace * dt;
      f.y += Math.sin(T * 0.8 + f.ph) * 0.08 * k * dt;
      var lim = q.rx * 0.78 - base * f.s * 0.6;
      if (f.x > q.x + lim) { f.dir = -1; } else if (f.x < q.x - lim) { f.dir = 1; }
      f.y = Math.max(q.y - q.ry * 0.35, Math.min(q.y + q.ry * 0.55, f.y));
    }
    function drawFish(f) {
      var L = base * 1.15 * f.s, wag = Math.sin(T * 6 * P.pace + f.ph) * 0.12;
      ctx.save(); ctx.translate(f.x, f.y); ctx.scale(L * f.dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = cw() / L; ctx.strokeStyle = col.line;
      ctx.fillStyle = col.fin; ctx.beginPath(); ctx.moveTo(-0.32, 0); ctx.lineTo(-0.56, -0.2 + wag); ctx.lineTo(-0.5, 0); ctx.lineTo(-0.56, 0.2 + wag); ctx.closePath(); ctx.fill(); ctx.stroke();   /* tail */
      ctx.fillStyle = col.fish; ctx.beginPath(); ctx.moveTo(0.5, 0); ctx.quadraticCurveTo(0.05, -0.32, -0.34, 0); ctx.quadraticCurveTo(0.05, 0.32, 0.5, 0); ctx.closePath(); ctx.fill(); ctx.stroke();   /* lens body */
      ctx.fillStyle = col.fishFin2; ctx.beginPath(); ctx.moveTo(-0.05, -0.2); ctx.quadraticCurveTo(0.08, -0.36, 0.22, -0.22); ctx.lineTo(0.08, -0.17); ctx.closePath(); ctx.fill(); ctx.stroke();   /* dorsal fin */
      ctx.lineWidth = cw() * 0.6 / L;                                                                                  /* scale arcs */
      for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-0.08 + i * 0.1, 0, 0.1, -1.1, 1.1); ctx.stroke(); }
      ctx.lineWidth = cw() / L; ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(0.3, -0.03, 0.07, 0, TAU); ctx.fill(); ctx.stroke();   /* ringed eye */
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(0.31, -0.03, 0.03, 0, TAU); ctx.fill();
      ctx.restore();
    }
    function makePlankter(q) { return { x: q.x + rnd(-0.7, 0.7) * q.rx, y: q.y + rnd(-0.45, 0.6) * q.ry, ph: R() * TAU, kind: Math.floor(R() * 3), s: rnd(0.9, 1.4) }; }
    function drawPlankter(z) {
      var q = pond, x = z.x + Math.sin(T * 0.6 + z.ph) * 4 * k, y = z.y + Math.cos(T * 0.45 + z.ph) * 2 * k, r = 1.6 * k * z.s;
      if (Math.abs(x - q.x) > q.rx * 0.85) return;
      ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col.waterLine; ctx.fillStyle = col.haldiSoft; ctx.lineWidth = Math.max(0.8, 0.7 * k);
      if (z.kind === 0) { ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.stroke(); }                                         /* a protozoan */
      else if (z.kind === 1) { ctx.beginPath(); ctx.ellipse(0, 0, r * 1.3, r * 0.8, 0.6, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(r * 2.2, r * 0.8); ctx.stroke(); }   /* a copepod with its tail */
      else { ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, TAU); ctx.fill(); }   /* a rotifer ring */
      ctx.restore();
    }

    /* ================================================================ insects: bee, butterfly, dragonfly, alder leaf beetle */
    function freeLeaf(p) { var ok = p.leaves.filter(function (l) { return l.t < p.g - 0.1; }); return ok.length ? pick(ok) : null; }
    function makeInsect(kind, p, l) {
      var t = p ? leafTip(p, l) : [pond.x + rnd(-0.6, 0.6) * pond.rx, pond.y - pond.ry - rnd(8, 30) * k];
      return { kind: kind, x: t[0], y: t[1], plant: p, leaf: l, state: kind === 'beetle' ? 'crawl' : (p ? 'leaf' : 'hover'), u: rnd(0.3, 0.9),
               ph: R() * TAU, next: T + rnd(5, 14), born: T, life: kind === 'beetle' ? rnd(25, 60) : 1e9, tp: null, tl: null, dead: false };
    }
    function alders() { return plants.filter(function (p) { return p.kind === 2 && p.g > 0.6; }); }
    function stepInsect(n, dt) {
      if (T - n.born > n.life) { n.dead = true; return; }           /* a beetle parasitised by Meigenia: the eco-epidemic has its brake */
      if (n.state === 'leaf' || n.state === 'crawl') {
        if (n.kind === 'beetle') {
          n.u += Math.sin(T * 0.3 + n.ph) * 0.004 * dt; n.u = Math.max(0.25, Math.min(0.95, n.u));
          var c = leafPoint(n.plant, n.leaf, n.u); n.x = c[0]; n.y = c[1] - 2.5 * k;
          if (T > n.next) { var al = alders(), q0 = al.length ? pick(al) : null, l0 = q0 ? freeLeaf(q0) : null;
            if (l0 && q0 === n.plant) { n.leaf = l0; n.next = T + rnd(8, 18); }                       /* crawl to another leaf of the same alder */
            else if (l0 && R() < 0.35) { n.tp = q0; n.tl = l0; n.state = 'fly'; } else n.next = T + rnd(5, 10); }
          return;
        }
        var t = leafTip(n.plant, n.leaf); n.x = t[0] + Math.sin(T * 2.1 + n.ph) * 2 * k; n.y = t[1] - 3 * k + Math.cos(T * 1.7 + n.ph) * 1.5 * k;
        if (T > n.next && plants.length > 1) {
          var q = pick(plants), ql = q !== n.plant ? freeLeaf(q) : null;
          if (ql) { n.tp = q; n.tl = ql; n.state = 'fly'; } else n.next = T + rnd(3, 6);
        }
      } else if (n.state === 'hover') {                            /* a dragonfly over the pond: darts and hangs */
        n.x += Math.sin(T * 1.3 + n.ph) * 0.9 * k * dt; n.y += Math.cos(T * 2.7 + n.ph) * 0.5 * k * dt;
        n.x = Math.max(pond.x - pond.rx, Math.min(pond.x + pond.rx, n.x)); n.y = Math.max(pond.y - pond.ry - 40 * k, Math.min(pond.y - pond.ry - 4 * k, n.y));
        if (T > n.next && plants.length) { var qp = pick(plants), qq = freeLeaf(qp); if (qq) { n.tp = qp; n.tl = qq; n.state = 'fly'; } else n.next = T + rnd(4, 8); }
      } else {                                                     /* on the wing — this is when the birds see them */
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
      ctx.save(); ctx.translate(n.x, n.y); ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = col.eye;
      if (n.kind === 'bee') {
        if (n.state === 'fly' && n.tp) { var tt = leafTip(n.tp, n.tl); ctx.rotate(Math.atan2(tt[1] - n.y, tt[0] - n.x) * 0.25); }
        ctx.fillStyle = col.wing;
        ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), -0.5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s * 0.14, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), 0.5, 0, TAU); ctx.fill();
        ctx.fillStyle = col.haldi; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.26, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.24); ctx.lineTo(-s * 0.12, s * 0.24); ctx.moveTo(s * 0.08, -s * 0.25); ctx.lineTo(s * 0.08, s * 0.25); ctx.stroke();
        ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(s * 0.48, 0, s * 0.14, 0, TAU); ctx.fill();
      } else if (n.kind === 'butterfly') {                        /* a butterfly by day, a moth by night */
        var sp = 0.35 + 0.65 * Math.abs(Math.sin(T * 9 + n.ph)), ws = s * 1.4, wc = col.dark ? col.wolf : col.terra;
        for (var sd = -1; sd <= 1; sd += 2) {
          ctx.save(); ctx.scale(sd * sp, 1); ctx.fillStyle = wc;
          ctx.beginPath(); ctx.ellipse(ws * 0.42, -ws * 0.22, ws * 0.42, ws * 0.3, -0.35, 0, TAU); ctx.fill(); ctx.stroke();   /* forewing */
          ctx.beginPath(); ctx.ellipse(ws * 0.3, ws * 0.2, ws * 0.3, ws * 0.22, 0.4, 0, TAU); ctx.fill(); ctx.stroke();        /* hindwing */
          ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(ws * 0.5, -ws * 0.24, ws * 0.08, 0, TAU); ctx.fill();            /* eyespot */
          ctx.restore();
        }
        ctx.fillStyle = col.eye; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.12, s * 0.42, 0, 0, TAU); ctx.fill();               /* body */
        ctx.beginPath(); ctx.moveTo(0, -s * 0.4); ctx.lineTo(-s * 0.25, -s * 0.75); ctx.moveTo(0, -s * 0.4); ctx.lineTo(s * 0.25, -s * 0.75); ctx.stroke();   /* antennae */
      } else if (n.kind === 'dragonfly') {
        var hd = n.state === 'fly' && n.tp ? leafTip(n.tp, n.tl) : [n.x + 1, n.y]; ctx.rotate(Math.atan2(hd[1] - n.y, hd[0] - n.x) * 0.5);
        var wl = s * 1.2, wf = 0.5 + 0.5 * Math.abs(flap);
        ctx.fillStyle = col.wing;
        for (var sw = -1; sw <= 1; sw += 2) { ctx.beginPath(); ctx.ellipse(-s * 0.1, sw * s * 0.22 * wf, wl * 0.5, s * 0.14, sw * 0.25, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(s * 0.25, sw * s * 0.2 * wf, wl * 0.42, s * 0.12, sw * 0.15, 0, TAU); ctx.fill(); }
        ctx.fillStyle = col.indigo; ctx.beginPath(); ctx.moveTo(s * 0.3, 0); ctx.lineTo(-s * 1.1, -s * 0.05); ctx.lineTo(-s * 1.1, s * 0.05); ctx.closePath(); ctx.fill(); ctx.stroke();   /* long body */
        ctx.beginPath(); ctx.arc(s * 0.36, 0, s * 0.16, 0, TAU); ctx.fill(); ctx.stroke();                                   /* head */
        ctx.fillStyle = col.paper; ctx.beginPath(); ctx.arc(s * 0.42, -s * 0.07, s * 0.06, 0, TAU); ctx.fill();               /* eye */
      } else {                                                     /* the alder leaf beetle: a blue-black oval */
        var bs = s * 0.7;
        ctx.fillStyle = col.beetle; ctx.beginPath(); ctx.ellipse(0, 0, bs * 0.55, bs * 0.38, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-bs * 0.15, -bs * 0.36); ctx.lineTo(-bs * 0.15, bs * 0.36); ctx.stroke();                 /* elytra seam */
        ctx.beginPath(); ctx.arc(bs * 0.6, 0, bs * 0.17, 0, TAU); ctx.fill(); ctx.stroke();                                   /* head */
        if (n.state === 'fly') { ctx.fillStyle = col.wing; ctx.beginPath(); ctx.ellipse(-bs * 0.1, -bs * 0.45, bs * 0.45, bs * 0.18, -0.4, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-bs * 0.1, bs * 0.45, bs * 0.45, bs * 0.18, 0.4, 0, TAU); ctx.fill(); }
      }
      ctx.restore();
    }

    /* ================================================================ four-legged figures */
    function leg(x0, y0, x1, y1, x2, y2, w, fill, line) {     /* a flat leg with a lamp-black contour */
      var c = ctx.lineWidth;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.lineWidth = w + 2 * c; ctx.strokeStyle = line; ctx.stroke();
      ctx.lineWidth = w; ctx.strokeStyle = fill; ctx.stroke();
      ctx.lineWidth = c; ctx.strokeStyle = line;
    }
    function almond(x, y, rx, ry, rot, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(x + rx * 0.2, y, ry * 0.5, 0, TAU); ctx.fill(); }

    /* -- deer: roe (resident grazer) and red stag (crosser, with antlers) */
    function drawDeer(x, dir, kind, neck, gait, ph, bob0) {
      var red = kind === 'red', L = base * (red ? 3.0 : 2.3), bob = Math.sin(ph) * gait * 0.12 + (bob0 || 0), fill = red ? col.red : col.deer, line = col.deerLine;
      ctx.save(); ctx.translate(x, ground); ctx.scale(L * dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = cw() / L; ctx.strokeStyle = line; ctx.fillStyle = fill;
      for (var i = 0; i < 4; i++) {
        var lx = [-0.24, -0.15, 0.15, 0.24][i], sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        leg(lx, -0.46 + bob, lx + sw * 0.5, -0.24 + bob * 0.5, lx + sw * 1.3, 0, 0.05, fill, line);
      }
      ctx.beginPath(); ctx.ellipse(0, -0.58 + bob, 0.33, 0.165, 0.05, 0, TAU); ctx.fill(); ctx.stroke();            /* body */
      ctx.fillStyle = mix(col.paper, fill, 0.5); ctx.beginPath(); ctx.ellipse(-0.25, -0.57 + bob, 0.055, 0.075, 0, 0, TAU); ctx.fill();   /* pale rump */
      ctx.fillStyle = fill;
      var a = neck, nx = 0.27 + 0.38 * Math.cos(a), ny = -0.66 + bob - 0.38 * Math.sin(a), px = Math.sin(a), py = Math.cos(a);
      ctx.beginPath(); ctx.moveTo(0.22 - 0.075 * px, -0.68 + bob - 0.075 * py); ctx.lineTo(nx - 0.04 * px, ny - 0.04 * py); ctx.lineTo(nx + 0.04 * px, ny + 0.04 * py); ctx.lineTo(0.32 + 0.075 * px, -0.58 + bob + 0.075 * py); ctx.closePath(); ctx.fill(); ctx.stroke();   /* neck */
      ctx.save(); ctx.translate(nx, ny); ctx.rotate(-a);
      ctx.beginPath(); ctx.ellipse(0.09, 0, 0.14, 0.062, 0, 0, TAU); ctx.fill(); ctx.stroke();                       /* head */
      ctx.beginPath(); ctx.moveTo(-0.03, -0.04); ctx.lineTo(-0.13, -0.24); ctx.lineTo(0.02, -0.06); ctx.closePath(); ctx.fill(); ctx.stroke();   /* ears */
      ctx.beginPath(); ctx.moveTo(0.04, -0.06); ctx.lineTo(0.0, -0.25); ctx.lineTo(0.11, -0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (red) {                                                                                                        /* branched antlers */
        ctx.lineWidth = cw() * 1.3 / L;
        for (var ii = 0; ii < 2; ii++) { var sx = ii ? 0.0 : -0.06, sy = ii ? -0.3 : -0.26, dx = ii ? 0.1 : -0.12;
          ctx.beginPath(); ctx.moveTo(sx, sy * 0.2); ctx.quadraticCurveTo(sx + dx * 0.5, sy * 0.8, sx + dx, sy - 0.12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx + dx * 0.35, sy * 0.6); ctx.lineTo(sx + dx * 0.35 + dx * 0.9, sy * 0.55 - 0.12); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(sx + dx * 0.7, sy * 0.85 - 0.04); ctx.lineTo(sx + dx * 0.7 + dx * 0.8, sy * 0.8 - 0.14); ctx.stroke(); }
        ctx.lineWidth = cw() / L;
      }
      almond(0.1, -0.012, 0.034, 0.019, 0, col.paper);
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(0.225, 0.004, 0.014, 0, TAU); ctx.fill();                      /* nose */
      ctx.restore();
      ctx.fillStyle = mix(col.paper, fill, 0.55);                                                                       /* Jamini dots */
      for (var j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(-0.16 + j * 0.11, -0.56 + bob + (j % 2) * 0.05, 0.02, 0, TAU); ctx.fill(); }
      ctx.restore();
    }

    /* -- canids: the grey wolf and the painted (African wild) dog */
    function canidBody(bob) {
      ctx.beginPath(); ctx.moveTo(0.3, -0.5 + bob); ctx.bezierCurveTo(0.1, -0.57 + bob, -0.2, -0.57 + bob, -0.4, -0.47 + bob);
      ctx.bezierCurveTo(-0.5, -0.42 + bob, -0.5, -0.3 + bob, -0.44, -0.26 + bob); ctx.bezierCurveTo(-0.3, -0.22 + bob, -0.05, -0.2 + bob, 0.14, -0.26 + bob);
      ctx.bezierCurveTo(0.26, -0.3 + bob, 0.34, -0.36 + bob, 0.34, -0.44 + bob); ctx.closePath();
    }
    function drawCanid(x, dir, kind, s, ph, moving) {
      var dog = kind === 'wilddog', L = base * (dog ? 2.0 : 2.2) * s, gait = moving ? (dog ? 0.14 : 0.12) : 0, bob = Math.sin(ph * 2) * gait * 0.1;
      var fill = dog ? col.dog : col.wolf, line = dog ? col.dogDark : col.wolfLine;
      ctx.save(); ctx.translate(x, ground); ctx.scale(L * dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = line; ctx.fillStyle = fill; ctx.lineWidth = cw() / L;
      for (var i = 0; i < 4; i++) {
        var lx = [-0.3, -0.2, 0.16, 0.26][i], ly = i < 2 ? -0.3 : -0.34, sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        leg(lx, ly + bob, lx + sw * 0.5, -0.16 + bob * 0.5, lx + sw * 1.3, 0, dog ? 0.05 : 0.06, fill, line);
      }
      canidBody(bob); ctx.fill(); ctx.stroke();                                                                           /* body */
      if (dog) {                                                                                                           /* painted coat: dark and pale blotches */
        ctx.save(); canidBody(bob); ctx.clip();
        ctx.fillStyle = col.dogDark; ctx.beginPath(); ctx.ellipse(-0.22, -0.46 + bob, 0.12, 0.08, 0.3, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(0.16, -0.32 + bob, 0.1, 0.06, -0.4, 0, TAU); ctx.fill();
        ctx.fillStyle = col.dogPale; ctx.beginPath(); ctx.ellipse(0.0, -0.5 + bob, 0.1, 0.06, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-0.36, -0.3 + bob, 0.08, 0.06, 0, 0, TAU); ctx.fill();
        ctx.restore(); ctx.fillStyle = fill;
      }
      ctx.beginPath(); ctx.moveTo(-0.42, -0.44 + bob); ctx.bezierCurveTo(-0.6, -0.42 + bob, -0.72, -0.3 + bob, -0.78, -0.12 + bob);   /* tail, low and bushy */
      ctx.bezierCurveTo(-0.74, -0.08 + bob, -0.68, -0.1 + bob, -0.66, -0.14 + bob); ctx.bezierCurveTo(-0.6, -0.28 + bob, -0.52, -0.36 + bob, -0.4, -0.38 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (dog) { ctx.fillStyle = col.paper; ctx.beginPath(); ctx.ellipse(-0.73, -0.14 + bob, 0.05, 0.04, 0.8, 0, TAU); ctx.fill(); ctx.fillStyle = fill; }   /* white tail tip */
      ctx.beginPath(); ctx.moveTo(0.3, -0.52 + bob); ctx.bezierCurveTo(0.36, -0.64 + bob, 0.48, -0.68 + bob, 0.56, -0.66 + bob);          /* head, muzzle forward */
      ctx.lineTo(dog ? 0.78 : 0.84, -0.58 + bob); ctx.lineTo(dog ? 0.79 : 0.85, -0.54 + bob); ctx.lineTo(0.62, -0.49 + bob); ctx.bezierCurveTo(0.52, -0.47 + bob, 0.42, -0.43 + bob, 0.34, -0.44 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (dog) {                                                                                                           /* big rounded ears */
        ctx.beginPath(); ctx.ellipse(0.46, -0.74 + bob, 0.075, 0.095, -0.2, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0.58, -0.73 + bob, 0.07, 0.09, 0.2, 0, TAU); ctx.fill(); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(0.45, -0.66 + bob); ctx.lineTo(0.49, -0.83 + bob); ctx.lineTo(0.57, -0.68 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0.55, -0.67 + bob); ctx.lineTo(0.62, -0.81 + bob); ctx.lineTo(0.65, -0.65 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      almond(0.57, -0.6 + bob, 0.04, 0.022, 0.15, col.haldiSoft);
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(dog ? 0.77 : 0.83, -0.57 + bob, 0.016, 0, TAU); ctx.fill();     /* nose */
      ctx.restore();
    }

    /* -- the moose: tall, humped, palmate antlers, a bell under the throat */
    function drawMoose(x, dir, ph, moving, browse) {
      var L = base * 3.3, gait = moving ? 0.1 : 0, bob = Math.sin(ph * 2) * gait * 0.08, nod = browse ? 0.08 + Math.sin(T * 1.5) * 0.03 : 0;
      ctx.save(); ctx.translate(x, ground); ctx.scale(L * dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = cw() / L; ctx.strokeStyle = col.deerLine; ctx.fillStyle = col.moose;
      for (var i = 0; i < 4; i++) {
        var lx = [-0.3, -0.2, 0.18, 0.28][i], sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        leg(lx, -0.5 + bob, lx + sw * 0.5, -0.26 + bob * 0.5, lx + sw * 1.2, 0, 0.065, col.moose, col.deerLine);
      }
      ctx.beginPath(); ctx.moveTo(0.3, -0.74 + bob); ctx.bezierCurveTo(0.2, -0.9 + bob, 0.0, -0.9 + bob, -0.12, -0.8 + bob);        /* hump and back */
      ctx.bezierCurveTo(-0.3, -0.76 + bob, -0.44, -0.72 + bob, -0.46, -0.6 + bob); ctx.bezierCurveTo(-0.48, -0.5 + bob, -0.4, -0.42 + bob, -0.3, -0.42 + bob);
      ctx.lineTo(0.2, -0.44 + bob); ctx.bezierCurveTo(0.32, -0.46 + bob, 0.38, -0.56 + bob, 0.36, -0.66 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(0.32, -0.74 + bob); ctx.rotate(nod);                                                                /* neck and the long head */
      ctx.beginPath(); ctx.moveTo(-0.06, 0.08); ctx.lineTo(0.14, -0.1); ctx.lineTo(0.24, -0.06); ctx.lineTo(0.26, 0.02); ctx.lineTo(0.14, 0.12); ctx.lineTo(0.06, 0.2); ctx.lineTo(-0.02, 0.18); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.16, -0.1); ctx.bezierCurveTo(0.26, -0.14, 0.38, -0.1, 0.46, 0.0); ctx.bezierCurveTo(0.52, 0.08, 0.5, 0.16, 0.42, 0.18);
      ctx.bezierCurveTo(0.36, 0.2, 0.3, 0.16, 0.24, 0.1); ctx.lineTo(0.14, 0.12); ctx.closePath(); ctx.fill(); ctx.stroke();      /* roman nose */
      ctx.beginPath(); ctx.moveTo(0.1, 0.16); ctx.lineTo(0.12, 0.3); ctx.lineTo(0.17, 0.17); ctx.closePath(); ctx.fill(); ctx.stroke();   /* bell */
      ctx.beginPath(); ctx.moveTo(0.14, -0.1); ctx.lineTo(0.08, -0.24); ctx.lineTo(0.2, -0.13); ctx.closePath(); ctx.fill(); ctx.stroke();   /* ear */
      ctx.fillStyle = col.moosePale;                                                                                                   /* palmate antlers */
      for (var an = 0; an < 2; an++) { var sd = an ? 1 : -1, ax = an ? 0.14 : 0.04; ctx.beginPath(); ctx.moveTo(ax, -0.12);
        ctx.bezierCurveTo(ax + sd * 0.08, -0.26, ax + sd * 0.28, -0.3, ax + sd * 0.3, -0.42); ctx.lineTo(ax + sd * 0.22, -0.38); ctx.lineTo(ax + sd * 0.2, -0.48); ctx.lineTo(ax + sd * 0.12, -0.4);
        ctx.lineTo(ax + sd * 0.08, -0.48); ctx.lineTo(ax + sd * 0.02, -0.34); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = col.moose; almond(0.22, -0.04, 0.03, 0.018, 0.1, col.haldiSoft);
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(0.47, 0.06, 0.022, 0, TAU); ctx.fill();                                       /* nose */
      ctx.restore(); ctx.restore();
    }

    /* -- the white rat: a quick scurry along the ground */
    function drawRat(x, dir, ph, moving, sniff) {
      var L = base * 1.15, gait = moving ? 0.2 : 0, bob = Math.sin(ph * 2) * gait * 0.06, nod = sniff ? Math.sin(T * 8) * 0.08 : 0;
      ctx.save(); ctx.translate(x, ground); ctx.scale(L * dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = 0.035; ctx.strokeStyle = col.ratPink;
      ctx.beginPath(); ctx.moveTo(-0.38, -0.12 + bob); ctx.bezierCurveTo(-0.6, -0.1 + bob, -0.8, 0.0 + bob, -0.95, -0.14 + bob); ctx.stroke();   /* tail */
      ctx.lineWidth = cw() / L; ctx.strokeStyle = col.line; ctx.fillStyle = col.rat;
      for (var i = 0; i < 4; i++) { var lx = [-0.22, -0.14, 0.14, 0.22][i], sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait; leg(lx, -0.16 + bob, lx + sw * 0.5, -0.08 + bob, lx + sw * 1.1, 0, 0.04, col.rat, col.line); }
      ctx.beginPath(); ctx.ellipse(0, -0.2 + bob, 0.42, 0.18, 0, 0, TAU); ctx.fill(); ctx.stroke();                                   /* body */
      ctx.save(); ctx.translate(0.36, -0.24 + bob); ctx.rotate(nod);
      ctx.beginPath(); ctx.moveTo(-0.08, -0.1); ctx.lineTo(0.32, 0.0); ctx.lineTo(-0.06, 0.12); ctx.closePath(); ctx.fill(); ctx.stroke();   /* pointed head */
      ctx.fillStyle = col.ratPink; ctx.beginPath(); ctx.arc(-0.02, -0.14, 0.07, 0, TAU); ctx.fill(); ctx.stroke();                     /* ear */
      ctx.beginPath(); ctx.arc(0.31, 0.0, 0.025, 0, TAU); ctx.fill();                                                                 /* nose */
      ctx.fillStyle = col.terra; ctx.beginPath(); ctx.arc(0.1, -0.03, 0.03, 0, TAU); ctx.fill();                                      /* pink eye */
      ctx.restore(); ctx.restore();
    }

    /* ================================================================ behaviours */
    function makeDeer() { return { x: rnd(W * 0.2, W * 0.8), dir: R() < 0.5 ? -1 : 1, state: 'graze', until: T + rnd(6, 14), ph: R() * TAU, neck: -0.9, target: 0 }; }
    function predatorNear(x) { return cross && cross.on && (cross.kind === 'wolf' || cross.kind === 'wilddog') && Math.abs(cross.x - x) < Math.min(W * 0.36, 520 * k); }
    function stepDeer(d, dt) {
      var L = 2.3 * base;
      if (d.state === 'gone') { if (T > d.until) { d.state = 'walk'; d.dir = R() < 0.5 ? 1 : -1; d.x = d.dir > 0 ? -L : W + L; d.target = plants.length ? pick(plants).x : W / 2; } return; }
      if (predatorNear(d.x) && d.state !== 'flee') { d.state = 'flee'; d.dir = d.x < cross.x ? -1 : 1; }
      var want = d.state === 'graze' ? -0.95 : d.state === 'walk' ? 0.5 : 0.12;
      d.neck += (want - d.neck) * Math.min(1, 0.06 * dt);
      if (d.state === 'graze') { if (T > d.until) { d.state = 'walk'; var p = pick(plants); d.target = p ? p.x + (R() < 0.5 ? -1 : 1) * L * 0.6 : W / 2; d.dir = d.target > d.x ? 1 : -1; } }
      else if (d.state === 'walk') { d.x += d.dir * 0.3 * k * P.pace * dt; if ((d.dir > 0 && d.x >= d.target) || (d.dir < 0 && d.x <= d.target)) { d.state = 'graze'; d.until = T + rnd(7, 16); } }
      else if (d.state === 'flee') { d.x += d.dir * 1.9 * k * P.pace * dt; if (d.x < -L * 1.5 || d.x > W + L * 1.5) { d.state = 'gone'; d.until = T + rnd(24, 48); } }
    }

    /* crossings: one large visitor at a time, every kind in turn */
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
      if (c.kind === 'moose' && !c.browsed) {                                       /* a moose stops to browse the alder */
        var al = alders(); for (var i = 0; i < al.length; i++) if (Math.abs(al[i].x - (c.x + c.dir * c.L * 0.6)) < 4 * k) { c.browsed = true; c.state = 'pause'; c.pauseUntil = T + rnd(6, 10); break; }
      } else if (R() < 0.0012 * dt) { c.state = 'pause'; c.pauseUntil = T + rnd(1.5, 4); }
      if ((c.dir > 0 && c.x - span > W + c.L) || (c.dir < 0 && c.x + span < -c.L)) { c.on = false; c.until = T + rnd(18, 40); }
    }
    function drawCross(c) {
      if (!c.on) return;
      var moving = c.state === 'walk';
      for (var i = c.m.length - 1; i >= 0; i--) {
        var w = c.m[i], x = c.x + w.off * c.L * c.dir, ph = T * 7 * P.pace + w.ph;
        if (c.kind === 'wolf' || c.kind === 'wilddog') drawCanid(x, c.dir, c.kind, w.s, ph, moving);
        else if (c.kind === 'moose') drawMoose(x, c.dir, ph, moving, c.state === 'pause' && c.browsed);
        else drawDeer(x, c.dir, 'red', c.state === 'pause' ? -0.9 : 0.45, moving ? 0.09 : 0, ph, 0);
      }
    }

    /* the rat: appears now and then, scurries from plant to plant, leaves */
    function makeRat() { return { on: false, until: T + rnd(20, 45), x: 0, dir: 1, state: 'run', target: 0, pauseUntil: 0, ph: R() * TAU, hops: 0 }; }
    function stepRat(r, dt) {
      var L = 1.15 * base;
      if (!r.on) { if (T > r.until) { r.on = true; r.dir = R() < 0.5 ? 1 : -1; r.x = r.dir > 0 ? -L : W + L; r.hops = 2 + Math.floor(R() * 3); r.state = 'run'; r.target = plants.length ? pick(plants).x + rnd(-20, 20) * k : W / 2; r.dir = r.target > r.x ? 1 : -1; } return; }
      if (r.state === 'pause') { if (T > r.pauseUntil) { r.state = 'run'; if (r.hops-- <= 0) { r.target = r.dir > 0 ? W + L * 2 : -L * 2; } else { r.target = plants.length ? pick(plants).x + rnd(-20, 20) * k : W / 2; r.dir = r.target > r.x ? 1 : -1; } } return; }
      r.x += r.dir * 1.3 * k * P.pace * dt;
      if ((r.dir > 0 && r.x >= r.target) || (r.dir < 0 && r.x <= r.target)) {
        if (r.x < -L || r.x > W + L) { r.on = false; r.until = T + rnd(40, 90); } else { r.state = 'pause'; r.pauseUntil = T + rnd(1.5, 3.5); }
      }
    }

    /* ================================================================ the flock */
    function makeBird() { return { x: R() * W, y: R() * H * 0.8, vx: rnd(-0.7, 0.7) * k, vy: rnd(-0.7, 0.7) * k, ph: R() * TAU, s: rnd(0.8, 1.25), hunt: null, full: 0 }; }
    var body = new Path2D('M-.42 0C-.3 -.07 .15 -.08 .34 -.02L.53 -.03L.34 .03C.15 .08 -.3 .07 -.42 0Z');
    var wing = new Path2D('M.05 -.02C.02 -.27 -.14 -.45 -.41 -.53C-.31 -.3 -.21 -.12 -.08 0Z');
    var tail = new Path2D('M-.4 0L-.68 -.035M-.4 0L-.63 .04');
    var compose = !!(window.DOMMatrix && body.addPath), glyphs = [], STEPS = 12;
    if (compose) for (var gi = 0; gi <= STEPS; gi++) {      /* one combined path per wing position: even alpha where wing and body overlap */
      var fl = 0.25 + 0.62 * gi / STEPS, g = new Path2D(body);
      g.addPath(wing, new DOMMatrix([1, 0, 0, fl, 0, 0])); g.addPath(wing, new DOMMatrix([1, 0, 0, -fl, 0, 0])); glyphs.push(g);
    }
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
          if (d2 < P.see * P.see) {
            n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y;
            if (d2 < P.sep * P.sep) { var d = Math.sqrt(d2) || 1, q = (P.sep - d) / P.sep; sx -= dx / d * q; sy -= dy / d * q; }
          }
        }
        if (n) { ax /= n; ay /= n; cx /= n; cy /= n; b.vx += (ax - b.vx) * P.wAli * dt + (cx - b.x) * P.wCoh * dt; b.vy += (ay - b.vy) * P.wAli * dt + (cy - b.y) * P.wCoh * dt; }
        b.vx += sx * P.wSep * dt; b.vy += sy * P.wSep * dt;
        if (hasMouse) {
          var ddx = b.x - mx, ddy = b.y - my, dd2 = ddx * ddx + ddy * ddy;
          if (dd2 < P.cursorR * P.cursorR) { var dd = Math.sqrt(dd2) || 1, f = 1 - dd / P.cursorR; b.vx += ddx / dd * f * P.wCur * dt; b.vy += ddy / dd * f * P.wCur * dt; }
          else if (lamp && !b.hunt && dd2 < P.lampR * P.lampR) { var dl = Math.sqrt(dd2), u = (dl - P.cursorR) / (P.lampR - P.cursorR), a = Math.sin(u * Math.PI) * P.wLamp; b.vx -= ddx / dl * a * dt; b.vy -= ddy / dl * a * dt; }
        }
        if (b.hunt && (b.hunt.dead || b.hunt.state !== 'fly')) b.hunt = null;   /* the insect landed: it got away */
        if (!calm && !b.hunt && hunting < 2 && T > b.full && R() < 0.01 * dt) {
          var best = null, bd = P.hunt * P.hunt;
          for (j = 0; j < insects.length; j++) { var ins = insects[j]; if (ins.state !== 'fly') continue; var ex = ins.x - b.x, ey = ins.y - b.y, e2 = ex * ex + ey * ey; if (e2 < bd) { bd = e2; best = ins; } }
          if (best) { b.hunt = best; hunting++; }
        }
        var vmax = P.maxV;
        if (b.hunt) {
          var hx = b.hunt.x - b.x, hy = b.hunt.y - b.y, hd = Math.sqrt(hx * hx + hy * hy) || 1;
          b.vx += hx / hd * P.wHunt * dt; b.vy += hy / hd * P.wHunt * dt; vmax = P.huntV;
          if (hd < base * 0.55) { b.hunt.dead = true; b.hunt = null; b.full = T + rnd(18, 40); }
        }
        if (b.x < P.edge) b.vx += (P.edge - b.x) / P.edge * P.wEdge * dt;
        if (b.x > W - P.edge) b.vx -= (b.x - (W - P.edge)) / P.edge * P.wEdge * dt;
        if (b.y < P.edge) b.vy += (P.edge - b.y) / P.edge * P.wEdge * dt;
        if (b.y > H - P.edge) b.vy -= (b.y - (H - P.edge)) / P.edge * P.wEdge * dt;
        b.vx += (R() - 0.5) * P.wander * dt; b.vy += (R() - 0.5) * P.wander * dt;
        var v = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 1e-6, tv = Math.max(P.minV, Math.min(vmax, v));
        b.vx = b.vx / v * tv; b.vy = b.vy / v * tv;
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.ph += (0.16 + 0.1 * tv / P.maxV) * dt;
        var m = base * 2;
        if (b.x < -m) b.x = W + m; else if (b.x > W + m) b.x = -m;
        if (b.y < -m) b.y = H + m; else if (b.y > H + m) b.y = -m;
      }
    }

    /* ================================================================ world */
    function populate() {
      var N = calm ? Math.max(6, Math.min(14, Math.round((W * H) / 110000))) : Math.max(9, Math.min(30, Math.round((W * H) / 55000)));
      while (birds.length < N) birds.push(makeBird());
      if (birds.length > N) birds.length = N;
      if (!pond) pond = makePond();
      var np = Math.max(3, Math.min(7, Math.round(W / 300)));
      if (!plants.length) {
        var kinds = [2, 0, 1];                                   /* an alder always among them */
        for (var i = 0; i < np; i++) { var fx = (i + 0.5 + rnd(-0.25, 0.25)) / np, x = fx * W;
          if (Math.abs(x - pond.x) < pond.rx + 12 * k) fx = (pond.x + (x < pond.x ? -1 : 1) * (pond.rx + 16 * k)) / W;   /* not in the water */
          plants.push(makePlant(Math.max(0.03, Math.min(0.97, fx)), kinds[i % 3])); }
      }
      for (var j = 0; j < plants.length; j++) plants[j].x = plants[j].fx * W;
      if (!fishes.length) for (var f = 0; f < 3; f++) fishes.push(makeFish(pond));
      if (!plankton.length) for (var z = 0; z < 9; z++) plankton.push(makePlankter(pond));
      if (!deer) deer = makeDeer();
      if (!rat) rat = makeRat();
      if (!cross) cross = makeCross();
      seeded = true;
    }
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      if (!w || !h) return;                                  /* hidden or prerendered: wait for a real viewport */
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var old = W; W = w; H = h;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tune();
      if (pond && old && Math.abs(W - old) > 40) { pond = null; fishes = []; plankton = []; insects = insects.filter(function (n) { return n.kind !== 'dragonfly'; }); }   /* the pond follows the window */
      populate();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var i;
      drawPond(pond);
      for (i = 0; i < plankton.length; i++) drawPlankter(plankton[i]);
      for (i = 0; i < fishes.length; i++) drawFish(fishes[i]);
      drawCross(cross);
      if (deer.state !== 'gone') drawDeer(deer.x, deer.dir, 'roe', deer.neck, deer.state === 'walk' ? 0.09 : deer.state === 'flee' ? 0.22 : 0, T * (deer.state === 'flee' ? 14 : 6) * P.pace + deer.ph, 0);
      if (rat.on) drawRat(rat.x, rat.dir, T * 16 * P.pace + rat.ph, rat.state === 'run', rat.state === 'pause');
      for (i = 0; i < plants.length; i++) drawPlant(plants[i]);
      for (i = 0; i < insects.length; i++) drawInsect(insects[i]);
      for (i = 0; i < birds.length; i++) drawBird(birds[i]);
    }
    function simulate(dt) {
      T += dt / 60;
      var lamp = hasMouse && html.classList.contains('lantern-on'), i, cap = Math.min(14, 4 + plants.length * 2), dragonflies = 0;
      for (i = 0; i < plants.length; i++) {
        var p = plants[i];
        if (p.g < 1) p.g = Math.min(1, p.g + p.rate * dt / 60);
        if (p.g > 0.5 && T > p.spawnAt) {                        /* recruitment at the leaves */
          p.spawnAt = T + rnd(9, 20);
          if (insects.length < cap) { var l = freeLeaf(p); if (l) insects.push(makeInsect(p.kind === 2 && R() < 0.6 ? 'beetle' : (R() < 0.3 ? 'butterfly' : 'bee'), p, l)); }
        }
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
    if (/ecodebug/.test(location.search)) window.__eco = function () { return { T: T, cross: cross, deer: deer, rat: rat, pond: pond, plants: plants, insects: insects, birds: birds, fishes: fishes, start: startCross, make: makeInsect, draw: { canid: drawCanid, deer: drawDeer, moose: drawMoose, rat: drawRat, fish: drawFish, insect: drawInsect, plant: drawPlant, pond: drawPond, clear: function () { ctx.clearRect(0, 0, W, H); } } }; };
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
      if (!finePointer && (frame % 2)) { schedule(); return; }           /* 30 fps on touch devices */
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
