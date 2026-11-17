// CP-61 real-game shots (Developer off): the dance wheel with its new labels, and a RAIN 10 result, at small phone sizes.
// Usage: node shots61.cjs SRC OUTDIR TAG
const make=require('../cp72/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]),OUT=path.resolve(process.argv[3]),TAG=process.argv[4]||'shot';fs.mkdirSync(OUT,{recursive:true});
(async()=>{for(const [w,h] of [[360,640],[393,852]]){const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 const run=s=>vm.runInContext(s,g.c),ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'-'+TAG+'-'+w+'x'+h+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
 run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(30);
 run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(60);
 run('w2ForceSlice=0;w2StartWheelNow();');ticks(50);shot('wheel');
 for(let i=0;i<900&&!run('!!(WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.result)');i++){if(run("!!(WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.waiting&&WILD.dance.st>.6)"))tap(200,560);g.tick();}
 ticks(25);shot('wheel-result');}console.log('ok')})().catch(e=>{console.error(e);process.exit(1)});
