// CP-57 (coins over the ledge): gains for the real "coin into the tray" takes and the group beds, through the effects master
// 0.55, matched (loudest 100 ms above 250 Hz, CP-46 engine phoneBand) to what the game meant to play:
//   tray  <- the coin hit in coin-off.mp3 (0.95-1.8 s of the file) at its HTMLAudio volume 0.17. As played today the game
//            stops coin-off.mp3 at 0.85 s, before that hit, so today's single coin-off is ~37 dB down (effectively silent).
//   spill <- coin-spill.mp3 (first 1.8 s) at its volume 0.24 (B takes: the fallback when the spill recording is blocked)
//   pour  <- the same (the 1.4 s spill stretches, for 10+ coins in a second)
// Adds sets 'tray', 'spillBed', 'pourBed' to coins/calibration.json.
const E=require('../cp46-audio/engine.cjs'),fs=require('fs'),path=require('path'),cp=require('child_process');
const root=path.resolve(__dirname,'../..');
const dec=(f,from=0,dur=99)=>{const raw=cp.execFileSync('ffmpeg',['-v','error','-ss',String(from),'-t',String(dur),'-i',f,'-f','f32le','-ac','1','-ar','44100','-']);return new Float32Array(raw.buffer,raw.byteOffset,raw.length/4);};
const loud=a=>{const pb=E.phoneBand(a),w=Math.round(E.SR*.1);let m=0;for(let k=0;k<pb.length;k+=Math.round(w/8))m=Math.max(m,E.rms(pb.subarray(k,Math.min(pb.length,k+w))));return 20*Math.log10(m);};
const sc=(a,g)=>a.map(x=>x*g);
const refTray=loud(sc(dec(path.join(root,'sumaga123-coin-drop-432151.mp3'),.95,.85),.17));
const today=loud(sc(dec(path.join(root,'sumaga123-coin-drop-432151.mp3'),0,.85),.17));
const refSpill=loud(sc(dec(path.join(root,'freesound_community-coin-spill-105867.mp3'),0,1.8),.24));
// Jenny: "there's no sound when coins fall over the ledge". The intended coin-off level is 18 dB under the coin landing (hard to
// hear even when it plays), so the tray takes and the group beds are set 8 dB under the coin landing (coin-land.mp3 at 0.25).
const landing=loud(sc(dec(path.join(root,'dragon-studio-dropping-a-coin-478359.mp3'),0,.84),.25)),TARGET=landing-8;
const set=(names,ref)=>{const t=names.map(k=>{const a=sc(dec(path.join(__dirname,'coins',k+'.mp3')),.55);return {k,L:loud(a),peak:E.peak(a)};});const avg=t.reduce((s,x)=>s+x.L,0)/t.length,gain=+Math.pow(10,(ref-avg)/20).toFixed(4);
 return {refDb:+ref.toFixed(2),takes:t.map(x=>({take:x.k,loudDb:+x.L.toFixed(2),peak:+x.peak.toFixed(3)})),gain,peakAtVol1:+Math.max(...t.map(x=>x.peak*gain)).toFixed(3)};};
const f=path.join(__dirname,'coins','calibration.json'),c=JSON.parse(fs.readFileSync(f,'utf8'));
c.sets.tray=set(['tray1','tray2','tray3','tray4','tray5','tray6'],TARGET);Object.assign(c.sets.tray,{todayCoinOffAsPlayedDb:+today.toFixed(2),intendedCoinOffHitDb:+refTray.toFixed(2),coinLandingDb:+landing.toFixed(2)});
c.sets.spillBed=set(['B1','B2','B3'],TARGET);c.sets.pourBed=set(['pour1','pour2'],TARGET);c.sets.spillBed.coinSpillRecordingDb=+refSpill.toFixed(2);
fs.writeFileSync(f,JSON.stringify(c,null,1));for(const k of ['tray','spillBed','pourBed'])console.log(k,JSON.stringify({ref:c.sets[k].refDb,gain:c.sets[k].gain,peak:c.sets[k].peakAtVol1,today:c.sets[k].todayCoinOffAsPlayedDb}));
