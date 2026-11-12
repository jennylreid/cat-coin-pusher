// Render one frame of a build: node shot.cjs <release.html> <out.png> [js to run first] [ticks]
const make=require('../cp33/runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
(async()=>{const [src,out,js,ticks]=process.argv.slice(2);
 const g=await make({sourceFile:path.resolve(src),render:true,height:888.889,seed:9});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 if(js)vm.runInContext(js,g.c);for(let i=0;i<(+ticks||30);i++)g.tick();g.c.draw();
 fs.writeFileSync(out,g.c.document.getElementById('cv').toBuffer('image/png'));g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
