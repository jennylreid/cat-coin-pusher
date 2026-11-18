// CP-57 title videos (Jenny, Nov 17): the real title roll-in, 412x915, 30 fps, one MP4 per title sound (A, B, C, D = production).
// The frames are rendered ONCE from the game (the UAT 87 prep build, real runtime and canvas) and reused for every video, so only
// the sound differs. Each video's audio, at in-game level: the 7 letter sounds at each letter's landing (title time 0.60 + i x 0.09 s),
// plus the title's own meow (1.15 s) and level-up jingle (1.5 s), the same in all four (from the game's own sfx code).
//   A/B/C: the candidate taps (taps/tap-*.wav) at their production-matched gain, pitch per letter as in title-A/B/C.wav
//   D: production 2026.11.16.2's clink (steelAt) from production's code
// H.264 needs even sizes: the 412x915 frames get a 1 px black strip at the bottom (412x916); the picture itself is not scaled.
// Usage: node make-videos.cjs <production index.html>   -> tickets/CP-57-evidence/title-{A,B,C,D-production}.mp4
const make=require('../cp33/runtime.cjs'),E=require('../cp46-audio/engine.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),cp=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const SR=E.SR,OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence'),root=path.resolve(__dirname,'../..'),PROD=process.argv[2];
const TMP=path.join(require('os').tmpdir(),'cp57-title-frames');fs.rmSync(TMP,{recursive:true,force:true});fs.mkdirSync(TMP,{recursive:true});
const FPS=30,DUR=2.8,W=412,H=915;
(async()=>{
 // 1) frames
 const g=await make({sourceFile:path.join(__dirname,'release-title87.html'),render:true,seed:5,pixelRatio:1,width:W,height:H});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const tk=g.tick.bind(g);g.tick=()=>{ms+=1000/60;tk();};const run=s=>vm.runInContext(s,g.c);
 run('S.muted=true;S.dev=false');for(let i=0;i<150;i++)g.tick();
 run("PGU.screen='title';PGU.title={t:0,coins:[],snd:0};");
 const ts=[];for(let f=0;f<Math.round(DUR*FPS);f++){g.c.draw();fs.writeFileSync(path.join(TMP,String(f).padStart(4,'0')+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));ts.push(+run('PGU.title.t'));g.tick();g.tick();}
 const t0=ts[0]; // title time shown in frame 0; audio time = title time - t0
 // 2) audio
 const src=fs.readFileSync(PROD,'utf8');const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
 const pgDef=src.slice(src.indexOf('sfx.pg=function(kind,vol=1){'),src.indexOf('\n};',src.indexOf('sfx.pg=function(kind,vol=1){'))+3);
 function base(withLetters){const ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};c.Math.random=E.seeded(3);c.window={AudioContext:function(){return ac;}};
  vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;'+pgDef,c);c.sfx.unlock();
  const at=T=>T-t0;ac.currentTime=at(1.15);c.sfx.pg('meow',1);ac.currentTime=at(1.5);c.sfx.pg('levelup',1);
  if(withLetters){const r=E.seeded(5);for(let k=0;k<7;k++){const T=.6+k*.09;ac.currentTime=at(T);c.sfx._pgSteel(at(T),.35*.8,1+r()*.4,false);}}
  return E.render(ac,DUR);}
 const rd=f=>{const b=fs.readFileSync(f);const n=(b.length-44)/2,a=new Float32Array(n);for(let q=0;q<n;q++)a[q]=b.readInt16LE(44+q*2)/32767;return a;};
 const cand=JSON.parse(fs.readFileSync(path.join(OUT,'title-candidates.json'),'utf8'));
 function wav(f,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
  for(let q=0;q<a.length;q++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(a[q]*32767))),44+q*2);fs.writeFileSync(f,b);}
 const tracks={'D-production':base(true)};
 for(const k of ['A','B','C']){const a=base(false),tap=rd(path.join(__dirname,'taps','tap-'+k+'.wav')),G=cand[k].tapGainToMatchProduction;
  cand.pitches.forEach((rate,n)=>{const s0=Math.round((.6+n*.09-t0)*SR),len=Math.floor((tap.length-1)/rate);for(let q=0;q<len&&s0+q<a.length;q++){if(s0+q<0)continue;const x=q*rate,y=Math.floor(x),f=x-y;a[s0+q]+=(tap[y]*(1-f)+tap[y+1]*f)*G;}});tracks[k]=a;}
 const rep={framesFps:FPS,frames:ts.length,size:W+'x'+H,titleTimeAtFrame0:+t0.toFixed(4),letterVideoTimes:[0,1,2,3,4,5,6].map(n=>+(.6+n*.09-t0).toFixed(3)),files:{}};
 for(const [k,a] of Object.entries(tracks)){const wf=path.join(TMP,k+'.wav'),mp4=path.join(OUT,'title-'+k+'.mp4');wav(wf,a);
  cp.execFileSync('ffmpeg',['-v','error','-y','-framerate',String(FPS),'-i',path.join(TMP,'%04d.png'),'-i',wf,'-vf','pad=412:916:0:0:black','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-c:a','aac','-b:a','192k','-shortest',mp4]);
  rep.files[k]={mp4:path.basename(mp4),bytes:fs.statSync(mp4).size,peak:+E.peak(a).toFixed(3)};}
 fs.writeFileSync(path.join(OUT,'title-videos.json'),JSON.stringify(rep,null,1));console.log(JSON.stringify(rep));g.close&&g.close();
})().catch(e=>{console.error(e);process.exit(1)});
