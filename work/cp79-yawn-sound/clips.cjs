// CP-79 Step 1 clips: the real game's wheel Yawn (work/cp95/release.html = published UAT 95, Tuxedo board, Level 1,
// Developer off) at 412x915, 30 fps, from 0.5 s before the Yawn until the yawn part is over (Yawn t = 2.6 s), then the
// audio for each version laid in at the moment the game plays its yawn sound (cp58StartYawn -> sfx.wild2('yawn')).
// One mp4 per version: tickets/CP-79-evidence/yawn-sound-{A,B,C,today}.mp4. Usage: node clips.cjs
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),{execFileSync}=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,'../cp95/release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-79-evidence'),FR=path.join(__dirname,'frames');
fs.mkdirSync(OUT,{recursive:true});fs.rmSync(FR,{recursive:true,force:true});fs.mkdirSync(FR);
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:1,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('tuxedo');");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){if(g.run("WILD.phase")==='card'){g.c.draw();const pl=J(g,'(typeof PGA==="object"&&PGA.L&&PGA.L.play)||null');if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2);}g.tick();}
 ticks(240);for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));}
 g.run('WILD.nextBonus=999;WILD.left=60;');
 g.run("globalThis.__yawnAt=-1;{const w=sfx.wild2;sfx.wild2=function(k,...a){if(k==='yawn'&&__yawnAt<0)__yawnAt=__tick;return w.call(this,k,...a)};}globalThis.__tick=0;");
 let n=0,f=0;const grab=()=>{g.c.draw();fs.writeFileSync(path.join(FR,`f${String(f++).padStart(4,'0')}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const step=()=>{g.tick();n++;g.run('__tick++');if(n%2===0)grab();};
 for(let i=0;i<30;i++)step(); // 0.5 s before
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 let m=0;while(!(g.run('W2_YAWN&&W2_YAWN.t')>=2.6)&&m++<1000)step();
 const yawnTick=g.run('__yawnAt'),errs=J(g,'__errs');g.close();
 const offset=(yawnTick-1)/60; // the sound starts on the tick the game plays it (frames are every 2nd tick from tick 1)
 const A=path.join(__dirname,'audio'),info={frames:f,fps:30,yawnSoundAt:+offset.toFixed(3),errs,clips:{}};
 for(const v of ['A','B','C','today']){const o=path.join(OUT,`yawn-sound-${v}.mp4`);
  execFileSync('ffmpeg',['-v','error','-y','-framerate','30','-i',path.join(FR,'f%04d.png'),'-i',path.join(A,`yawn-sound-${v}.wav`),
   '-filter_complex',`[0:v]pad=412:916:0:0,format=yuv420p[v];[1:a]adelay=${Math.round(offset*1000)}:all=1,apad[a]`,'-map','[v]','-map','[a]','-shortest',
   '-c:v','libx264','-crf','20','-preset','medium','-c:a','aac','-b:a','160k','-movflags','+faststart',o]);info.clips[v]=path.basename(o);}
 fs.writeFileSync(path.join(OUT,'clips-info.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));
})().catch(e=>{console.error(e);process.exit(1)});
