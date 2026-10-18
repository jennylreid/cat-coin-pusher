const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { performance } = require('node:perf_hooks');
const root = path.resolve(__dirname, '..');
const noop = () => {};

// Executes the shipped game script and Rapier, without substituting any game physics.
// The DOM/audio stubs deliberately do no rendering: this runner cannot report FPS.
module.exports = async function createGame({ seed = 42 } = {}) {
  const math = Object.create(Math);
  let randomState = seed, elapsed = 0, falls = 0, paidObjects = 0;
  math.random = () => ((randomState = randomState * 16807 % 2147483647) - 1) / 2147483646;
  const epoch = Date.parse('2026-10-10T12:00:00-04:00');
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [Clock.now()])); }
    static now() { return epoch + elapsed * 1000; }
  }
  const context = new Proxy({ createLinearGradient: () => ({ addColorStop: noop }), measureText: () => ({ width: 10 }) },
    { get: (target, key) => target[key] || noop });
  const canvas = { getContext: () => context, style: {}, addEventListener: noop };
  const c = { console, Math: math, Date: Clock, performance, TextDecoder, TextEncoder, WebAssembly,
    Uint8Array, Float32Array, ArrayBuffer, setTimeout: noop, clearTimeout: noop,
    requestAnimationFrame: noop, addEventListener: noop, innerWidth: 400, innerHeight: 889, devicePixelRatio: 1,
    location: { search: '' }, localStorage: { getItem: () => null, setItem: noop },
    document: { getElementById: () => canvas, createElement: () => canvas, addEventListener: noop, visibilityState: 'hidden' },
    Audio: class { constructor() { this.paused = true; } play() { return Promise.resolve(); } pause() {} }, Image: class {} };
  c.window = c;
  vm.createContext(c);
  vm.runInContext(fs.readFileSync(path.join(root, 'lib/rapier.js'), 'utf8'), c);
  let source = fs.readFileSync(path.join(root, 'index.html'), 'utf8').match(/<script>\s*([\s\S]*?)<\/script>/)[1];
  source = source.replace(/Promise\.all\(\[RAPIER.init\(\), loadArt\(\)\]\)[\s\S]*?;\s*\/\/ Test hook/, '// Test hook');
  vm.runInContext(source, c);
  await c.RAPIER.init();
  c.initPhysics(); c.load(); c.resize();
  c.__game.S.coins = 10000; // Supply never limits the specified cadence.
  c.__game.S.muted = true;
  const originalFallOff = c.fallOff;
  c.fallOff = (body, x) => {
    falls++;
    if ((c.__game.S.guard > 0 || x > 60 && x < 340) && !['item', 'power', 'ticket', 'cash', 'cube'].includes(body.kind)) paidObjects++;
    return originalFallOff(body, x);
  };
  return {
    c,
    tick() { elapsed += 1 / 60; c.step(); c.update(1 / 60); },
    drop() { vm.runInContext('tryDrop({x:rand(T.L+30,T.R-30),y:DROP_Y})', c); },
    inspect() { return vm.runInContext(`({time, pushLoaded, pushPending, pusherY, drawn:tongueDrawY,
      colliderY:tongue.translation().z/M+TONGUE_LEN/2, queued:toyQueue.length, shower:showerLeft, shake,
      maxSpeed:bodies.reduce((m,b)=>{const v=b.rb.linvel();return Math.max(m,Math.hypot(v.x,v.y,v.z));},0)})`, c); },
    get falls() { return falls; }, get paidObjects() { return paidObjects; },
    close() { c.__game.world.free(); }
  };
};
