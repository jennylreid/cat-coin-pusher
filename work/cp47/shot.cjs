const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
(async()=>{const src=path.resolve(process.argv[2]);const g=await game({seed:4,render:true,src});
const pre=process.argv[4]||'';if(pre)g.run(pre);g.ticks(+(process.argv[5]||30));
g.c.draw();fs.writeFileSync(process.argv[3],g.c.document.getElementById('cv').toBuffer('image/png'));g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
