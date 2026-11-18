// CP-63 prototype frames: the real game (UAT 81 + prototype) in the desktop runtime, Level N, the power played through
// the real button at 30 fps. Usage: node frames.cjs level outDir [seed] [extras] -> PNG frames (412x915) + run.json
// extras: comma list of pieces dropped on top before playing (e.g. rain5,rain10,quake) for a richer board.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const {createCanvas}=require(NAPI);
const level=+(process.argv[2]||1),OUT=path.resolve(process.argv[3]),seed=+(process.argv[4]||7),extras=(process.argv[5]||'').split(',').filter(Boolean);
fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))if(f.endsWith('.png'))fs.unlinkSync(path.join(OUT,f));
(async()=>{
 const g=await game({src:path.join(__dirname,'game','proto.html'),seed,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);
 g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return __fe(e);}');
 g.ticks(140);g.run(`const L=pglLv();L.passed=${level-1};L.sel=${level};`);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);
 g.run(`cp63DemoRound(${level})`);if(!g.until('WILD.phase==="play"',1500))throw new Error('no play '+g.run('WILD.phase'));
 g.ticks(150);g.run('WILD.nextBonus=999');if(process.env.EDGE==='0')g.run('CP63.offEdge=false');
 extras.forEach((k,i)=>{g.run(`cp63DemoAdd('${k}',${110+i*45%180},${470+(i*67)%200})`);g.ticks(20);});if(extras.length)g.ticks(90);
 const cv=g.c.document.getElementById('cv'),out=createCanvas(412,915),o=out.getContext('2d');
 const shot=(name)=>{g.c.draw();o.drawImage(cv,0,0,412,915);fs.writeFileSync(path.join(OUT,name+'.png'),out.toBuffer('image/png'));};
 let f=0;for(let i=0;i<30;i++){g.tick();if(i%2)shot('f'+String(f++).padStart(4,'0'));}
 const before=g.run('JSON.stringify(cp63Pick().map(b=>b.id||b.kind))');
 const ok=g.run('cp63DemoPlay()');const picks=g.run('JSON.stringify(CP63X&&CP63X.picks.map(o=>o.id))');console.log('play',ok,picks);
 let t=0;const beats=[];
 while(t<6.5){g.tick();t+=1/60;const k=Math.round(t*60);if(k%2===0)shot('f'+String(f++).padStart(4,'0'));}
 const res={level,seed,extras,before:JSON.parse(before),picks:JSON.parse(picks),stats:JSON.parse(g.run('JSON.stringify(CP63.stats)')),errs:JSON.parse(g.run('JSON.stringify(__errs)')),
  powers:g.run('pgpCount()'),frames:f,playFrame:15};
 fs.writeFileSync(path.join(OUT,'run.json'),JSON.stringify(res,null,1));console.log(JSON.stringify(res));
 g.close();})().catch(e=>{console.error(e);process.exit(1);});
