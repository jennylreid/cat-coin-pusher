// UAT 27 phone-size desktop renders of the real runtime: prize centre-flip pickup and Quake flight (clips + frames).
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat27'),OUT34=path.resolve(__dirname,'../../tickets/CP-34-evidence');
for(const d of [OUT,OUT34])fs.mkdirSync(d,{recursive:true});
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function game(){const g=await make({sourceFile:SRC,render:true,height:888.889,seed:7});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
async function encode(frames,fps,file){
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-vf','scale=800:1778:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-crf','22',file],{stdio:['pipe','ignore','inherit'],windowsHide:true});
 const done=once(ff,'exit');for(const b of frames)if(!ff.stdin.write(b))await once(ff.stdin,'drain');ff.stdin.end();if((await done)[0])throw Error('ffmpeg '+file);
}
(async()=>{
 const marks={};
 // Prize: real payout of Board 1 cheese.
 let g=await game();let run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(0);S.coins=200;board.status="playing";');
 for(let i=0;i<90;i++){if(i%12===0)a.tryDrop({x:150+i});g.tick();}
 let frames=[];for(let i=0;i<20;i++){g.tick();frames.push(png(g));}
 run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese');b.rb.setTranslation({x:118*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
 const shots={'prize-1-rise.png':.15,'prize-2-middle.png':.32,'prize-3-flip.png':.55,'prize-4-to-bag.png':1.0};let f=null;
 for(let i=0;i<100;i++){g.tick();f=f||a.treatAwards[0];frames.push(png(g));const t=f?+f.t.toFixed(3):0;
  for(const [n,at] of Object.entries(shots))if(!marks[n]&&t>=at){fs.writeFileSync(path.join(OUT,n),frames.at(-1));marks[n]={t,flip:+a.pickupPoint(f).flip.toFixed(2)};}
  if(f&&f.arrived&&!marks['prize-5-bounce.png']&&a.inventoryTileScale()>1.15){fs.writeFileSync(path.join(OUT,'prize-5-bounce.png'),frames.at(-1));marks['prize-5-bounce.png']={t};}}
 await encode(frames,60,path.join(OUT,'prize-realtime.mp4'));await encode(frames,15,path.join(OUT,'prize-4x-slow.mp4'));
 for(let i=0;i<3;i++){a.queueTreatAward(['cheese','shrimp','tuna'][i],100+i*100,null);for(let k=0;k<5;k++)g.tick();}
 for(let k=0;k<18;k++)g.tick();fs.writeFileSync(path.join(OUT,'three-prizes-middle.png'),png(g));g.close();
 // Quake: real payout of Board 3's Quake coin.
 g=await game();run=s=>vm.runInContext(s,g.c);a=g.c.__game;run('selectBoard(2);S.dev=false;S.coins=200;board.status="playing";');
 for(let i=0;i<60;i++){if(i%12===0)a.tryDrop({x:150+i});g.tick();}
 frames=[];for(let i=0;i<15;i++){g.tick();frames.push(png(g));}
 run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='quake');b.rb.setTranslation({x:230*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
 f=null;const qs={'quake-1-launch.png':.1,'quake-2-mid.png':.4,'quake-3-arrive.png':.7};
 for(let i=0;i<75;i++){g.tick();f=f||a.treatAwards.find(x=>x.kind==='quake');frames.push(png(g));const t=f?+f.t.toFixed(3):0;
  for(const [n,at] of Object.entries(qs))if(!marks[n]&&t>=at){fs.writeFileSync(path.join(OUT34,n),frames.at(-1));marks[n]={t,shownCount:a.shownPowerCount('quake')};}
  if(f&&f.arrived&&!marks['quake-4-bounce.png']&&a.quakeButtonScale()>1.15){fs.writeFileSync(path.join(OUT34,'quake-4-bounce.png'),frames.at(-1));marks['quake-4-bounce.png']={t,shownCount:a.shownPowerCount('quake')};}}
 await encode(frames,60,path.join(OUT34,'quake-realtime.mp4'));await encode(frames,15,path.join(OUT34,'quake-4x-slow.mp4'));g.close();
 fs.writeFileSync(path.join(OUT,'clip-marks.json'),JSON.stringify({render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime and real payout',marks},null,1));
 console.log(marks);
})().catch(e=>{console.error(e);process.exitCode=1;});
