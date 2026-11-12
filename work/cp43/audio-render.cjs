// Offline renderer for the game's generated Web Audio sounds (desktop measurement only).
// A fake AudioContext records every node and parameter event the game creates; render() then mixes them into samples
// following Web Audio's rules for setValueAtTime / linear / exponential ramps, oscillators, looping buffers and biquads.
const SR=22050;
class Param{constructor(v){this.value=v;this.ev=[];}
 setValueAtTime(v,t){this.ev.push({k:'set',t,v});return this;}
 linearRampToValueAtTime(v,t){this.ev.push({k:'lin',t,v});return this;}
 exponentialRampToValueAtTime(v,t){this.ev.push({k:'exp',t,v});return this;}
 cancelScheduledValues(t){this.ev=this.ev.filter(e=>e.t<t);return this;}
 at(t){ // value at time t
  const ev=[...this.ev].sort((a,b)=>a.t-b.t);let pt=0,pv=this.value;
  for(const e of ev){
   if(e.k==='set'){if(e.t<=t){pt=e.t;pv=e.v;continue;}return pv;}
   if(e.t<=t){pt=e.t;pv=e.v;continue;}
   const u=(t-pt)/Math.max(1e-9,e.t-pt);if(u<0)return pv;
   return e.k==='lin'?pv+(e.v-pv)*u:pv*Math.pow(e.v/pv,u);}
  return pv;}
 arr(s,n){const a=new Float32Array(n);if(!this.ev.length){a.fill(this.value);return a;}for(let i=0;i<n;i++)a[i]=this.at((s+i)/SR);return a;}
}
class Node{constructor(ctx){this.ctx=ctx;this.ins=[];ctx.nodes.push(this);}connect(d){if(d&&d.ins)d.ins.push(this);return d;}disconnect(){}}
class Osc extends Node{constructor(c){super(c);this.type='sine';this.frequency=new Param(440);this.t0=null;this.t1=Infinity;}start(t){this.t0=t;}stop(t){this.t1=t;}
 out(){if(this.t0==null)return null;const s=Math.ceil(this.t0*SR),n=Math.max(0,Math.floor(Math.min(this.t1,this.t0+30)*SR)-s),f=this.frequency.arr(s,n),a=new Float32Array(n);let ph=0;
  for(let i=0;i<n;i++){ph+=f[i]/SR;ph-=Math.floor(ph);const x=ph;a[i]=this.type==='sine'?Math.sin(2*Math.PI*x):this.type==='square'?(x<.5?1:-1):this.type==='sawtooth'?2*x-1:(x<.5?4*x-1:3-4*x);}return {s,a};}}
class Src extends Node{constructor(c){super(c);this.buffer=null;this.loop=false;this.t0=null;this.t1=Infinity;}start(t){this.t0=t;}stop(t){this.t1=t;}
 out(){if(this.t0==null||!this.buffer)return null;const d=this.buffer.data,s=Math.ceil(this.t0*SR),n=Math.max(0,Math.round(Math.min(this.t1,this.loop?this.t0+30:this.t0+d.length/SR)*SR)-s),a=new Float32Array(n);
  for(let i=0;i<n;i++)a[i]=d[this.loop?i%d.length:i]||0;return {s,a};}}
