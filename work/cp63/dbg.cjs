const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),seed:5});g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("PG.lv.sel=1;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);
 g.run("{let k=0;while(cp48Pieces()<120&&k<80){addCoin('gold5',null,120+(k%4)*50,30+(k>>2)*4,330,yawTurn(0));k++;}}");
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');
 console.log(g.run("JSON.stringify({p:cp48Pieces(),full:cp48Full(),t:time,fa:cp48FullAt,inv:inventoryOpen,st:board.status,rem:board.remaining})"));
 g.pointer('pointerdown',200,Y);g.tick();console.log(g.run("JSON.stringify({holding,fa:cp48FullAt,t:time,fl:floats.map(f=>f.text)})"));
 console.log(g.run("JSON.stringify(tryDrop({x:200,y:DROP_Y}))"),g.run("JSON.stringify({fa:cp48FullAt,fl:floats.map(f=>f.text)})"));})();
