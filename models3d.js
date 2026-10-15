(function (root) {
  var NAVY = '#0A1128', FONT = '"Plus Jakarta Sans",sans-serif';
  var GB = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

  function canvas(w, h) { var c = root.document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function star(x, cx, cy, R) {
    x.beginPath();
    for (var i = 0; i < 10; i++) { var r = i % 2 ? R * 0.42 : R, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
    x.closePath(); x.fill();
  }
  function stars(x, cx, cy, R, gap) { x.fillStyle = '#F5B400'; for (var i = -2; i <= 2; i++) star(x, cx + i * gap, cy, R); }
  function arc(x, cx, cy, R, w, a0, a1, col) {
    x.beginPath(); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'butt';
    x.arc(cx, cy, R, a0 * Math.PI / 180, a1 * Math.PI / 180); x.stroke();
  }
  function gLogo(x, cx, cy, R, w) {
    arc(x, cx, cy, R, w, 0, 45, GB[0]); arc(x, cx, cy, R, w, 45, 135, GB[3]);
    arc(x, cx, cy, R, w, 135, 200, GB[2]); arc(x, cx, cy, R, w, 200, 315, GB[1]);
    x.fillStyle = GB[0]; x.fillRect(cx, cy - w / 2, R + w / 2, w);
  }

  function fakeQR(x, cx, cy, size) {
    var n = 25, m = size / n, x0 = cx - size / 2, y0 = cy - size / 2, seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    function inF(i, j) { return (i < 8 && j < 8) || (i < 8 && j > n - 9) || (i > n - 9 && j < 8); }
    x.fillStyle = NAVY;
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) { if (inF(i, j)) continue; if (rnd() > 0.5) x.fillRect(x0 + j * m, y0 + i * m, m + 0.5, m + 0.5); }
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p) {
      var ox = x0 + p[1] * m, oy = y0 + p[0] * m;
      x.fillStyle = NAVY; x.fillRect(ox, oy, 7 * m, 7 * m); x.fillStyle = '#fff'; x.fillRect(ox + m, oy + m, 5 * m, 5 * m);
      x.fillStyle = NAVY; x.fillRect(ox + 2 * m, oy + 2 * m, 3 * m, 3 * m);
    });
  }

  function facePlaca() {
    var c = canvas(1024, 1720), x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 1024, 1720);
    x.fillStyle = NAVY; x.textAlign = 'center';
    x.font = '800 88px ' + FONT; x.fillText('Tu opinión', 512, 190); x.fillText('nos importa', 512, 292);
    gLogo(x, 512, 560, 150, 52);
    stars(x, 512, 835, 60, 130);
    fakeQR(x, 512, 1130, 350);
    x.fillStyle = '#475569'; x.font = '500 50px ' + FONT;
    x.fillText('Acerca tu celular', 512, 1465); x.fillText('o escanea el código', 512, 1530);
    GB.forEach(function (k, i) { x.fillStyle = k; x.fillRect(212 + i * 150, 1630, 150, 14); });
    return c;
  }

  function faceLlavero() {
    var c = canvas(1024, 1024), x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, 1024, 1024);
    for (var i = 0; i < 4; i++) arc(x, 512, 512, 452, 40, -88 + i * 90, -2 + i * 90, GB[i]);
    x.fillStyle = NAVY; x.textAlign = 'center';
    x.font = '500 66px ' + FONT; x.fillText('Déjanos tu reseña en', 512, 335);
    x.font = '800 188px ' + FONT; x.textAlign = 'left';
    var word = 'Google', cols = [GB[0], GB[1], GB[2], GB[0], GB[3], GB[1]], tw = x.measureText(word).width, px = 512 - tw / 2;
    for (var j = 0; j < word.length; j++) { x.fillStyle = cols[j]; x.fillText(word[j], px, 575); px += x.measureText(word[j]).width; }
    stars(x, 512, 735, 58, 124);
    return c;
  }

  function buildPlaca(T, tex) {
    var g = new T.Group(), sh = new T.Shape(), w = 3, h = 4.9, r = 0.28, th = -0.17;
    sh.moveTo(-w / 2 + r, -h / 2); sh.lineTo(w / 2 - r, -h / 2); sh.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    sh.lineTo(w / 2, h / 2 - r); sh.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    sh.lineTo(-w / 2 + r, h / 2); sh.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    sh.lineTo(-w / 2, -h / 2 + r); sh.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    var geo = new T.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 12 });
    geo.translate(0, 0, -0.06);
    var acr = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1 });
    var panel = new T.Mesh(geo, acr);
    panel.position.set(0, 0.12 + (h / 2) * Math.cos(th), 0.55 - (h / 2) * Math.abs(Math.sin(th))); panel.rotation.x = th;
    var face = new T.Mesh(new T.PlaneGeometry(2.8, 4.7), new T.MeshBasicMaterial({ map: tex })); face.position.z = 0.095; panel.add(face);
    var base = new T.Mesh(new T.BoxGeometry(3, 0.12, 2.2), acr); base.position.set(0, 0.06, -0.45);
    g.add(panel, base); g.position.y = -2.55;
    return { group: g, animate: function (t) { g.rotation.y = Math.sin(t * 0.6) * 0.55; } };
  }

  function buildLlavero(T, tex) {
    var g = new T.Group(), piv = new T.Group(); piv.position.y = 2.4; g.add(piv);
    var metal = new T.MeshStandardMaterial({ color: 0xc4cbd6, metalness: 0.6, roughness: 0.3 });
    var acr = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 });
    var ring = new T.Mesh(new T.TorusGeometry(0.66, 0.05, 12, 56), metal); ring.position.y = -0.66; piv.add(ring);
    for (var i = 0; i < 3; i++) { var l = new T.Mesh(new T.TorusGeometry(0.13, 0.035, 10, 24), metal); l.position.y = -1.55 - i * 0.25; l.rotation.y = i % 2 ? Math.PI / 2 : 0; piv.add(l); }
    var eye = new T.Mesh(new T.TorusGeometry(0.2, 0.055, 12, 32), metal); eye.position.y = -2.4; piv.add(eye);
    var R = 1.15, cy = -3.63;
    var disc = new T.Mesh(new T.CylinderGeometry(R, R, 0.16, 64), acr); disc.rotation.x = Math.PI / 2; disc.position.y = cy; piv.add(disc);
    var dec = new T.CircleGeometry(R - 0.02, 64), m = new T.MeshBasicMaterial({ map: tex });
    var f1 = new T.Mesh(dec, m); f1.position.set(0, cy, 0.085); piv.add(f1);
    var f2 = new T.Mesh(dec, m); f2.position.set(0, cy, -0.085); f2.rotation.y = Math.PI; piv.add(f2);
    return { group: g, animate: function (t) { piv.rotation.z = Math.sin(t * 1.1) * 0.12; g.rotation.y = t * 0.5; } };
  }

  function mount(el) {
    var T = root.THREE, kind = el.getAttribute('data-m'), face = kind === 'placa' ? facePlaca() : faceLlavero();
    try {
      var tex = new T.CanvasTexture(face); tex.anisotropy = 8; tex.encoding = T.sRGBEncoding;
      var W = el.clientWidth, H = el.clientHeight;
      var r = new T.WebGLRenderer({ antialias: true, alpha: true });
      r.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2)); r.setSize(W, H); r.outputEncoding = T.sRGBEncoding;
      el.appendChild(r.domElement);
      var sc = new T.Scene(), cam = new T.PerspectiveCamera(32, W / H, 0.1, 100);
      sc.add(new T.HemisphereLight(0xffffff, 0xb8c4e0, 0.9));
      var d = new T.DirectionalLight(0xffffff, 0.9); d.position.set(4, 6, 6); sc.add(d);
      var d2 = new T.DirectionalLight(0x00c2ff, 0.35); d2.position.set(-5, 2, -3); sc.add(d2);
      var model = kind === 'placa' ? buildPlaca(T, tex) : buildLlavero(T, tex);
      sc.add(model.group);
      if (kind === 'placa') { cam.position.set(0, 1.0, 12.5); cam.lookAt(0, 0, 0); } else { cam.position.set(0, 0, 11.5); cam.lookAt(0, 0, 0); }
      var still = root.matchMedia('(prefers-reduced-motion:reduce)').matches, off = 0, drag = false, lx = 0, vis = true, t0 = performance.now();
      function draw(t) { model.animate(t); model.group.rotation.y += off; r.render(sc, cam); }
      function loop(now) { if (vis) draw((now - t0) / 1000); root.requestAnimationFrame(loop); }
      el.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; el.style.cursor = 'grabbing'; });
      root.addEventListener('pointerup', function () { drag = false; el.style.cursor = 'grab'; });
      root.addEventListener('pointermove', function (e) { if (!drag) return; off += (e.clientX - lx) * 0.01; lx = e.clientX; if (still) draw(0.5); });
      new root.IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(el);
      root.addEventListener('resize', function () { var w = el.clientWidth, h = el.clientHeight; r.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); });
      if (still) draw(0.5); else root.requestAnimationFrame(loop);
    } catch (err) {
      face.style.cssText = 'width:100%;height:100%;object-fit:contain'; el.appendChild(face);
    }
  }

  function start() {
    var els = root.document.querySelectorAll('.v3[data-m]');
    if (!els.length || !root.THREE) { els.forEach && els.forEach(function (el) { el.appendChild(el.getAttribute('data-m') === 'placa' ? facePlaca() : faceLlavero()); }); return; }
    function go() { els.forEach(mount); }
    var f = root.document.fonts;
    if (f && f.load) Promise.race([Promise.all([f.load('800 40px "Plus Jakarta Sans"'), f.load('500 40px "Plus Jakarta Sans"')]), new Promise(function (ok) { setTimeout(ok, 2500); })]).then(go, go); else go();
  }

  root.TB3D = { facePlaca: facePlaca, faceLlavero: faceLlavero, buildPlaca: buildPlaca, buildLlavero: buildLlavero };
  if (root.document && root.document.querySelectorAll && root.window) start();
})(typeof window !== 'undefined' ? window : globalThis);
