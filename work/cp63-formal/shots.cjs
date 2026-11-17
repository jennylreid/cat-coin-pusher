// CP-63 small-screen stills: the prototype in the real game at phone sizes (Developer off), Level N, at three beats.
// Usage: node shots.cjs [sizes] [level] [extras] -> tickets/CP-63-evidence/small-*.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.join(__dirname,'game','proto.html'),OUT=path.resolve(__dirname,'../../tickets/CP-63-evidence');
const sizes=(process.argv[2]||'360x640,360x780').split(',').map(s=>s.split('x').map(Number)),level=+(process.argv[3]||3),extras=(process.argv[4]||'').split(',').filter(Boolean);
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(140);g.run(`const L=pglLv();L.passed=${level-1};L.sel=${level};PGU.title.t=9;pgTitleDone()`);ticks(30);
 g.run(`cp63DemoRound(${level})`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<1500)g.tick();ticks(150);g.run('WILD.nextBonus=999');
 extras.forEach((e,i)=>{g.run(`cp63DemoAdd('${e}',${110+i*45%180},${470+(i*67)%200})`);ticks(20);});if(extras.length)ticks(90);
 g.run('cp63DemoPlay()');
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,`small-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const at=s=>{while(g.run('CP63X')&&!(g.run('CP63X.t')>=s))g.tick();};
 at(1.6);shot('1-inspect');at(2.5);shot('2-cane');at(3.05);shot('3-sweep');
 info.push({sz,errs:JSON.parse(g.run('JSON.stringify(__errs)'))});g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
