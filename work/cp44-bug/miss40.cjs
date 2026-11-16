const {game}=require('../cp42/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('v-b40.html'),seed:5});g.run(`S.dev=true;wild2Enter();wildStartCountdown()`);g.until(`WILD.phase==='play'`,900);g.ticks(30);
 g.run('paw40ForceTip()');g.until('!!PAW40_STATE.teeter',60);g.run('globalThis.__b=PAW40_STATE.teeter.b');
 for(let i=0;i<150;i+=5){console.log(i,g.run(`__b.dead?'dead':(()=>{const p=__b.rb.translation(),v=__b.rb.linvel();return [(p.x/M-200).toFixed(1),(p.y/M).toFixed(1),(v.x/M).toFixed(0),(v.y/M).toFixed(0),__b.rb.gravityScale(),!!PAW40_STATE.teeter,__b.rb.isSleeping()].join(' ')})()`));g.ticks(5);}
})();
