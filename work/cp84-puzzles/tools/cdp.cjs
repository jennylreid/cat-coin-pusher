// CP-84 test driver: headless Chrome over the DevTools protocol (Node 24 built-in WebSocket).
// Phone emulation with touch; real touch events; stills; timed frame capture for clips.
const { spawn, execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(url, { width = 412, height = 915, dpr = 2, port = 9333 + Math.floor(Math.random() * 500) } = {}) {
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'cp84-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + prof,
    '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 50; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find(t => t.type === 'page')) break; } catch (e) {}
    await sleep(200);
  }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const logs = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
    else if (m.method === 'Page.screencastFrame') { if (api.onFrame) api.onFrame(m.params); send('Page.screencastFrameAck', { sessionId: m.params.sessionId }); }
    else if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.type + ': ' + m.params.args.map(a => a.value ?? a.description).join(' '));
    else if (m.method === 'Runtime.exceptionThrown') logs.push('EXCEPTION: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile: true });
  await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' });
  await send('Page.navigate', { url });
  await sleep(1200);
  let api;
  api = {
    logs, send,
    async eval(expr) { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; },
    async shot(file) { const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(file, Buffer.from(r.data, 'base64')); },
    async touch(type, x, y) { // type: touchStart | touchMove | touchEnd
      await send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    },
    async tap(x, y) { await api.touch('touchStart', x, y); await sleep(60); await api.touch('touchEnd', x, y); },
    async drag(pts, stepMs = 30) { await api.touch('touchStart', pts[0][0], pts[0][1]); for (const p of pts.slice(1)) { await sleep(stepMs); await api.touch('touchMove', p[0], p[1]); } await sleep(stepMs); await api.touch('touchEnd', pts.at(-1)[0], pts.at(-1)[1]); },
    // Record frames while `during` runs, then encode an mp4 at real timing.
    async clip(file, during, { fps = 30, scale = 1 } = {}) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cp84f-')); const frames = []; let stop = false;
      let n = 0;
      api.onFrame = fr => { const f = path.join(dir, String(n++).padStart(5, '0') + '.jpg'); fs.writeFileSync(f, Buffer.from(fr.data, 'base64')); frames.push({ f, t: fr.metadata.timestamp * 1000 }); };
      await send('Page.startScreencast', { format: 'jpeg', quality: 80, everyNthFrame: 1 });
      await during(); await send('Page.stopScreencast'); api.onFrame = null; await sleep(200);
      let list = '';
      for (let i = 0; i < frames.length; i++) { const d = i + 1 < frames.length ? (frames[i + 1].t - frames[i].t) / 1000 : 0.1; list += `file '${frames[i].f.replace(/\\/g, '/')}'\nduration ${d.toFixed(3)}\n`; }
      list += `file '${frames.at(-1).f.replace(/\\/g, '/')}'\n`;
      const lf = path.join(dir, 'list.txt'); fs.writeFileSync(lf, list);
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lf, '-vf', `fps=${fps},scale=trunc(iw*${scale}/2)*2:trunc(ih*${scale}/2)*2`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', file]);
      fs.rmSync(dir, { recursive: true, force: true });
      return frames.length;
    },
    async close() { try { ws.close(); } catch (e) {} proc.kill(); await sleep(400); try { fs.rmSync(prof, { recursive: true, force: true }); } catch (e) {} },
  };
  return api;
}
module.exports = { open, sleep };
