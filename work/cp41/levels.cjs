// Levels of the generated music and pusher sound vs the recorded coin sounds (desktop measurement, dBFS).
const {game}=require('./harness.cjs'),{makeContext,stats,SR,phoneBand}=require('./audio-render.cjs'),path=require('path'),{execFileSync}=require('child_process');
async function measure(src,setup,seconds,skip=2){
 const g=await game({src:path.resolve(src),seed:4});let ctx;g.c.AudioContext=class{constructor(){ctx=makeContext(()=>g.ms()/1000-100);return ctx;}};
 g.run('S.muted=false;'+setup);g.ticks(Math.round(seconds*60));const out=ctx.render();g.close();
 const a=new Float32Array(Math.round(seconds*SR));if(out)for(let i=0;i<out.a.length;i++){const j=out.s+i;if(j>=0&&j<a.length)a[j]=out.a[i];}
 const w=a.subarray(Math.round(skip*SR)),pb=phoneBand(w);let q=0;for(const x of pb)q+=x*x;return {...stats(w),phoneBandRms:+Math.sqrt(q/pb.length).toFixed(4)};}
function mp3(file,vol,limit){const raw=execFileSync('ffmpeg',['-v','quiet','-i',file,'-f','f32le','-ac','1','-ar',String(SR),'-']);const f=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);
 const n=Math.min(f.length,Math.round(limit*SR)),a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=f[i]*vol;
 let p=0,pi=0;for(let i=0;i<n;i++)if(Math.abs(a[i])>p){p=Math.abs(a[i]);pi=i;}
 return {whole:stats(a),hit100ms:stats(a,Math.max(0,pi-Math.round(.02*SR)),Math.min(n,pi+Math.round(.08*SR)))};}
module.exports={measure,mp3};
if(require.main===module)(async()=>{const [src,label,setup]=process.argv.slice(2);
 const music=await measure(src,setup+';W2.pusher=0',19.2,2),pusher=await measure(src,(setup||'')+';W2.music=0',12.8,0);
 console.log(JSON.stringify({label,music17s:music,pusherOnly:pusher}));
 if(process.argv[5]==='coins'){const A='../cp33/assets/sounds/effects/';console.log(JSON.stringify({coinLand:mp3(A+'coin-land.mp3',.25,.84),coinDrop:mp3(A+'coin-drop.mp3',.24,1.1),coinOff:mp3(A+'coin-off.mp3',.17,.85)}));}
})();
