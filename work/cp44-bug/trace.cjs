const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
(async()=>{const g=await make({sourceFile:path.resolve('v-a.html'),seed:4}),run=s=>vm.runInContext(s,g.c);
 run(`selectBoard(0);for(const b of bodies.slice())removeCoin(b);reconcileBoardTargets=function(){};board.status="playing";globalThis.__p=addCoin('item','tuna',T.R+${process.argv[2]||10},halfOf('item')+5,600,yawTurn(0));`);
 for(let i=0;i<60;i++){g.tick();if(i%3==0)console.log(i,run(`(()=>{const t=__p.rb.translation(),v=__p.rb.linvel(),q=qrot(__p.rb.rotation(),{x:0,y:1,z:0});return [(t.x/M-T.R).toFixed(2),(t.y/M).toFixed(2),(v.x/M).toFixed(1),(v.y/M).toFixed(1),q.x.toFixed(3),q.y.toFixed(3)].join(' ')})()`));}
})();
