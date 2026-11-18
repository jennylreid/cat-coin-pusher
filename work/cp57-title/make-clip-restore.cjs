// CP-57 title restore: one WAV per version (never combined), the 7 "CatCoin" letters 0.09 s apart at in-game level, each rendered
// from that build's own code with the same random pitches:
//   title-production.wav   production 2026.11.16.2
//   title-fix.wav          the restore (UAT 86 + production's coin line)
//   title-today-uat86.wav  today's UAT 86 (coin-land.mp3 through the landing path; approximate: restarts per letter, at most 3)
// Usage: node make-clip-restore.cjs <production index.html>   -> tickets/CP-57-evidence/title-*.wav
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const SR=E.SR,OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence'),root=path.resolve(__dirname,'../..');
const LET=[0,1,2,3,4,5,6].map(i=>.15+i*.09),SEG=1.6,V=.8;
function render(file){const src=fs.readFileSync(file,'utf8');const line=src.match(/else if\(kind==='coin'\)\{[^}]*\}/)[0];
 if(line!=="else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}")throw new Error('not the production coin line: '+line);
 const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5,ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};
 const r=E.seeded(5);c.Math.random=E.seeded(3);c.window={AudioContext:function(){return ac;}};vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();
 for(const t of LET){ac.currentTime=t;c.sfx._pgSteel(t,.35*V,1+r()*.4,false);}return E.render(ac,SEG);}
const dec=f=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-i',f,'-f','f32le','-ac','1','-ar','44100','-']);return new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);};
function wav(f,a){const b=Buffer.alloc(44+a.length*2);b.write('RIFF',0);b.writeUInt32LE(36+a.length*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(a.length*2,40);
 for(let i=0;i<a.length;i++)b.writeInt16LE(Math.max(-32767,Math.min(32767,Math.round(a[i]*32767))),44+i*2);fs.writeFileSync(f,b);}
const prod=render(process.argv[2]),fix=render(path.join(__dirname,'release-title-restore.html'));
const land=dec(path.join(root,'dragon-studio-dropping-a-coin-478359.mp3')),today=new Float32Array(Math.round(SEG*SR));
LET.forEach((t,i)=>{const nx=LET[i+3],cut=Math.min(.84,nx!=null?nx-t:9),s0=Math.round(t*SR);for(let k=0;k<Math.round(cut*SR)&&k<land.length&&s0+k<today.length;k++)today[s0+k]+=land[k]*.25*.35;});
wav(path.join(OUT,'title-production.wav'),prod);wav(path.join(OUT,'title-fix.wav'),fix);wav(path.join(OUT,'title-today-uat86.wav'),today);
let diff=0;for(let i=0;i<prod.length;i++)diff=Math.max(diff,Math.abs(prod[i]-fix[i]));
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(SR*.1);let m=0;for(let k=0;k<pb.length;k+=Math.round(w/8))m=Math.max(m,E.rms(pb.subarray(k,Math.min(pb.length,k+w))));return +(20*Math.log10(m)).toFixed(1);};
const rep={production:{loudest100msDb:loud(prod),peak:+E.peak(prod).toFixed(3)},fix:{loudest100msDb:loud(fix),peak:+E.peak(fix).toFixed(3)},todayUat86:{loudest100msDb:loud(today),peak:+E.peak(today).toFixed(3)},maxSampleDifferenceProductionVsFix:diff};
fs.writeFileSync(path.join(OUT,'title-levels.json'),JSON.stringify(rep,null,1));console.log(JSON.stringify(rep));
