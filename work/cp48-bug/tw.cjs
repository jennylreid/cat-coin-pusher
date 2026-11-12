// Tower wall round: enter the mode, start, hold-to-drop with the aim sweeping for SEC s; report what happened to the
// five top prizes (won off the front / lost off a side / still on the board), topples and Paw save glows (no save taps).
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const [,,s0,seedA,secA,render]=process.argv;const src=path.resolve(s0||'proto48.html'),seed=+(seedA||1),SEC=+(secA||90);
(async()=>{const g=await game({src,seed,render:!!render});g.run('S.dev=true');
 if(!g.run(`wildModeEnter('towers')`)){console.log('no mode');return;}
 g.run('wildStartCountdown()');g.until(`WILD.phase==='play'`,900);
 g.run(`globalThis.__tw={won:[],lost:[],topples:0,glows:0};const tops=bodies.filter(b=>b.twTop).map(b=>b.id);globalThis.__tops=tops;
  const __f=fallOff;fallOff=function(b,x){if(!b.dead&&b.twTop){const side=Math.abs(x-200)>(T.R-T.L)/2-2&&b.rb.translation().z/M<T.FRONT-4;(side?__tw.lost:__tw.won).push(b.id+'@'+time.toFixed(1));}return __f(b,x);};
  const __g=gutterOff;gutterOff=function(b,x){if(!b.dead&&b.twTop&&!__tw.lost.some(s=>s.startsWith(b.id+'@')))__tw.lost.push(b.id+'@'+time.toFixed(1));return __g(b,x);};
  wildFinish=function(){};`);
 const t0=g.run('time');let glow=false,glowAt=0;
 for(let s=0;s<SEC;s++){g.run(`S.coins=Math.max(S.coins,60);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+${seed}),y:DROP_Y};`);
  for(let i=0;i<60;i++){g.tick();const gl=g.run('!!PAW40_STATE.teeter');if(gl&&!glow){g.run('__tw.glows++');glowAt=0;}if(gl){glowAt++;if(process.env.SAVE&&glowAt===15){const e=JSON.parse(g.run('JSON.stringify(paw40Screen(PAW40_STATE.teeter.b))'));g.tap(e.x,e.y-10);}}glow=gl;}}
 const r=JSON.parse(g.run(`JSON.stringify({tops:__tops,star:WILD.star,won:__tw.won,lost:__tw.lost,glows:__tw.glows,towersLeft:bodies.filter(b=>!b.dead&&b.kind==='stack').length,topsOnBoard:bodies.filter(b=>!b.dead&&b.twTop).map(b=>b.id),saves:PAW40_STATE.saves})`));
 console.log(JSON.stringify({seed,...r}));g.close&&g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
