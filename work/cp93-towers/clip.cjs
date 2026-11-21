// CP-93 tower rework, step 1: record today's tower behaviour in the real game (napi-canvas render, no publishing).
// A bot drops 2 coins a stroke (as a player tapping steadily); optional Quake at QUAKE seconds; logs every tower's position.
// Usage: MODE=level:6|lab:giant SRC=../cp134-bundle/release.html DUR=20 MP4=out.mp4 STRIP=0,1,2 OUT=dir TAG=name QUAKE=12 node clip.cjs
//   LIST=1: print the towers on levels 1-10 and exit. PATCH=file.js: a prototype block appended before the last </script>.
const fs=require('fs'),path=require('path'),vm=require('vm'),os=require('os'),{execFileSync}=require('child_process');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const FF='C:/Users/jenny/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe';
let src=path.resolve(__dirname,process.env.SRC||'../cp134-bundle/release.html');const OUT=path.resolve(__dirname,process.env.OUT||'shots');fs.mkdirSync(OUT,{recursive:true});
if(process.env.PATCH){let h=fs.readFileSync(src,'utf8');const i=h.lastIndexOf('</script>');h=h.slice(0,i)+process.env.PATCH.split(',').map(f=>fs.readFileSync(path.resolve(__dirname,f),'utf8')).join('\n')+'\n'+h.slice(i);
 src=path.join(__dirname,'_patched-'+process.pid+'.html');fs.writeFileSync(src,h);}
