// Natural play probe: does a prize ever leave by a side gutter? Drops coins at many positions, real physics.
const make=require('./runtime.cjs'),path=require('path'),vm=require('vm');
(async()=>{
 const results=[];
 for(const board of [0,1,2])for(const seed of [1,2])for(const lane of ["edges","targets"]){
  const g=await make({sourceFile:path.resolve('assets/index.html'),seed}),c=g.c,a=c.__game;
  vm.runInContext(`selectBoard(${board});S.coins=400;board.status="playing";`,c);
  const lost=[];const orig=c.gutterOff;c.gutterOff=(b,x)=>{if(b.kind==='item')lost.push({id:b.id,x:Math.round(x),t:+a.board.used});return orig(b,x);};
  let f=0;
  for(;f<60*150&&!['won','lost'].includes(a.board.status);f++){
   if(f%13===0){let x;const r=c.Math.random();
    if(lane==='left')x=60+r*30;else if(lane==='right')x=310+r*30;else if(lane==='edges')x=r<.5?55+r*40:305+r*40;else{const ts=a.bodies.filter(b=>b.boardTarget&&!b.dead);x=ts.length?ts[f%ts.length].rb.translation().x*100:200;}
    a.tryDrop({x});}
   g.tick();
  }
  results.push({board:board+1,seed,lane,status:a.board.status,reason:a.board.failedTarget||null,used:a.board.used,lostPrizes:lost,sec:Math.round(f/60)});
  g.close();
  console.log(JSON.stringify(results.at(-1)));
 }
 require('fs').writeFileSync('lost-probe.json',JSON.stringify(results,null,1));
})().catch(e=>{console.error(e);process.exitCode=1});
