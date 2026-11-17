// UAT 82 checks (CP-58 change, Jenny Nov 17: eaten prizes are "exactly like a prize that falls off the side"):
// base81.html must equal ../cp81/release.html
// the wheel's YAWN (real wheel stage) eats up to 2 prizes; each is lost at the gulp like a side loss (lost count, "LOST
// THE ...!"), nothing drops back from the Yawn and no "DROP BACK" message; a lost goal prize returns only through the
// normal bonus drop after the wheel is over; no duplicates. With no prize in reach the mitt eats 1-4 coins, all lying on
// top of the pile (bottom layer untouched). Tuxedo power identical to UAT 81; powers wait; wheel waits; Runway art drawn;
// only the CP-58 block and the build name differ from UAT 81; frozen pickup identical; production untouched.
// Usage: node checks82.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'base81.html') /* a byte copy of ../cp81/release.html beside this folder's art/ */,out=path.resolve(__dirname,'../../tickets/CP-58-evidence/uat82');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
// the Yawn's own removals (from inside a Yawn tick), with whether each piece lay on top of the pile; side losses; callouts
const WATCH="globalThis.__yr=[];const __rc=removeCoin;removeCoin=function(b){try{if(/w2YawnTick/.test(new Error().stack)){const y=b.rb.translation().y/M;__yr.push({kind:b.kind,id:b.id||null,top:b.kind==='item'||y-cp61Half(b)>=COIN_HALF*1.5});}}catch(e){}return __rc.apply(this,arguments);};"+
 "globalThis.__side=[];const __rc2=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side.push(b.kind);}catch(e){}return __rc2.apply(this,arguments);};"+
 "globalThis.__calls=[];const __co=callout;callout=function(t,o){__calls.push(String(t));return __co.apply(this,arguments);};";
