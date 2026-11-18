// CP-57 title restore checks: only sfx.pg('coin') differs from UAT 86 and it is production 2026.11.16.2's line byte for byte; the
// word drop-in gives one production clink per letter at each letter's landing (no recording, no landing path, no buffer); the
// title's other sound code is identical to production's; muted = silent.
// Usage: node checks-title-restore.cjs <production index.html> [build] [base]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const PROD=path.resolve(process.argv[2]),src=path.resolve(process.argv[3]||path.join(__dirname,'release-title-restore.html')),base=path.resolve(process.argv[4]||path.join(__dirname,'../cp86/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const PROD_LINE="else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}";
(async()=>{const root=path.resolve(__dirname,'..','..'),prodJson=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prodJson);
 const t=fs.readFileSync(src,'utf8'),b=fs.readFileSync(base,'utf8'),p=fs.readFileSync(PROD,'utf8');
 check('0 only the title coin line differs from UAT 86',t.replace(PROD_LINE,"else if(kind==='coin'){CP54.coin(.35*v/.8,true);}").replace(/const BUILD = '[^']*';/,b.match(/const BUILD = '[^']*';/)[0])===b);
 const pick=(s,a,z)=>{const i=s.indexOf(a),j=s.indexOf(z,i);return i<0||j<0?null:s.slice(i,j);};
 const parts=[['sfx.pg (whole function)','sfx.pg=function(kind,vol=1){','\n};'],['steelAt','function steelAt(','function clinkAt'],['tone','function tone(','function noise('],['noise','function noise(','function steelAt('],['master gain','master = ac.createGain()','noiseBuf ='],
  ['letter timing','function pgTitleTick(dt){','function pgTitleCoin('],['pgSfx','function pgSfx(kind,vol=1){','\n']];
 const same=parts.map(([n,a,z])=>[n,pick(t,a,z)!==null&&pick(t,a,z)===pick(p,a,z)]);
 check('1 the title sound code is identical to production 2026.11.16.2 (sfx.pg, steelAt, tone, noise, master, letter timing, pgSfx)',same.every(x=>x[1]),same);
 const g=await game({src,seed:4});const st=strictAudio(g);try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');for(let i=0;i<30;i++)g.tick();
 g.c.__st=()=>st.started.length;
 g.run(`globalThis.__T=[];const pg=sfx.pg;sfx.pg=function(k,...a){if(k!=='coin')return pg.call(this,k,...a);const e={at:+PGU.title.t.toFixed(3),n0:__st()};const ps=sfx._pgSteel;let s=0;sfx._pgSteel=function(...x){s++;return ps.apply(this,x);};const r=pg.call(this,k,...a);sfx._pgSteel=ps;e.n1=__st();e.steel=s;__T.push(e);return r;};
  globalThis.__rec=0;const rp=recordedSfx.playWhy;recordedSfx.playWhy=function(...a){__rec++;return rp.apply(this,a);};const rp2=recordedSfx.play;recordedSfx.play=function(n,...a){if(n==='land')__rec++;return rp2.call(this,n,...a);};
  globalThis.__land=0;const cl=CP54.coin;CP54.coin=function(...a){__land++;return cl.apply(this,a);};PGU.screen='title';PGU.title={t:0,coins:[],snd:0};`);
 const s0=st.started.length;for(let i=0;i<150;i++)g.tick();const T=J(g,'__T');
 const per=T.map(x=>{const L=st.started.slice(x.n0,x.n1);return {at:x.at,steel:x.steel,buffers:L.filter(n=>n.buffer&&n.buffer.len).length,nodes:L.length};});notes.per=per;
 const expect=[...'CatCoin'].map((c,i)=>+(.3+i*.09+.3).toFixed(2));
 check('2 the word drop-in: 7 letters, each exactly one production clink (steelAt) and no recording or buffer',per.length===7&&per.every(x=>x.steel===1&&x.buffers===0&&x.nodes>0),per);
 check('3 each clink on its letter\'s landing (0.60, 0.69 ... 1.14 s, within one frame)',per.every((x,i)=>Math.abs(x.at-expect[i])<=1/60+1e-6),{at:per.map(x=>x.at),expect});
 check('4 no coin-landing recording and no landing path on the title',J(g,'__rec')===0&&J(g,'__land')===0,{rec:J(g,'__rec'),land:J(g,'__land')});
 g.run('S.muted=true');const n0=st.started.length;g.run("sfx.pg('coin',.8)");check('5 muted: silent',st.started.length===n0);
 notes.errs=J(g,'__errs');check('6 no frame errors',!notes.errs.length,notes.errs.slice(0,2));g.close();
 check('7 production untouched',sha(prodJson)===prod0);
 fs.writeFileSync(path.join(OUT,'checks-title-restore.json'),JSON.stringify({build:src,base,production:PROD,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
