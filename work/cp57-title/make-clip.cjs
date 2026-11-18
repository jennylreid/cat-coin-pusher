// CP-57 title tap: an audio comparison of the "CatCoin" letters rolling in (7 letters, 0.09 s apart), three versions with 1 s of
// silence between them: 1) production 2026.11.16.2 (its own sfx code: one clink per letter), 2) today's UAT 86 (coin-land.mp3
// through the landing path; approximate: each letter restarts the recording, at most 3 at once, the 4th cutting the oldest),
// 3) the fix (one real coin tap per letter: CP-57's coin-on-coin hits at production's pitch range and level). Also each alone.
// Usage: node make-clip.cjs <production index.html>   -> tickets/CP-57-evidence/title-tap-*.wav
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const SR=E.SR,OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence'),root=path.resolve(__dirname,'../..');
const LET=[0,1,2,3,4,5,6].map(i=>.15+i*.09),SEG=1.6,V=.8; // the word's beats: pgSfx('coin',.8) at .6+i*.09 s on the title
function sfxOf(file,seed=3){const src=fs.readFileSync(file,'utf8');const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
 const ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};c.Math.random=E.seeded(seed);c.window={AudioContext:function(){return ac;}};
 vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();return {sfx:c.sfx,ac};}
const dec=f=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-i',f,'-f','f32le','-ac','1','-ar','44100','-']);return new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);};
function add(out,buf,at,gain,rate=1,cut=Infinity){const s0=Math.round(at*SR);const n=Math.min(Math.floor((buf.length-1)/rate),Math.round(cut*SR));for(let k=0;k<n;k++){const x=k*rate,i=Math.floor(x),f=x-i,v=buf[i]*(1-f)+buf[i+1]*f;if(s0+k<out.length)out[s0+k]+=v*gain;}}
// 1) production: its own sfx.pg('coin') per letter
// production's coin line exactly: sfx.pg('coin',v) -> this._pgSteel(t,.35*v,1+Math.random()*.4,false) (Pickup volume 1)
{const src=fs.readFileSync(process.argv[2],'utf8');if(!src.includes("else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}"))throw new Error('not the production coin line');}
const {sfx,ac}=sfxOf(process.argv[2]);const pr=E.seeded(5);for(const t of LET){ac.currentTime=t;sfx._pgSteel(t,.35*V,1+pr()*.4,false);}const prod=E.render(ac,SEG);
// 2) today (UAT 86): coin-land.mp3 at HTMLAudio volume 0.25 x 0.35 per letter, cut at 0.84 s, a pool of 3 (4th restarts the oldest)
const land=dec(path.join(root,'dragon-studio-dropping-a-coin-478359.mp3'));const today=new Float32Array(Math.round(SEG*SR));
LET.forEach((t,i)=>{const next=LET[i+3];add(today,land,t,.25*.35*V/.8,1,Math.min(.84,next!=null?next-t:9));});
// 3) the fix: one coin-on-coin take per letter, rotating, pitch 1-1.4, gain .35 x v x BUMP_GAIN through the master 0.55
const G=JSON.parse(fs.readFileSync(path.join(root,'work/cp57-money/coins/calibration.json'),'utf8')).sets.bump.gain;
const takes=[1,2,3,4,5,6,7,8].map(k=>dec(path.join(root,'work/cp57-money/coins/bump'+k+'.mp3')));const fix=new Float32Array(Math.round(SEG*SR));
let r=E.seeded(9),last=-1;LET.forEach(t=>{let i=Math.floor(r()*8);if(i===last)i=(i+1)%8;last=i;add(fix,takes[i],t,.35*V*G*.55,1+r()*.4);});
function wav(f,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
 for(let i=0;i<a.length;i++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(a[i]*32767))),44+i*2);fs.writeFileSync(f,b);}
const gap=new Float32Array(SR),all=new Float32Array(prod.length+today.length+fix.length+2*SR);all.set(prod,0);all.set(today,prod.length+SR);all.set(fix,prod.length+SR+today.length+SR);
wav(path.join(OUT,'title-tap-compare-production-today-fix.wav'),all);wav(path.join(OUT,'title-tap-1-production.wav'),prod);wav(path.join(OUT,'title-tap-2-today-uat86.wav'),today);wav(path.join(OUT,'title-tap-3-fix.wav'),fix);
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(SR*.1);let m=0;for(let k=0;k<pb.length;k+=Math.round(w/8))m=Math.max(m,E.rms(pb.subarray(k,Math.min(pb.length,k+w))));return +(20*Math.log10(m)).toFixed(1);};
// how distinct are the 7 taps? the level dip between letters (lowest 10 ms between taps vs each tap's peak 10 ms), phone band
function taps(a){const pb=E.phoneBand(a),w=Math.round(SR*.01),db=x=>20*Math.log10(x+1e-9),r=(t0,t1)=>{let mx=0,mn=1e9;for(let s=Math.round(t0*SR);s+w<=Math.round(t1*SR);s+=Math.round(w/2)){const v=E.rms(pb.subarray(s,s+w));mx=Math.max(mx,v);mn=Math.min(mn,v);}return [mx,mn];};
 const d=[];for(let i=0;i<6;i++){const [pk]=r(LET[i],LET[i]+.03),[,dip]=r(LET[i]+.03,LET[i+1]);d.push(+(db(pk)-db(dip)).toFixed(1));}return d;}
const rep={production:{loudest100msDb:loud(prod),peak:+E.peak(prod).toFixed(3),tapToGapDb:taps(prod)},todayUat86:{loudest100msDb:loud(today),peak:+E.peak(today).toFixed(3),tapToGapDb:taps(today)},fix:{loudest100msDb:loud(fix),peak:+E.peak(fix).toFixed(3),tapToGapDb:taps(fix)}};
fs.writeFileSync(path.join(OUT,'title-tap-compare.json'),JSON.stringify(rep,null,1));console.log(JSON.stringify(rep,null,1));
