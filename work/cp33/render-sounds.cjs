// UAT 34 (was UAT 33): renders the shipped sfx code (extracted from release.html, unchanged) through a small offline Web Audio
// stand-in (oscillators, gain automation, looped noise through an RBJ bandpass), so the ledge bell and landing thump can be heard on
// a desktop and their peak level checked. Desktop rendering only; phone sound needs Jenny's ears.
const fs=require('fs'),path=require('path'),vm=require('vm');
const SR=44100,OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat34');fs.mkdirSync(OUT,{recursive:true});
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
function play(fn,dur,muted=false){const ac=makeAC(),c={S:{muted},inBackground:false,document:{hidden:false},Math};c.window={AudioContext:function(){return ac;}};vm.createContext(c);
 vm.runInContext(SFX+';globalThis.sfx=sfx;',c);fn(c.sfx,ac);return {a:render(ac,dur),voices:ac.voices.length};}
// Bell at the ledge (0 s), thump in the bag 1.35 s later (rise 0.35 + held 0.7 + into bag 0.3), at 100%.
const one=vol=>play((sfx,ac)=>{sfx.pickup('bell',vol);ac.currentTime=1.35;sfx.pickup('thump',vol);},2).a;
const a=one(1);wav(path.join(OUT,'ledge-bell-and-landing-thump.wav'),a);
res.at100={peak:+peak(a).toFixed(3),bellRms:+rms(a.slice(0,SR*.5)).toFixed(4),thumpRms:+rms(a.slice(Math.round(SR*1.35),Math.round(SR*1.85))).toFixed(4)};
res.at150Peak=+peak(one(1.5)).toFixed(3);
// Three prizes over the ledge in the same frame: spaced 0.1 s, levels 1, 0.7, 0.5 (as ledgeBell schedules them).
const burst=play(sfx=>{sfx.pickup('bell',1,0);sfx.pickup('bell',.7,.1);sfx.pickup('bell',.5,.2);},1.2).a;wav(path.join(OUT,'three-prizes-together.wav'),burst);
const unspaced=play(sfx=>{for(let k=0;k<3;k++)sfx.pickup('bell',1,0);},1.2).a;
res.threeTogether={peak:+peak(burst).toFixed(3),peakIfStackedUnspaced:+peak(unspaced).toFixed(3)};
res.volumeZeroPeak=peak(play(sfx=>{sfx.pickup('bell',0);sfx.pickup('thump',0);},.5).a);
res.soundOffVoices=play(sfx=>{sfx.pickup('bell',1);sfx.pickup('thump',1);},.5,true).voices;
// Same code as the audition file ledge-3-bell.wav / landing-thump.wav: compare levels.
fs.writeFileSync(path.join(OUT,'sounds.json'),JSON.stringify({render:'offline stand-in for Web Audio, shipped sfx code, 44.1 kHz mono; master gain 0.55 as in the game',files:['ledge-bell-and-landing-thump.wav','three-prizes-together.wav'],...res},null,1));
console.log(JSON.stringify(res,null,1));
