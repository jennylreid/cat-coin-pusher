// CP-21: coins and prizes lost off the sides vs over the front, playing like the win checks. Usage: node gutter.cjs <html>
const path=require('path'),vm=require('vm');
const make=require('./runtime.cjs');
(async()=>{const src=path.resolve(process.argv[2]);
 for(const seed of [42,1,2])for(const gap of [.22,.4])for(const index of [0,1,2]){
  const g=await make({sourceFile:src,seed}),a=g.c.__game;a.selectBoard(index);for(let i=0;i<2400;i++)g.tick();
  vm.runInContext(`globalThis.__side=0;globalThis.__front=0;globalThis.__sidePrize=[];if(typeof gutterOff==='function'){const __g=gutterOff;gutterOff=function(b,x){__side++;if(b.boardTarget)__sidePrize.push(b.id);return __g(b,x);};}const __f=fallOff;fallOff=function(b,x){const r=__f(b,x);return r;};`,g.c);
  let next=0,frame=0;
  for(;frame<a.BOARD.seconds*60+1&&!['won','lost'].includes(a.board.status);frame++){
   if(frame/60>=next&&a.board.remaining>0){const targets=a.BOARD.targets.map(t=>a.bodies.find(b=>b.boardTarget&&b.id===t.id)).filter(Boolean);const t=targets[Math.floor(a.board.used/12)%targets.length];let j=seed*7919+frame;j=(j*16807)%2147483647;const off=seed===42?0:((j%41)-20);a.tryDrop({x:(t?t.rb.translation().x*100:200)+off});next+=gap;}
   g.tick();}
  for(let i=0;i<600&&!['won','lost'].includes(a.board.status);i++)g.tick();
  console.log(JSON.stringify({seed,board:index+1,gap,result:a.board.status,used:a.board.used,of:a.BOARD.coins,side:vm.runInContext('__side',g.c),sidePrizes:vm.runInContext('__sidePrize',g.c),collected:a.board.collected}));g.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
