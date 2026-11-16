const {game}=require('../cp43/harness.cjs'),path=require('path');const CAP=process.env.CAP;
(async()=>{for(const [lv,cat] of [[1,null],[6,'ragdoll'],[10,null]]){const g=await game({src:path.resolve('release.html'),seed:7});g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(CAP?`cp48Full=()=>w43PlainCount()>=${CAP}`:'cp48Full=()=>false');
 g.run(`for(const c of PG_CATS)PG.open[c]=1;${cat?`pgSwitchBoard('${cat}');PG.powers={ragdoll:2};`:''}PG.lv.passed=9;PG.lv.sel=${lv};wildReset();PGU.screen='board';pgStartRound();`);g.until("WILD.phase==='play'",900);
 if(cat){const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);}
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');let peak=0,pb=0,ms=0,n=0;
 for(const x of [276,213,256,268,230,237,200,180,220,150,250]){g.pointer('pointerdown',x,Y);for(let i=0;i<150;i++){const a=g.realNow();g.tick();ms+=g.realNow()-a;n++;peak=Math.max(peak,+g.run('w43PlainCount()'));pb=Math.max(pb,+g.run('bodies.length'));}g.pointer('pointerup',x,Y);if(g.run("WILD.phase")!=='play')break;}
 console.log('L'+lv,'cap',CAP||'none','peak plain',peak,'peak bodies',pb,'gold5',g.run("bodies.filter(b=>!b.dead&&b.kind==='gold5').length"),'merged',g.run('WILD.merged||0'),'bank',g.run('S.coins'),'ms/tick',(ms/n).toFixed(1),g.run('WILD.phase'));}})();
