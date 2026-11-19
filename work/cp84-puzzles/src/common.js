// CP-84 shared helpers: canvas, tinted coins, sounds, payoff counter, particles.
// Inlined into each page by build.py. No game code dependency.
const CP = (function () {
  const COLORS = [
    { k: 'R', base: '#e5484d', light: '#ffb0a8', dark: '#7f1d1d', sym: 'heart' },
    { k: 'B', base: '#3b82f6', light: '#bfdbfe', dark: '#1e3a8a', sym: 'drop' },
    { k: 'G', base: '#22b35e', light: '#bbf7d0', dark: '#14532d', sym: 'leaf' },
    { k: 'Y', base: '#f5b301', light: '#fff1b8', dark: '#8a5a00', sym: 'star' },
    { k: 'P', base: '#a35be8', light: '#ead5ff', dark: '#4c1d95', sym: 'moon' },
    { k: 'O', base: '#f97316', light: '#fed7aa', dark: '#7c2d12', sym: 'fish' },
  ];
  const KEY = {}; COLORS.forEach((c, i) => (KEY[c.k] = i));

  // ---------- canvas ----------
  const cv = document.getElementById('c');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 3);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    coinCache.clear();
  }

  // ---------- coins ----------
  const coinCache = new Map();
  function symbol(g, s, r) {
    g.beginPath();
    const u = r * 0.36;
    if (s === 'heart') {
      g.moveTo(0, u * 0.9);
      g.bezierCurveTo(-u * 1.5, -u * 0.2, -u * 0.6, -u * 1.3, 0, -u * 0.45);
      g.bezierCurveTo(u * 0.6, -u * 1.3, u * 1.5, -u * 0.2, 0, u * 0.9);
    } else if (s === 'drop') {
      g.moveTo(0, -u * 1.1);
      g.quadraticCurveTo(u * 1.1, u * 0.1, 0, u * 0.95);
      g.quadraticCurveTo(-u * 1.1, u * 0.1, 0, -u * 1.1);
    } else if (s === 'leaf') {
      g.moveTo(-u, u * 0.8);
      g.quadraticCurveTo(-u, -u, u, -u);
      g.quadraticCurveTo(u, u * 0.8, -u, u * 0.8);
    } else if (s === 'star') {
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? u * 0.45 : u * 1.05;
        g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      g.closePath();
    } else if (s === 'moon') {
      g.arc(0, 0, u, Math.PI * 0.25, Math.PI * 1.75, false);
      g.arc(u * 0.55, 0, u * 0.75, Math.PI * 1.6, Math.PI * 0.4, true);
      g.closePath();
    } else if (s === 'fish') {
      g.ellipse(-u * 0.15, 0, u * 0.75, u * 0.5, 0, 0, Math.PI * 2);
      g.moveTo(u * 0.5, 0); g.lineTo(u * 1.1, -u * 0.5); g.lineTo(u * 1.1, u * 0.5); g.closePath();
    }
    g.fill();
  }
  function coinCanvas(ci, r) {
    const key = ci + '_' + Math.round(r * DPR * 2);
    let c = coinCache.get(key);
    if (c) return c;
    const s = Math.ceil(r * 2.3 * DPR);
    c = document.createElement('canvas'); c.width = c.height = s;
    const g = c.getContext('2d');
    g.scale(DPR, DPR); g.translate(s / DPR / 2, s / DPR / 2);
    const col = COLORS[ci];
    // shadow
    g.fillStyle = 'rgba(0,0,0,0.28)';
    g.beginPath(); g.arc(r * 0.06, r * 0.12, r, 0, Math.PI * 2); g.fill();
    // rim
    let gr = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    gr.addColorStop(0, col.light); gr.addColorStop(0.55, col.base); gr.addColorStop(1, col.dark);
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
    // inner face
    gr = g.createRadialGradient(r * 0.25, r * 0.3, r * 0.1, 0, 0, r * 0.78);
    gr.addColorStop(0, col.base); gr.addColorStop(1, col.dark);
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * 0.74, 0, Math.PI * 2); g.fill();
    g.fillStyle = col.base; g.beginPath(); g.arc(0, 0, r * 0.66, 0, Math.PI * 2); g.fill();
    // symbol
    g.fillStyle = 'rgba(255,255,255,0.92)'; symbol(g, col.sym, r);
    // shine
    g.fillStyle = 'rgba(255,255,255,0.35)';
    g.beginPath(); g.ellipse(-r * 0.38, -r * 0.48, r * 0.32, r * 0.16, -0.6, 0, Math.PI * 2); g.fill();
    coinCache.set(key, c);
    return c;
  }
  function coin(ci, x, y, r, alpha, scale) {
    const c = coinCanvas(ci, r);
    const s = (c.width / DPR) * (scale || 1);
    if (alpha !== undefined && alpha < 1) ctx.globalAlpha = Math.max(0, alpha);
    ctx.drawImage(c, x - s / 2, y - s / 2, s, s);
    ctx.globalAlpha = 1;
  }

  // ---------- images ----------
  const IMG = {};
  function loadImages(map) {
    return Promise.all(Object.keys(map).map(k => new Promise(res => {
      const im = new Image(); im.onload = () => res(); im.onerror = () => res();
      im.src = map[k]; IMG[k] = im;
    })));
  }

  // ---------- audio ----------
  const SND = {}; let actx = null, master = null, muted = false;
  try { muted = localStorage.getItem('cp84-muted') === '1'; } catch (e) {}
  function b64ToBuf(d) {
    const s = atob(d.split(',')[1]); const a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a.buffer;
  }
  function unlockAudio() {
    if (actx) { if (actx.state === 'suspended') actx.resume(); return; }
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      master = actx.createGain(); master.gain.value = 0.8; master.connect(actx.destination);
      Object.keys(window.SOUNDS || {}).forEach(k => {
        actx.decodeAudioData(b64ToBuf(window.SOUNDS[k]), b => (SND[k] = b), () => {});
      });
    } catch (e) { actx = null; }
  }
  function play(name, rate, vol, delay) {
    if (muted || !actx || !SND[name]) return;
    const src = actx.createBufferSource(); src.buffer = SND[name];
    src.playbackRate.value = rate || 1;
    const g = actx.createGain(); g.gain.value = vol === undefined ? 1 : vol;
    src.connect(g); g.connect(master);
    src.start(actx.currentTime + (delay || 0));
  }
  // A run of coin ticks that climbs in pitch with the chain.
  function chainTick(i, delay) {
    const rate = 0.85 + Math.min(i, 26) * 0.045;
    play('tick', rate, 0.55, delay);
  }
  function setMuted(m) { muted = m; try { localStorage.setItem('cp84-muted', m ? '1' : '0'); } catch (e) {} }

  // ---------- particles + popups ----------
  const parts = [];
  function burst(x, y, ci, n, spd) {
    const col = COLORS[ci] ? COLORS[ci].light : '#fff';
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (0.4 + Math.random()) * (spd || 160);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, t: 0, life: 0.5 + Math.random() * 0.4, col, s: 2 + Math.random() * 3 });
    }
  }
  function sparkleStars(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, t: 0, life: 0.8 + Math.random() * 0.6, col: ['#fff3a3', '#ffd166', '#ffffff', '#ff9bd0'][i % 4], s: 3 + Math.random() * 4, star: true });
    }
  }
  function updParts(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.t += dt;
      if (p.t > p.life) { parts.splice(i, 1); continue; }
      p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function drawParts() {
    for (const p of parts) {
      ctx.globalAlpha = 1 - p.t / p.life; ctx.fillStyle = p.col;
      if (p.star) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t * 6); ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
      } else { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }

  // Big payoff counter: counts up as coins land; label grows with size.
  const pay = { shown: 0, target: 0, t: 9, bump: 0, x: 0, y: 0 };
  function payStart(x, y) { pay.shown = 0; pay.target = 0; pay.t = 0; pay.x = x; pay.y = y; pay.bump = 0; }
  function payAdd(n) { pay.target += n; pay.shown = pay.target; pay.bump = 1; pay.t = 0; }
  function payLabel(n) {
    if (n >= 25) return 'JACKPOT!';
    if (n >= 18) return 'HUGE!';
    if (n >= 12) return 'Great!';
    if (n >= 7) return 'Nice';
    return '';
  }
  function drawPay(dt) {
    pay.t += dt; pay.bump = Math.max(0, pay.bump - dt * 5);
    if (pay.target <= 0 || pay.t > 1.4) return;
    const n = pay.shown, a = pay.t > 1.0 ? 1 - (pay.t - 1.0) / 0.4 : 1;
    const base = Math.min(W, H) * (0.1 + Math.min(n, 30) * 0.005);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(pay.x, pay.y - pay.t * 20);
    ctx.scale(1 + pay.bump * 0.25, 1 + pay.bump * 0.25);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 ' + Math.round(base) + 'px system-ui, sans-serif';
    ctx.lineWidth = Math.max(4, base * 0.14); ctx.strokeStyle = '#3b1d0e'; ctx.lineJoin = 'round';
    const txt = '+' + n; ctx.strokeText(txt, 0, 0);
    ctx.fillStyle = n >= 18 ? '#ffd23f' : n >= 7 ? '#fff3c4' : '#ffffff'; ctx.fillText(txt, 0, 0);
    const lab = payLabel(n);
    if (lab) {
      ctx.font = '900 ' + Math.round(base * 0.45) + 'px system-ui, sans-serif';
      ctx.lineWidth = Math.max(3, base * 0.08);
      ctx.strokeText(lab, 0, base * 0.72); ctx.fillStyle = '#ffb4d9'; ctx.fillText(lab, 0, base * 0.72);
    }
    ctx.restore();
  }

  function rng(seed) { // mulberry32
    let a = seed >>> 0;
    return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  window.addEventListener('resize', () => { resize(); if (CP.onResize) CP.onResize(); });
  resize();
  return {
    COLORS, KEY, cv, ctx, get W() { return W; }, get H() { return H; }, resize, coin, IMG, loadImages,
    unlockAudio, play, chainTick, setMuted, get muted() { return muted; },
    burst, sparkleStars, updParts, drawParts, payStart, payAdd, drawPay, pay, rng, roundRect, store, onResize: null,
  };
})();
