const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await game({src:path.resolve(process.argv[2]||'base-uat59.html'),render:true});
g.run('S.muted=false;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(40);
console.log(g.run(`JSON.stringify({T,PUSH_MAX,PUSH_MIN,GUARD_END,COIN_R,FUNNEL_D2,W,H,screen:PGU.screen,phase:WILD.phase,mode:WILD.mode,v2:WILD.v2,coll:WILD_COLLECTION,ha:[400,450,500,550,600,650,700].map(y=>Math.round(tableHalfAt(y))),items:bodies.filter(b=>!b.dead&&b.kind!=='coin'&&b.kind!=='silver').map(b=>[b.kind,b.id,Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().z/M)])})`));
g.c.draw();fs.writeFileSync('probe-main.png',g.c.document.getElementById('cv').toBuffer('image/png'));
g.run("PGU.screen='board';pgStartRound()");g.ticks(260);g.c.draw();fs.writeFileSync('probe-board.png',g.c.document.getElementById('cv').toBuffer('image/png'));
console.log(g.run('WILD.phase'));
})();
