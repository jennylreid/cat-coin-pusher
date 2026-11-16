// Plays each level with a simple bot (hold to drop, sweeping across; Quake used when it has one) and reports the result.
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.env.SRC||'preview.html');
const levels=(process.env.LV||'1,2,3,4,5,6,7,8,9,10').split(',').map(Number),seeds=(process.env.SEEDS||'1,2,3').split(',').map(Number),cat=process.env.CAT||'tuxedo';
(async()=>{const out=[];
 for(const seed of seeds){const g=await game({src,seed,render:false});g.run('S.muted=true;S.dev=true');if(process.env.NOCAP)g.run('cp48Full=()=>false');if(process.env.CAP)g.run('cp48Full=()=>w43PlainCount()+bodies.filter(b=>!b.dead&&b.kind==="gold5").length>='+process.env.CAP);g.ticks(150);g.tap(200,700);g.ticks(30);
  if(cat!=='tuxedo')g.run(`PG.open['${cat}']=1;pgSwitchBoard('${cat}')`);
  for(const n of levels){const t0=Date.now();g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};if(WILD.phase!=='card')wildReset();else wildReset();PGU.screen='board';pgStartRound();`);
   g.until("WILD.phase==='play'",900);let s=0,q=0,blocked=0,peak=0;
   while(g.run("WILD.phase==='play'")&&s<400){g.run(`if(powerEnabled('quake')&&WILD.left<45){powerTap({x:powerButtons().quake.x+5,y:powerButtons().quake.y+5});}`);
    const x=Math.round(200+125*Math.sin(s*0.77+seed));if(g.run(`typeof cp48Full==='function'&&cp48Full()`))blocked++;g.run(`tryDrop({x:${x},y:DROP_Y})`);peak=Math.max(peak,+g.run('w43PlainCount()+bodies.filter(b=>!b.dead&&b.kind==="gold5").length'));
    for(let i=0;i<27;i++)g.tick();s++;
    // side games: tap something reasonable so they don't stall (dance: tap on beats roughly)
    g.run("if(WILD.dance&&WILD.dance.phase!=='finale'){}");}
   g.until("WILD.phase==='end'",2000);
   const r=JSON.parse(g.run(`JSON.stringify({win:WILD.win,got:WILD.got,goal:WILD_GOAL,left:Math.round(WILD.left),coins:S.coins,reason:WILD.reason,quakes:board.earnedQuakes})`));
   out.push({seed,n,...r,blocked,peak,ms:Date.now()-t0});console.log(JSON.stringify(out[out.length-1]));
   g.run('holding=false;');}}
})();
