/* site.js — Dr. Sinchan Ghosh
   theme · drawer · custom cursor · lantern · bee-eater flock (Boids) ·
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

  /* ------------------------------------------------------------ bee-eater flock (Boids; Reynolds 1987) */
  (function flock() {
    var canvas = document.getElementById('flock');
    if (!canvas || reduced || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var W, H, dpr;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var N = Math.max(9, Math.min(28, Math.round((W * H) / 60000)));
    var boids = [];
    for (var i = 0; i < N; i++) {
      boids.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 1.4,
        ph: Math.random() * Math.PI * 2, s: 0.8 + Math.random() * 0.45 });
    }
    var P = { maxV: 1.2, minV: 0.45, see: 84, sep: 30, wSep: 0.5, wAli: 0.05, wCoh: 0.0035, cursorR: 170, wCur: 0.42, edge: 90 };

    /* bird glyph: local coords, heading +x, wingspan ≈ 1 */
    var body = new Path2D('M-.42 0C-.3 -.07 .15 -.08 .34 -.02L.53 -.03L.34 .03C.15 .08 -.3 .07 -.42 0Z');
    var wing = new Path2D('M.05 -.02C.02 -.27 -.14 -.45 -.41 -.53C-.31 -.3 -.21 -.12 -.08 0Z');
    var tail = new Path2D('M-.4 0L-.68 -.035M-.4 0L-.63 .04');

    function getColor() { var cs = getComputedStyle(html); return [cs.getPropertyValue('--bird').trim() || 'rgba(46,107,73,.5)', cs.getPropertyValue('--bird-line').trim() || 'rgba(30,36,48,.55)']; }
    var color = getColor();
    if (window.MutationObserver) new MutationObserver(function () { color = getColor(); }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    if (window.matchMedia) mq('(prefers-color-scheme: dark)').addEventListener && mq('(prefers-color-scheme: dark)').addEventListener('change', function () { color = getColor(); });

    var last = performance.now(), running = !document.hidden, frame = 0;
    document.addEventListener('visibilitychange', function () {
      var was = running; running = !document.hidden;
      if (running && !was) { last = performance.now(); requestAnimationFrame(step); }
    });

    function step(now) {
      if (!running) return;
      frame++;
      if (!finePointer && (frame % 2)) { requestAnimationFrame(step); return; } /* 30 fps on touch devices */
      var dt = Math.min(2.5, (now - last) / 16.67); last = now;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < boids.length; i++) {
        var b = boids[i];
        var sx = 0, sy = 0, ax = 0, ay = 0, cx = 0, cy = 0, n = 0;
        for (var j = 0; j < boids.length; j++) {
          if (i === j) continue;
          var o = boids[j], dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < P.see * P.see) {
            n++; ax += o.vx; ay += o.vy; cx += o.x; cy += o.y;
            if (d2 < P.sep * P.sep) { var d = Math.sqrt(d2) || 1; var k = (P.sep - d) / P.sep; sx -= dx / d * k; sy -= dy / d * k; }
          }
        }
        if (n) {
          ax /= n; ay /= n; cx /= n; cy /= n;
          b.vx += (ax - b.vx) * P.wAli * dt + (cx - b.x) * P.wCoh * dt;
          b.vy += (ay - b.vy) * P.wAli * dt + (cy - b.y) * P.wCoh * dt;
        }
        b.vx += sx * P.wSep * dt; b.vy += sy * P.wSep * dt;
        /* the cursor is a predator: veer away */
        if (hasMouse) {
          var ddx = b.x - mx, ddy = b.y - my, dd2 = ddx * ddx + ddy * ddy;
          if (dd2 < P.cursorR * P.cursorR) {
            var dd = Math.sqrt(dd2) || 1, f = 1 - dd / P.cursorR;
            b.vx += ddx / dd * f * P.wCur * dt; b.vy += ddy / dd * f * P.wCur * dt;
          }
        }
        /* soft edges, light wander */
        if (b.x < P.edge) b.vx += (P.edge - b.x) / P.edge * 0.06 * dt;
        if (b.x > W - P.edge) b.vx -= (b.x - (W - P.edge)) / P.edge * 0.06 * dt;
        if (b.y < P.edge) b.vy += (P.edge - b.y) / P.edge * 0.06 * dt;
        if (b.y > H - P.edge) b.vy -= (b.y - (H - P.edge)) / P.edge * 0.06 * dt;
        b.vx += (Math.random() - 0.5) * 0.04 * dt; b.vy += (Math.random() - 0.5) * 0.04 * dt;
        var v = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 1e-6;
        var tv = Math.max(P.minV, Math.min(P.maxV, v));
        b.vx = b.vx / v * tv; b.vy = b.vy / v * tv;
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.ph += (0.16 + 0.1 * tv / P.maxV) * dt;
        if (b.x < -50) b.x = W + 50; else if (b.x > W + 50) b.x = -50;
        if (b.y < -50) b.y = H + 50; else if (b.y > H + 50) b.y = -50;

        var size = 24 * b.s, flap = 0.25 + 0.62 * Math.abs(Math.sin(b.ph));
        /* one combined path per bird so overlapping wing/body fills keep a single, even alpha */
        var glyph = new Path2D(body);
        if (window.DOMMatrix) {
          glyph.addPath(wing, new DOMMatrix([1, 0, 0, flap, 0, 0]));
          glyph.addPath(wing, new DOMMatrix([1, 0, 0, -flap, 0, 0]));
        }
        ctx.save();
        ctx.translate(b.x, b.y); ctx.rotate(Math.atan2(b.vy, b.vx)); ctx.scale(size, size);
        /* Jamini Roy idiom: flat fill with a dark contour */
        ctx.fillStyle = color[0]; ctx.strokeStyle = color[1]; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        ctx.fill(glyph);
        ctx.lineWidth = 1.3 / size; ctx.stroke(glyph);
        ctx.lineWidth = 1.1 / size; ctx.stroke(tail);
        ctx.restore();
      }
      requestAnimationFrame(step);
    }
    if (running) requestAnimationFrame(step);
  })();

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
