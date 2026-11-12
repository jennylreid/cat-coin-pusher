// CP-40 frames: Wild 2, a forced tip-off: glow, the mitt sliding in, the flick, SAVED!, and the HUD saves.
const {game}=require('../cp42/harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'out','frames');
(async()=>{const g=await game({seed:5,render:true,src:path.resolve(process.argv[2]||'v-b40.html')}),cv=g.c.document.getElementById('cv');
 g.run(`S.dev=true;wild2Enter();wildStartCountdown()`);g.until(`WILD.phase==='play'`,900);g.ticks(60);
 g.run('paw40ForceTip()');g.until('!!PAW40_STATE.teeter',60);const shot=n=>{g.c.draw();fs.writeFileSync(path.join(O,`w2-save-${n}.png`),cv.toBuffer('image/png'));};
 g.ticks(8);shot('1-glow');const e=JSON.parse(g.run('JSON.stringify(paw40Screen(PAW40_STATE.teeter.b))'));g.tap(e.x,e.y-10);
 g.ticks(6);shot('2-mitt');g.ticks(5);shot('3-flick');g.ticks(14);shot('4-saved');g.ticks(40);shot('5-after');g.close&&g.close();})();
