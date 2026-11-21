const path=require('path');const {game}=require('../cp43/harness.cjs');
(async()=>{const g=await game({src:path.resolve(__dirname,'../cp136-towers/release.html'),seed:+(process.env.SEED||13),render:false,storage:{}});
 g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 g.run("CP93P.set('"+(process.env.TP||'c')+"');CP93.seed=7919;labStart('giant')");
 const P=()=>g.run("JSON.stringify({t:+time.toFixed(2),ph:WILD.phase,b:bodies.filter(b=>!b.dead&&b.cp93Seg===0).map(b=>{const p=b.rb.translation();return [Math.round(p.x/M),Math.round(p.z/M),Math.round(p.y/M)]}),tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).length,near:bodies.filter(b=>!b.dead&&b.kind!=='stack'&&b.cp93Top==null&&[[128,665],[200,650],[272,660]].some(([x,z])=>{const p=b.rb.translation();return Math.hypot(p.x/M-x,p.z/M-z)<45})).length})");
 console.log(P());for(let i=0;i<12;i++){g.ticks(15);console.log(P());}})();
