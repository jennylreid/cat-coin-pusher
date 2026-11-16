const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('../cp66/release.html'),render:false,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);
 console.log('start',g.run('PGU.screen'),g.run('PG_AB'));
 g.run("PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);g.ticks(60);
 const b=JSON.parse(g.run('JSON.stringify(wildButton())'));g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(40);
 console.log('after in-round Board:',g.run('PGU.screen'),g.run('WILD.phase'),g.run('WILD.on'));
 g.run("pgGo('album')");g.ticks(20);const k=JSON.parse(g.run('JSON.stringify(pgBack())'));g.tap(k.x+k.w/2,k.y+k.h/2);g.ticks(30);console.log('after album back:',g.run('PGU.screen'));
 for(const s of ['kitchen','porch','shop']){g.run(`pgGo('${s}')`);g.ticks(20);g.tap(k.x+k.w/2,k.y+k.h/2);g.ticks(30);console.log('after',s,'back:',g.run('PGU.screen'));}
})();
