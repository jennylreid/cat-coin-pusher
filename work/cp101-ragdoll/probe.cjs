// CP-94 probe: stills of a Dance break on a cat's board. Usage: SRC=.. CAT=tuxedo node probe.cjs [outDir] [w h]
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
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<300;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;"+(process.env.FORCE||'')+"WILD.dancePending={f:null,wait:9};");
 const info={sz,cat:CAT,mode:g.run('WILD.mode'),feat:g.run("wildFeature('dance')")};
 for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
 info.started=g.run('!!WILD.dance');
 if(info.started){info.D=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,beat:WILD.dance.beat,move:WILD.dance.move,per:WILD.dance.per||1})'));
  const at=(process.env.AT||'-1,0.5,1,1.5,2,4.25,5,6,7,8.5,9,10').split(',').map(Number);
  for(const x of at){let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<x&&j++<2000){if(process.env.TAPS)g.run('(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat,k=Math.round(x);if(Math.abs(x-k)<.02&&!D.judged[k]&&!(D.rest&&D.rest[k]))danceTap({timeStamp:performance.now()+D.latency*1000})})()');g.tick();}
   g.c.draw();fs.writeFileSync(path.join(out,`${TAG}${CAT}-x${x}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}}
 info.errs=JSON.parse(g.run('JSON.stringify(__errs)'));console.log(JSON.stringify(info));g.close();})().catch(e=>{console.error(e);process.exit(1)});
