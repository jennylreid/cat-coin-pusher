const make=require('./runtime.cjs'),path=require('path'),vm=require('vm'),fs=require('fs'),assert=require('assert');
(async()=>{const g=await make({sourceFile:path.resolve('work/cp22/release.html')}),a=g.c.__game;let accepted=0;
for(let f=0;f<60;f++){if(f%3===0)accepted+=a.tryDrop({x:200})?1:0;g.tick();}
const charged=a.board.used;for(let f=0;f<60;f++)g.tick();assert.equal(accepted,3);assert.equal(charged,3);assert.equal(a.board.used,3);
a.resetBoard();assert(a.tryDrop({x:200}));assert(!a.tryDrop({x:200}));assert(vm.runInContext("floats.some(f=>f.text==='Easy taps')",g.c));
const result={tapLimit:.35,attemptsInOneSecond:20,accepted,charged,afterPause:3,restartImmediate:true,restartFeedback:true};fs.writeFileSync('tickets/CP-22-evidence/uat11-rate.json',JSON.stringify(result,null,2));console.log(result);g.close();})();
