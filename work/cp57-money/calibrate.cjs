// CP-57: REG_GAIN so the register takes (on average) match the ledge bell's loudness: loudest 100 ms in the phone band
// (CP-46 engine phoneBand, above 250 Hz). The bell is rendered from the base build's own sfx code with the CP-46 offline
// engine (as bell-coverage.cjs); both through the effects master 0.55. Writes register/calibration.json.
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process');
const base=path.resolve(process.argv[2]||path.join(__dirname,'../cp71/release.html'));
function sfxOf(file,seed=5){const src=fs.readFileSync(file,'utf8');const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
 const ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};c.Math.random=E.seeded(seed);c.window={AudioContext:function(){return ac;}};
 vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();return {sfx:c.sfx,ac};}
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(E.SR*.1);let m=0;for(let k=0;k+w<=pb.length;k+=Math.round(w/4))m=Math.max(m,E.rms(pb.subarray(k,k+w)));return m;};
const dB=x=>+(20*Math.log10(x)).toFixed(2);
const {sfx,ac}=sfxOf(base);ac.currentTime=.02;sfx.pickup('bell',.5);const bell=E.render(ac,1.8);   // the bell at today's level (CP51_BELL 0.5)
const Lb=loud(bell);
const takes=['reg1','reg2','reg3','reg4','reg6'].map(k=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-i',path.join(__dirname,'register',k+'.mp3'),'-f','f32le','-ac','1','-ar','44100','-']);
 const a=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4).map(x=>x*.55);return {k,L:loud(a),peak:E.peak(a)};});
const avg=Math.pow(10,takes.reduce((s,t)=>s+20*Math.log10(t.L),0)/takes.length/20),REG_GAIN=+(Lb/(.5*avg)).toFixed(4); // register(vol=.5) = bell at .5
const out={base,bellAt05:{loudest100msPhoneBandDb:dB(Lb),peak:+E.peak(bell).toFixed(3)},takesThroughMaster:takes.map(t=>({take:t.k,loudDb:dB(t.L),peak:+t.peak.toFixed(3)})),REG_GAIN,
 note:'register(vol) plays at vol*REG_GAIN on the master; at vol 0.5 (today\'s bell level) the takes average the bell\'s loudness',peakAtBellLevel:+Math.max(...takes.map(t=>t.peak*.5*REG_GAIN)).toFixed(3)};
fs.writeFileSync(path.join(__dirname,'register','calibration.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
