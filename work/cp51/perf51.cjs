// Board frame cost, UAT 50 vs UAT 51: the same 40 s Wild 2 round (seed, aim sweep); time per tick of physics+update and
// per draw. Desktop software canvas: compare the two builds, not absolute phone numbers. Also times UAT 51's own board overlay.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),{performance:P}=require('perf_hooks');
async function run(src,v49){const g=await game({src:path.resolve(src),seed:9,render:true});strictAudio(g);g.run('S.muted=false');
 g.ticks(2);g.run("pgPlay('tuxedo')");g.run('wildStartCountdown()');g.until("WILD.phase==='play'",900);
 let tick=0,draw=0,ov=0,n=0,nd=0;g.c.__rn=()=>P.now();if(v49)g.run("globalThis.__ov=0;const __o=pgBoardOverlay;pgBoardOverlay=function(){const a=__rn();__o();__ov+=__rn()-a;}");
 for(let s=0;s<40;s++){g.run(`S.coins=Math.max(S.coins,40);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);
  for(let f=0;f<60;f++){let a=P.now();g.tick();tick+=P.now()-a;n++;if(f%3===0){a=P.now();g.c.draw();draw+=P.now()-a;nd++;}}}
 const r={tickMs:+(tick/n).toFixed(3),drawMs:+(draw/nd).toFixed(3),bodies:g.run('bodies.filter(b=>!b.dead).length')};if(v49)r.overlayMsPerDraw=+(g.run('__ov')/nd).toFixed(3);g.close&&g.close();return r;}
(async()=>{const out={};for(let k=0;k<3;k++){out['uat50_'+k]=await run('../cp50/release.html',true);out['uat51_'+k]=await run('release.html',true);}console.log(JSON.stringify(out,null,1));})();
