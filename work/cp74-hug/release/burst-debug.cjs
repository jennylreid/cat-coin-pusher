// debug: checks64's render burst on one build, printing any error (usage: node burst-debug.cjs release.html)
const path=require('path'),vm=require('vm');const make=require('../../cp72/runtime.cjs');
process.on('uncaughtException',e=>{console.log('UNCAUGHT',e&&e.stack);process.exit(3);});process.on('unhandledRejection',e=>{console.log('UNHANDLED',e&&e.stack);process.exit(4);});
process.on('exit',c=>console.log('exit code',c));
(async()=>{const g=await make({sourceFile:path.resolve(process.argv[2]),render:true,width:400,height:889,pixelRatio:1,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});console.log('made');
 g.run=s=>vm.runInContext(s,g.c);for(let i=0;i<150;i++)g.tick();console.log('ticked',g.run('typeof Z74!=="undefined"&&JSON.stringify({err:Z74.err||null,img:Object.keys(Z74.img)})'));g.close&&g.close();})().catch(e=>{console.log('CAUGHT',e&&e.stack);process.exit(2);});
