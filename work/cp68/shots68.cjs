// CP-51 real-game screenshots at the four phone sizes (Developer off): the round's top bar with the Pause button (and
// with TURBO showing), the Pause pop-up, How to play, and the end card after FINISH ROUND. Usage: node shots68.cjs SRC OUTDIR TAG
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]),OUT=path.resolve(process.argv[3]),TAG=process.argv[4]||'shot';fs.mkdirSync(OUT,{recursive:true});
const sizes=(process.argv[5]||'360x640,360x780,393x852,412x915').split(',').map(s=>s.split('x').map(Number));
async function game(o){const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,storage:{'catpusher.uat.devdefault.v1':'1'},...o});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const info=[];const has51=s=>s.includes('cp68');
(async()=>{for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await game({width:w,height:h});g.run('S.dev=false;S.muted=false');g.ticks(150);g.tap(200,700);g.ticks(40);
 g.run("pglLv().passed=5;pglLv().sel=6;pgSave();if(WILD.phase==='card')wildReset();");g.ticks(10);g.c.draw();
 const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);g.until("WILD.phase==='play'",900);g.ticks(90);
 shot(g,`${TAG}-round-${sz}`);
 if(!has51(src)){info.push({sz,errs:J(g,'__errs')});continue;}
 g.run('WILD.turbo=9');g.c.draw();shot(g,`${TAG}-round-turbo-${sz}`);g.run('WILD.turbo=0');
 const b=J(g,'cp51Btn()');g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(5);shot(g,`${TAG}-pause-${sz}`);
 const R=J(g,'cp51Rects()'),hud=J(g,'hudLayout()');
 g.tap(R.help.x+5,R.help.y+5);g.ticks(5);shot(g,`${TAG}-howto-${sz}`);g.tap(200,400);
 g.run("{const id=WILD_COLLECTION[0];const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)removeCoin(b);WILD.have[id]=true;WILD.got=1;}");
 g.tap(R.finish.x+20,R.finish.y+10);g.ticks(120);shot(g,`${TAG}-finish-${sz}`);
 info.push({sz,button:b,card:R.card,headerBottom:hud.headerBottom,bottomY:hud.bottomY,fits:R.card.y>=hud.headerBottom&&R.card.y+R.card.h<=hud.bottomY,errs:J(g,'__errs')});}
 fs.writeFileSync(path.join(OUT,TAG+'-shots.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));
})().catch(e=>{console.error(e);process.exit(1)});
