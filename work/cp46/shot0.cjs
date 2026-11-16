const {game}=require('./harness.cjs'),fs=require('fs');
(async()=>{const src=process.argv[2];const g=await game({seed:4,render:true,src:require('path').resolve(src)});g.ticks(30);
g.c.draw();fs.writeFileSync(process.argv[3],g.c.document.getElementById('cv').toBuffer('image/png'));g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
