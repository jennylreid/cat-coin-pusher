// CP-73 UAT 90 stills: Formal inspection in the real game (Developer off), Level 3, at the intro word, the lens beam with
// "HMM.", and the sweep with "SPLENDID.". Usage: node shots73.cjs [sizes] -> tickets/CP-73-evidence/uat90/inspect-*-<size>.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.join(__dirname,process.env.SRC||'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-73-evidence/uat90');fs.mkdirSync(OUT,{recursive:true});
const tag=process.env.TAG||'';const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("pglLv().passed=2;pglLv().sel=3;pgSave();if(WILD.phase==='card')wildReset();");ticks(10);g.c.draw();
 const pl=J(g,'PGA.L.play');tap(pl.x+pl.w/2,pl.y+pl.h/2);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<600;i++){if(i%30==0)tap(200+100*Math.sin(i/40),560);g.tick();}
 await new Promise(r=>setTimeout(r,400));g.run("WILD.nextBonus=999;WILD.left=60;PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,`inspect${tag}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const at=s=>{let n=0;while(!(g.run('CP63X&&CP63X.t')>=s)&&n++<600)g.tick();};
 at(.25);shot('1-intro-word');at(1.2);shot('2-beam-hmm');at(3.1);shot('3-sweep-splendid');
 info.push({sz,errs:J(g,'__errs')});g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
