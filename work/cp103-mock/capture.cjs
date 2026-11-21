const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const {spawn} = require('node:child_process');
const {setTimeout: delay} = require('node:timers/promises');

const evidence = path.resolve(__dirname, '../../tickets/CP-103-evidence');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cp103-chrome-'));
const chrome = process.env.CP103_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'
], {stdio: 'ignore'});
const server = http.createServer((req, res) => {
  const file = path.resolve(__dirname, '.' + new URL(req.url, 'http://localhost').pathname);
  if (!file.startsWith(__dirname + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404).end();
    return;
  }
  const types = {'.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.wasm': 'application/wasm'};
  res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 120 && !fs.existsSync(portFile); i++) await delay(100);
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
  const [target] = (await (await fetch('http://127.0.0.1:' + port + '/json/list')).json())
    .filter(entry => entry.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, {once: true});
    socket.addEventListener('error', reject, {once: true});
  });
  const pending = new Map();
  let id = 0;
  socket.addEventListener('message', event => {
    const reply = JSON.parse(event.data);
    if (!pending.has(reply.id)) return;
    const {resolve, reject} = pending.get(reply.id);
    pending.delete(reply.id);
    if (reply.error) reject(Error(JSON.stringify(reply.error)));
    else resolve(reply.result);
  });
  const cdp = (method, params) => new Promise((resolve, reject) => {
    pending.set(++id, {resolve, reject});
    socket.send(JSON.stringify({id, method, params}));
  });
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', {expression, returnByValue: true});
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function tap(rect) {
    const {x,y} = await evaluate(`(() => {
      const r = ${rect}, bounds = cv.getBoundingClientRect();
      return {x: bounds.left + (r.x+r.w/2)*scale, y: bounds.top + (r.y+r.h/2)*scale};
    })()`);
    await cdp('Input.dispatchTouchEvent', {type:'touchStart',touchPoints:[{x,y}]});
    await cdp('Input.dispatchTouchEvent', {type:'touchEnd',touchPoints:[]});
  }
  fs.mkdirSync(evidence, {recursive: true});
  try {
    await cdp('Page.enable');
    await cdp('Emulation.setTouchEmulationEnabled', {enabled: true});
    for (const [width, height] of [[412,915],[360,640]]) {
      await cdp('Emulation.setDeviceMetricsOverride', {width,height,deviceScaleFactor:1,mobile:true});
      for (const stage of ['before','after']) {
        const url = `http://127.0.0.1:${server.address().port}/${stage === 'before' ? 'before' : 'index'}.html`;
        await cdp('Page.navigate', {url});
        let ready = false;
        for (let i = 0; i < 150 && !ready; i++) {
          await delay(100);
          ready = await evaluate(`location.href===${JSON.stringify(url)} && typeof PG!=='undefined' && !!PG`).catch(() => false);
        }
        assert(ready, 'Game did not finish booting');
        await evaluate(`(() => {
          PG = {...pgFresh(),catnip:12,recipes:{tunadish:1},items:{
            bowtie:2,notes:2,yarn:1,cheese:4,cushion:3,shrimp:1,milk:4,egg:5,
            feather:2,sardine:1,ball:2,box:3,sock:1
          }};
          pgGo('shop');
          PGU.shop.tab='sell';
        })()`);
        for (const tab of ['sell','buy']) {
          if (tab === 'buy') await tap('pgShopTabs().buy');
          assert.equal(await evaluate('PGU.shop.tab'), tab);
          await delay(400);
          await evaluate('PGU.toasts.length=0');
          await delay(80);
          const result = await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
          fs.writeFileSync(path.join(evidence,`${width}x${height}-${stage}-${tab}.png`),Buffer.from(result.data,'base64'));
        }
        if (stage === 'after') {
          await tap("pgShopRows().find(r=>r.id==='tuna')");
          assert.deepEqual(await evaluate('[PG.catnip,pgHave("tuna")]'), [4,1]);
          await tap("pgShopRows().find(r=>r.id==='cheese')");
          assert.deepEqual(await evaluate('[PG.catnip,pgHave("cheese")]'), [4,4]);
          await evaluate('PG.catnip=12;PG.items.tuna=pgCap();');
          await tap("pgShopRows().find(r=>r.id==='tuna')");
          assert.deepEqual(await evaluate('[PG.catnip,pgHave("tuna")===pgCap()]'), [12,true]);
          await tap('pgShopTabs().sell');
          await tap("pgShopRows().find(r=>r.id==='yarn')");
          assert.deepEqual(await evaluate('[PG.catnip,pgHave("yarn"),pgShopRows().some(r=>r.id==="yarn")]'), [14,0,false]);
          await tap("pgShopRows().find(r=>r.id==='milk')");
          assert.deepEqual(await evaluate('[PG.catnip,pgHave("milk")]'), [15,3]);
          assert.equal(await evaluate('JSON.parse(localStorage.getItem(PG_KEY)).catnip'), 15);
          assert(await evaluate(`(() => {
            for (const id of PG_PRIZES) PG.items[id]=1;
            const rows=pgShopRows(), last=rows.at(-1);
            return rows.length===18 && last.y+last.h<=pgBot()-34+.01;
          })()`));
          await tap('pgBack()');
          assert.notEqual(await evaluate('PGU.screen'), 'shop');
        }
      }
    }
    console.log('Captured 8 stills. Shop navigation, full grid fit, purchases, sell payouts, capacity, and saving passed at both sizes.');
  } finally {
    socket.close();
  }
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  browser.kill();
  server.close();
});
