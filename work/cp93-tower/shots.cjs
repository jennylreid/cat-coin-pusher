// CP-93 stills + optional mp4 of the Giant towers board in the real game (napi-canvas render). A bot drops 2 coins a stroke
// spread across the deck. Usage: W=412 H=915 DUR=30 SHOTS=0,8,16 MP4=out.mp4 OUT=dir node shots.cjs
const fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync}=require('child_process');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const FF='C:/Users/jenny/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
const src=path.resolve(__dirname,process.env.SRC||'release.html'),OUT=path.resolve(process.env.OUT||'shots');fs.mkdirSync(OUT,{recursive:true});
const WD=+(process.env.W||412),HT=+(process.env.H||915),DUR=+(process.env.DUR||20),SHOTS=(process.env.SHOTS||'0').split(',').map(Number),MP4=process.env.MP4,TAG=process.env.TAG||(WD+'x'+HT),BOARD=process.env.B||'giant',DROPS=process.env.DROPS!=='0';
const tmp=fs.mkdtempSync(path.join(require('os').tmpdir(),'cp93-'));
(async()=>{const g=await make33({sourceFile:src,render:true,seed:+(process.env.SEED||7),pixelRatio:1,width:WD,height:HT,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;");const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 g.run(`CP93.seed=${+(process.env.TSEED||1)*7919};labStart('${BOARD}')`);let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();
 const png=fn=>{g.c.draw();fs.writeFileSync(fn,g.c.document.getElementById('cv').toBuffer('image/png'));};
 const info=()=>JSON.parse(g.run("JSON.stringify({py:Math.round(pusherY),base:bodies.filter(b=>!b.dead&&b.cp93Seg===0).map(b=>Math.round(b.rb.translation().z/M)),tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).map(b=>Math.round(b.rb.translation().y/M)),deck:bodies.filter(b=>!b.dead&&b.kind!=='stack'&&b.rb.translation().z/M<PUSH_MIN).length,stats:CP93.stats,got:LAB.st.got,segs:bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null).length,bodies:bodies.length,phase:WILD.phase,step:perf.step})"));
 console.log('start',JSON.stringify(info()));
 let autoAt=-1,tick=0,f=0,lastPh=0,inStroke=0,nextOk=0,drops=0;const xs=[150,250,200,120,280];const log=[];g.run('CP93.when=[];{const b0=breakStack;breakStack=function(b){if(b&&b.cp93!=null)CP93.when.push(+time.toFixed(2));return b0(b);};}');
 for(;tick<=DUR*60;tick++){const sec=tick/60;
  if(process.env.AUTO&&autoAt<0&&+g.run('(CP93.tw||[]).filter(t=>t.tipped).length')>0){autoAt=tick;console.log('first let go at',(tick/60).toFixed(1));}
  if(autoAt>=0&&[18,48,90,150].includes(tick-autoAt))png(path.join(OUT,`${TAG}-spill+${((tick-autoAt)/60).toFixed(1)}s.png`));
  if(process.env.STOPAFTER&&autoAt>=0&&tick-autoAt>+process.env.STOPAFTER*60)break;
  if(SHOTS.some(s=>Math.abs(s*60-tick)<.5))png(path.join(OUT,`${TAG}-t${String(Math.round(sec)).padStart(2,'0')}.png`));
  if(MP4&&tick%2===0){g.c.draw();fs.writeFileSync(path.join(tmp,`o${String(f++).padStart(5,'0')}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}
  if(DROPS&&g.run("WILD.phase==='play'")){const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<lastPh)inStroke=0;lastPh=ph;
   if(inStroke<2&&tick>=nextOk){const r0=+g.run('board.released');g.run(`tryDrop({x:${xs[drops%xs.length]},y:DROP_Y})`);if(+g.run('board.released')>r0){drops++;inStroke++;nextOk=tick+17;}}}
  if(tick%300===0)log.push({sec,...info()});
  g.tick();}
 if(MP4)execFileSync(FF,['-y','-loglevel','error','-framerate','30','-i',path.join(tmp,'o%05d.png'),'-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p','-crf','23',path.resolve(MP4)]);
 for(const l of log)console.log(JSON.stringify(l));console.log('drops',drops);fs.rmSync(tmp,{recursive:true,force:true});})().catch(e=>{console.error(e);process.exit(1)});