function mix(list){list=list.filter(Boolean);if(!list.length)return null;const s=Math.min(...list.map(x=>x.s)),e=Math.max(...list.map(x=>x.s+x.a.length)),a=new Float32Array(e-s);for(const x of list)for(let i=0;i<x.a.length;i++)a[x.s-s+i]+=x.a[i];return {s,a};}
class Gain extends Node{constructor(c){super(c);this.gain=new Param(1);}out(){const m=mix(this.ins.map(n=>n.get()));if(!m)return null;const g=this.gain.arr(m.s,m.a.length);for(let i=0;i<m.a.length;i++)m.a[i]*=g[i];return m;}}
class Biquad extends Node{constructor(c){super(c);this.type='lowpass';this.frequency=new Param(350);this.Q=new Param(1);}
 out(){const m=mix(this.ins.map(n=>n.get()));if(!m)return null;const x=m.a,y=new Float32Array(x.length);let x1=0,x2=0,y1=0,y2=0,b0,b1,b2,a1,a2;
  for(let i=0;i<x.length;i++){if(i%64===0){const t=(m.s+i)/SR,f=Math.min(SR/2-1,this.frequency.at(t)),q=this.type==='bandpass'?Math.max(1e-4,this.Q.at(t)):Math.pow(10,this.Q.at(t)/20),w=2*Math.PI*f/SR,al=Math.sin(w)/(2*q),cw=Math.cos(w),a0=1+al;
    if(this.type==='bandpass'){b0=al/a0;b1=0;b2=-al/a0;}else if(this.type==='highpass'){b0=(1+cw)/2/a0;b1=-(1+cw)/a0;b2=(1+cw)/2/a0;}else{b0=(1-cw)/2/a0;b1=(1-cw)/a0;b2=(1-cw)/2/a0;}a1=-2*cw/a0;a2=(1-al)/a0;}
   const v=b0*x[i]+b1*x1+b2*x2-a1*y1-a2*y2;x2=x1;x1=x[i];y2=y1;y1=v;y[i]=v;}return {s:m.s,a:y};}}
class Shaper extends Node{constructor(c){super(c);this.curve=null;}out(){const m=mix(this.ins.map(n=>n.get()));if(!m||!this.curve)return m;const c=this.curve,n=c.length;
 for(let i=0;i<m.a.length;i++){const x=Math.max(-1,Math.min(1,m.a[i])),f=(x+1)/2*(n-1),j=Math.min(n-2,Math.floor(f)),u=f-j;m.a[i]=c[j]*(1-u)+c[j+1]*u;}return m;}}
Node.prototype.get=function(){if(this._o===undefined)this._o=this.out();return this._o;};
function makeContext(clock){
 const ctx={nodes:[],sampleRate:SR,state:'running',resume(){},get currentTime(){return clock();}};
 const dest=new Gain(ctx);ctx.destination=dest;
 Object.assign(ctx,{createOscillator:()=>new Osc(ctx),createGain:()=>new Gain(ctx),createBiquadFilter:()=>new Biquad(ctx),createBufferSource:()=>new Src(ctx),createWaveShaper:()=>new Shaper(ctx),
  createBuffer:(ch,len)=>{const data=new Float32Array(len);return {data,getChannelData:()=>data};},createDynamicsCompressor:()=>{const g=new Gain(ctx);g.threshold=new Param(0);g.knee=new Param(0);g.ratio=new Param(1);g.attack=new Param(0);g.release=new Param(0);return g;}});
 ctx.render=()=>{for(const n of ctx.nodes)n._o=undefined;return dest.get();};
 return ctx;
}
function stats(a,from=0,to=a.length){let p=0,s=0;for(let i=from;i<to;i++){const v=Math.abs(a[i]);if(v>p)p=v;s+=a[i]*a[i];}const r=Math.sqrt(s/Math.max(1,to-from));const db=x=>x>0?+(20*Math.log10(x)).toFixed(1):-Infinity;return {rmsDb:db(r),peakDb:db(p),peak:+p.toFixed(3)};}
// RMS above 250 Hz (4th-order highpass), roughly what a phone speaker plays, as in the CP-38 music audition
function phoneBand(a){let x=a;const w=2*Math.PI*250/SR,cw=Math.cos(w),al=Math.sin(w)/2,a0=1+al,C=[(1+cw)/2/a0,-(1+cw)/a0,(1+cw)/2/a0,-2*cw/a0,(1-al)/a0];
 for(let p=0;p<2;p++){const y=new Float32Array(x.length);let x1=0,x2=0,y1=0,y2=0;for(let i=0;i<x.length;i++){const z=C[0]*x[i]+C[1]*x1+C[2]*x2-C[3]*y1-C[4]*y2;x2=x1;x1=x[i];y2=y1;y1=z;y[i]=z;}x=y;}return x;}
module.exports={makeContext,stats,SR,phoneBand};
