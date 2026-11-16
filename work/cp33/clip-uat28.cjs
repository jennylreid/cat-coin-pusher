// UAT 28 phone-size desktop renders of the real runtime: tumble pickup (real time + 4x slow), two pickups side by side,
// two prizes collected together. Real payouts on Board 1 (Rapier physics, shipped script).
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{spawn,execFileSync}=require('child_process'),{once}=require('events');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat28');
fs.mkdirSync(OUT,{recursive:true});
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const SEED=+(process.env.SEED||7),SEED2=+(process.env.SEED2||8);
async function game(seed){const g=await make({sourceFile:SRC,render:true,height:888.889,seed});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
async function encode(frames,fps,file){
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-vf','scale=800:1778:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-crf','22',file],{stdio:['pipe','ignore','inherit'],windowsHide:true});
 const done=once(ff,'exit');for(const b of frames)if(!ff.stdin.write(b))await once(ff.stdin,'drain');ff.stdin.end();if((await done)[0])throw Error('ffmpeg '+file);
}
const deg=r=>+(r*180/Math.PI).toFixed(1);
const info=f=>({prize:f.id,tiltDeg:deg(f.tilt),direction:f.dir,flips:f.turns,flipSec:+(f.tm*f.flipK).toFixed(3),rockDeg:deg(f.wamp),shortened:f.short});
async function warm(seed){const g=await game(seed);const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(0);S.coins=200;board.status="playing";');
 for(let i=0;i<90;i++){if(i%12===0)a.tryDrop({x:150+i});g.tick();}return {g,run,a};}
const push=(run,id,x)=>run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
(async()=>{
 const out={render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime and real payout, Board 1, defaults',seeds:[SEED,SEED2]};
 const at=[.06,.17,.28,.5],names=['a-quarter-flip','b-mid-flip','c-late-flip','d-settled'],shots={};
 const snap=(key,f,fr)=>at.forEach((d,j)=>{const k=key+'-'+names[j];if(!shots[k]&&f.t>=f.tr+d){fs.writeFileSync(path.join(OUT,k+'.png'),fr);shots[k]={t:+(f.t-f.tr).toFixed(3)};}});
 // 1. One pickup: real time and 4x slow.
 {let {g,run,a}=await warm(SEED);const frames=[];for(let i=0;i<20;i++){g.tick();frames.push(png(g));}
  push(run,'cheese',118);let f=null;
  for(let i=0;i<110;i++){g.tick();f=f||a.treatAwards[0];const fr=png(g);frames.push(fr);snap('pickupA',f,fr);}
  await encode(frames,60,path.join(OUT,'prize-realtime.mp4'));await encode(frames,15,path.join(OUT,'prize-4x-slow.mp4'));out.single=info(f);g.close();}
 // 2. Two prizes collected together (same frame): the second waits, then takes its turn. Frames of both at the same moments.
 {let {g,run,a}=await warm(SEED2);const frames=[];for(let i=0;i<15;i++){g.tick();frames.push(png(g));}
  push(run,'cheese',140);push(run,'shrimp',260);g.tick();frames.push(png(g));const [f1,f2]=a.treatAwards;out.together=[info(f1),info(f2)];
  for(let i=0;i<180;i++){g.tick();const fr=png(g);frames.push(fr);
   snap('pickupB',f1,fr);
   if(!shots.waiting&&f1.t>=f1.tr+.25){fs.writeFileSync(path.join(OUT,'together-second-waiting.png'),fr);shots.waiting={secondT:+f2.t.toFixed(3)};}}
  await encode(frames,60,path.join(OUT,'two-together-realtime.mp4'));await encode(frames,15,path.join(OUT,'two-together-4x-slow.mp4'));out.shots=shots;g.close();
  // Strip: pickup A (top, run 1) and pickup B (bottom, first of the pair in run 2) at the same moments in the middle, cropped to the middle.
  const row=k=>names.map(n=>['-i',path.join(OUT,`pickup${k}-${n}.png`)]).flat();out.compared={A:out.single,B:out.together[0]};
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...row('A'),...row('B'),'-filter_complex',
   [...Array(8).keys()].map(i=>`[${i}]crop=240:240:80:330[c${i}]`).join(';')+';[c0][c1][c2][c3]hstack=4[t];[c4][c5][c6][c7]hstack=4[b];[t][b]vstack',path.join(OUT,'two-pickups-compared.png')]);}
 fs.writeFileSync(path.join(OUT,'clip-marks.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
