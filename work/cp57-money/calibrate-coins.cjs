// CP-57 (added): gains for the real coin takes, so each set matches the code-made sound it replaces (loudest 100 ms above
// 250 Hz, CP-46 engine, through the effects master 0.55), from the base build's own sfx code. Writes coins/calibration.json.
//   bump  <- sfx.clink(1)          (a coin bumping on the pile; C46.hit for coins)
//   drop  <- sfx.wild2('land',1)   (a sky/rain coin landing; also the rain 'drip', scaled by its own volume)
//   spill <- sfx.wild('topple',1)  (a tower of coins falling over)
//   pour  <- sfx.dance('pour',1)   (the Dance break payoff's coin pour)
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const base=path.resolve(process.argv[2]||path.join(__dirname,'../cp73/release.html'));
function sfxOf(file,seed=5){const src=fs.readFileSync(file,'utf8');const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
 const ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};c.Math.random=E.seeded(seed);c.window={AudioContext:function(){return ac;}};
 vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();return {sfx:c.sfx,ac};}
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(E.SR*.1);let m=0;for(let k=0;k<pb.length;k+=Math.round(w/8))m=Math.max(m,E.rms(pb.subarray(k,Math.min(pb.length,k+w))));return m;};
const dB=x=>+(20*Math.log10(x)).toFixed(2);
const REF={bump:s=>s.clink(1),drop:s=>s.wild2('land',1),spill:s=>s.wild('topple',1),pour:s=>s.dance('pour',1)};
const SETS={bump:['bump1','bump2','bump3','bump4','bump5','bump6','bump7','bump8'],drop:['A1','A2','A3','C1','C2','C3'],spill:['B1','B2','B3'],pour:['pour1','pour2']};
const out={base,sets:{}};
for(const [set,fn] of Object.entries(REF)){let Lr=0;const N=8;for(let s=0;s<N;s++){const {sfx,ac}=sfxOf(base,s+1);ac.currentTime=1;fn(sfx);Lr+=20*Math.log10(loud(E.render(ac,3.2)));}Lr/=N; // average over random variants
 const takes=SETS[set].map(k=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-i',path.join(__dirname,'coins',k+'.mp3'),'-f','f32le','-ac','1','-ar','44100','-']);
  const a=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4).map(x=>x*.55);return {k,L:20*Math.log10(loud(a)),peak:E.peak(a)};});
 const avg=takes.reduce((s,t)=>s+t.L,0)/takes.length,gain=+Math.pow(10,(Lr-avg)/20).toFixed(4);
 out.sets[set]={replaces:String(fn).replace(/^s=>s\./,'sfx.'),codeLoudDb:+Lr.toFixed(2),takes:takes.map(t=>({take:t.k,loudDb:+t.L.toFixed(2),peak:+t.peak.toFixed(3)})),gain,peakAtVol1:+Math.max(...takes.map(t=>t.peak*gain)).toFixed(3)};}
fs.writeFileSync(path.join(__dirname,'coins','calibration.json'),JSON.stringify(out,null,1));
for(const [k,v] of Object.entries(out.sets))console.log(k,'code',v.codeLoudDb,'gain',v.gain,'peak@1',v.peakAtVol1,v.takes.map(t=>t.loudDb).join(' '));
