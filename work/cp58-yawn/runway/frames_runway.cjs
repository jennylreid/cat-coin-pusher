// CP-58 prototype frames: the real game (UAT 74 + prototype) in the desktop runtime, Level N, the moment played at 30 fps.
// Usage: node frames.cjs [level] [outDir] -> PNG frames (412x915) + beats.json
const {game}=require('../../cp43/harness.cjs'),{strictAudio}=require('../../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const {createCanvas}=require(NAPI);
const level=+(process.argv[2]||3),OUT=path.resolve(process.argv[3]||path.join(__dirname,'out','frames-L'+level));fs.mkdirSync(OUT,{recursive:true});
for(const f of fs.readdirSync(OUT))if(f.endsWith('.png'))fs.unlinkSync(path.join(OUT,f));
(async()=>{
 const g=await game({src:path.join(__dirname,'..','game',process.argv[4]||'proto.html'),seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);
 g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return __fe(e);}');
 g.ticks(140);g.run(`const L=pglLv();L.passed=${level-1};L.sel=${level};`);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);
 g.run(`cp58DemoRound(${level})`);if(!g.until('WILD.phase==="play"',1500))throw new Error('no play '+g.run('WILD.phase'));
 g.ticks(150);// let the board settle
 const cv=g.c.document.getElementById('cv'),out=createCanvas(412,915),o=out.getContext('2d');
 const shot=(name)=>{g.c.draw();o.drawImage(cv,0,0,412,915);fs.writeFileSync(path.join(OUT,name+'.png'),out.toBuffer('image/png'));};
 // a second of normal play before, then the moment
 let f=0;for(let i=0;i<30;i++){g.tick();if(i%2)shot('f'+String(f++).padStart(4,'0'));}
 console.log('grabs',g.run('cp58DemoPlay()'),g.run('JSON.stringify(W2_YAWN.grabs.map(x=>x.id))'));
 const beats=[];let t=0;
 while(g.run('!!W2_YAWN')||t<6.2){g.tick();t+=1/60;if(Math.round(t*60)%2===0)shot('f'+String(f++).padStart(4,'0'));
  if(t>8)break;}
 console.log('state',g.run('JSON.stringify(cp58DemoState())'),'errs',g.run('JSON.stringify(__errs)'));
 g.close();})().catch(e=>{console.error(e);process.exit(1);});
