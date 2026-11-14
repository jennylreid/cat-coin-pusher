const {game}=require('../cp47/harness.cjs'),path=require('path'),crypto=require('crypto');
const fp=g=>g.run("bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return b.kind+':'+p.x.toFixed(4)+','+p.y.toFixed(4)+','+p.z.toFixed(4)}).join('|')");
(async()=>{const G=[];for(const src of ['../cp48/release.html','release.html']){const g=await game({src:path.join(__dirname,src),seed:9});g.run('S.muted=true');try{g.run('if(typeof pgHomeOff==="function")pgHomeOff()');}catch(e){}g.run('globalThis.__ev=[];const q=queueTreatAward;queueTreatAward=function(...a){__ev.push([+time.toFixed(2),a[0]]);return q(...a);}');G.push(g);}
 for(let i=0;i<25*60;i++){for(const g of G){if(i%24===0)g.drop();g.tick();}
  const a=G.map(g=>fp(g)),c=G.map(g=>g.run('S.coins'));if(a[0]!==a[1]||c[0]!==c[1]){console.log('first diff at tick',i,'coins',c,'events',G.map(g=>g.run('JSON.stringify(__ev)')));break;}}
 for(const g of G)g.close();})();
