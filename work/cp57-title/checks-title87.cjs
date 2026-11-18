// CP-57 title (UAT 87 prep) checks: only the title coin line and the CP57T block differ from the base; the Developer panel has
// "Title sound" (cycles A-B-C-D, saved) and "Replay title" (restarts the title); with A/B/C each letter is exactly one tap of that
// candidate at its landing, production's level and pitch 0.96-1.08; with D, or before the taps decode, production's clink; default
// A; muted silent. Usage: node checks-title87.cjs [build] [base]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release-title87.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'../cp86/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
async function boot(decode=true,storage={}){const g=await game({src,seed:4,storage});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};
  const cg=P.createGain;P.createGain=function(){const n=cg.call(this);return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){if(!decode)return new Promise(()=>{});const b={duration:.5,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 g.st=st;g.c.__st=()=>st.started.length;g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');for(let i=0;i<30;i++)g.tick();
 g.run(`globalThis.__P=[];const pb=sfx._playBufAt;sfx._playBufAt=function(b,v,d=0,r=1){__P.push({k:Object.keys(CP57T.bufs).find(k=>CP57T.bufs[k]===b)||'other',v:+v.toFixed(5),r:+r.toFixed(3)});return pb.apply(this,arguments);};`);return g;}
function word(g){g.run(`{globalThis.__T=[];if(!globalThis.__pg0)globalThis.__pg0=sfx.pg;const pg=globalThis.__pg0;sfx.pg=function(k,...a){if(k!=='coin')return pg.call(this,k,...a);const e={at:+PGU.title.t.toFixed(3),p0:__P.length};const ps=sfx._pgSteel;let s=0;sfx._pgSteel=function(...x){s++;return ps.apply(this,x);};const r=pg.call(this,k,...a);sfx._pgSteel=ps;e.taps=__P.slice(e.p0);e.steel=s;__T.push(e);return r;};
  PGU.screen='title';PGU.title={t:0,coins:[],snd:0};}`);for(let i=0;i<150;i++)g.tick();const T=J(g,'__T');g.run('sfx.pg=globalThis.__pg0');return T;}
(async()=>{const root=path.resolve(__dirname,'..','..'),prodJson=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prodJson);
 {const t=fs.readFileSync(src,'utf8'),b=fs.readFileSync(base,'utf8');let r=t.replace(/const BUILD = '[^']*';/,b.match(/const BUILD = '[^']*';/)[0]);
  r=r.replace("else if(kind==='coin'){if(!CP57T.tap(v))this._pgSteel(t,.35*v,1+Math.random()*.4,false);} // CP-57: Title sound A/B/C (real coin clinks); D = production's clink","else if(kind==='coin'){CP54.coin(.35*v/.8,true);}");
  r=r.replace(/\/\/ CP-57 \(Jenny, Nov 17\): the title's letter sound, picked on the phone.*?PGU\.screen='title';\};\};\}\n/s,'');
  check('0 only the title coin line and the CP57T block differ from the base',r===b);}
 const G=JSON.parse(fs.readFileSync(src,'utf8').match(/var CP57T=\{KEY:'[^']*',sel:'A',G:(\{[^}]*\})/)[1]);
 const expect=[...'CatCoin'].map((c,i)=>+(.3+i*.09+.3).toFixed(2));
 const g=await boot();
 check('1 default Title sound is A',J(g,'CP57T.sel')==='A');
 const html=J(g,'pgDevHtml()');check('2 the Developer panel has "Title sound" and "Replay title"',/id="pg-tsnd"[^>]*>A</.test(html)&&html.includes('id="pg-treplay"')&&html.includes('>Title sound<'),null);
 // the buttons: a stand-in panel; every other Developer button gets a dummy
 g.run(`globalThis.__btn={};const box={querySelector:s=>(__btn[s]=__btn[s]||{style:{}}),querySelectorAll:()=>[]};globalThis.__panel={querySelector:s=>s==='#pg-dev'?box:null,style:{},scrollTop:0};try{wildDevBind(__panel);}catch(e){__errs.push('bind '+e.message);}`);
 const cyc=[];for(let i=0;i<4;i++){try{g.run("__btn['#pg-tsnd'].onclick()");}catch(e){}cyc.push(J(g,"[CP57T.sel,localStorage.getItem('catpusher.uat.titlesound.v1')]"));}
 check('3 "Title sound" cycles A > B > C > D > A and saves it on the phone',JSON.stringify(cyc.map(x=>x[0]))==='["B","C","D","A"]'&&cyc.every(x=>x[0]===x[1]),cyc);
 g.run("PGU.screen='board';PGU.title.t=5;__panel.style.display='block';__btn['#pg-treplay'].onclick()");check('4 "Replay title" closes Settings and restarts the title',J(g,"PGU.screen==='title'&&PGU.title.t===0&&__panel.style.display==='none'"));
 for(const k of ['A','B','C']){g.run(`CP57T.sel='${k}'`);const T=word(g);notes[k]=T;
  check(`5${k} Title sound ${k}: 7 letters, each exactly one ${k} tap at its landing, production's level (G x v/0.8) and pitch 0.96-1.08, no clink`,
   T.length===7&&T.every((x,i)=>x.taps.length===1&&x.taps[0].k===k&&Math.abs(x.taps[0].v-G[k])<1e-4&&x.taps[0].r>=.96&&x.taps[0].r<=1.08&&x.steel===0&&Math.abs(x.at-expect[i])<=1/60+1e-6),T.map(x=>[x.at,x.taps,x.steel]));
  const rs=T.map(x=>x.taps[0]&&x.taps[0].r);check(`6${k} neighbouring letters differ in pitch by at least 2%`,rs.every((r,i)=>!i||Math.abs(r-rs[i-1])>=.02-1e-3),rs);}
 g.run("CP57T.sel='D'");{const T=word(g);check('7 Title sound D: production\'s clink on every letter, no tap',T.length===7&&T.every(x=>x.steel===1&&x.taps.length===0),T.map(x=>[x.steel,x.taps.length]));}
 g.run("CP57T.sel='A';S.muted=true");{const n0=g.st.started.length;g.run("sfx.pg('coin',.8)");check('8 muted: silent',g.st.started.length===n0);}g.run('S.muted=false');
 notes.errs=J(g,'__errs');check('9 no frame errors',!notes.errs.length,notes.errs.slice(0,3));g.close();
 {const g2=await boot(false);const T=word(g2);check('10 before the taps decode: production\'s clink on every letter (never silent)',T.length===7&&T.every(x=>x.steel===1&&x.taps.length===0));g2.close();}
 {const g3=await boot(true,{'catpusher.uat.titlesound.v1':'C'});check('11 a saved choice is used after a restart',J(g3,'CP57T.sel')==='C');g3.close();}
 check('12 production untouched',sha(prodJson)===prod0);
 fs.writeFileSync(path.join(OUT,'checks-title87.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
