// CP-33 sound audition (no build): five candidate ledge sounds and one soft landing thump, written as sfx methods with
// the game's own tone/noise/bell/steelAt helpers and rendered through the offline Web Audio stand-in from render-sounds.cjs
// (same master gain 0.55). The candidate code below is what would go into the game; the game itself is not changed.
const fs=require('fs'),path=require('path'),vm=require('vm');
const SR=44100,OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/sound-audition');fs.mkdirSync(OUT,{recursive:true});
const src=fs.readFileSync(path.resolve(__dirname,'release.html'),'utf8');
const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
const CANDIDATES=`
    audition(name){
      if(!ready())return;const t=ac.currentTime;
      if(name==='jackpot'){ // coin clinks, then a rising run of high bells over a warm body
        steelAt(t,1.1,1.35,false);steelAt(t+.06,.9,1.6,false);tone(1046.5,t,.55,'triangle',.16);
        bell(t+.03,2093,.2,.7);bell(t+.11,2637.02,.17,.65);bell(t+.19,3135.96,.16,.6);tone(4186,t+.25,.6,'sine',.07);bell(t+.27,2093,.08,1);
      }else if(name==='sparkle'){ // fast rising pentatonic run with an airy shimmer, ending on a high glint
        [1046.5,1174.66,1318.51,1567.98,1760,2093,2349.32,2637.02,3135.96,3520].forEach((f,k)=>{tone(f,t+k*.032,.22,'sine',.17);tone(f*2,t+k*.032,.09,'triangle',.04);});
        noise(t,.5,.08,8000,.6);tone(4186,t+.33,.6,'sine',.1);tone(5274,t+.35,.45,'sine',.045);
      }else if(name==='bell'){ // one big bright struck bell with a click and an octave shimmer
        noise(t,.02,.25,6000,.7);bell(t,1567.98,.36,1.5);bell(t,3135.96,.09,.8);tone(783.99,t,.8,'triangle',.12);
      }else if(name==='dingding'){ // arcade: two bright square-wave pings, the second higher and longer
        tone(1975.53,t,.13,'square',.075);tone(1975.53,t,.16,'sine',.18);
        tone(2637.02,t+.12,.6,'square',.075);tone(2637.02,t+.12,.75,'sine',.2);tone(5274.04,t+.12,.25,'sine',.04);
      }else if(name==='harp'){ // quick upward harp glissando in E major, each string plucked and ringing
        [659.25,830.61,987.77,1318.51,1661.22,1975.53,2637.02,3322.44].forEach((f,k)=>{tone(f,t+k*.038,.75,'triangle',.15);tone(f*2,t+k*.038,.2,'sine',.04);});
        tone(1318.51,t+.3,.6,'sine',.07);
      }else if(name==='thump'){ // soft landing: a short low thud with a little felt texture
        tone(120,t,.15,'sine',.32,55);noise(t,.04,.07,420,.8);
      }
    },
    fanfare() {`;
const SFX=src.slice(i,j).replace('    fanfare() {',CANDIDATES);
class Param{constructor(v){this.v=v;this.ev=[];}set value(x){this.v=x;}get value(){return this.v;}
 setValueAtTime(x,t){this.ev.push({k:'set',x,t});}exponentialRampToValueAtTime(x,t){this.ev.push({k:'exp',x,t});}linearRampToValueAtTime(x,t){this.ev.push({k:'lin',x,t});}
 at(t){let v=this.v,t0=0;for(const e of this.ev){if(e.k==='set'){if(t<e.t)return v;v=e.x;t0=e.t;}else{if(t<e.t){const u=(t-t0)/(e.t-t0);return e.k==='exp'?v*Math.pow(e.x/v,u):v+(e.x-v)*u;}v=e.x;t0=e.t;}}return v;}}
