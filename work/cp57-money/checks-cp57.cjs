// CP-57 checks (real runtime, strict fake Web Audio): the bell split over the edge, the register on the bell's exact timing,
// the gold 5's register, unchanged plain coins, the Dance break beat on the louder bus, and nothing else changed vs the base.
// Usage: node checks-cp57.cjs [build] [base]   -> tickets/CP-57-evidence/checks-cp57.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'../cp73/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
async function boot(file){const g=await game({src:file,seed:5});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){if(!Number.isFinite(x)||x<=0)throw new TypeError('rate '+x);v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:1.1,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');
 g.ticks(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.ticks(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();}
 g.run(`globalThis.__S=[];const L=(n)=>__S.push(n);
  const pu=sfx.pickup;sfx.pickup=function(k,v,d=0){if(k==='bell')L({s:'bell',v:+(+v).toFixed(4),d:+(+d).toFixed(3)});return pu.apply(this,arguments);};
  const kc=sfx.kaching;sfx.kaching=function(){L({s:'kaching'});return kc.apply(this,arguments);};
  if(sfx._playBufAt){const pb=sfx._playBufAt;sfx._playBufAt=function(b,v,d=0){L({s:CP57.bufs.includes(b)?'register':'coin-take',v:+(+v).toFixed(4),d:+(+d).toFixed(3)});return pb.apply(this,arguments);};}
  const ce=C46.edge;C46.edge=function(b){L({s:'coin-edge'});return ce.apply(this,arguments);};`);
 g.st=st;return g;}
const CASES=[['prize (cheese)','item','cheese','register'],['prize (yarn)','item','yarn','register'],['Jingle bell prize','item','bell','bell'],
 ['Coin rain 5','rain5',null,'register'],['Coin rain 10','rain10',null,'register'],['Coin rain 25','rain25',null,'register'],['gold 5 rain coin','gold5',null,'register'],
 ['Quake coin','quake',null,'bell'],['music note coin','note',null,'bell'],['fish coin','fish',null,'bell'],['laser coin','laser',null,'bell'],['heart coin','heart',null,'bell'],['mouse coin','mousecoin',null,'bell'],
 ['plain coin','coin',null,'none'],['plain rain coin','coin',null,'none',true]];
function edge(g,kind,id,rain){g.run('__S.length=0;board.status="playing";');
 g.run(`(()=>{const b=addCoin('${kind}',${id?`'${id}'`:'null'},200,8,T.FRONT-2);${rain?'b.rain=true;':''}fallOff(b,200);})()`);
 const first=J(g,'__S').filter(x=>['bell','register','kaching'].includes(x.s));g.ticks(70);return first;}
(async()=>{
 const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 // 0. only the CP-57 lines differ from the base
 {const text=fs.readFileSync(src,'utf8'),before=fs.readFileSync(base,'utf8');let r=text;
  r=r.replace(/const BUILD = '[^']*';/,before.match(/const BUILD = '[^']*';/)[0]);
  r=r.replace(/\n    \/\/ CP-57: play a decoded buffer.*?danceLoud\(kind,vol=1,delay=0,arg=0\)\{[^\n]*\},/s,'');
  {const i=r.indexOf('function danceSchedule(D){'),j=r.indexOf('\n}',i);r=r.slice(0,i)+r.slice(i,j).replace(/sfx\.danceLoud\(/g,'sfx.dance(')+r.slice(j);}
  r=r.replace("ledgeBell(id); // the collection moment: the prize has just dropped over the ledge (CP-57: the register or the bell, by piece)","ledgeBell(); // the collection moment: the prize has just dropped over the ledge");
  r=r.replace("function ledgeBell(id){const now=time*1000;","function ledgeBell(){const now=time*1000;");
  r=r.replace(/nextLedgeBell=now\+wait\+LEDGE_BELL_GAP;const vol=.*?sfx\.pickup\('bell',vol,wait\/1000\);return true;\}[^\r\n]*/s,"nextLedgeBell=now+wait+LEDGE_BELL_GAP;sfx.pickup('bell',pickupFx.volume*LEDGE_BELL_LEVEL[n]*CP51_BELL,wait/1000);return true;}");
  r=r.replace("try{ledgeBell('gold5');}catch(e){}}; // CP-57: was sfx.kaching()","try{sfx.kaching();}catch(e){}};");
  r=r.replace(/\n\/\/ ---------- CP-57 \(Jenny, Nov 16\): money sounds ----------\n.*?\/\/ decode the takes early\n/s,'');
  check('0 only the CP-57 lines differ from the base (build name, sfx helpers, Dance beat bus, ledge bell slot, gold 5, CP57 block)',r===before);}
 // 1. what plays over the edge, per piece
 const g=await boot(src),res={};
 for(const [label,kind,id,want,rain] of CASES){const s=edge(g,kind,id,rain);res[label]=s;const kinds=s.map(x=>x.s);
  const ok=want==='none'?!kinds.length:(kinds.length===1&&kinds[0]===want);check(`1 ${label}: ${want==='none'?'no bell, register or ka-ching (unchanged coin sound)':want}`,ok,s);}
 notes.edge=res;notes.stats=J(g,'CP57.stats');
 // 2. a burst of 5 prizes in one frame: the register follows the bell's exact schedule (base build, same burst)
 const burst=async(gg)=>{gg.ticks(90);gg.run('__S.length=0;board.status="playing";');gg.run(`for(const [i,id] of ['cheese','yarn','duck','mouse','shrimp'].entries()){const b=addCoin('item',id,120+i*40,8,T.FRONT-2);fallOff(b,120+i*40);}`);return J(gg,'__S').filter(x=>['bell','register'].includes(x.s));};
 const nb=await burst(g),gb=await boot(base),ob=await burst(gb);gb.close();
 const REG=J(g,"(()=>{const m=String(CP57.register);return null})()");
 const reg=+fs.readFileSync(src,'utf8').match(/REG_GAIN=([0-9.]+)/)[1];
 const same=nb.length===ob.length&&nb.every((x,i)=>x.s==='register'&&ob[i].s==='bell'&&Math.abs(x.d-ob[i].d)<1e-3&&Math.abs(x.v/reg-ob[i].v)<1e-3);
 check('2 a burst of 5 prizes: registers at the bell\'s exact delays and relative levels (UAT 71 bells), 4th and 5th skipped as before',same&&nb.length===3,{new:nb,old:ob});
 notes.burst={new:nb,old:ob,REG_GAIN:reg};
 // 3. the rotation never repeats a take
 {g.run('globalThis.__T=[];const R=CP57.register;');const picks=J(g,"(()=>{const out=[];const pb=sfx._playBufAt;sfx._playBufAt=function(b){out.push(CP57.bufs.indexOf(b));return true;};for(let i=0;i<60;i++)CP57.register(.5,0);sfx._playBufAt=pb;return out;})()");
  const rep=picks.some((x,i)=>i&&x===picks[i-1]),used=new Set(picks).size;check('3 register rotation: 60 rings use all 5 takes, never the same twice in a row',!rep&&used===5,{used,rep});}
 // 4. the Dance break beat goes through the louder bus; hits stay on the master
 {const t=fs.readFileSync(src,'utf8');const i=t.indexOf('function danceSchedule(D){'),j=t.indexOf('\n}',i),body=t.slice(i,j);
  check('4a every beat sound in danceSchedule uses danceLoud (no plain sfx.dance left there)',!/sfx\.dance\(/.test(body)&&(body.match(/sfx\.danceLoud\(/g)||[]).length>=10);
  check('4b DANCE_MUSIC_GAIN is +10 dB (3.1623)',/const DANCE_MUSIC_GAIN=3\.1623;/.test(t));
  g.run('globalThis.__dl=0;const dl=sfx.danceLoud;sfx.danceLoud=function(...a){__dl++;return dl.apply(this,a);};danceStartNow&&danceStartNow();');let k=0;while(!g.run('!!WILD.dance')&&k++<400)g.tick();g.ticks(240);
  check('4c a real Dance break schedules its beat through danceLoud',J(g,'__dl')>10,J(g,'__dl'));}
 // 7. coins never plink: real coin takes for coin bumps, rain drips, sky landings, topples and the pour; prizes keep their plink
 {const nodes=()=>g.st.started.length;const kindOf=(from)=>{const L=g.st.started.slice(from);return {take:L.filter(n=>n.buffer&&n.buffer.len).length,code:L.filter(n=>!(n.buffer&&n.buffer.len)).length};};
  const T=(label,js)=>{g.ticks(10);const n0=nodes();g.run(js);return kindOf(n0);};
  const r={coinBump:T('coin bump',"C46.hit({kind:'coin'},.8)"),goldBump:T('gold bump',"C46.hit({kind:'gold5',c46:1},.8)"),rainFirstTouch:T('rain coin first touch',"C46.hit({kind:'coin',rain:true},.6)"),
   prizeBump:T('prize bump',"C46.hit({kind:'item',id:'yarn'},.8)"),drip:T('drip',"sfx.wild('drip',.6)"),skyLanding:T('sky landing',"sfx.wild2('land',.8)"),topple:T('topple',"sfx.wild('topple',1)"),pour:T('pour',"sfx.dance('pour',.7,.5)")};
  notes.coins=r;notes.coinStats=J(g,'CP57C.stats');
  for(const k of ['coinBump','goldBump','rainFirstTouch','drip','skyLanding','topple','pour'])check(`7 ${k}: one real coin take, nothing code-made`,r[k].take===1&&r[k].code===0,r[k]);
  check('7 prizeBump: keeps its plink (code-made, no coin take)',r.prizeBump.take===0&&r.prizeBump.code>0,r.prizeBump);
  const picks=J(g,"(()=>{const out=[];const pb=sfx._playBufAt;sfx._playBufAt=function(b){out.push(CP57C.bufs.bump.indexOf(b));return true;};for(let i=0;i<40;i++){CP57C.play('bump',.5);}sfx._playBufAt=pb;return out;})()");
  check('7 bump rotation: all 8 takes used, never the same twice in a row',new Set(picks).size===8&&!picks.some((x,i)=>i&&x===picks[i-1]),{used:new Set(picks).size});}
 notes.errs=J(g,'__errs');check('5 no frame errors',!notes.errs.length,notes.errs.slice(0,3));g.close();
 check('6 production untouched',sha(prod)===prod0);
 fs.writeFileSync(path.join(OUT,'checks-cp57.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
