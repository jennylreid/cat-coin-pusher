// UAT 30 phone-size desktop renders of the real runtime (real payouts, defaults unless stated):
// CP-33: prize pickup real time + 4x slow, held frame with the backdrop, two prizes together, backdrop default vs stronger.
// CP-34: Quake coin real time + 4x slow, held frame with the backdrop, button landing frame.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{spawn,execFileSync}=require('child_process'),{once}=require('events');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat30'),OUT34=path.resolve(__dirname,'../../tickets/CP-34-evidence/uat30');
for(const d of [OUT,OUT34])fs.mkdirSync(d,{recursive:true});
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function game(seed){const g=await make({sourceFile:SRC,render:true,height:888.889,seed});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
async function encode(frames,fps,file){
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-vf','scale=800:1778:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-crf','22',file],{stdio:['pipe','ignore','inherit'],windowsHide:true});
 const done=once(ff,'exit');for(const b of frames)if(!ff.stdin.write(b))await once(ff.stdin,'drain');ff.stdin.end();if((await done)[0])throw Error('ffmpeg '+file);
}
const deg=r=>+(r*180/Math.PI).toFixed(1);
const info=f=>({kind:f.kind,prize:f.id,turnDeg:deg(f.rot),offCentrePx:{x:+(f.mx-200).toFixed(1),y:+(f.my-462.2).toFixed(1)},heldSec:f.tm,shortened:f.short});
async function warm(seed,board=0){const g=await game(seed);const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run(`selectBoard(${board});S.dev=false;S.coins=200;board.status="playing";`);
 for(let i=0;i<90;i++){if(i%12===0)a.tryDrop({x:150+i});g.tick();}return {g,run,a};}
const push=(run,kind,id,x)=>run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='${kind}'&&(${kind==='quake'}||b.id==='${id}'));b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
(async()=>{
 const out={render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime and real payouts, defaults unless stated'};
 // CP-33 1. One prize: real time and 4x slow; held frame.
 {const {g,run,a}=await warm(7);const frames=[];for(let i=0;i<20;i++){g.tick();frames.push(png(g));}
  push(run,'item','cheese',118);let f=null,held=false;
  for(let i=0;i<100;i++){g.tick();f=f||a.treatAwards[0];const fr=png(g);frames.push(fr);if(!held&&f&&f.t>=f.tr+.25){held=true;fs.writeFileSync(path.join(OUT,'prize-held-backdrop.png'),fr);}}
  await encode(frames,60,path.join(OUT,'prize-realtime.mp4'));await encode(frames,15,path.join(OUT,'prize-4x-slow.mp4'));out.prize=info(f);g.close();}
 // CP-33 2. Two prizes collected together (same frame): they take turns; the backdrop stays up between them.
 {const {g,run,a}=await warm(8);const frames=[];for(let i=0;i<15;i++){g.tick();frames.push(png(g));}
  push(run,'item','cheese',140);push(run,'item','shrimp',260);g.tick();frames.push(png(g));const [f1,f2]=a.treatAwards;out.together=[info(f1),info(f2)];let mid=false;
  for(let i=0;i<150;i++){g.tick();const fr=png(g);frames.push(fr);if(!mid&&f2.t>=.05){mid=true;fs.writeFileSync(path.join(OUT,'together-between-turns.png'),fr);}}
  await encode(frames,60,path.join(OUT,'two-together-realtime.mp4'));g.close();}
 // CP-33 3. Backdrop at the default (Fade 0.35, Stripes 0.5) and stronger (Fade 0.6, Stripes 1.0): same pickup, same moment.
 for(const [name,fade,stripes] of [['default',.35,.5],['stronger',.6,1]]){const {g,a}=await warm(9);a.pickupFx.fade=fade;a.pickupFx.stripes=stripes;
  const f=a.queueTreatAward('tuna',200,null,true);while(f.t<f.tr+.25)g.tick();fs.writeFileSync(path.join(OUT,`backdrop-${name}.png`),png(g));out['backdrop_'+name]={fade,stripes,...info(f)};g.close();}
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(OUT,'backdrop-default.png'),'-i',path.join(OUT,'backdrop-stronger.png'),'-filter_complex','hstack=2',path.join(OUT,'backdrop-compared.png')]);
 // CP-34. Quake coin on Board 3: real time and 4x slow; held frame; landing frame.
 {const {g,run,a}=await warm(7,2);const frames=[];for(let i=0;i<15;i++){g.tick();frames.push(png(g));}
  push(run,'quake','quake',230);let f=null,held=false,landed=false;
  for(let i=0;i<120;i++){g.tick();f=f||a.treatAwards.find(x=>x.kind==='quake');const fr=png(g);frames.push(fr);
   if(!held&&f&&f.t>=f.tr+.25){held=true;fs.writeFileSync(path.join(OUT34,'quake-held-backdrop.png'),fr);out.quakeHeldShownCount=a.shownPowerCount('quake');}
   if(!landed&&f&&f.arrived&&a.quakeButtonScale()>1.15){landed=true;fs.writeFileSync(path.join(OUT34,'quake-button-bounce.png'),fr);out.quakeLandedShownCount=a.shownPowerCount('quake');}}
  await encode(frames,60,path.join(OUT34,'quake-realtime.mp4'));await encode(frames,15,path.join(OUT34,'quake-4x-slow.mp4'));out.quake=info(f);g.close();}
 fs.writeFileSync(path.join(OUT,'clip-marks.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
