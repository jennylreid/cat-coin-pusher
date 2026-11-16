// Physics cost per tick on Board 1/3 (UAT 34), hold sweep for 40 s, for comparison with the Wild board.
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
(async()=>{for(const bi of [0,2]){const g=await make({sourceFile:path.resolve(__dirname,'../cp33/release.html'),seed:1});const a=g.c.__game;vm.runInContext(`selectBoard(${bi});S.coins=400;`,g.c);
 let t=0,last=-9,ph=0,f=0,mx=0;while(t<40){if(t-last>=.2){a.tryDrop({x:200+70*Math.sin(t*1.3),y:vm.runInContext('DROP_Y',g.c)});last=t;vm.runInContext('S.coins=400',g.c);}const t0=performance.now();g.tick();ph+=performance.now()-t0;f++;t+=1/60;mx=Math.max(mx,vm.runInContext('bodies.length',g.c));}
 console.log(JSON.stringify({board:bi+1,physMsPerTick:+(ph/f).toFixed(2),maxBodies:mx,status:a.board.status}));g.close();}})();
