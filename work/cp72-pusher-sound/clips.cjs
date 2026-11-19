// CP-72 add-on (Zoomies pusher sound) clips: the real game's Zoomies (work/cp97/release.html = published UAT 97, Orange board,
// Level 1, Developer off) at 412x915, 30 fps, from 0.4 s before the power tap, through the "ZOOMIES!" title and the 7 s of
// double-speed pusher, to 0.6 s after. Each version's audio starts when the game plays its turbo rev (z72Start ->
// sfx.wild('turbo')). One mp4 per version: tickets/CP-72-evidence/zoomies-sound/zoomies-sound-<v>.mp4.
// Usage: node clips.cjs [P1,P2,P3,today]
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),{execFileSync}=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,'../cp97/release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-72-evidence/zoomies-sound'),FR=path.join(__dirname,'frames');
fs.mkdirSync(OUT,{recursive:true});fs.rmSync(FR,{recursive:true,force:true});fs.mkdirSync(FR);
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:1,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 ticks(240);for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));}
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=1;globalThis.__tick=0;globalThis.__turboAt=-1;{const w=sfx.wild;sfx.wild=function(k,...a){if(k==='turbo'&&__turboAt<0&&typeof Z72X!=='undefined'&&Z72X)__turboAt=__tick;return w.call(this,k,...a)};}");
 let n=0,f=0;const grab=()=>{g.c.draw();fs.writeFileSync(path.join(FR,`f${String(f++).padStart(4,'0')}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const step=()=>{g.tick();n++;g.run('__tick++');if(n%2===0)grab();};
 for(let i=0;i<24;i++)step(); // 0.4 s before the tap
 g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");
 let m=0;while(g.run('!!PGPX')&&m++<60*14)step();for(let i=0;i<36;i++)step(); // until the power ends, then 0.6 s
 const turboTick=g.run('__turboAt'),errs=J(g,'__errs');g.close();
 const offset=(turboTick-1)/60,A=path.join(__dirname,'audio'),info={frames:f,fps:30,soundAt:+offset.toFixed(3),errs,clips:{}};
 for(const v of (process.argv[2]||'P1,P2,P3,today').split(',')){const o=path.join(OUT,`zoomies-sound-${v}.mp4`);
  execFileSync('ffmpeg',['-v','error','-y','-framerate','30','-i',path.join(FR,'f%04d.png'),'-i',path.join(A,`zoomies-sound-${v}.wav`),
   '-filter_complex',`[0:v]pad=412:916:0:0,format=yuv420p[v];[1:a]adelay=${Math.round(offset*1000)}:all=1,apad[a]`,'-map','[v]','-map','[a]','-shortest',
   '-c:v','libx264','-crf','22','-preset','medium','-c:a','aac','-b:a','160k','-movflags','+faststart',o]);info.clips[v]=path.basename(o);}
 fs.rmSync(FR,{recursive:true,force:true});
 fs.writeFileSync(path.join(OUT,'clips-info.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));
})().catch(e=>{console.error(e);process.exit(1)});
