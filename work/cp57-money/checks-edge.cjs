// CP-57 follow-up checks: only the edge patch differs from its base; a single coin over the edge plays one real tray take; a
// spill of 12 coins in 0.5 s gives a spill bed plus varied, jittered, thinned real takes (no machine gun), and a run of 10+ in a
// second a pour bed; muted = nothing; prizes still go their old way. Usage: node checks-edge.cjs [build] [base]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release-edge.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'../cp74/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
(async()=>{const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 {const t=fs.readFileSync(src,'utf8'),b=fs.readFileSync(base,'utf8');let r=t.replace(/const BUILD = '[^']*';/,b.match(/const BUILD = '[^']*';/)[0]);
  r=r.replace(/\/\/ ---------- CP-57 follow-up \(Jenny, Nov 16\): every plain coin over the ledge.*?try\{CP57E\.load\(\);\}catch\(e\)\{\}\};\}\n/s,'');
  check('0 only the build name and the CP57E block differ from the base',r===b);}
 const g=await game({src,seed:5});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:.5,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');
 g.ticks(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.ticks(40);if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();}
 g.run(`globalThis.__P=[];const pb=sfx._playBufAt;sfx._playBufAt=function(b,v,d=0,r=1){__P.push({set:CP57E.bufs.includes(b)?'tray':CP57C.bufs.spill.includes(b)?'spillBed':CP57C.bufs.pour.includes(b)?'pourBed':'other',i:CP57E.bufs.indexOf(b),v:+v.toFixed(3),d:+(+d).toFixed(3),r:+(+r).toFixed(3)});return pb.apply(this,arguments);};
  globalThis.__off=0;const rp=recordedSfx.play;recordedSfx.play=function(n,...a){if(n==='off'||n==='spill')__off++;return rp.call(this,n,...a);};`);
 const coinAt=(x)=>g.run(`(()=>{const b=addCoin('coin',null,${x},8,T.FRONT-2);fallOff(b,${x});})()`);
 g.ticks(60);g.run('__P.length=0');coinAt(200);const single=J(g,'__P');
 check('1 a single coin over the edge: one real tray take, at full single level',single.length===1&&single[0].set==='tray'&&single[0].d===0,single);
 g.ticks(120);g.run('__P.length=0');for(let k=0;k<12;k++){coinAt(120+k*14);g.ticks(2);} // 12 coins in ~0.4 s
 const sp=J(g,'__P'),trays=sp.filter(x=>x.set==='tray'),beds=sp.filter(x=>x.set==='spillBed'||x.set==='pourBed');
 const repeats=trays.some((x,i)=>i&&x.i===trays[i-1].i),jit=new Set(trays.map(x=>x.d)).size,vols=new Set(trays.map(x=>x.v)).size;
 check('2 a spill (12 coins in 0.4 s): a spill bed, plus per-coin real takes that vary (no take twice in a row, different levels and timing)',beds.length>=1&&trays.length>=4&&!repeats&&jit>2&&vols>2,{beds:beds.map(b=>b.set),trays:trays.length,jit,vols});
 check('2b a spill is thinned: fewer per-coin takes than coins (at most one per 50 ms)',trays.length<12,{trays:trays.length});
 g.ticks(150);g.run('__P.length=0');for(let k=0;k<14;k++){coinAt(110+k*13);g.ticks(4);} // 14 coins in ~0.9 s
 const cas=J(g,'__P');check('3 10+ coins within a second: a pour bed',cas.some(x=>x.set==='pourBed'),cas.filter(x=>x.set!=='tray'));
 check('4 no HTMLAudio coin-off/spill for plain coins any more',J(g,'__off')===0,J(g,'__off'));
 g.ticks(60);g.run('S.muted=true;__P.length=0');const n0=st.started.length;coinAt(200);check('5 muted: nothing plays',J(g,'__P').length===0&&st.started.length===n0);g.run('S.muted=false');
 g.ticks(60);g.run(`globalThis.__lb=0;const lb=ledgeBell;ledgeBell=function(...a){__lb++;return lb.apply(this,a);};__P.length=0`);g.run(`(()=>{const b=addCoin('item','yarn',200,8,T.FRONT-2);fallOff(b,200);})()`);
 check('6 a prize over the edge still goes its old way (register in the bell slot), no tray take',J(g,'__lb')===1&&!J(g,'__P').some(x=>x.set==='tray'),J(g,'__P'));
 notes.stats=J(g,'CP57E.stats');notes.errs=J(g,'__errs');check('7 no frame errors',!notes.errs.length,notes.errs.slice(0,2));g.close();
 check('8 production untouched',sha(prod)===prod0);
 fs.writeFileSync(path.join(OUT,'checks-edge.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
