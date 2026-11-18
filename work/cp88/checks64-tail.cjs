// CP-64's UAT 86 checks run on the combined UAT 87 (CP-64 Jackpot cascade + CP-57 title sound switch): a copy of work/cp86/checks86.cjs;
// only the build path, the evidence folder (tickets/CP-57-evidence/uat87/checks86-on87.json) and check 0 differ.
// UAT 86 checks (CP-64 Jackpot cascade on UAT 85). base85.html is a byte copy of ../cp85/release.html (published UAT 85).
// Usage: node checks86.cjs   -> tickets/CP-64-evidence/uat86/checks86.json
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm'),{performance:P}=require('perf_hooks');
const make=require('./runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp86/base85.html'),out=path.resolve(__dirname,'../../tickets/CP-69-evidence/uat88');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1200):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick60=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};g.tick20=()=>{ms+=50;g.run('step();step();step();update(.05);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function round(file,{seed,level=3,secs=10,fps=60}){const g=await game(file,{seed});const tk=fps===60?g.tick60:fps===30?g.tick30:g.tick20;
 const sc=()=>+g.run('scale');g.tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick60();g.tap(200,700);for(let i=0;i<30;i++)g.tick60();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick60();
 g.fps=fps;g.per=Math.max(1,Math.round(fps/2));g.k=0;g.play=n=>{for(let i=0;i<n;i++){if(g.k++%g.per===0)g.tap(200+110*Math.sin(g.k/fps*1.2+seed),560);tk();}};
 g.play(secs*fps);g.tk=tk;return g;}
const ST="({jp:!!WILD.jp,t:WILD.jp?WILD.jp.t:null,left:WILD.left,phase:WILD.phase,status:board.status,win:WILD.win,reason:WILD.reason,got:WILD.got,pieces:bodies.filter(b=>!b.dead).length,dance:!!WILD.dance,period:PUSH_PERIOD})";
// run a cascade to its end; returns a per-frame trace summary
function prep(g){let k=0;while(g.run('!!WILD.dance')&&k++<30*g.fps)g.play(1);g.run('WILD.dancePending=null;WILD.danceForce=false;WILD.happy=0;WILD.left=60;WILD.jpPending=true;');k=0;while(!g.run('!!WILD.jp')&&k++<3*g.fps)g.play(1);return g.run('!!WILD.jp');}
function runCascade(g,maxS=14){const tr=[];let t=0,started=null,ended=null,maxPieces=0,maxAwards=0;
 for(let i=0;i<maxS*g.fps;i++){g.play(1);t+=1/g.fps;const s=J(g,"[!!WILD.jp,WILD.left,bodies.filter(b=>!b.dead).length,treatAwards.length,WILD.phase]");
  if(s[0]&&started==null)started=t;if(started!=null&&!s[0]&&ended==null){ended=t;break;}maxPieces=Math.max(maxPieces,s[2]);maxAwards=Math.max(maxAwards,s[3]);if(s[0])tr.push(s[1]);}
 return {started,ended,dur:ended!=null&&started!=null?+(ended-started).toFixed(2):null,leftMin:Math.min(...tr),leftMax:Math.max(...tr),maxPieces,maxAwards,stats:J(g,'CP64.stats')};}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick60();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick60();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close&&g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 check('0 release matches staged manifest',sha(src)===JSON.parse(fs.readFileSync(path.join(__dirname,'publication-manifest.json'))).releaseHTMLSHA256);
 // Resume at the failed rendered pickup check; preceding behavioral checks were already observed passing.
 // 5. the frozen pickup: seven pickups at once give the identical frame trace and sound calls to UAT 85
 check('5 seven simultaneous pickups: identical frame trace and sound calls to UAT 85 (pickup untouched)',(await burst(src))===(await burst(base)));
 // 6. Level 8: tick time during a Jackpot vs normal play (desktop, physics + update, no drawing)
 {const g=await round(src,{seed:2,level:8,secs:15});const time=n=>{const t0=P.now();for(let i=0;i<n;i++)g.play(1);return (P.now()-t0)/n;};
  const pieces=()=>+g.run('bodies.filter(b=>!b.dead).length');const p0=pieces(),normal=time(240);g.run('WILD.left=Math.max(WILD.left,40);WILD.jpPending=true;WILD.dancePending=null;');
  const runs=[];let peak=0;for(let s=0;s<9;s++){runs.push(time(60));peak=Math.max(peak,pieces());}
  const b=await round(base,{seed:2,level:8,secs:15});const timeB=n=>{const t0=P.now();for(let i=0;i<n;i++)b.play(1);return (P.now()-t0)/n;};const baseNormal=timeB(240),baseRuns=[];for(let s=0;s<9;s++)baseRuns.push(timeB(60));
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;notes.level8={piecesBefore:p0,peakDuring:peak,tickMsNormal:+normal.toFixed(2),tickMsJackpotMean:+mean(runs).toFixed(2),tickMsJackpotWorstSecond:+Math.max(...runs).toFixed(2),
   uat85SameSecondsMean:+mean(baseRuns).toFixed(2),uat85WorstSecond:+Math.max(...baseRuns).toFixed(2),perSecond:runs.map(v=>+v.toFixed(2))};
  check('6 Level 8: '+notes.level8.tickMsJackpotMean+' ms per tick during a Jackpot (worst second '+notes.level8.tickMsJackpotWorstSecond+' ms, '+peak+' pieces at most) vs '+notes.level8.uat85SameSecondsMean+' ms for the same seconds of UAT 85 play (desktop)',peak<=230&&!J(g,'__errs').length,notes.level8);g.close&&g.close();b.close&&b.close();}
 // 7. Developer: the button is listed and starts a Jackpot right after GO from the goal card
 {const g=await round(src,{seed:1,level:3,secs:1});const html=g.run('wildDevHtml()');g.run("wildFinish(false,'finish');cp64StartNow();");const ph=g.run('WILD.phase');let k=0;while(!g.run('!!WILD.jp')&&k++<600)g.tick60();
  const at=J(g,"({phase:WILD.phase,goT:+(WILD.goT||0).toFixed(3),jp:!!WILD.jp})");check('7 Developer "Start a Jackpot now": listed above "spin the wheel now"; from a finished round it starts a new round and the Jackpot right after GO',/Start a Jackpot now<\/button><button id="w2-spin"/.test(html)&&ph==='count'&&at.jp&&at.phase==='play'&&at.goT<=.05,{phaseAfterTap:ph,at});g.close&&g.close();}
 // 9. Jenny (Nov 17): no "LOST THE ..." banner during a Jackpot (the prize is still lost); banners as before outside one
 {const g=await round(src,{seed:2,level:3,secs:2});g.run("globalThis.__co=[];const __c9=callout;callout=function(t,o){__co.push(String(t));return __c9.apply(this,arguments);};");
  const LOSE="(()=>{const id=WILD_COLLECTION.find(i=>!WILD.have[i]&&i!==WILD.star)||WILD_COLLECTION.find(i=>i!==WILD.star);delete WILD.have[id];const n0=WILD.lostN;__co.length=0;const b=addCoin('item',id,200,40,600,yawTurn(0));gutterOff(b,20);return {id,lost:WILD.lostN-n0,dead:!!b.dead,banners:__co.filter(t=>/^LOST THE /.test(t)),other:__co.filter(t=>!/^LOST THE /.test(t))};})()";
  const outside=J(g,LOSE);prep(g);const during=J(g,LOSE),jp=g.run('!!WILD.jp');let k=0;while(g.run('!!WILD.jp')&&k++<12*60)g.play(1);g.run('WILD.dancePending=null;');const after=J(g,LOSE);
  const b=await round(base,{seed:2,level:3,secs:2});b.run("globalThis.__co=[];const __c9=callout;callout=function(t,o){__co.push(String(t));return __c9.apply(this,arguments);};");const base85=J(b,LOSE);
  const r={outside,during:{...during,jp},after,uat85:base85};
  check('9 a prize over the side during a Jackpot is lost as normal (lost count, gone) with no "LOST THE ..." banner; before and after the Jackpot the banner shows as in UAT 85',
   jp&&during.lost===1&&during.dead&&!during.banners.length&&outside.lost===1&&outside.banners.length===1&&after.banners.length===1&&base85.banners.length===1&&outside.banners[0]===base85.banners[0]&&!J(g,'__errs').length,r);g.close&&g.close();b.close&&b.close();}
 check('8 production and the UAT channel untouched (not published)',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks64-tail.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
