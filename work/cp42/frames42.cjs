// UAT 42 frames: scattered 30% Pop (real runtime, @napi-rs/canvas at DPR 1.35, H 888.9; desktop, not phone evidence).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat42');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{
 const g=await game({seed:4,render:true});g.ticks(30);
 // three prizes over the ledge a moment apart at left, middle and right: they take turns, each near where it fell
 g.run("queueTreatAward('cheese',120,null,true)");g.ticks(14);shot(g,'a1-cheese-left-peak');
 g.run("queueTreatAward('tuna',285,null,true)");g.ticks(20);shot(g,'a2-cheese-leaving-tuna-waits');
 g.run("queueTreatAward('shrimp',200,null,true)");g.ticks(14);shot(g,'a3-tuna-right-peak');
 g.ticks(24);shot(g,'a4-shrimp-middle-peak');g.ticks(30);shot(g,'a5-shrimp-into-bag');g.ticks(60);
 // two from the same spot: the second pops somewhere else
 g.run("queueTreatAward('cheese',200,null,true)");g.ticks(14);shot(g,'b1-same-spot-first');g.run("queueTreatAward('cheese',200,null,true)");g.ticks(30);shot(g,'b2-same-spot-second-elsewhere');g.ticks(80);
 // an edge prize stays on screen
 g.run("queueTreatAward('tuna',360,null,true)");g.ticks(14);shot(g,'c-edge-tuna-on-screen');g.ticks(80);
 g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
