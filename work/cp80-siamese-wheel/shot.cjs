const make=require('C:/Users/jenny/OneDrive/work/CoinPusher/work/cp33/runtime.cjs'),vm=require('vm'),fs=require('fs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
(async()=>{const g=await make({sourceFile:'C:/Users/jenny/AppData/Local/Temp/claude/18f51871753806d1/754f6ff6-4d70-4682-b128-b04aa5bebf5e/scratchpad/fix80/release.html',render:true,seed:7,pixelRatio:1,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.run=s=>vm.runInContext(s,g.c);
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 const tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('siamese');");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(240);for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));}
 g.run('w2ForceWheel(W2_WHEEL.findIndex(s=>s.label==="YAWN"))');
 const shot=n=>{g.c.draw();fs.writeFileSync('C:/Users/jenny/AppData/Local/Temp/claude/18f51871753806d1/754f6ff6-4d70-4682-b128-b04aa5bebf5e/scratchpad/s80-'+n+'.png',g.c.document.getElementById('cv').toBuffer('image/png'));};
 let n=0;while(!g.run("WILD.dance&&WILD.dance.stage==='wheel'")&&n++<3000)g.tick();ticks(40);shot('1wheel');
 n=0;while(!(g.run('W2_YAWN&&W2_YAWN.t')>=1.0)&&n++<3000)g.tick();shot('2yawn');
 n=0;while(!(g.run('W2_YAWN&&W2_YAWN.t')>=3.6)&&n++<3000)g.tick();shot('3eat');
 n=0;while(g.run('!!W2_YAWN')&&n++<3000)g.tick();ticks(120);shot('4after');console.log(g.run("JSON.stringify({dance:!!WILD.dance,phase:WILD.phase,laser:WILD.laser})"));g.close();})().catch(e=>{console.error(String(e.stack).slice(0,400));process.exit(1)});
