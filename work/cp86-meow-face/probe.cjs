// CP-86 probe on dev.html (UAT 104 + cp86-meow.js): Siamese Sonic meow; counts face draws per phase; stills at 412x915.
const fs=require('fs'),path=require('path'),vm=require('vm');const make=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const file=path.resolve(__dirname,process.argv[2]||'dev.html'),out=path.resolve(__dirname,'probe');fs.mkdirSync(out,{recursive:true});
(async()=>{const g=await make({sourceFile:file,render:true,seed:7,pixelRatio:2,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=1e5;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('siamese');if(WILD.phase==='end')wildReset();wildStartCountdown();");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<240;i++)g.tick();
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers.siamese=1;{const f=wildFinish;wildFinish=function(){if(PGPX)return;return f.apply(this,arguments);};}globalThis.__fd=[];{const d=drawTrackingPupils;drawTrackingPupils=function(){__fd.push([PGPX?PGPX.id:null,+cp86K().toFixed(2)]);return d.apply(this,arguments);};}");
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
 shot('0-before');g.run("(()=>{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");let tt=0;const at={'1-title':.5,'2-meow':1.6,'3-meow':3.5,'4-fading':6.05,'5-after':6.8};const done=new Set();
 for(let i=0;i<8*60;i++){g.tick();tt+=1/60;for(const [n,v] of Object.entries(at))if(!done.has(n)&&tt>=v){done.add(n);shot(n);}}
 const fd=JSON.parse(g.run('JSON.stringify(__fd)'));const by={};for(const [id,k] of fd){const key=id+(k>=1?':full':k>0?':fade':':0');by[key]=(by[key]||0)+1;}
 console.log(JSON.stringify({by,errs:JSON.parse(g.run('JSON.stringify(__errs)')),cat:g.run('CP75_CAT'),art:g.run('!!(CP75_ART.siamese&&CP75_ART.siamese.face)')}));g.close();})().catch(e=>{console.error(e);process.exit(1)});
