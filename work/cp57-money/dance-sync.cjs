// CP-57 bug (Jenny, UAT 77: "the music beat no longer matches the tapping"): a Dance break with a tap exactly on every beat,
// on several builds. Logs, per build: when each kick is scheduled on the audio clock vs its beat on the beat clock (music sync),
// the hit/miss judging, what was banked, the finale callout and the coins it pays.
// Usage: node dance-sync.cjs name=release.html ...   -> tickets/CP-57-evidence/dance-sync.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const B=Object.fromEntries(process.argv.slice(2).map(a=>{const [n,f]=a.split('=');return [n,path.resolve(f)];}));
async function run(file){const g=await game({src:file,seed:7,render:false});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:.5,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 g.run('S.muted=false;S.dev=false');g.ticks(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.ticks(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();}
 g.run(`globalThis.__C=[];const co=callout;callout=function(t,...a){__C.push(String(t));return co.call(this,t,...a);};
  globalThis.__K=[];for(const m of [sfx.danceLoud?'danceLoud':'dance']){const o=sfx[m];sfx[m]=function(k,v,d=0,...a){if(k==='kick')__K.push(+(danceNow()+d).toFixed(4));return o.call(this,k,v,d,...a);};}`);
 g.run('danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k++<300)g.tick();
 const D0=J(g,'{p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n,latency:WILD.dance.latency,lat:sfx.danceLatency()}');
 for(let b=0;b<D0.n;b++){const target=g.run(`WILD.dance.p0+${b}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target-1/120)g.tick();g.tap();} // a tap on every beat (the harness's tap: no timeStamp, judged at the simulated now)
 const before=J(g,'WILD.dance?{hits:WILD.dance.hits,misses:WILD.dance.misses,bank:WILD.dance.bank,judged:WILD.dance.judged}:null');
 k=0;while(g.run('!!WILD.dance')&&k++<60*30)g.tick();
 // music sync: each kick's scheduled time (beat clock, adding back the output delay) vs its beat
 const kicks=J(g,'__K').map(t=>t+D0.lat),err=kicks.slice(0,D0.n).map((t,i)=>+((t-(D0.p0+i*D0.beat))*1000).toFixed(2));
 const r={beat:D0,kickErrorMs:err,maxKickErrorMs:Math.max(...err.map(Math.abs)),beforeFinale:before,callouts:J(g,'__C').filter(c=>/RAIN|MISSED|COIN/.test(c)),danceCoins:J(g,'WILD.danceCoins')};g.close();return r;}
(async()=>{const out={};for(const [n,f] of Object.entries(B)){out[n]=await run(f);const r=out[n];console.log(n,'kick error max',r.maxKickErrorMs,'ms | hits',r.beforeFinale&&r.beforeFinale.hits,'misses',r.beforeFinale&&r.beforeFinale.misses,'bank',JSON.stringify(r.beforeFinale&&r.beforeFinale.bank),'| callouts',JSON.stringify(r.callouts),'| danceCoins',r.danceCoins);}
 let bad=0;for(const [n,r] of Object.entries(out)){const b=r.beforeFinale||{},bank=b.bank?b.bank.coin+b.bank.rain5+b.bank.rain10:0,ok=b.hits===r.beat.n&&bank===r.beat.n&&r.danceCoins+ (r.danceRain||0)>=r.beat.n-((b.bank&&b.bank.rain5)||0)&&r.maxKickErrorMs<1;r.pass=ok;if(!ok){bad++;console.log('FAIL',n,'hits',b.hits,'bank',bank,'danceCoins',r.danceCoins,'kickErr',r.maxKickErrorMs);}else console.log('PASS',n);}
 if(bad)process.exitCode=1;
 fs.writeFileSync(path.resolve(__dirname,'../../tickets/CP-57-evidence/dance-sync.json'),JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exit(1)});
