const {game}=require('./harness.cjs');
(async()=>{const g=await game({seed:5});g.run('laserEnter()');g.ticks(3);
console.log(g.run(`JSON.stringify([[200,560],[100,700],[300,740],[150,400]].map(([x,y])=>{const q=laserScreen(x,y,0),w=laserWorld(q.x,q.y);return [x,y,+q.x.toFixed(1),+q.y.toFixed(1),+w.x.toFixed(1),+w.y.toFixed(1)]}))`));
console.log(g.run(`JSON.stringify(bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind[0],Math.round(p.x/M),Math.round(p.z/M)]}).filter(a=>a[2]>600))`));g.close();})();
