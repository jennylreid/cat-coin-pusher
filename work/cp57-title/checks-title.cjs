// CP-57 title tap checks: only the title's coin line and the CP57T block differ from the base; the word drop-in gives exactly one
// real coin tap per letter, at the letter's landing time, production pitch range, no coin-land recording and no filler; before the
// takes decode it falls back to production's clink; muted = silent. Usage: node checks-title.cjs [build] [base]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release-title.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'../cp86/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
async function boot(file,decode=true){const g=await game({src:file,seed:4});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){if(!decode)return new Promise(()=>{});const b={duration:.09,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 g.st=st;g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');return g;}
function word(g){ // restart the title and watch the 7 letter taps
 g.run(`globalThis.__T=[];const pg=sfx.pg;sfx.pg=function(k,...a){if(k!=='coin')return pg.call(this,k,...a);const e={at:+PGU.title.t.toFixed(3),n0:globalThis.__st()};const r=pg.call(this,k,...a);e.n1=globalThis.__st();__T.push(e);return r;};
  globalThis.__steel=0;const ps=sfx._pgSteel;sfx._pgSteel=function(...a){__steel++;return ps.apply(this,a);};globalThis.__rec=0;const rp=recordedSfx.playWhy;recordedSfx.playWhy=function(...a){__rec++;return rp.apply(this,a);};
  globalThis.__land=0;const cl=CP54.coin;CP54.coin=function(...a){__land++;return cl.apply(this,a);};PGU.screen='title';PGU.title={t:0,coins:[],snd:0};`);
 const s0=g.st.started.length;g.c.__st=()=>g.st.started.length;for(let i=0;i<150;i++)g.tick();
 const T=J(g,'__T'),nodes=g.st.started.slice(s0);
 // nodes started per letter call
 const per=T.map((x,i)=>{const L=nodes.slice(x.n0-s0,x.n1-s0);return {at:x.at,takes:L.filter(n=>n.buffer&&n.buffer.len).map(n=>+n.playbackRate.value.toFixed(3)),code:L.filter(n=>!(n.buffer&&n.buffer.len)).length};});
 return {per,steel:J(g,'__steel'),rec:J(g,'__rec'),land:J(g,'__land')};}
(async()=>{const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 {const t=fs.readFileSync(src,'utf8'),b=fs.readFileSync(base,'utf8');let r=t.replace(/const BUILD = '[^']*';/,b.match(/const BUILD = '[^']*';/)[0]);
  r=r.replace("else if(kind==='coin'){if(!CP57T.tap(.35*v))this._pgSteel(t,.35*v,1+Math.random()*.4,false);} // CP-57: one real coin tap per letter; production's clink until the takes load","else if(kind==='coin'){CP54.coin(.35*v/.8,true);}");
  r=r.replace(/\/\/ CP-57 \(Jenny, Nov 17\): the title taps once per letter again.*?catch\(e\)\{return false;\}\}\};\n/s,'');
  check('0 only the title coin line and the CP57T block differ from the base',r===b);}
 {const g=await boot(src);for(let i=0;i<30;i++)g.tick();g.run('CP57C.load()');for(let i=0;i<5;i++)g.tick();
  const w=word(g);notes.word=w;const expect=[...'CatCoin'].map((c,i)=>+(.3+i*.09+.3).toFixed(2));
  check('1 the word drop-in: 7 calls, each exactly one real coin tap and nothing code-made',w.per.length===7&&w.per.every(x=>x.takes.length===1&&x.code===0),w.per);
  check('2 each tap fires on its letter\'s landing (0.60, 0.69 ... 1.14 s, within one frame)',w.per.every((x,i)=>Math.abs(x.at-expect[i])<=1/60+1e-6),{at:w.per.map(x=>x.at),expect});
  check('3 production\'s pitch range (1-1.4) and different takes',w.per.every(x=>x.takes[0]>=1&&x.takes[0]<=1.4),w.per.map(x=>x.takes[0]));
  check('4 no coin-land recording, no landing path, no filler, no steel clink',w.rec===0&&w.land===0&&w.steel===0,{rec:w.rec,land:w.land,steel:w.steel});
  g.run('S.muted=true');const n0=g.st.started.length;g.run("sfx.pg('coin',.8)");check('5 muted: silent',g.st.started.length===n0);g.run('S.muted=false');
  notes.errs=J(g,'__errs');check('6 no frame errors',!notes.errs.length,notes.errs.slice(0,2));g.close();}
 {const g=await boot(src,false);for(let i=0;i<30;i++)g.tick();const w=word(g);notes.fallback=w;
  check('7 takes not decoded yet: production\'s clink plays for every letter (never silent)',w.per.length===7&&w.steel===7&&w.per.every(x=>x.code>0&&x.takes.length===0),{steel:w.steel});g.close();}
 check('8 production untouched',sha(prod)===prod0);
 fs.writeFileSync(path.join(OUT,'checks-title.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
