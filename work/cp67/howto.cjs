// "? How to play" goal card shot (it also lists the goal prizes). Usage: node howto.cjs SRC OUT.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
(async()=>{const g=await make({sourceFile:path.resolve(process.argv[2]),render:true,seed:5,pixelRatio:2,width:360,height:640,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=1e5;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};const run=s=>vm.runInContext(s,g.c);
 run('S.dev=false;S.muted=true');for(let i=0;i<150;i++)g.tick();const s=run('scale');g.pointer('pointerdown',200*s,700*s);g.pointer('pointerup',200*s,700*s);for(let i=0;i<40;i++)g.tick();
 run("pglLv().passed=9;pglLv().sel=10;pgSave();wildReset();");for(let i=0;i<10;i++)g.tick();g.c.draw();const L=JSON.parse(run('JSON.stringify(PGA.L.help)'));
 g.pointer('pointerdown',(L.x+20)*s,(L.y+10)*s);g.pointer('pointerup',(L.x+20)*s,(L.y+10)*s);for(let i=0;i<40;i++)g.tick();g.c.draw();
 fs.writeFileSync(process.argv[3],g.c.document.getElementById('cv').toBuffer('image/png'));console.log(run('PGU.screen'),run('PGU.rules'));})();
