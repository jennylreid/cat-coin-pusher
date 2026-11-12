// CP-37 balance: Boards 1-3, seeds 1-3, no powers, a drop every 0.22 s with the aim sweeping, until the board ends
// (max 240 s). Three tap patterns per board (0.22 s, 0.3 s, 0.4 s cadence, different aim phase); same for both sources. node balance.cjs <src>
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
const src=path.resolve(process.argv[2]||'uat37.html');
(async()=>{const rows=[];
 for(const bi of [0,1,2])for(const seed of [1,2,3]){
  const g=await make({sourceFile:src,seed}),a=g.c.__game,run=s=>vm.runInContext(s,g.c);run(`selectBoard(${bi});S.coins=999;`);
  const c0=run('S.coins');let t=0,last=-9;
  while(t<240&&!['won','lost'].includes(run('board.status'))){if(t-last>=[.22,.3,.4][seed-1]){a.tryDrop({x:200+60*Math.sin(t*1.7+seed*2),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;}
  rows.push({board:bi+1,seed,status:run('board.status'),used:run('board.used'),paid:g.paidObjects,falls:g.falls,sec:+t.toFixed(1)});g.close();
  console.log(JSON.stringify(rows.at(-1)));}
 require('fs').writeFileSync(path.resolve(__dirname,'out','balance-'+path.basename(src,'.html')+'.json'),JSON.stringify(rows,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
