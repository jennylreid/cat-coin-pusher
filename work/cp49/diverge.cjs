require('./old-on49-hook.cjs');
const {game}=require('../cp47/harness.cjs'),crypto=require('crypto'),path=require('path');
const fp=g=>crypto.createHash('sha1').update(g.run("bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return b.kind+':'+(b.id||'')+':'+p.x.toFixed(4)+','+p.y.toFixed(4)+','+p.z.toFixed(4)}).join('|')+'#'+S.coins")).digest('hex').slice(0,10);
(async()=>{const gs=[];for(const src of ['../cp48/release.html','release.html']){const g=await game({src:path.resolve(src),seed:9});g.run('S.muted=true');g.run("wild2Enter();wildStartCountdown()");gs.push(g);}
 console.log(gs.map(g=>g.run('JSON.stringify([WILD_COLLECTION,WILD.star,typeof PG_HOME_OFF!=="undefined"&&PG_HOME_OFF])')));
 for(let i=0;i<40*60;i++){for(const g of gs){if(i%24===0)g.drop();g.tick();}if(i%30===0){const a=fp(gs[0]),b=fp(gs[1]);if(a!==b){console.log('diverge at tick',i,gs.map(g=>g.run('JSON.stringify({c:S.coins,n:bodies.filter(b=>!b.dead).length,ph:WILD.phase,inc:WILD.incoming.length,bonus:WILD.bonusN})')));break;}}}
})();
