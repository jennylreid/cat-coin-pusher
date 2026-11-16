// Freeze investigation: does anything build up over many rounds (a 97-minute session)? Plays N short rounds across
// levels and cats (powers used, coins dropped), then prints world/body/list sizes and the tick cost of an idle board.
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||'release.html'),N=+(process.env.N||20);
(async()=>{const g=await game({src,render:false,seed:3});g.run('S.muted=false');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run('for(const c of PG_CATS){PG.open[c]=1;}PG.lv.passed=9;');
 const sizes=()=>JSON.parse(g.run(`JSON.stringify({colliders:world.colliders.len(),rbodies:world.bodies.len(),bodies:bodies.length,floats:floats.length,confetti:WILD.confetti.length,events:diagSession.events.length,timers:(globalThis.__t||0)})`));
 const idle=()=>{let ms=0;for(let i=0;i<120;i++){const a=g.realNow();g.tick();ms+=g.realNow()-a;}return +(ms/120).toFixed(2);};
 const cats=['ragdoll','tuxedo','orange','siamese','tortie'];const start=(cat,lv)=>{g.run(`PG.powers={${cat}:3};pgSwitchBoard('${cat}');PG.lv.sel=${lv};wildReset();PGU.screen='board';pgStartRound();`);g.until("WILD.phase==='play'",900);};
 start('ragdoll',0);g.ticks(60);console.log('round 0',JSON.stringify(sizes()),'idle ms/tick',idle());
 for(let r=1;r<=N;r++){const cat=cats[r%5];start(cat,r%10);const y=+g.run('Math.round(hudLayout().headerBottom+60)');
  g.pointer('pointerdown',200,y);g.ticks(300);g.pointer('pointerup',200,y);const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(420);
  g.run('WILD.left=.1');g.until("WILD.phase==='end'",600);g.ticks(120);
  if(r%5===0)console.log('round',r,JSON.stringify(sizes()),'errs',g.run('__errs.length'));}
 start('ragdoll',0);g.ticks(60);console.log('back to L1',JSON.stringify(sizes()),'idle ms/tick',idle());
 console.log('errs',g.run('JSON.stringify(__errs.slice(0,3))'));
})();
