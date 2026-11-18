// CP-72 frames: the real game (UAT 89 + prototype, or UAT 89 as is) in the desktop runtime, the Orange cat's board,
// Level N, the power played through the real button at 30 fps (every 2nd 60 Hz tick).
// Usage: node frames.cjs proto|current level outDir [seed] [extras] [WxH] -> PNG frames + run.json
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const which=process.argv[2]||'proto',level=+(process.argv[3]||3),OUT=path.resolve(process.argv[4]),seed=+(process.argv[5]||7),
 extras=(process.argv[6]||'').split(',').filter(Boolean),[w,h]=(process.argv[7]||'412x915').split('x').map(Number),every=+(process.env.EVERY||2),secs=+(process.env.SECS||9);
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(f.endsWith('.png'))fs.unlinkSync(path.join(OUT,f));
(async()=>{
 const g=await make({sourceFile:path.join(__dirname,'game',which+'.html'),render:true,seed,pixelRatio:1,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t0=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t0();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 g.run("S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return __fe(e);}");
 ticks(140);g.run(`z72DemoRound(${level})`);let k=0;while(g.run('WILD.phase')!=='play'&&k++<1500)g.tick();if(g.run('WILD.phase')!=='play')throw new Error('no play');
 g.run('z72DemoQuiet()');ticks(150);g.run('z72DemoQuiet()');
 extras.forEach((e,i)=>{g.run(`z72DemoAdd('${e}',${110+(i*53)%180},${430+(i*67)%220})`);ticks(20);});if(extras.length)ticks(90);
 const cv=g.c.document.getElementById('cv');const {createCanvas}=require(NAPI),out=createCanvas(w,h),o=out.getContext('2d');let f=0;
 const shot=(name)=>{g.c.draw();o.drawImage(cv,0,0,w,h);fs.writeFileSync(path.join(OUT,name+'.png'),out.toBuffer('image/png'));};
 const count=()=>JSON.parse(g.run("JSON.stringify({coins:S.coins,score:typeof WILD.won==='number'?WILD.won:null,items:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id),n:bodies.filter(b=>!b.dead).length})"));
 const before=count();
 for(let i=0;i<30;i++){g.tick();if(i%every==every-1)shot('f'+String(f++).padStart(4,'0'));}
 const playFrame=f;const ok=g.run('z72DemoPlay()');let t=0;const per=[];
 while(t<secs){g.tick();t+=1/60;const kk=Math.round(t*60);if(kk%every===0){shot('f'+String(f++).padStart(4,'0'));}
  if(kk%15===0)per.push({t:+t.toFixed(2),period:g.run('PUSH_PERIOD'),on:g.run('!!PGPX')});}
 const res={which,level,seed,extras,size:w+'x'+h,ok,before,after:count(),stats:JSON.parse(g.run("JSON.stringify(typeof Z72!=='undefined'?Z72.stats:null)")),errs:JSON.parse(g.run('JSON.stringify(__errs)')),
  frames:f,playFrame,period:per.filter((x,i)=>i%4===0)};
 fs.writeFileSync(path.join(OUT,'run.json'),JSON.stringify(res,null,1));console.log(JSON.stringify(res).slice(0,1500));g.close();})().catch(e=>{console.error(e);process.exit(1);});
