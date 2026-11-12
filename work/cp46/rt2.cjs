const {game}=require('./harness.cjs');
(async()=>{const g=await game({seed:5});g.ticks(3);
console.log(g.run(`JSON.stringify([-300,-100,0,100,200,300,400,500,600,700,760,900,1060].map(y=>[y,+proj(200,y).y.toFixed(1),+proj(300,y).x.toFixed(1)]))`));g.close();})();
