// CP-21: starting coin counts per board and the view numbers. Usage: node count.cjs <html>
const fs=require('fs'),path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const make=require(runtime);
(async()=>{const src=path.resolve(process.argv[2]);
 for(const b of [0,1,2]){const g=await make({sourceFile:src});const a=g.c.__game;a.selectBoard(b);for(let i=0;i<120;i++)g.tick();
  console.log(JSON.stringify({board:b+1,id:a.BOARD.id,budget:a.BOARD.coins,seconds:a.BOARD.seconds,onTable:vm.runInContext("bodies.filter(x=>x.kind==='coin'||x.kind==='silver').length",g.c),quake:vm.runInContext("bodies.filter(x=>x.kind==='quake').length",g.c)}));g.close();}
})();
