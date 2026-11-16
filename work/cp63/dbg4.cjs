const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{for(const s of ['release.html','../cp47-levels/release.html']){const g=await game({src:path.resolve(s),seed:5});g.run('S.muted=false;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("for(const c of PG_CATS)PG.open[c]=1;pgSwitchBoard('ragdoll');PG.powers={ragdoll:2};PG.lv.passed=9;PG.lv.sel=6;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);
 const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(2);
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');for(const x of [276,213,256,268,230,237,200,180,220,150,250]){g.pointer('pointerdown',x,Y);g.ticks(150);g.pointer('pointerup',x,Y);}
 g.run("globalThis.__wp=[];const w=wildPointer;wildPointer=function(e,p){const r=w(e,p);__wp.push([Math.round(p.x),Math.round(p.y),r,WILD.pet,!!WILD.dance,WILD.phase,typeof PGPX!=='undefined'&&PGPX?PGPX.id:null,typeof pawSave!=='undefined'?1:0]);return r;}");
 for(const x of [200,120,300]){g.pointer('pointerdown',x,Y);g.tick();const h=g.run('holding');g.pointer('pointerup',x,Y);g.ticks(5);console.log(s.slice(0,12),x,'holding',h);}
 console.log(g.run('JSON.stringify(__wp)'),g.run("JSON.stringify({heart:bodies.filter(b=>!b.dead&&b.kind==='item'&&/heart/.test(b.id||'')).length,pawsaves:typeof PAW40!=='undefined'?PAW40:null})"));}})();