function makeAC(){const voices=[];class Node{constructor(){this.out=null;}connect(n){this.out=n;}}
 const ac={currentTime:0,sampleRate:SR,state:'running',resume(){},destination:new Node(),
  createGain(){const n=new Node();n.gain=new Param(1);return n;},
  createOscillator(){const n=new Node();n.frequency=new Param(440);n.type='sine';n.start=t=>{n.t0=t;voices.push(n);};n.stop=t=>{n.t1=t;};return n;},
  createBuffer(ch,len){const d=new Float32Array(len);return {getChannelData:()=>d,length:len};},
  createBufferSource(){const n=new Node();n.start=t=>{n.t0=t;voices.push(n);};n.stop=t=>{n.t1=t;};return n;},
  createBiquadFilter(){const n=new Node();n.frequency=new Param(350);n.Q=new Param(1);return n;}};ac.voices=voices;return ac;}
function render(ac,dur){const out=new Float32Array(Math.ceil(dur*SR));
 for(const n of ac.voices){let chain=[],x=n.out;while(x&&x!==ac.destination){chain.push(x);x=x.out;}
  const gains=chain.filter(c=>c.gain),filt=chain.find(c=>c.Q);let ph=0,pos=0,b=[0,0,0,0],c0,c1,c2,d1,d2;
  if(filt){const w=2*Math.PI*filt.frequency.v/SR,al=Math.sin(w)/(2*filt.Q.v),a0=1+al;c0=al/a0;c1=0;c2=-al/a0;d1=-2*Math.cos(w)/a0;d2=(1-al)/a0;}
  const s0=Math.floor(n.t0*SR),s1=Math.min(out.length,Math.ceil(n.t1*SR));
  for(let s=s0;s<s1;s++){const t=s/SR;let y;
   if(n.frequency){const f=n.frequency.at(t);ph+=f/SR;ph-=Math.floor(ph);y=n.type==='sine'?Math.sin(2*Math.PI*ph):n.type==='square'?(ph<.5?1:-1):n.type==='sawtooth'?2*ph-1:1-4*Math.abs(ph-.5);}
   else{const d=n.buffer.getChannelData();y=d[pos++%d.length];}
   if(filt){const z=c0*y+c1*b[0]+c2*b[1]-d1*b[2]-d2*b[3];b[1]=b[0];b[0]=y;b[3]=b[2];b[2]=z;y=z;}
   for(const g of gains)y*=g.gain.at(t);out[s]+=y;}}
 return out;}
function wav(file,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);
 b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
 for(let k=0;k<a.length;k++)b.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(a[k]*32767))),44+k*2);fs.writeFileSync(file,b);}
const peak=a=>a.reduce((m,x)=>Math.max(m,Math.abs(x)),0),rms=a=>Math.sqrt(a.reduce((m,x)=>m+x*x,0)/a.length);
const audible=a=>{const p=peak(a);let last=0;for(let k=0;k<a.length;k++)if(Math.abs(a[k])>p*.03)last=k;return +(last/SR).toFixed(2);};
function play(name,dur){const ac=makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math};c.window={AudioContext:function(){return ac;}};vm.createContext(c);
 vm.runInContext(SFX+';globalThis.sfx=sfx;',c);ac.currentTime=.02;c.sfx.audition(name);return render(ac,dur);}
const files=[['ledge-1-jackpot','jackpot'],['ledge-2-sparkle','sparkle'],['ledge-3-bell','bell'],['ledge-4-dingding','dingding'],['ledge-5-harp','harp'],['landing-thump','thump']];
const res={};for(const [file,name] of files){const a=play(name,1.2);wav(path.join(OUT,file+'.wav'),a);res[file]={peak:+peak(a).toFixed(3),rms:+rms(a.slice(0,SR*.5)).toFixed(4),audibleSec:audible(a)};}
// Reference: UAT 33's Sound 1 full-size sound at 100%, same measure.
{const ac=makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math};c.window={AudioContext:function(){return ac;}};vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);ac.currentTime=.02;c.sfx.pickup('full',1,1);const a=render(ac,1.2);res.uat33Sound1Full={peak:+peak(a).toFixed(3),rms:+rms(a.slice(0,SR*.5)).toFixed(4)};}
fs.writeFileSync(path.join(OUT,'levels.json'),JSON.stringify({render:'offline Web Audio stand-in, game sfx helpers, master gain 0.55, 44.1 kHz mono',...res},null,1));
console.log(JSON.stringify(res,null,1));
