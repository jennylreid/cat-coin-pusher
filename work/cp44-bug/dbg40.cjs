const {game}=require('../cp42/harness.cjs'),path=require('path');
(async()=>{const g=await game({seed:5,src:path.resolve('v-e40.html')});g.run(`S.dev=true;wild2Enter();wildStartCountdown()`);g.until(`WILD.phase==='play'`,900);g.ticks(60);
 g.run('paw40ForceTip()');g.until('!!PAW40_STATE.teeter',60);g.ticks(8);const e=JSON.parse(g.run('JSON.stringify(paw40Screen(PAW40_STATE.teeter.b))'));console.log('prize',e);g.tap(e.x,e.y-10);
 for(let i=0;i<6;i++){g.ticks(3);console.log(g.run(`JSON.stringify({side:PAW40_STATE.swipe&&PAW40_STATE.swipe.side,r:[__paw40MittRest(-1),__paw40MittRest(1)],m:[mittRest(-1),mittRest(1)],rest:isRestPose()})`));}})();
