// CP-21 win checks: each board played without powers, aiming at the prizes (same strategy as UAT-19 regression),
// at 0.22 s and 0.4 s between taps. Usage: node wins.cjs <html> [out.json]
const fs=require('fs'),path=require('path');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const make=require(runtime);
(async()=>{const src=path.resolve(process.argv[2]),res=[];
 const boards=(process.env.BOARDS||"0,1,2").split(",").map(Number),seeds=(process.env.SEEDS||"42").split(",").map(Number);
 for(const seed of seeds)for(const gap of [.22,.4])for(const index of boards){
  const g=await make({sourceFile:src,seed}),a=g.c.__game;a.selectBoard(index);
  for(let i=0;i<2400;i++)g.tick();let next=0,frame=0;
  for(;frame<a.BOARD.seconds*60+1&&!['won','lost'].includes(a.board.status);frame++){
   if(frame/60>=next&&a.board.remaining>0){const targets=a.BOARD.targets.map(t=>a.bodies.find(b=>b.boardTarget&&b.id===t.id)).filter(Boolean);const t=targets[Math.floor(a.board.used/12)%targets.length];let j=seed*7919+frame;j=(j*16807)%2147483647;const off=seed===42?0:((j%41)-20);a.tryDrop({x:(t?t.rb.translation().x*100:200)+off});next+=gap;}
   g.tick();}
  for(let i=0;i<600&&!['won','lost'].includes(a.board.status);i++)g.tick();
  const r={seed,board:index+1,tapGap:gap,result:a.board.status,coinsUsed:a.board.used,of:a.BOARD.coins,seconds:+(a.board.elapsed).toFixed(1),collected:a.board.collected.map(c=>c.id||c)};
  res.push(r);console.log(JSON.stringify(r));g.close();}
 if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(res,null,1));
})().catch(e=>{console.error(e);process.exitCode=1});
