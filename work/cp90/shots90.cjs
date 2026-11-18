// CP-71 UAT 90 coin-knock stills in the real game (work/cp85/release.html, Developer off), Level 3 round: only toys in reach (no food):
// the mitt rummages on the top coins, flicks them back over the rear edge, and they drop behind the table.
// Usage: node shots85.cjs [sizes] -> tickets/CP-71-evidence/uat90/beat-*-<size>.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.join(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-71-evidence/uat90');fs.mkdirSync(OUT,{recursive:true});
const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("pglLv().passed=2;pglLv().sel=3;pgSave();if(WILD.phase==='card')wildReset();");ticks(10);g.c.draw();
 const pl=J(g,'PGA.L.play');tap(pl.x+pl.w/2,pl.y+pl.h/2);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<600;i++){if(i%30==0)tap(200+100*Math.sin(i/40),560);g.tick();}
 await new Promise(r=>setTimeout(r,400));
 g.run("WILD.nextBonus=999;WILD.left=60;for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;"+
  "addCoin('item','sock',150,40,690,yawTurn(0));addCoin('item','box',290,40,600,yawTurn(0));");ticks(60);
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,`beat-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const at=s=>{while(!(g.run('W2_YAWN&&W2_YAWN.t')>=s))g.tick();};
 at(2.6);shot('1-rummage');at(2.95);shot('2-flick');at(3.2);shot('3-coins-flying-back');const grabs=J(g,'W2_YAWN.grabs.map(x=>x.id)');
 while(g.run('!!W2_YAWN'))g.tick();ticks(60);shot('4-after');
 info.push({sz,grabs,stats:J(g,'CP71.stats'),errs:J(g,'__errs')});g.close();}
 console.log(JSON.stringify(info));fs.writeFileSync(path.join(OUT,'beats.json'),JSON.stringify(info,null,1));})().catch(e=>{console.error(e);process.exit(1)});
