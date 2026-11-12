// CP-24 spill: 60 s of play per run, a drop every 0.22 s with the aim sweeping across the drop line; board ends are
// switched off so every run plays the full 60 s. Counts side spills (coins, prizes) and front falls, plus
// "hang-seconds": seconds a prize spends alive with its centre past a side edge (what Jenny saw: a fish that stays).
// node spill.cjs <src> <out.json> [boards=b1,b2,b3,wild,wild2] [seeds=1,2,3]
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm'),fs=require('fs');
const src=path.resolve(process.argv[2]),out=process.argv[3],boards=(process.argv[4]||'b1,b2,b3,wild,wild2').split(','),seeds=(process.argv[5]||'1,2,3').split(',').map(Number);
(async()=>{const rows=[];
 for(const bd of boards)for(const seed of seeds){
  const g=await make({sourceFile:src,seed}),a=g.c.__game,run=s=>vm.runInContext(s,g.c);
  if(bd.startsWith('b'))run(`selectBoard(${+bd[1]-1});S.coins=999;board.status='playing';`);
  else{run(`S.dev=true;${bd==='wild2'?'wild2Enter()':'wildEnter()'};wildStartCountdown();`);let k=0;while(run('WILD.phase')!=='play'&&k++<900)g.tick();run('S.coins=999');}
  run(`globalThis.__sp={side:0,sidePrize:0,front:0,frontPrize:0,hang:0,prizes:{}};finishBoard=function(){};if(typeof wildFinish==='function')wildFinish=function(){};
   const __g=gutterOff;gutterOff=function(b,x){if(!b.dead){if(b.kind==='item')__sp.sidePrize++;else if(b.kind==='coin'||b.kind==='silver')__sp.side++;}return __g(b,x);};
   const __f=fallOff;fallOff=function(b,x){if(!b.dead){const z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2&&z<T.FRONT-4,rescue=!side&&z<T.FRONT-30;
    if(!side&&!rescue){if(b.kind==='item')__sp.frontPrize++;else if(b.kind==='coin'||b.kind==='silver')__sp.front++;}}return __f(b,x);};`);
  let t=0,last=-9;const cad=.22;
  while(t<60){if(t-last>=cad){a.tryDrop({x:200+60*Math.sin(t*1.7+seed*2),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;
   if(Math.round(t*60)%6===0)run(`for(const b of bodies)if(!b.dead&&b.kind==='item'){const p=b.rb.translation();if(Math.abs(p.x/M-200)>(T.R-T.L)/2&&p.y>-.05)__sp.hang+=.1;}`);
   run(`if(board.status==='won'||board.status==='lost')board.status='playing';`);}
  const r=JSON.parse(run(`JSON.stringify({...__sp,used:board.used,coinsLeft:S.coins})`));r.hang=+r.hang.toFixed(1);
  rows.push({board:bd,seed,...r});console.log(JSON.stringify(rows.at(-1)));g.close&&g.close();}
 fs.writeFileSync(out,JSON.stringify(rows,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
