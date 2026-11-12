// Balance (as CP-37): one board, seeds given, no powers, a drop every 0.22/0.3/0.4 s (seed 1/2/3) with the aim sweeping,
// until the board ends (max 240 s). node balance1.cjs <src> <out.json> <boardIndex> [seeds]
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm'),fs=require('fs');
const [,,s0,out,bi,sd]=process.argv,src=path.resolve(s0),seeds=(sd||'1,2,3').split(',').map(Number);
(async()=>{const rows=[];
 for(const seed of seeds){const g=await make({sourceFile:src,seed}),a=g.c.__game,run=s=>vm.runInContext(s,g.c);run(`selectBoard(${bi});S.coins=999;`);
  let t=0,last=-9;while(t<240&&!['won','lost'].includes(run('board.status'))){if(t-last>=[.22,.3,.4][(seed-1)%3]){a.tryDrop({x:200+60*Math.sin(t*1.7+seed*2),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;}
  rows.push({board:+bi+1,seed,status:run('board.status'),reason:run('board.endReason||""'),used:run('board.used'),sec:+t.toFixed(1)});console.log(JSON.stringify(rows.at(-1)));g.close&&g.close();}
 fs.writeFileSync(out,JSON.stringify(rows,null,1));})();
