// UAT 33: renders the shipped sfx code (extracted from release.html, unchanged) through a small offline Web Audio
// stand-in (oscillators, gain automation, looped noise through an RBJ bandpass), so the three pickup sounds can be heard on
// a desktop and their peak level checked. Desktop rendering only; phone sound needs Jenny's ears.
const fs=require('fs'),path=require('path'),vm=require('vm');
const SR=44100,OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat33');fs.mkdirSync(OUT,{recursive:true});
const src=fs.readFileSync(path.resolve(__dirname,'release.html'),'utf8');
const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5,SFX=src.slice(i,j);
class Param{constructor(v){this.v=v;this.ev=[];}set value(x){this.v=x;}get value(){return this.v;}
 setValueAtTime(x,t){this.ev.push({k:'set',x,t});}exponentialRampToValueAtTime(x,t){this.ev.push({k:'exp',x,t});}linearRampToValueAtTime(x,t){this.ev.push({k:'lin',x,t});}
 at(t){let v=this.v,t0=0;for(const e of this.ev){if(e.k==='set'){if(t<e.t)return v;v=e.x;t0=e.t;}else{if(t<e.t){const u=(t-t0)/(e.t-t0);return e.k==='exp'?v*Math.pow(e.x/v,u):v+(e.x-v)*u;}v=e.x;t0=e.t;}}return v;}}
function makeAC(){
 const voices=[];
 class Node{constructor(){this.out=null;}connect(n){this.out=n;}}
 const ac={currentTime:0,sampleRate:SR,state:'running',resume(){},destination:new Node(),
  createGain(){const n=new Node();n.gain=new Param(1);return n;},
  createOscillator(){const n=new Node();n.frequency=new Param(440);n.type='sine';n.start=t=>{n.t0=t;voices.push(n);};n.stop=t=>{n.t1=t;};return n;},
  createBuffer(ch,len){const d=new Float32Array(len);return {getChannelData:()=>d,length:len};},
  createBufferSource(){const n=new Node();n.start=t=>{n.t0=t;voices.push(n);};n.stop=t=>{n.t1=t;};return n;},
  createBiquadFilter(){const n=new Node();n.frequency=new Param(350);n.Q=new Param(1);return n;}};
 ac.voices=voices;return ac;
}
function render(ac,dur){
 const out=new Float32Array(Math.ceil(dur*SR));
 for(const n of ac.voices){
  let chain=[],x=n.out;while(x&&x!==ac.destination){chain.push(x);x=x.out;}
  const gains=chain.filter(c=>c.gain),filt=chain.find(c=>c.Q);let ph=0,pos=0,b=[0,0,0,0];
  let c0,c1,c2,d1,d2;if(filt){const w=2*Math.PI*filt.frequency.v/SR,al=Math.sin(w)/(2*filt.Q.v),a0=1+al;c0=al/a0;c1=0;c2=-al/a0;d1=-2*Math.cos(w)/a0;d2=(1-al)/a0;}
  const s0=Math.floor(n.t0*SR),s1=Math.min(out.length,Math.ceil(n.t1*SR));
  for(let s=s0;s<s1;s++){const t=s/SR;let y;
   if(n.frequency){const f=n.frequency.at(t);ph+=f/SR;ph-=Math.floor(ph);
    y=n.type==='sine'?Math.sin(2*Math.PI*ph):n.type==='square'?(ph<.5?1:-1):n.type==='sawtooth'?2*ph-1:1-4*Math.abs(ph-.5);}
   else{const d=n.buffer.getChannelData();y=d[pos++%d.length];}
   if(filt){const z=c0*y+c1*b[0]+c2*b[1]-d1*b[2]-d2*b[3];b[1]=b[0];b[0]=y;b[3]=b[2];b[2]=z;y=z;}
   for(const g of gains)y*=g.gain.at(t);out[s]+=y;}
 }
 return out;
}
function wav(file,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
 b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
 for(let k=0;k<a.length;k++)b.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(a[k]*32767))),44+k*2);fs.writeFileSync(file,b);}
const peak=a=>a.reduce((m,x)=>Math.max(m,Math.abs(x)),0),rms=a=>Math.sqrt(a.reduce((m,x)=>m+x*x,0)/a.length);
const res={};
function play(fn,dur){const ac=makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math};c.window={AudioContext:function(){return ac;}};vm.createContext(c);
 vm.runInContext(SFX+';globalThis.sfx=sfx;',c);fn(c.sfx,ac);return render(ac,dur);}
// Each file: full-size sound at 0 s, landing in the bag at 1.0 s (Time held 0.7 s + Into bag 0.3 s), at 100% volume.
const seq=(v,vol)=>play((sfx,ac)=>{sfx.pickup('full',v,vol);ac.currentTime=1.0;sfx.pickup('land',v,vol);},1.8);
for(const v of [1,2,3]){const a=seq(v,1);wav(path.join(OUT,`pickup-sound-${v}.wav`),a);
 const full=a.slice(0,SR),land=a.slice(SR);res['sound'+v]={peak100:+peak(a).toFixed(3),peak150:+peak(seq(v,1.5)).toFixed(3),fullRms:+rms(full.slice(0,SR*.5)).toFixed(4),landRms:+rms(land.slice(0,SR*.3)).toFixed(4)};}
const old=play((sfx,ac)=>{sfx.itemCollected();},1);wav(path.join(OUT,'pickup-sound-old-uat32.wav'),old);res.oldChimeUAT32={peak:+peak(old).toFixed(3),fullRms:+rms(old.slice(0,SR*.5)).toFixed(4),bagLanding:'none'};
const silent=play((sfx)=>{sfx.pickup('full',1,0);},.5);res.volumeZeroPeak=peak(silent);
const muted=(()=>{const ac=makeAC(),c={S:{muted:true},inBackground:false,document:{hidden:false},Math};c.window={AudioContext:function(){return ac;}};vm.createContext(c);vm.runInContext(SFX+';globalThis.sfx=sfx;',c);c.sfx.pickup('full',1,1);c.sfx.pickup('land',1,1);return ac.voices.length;})();
res.soundOffVoices=muted;
fs.writeFileSync(path.join(OUT,'sounds.json'),JSON.stringify({render:'offline stand-in for Web Audio, shipped sfx code, 44.1 kHz mono; master gain 0.55 as in the game',files:['pickup-sound-1.wav','pickup-sound-2.wav','pickup-sound-3.wav','pickup-sound-old-uat32.wav'],...res},null,1));
console.log(JSON.stringify(res,null,1));
