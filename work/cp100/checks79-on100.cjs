// UAT 99 checks (CP-79 Yawn sound as a Developer choice, Jenny Nov 18).
// 0 the build is the base + build name + cp79-yawn.js (nothing else)
// 1 the 3 embedded sounds are the Step 1b files (A2, B2, AB), byte for byte
// 2 default (nothing saved): Today; the Yawn plays today's code-made sound (no recorded buffer played)
// 3 each saved choice A2/B2/AB: every wheel Yawn plays exactly that recording once, at 0.35 x the volume wild2 uses
// 4 the choice is saved (CP79.set writes catpusher.uat.cp79yawn.v1) and a fresh start reads it back; junk falls back to Today
// 5 every choice: the game is otherwise identical to the base (frames before, during and after the Yawn; the Yawn's play:
//   grabs, eating, prizes, coins, score); no frame errors
// 6 muted: nothing plays
// 7 production and the UAT channel untouched
// Usage: node checks79.cjs        (release.html on the base in release-version.json)
//        DEV=1 node checks79.cjs  (release-dev.html on published UAT 96; preparation)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=E.base;
const out=path.resolve(__dirname,'../../tickets/CP-72-evidence/uat'+V.displayName.split(' ').pop()+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const KEY='catpusher.uat.cp79yawn.v1';
// spies: decoding gives a stand-in buffer named after the sound; playing a buffer is recorded (no real audio in the harness)
const SPY="globalThis.__pb=[];for(const k in CP79.asked)delete CP79.asked[k];sfx._dec=function(ab,cb){const n=ab.byteLength;cb({cp79:Object.keys(CP79.B64).find(k=>atob(CP79.B64[k]).length===n)||'?'});return true;};"+
 "sfx._playBuf=function(b,v,r){if(S.muted)return false; /* the real _playBuf -> _w2ok -> ready(): muted plays nothing */__pb.push([b&&b.cp79||'other',+v.toFixed(4)]);return true;};globalThis.__yawnCalls=0;{const w=sfx.wild2;sfx.wild2=function(k,...a){if(k==='yawn')__yawnCalls++;return w.call(this,k,...a)};}";
const TR="(()=>{const Y=W2_YAWN;return [Y?+Y.t.toFixed(3):-1,Y?Y.grabs.map(x=>[x.id,!!x.held,!!x.gone,!!x.missed,x.bites||0]):0,bodies.length,bodies.reduce((s,b)=>{const p=b.rb.translation();return s+p.x*3+p.y*5+p.z*7;},0).toFixed(4),S.coins,JSON.stringify(WILD.have||{})];})()";
async function run(file,{choice=null,spy=false,muted=false}={}){
 const storage={'catpusher.uat.devdefault.v1':'1'};if(choice)storage[KEY]=choice;
 const g=await make({sourceFile:file,render:true,seed:7,pixelRatio:1,width:360,height:640,storage});g.c.Path2D=require(NAPI).Path2D;g.c.atob=s=>Buffer.from(s,'base64').toString('latin1'); // the harness has no atob (every browser does)
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted='+(muted?'true':'false'));ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('tuxedo');");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){if(g.run("WILD.phase")==='card'){g.c.draw();const pl=J(g,'(typeof PGA==="object"&&PGA.L&&PGA.L.play)||null');if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2);}g.tick();}
 ticks(240);for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));}
 g.run('WILD.nextBonus=999;WILD.left=60;');if(spy)g.run(SPY);
 const png=()=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');},H=b=>crypto.createHash('sha256').update(b).digest('hex');
 const r={frames:{},trace:[]};r.frames.before=H(png());
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 const at=s=>{let n=0;while(!(g.run('W2_YAWN&&W2_YAWN.t')>=s)&&n++<2000){g.tick();if(n%6===0)r.trace.push(g.run('JSON.stringify('+TR+')'));}};
 at(1.0);r.frames.yawn=H(png());at(3.62);r.frames.eat=H(png());
 let n=0;while(g.run('!!W2_YAWN')&&n++<1200){g.tick();if(n%6===0)r.trace.push(g.run('JSON.stringify('+TR+')'));}
 ticks(30);r.frames.after=H(png());r.trace=crypto.createHash('sha256').update(r.trace.join('|')).digest('hex');
 if(spy){r.pb=J(g,'__pb');r.yawnCalls=g.run('__yawnCalls');r.pick=g.run('CP79.get()');r.vol=g.run("typeof pickupFx==='object'?pickupFx.volume:1");
  g.run("CP79.set('AB')");r.saved=J(g,"localStorage.getItem('"+KEY+"')");}
 r.errs=J(g,'__errs');g.close();return r;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp99/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='3fbd5411afe2eab752044dd7393ece425fdc5e9fd4227a2848277bbb2e8931c1')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published cp99 + build name + CP-72 ending (everything else unchanged)',S===B&&m.length===1);}
 {const js=fs.readFileSync(path.join(__dirname,'../cp99/cp79-yawn.js'),'utf8'),r={};let ok=true;for(const k of ['A2','B2','AB']){const m=js.match(new RegExp(k+':"([A-Za-z0-9+/=]+)"'));
   const same=!!m&&Buffer.from(m[1],'base64').equals(fs.readFileSync(path.resolve(__dirname,'../cp79-yawn-sound/audio/yawn-sound-'+k+'.mp3')));r[k]=same;ok=ok&&same;}
  check('1 the 3 embedded sounds are the Step 1b files (A2, B2, AB), byte for byte',ok,r);}
 const ref=path.join(__dirname,'ref-base-named.html');{let B=fs.readFileSync(base,'utf8');for(const [a,b] of E.edits)B=B.split(a).join(b);fs.writeFileSync(ref,B);}
 notes.reference='frames and play compared with the base renamed to this build name (ref-base-named.html): the build name is drawn on screen';
 const R={base:await run(ref)};for(const c of [null,'A2','B2','AB','junk'])R[c||'default']=await run(src,{choice:c,spy:true});
 {const d=R.default;check("2 default (nothing saved): Today; the Yawn plays today's code-made sound (no recording played)",d.pick==='today'&&d.yawnCalls===1&&d.pb.length===0,{pick:d.pick,calls:d.yawnCalls,pb:d.pb});}
 {const r={};let ok=true;for(const k of ['A2','B2','AB']){const x=R[k];r[k]={pick:x.pick,pb:x.pb,vol:x.vol};ok=ok&&x.pick===k&&x.yawnCalls===1&&x.pb.length===1&&x.pb[0][0]===k&&Math.abs(x.pb[0][1]-.35*x.vol)<1e-4;}
  check('3 each saved choice plays exactly that recording once per Yawn, at 0.35 x the volume wild2 uses',ok,r);}
 {const ok=Object.keys(R).filter(k=>k!=='base').every(k=>R[k].saved==='AB')&&R.junk.pick==='today'&&R.junk.pb.length===0;
  check('4 the choice is saved (catpusher.uat.cp79yawn.v1) and read back at start; an unknown value falls back to Today',ok,{junk:R.junk.pick,saved:R.default.saved});}
 {const r={};let ok=true;for(const k of ['default','A2','B2','AB']){const a=R[k],b=R.base;r[k]=['before','yawn','eat','after'].map(f=>a.frames[f]===b.frames[f]).concat([a.trace===b.trace,a.errs.length]);ok=ok&&r[k].slice(0,5).every(Boolean)&&!a.errs.length&&!b.errs.length;}
  check('5 every choice: frames (before, during and after the Yawn) and the Yawn\'s play identical to the base; no frame errors',ok,r);}
 {const m=await run(src,{choice:'B2',spy:true,muted:true});check('6 muted: nothing plays',m.pb.length===0,{pb:m.pb});}
 check('7 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks79-on100.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
