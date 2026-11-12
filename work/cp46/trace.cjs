const {game}=require('./harness.cjs');
(async()=>{const g=await game({seed:5});g.run('laserStartNow()');g.until('!!WILD.chase&&WILD.chase.phase==="play"',900);
 g.run('WILD.chase.paw=0.01;WILD.chase.tw={x:160,y:700};laserImpact(WILD.chase)');
 const u=g.run('(()=>{const b=bodies.find(b=>b.laserHit===WILD.chases);window.__tb=b;return b.uid+" "+b.kind;})()');console.log(u);
 for(let i=0;i<12;i++){console.log(g.run('(()=>{const b=__tb,p=b.rb.translation(),v=b.rb.linvel();return [p.x/M,p.y/M,p.z/M,v.x,v.y,v.z].map(n=>n.toFixed(2)).join(" ")+" dead="+!!b.dead})()'));g.tick();}
 console.log(g.run('typeof b2Step')+' '+g.run("String(typeof maxVel)"));g.close();})();
