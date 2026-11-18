// CP-57 title candidates (Jenny, Nov 17): one whole real coin clink per letter, with its natural ring, softer attack and a slight
// pitch change between letters (not a "bullet" burst), each starting exactly at its letter's landing (production's rhythm: 7 letters
// 0.09 s apart). Recordings already in the project / approved; no downloads. One WAV per candidate, the 7-letter roll-in only:
//   title-A.wav  the bright "ting" of a dropped coin (freesound_gamestudio-drop-coin-384921 = the game's coin-drop.mp3), 0.48 s with ring
//   title-B.wav  the coin landing Jenny approved (dragon-studio-dropping-a-coin-478359 = coin-land.mp3), from its hit, 0.50 s with ring
//   title-C.wav  one isolated coin clink (voicebosch-single-coin-170397 at 18.37 s), 0.30 s smooth ring
//   title-D-production.wav  production 2026.11.16.2's own sound (the fallback), from its own code
// Each tap: a 7 ms fade-in (softer attack), its natural decay with a gentle fade at the end, pitch 0.96-1.08 (adjacent letters at
// least 2% apart), and the whole roll-in matched to production's loudness (loudest 100 ms above 250 Hz).
// Usage: node make-candidates.cjs <production index.html>
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const SR=E.SR,OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence'),root=path.resolve(__dirname,'../..');
const LET=[0,1,2,3,4,5,6].map(i=>.15+i*.09),SEG=1.6,V=.8;
const dec=(f,from,dur)=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-ss',String(from),'-t',String(dur),'-i',f,'-f','f32le','-ac','1','-ar','44100','-']);return Float32Array.from(new Float32Array(raw.buffer,raw.byteOffset,raw.length/4));};
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(SR*.1);let m=0;for(let k=0;k<pb.length;k+=Math.round(w/8))m=Math.max(m,E.rms(pb.subarray(k,Math.min(pb.length,k+w))));return 20*Math.log10(m);};
function wav(f,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
 for(let i=0;i<a.length;i++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(a[i]*32767))),44+i*2);fs.writeFileSync(f,b);}
// production (D), from its own code, the same way as make-clip-restore.cjs
function production(file){const src=fs.readFileSync(file,'utf8');if(!src.includes("else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}"))throw new Error('not the production coin line');
 const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5,ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};
 const r=E.seeded(5);c.Math.random=E.seeded(3);c.window={AudioContext:function(){return ac;}};vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();
 for(const t of LET){ac.currentTime=t;c.sfx._pgSteel(t,.35*V,1+r()*.4,false);}return E.render(ac,SEG);}
const prod=production(process.argv[2]),target=loud(prod);
// one tap: start at the strike, soft 7 ms fade-in, natural ring, gentle fade over the last 35%
function tap(file,from,len){const x=dec(file,from,len+.02);let i=0;const thr=Math.max(...x.map(Math.abs))*.3;while(i<x.length&&Math.abs(x[i])<thr)i++;i=Math.max(0,i-Math.round(.002*SR));
 const y=x.slice(i,i+Math.round(len*SR));const fi=Math.round(.007*SR);for(let k=0;k<fi&&k<y.length;k++)y[k]*=k/fi;const fo=Math.round(y.length*.35);for(let k=0;k<fo;k++)y[y.length-1-k]*=Math.pow(k/fo,1.5);return y;}
const r=E.seeded(21);const pitches=[];for(let i=0;i<7;i++){let p;do{p=.96+r()*.12;}while(i&&Math.abs(p-pitches[i-1])<.02);pitches.push(+p.toFixed(3));}
function rollIn(t){const out=new Float32Array(Math.round(SEG*SR));LET.forEach((at,i)=>{const rate=pitches[i],s0=Math.round(at*SR),n=Math.floor((t.length-1)/rate);for(let k=0;k<n&&s0+k<out.length;k++){const q=k*rate,j=Math.floor(q),f=q-j;out[s0+k]+=t[j]*(1-f)+t[j+1]*f;}});
 const g=Math.pow(10,(target-loud(out))/20);for(let k=0;k<out.length;k++)out[k]*=g;return {out,gain:g};}
const C={A:tap(path.join(root,'freesound_gamestudio-drop-coin-384921.mp3'),.06,.48),B:tap(path.join(root,'dragon-studio-dropping-a-coin-478359.mp3'),.09,.50),C:tap(path.join(root,'voicebosch-single-coin-170397.mp3'),18.36,.30)};
const rep={productionLoudestDb:+target.toFixed(1),pitches,letters:LET.map(t=>+(t+.45).toFixed(2))};
for(const [k,t] of Object.entries(C)){wav(path.join(__dirname,'taps','tap-'+k+'.wav'),t);const {out,gain}=rollIn(t);wav(path.join(OUT,'title-'+k+'.wav'),out);rep[k]={loudestDb:+loud(out).toFixed(1),peak:+E.peak(out).toFixed(3),tapGainToMatchProduction:+gain.toFixed(4),tapLenS:+(t.length/SR).toFixed(2)};}
wav(path.join(OUT,'title-D-production.wav'),prod);rep.D={loudestDb:+target.toFixed(1),peak:+E.peak(prod).toFixed(3)};
fs.writeFileSync(path.join(OUT,'title-candidates.json'),JSON.stringify(rep,null,1));console.log(JSON.stringify(rep));
