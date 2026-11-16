const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("for(const c of PG_CATS)PG.open[c]=1;pgSwitchBoard('ragdoll');PG.powers={ragdoll:2};PG.lv.passed=9;PG.lv.sel=6;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);
 const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');for(const x of [276,213,256,268,230,237,200,180,220,150,250]){g.pointer('pointerdown',x,Y);g.ticks(150);g.pointer('pointerup',x,Y);}
 g.ticks(300);
 console.log(g.run("JSON.stringify({own:cp48Own(),bank:S.coins,rem:board.remaining,st:board.status,sweep:sweepTime,quake:catquakeTime,inv:inventoryOpen,ld:lastDrop,t:time,scr:cp48Screen()})"));
 for(let i=0;i<4;i++){g.ticks(70);console.log(g.run("JSON.stringify({own:cp48Own(),wrap:tryDrop({x:200,y:DROP_Y}),ld:lastDrop,t:time})"));}
 console.log(g.run("JSON.stringify({orig:__cp48TryDrop({x:200,y:DROP_Y}),t:time,ld:lastDrop,rem:board.remaining})"));})();