const ALIVE="(()=>{const c={};for(const b of bodies)if(!b.dead&&b.kind==='item')c[b.id]=(c[b.id]|0)+1;return c;})()";
const COMING="[...WILD.incoming.filter(s=>s.kind==='item').map(s=>s.id),...SKY.filter(s=>s.kind==='item').map(s=>s.id)]";
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.ms=()=>ms;
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function midRound(file,{seed,level=3,secs=20,fps=60,yawn,noPrizes=false,follow=0,extra}){const g=await game(file,{seed});const tk=fps===60?g.tick:g.tick30;
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run('WILD.left=Math.max(WILD.left,60);');
 if(noPrizes)g.run("for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;");
 g.run(WATCH);
 const r={seed,fps,level,yawn:yawn||'none',aliveBefore:J(g,ALIVE),missingBefore:J(g,'wildMissing()'),lostBefore:+g.run('WILD.lostN|0')};
 if(yawn==='power')g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");else if(yawn==='wheel')g.run(WHEEL);
 if(extra)await extra(g,r,tk,fps);
 if(yawn==='wheel'){let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<10*fps)tk();r.cp58=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');
  r.grabs=J(g,'W2_YAWN?W2_YAWN.grabs.map(x=>({id:x.id,goal:x.goal,coins:x.coins?x.coins.length:0})):[]');}
 for(let i=0;i<Math.round(5*fps)&&g.run('!!W2_YAWN');i++)tk();r.ended=!g.run('!!W2_YAWN');
 r.comingAtEnd=J(g,COMING);r.missingAtEnd=J(g,'wildMissing()');r.lostAtEnd=+g.run('WILD.lostN|0');r.yawnRemoved=J(g,'__yr');r.offSides=J(g,'__side');
 // afterwards: when (s after the Yawn) each prize is first seen coming back, and whether the wheel was over by then
 r.back={};for(let i=0;i<Math.round((follow||5)*fps);i++){tk();if(i%Math.round(fps/10))continue;const c=J(g,COMING);for(const id of c)if(r.back[id]==null)r.back[id]={t:+(i/fps).toFixed(2),danceOver:g.run('!WILD.dance')};}
 r.danceDone=g.run('!WILD.dance');
 Object.assign(r,{aliveAfter:J(g,ALIVE),have:J(g,'WILD.have'),missingAfter:J(g,'wildMissing()'),phase:g.run('WILD.phase'),calls:J(g,'__calls'),stats:J(g,'typeof CP58!=="undefined"?CP58.stats:null'),errs:J(g,'__errs')});
 g.close();return r;}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 if(sha(base)!==sha(path.resolve(__dirname,'../cp81/release.html')))throw new Error('base81.html is not UAT 81');
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')))B=B.split(a).join(b);
  check('0 only the CP-58 block and the build name differ from UAT 81 (UAT 81 + the listed edits = the build)',S===B);}
 // 1. prizes in reach: eaten = lost like a side loss; no drop-back; the goal prize returns only via the normal bonus drop
 notes.wheel=[];let ok1=true,eatenGoals=0,returned=0;
 for(const level of [1,3])for(const fps of [60,30])for(const seed of [1,2,3]){const r=await midRound(src,{seed,level,fps,yawn:'wheel',follow:25});
  const items=r.yawnRemoved.filter(x=>x.kind==='item'),coins=r.yawnRemoved.filter(x=>x.kind!=='item'),eaten=items.map(x=>x.id),goals=r.grabs.filter(x=>x.goal&&eaten.includes(x.id)).map(x=>x.id);
  const lostCounted=(r.stats.lost||[]).length===eaten.length&&r.lostAtEnd-r.lostBefore>=eaten.length;
  const noDropBack=!goals.some(id=>r.comingAtEnd.includes(id))&&!r.calls.some(c=>/DROP BACK/.test(c));
  const missingAfterGulp=goals.every(id=>r.missingAtEnd.includes(id)||(r.aliveBefore[id]|0)>=2); // a second copy on the board means it isn't missing
  const lostCall=goals.every(id=>r.calls.some(c=>/^LOST THE /.test(c)));
  const back=goals.filter(id=>r.back[id]),backOk=back.every(id=>r.back[id].danceOver&&r.back[id].t>=1);
  const dup=goals.filter(id=>(r.aliveAfter[id]|0)>(r.aliveBefore[id]|0)); // an eaten prize is never more than restored (other bonus drops may add other prizes)
  const row={level,fps,seed,grabbed:r.grabs.map(x=>x.id+(x.goal?'*':'')+(x.coins?'x'+x.coins:'')),eaten,coinsTaken:coins.length,lostCounted,noDropBack,missingAfterGulp,lostCall,back:r.back,dup,calls:r.calls.filter(c=>/LOST|NOM|DROP/.test(c)),errs:r.errs.length};
  notes.wheel.push(row);console.log(JSON.stringify(row));eatenGoals+=goals.length;returned+=back.length;
  const prizeRun=r.grabs.some(x=>x.id!=='coins');
  if(!(r.cp58&&r.grabs.length<=2&&r.grabs.length>=1&&(prizeRun?!coins.length:true)&&lostCounted&&noDropBack&&missingAfterGulp&&lostCall&&backOk&&!dup.length&&r.ended&&r.danceDone&&!r.errs.length))ok1=false;}
 check('1 wheel YAWN, Level 1 and 3 x 3 seeds x 60/30 fps: '+eatenGoals+' goal prizes eaten, each counted lost at the gulp with "LOST THE ...!", none dropped back by the Yawn, no "DROP BACK"; '+returned+' came back later through the normal bonus drop, after the wheel; no duplicates, no frame errors',ok1&&eatenGoals>0&&returned>0,notes.wheel.map(r=>[r.level,r.fps,r.seed,r.grabbed.join(','),r.coinsTaken,r.lostCounted,r.noDropBack,Object.keys(r.back).join('/'),r.errs]));
 // 2. no prize in reach: the mitt eats a few top coins (never the bottom layer)
 notes.coins=[];let ok2=true;for(const level of [1,3])for(const fps of [60,30])for(const seed of [1,2,3]){const r=await midRound(src,{seed,level,fps,yawn:'wheel',noPrizes:true});
  const taken=r.yawnRemoved;const row={level,fps,seed,grabbed:r.grabs,taken:taken.map(x=>x.kind),allTop:taken.every(x=>x.top),errs:r.errs.length};notes.coins.push(row);console.log(JSON.stringify(row));
  if(!(r.cp58&&r.grabs.length===1&&r.grabs[0].id==='coins'&&taken.length>=2&&taken.length<=4&&taken.every(x=>x.kind!=='item'&&x.top)&&r.ended&&!r.errs.length))ok2=false;}
 check('2 no prize in reach (all prizes removed), Level 1 and 3 x 3 seeds x 60/30 fps: the mitt eats '+[...new Set(notes.coins.map(r=>r.taken.length))].sort().join('/')+' coins each time, all lying on top of the pile; no frame errors',ok2,notes.coins.map(r=>[r.level,r.fps,r.seed,r.taken.length,r.allTop]));
 notes.power=[];let ok3=true;for(const fps of [60,30])for(const seed of [1,2]){const r=await midRound(src,{seed,fps,yawn:'power'}),o=await midRound(base,{seed,fps,yawn:'power'});
  const row={fps,seed,off:r.offSides,offUAT81:o.offSides,errs:r.errs.length};notes.power.push(row);if(JSON.stringify(r.offSides)!==JSON.stringify(o.offSides)||r.errs.length||!r.offSides.length)ok3=false;}
 check('3 Tuxedo YAWN power: identical to UAT 81 ('+notes.power.map(r=>r.off.length).join('/')+' pieces off)',ok3,notes.power);
 {const r=await midRound(src,{seed:4,level:3,yawn:'wheel',extra:async(g,r,tk,fps)=>{g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;");
   for(let i=0;i<2*fps;i++)tk();r.readyDuring=g.run('pgpReady()');r.cp58At2=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');for(let i=0;i<4*fps;i++)tk();r.readyAfter=g.run('pgpReady()');}});
  check('4 powers are locked during the CP-58 Yawn and ready again after it',r.cp58At2&&r.readyDuring===false&&r.readyAfter===true&&!r.errs.length,{during:r.readyDuring,after:r.readyAfter});}
 {const r=await midRound(src,{seed:4,level:3,yawn:'power',extra:async(g,r,tk,fps)=>{g.run(WHEEL);r.log=[];for(let i=0;i<10*fps;i++){tk();if(i%Math.round(fps/4)===0)r.log.push(g.run("W2_YAWN?(W2_YAWN.cp58?'cp58':'cp61'):'-'"));}}});
  const s=r.log.join(' '),i61=s.lastIndexOf('cp61'),i58=s.indexOf('cp58');check('5 a wheel YAWN during a power Yawn waits for it, then plays',i61>=0&&i58>i61&&r.danceDone&&!r.errs.length,s);}
 {const {game:game43}=require('../cp43/harness.cjs');const g=await game43({src,seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});
  g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
  g.ticks(140);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);if(!g.run('PG'))g.run('pgInit()');
  g.run("PG.lv.passed=0;PG.lv.sel=1;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();g.ticks(300);
  await new Promise(r=>setTimeout(r,300));const loaded=J(g,'[!!CP58_RUNWAY,!!CP58_RUNWAY_EYES]');g.run("WILD.left=60;"+WHEEL);
  g.run("globalThis.__used={face:0,eyes:0};const __cf=cp58Face;cp58Face=function(){const d=ctx.drawImage;ctx.drawImage=function(im,...a){if(im===CP58_RUNWAY)__used.face++;if(im===CP58_RUNWAY_EYES)__used.eyes++;return d.call(this,im,...a);};try{return __cf();}finally{ctx.drawImage=d;}};");
  for(let i=0;i<6*60;i++){g.tick();if(i%2===0)g.c.draw();}const u=J(g,'__used'),e=J(g,'__errs');g.close();
  check('6 Runway face and eyes load and are drawn ('+u.face+'/'+u.eyes+' frames), no frame errors',loaded[0]&&loaded[1]&&u.face>10&&u.eyes>10&&!e.length,{loaded,u,e});}
 check('7 seven simultaneous pickups: identical frame trace and sound calls to UAT 81',(await burst(src))===(await burst(base)));
 check('8 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks82.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
