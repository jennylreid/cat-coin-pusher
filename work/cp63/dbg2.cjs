const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("PG.lv.sel=1;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');for(const x of [276,213,256,268,230,237,200,180,220,150,250]){g.pointer('pointerdown',x,Y);g.ticks(150);g.pointer('pointerup',x,Y);}
 g.run("globalThis.__log=[];const o=__cp48TryDrop;");
 console.log(g.run("JSON.stringify({own:cp48Own(),bank:S.coins,phase:WILD.phase,left:WILD.left,sweep:sweepTime,quake:catquakeTime,st:board.status,rem:board.remaining,pend:pendingDrops.length})"));
 g.pointer('pointerdown',200,Y);const out=[];for(let i=0;i<300;i++){const b=+g.run('S.coins');g.tick();const a=+g.run('S.coins');if(a!==b)out.push([i,b-a]);}g.pointer('pointerup',200,Y);
 console.log(JSON.stringify(out),g.run("JSON.stringify({own:cp48Own(),holding,ld:lastDrop,t:time,pend:pendingDrops.length,rel:releaseAt})"));})();
