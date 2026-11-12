// Phone-size desktop render of the real runtime: pickup clip + frames, burst frame, lost-prize frames.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat26');fs.mkdirSync(OUT,{recursive:true});
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function game(){const g=await make({sourceFile:SRC,render:true,height:888.889,seed:7});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const payout=(g,id,x)=>vm.runInContext(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`,g.c);
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
(async()=>{
 // Pickup clip: real payout of Board 1 cheese, 60 fps frames, encoded at 60 fps (real time) and 15 fps (4x slow).
 let g=await game();const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(0);S.coins=200;board.status="playing";');
 for(let i=0;i<90;i++){if(i%12===0)a.tryDrop({x:150+i});g.tick();}
 const frames=[];for(let i=0;i<20;i++){g.tick();frames.push(png(g));}
 payout(g,'cheese',118);const marks={};
 let peakY=1e9,peakBuf=null;for(let i=0;i<72;i++){g.tick();const f=a.treatAwards[0];const t=f?+f.t.toFixed(3):null;frames.push(png(g));
  if(f&&!f.arrived){const e=f.t/f.dur,u=e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2,y=a.pickupPoint(f,u).y;if(y<peakY){peakY=y;peakBuf=frames.at(-1);marks.peak=t;marks.peakY=+y.toFixed(1);}}
  if(i===0)fs.writeFileSync(path.join(OUT,'pickup-1-start.png'),frames.at(-1)),marks.start=t;
  if(i===20)fs.writeFileSync(path.join(OUT,'pickup-2-middle.png'),frames.at(-1)),marks.middle=t;
  if(f&&f.arrived&&marks.arrival===undefined){fs.writeFileSync(path.join(OUT,'pickup-3-arrival.png'),frames.at(-1));marks.arrival=t;}
  if(marks.arrival!==undefined&&marks.bounce===undefined&&a.inventoryTileScale()>1.15){fs.writeFileSync(path.join(OUT,'pickup-4-bounce.png'),frames.at(-1));marks.bounce=t;marks.bounceScale=+a.inventoryTileScale().toFixed(3);}
 }
 fs.writeFileSync(path.join(OUT,'pickup-peak.png'),peakBuf);
 for(const [fps,name] of [[60,'pickup-realtime.mp4'],[15,'pickup-4x-slow.mp4']]){
  const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-vf','scale=800:1778:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-crf','22',path.join(OUT,name)],{stdio:['pipe','ignore','inherit'],windowsHide:true});
  const done=once(ff,'exit');for(const b of frames)if(!ff.stdin.write(b))await once(ff.stdin,'drain');ff.stdin.end();if((await done)[0])throw Error('ffmpeg '+name);
 }
 // Burst: five prizes in quick succession.
 for(let i=0;i<5;i++){a.queueTreatAward(['cheese','shrimp','tuna','cheese','shrimp'][i],80+i*60,null);for(let k=0;k<3;k++)g.tick();}
 fs.writeFileSync(path.join(OUT,'burst-five.png'),png(g));for(let i=0;i<60;i++)g.tick();g.close();
 // Lost prize: Board 1 cheese pushed off the right side gutter; frames at crossing and mid-sink.
 g=await game();const run2=s=>vm.runInContext(s,g.c),b=g.c.__game;run2('selectBoard(0);S.coins=200;board.status="playing";');for(let i=0;i<30;i++)g.tick();
 run2(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese');b.rb.setTranslation({x:(T.R+30)*M,y:-0.5,z:640*M},true);})()`);
 const lostFrames=[];g.tick();lostFrames.push(png(g));fs.writeFileSync(path.join(OUT,'lost-1-crossing.png'),lostFrames[0]);
 for(let i=0;i<20;i++){g.tick();lostFrames.push(png(g));if(i===7)fs.writeFileSync(path.join(OUT,'lost-2-sinking.png'),lostFrames.at(-1));}
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','15','-i','pipe:0','-vf','scale=800:1778:flags=lanczos','-c:v','libx264','-pix_fmt','yuv420p','-crf','22',path.join(OUT,'lost-4x-slow.mp4')],{stdio:['pipe','ignore','inherit'],windowsHide:true});
 const done=once(ff,'exit');for(const x of lostFrames)if(!ff.stdin.write(x))await once(ff.stdin,'drain');ff.stdin.end();await done;
 fs.writeFileSync(path.join(OUT,'clip-marks.json'),JSON.stringify({render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime',pickupSecondsAtFrames:marks,lostBoardStatus:b.board.status},null,1));
 console.log(marks,b.board.status);g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
