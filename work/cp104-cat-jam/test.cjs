const {open, sleep} = require('../cp84-puzzles/tools/cdp.cjs');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

const folder = path.resolve(__dirname, '../../tickets/CP-104-evidence');
const url = pathToFileURL(path.join(__dirname, 'cat-jam.html')).href;
const routes = [
  {"plates": 21, "win": [1, 9, 11, 2, 7, 4, 0], "loss": [1, 9, 2, 4, 0]},
  {"plates": 27, "win": [2, 0, 1, 3, 9, 6, 7, 11, 4], "loss": [2, 0, 1, 3, 7, 11, 4]},
  {"plates": 30, "win": [5, 2, 9, 12, 13, 11, 1, 4, 3, 10], "loss": [5, 2, 9, 4, 3]},
  {"plates": 39, "win": [14, 3, 18, 9, 13, 8, 15, 16, 12, 10, 17, 0, 2], "loss": [14, 3, 18, 9, 13, 8, 12, 17]},
  {"plates": 45, "win": [3, 15, 13, 12, 16, 17, 19, 5, 8, 11, 9, 6, 0, 1, 2], "loss": [3, 15, 5, 9, 13]}
];
const read = (p, body) => p.eval('(()=>{' + body + '})()');
const state = p => read(p, 'return {done:game.done, waiting:game.room.size, fed:game.next, seats:game.seats.filter(Boolean).length}');
async function touch(p, selector) {
  const bounds = await read(p, 'const {left,top,width,height}=document.querySelector(' + JSON.stringify(selector) +
    ').getBoundingClientRect();return [left+width/2,top+height/2]');
  await p.tap(...bounds);
}
const cat = cell => `button[data-cell="${cell}"]`;
async function idle(p) {
  for (let i=0; i<150; i++) {
    if (await p.eval('!busy')) return;
    await sleep(50);
  }
  assert.fail('A move did not settle');
}
async function play(p, cells) {
  for (const cell of cells) {
    assert.equal(await p.eval(`document.querySelector('${cat(cell)}').classList.contains("clear")`), true);
    await touch(p, cat(cell));
    await idle(p);
  }
}
async function fits(p) {
  const size = await read(p, 'return {w:document.documentElement.scrollWidth,h:document.querySelector("main").getBoundingClientRect().bottom,vw:innerWidth,vh:innerHeight,board:game.index,result:game.done}');
  assert(size.w === size.vw && size.h <= size.vh + 1, JSON.stringify(size));
}

(async()=>{
  for(const [width,height] of [[412,915],[360,640]]){
    const p = await open(url, {width,height,dpr:1});
    const shot = name => p.shot(path.join(folder, `${name}-${width}x${height}.png`));
    try {
      assert(await p.eval('Promise.all(Object.values(ART).map(async src => {const img = new Image();img.src = src;await img.decode();return img.naturalWidth > 0;})).then(xs=>xs.every(Boolean))'));
      await fits(p);
      await shot('start');
      const blocked = await read(p, 'return Number(document.querySelector(".cat:not(.clear)").dataset.cell)');
      const before = await state(p);
      await touch(p, cat(blocked));
      assert.deepEqual(await state(p), before);
      assert.equal(await p.eval('document.querySelector(".cat.bump") !== null'), true);
      await touch(p, '#menu');
      assert.equal(await read(p,'return document.querySelectorAll("#orders li").length'), 21);
      await touch(p, 'dialog button');
      await play(p, routes[0].win.slice(0,4));
      assert.deepEqual(await state(p), {done:null,waiting:3,fed:9,seats:1});
      await shot('mid-game');
      await play(p, routes[0].win.slice(4));
      assert.deepEqual(await state(p), {done:'win',waiting:0,fed:21,seats:0});
      await fits(p);
      await shot('win');
      await touch(p, '#retry');
      assert.deepEqual(await state(p), before);
      await play(p, routes[0].loss);
      assert.deepEqual(await state(p), {done:'loss',waiting:2,fed:0,seats:5});
      await fits(p);
      await shot('lose');
      await touch(p, '#daily');
      assert.equal(await p.eval('usingDaily && game.index === dailyBoard'), true);
      await touch(p, '#retry');
      assert.equal(await p.eval('usingDaily && game.index === dailyBoard'), true);
      await p.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
      for (const [index, {plates, win, loss}] of routes.entries()) {
        for (const [steps, result] of [[win,'win'],[loss,'loss']]) {
          await p.eval(`document.querySelector('select').value=${index};document.querySelector('select').dispatchEvent(new Event('change'))`);
          await fits(p);
          await play(p, steps);
          const s = await state(p);
          assert.equal(s.done, result);
          if (result === 'win') assert.deepEqual(s, {done:'win',waiting:0,fed:plates,seats:0});
          await fits(p);
        }
      }
      assert.deepEqual(p.logs, []);
      console.log(`${width}x${height}: all five boards win and jam by touch; blocked move, retry, daily, plate preview, layout and art pass`);
    } finally { await p.close(); }
  }
})().catch(error => {console.error(error); process.exitCode=1;});
