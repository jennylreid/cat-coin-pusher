// CP-51 balance bot. Plays each level with real pointer events and reports wins and the most coins on the board.
// MODE=hold: one finger held down the whole round, sweeping slowly left and right (the flood case).
// MODE=tap: taps 5 times a second (fast tapping), sweeping across.
// Both use the Quake when they have one and fewer than 45 s are left (as the CP-48 bot). Developer off, sound off.
// Usage: SRC=... MODE=hold|tap LV=1,2 SEEDS=1,2,3 node bot68.cjs
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.env.SRC),mode=process.env.MODE||'hold';
const levels=(process.env.LV||'1,2,3,4,5,6,7,8,9,10').split(',').map(Number),seeds=(process.env.SEEDS||'1,2,3').split(',').map(Number);
(async()=>{for(const seed of seeds){const g=await game({src,seed,render:false});g.run('S.muted=true;S.dev=false');if(process.env.HOLD)g.run('CP51.hold='+process.env.HOLD);g.ticks(150);g.tap(200,700);g.ticks(30);
 for(const n of levels){const t0=Date.now();g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();PGU.screen='board';pgStartRound();`);
  g.until("WILD.phase==='play'",900);const sc=+g.run('scale');const P=(t,x,y)=>g.pointer(t,x*sc,y*sc);
  const Y=560;let k=0,peak=0,peakBodies=0,full=0,d0=+g.run('S.drops'),down=false,tms=0,tn=0,tmax=0;
  while(g.run("WILD.phase==='play'")&&k<60*90){
   if(k%30===0)g.run(`if(powerEnabled('quake')&&WILD.left<45){powerTap({x:powerButtons().quake.x+5,y:powerButtons().quake.y+5});}`);
   const x=Math.round(200+120*Math.sin(k/60*0.9+seed));
   if(mode==='hold'){if(!down||!g.run('holding')){P('pointerdown',x,Y);down=true;}else if(k%4===0)P('pointermove',x,Y);}
   else if(k%12===0){P('pointerdown',x,Y);g.tick();k++;P('pointerup',x,Y);}
   {const a=g.realNow();g.tick();const d=g.realNow()-a;if(k>60*25){tms+=d;tn++;tmax=Math.max(tmax,d);}}k++;
   if(k%10===0){const v=JSON.parse(g.run("JSON.stringify([bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')).length,bodies.filter(b=>!b.dead).length,typeof cp48Full==='function'&&cp48Full()])"));peak=Math.max(peak,v[0]);peakBodies=Math.max(peakBodies,v[1]);if(v[2])full++;}}
  if(down)P('pointerup',200,Y);g.until("WILD.phase==='end'",2000);
  const r=JSON.parse(g.run(`JSON.stringify({win:WILD.win,got:WILD.got,goal:WILD_GOAL,left:Math.round(WILD.left),bank:S.coins,reason:WILD.reason})`));
  const o={build:path.basename(path.dirname(src)),mode,seed,n,...r,drops:+g.run('S.drops')-d0,peak,peakBodies,fullSecs:+(full/6).toFixed(1),msPerTickAfter25s:+(tms/Math.max(1,tn)).toFixed(2),maxTickMs:+tmax.toFixed(1),ms:Date.now()-t0};console.log(JSON.stringify(o));
  g.run('holding=false;');}}})().catch(e=>{console.error(e);process.exit(1)});
