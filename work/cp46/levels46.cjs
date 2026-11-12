// Peak/RMS of each Laser chase sound alone (offline render of the game's own sfx.laser calls; desktop, dBFS at output).
const {game}=require('./harness.cjs'),{makeContext,stats,SR}=require('./audio-render.cjs'),path=require('path'),fs=require('fs');
(async()=>{const out={};for(const [k,arg] of [['start',0],['dot',0],['wind',0],['pounce',0],['thump',6],['prize',0],['miss',0],['over',3],['end',8],['none',0]]){
 const g=await game({src:path.resolve('release.html'),seed:4});let ctx;g.c.AudioContext=class{constructor(){ctx=makeContext(()=>g.ms()/1000-100);return ctx;}};
 g.run('S.muted=false;W2.music=0;W2.pusher=0');g.ticks(30);g.run(`sfx.laser('${k}',1,${arg})`);g.ticks(90);const r=ctx.render();g.close();
 out[k]=r?stats(r.a):null;}
 console.log(JSON.stringify(out));fs.writeFileSync(path.resolve('../../tickets/CP-42-evidence/levels.json'),JSON.stringify(out,null,1));})();
