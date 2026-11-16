// CP-48: flood to ~130 coins on Level 6 as the Ragdoll (Hug), leave via the in-round "Board" button (EXIT=1) or let
// the round end and tap "Main screen", then time every PLAY-screen button. Real ms per tick and per tap.
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||'../cp47-levels/release.html'),LV=+(process.env.LV||6),EXIT=process.env.EXIT==='1';
(async()=>{const g=await game({src,render:!!process.env.RENDER,seed:7});g.run('S.muted=false');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`for(const c of PG_CATS){PG.open[c]=1;}PG.powers={ragdoll:2};pgSwitchBoard('ragdoll');PG.lv.passed=9;PG.lv.sel=${LV};wildReset();PGU.screen='board';pgStartRound();`);
 g.until("WILD.phase==='play'",900);
 const st=()=>JSON.parse(g.run(`JSON.stringify({phase:WILD.phase,left:+WILD.left.toFixed(1),bank:S.coins,coins:bodies.filter(coinSolid).length,bodies:bodies.length,screen:PGU.screen,panel:panel.style.display,inv:inventoryOpen,holding,rules:!!PGU.rules,door:!!PGU.door,pick:!!PGU.pick,errs:__errs.length})`));
 const timed=(label,fn)=>{const a=g.realNow();fn();const d=g.realNow()-a;console.log(label,d.toFixed(0)+'ms',JSON.stringify(st()));};
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');
 if(process.env.HUG!=='0'){const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);}
 let peak=0;for(const x of [276,213,256,268,230,237,200,180,220]){g.pointer('pointerdown',x,Y);for(let i=0;i<150;i++){g.tick();}g.pointer('pointerup',x,Y);peak=Math.max(peak,st().coins);if(st().bank<=0)break;}
 console.log('flooded peak',peak,JSON.stringify(st()));
 let ms=0;for(let i=0;i<60;i++){const a=g.realNow();g.tick();ms+=g.realNow()-a;}console.log('ms/tick at flood',(ms/60).toFixed(1));
 if(EXIT){const b=JSON.parse(g.run('JSON.stringify(wildButton())'));timed('tap Board (exit)',()=>g.tap(b.x+b.w/2,b.y+b.h/2));}
 else{g.until("WILD.phase==='end'",60*90);g.ticks(90);const R=JSON.parse(g.run('JSON.stringify(wildEndRects())'));timed('tap Main screen',()=>g.tap(R.back.x+R.back.w/2,R.back.y+R.back.h/2));}
 for(let k=0;k<5;k++){timed('tick',()=>g.ticks(12));}
 const R=JSON.parse(g.run('JSON.stringify({m:pgMainRects(),L:PGA.L,D:pgDock()})'));
 console.log('main rects keys',Object.keys(R.m),'L',R.L&&Object.keys(R.L));
 const tapR=(name,r)=>{if(!r)return;timed('tap '+name,()=>{g.tap(r.x+r.w/2,r.y+r.h/2);g.ticks(30);});
   // back to main if a screen opened
   g.run("PGU.door=null;PGU.rules=false;PGU.pick=false;if(PGU.screen!=='main'){pgGo('board');}if(inventoryOpen&&typeof closeLoopScreen==='function')closeLoopScreen();panel.style.display='none';");g.ticks(20);};
 for(const s of (R.m.side||[]))tapR('side '+s.id,s.hit);
 tapR('help',R.L&&R.L.help);
 for(const k of ['gear','coll','inv'])tapR('dock '+k,R.D[k]);
 tapR('play',R.L&&R.L.play);g.ticks(240);console.log('after play',JSON.stringify(st()));
 console.log('errs',g.run('JSON.stringify(__errs.slice(0,5))'));
})();
