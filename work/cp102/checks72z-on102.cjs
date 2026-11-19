// UAT 99 checks for the CP-72 add-on: Zoomies sound as a Developer choice (Jenny, Nov 18).
// 1 the 3 embedded sounds are work/cp72-pusher-sound/audio/zoomies-game-{P1,P2,P3}.mp3, byte for byte
// 2 default (nothing saved): Today; Zoomies plays today's turbo rev, no recording
// 3 each saved choice P1/P2/P3: when Zoomies starts (after the title) exactly that recording starts once, at gain x the wild()
//   volume, instead of the rev
// 4 it stops when Zoomies ends (the frame Zoomies is over), and at once when the player leaves mid-Zoomies (Home)
// 5 the round's own Turbo (last seconds) keeps its rev with any choice
// 6 every choice: frames and Zoomies' play (kittens, pieces, coins, score) identical to the base; no frame errors
// 7 muted: nothing plays; 8 the choice is saved and read back; an unknown value falls back to Today
// Usage: node checks72z.cjs | DEV=1 node checks72z.cjs (release-dev.html on published UAT 96)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=path.resolve(__dirname,'../cp98/release.html'),ref=path.join(__dirname,'ref-base-named.html');
{let B=fs.readFileSync(base,'utf8');B=B.replace(/const BUILD = '[^']+';/,"const BUILD = '"+V.displayName+"';");const E101=JSON.parse(fs.readFileSync(path.join(__dirname,'../cp101/edits.json'),'utf8'));for(const [a,b] of E101.edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit');B=B.split(a).join(b);}for(const f of ['../cp100/cp72-ending.js','../cp101/cp82-titles.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const [a,b] of E.edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit102');B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp72-peek.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} // UAT 102: the reference is UAT 101's (UAT 98 + this build's name + the UAT 100 ending block + the CP-82 edit and block) + the UAT 102 edits and cp72-peek.js, so only UAT 99's changes differ
const out=path.resolve(__dirname,'../../tickets/CP-72-evidence/uat'+V.displayName.split(' ').pop()+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const KEY='catpusher.uat.cp72zsound.v1';
const SPY="globalThis.__T=0;globalThis.__pb=[];globalThis.__st=[];globalThis.__rev=[];if(typeof CP72Z==='object'){for(const k in CP72Z.asked)delete CP72Z.asked[k];"+
 "sfx._dec=function(ab,cb){const u=new Uint8Array(ab),O=[700,20011,50023,90037];cb({zs:Object.keys(CP72Z.B64).find(k=>{const s=atob(CP72Z.B64[k]);return s.length===u.length&&O.every(o=>s.charCodeAt(o)===u[o]);})||'?'});return true;};"+
 "sfx._playBufH=function(b,v){if(S.muted)return null;__pb.push([b&&b.zs||'other',+v.toFixed(4),__T]);return {stop:f=>__st.push([__T,f])};};}"+
 "{const w=sfx.wild;sfx.wild=function(k,...a){if(k==='turbo')__rev.push([__T,typeof Z72X!=='undefined'&&!!Z72X]);return w.call(this,k,...a)};}";
// __rev is the outermost wrapper: it sees every turbo call; with a recording chosen, the CP72Z wrapper below it swallows Zoomies' one.
async function boot(file,choice,muted=false){const storage={'catpusher.uat.devdefault.v1':'1'};if(choice)storage[KEY]=choice;
 const g=await make({sourceFile:file,render:true,seed:7,pixelRatio:1,width:360,height:640,storage});g.c.Path2D=require(NAPI).Path2D;g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.tick=()=>{ms+=1000/60;t();g.run('__T++');};
 g.run("globalThis.__T=0;globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.message||e).slice(0,200));return fe(e);}");
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run('S.dev=false;S.muted='+(muted?'true':'false'));ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(240);for(let i=0;i<20;i++){g.tick();await new Promise(r=>setTimeout(r,5));}
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=2;");g.run(SPY);ticks(3);g.ticks=ticks;return g;}
const TR="JSON.stringify([PGPX?PGPX.id:null,typeof Z72X!=='undefined'&&Z72X?Z72X.kits.length:-1,bodies.length,bodies.reduce((s,b)=>{const p=b.rb.translation();return s+p.x*3+p.y*5+p.z*7;},0).toFixed(3),S.coins])";
async function zoom(file,{choice=null,muted=false,leave=false,frames=false}={}){const g=await boot(file,choice,muted);
 const H=()=>{g.c.draw();return crypto.createHash('sha256').update(g.c.document.getElementById('cv').toBuffer('image/png')).digest('hex');};
 const r={fr:[],tr:[]};g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");let endT=-1,startT=-1;
 for(let i=0;i<60*12;i++){g.tick();const z=g.run("typeof Z72X!=='undefined'&&!!Z72X");if(z&&startT<0)startT=g.run('__T');if(startT>=0&&!z&&endT<0)endT=g.run('__T');
  if(i%6===0)r.tr.push(g.run(TR));if(frames&&i%45===0)r.fr.push(H());
  if(leave&&startT>=0&&g.run('__T')===startT+120){g.run('wildExit()');endT=g.run('__T');}
  if(endT>=0&&g.run('__T')>endT+30)break;}
 r.startT=startT;r.endT=endT;r.pb=J(g,'__pb');r.st=J(g,'__st');r.rev=J(g,'__rev');r.vol=g.run("typeof pickupFx==='object'?pickupFx.volume:1");
 r.pick=g.run("typeof CP72Z==='object'?CP72Z.get():null");r.gain=g.run("typeof CP72Z==='object'?CP72Z.gain:null");
 if(!leave&&!muted){g.run('PGPX=null;WILD.turboDone=false;WILD.left=WILD_TURBO_AT+.05;__rev.length=0;__pb.length=0;');g.ticks(20);r.roundTurbo={rev:J(g,'__rev'),pb:J(g,'__pb')};}
 if(typeof CP72Z!=='undefined'){}r.saved=g.run("typeof CP72Z==='object'?(CP72Z.set('P2'),localStorage.getItem('"+KEY+"')):null");
 r.errs=J(g,'__errs');r.trace=crypto.createHash('sha256').update(r.tr.join('|')).digest('hex');delete r.tr;g.close();return r;}
(async()=>{
 {const js=fs.readFileSync(path.join(__dirname,'../cp99/cp72-zsound.js'),'utf8'),r={};let ok=true;for(const k of ['P1','P2','P3']){const m=js.match(new RegExp(k+':"([A-Za-z0-9+/=]+)"'));
   const same=!!m&&Buffer.from(m[1],'base64').equals(fs.readFileSync(path.resolve(__dirname,'../cp72-pusher-sound/audio/zoomies-game-'+k+'.mp3')));r[k]=same;ok=ok&&same;}
  check('1 the 3 embedded sounds are the made files (zoomies-game-P1..P3.mp3), byte for byte',ok,r);}
 const R={base:await zoom(ref,{frames:true}),default:await zoom(src,{frames:true})};for(const k of ['P1','P2','P3','junk'])R[k]=await zoom(src,{choice:k,frames:true});
 {const d=R.default;check("2 default: Today; Zoomies plays today's turbo rev, no recording",d.pick==='today'&&d.pb.length===0&&d.rev.filter(x=>x[1]).length===1,{pick:d.pick,pb:d.pb,rev:d.rev});}
 {const r={};let ok=true;for(const k of ['P1','P2','P3']){const x=R[k];r[k]={pick:x.pick,pb:x.pb,start:x.startT,gain:x.gain};
   ok=ok&&x.pick===k&&x.pb.length===1&&x.pb[0][0]===k&&Math.abs(x.pb[0][1]-x.gain*x.vol)<1e-4&&Math.abs(x.pb[0][2]-x.startT)<=1;}
  check('3 each saved choice: that recording starts once when Zoomies starts (after the title), at gain x the wild() volume, instead of the rev',ok,r);}
 {const r={};let ok=true;for(const k of ['P1','P2','P3']){const x=R[k];r[k]={end:x.endT,stops:x.st};ok=ok&&x.st.length===1&&Math.abs(x.st[0][0]-x.endT)<=1;}
  const L=await zoom(src,{choice:'P2',leave:true});r.leave={end:L.endT,stops:L.st,pb:L.pb};ok=ok&&L.pb.length===1&&L.st.length===1&&Math.abs(L.st[0][0]-L.endT)<=1;
  check('4 it stops the frame Zoomies ends, and at once when the player leaves mid-Zoomies',ok,r);}
 {const r={};let ok=true;for(const k of ['default','P1','P2','P3']){const x=R[k].roundTurbo;r[k]=x;ok=ok&&x&&x.rev.length===1&&x.pb.length===0;}
  check("5 the round's own Turbo keeps its rev with any choice",ok,r);}
 {const r={};let ok=true;for(const k of ['default','P1','P2','P3']){const a=R[k],b=R.base;r[k]=[a.trace===b.trace,a.fr.join()===R.default.fr.join(),a.errs.length];ok=ok&&a.trace===b.trace&&a.fr.join()===R.default.fr.join()&&!a.errs.length&&!b.errs.length;}
  // frames: the sound choice can't change a pixel (same frames for every choice); against the base, UAT 99 also removes the
  // Zoomies gold streaks (checks72s compares those frames with the base)
  check("6 every choice: Zoomies' play identical to the base, and the same frames whatever the choice; no frame errors",ok,r);}
 {const m=await zoom(src,{choice:'P1',muted:true});const ok=m.pb.length===0;check('7 muted: nothing plays',ok,{pb:m.pb});}
 {const ok=R.junk.pick==='today'&&R.junk.pb.length===0&&['default','P1','P2','P3'].every(k=>R[k].saved==='P2');check('8 the choice is saved and read back; an unknown value falls back to Today',ok,{junk:R.junk.pick});}
 fs.writeFileSync(path.join(out,'checks72z-on102.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
