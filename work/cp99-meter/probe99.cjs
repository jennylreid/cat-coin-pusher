// CP-98 probe: the Orange's face during Treat toss. Usage: SRC=.. CAT=orange node probe98.cjs outDir w h
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'shots'));fs.mkdirSync(out,{recursive:true});
const CAT=process.env.CAT||'orange',W=+(process.argv[3]||412),H=+(process.argv[4]||915),TAG=process.env.TAG||'';
(async()=>{const sz=W+'x'+H;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:W,height:H,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${CAT}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<200;i++)g.tick();
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;WILD.tossPending={f:null,wait:9};");
 const info={sz,cat:CAT,mode:g.run('WILD.mode'),cp75:g.run('CP75_CAT')};
 for(let i=0;i<40&&!g.run('!!WILD.toss');i++)g.tick();info.toss=g.run('!!WILD.toss');
 if(process.env.HAPPY)g.run("happyUntil=time+6");for(let i=0;i<60;i++)g.tick();info.geo=JSON.parse(g.run("JSON.stringify({H,scale,front:skyScreen(200,T.FRONT,0),frontL:skyScreen(T.L,T.FRONT,0),chin:w43ChinY(),hud:hudLayout(),Y:TOSS_HUD_Y,air:WILD.toss.air.map(o=>{const q=tossPos(o);return [Math.round(q.x),Math.round(q.y)]})})"));
 if(process.env.TRACK){let ys=[],xs=[];for(let i=0;i<60*14&&g.run('!!WILD.toss');i++){g.tick();const a=JSON.parse(g.run("JSON.stringify(!WILD.toss?[]:WILD.toss.air.filter(o=>o.state==='air').map(o=>{const q=tossPos(o);return [q.x,q.y]}))"));for(const [x,y] of a){xs.push(x);ys.push(y);}}ys.sort((a,b)=>a-b);const pc=q=>Math.round(ys[Math.floor(q*(ys.length-1))]);info.track={n:ys.length,y:[pc(0),pc(.05),pc(.5),pc(.95),pc(1)],x:[Math.round(Math.min(...xs)),Math.round(Math.max(...xs))]};}
 g.c.draw();fs.writeFileSync(path.join(out,`${TAG}${CAT}-meter-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));
 info.errs=JSON.parse(g.run('JSON.stringify(__errs)'));console.log(JSON.stringify(info));g.close();})().catch(e=>{console.error(e);process.exit(1)});
