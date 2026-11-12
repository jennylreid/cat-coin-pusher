const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{for(const f of [process.argv[2],'../cp43/release.html'])for(const off of [4,8,12,16,20,24]){const g=await game({src:path.resolve(f),seed:4});
 g.run(`selectBoard(0);for(const b of bodies.slice()){const p=b.rb.translation();if(!b.dead&&b.kind!=='item'&&Math.hypot(p.x/M-T.R,p.z/M-560)<80)removeCoin(b);}globalThis.__c=addCoin('coin',null,T.R+${off},COIN_HALF+5,560,yawTurn(0));`);
 g.ticks(120);console.log(path.basename(f),off,g.run('__c.dead?"fell":(__c.rb.translation().x/M-T.R).toFixed(1)'));g.close&&g.close();}})();