const WD=+(process.env.W||412),HT=+(process.env.H||915),DUR=+(process.env.DUR||20),MODE=process.env.MODE||'level:6',TAG=process.env.TAG||MODE.replace(':','');
const STRIP=(process.env.STRIP||'').split(',').filter(Boolean).map(Number),MP4=process.env.MP4,QUAKE=process.env.QUAKE?+process.env.QUAKE:null,DROPS=process.env.DROPS!=='0';
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'cp93t-'));
(async()=>{const g=await make33({sourceFile:src,render:!!(MP4||STRIP.length),seed:+(process.env.SEED||7),pixelRatio:1,width:WD,height:HT,storage:{'catpusher.uat.devdefault.v1':'1'}});
 if(MP4||STRIP.length)g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;");const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 const start=m=>{const [k,v]=m.split(':');
  if(k==='level')g.run(`PG.lv.passed=Math.max(PG.lv.passed,${+v-1});PG.lv.sel=${+v};pgPlay('tuxedo');wildReset();wildStartCountdown();`);
  else g.run(`CP93.seed=${+(process.env.TSEED||1)*7919};labStart('${v}')`);
  let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();};
 const towers=()=>JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead&&b.kind==='stack').map(b=>{const p=b.rb.translation(),u=qrot(b.rb.rotation(),{x:0,y:1,z:0});return {id:b.uid,n:b.n,x:+(p.x/M).toFixed(1),z:+(p.z/M).toFixed(1),y:+(p.y/M).toFixed(1),tilt:+(Math.acos(Math.min(1,u.y))*180/Math.PI).toFixed(1),seg:b.cp93Seg??null,g:b.cp93??null,sleep:b.rb.isSleeping()}}))"));
 if(process.env.LIST){for(let L=1;L<=10;L++){start('level:'+L);const tw=towers();console.log('level',L,tw.length,'towers',tw.map(t=>t.n+'@'+t.x+','+t.z).join(' '));g.run('wildExit&&0');}process.exit(0);}
 if(process.env.TP)g.run(`CP93P.set('${process.env.TP}')`);
 if(process.env.CFG)g.run(`Object.assign(CP93P.cfg,${process.env.CFG})`);
 start(MODE);
 const png=fn=>{g.c.draw();fs.writeFileSync(fn,g.c.document.getElementById('cv').toBuffer('image/png'));};
 g.run("CP93T={breaks:[]};{const b0=breakStack;breakStack=function(b){if(b&&!b.dead)CP93T.breaks.push({t:+time.toFixed(2),n:b.n,uid:b.uid,g:b.cp93??null});return b0(b);};}CP93T.lets=[];if(typeof cp93Let==='function'){const l0=cp93Let;cp93Let=function(gi,tip,why){if(CP93.tw&&CP93.tw[gi]&&!CP93.tw[gi].tipped)CP93T.lets.push({t:+time.toFixed(2),g:gi,why});return l0.apply(this,arguments);};}");
 const track={},xs=(process.env.XS||'150,250,200,120,280').split(',').map(Number);let f=0,lastPh=0,inStroke=0,nextOk=0,drops=0,quaked=false;
 for(let tick=0;tick<=DUR*60;tick++){const sec=tick/60;
  if(QUAKE!=null&&!quaked&&sec>=QUAKE){g.run("board.quakes=Math.max(1,board.quakes);useCatquake()");quaked=true;console.log('quake at',sec);}
  if(STRIP.some(s=>Math.abs(s*60-tick)<.5))png(path.join(OUT,`${TAG}-t${sec.toFixed(1).padStart(4,'0')}.png`));
  if(MP4&&tick%2===0){g.c.draw();fs.writeFileSync(path.join(tmp,`o${String(f++).padStart(5,'0')}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}
  if(DROPS&&g.run("WILD.phase==='play'")){const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<lastPh)inStroke=0;lastPh=ph;
   if(inStroke<(+process.env.PER||2)&&tick>=nextOk){const r0=+g.run('board.released');g.run(`tryDrop({x:${xs[drops%xs.length]},y:DROP_Y})`);if(+g.run('board.released')>r0){drops++;inStroke++;nextOk=tick+17;}}}
  if(tick%3===0)for(const w of towers()){(track[w.id]=track[w.id]||{n:w.n,seg:w.seg,g:w.g,pts:[]}).pts.push([+sec.toFixed(2),w.x,w.z,w.tilt]);}
  g.tick();}
 if(MP4)execFileSync(FF,['-y','-loglevel','error','-framerate','30','-i',path.join(tmp,'o%05d.png'),'-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p','-crf','23',path.resolve(OUT,MP4)]);
 // sloshing: for each standing stretch, how far the tower travelled back and forth vs where it ended up, and how often it reversed
 const sum=Object.entries(track).map(([id,o])=>{const p=o.pts;let path=0,rev=0,last=0;for(let i=1;i<p.length;i++){const dz=p[i][2]-p[i-1][2],dx=p[i][1]-p[i-1][1];path+=Math.hypot(dx,dz);
   if(Math.abs(dz)>.05){const s=Math.sign(dz);if(last&&s!==last)rev++;last=s;}}
  const net=Math.hypot(p.at(-1)[1]-p[0][1],p.at(-1)[2]-p[0][2]);return {id:+id,n:o.n,g:o.g,seg:o.seg,secs:+(p.at(-1)[0]-p[0][0]).toFixed(1),path:+path.toFixed(1),net:+net.toFixed(1),reversals:rev,maxTilt:Math.max(...p.map(q=>q[3]))};});
 const res={tp:JSON.parse(g.run("JSON.stringify(typeof CP93P!=='undefined'?{m:CP93P.get(),shelf:!!CP93.shelf,heavy:!!CP93.heavy,z:(CP93.tw||[]).map(t=>Math.round(t.z0||0))}:null)")),mode:MODE,src:path.basename(process.env.SRC||'cp134'),patch:process.env.PATCH||null,dur:DUR,drops,quake:QUAKE,breaks:JSON.parse(g.run('JSON.stringify(CP93T.breaks)')),lets:JSON.parse(g.run('JSON.stringify(CP93T.lets)')),stats:JSON.parse(g.run('JSON.stringify(CP93.stats||null)')),left:JSON.parse(g.run('JSON.stringify(LAB.st||null)')),towers:sum};
 fs.writeFileSync(path.join(OUT,TAG+'.json'),JSON.stringify({...res,track},null,0));console.log(JSON.stringify(res));fs.rmSync(tmp,{recursive:true,force:true});
 if(process.env.PATCH)fs.rmSync(src,{force:true});})().catch(e=>{console.error(e);process.exit(1)});
