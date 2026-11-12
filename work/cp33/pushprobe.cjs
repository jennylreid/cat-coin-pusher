// Physical push: a prize resting on the open-gutter stretch is given a sideways shove (real Rapier). Does it fall into the gutter?
const make=require('./runtime.cjs'),vm=require('vm'),path=require('path'),fs=require('fs');
(async()=>{const rows=[];
 for(const speed of [1,3,6])for(const inset of [34,20,8])for(const side of [-1,1]){
  const g=await make({sourceFile:path.resolve('release.html')}),c=g.c,a=c.__game;vm.runInContext('selectBoard(0);S.coins=200;board.status="playing";',c);
  const lost=[];const orig=c.gutterOff;c.gutterOff=(b,x)=>{if(b.kind==='item')lost.push(b.id);return orig(b,x);};
  vm.runInContext(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese');b.rb.setTranslation({x:(200+${side}*(170-${inset}))*M,y:(ITEM_HALF+1)*M,z:620*M},true);b.rb.setLinvel({x:${side*speed},y:0,z:0},true);})()`,c);
  for(let i=0;i<180;i++)g.tick();
  const fx=vm.runInContext("(()=>{const b=bodies.find(b=>b.kind==='item'&&b.id==='cheese');return b&&!b.dead?Math.round(b.rb.translation().x/M):null})()",c);rows.push({inset,finalX:fx,speedMps:speed,side:side<0?'left':'right',lostToGutter:lost.length>0,board:a.board.status,reason:a.board.endReason||null,lostFxStarted:lost.length>0});g.close();}
 console.log(JSON.stringify(rows,null,0));fs.writeFileSync('../../tickets/CP-33-evidence/lost-push-probe.json',JSON.stringify({note:'Board 1 cheese placed on the table 34 units inside the open side edge at depth 620 (open-gutter stretch, past GUARD_END 431), given a sideways velocity; real physics for 3 s.',rows},null,1));
})();
