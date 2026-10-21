/* site.js — Dr. Sinchan Ghosh
   theme · drawer · custom cursor · lantern · the living margin (plants, insects, bee-eater flock, roe deer, wolf pack) ·
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

  /* ------------------------------------------------------------ the living margin: a small Jamini Roy food web
     One fixed canvas behind the page carries the systems this site is about:
       · plants grow from the ground line (vegetation, forage, the alder)
       · insects hatch at the leaves and move between plants (herbivores)
       · bee-eaters flock above (Boids; Reynolds 1987) and dive for insects on the wing (plant–insect–bird)
       · a roe deer grazes the plants; a wolf pack crosses the ground now and then and the deer flees (predator–prey)
     Everything is sized to the window (phone and 4K alike), drawn flat with lamp-black contours, kept at
     low alpha behind the content, and reduced to a still scene when the visitor prefers reduced motion.
     With the lantern lit the flock is drawn to the light (moths to a diya); the cursor itself is a predator. */
  try { (function ecosystem() {
    var canvas = document.getElementById('flock');
    if (!canvas || !canvas.getContext || typeof Path2D === 'undefined') return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var W = 0, H = 0, dpr = 1, base = 24, k = 1, ground = 0, seeded = false, P = {}, T = 0;
    var birds = [], insects = [], plants = [], pack = null, deer = null, col = {};
    var still = reduced;                                   /* reduced motion: one quiet frame, no animation */
    var R = Math.random, TAU = Math.PI * 2;
    function rnd(a, b) { return a + R() * (b - a); }

    function tune() {
      base = Math.max(24, Math.min(44, 14 + Math.min(W, H) / 40)); k = base / 24; ground = H - 2 * k;
      P = { maxV: 1.2 * k, minV: 0.45 * k, see: 84 * k, sep: 44 * k, wSep: 0.55 * k, wAli: 0.05, wCoh: 0.003,
            cursorR: 150 * k, wCur: 0.42 * k, lampR: Math.max(420, Math.min(W, H) * 0.62), wLamp: 0.009 * k,
            edge: 90 * k, wEdge: 0.06 * k, wander: 0.04 * k, line: 1.2 + 0.3 * k,
            hunt: Math.min(W, H) * 0.55, wHunt: 0.1 * k, huntV: 2.1 * k, insectV: 0.55 * k };
    }
    function getColors() {
      var cs = getComputedStyle(html), v = function (n, d) { return cs.getPropertyValue(n).trim() || d; };
      var paper = v('--paper', '#F4ECDB'), ink = v('--ink', '#1E2430'), leaf = v('--leaf', '#2E6B49'), haldi = v('--haldi', '#D19A1E');
      col = { bird: v('--bird', 'rgba(46,107,73,.6)'), birdLine: v('--bird-line', 'rgba(30,36,48,.62)'), paper: paper, ink: ink, haldi: haldi,
              /* flat tones, pre-mixed with the paper: the scene sits quietly behind the page, and overlapping parts never show through */
              leaf: mix(leaf, paper, 0.58), stem: mix(v('--leaf-deep', '#235339'), paper, 0.6), line: mix(ink, paper, 0.52),
              terra: mix(v('--terra', '#B3432A'), paper, 0.7), haldiSoft: mix(haldi, paper, 0.72),
              wolf: mix(v('--ink-3', '#6E7687'), paper, 0.5), wolfLine: mix(ink, paper, 0.55),
              deer: mix(haldi, paper, 0.66), deerLine: mix(ink, paper, 0.58), eye: mix(ink, paper, 0.8) };
    }
    function mix(c, p, a) {                                  /* c over paper p at alpha a → opaque rgb() */
      var x = hex(c), y = hex(p); if (!x || !y) return c;
      return 'rgb(' + Math.round(x[0] * a + y[0] * (1 - a)) + ',' + Math.round(x[1] * a + y[1] * (1 - a)) + ',' + Math.round(x[2] * a + y[2] * (1 - a)) + ')';
    }
    function hex(c) { var m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return null; var n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
    getColors();
    if (window.MutationObserver) new MutationObserver(getColors).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia && mq('(prefers-color-scheme: dark)').addEventListener) mq('(prefers-color-scheme: dark)').addEventListener('change', getColors);

    /* ---- plants: a stem with alternate leaves; kind 0 broadleaf + red flower, 1 paddy with ochre ear, 2 alder with catkin */
    function makePlant(fx, kind) {
      var h = rnd(0.11, 0.17) * Math.min(H, 900), n = 5 + Math.floor(R() * 3), leaves = [];
      for (var i = 0; i < n; i++) leaves.push({ t: 0.2 + 0.68 * i / (n - 1) + rnd(-0.03, 0.03), side: i % 2 ? 1 : -1,
        len: rnd(0.26, 0.4) * h * (kind === 1 ? 1.25 : 1), ang: rnd(0.5, 0.9), ph: R() * TAU });
      return { fx: fx, x: fx * W, h: h, g: still ? 1 : 0, rate: 1 / rnd(16, 32), lean: rnd(-0.14, 0.14), ph: R() * TAU,
               leaves: leaves, kind: kind, spawnAt: T + rnd(3, 9) };
    }
    function plantRot(p) { return p.lean * p.g + Math.sin(T * 0.7 + p.ph) * 0.03 * p.g; }
    function leafDir(l) { return [l.side * Math.sin(l.ang), -Math.cos(l.ang)]; }
    function leafTip(p, l) {                                   /* world position of a leaf tip (for the insects) */
      var r = plantRot(p), y0 = p.h * l.t, d = leafDir(l), u = Math.min(1, Math.max(0, (p.g - l.t) / 0.12)), len = l.len * u;
      var ax = y0 * Math.sin(r), ay = -y0 * Math.cos(r);
      var dx = d[0] * Math.cos(r) - d[1] * Math.sin(r), dy = d[0] * Math.sin(r) + d[1] * Math.cos(r);
      return [p.x + ax + dx * len, ground + ay + dy * len];
    }
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
      if (p.g > 0.86) {                                      /* the crown: flower, paddy ear or catkin */
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

    /* ---- insects: hatch at a leaf, sit, now and then cross to another plant (that is when the birds see them) */
    function freeLeaf(p) { var ok = p.leaves.filter(function (l) { return l.t < p.g - 0.1; }); return ok.length ? ok[Math.floor(R() * ok.length)] : null; }
    function makeInsect(p, l) { var t = leafTip(p, l); return { x: t[0], y: t[1], plant: p, leaf: l, state: 'leaf', ph: R() * TAU, next: T + rnd(5, 14), tp: null, tl: null, dead: false }; }
    function stepInsect(n, dt) {
      if (n.state === 'leaf') {
        var t = leafTip(n.plant, n.leaf); n.x = t[0] + Math.sin(T * 2.1 + n.ph) * 2 * k; n.y = t[1] - 3 * k + Math.cos(T * 1.7 + n.ph) * 1.5 * k;
        if (T > n.next && plants.length > 1) {
          var q = plants[Math.floor(R() * plants.length)], ql = q !== n.plant ? freeLeaf(q) : null;
          if (ql) { n.tp = q; n.tl = ql; n.state = 'fly'; } else n.next = T + rnd(3, 6);
        }
      } else {
        var tt = leafTip(n.tp, n.tl), dx = tt[0] - n.x, dy = tt[1] - 4 * k - n.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
        var v = P.insectV * dt, wob = Math.sin(T * 5 + n.ph) * 0.9 * k;
        n.x += dx / d * v + (-dy / d) * wob * 0.2; n.y += dy / d * v + (dx / d) * wob * 0.2 - 0.25 * k * dt * (d > 40 * k ? 1 : 0);
        if (d < 3 * k) { n.plant = n.tp; n.leaf = n.tl; n.state = 'leaf'; n.next = T + rnd(8, 20); }
      }
    }
    function drawInsect(n) {
      var s = 0.4 * base, flap = Math.sin(T * 40 + n.ph);
      ctx.save(); ctx.translate(n.x, n.y); ctx.lineJoin = 'round';
      if (n.state === 'fly') ctx.rotate(Math.atan2(leafTip(n.tp, n.tl)[1] - n.y, leafTip(n.tp, n.tl)[0] - n.x) * 0.25);
      ctx.globalAlpha = 0.55; ctx.fillStyle = col.birdLine;                                   /* wings */
      ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), -0.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(s * 0.14, -s * 0.28, s * 0.34, s * (0.16 + 0.1 * Math.abs(flap)), 0.5, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = col.haldi; ctx.strokeStyle = col.eye; ctx.lineWidth = Math.max(1, 0.9 * k);
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.26, 0, 0, TAU); ctx.fill(); ctx.stroke();                 /* body */
      ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.24); ctx.lineTo(-s * 0.12, s * 0.24); ctx.moveTo(s * 0.08, -s * 0.25); ctx.lineTo(s * 0.08, s * 0.25); ctx.stroke();
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(s * 0.48, 0, s * 0.14, 0, TAU); ctx.fill();               /* head */
      ctx.restore(); ctx.globalAlpha = 1;
    }

    function leg(x0, y0, x1, y1, x2, y2, w, fill, line) {     /* a flat leg with a lamp-black contour */
      var cw = ctx.lineWidth;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.lineWidth = w + 2 * cw; ctx.strokeStyle = line; ctx.stroke();
      ctx.lineWidth = w; ctx.strokeStyle = fill; ctx.stroke();
      ctx.lineWidth = cw; ctx.strokeStyle = line;
    }

    /* ---- the roe deer: grazes at a plant, walks to the next, flees the pack */
    function makeDeer() { return { x: rnd(W * 0.2, W * 0.8), dir: R() < 0.5 ? -1 : 1, state: 'graze', until: T + rnd(6, 14), ph: R() * TAU, neck: -0.9, target: 0 }; }
    function stepDeer(d, dt) {
      var L = 2.3 * base;
      if (d.state === 'gone') { if (T > d.until) { d.state = 'walk'; d.dir = R() < 0.5 ? 1 : -1; d.x = d.dir > 0 ? -L : W + L; d.target = plants.length ? plants[Math.floor(R() * plants.length)].x : W / 2; } return; }
      if (pack && pack.state !== 'off') {                        /* wolves on the ground: run */
        var lead = pack.x, near = Math.abs(lead - d.x) < Math.min(W * 0.36, 520 * k);
        if (near && d.state !== 'flee') { d.state = 'flee'; d.dir = d.x < lead ? -1 : 1; }
      }
      var want = d.state === 'graze' ? -0.95 : d.state === 'walk' ? 0.5 : 0.12;   /* neck: down to the leaves when grazing, up when walking, stretched when running */
      d.neck += (want - d.neck) * Math.min(1, 0.06 * dt);
      if (d.state === 'graze') { if (T > d.until) { d.state = 'walk'; var p = plants[Math.floor(R() * plants.length)]; d.target = p ? p.x + (R() < 0.5 ? -1 : 1) * L * 0.6 : W / 2; d.dir = d.target > d.x ? 1 : -1; } }
      else if (d.state === 'walk') { d.x += d.dir * 0.3 * k * dt; if ((d.dir > 0 && d.x >= d.target) || (d.dir < 0 && d.x <= d.target)) { d.state = 'graze'; d.until = T + rnd(7, 16); } }
      else if (d.state === 'flee') { d.x += d.dir * 1.9 * k * dt; if (d.x < -L * 1.5 || d.x > W + L * 1.5) { d.state = 'gone'; d.until = T + rnd(24, 48); } }
    }
    function drawDeer(d) {
      if (d.state === 'gone') return;
      var L = 2.3 * base * (d.s || 1), gait = d.state === 'walk' ? 0.09 : d.state === 'flee' ? 0.22 : 0, ph = T * (d.state === 'flee' ? 14 : 6) + d.ph, cw = Math.max(1.2, 1.3 * k) / L;
      ctx.save(); ctx.translate(d.x, ground); ctx.scale(L * d.dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.lineWidth = cw; ctx.strokeStyle = col.deerLine; ctx.fillStyle = col.deer;
      var bob = Math.sin(ph) * gait * 0.12;
      for (var i = 0; i < 4; i++) {                                                         /* legs: long and slender */
        var lx = [-0.24, -0.15, 0.15, 0.24][i], sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        leg(lx, -0.46 + bob, lx + sw * 0.5, -0.24 + bob * 0.5, lx + sw * 1.3, 0, 0.05, col.deer, col.deerLine);
      }
      ctx.beginPath(); ctx.ellipse(0, -0.58 + bob, 0.33, 0.165, 0.05, 0, TAU); ctx.fill(); ctx.stroke();            /* compact body */
      ctx.fillStyle = mix(col.paper, col.deer, 0.5); ctx.beginPath(); ctx.ellipse(-0.25, -0.57 + bob, 0.055, 0.075, 0, 0, TAU); ctx.fill();   /* pale rump */
      ctx.fillStyle = col.deer;
      var a = d.neck, nx = 0.27 + 0.38 * Math.cos(a), ny = -0.66 + bob - 0.38 * Math.sin(a);                         /* neck: a tapered band */
      var px = Math.sin(a), py = Math.cos(a);
      ctx.beginPath(); ctx.moveTo(0.22 - 0.075 * px, -0.68 + bob - 0.075 * py); ctx.lineTo(nx - 0.04 * px, ny - 0.04 * py); ctx.lineTo(nx + 0.04 * px, ny + 0.04 * py); ctx.lineTo(0.32 + 0.075 * px, -0.58 + bob + 0.075 * py); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.save(); ctx.translate(nx, ny); ctx.rotate(-a);                                                               /* small head along the neck */
      ctx.beginPath(); ctx.ellipse(0.09, 0, 0.14, 0.062, 0, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-0.03, -0.04); ctx.lineTo(-0.13, -0.24); ctx.lineTo(0.02, -0.06); ctx.closePath(); ctx.fill(); ctx.stroke();   /* big ears */
      ctx.beginPath(); ctx.moveTo(0.04, -0.06); ctx.lineTo(0.0, -0.25); ctx.lineTo(0.11, -0.06); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.paper; ctx.beginPath(); ctx.ellipse(0.1, -0.012, 0.034, 0.019, 0, 0, TAU); ctx.fill(); ctx.stroke();                 /* almond eye */
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(0.108, -0.012, 0.01, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(0.225, 0.004, 0.014, 0, TAU); ctx.fill();                                                 /* nose */
      ctx.restore();
      ctx.fillStyle = mix(col.paper, col.deer, 0.55);                                                                   /* Jamini dots along the flank */
      for (var j = 0; j < 4; j++) { ctx.beginPath(); ctx.arc(-0.16 + j * 0.11, -0.56 + bob + (j % 2) * 0.05, 0.02, 0, TAU); ctx.fill(); }
      ctx.restore();
    }

    /* ---- the wolf pack: three or four, in a loose file, crossing the ground now and then */
    function makePack() { var n = 3 + (R() < 0.5 ? 1 : 0), m = []; for (var i = 0; i < n; i++) m.push({ off: -i * rnd(1.3, 1.7), dy: rnd(0, 6) * k, ph: R() * TAU, s: rnd(0.9, 1.08) }); return { x: 0, dir: 1, state: 'off', until: T + rnd(10, 25), m: m, pause: 0 }; }
    function stepPack(p, dt) {
      var L = 2.2 * base, span = (p.m.length + 1) * 1.7 * L;
      if (p.state === 'off') { if (T > p.until) { p.state = 'walk'; p.dir = R() < 0.5 ? 1 : -1; p.x = p.dir > 0 ? -span * 0.2 - L : W + span * 0.2 + L; } return; }
      if (p.state === 'pause') { if (T > p.until) p.state = 'walk'; return; }
      p.x += p.dir * 0.36 * k * dt;
      if (R() < 0.0012 * dt) { p.state = 'pause'; p.until = T + rnd(1.5, 4); }
      if ((p.dir > 0 && p.x - span > W + L) || (p.dir < 0 && p.x + span < -L)) { p.state = 'off'; p.until = T + rnd(28, 60); }
    }
    function drawWolf(x, dir, s, ph, moving) {
      var L = 2.2 * base * s, gait = moving ? 0.12 : 0, bob = Math.sin(ph * 2) * gait * 0.1, cw = Math.max(1.2, 1.3 * k) / L;
      ctx.save(); ctx.translate(x, ground); ctx.scale(L * dir, L); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      ctx.strokeStyle = col.wolfLine; ctx.fillStyle = col.wolf;
      ctx.lineWidth = cw;
      for (var i = 0; i < 4; i++) {                                                         /* legs: long, slender */
        var lx = [-0.3, -0.2, 0.16, 0.26][i], ly = i < 2 ? -0.3 : -0.34, sw = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * gait;
        leg(lx, ly + bob, lx + sw * 0.5, -0.16 + bob * 0.5, lx + sw * 1.3, 0, 0.06, col.wolf, col.wolfLine);
      }
      ctx.beginPath(); ctx.moveTo(0.3, -0.5 + bob); ctx.bezierCurveTo(0.1, -0.57 + bob, -0.2, -0.57 + bob, -0.4, -0.47 + bob);   /* back, with the shoulder hump */
      ctx.bezierCurveTo(-0.5, -0.42 + bob, -0.5, -0.3 + bob, -0.44, -0.26 + bob);                                            /* rump */
      ctx.bezierCurveTo(-0.3, -0.22 + bob, -0.05, -0.2 + bob, 0.14, -0.26 + bob);                                             /* belly */
      ctx.bezierCurveTo(0.26, -0.3 + bob, 0.34, -0.36 + bob, 0.34, -0.44 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();  /* chest */
      ctx.beginPath(); ctx.moveTo(-0.42, -0.44 + bob); ctx.bezierCurveTo(-0.6, -0.42 + bob, -0.72, -0.3 + bob, -0.78, -0.12 + bob);   /* tail, carried low and bushy */
      ctx.bezierCurveTo(-0.74, -0.08 + bob, -0.68, -0.1 + bob, -0.66, -0.14 + bob); ctx.bezierCurveTo(-0.6, -0.28 + bob, -0.52, -0.36 + bob, -0.4, -0.38 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.3, -0.52 + bob); ctx.bezierCurveTo(0.36, -0.64 + bob, 0.48, -0.68 + bob, 0.56, -0.66 + bob);   /* head: long muzzle forward */
      ctx.lineTo(0.84, -0.58 + bob); ctx.lineTo(0.85, -0.54 + bob); ctx.lineTo(0.62, -0.49 + bob); ctx.bezierCurveTo(0.52, -0.47 + bob, 0.42, -0.43 + bob, 0.34, -0.44 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.45, -0.66 + bob); ctx.lineTo(0.49, -0.83 + bob); ctx.lineTo(0.57, -0.68 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();   /* ears, upright */
      ctx.beginPath(); ctx.moveTo(0.55, -0.67 + bob); ctx.lineTo(0.62, -0.81 + bob); ctx.lineTo(0.65, -0.65 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.haldiSoft; ctx.beginPath(); ctx.ellipse(0.57, -0.6 + bob, 0.04, 0.022, 0.15, 0, TAU); ctx.fill(); ctx.stroke();   /* almond eye */
      ctx.fillStyle = col.eye; ctx.beginPath(); ctx.arc(0.58, -0.6 + bob, 0.011, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(0.83, -0.57 + bob, 0.016, 0, TAU); ctx.fill();                                                 /* nose */
      ctx.restore();
    }
    function drawPack(p) {
      if (p.state === 'off') return;
      var L = 2.2 * base;
      for (var i = p.m.length - 1; i >= 0; i--) { var w = p.m[i]; drawWolf(p.x + w.off * L * p.dir, p.dir, w.s, T * 7 + w.ph, p.state === 'walk'); }
    }

    /* ---- the flock */
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
        /* hunting: a bird that sees an insect on the wing dives for it */
        if (b.hunt && (b.hunt.dead || b.hunt.state !== 'fly')) b.hunt = null;
        if (!b.hunt && hunting < 2 && T > b.full && R() < 0.01 * dt) {
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

    /* ---- world */
    function populate() {
      var N = Math.max(9, Math.min(30, Math.round((W * H) / 55000)));
      while (birds.length < N) birds.push(makeBird());
      if (birds.length > N) birds.length = N;
      var np = Math.max(3, Math.min(7, Math.round(W / 300)));
      if (!plants.length) for (var i = 0; i < np; i++) plants.push(makePlant((i + 0.5 + rnd(-0.25, 0.25)) / np, i % 3));
      for (var j = 0; j < plants.length; j++) plants[j].x = plants[j].fx * W;
      if (!pack) pack = makePack();
      if (!deer) deer = makeDeer();
      if (still && !insects.length) { plants.forEach(function (p) { p.g = 1; var l = freeLeaf(p); if (l && R() < 0.7) insects.push(makeInsect(p, l)); }); deer.neck = -0.95; }
      seeded = true;
    }
    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      if (!w || !h) return;                                  /* hidden or prerendered: wait for a real viewport */
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = w; H = h;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tune(); populate();
      if (still) draw();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (pack) drawPack(pack);
      if (deer) drawDeer(deer);
      for (var i = 0; i < plants.length; i++) drawPlant(plants[i]);
      for (var j = 0; j < insects.length; j++) drawInsect(insects[j]);
      for (var m = 0; m < birds.length; m++) drawBird(birds[m]);
    }
    function simulate(dt) {
      T += dt / 60;
      var lamp = hasMouse && html.classList.contains('lantern-on'), i;
      for (i = 0; i < plants.length; i++) {
        var p = plants[i];
        if (p.g < 1) p.g = Math.min(1, p.g + p.rate * dt / 60);
        if (p.g > 0.5 && T > p.spawnAt) { p.spawnAt = T + rnd(9, 20); if (insects.length < Math.min(10, 3 + plants.length)) { var l = freeLeaf(p); if (l) insects.push(makeInsect(p, l)); } }
      }
      for (i = insects.length - 1; i >= 0; i--) { if (insects[i].dead) insects.splice(i, 1); else stepInsect(insects[i], dt); }
      stepBirds(dt, lamp);
      if (pack) stepPack(pack, dt);
      if (deer) stepDeer(deer, dt);
    }

    resize();
    if (/ecodebug/.test(location.search)) window.__eco = function () { return { T: T, pack: pack, deer: deer, plants: plants, insects: insects, birds: birds, draw: { wolf: drawWolf, deer: drawDeer, plant: drawPlant, insect: drawInsect, clear: function () { ctx.clearRect(0, 0, W, H); } } }; };
    window.addEventListener('resize', resize);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { if (!seeded) resize(); });
    if (still) return;

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
