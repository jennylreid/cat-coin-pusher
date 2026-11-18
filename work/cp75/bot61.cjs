// CP-61 measuring bot: CP-51's bot68 (real pointer events, hold or 5 taps a second, sweeping; Quake under 45 s left)
// plus rain counts per round, physics ms per tick at the peak and the sleeping share at the peak.
// Usage: SRC=... MODE=hold|tap LV=1,2 SEEDS=1,2,3 node bot61.cjs
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.env.SRC),mode=process.env.MODE||'hold';
const levels=(process.env.LV||'1,2,3,4,5,6,7,8,9,10').split(',').map(Number),seeds=(process.env.SEEDS||'1,2,3').split(',').map(Number);
const HOOK=`
var CP61M={sky:0,gold5:0,vanished:0,land:{},bonus:{},rainN:0,rainEv:0};
(function(){const S0=skyLand;skyLand=function(s){if(s.kind==='coin'||s.kind==='silver'){CP61M.sky++;const n=bodies.length,r=S0(s);
  if(bodies.length===n)CP61M.vanished++;else if(bodies[bodies.length-1].kind==='gold5')CP61M.gold5++;return r;}
 CP61M.land[s.kind]=(CP61M.land[s.kind]|0)+1;return S0(s);};
 const B0=wildLandBonus;wildLandBonus=function(o){CP61M.bonus[o.kind]=(CP61M.bonus[o.kind]|0)+1;return B0(o);};
 const R0=wildStartRain;wildStartRain=function(n){CP61M.rainN+=n;CP61M.rainEv++;return R0(n);};})();`;
(async()=>{for(const seed of seeds){const g=await game({src,seed,render:false});g.run('S.muted=true;S.dev=false');g.run(HOOK);g.ticks(150);g.tap(200,700);g.ticks(30);
 for(const n of levels){const t0=Date.now();g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();PGU.screen='board';pgStartRound();`);
  g.until("WILD.phase==='play'",900);const sc=+g.run('scale');const P=(t,x,y)=>g.pointer(t,x*sc,y*sc);
  const startRain=JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead&&RAIN[b.kind]&&b.kind!=='gold5').map(b=>b.kind))"));
  g.run("CP61M.sky=0;CP61M.gold5=0;CP61M.vanished=0;CP61M.land={};CP61M.bonus={};CP61M.rainN=0;CP61M.rainEv=0;");
  const Y=560;let k=0,peak=0,peakBodies=0,full=0,d0=+g.run('S.drops'),down=false,acc=0;const samples=[];
  while(g.run("WILD.phase==='play'")&&k<60*90){
   if(k%30===0)g.run(`if(powerEnabled('quake')&&WILD.left<45){powerTap({x:powerButtons().quake.x+5,y:powerButtons().quake.y+5});}`);
   const x=Math.round(200+120*Math.sin(k/60*0.9+seed));
   if(mode==='hold'){if(!down||!g.run('holding')){P('pointerdown',x,Y);down=true;}else if(k%4===0)P('pointermove',x,Y);}
   else if(k%12===0){P('pointerdown',x,Y);{const a=g.realNow();g.tick();acc+=g.realNow()-a;}k++;P('pointerup',x,Y);}
   {const a=g.realNow();g.tick();acc+=g.realNow()-a;}k++;
   if(k%10===0){const v=JSON.parse(g.run("(()=>{let p=0,sl=0;for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')){p++;if(b.rb.isSleeping())sl++;}return JSON.stringify([p,bodies.filter(b=>!b.dead).length,typeof cp48Full==='function'&&cp48Full(),sl]);})()"));
    peak=Math.max(peak,v[0]);peakBodies=Math.max(peakBodies,v[1]);if(v[2])full++;samples.push({p:v[0],ms:acc/10,sl:v[3]});acc=0;}}
  if(down)P('pointerup',200,Y);g.until("WILD.phase==='end'",2000);
  const r=JSON.parse(g.run(`JSON.stringify({win:WILD.win,got:WILD.got,goal:WILD_GOAL,left:Math.round(WILD.left),bank:S.coins,reason:WILD.reason,m:CP61M,skipped:WILD.cp61Skipped|0})`));
  const top=samples.filter(s=>s.p>=peak-5),avg=a=>a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);
  const late=samples.slice(Math.floor(samples.length*.4));
  const o={build:path.basename(path.dirname(src)),mode,seed,n,win:r.win,got:r.got,goal:r.goal,left:r.left,bank:r.bank,reason:r.reason,
   drops:+g.run('S.drops')-d0,peak,peakBodies,fullSecs:+(full/6).toFixed(1),
   msAtPeak:+avg(top.map(s=>s.ms)).toFixed(2),msLate:+avg(late.map(s=>s.ms)).toFixed(2),maxMs10:+Math.max(0,...samples.map(s=>s.ms)).toFixed(1),
   sleepAtPeak:+avg(top.map(s=>s.sl/Math.max(1,s.p))).toFixed(2),
   startRain,rainCoinsSky:r.m.sky,rainLandedGold5:r.m.gold5,rainVanished:r.m.vanished,rainFromRainCoins:r.m.rainN,rainEvents:r.m.rainEv,bonus:r.m.bonus,skyOther:r.m.land,skipped:r.skipped,ms:Date.now()-t0};
  console.log(JSON.stringify(o));
  g.run('holding=false;');}}})().catch(e=>{console.error(e);process.exit(1)});
