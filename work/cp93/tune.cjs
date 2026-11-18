// Tuning only: renders Formal inspection on SRC (default ../cp92/release.html) with an optional extra script (EXTRA) run
// before the tap, and saves frames at a few power times to OUT (scratch). Prints the mitt and cane points per frame.
const make33=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,process.env.SRC||'../cp92/release.html'),out=process.env.OUT,extra=process.env.EXTRA?fs.readFileSync(process.env.EXTRA,'utf8'):'';
const times=(process.env.TIMES||'3.4,3.8,4.6,5.2').split(',').map(Number);
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
(async()=>{for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("pglLv().passed=2;pglLv().sel=3;pgSave();if(WILD.phase==='card')wildReset();");ticks(10);g.c.draw();
 const pl=J(g,'PGA.L.play');tap(pl.x+pl.w/2,pl.y+pl.h/2);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<600;i++){if(i%30==0)tap(200+100*Math.sin(i/40),560);g.tick();}
 await new Promise(r=>setTimeout(r,400));
 if(extra)g.run(extra);
 g.run("WILD.nextBonus=999;WILD.left=60;PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");
 const taken=new Set();
 for(let i=0;i<9*60&&g.run('!!(PGPX&&PGPX.id==="inspect")');i++){g.tick();const p=+g.run('PGPX?PGPX.t:-1');
  for(const at of times)if(!taken.has(at)&&p>=at){taken.add(at);g.c.draw();fs.writeFileSync(path.join(out,`f${at}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));
   console.log(sz,at,JSON.stringify(J(g,"(()=>{const t=CP63X.t,M=cp63Mitt(1,t),B=cp63Crook(t);return {t:+t.toFixed(2),M,B}})()")));}}
 console.log(sz,'errs',J(g,'__errs'));g.close();}})().catch(e=>{console.error(e);process.exit(1)});
