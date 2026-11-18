// UAT 79 checks (CP-58 step 2): the wheel's YAWN slice plays the CP-58 Yawn (Runway round-yawn face), started through the
// real wheel stage; it takes only prizes (never a coin), every stolen goal prize comes back with no duplicate, no frame
// errors; the Tuxedo's YAWN power is still CP-61's sweep (same pieces off as UAT 78); powers wait for the CP-58 Yawn and the
// wheel waits for a power Yawn; only the CP-58 block, the wheel line and the build name differ from UAT 78; frozen pickup
// identical; production untouched. Usage: node checks79.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp78/release.html'),out=path.resolve(__dirname,'../../tickets/CP-58-evidence/uat79');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
// removeCoin calls made from inside a Yawn tick (the Yawn's own removals), by kind
const WATCH="globalThis.__yr=[];const __rc=removeCoin;removeCoin=function(b){try{if(/w2YawnTick/.test(new Error().stack))__yr.push(b.kind+(b.kind==='item'?':'+b.id:''));}catch(e){}return __rc.apply(this,arguments);};"+
 "globalThis.__side=[];const __rc2=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side.push(b.kind);}catch(e){}return __rc2.apply(this,arguments);};";
const ALIVE="(()=>{const c={};for(const b of bodies)if(!b.dead&&b.kind==='item')c[b.id]=(c[b.id]|0)+1;return c;})()";
const COINS="bodies.filter(b=>!b.dead&&b.kind!=='item'&&b.kind!=='stack').length";
// the wheel's YAWN result, through the real dance finale stage
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.ms=()=>ms;
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function midRound(file,{seed,level=3,secs=20,fps=60,yawn,render=false,extra}){const g=await game(file,{seed,render});const tk=fps===60?g.tick:g.tick30;
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run('WILD.nextBonus=999;WILD.left=Math.max(WILD.left,60);');g.run(WATCH);
 const r={seed,fps,level,yawn:yawn||'none',coinsBefore:+g.run(COINS),aliveBefore:J(g,ALIVE),missingBefore:J(g,'wildMissing()')};
 if(yawn==='power')g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");else if(yawn==='wheel')g.run(WHEEL);
 if(extra)await extra(g,r,tk,fps);
 if(yawn==='wheel'){let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<10*fps)tk();r.cp58=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');
  r.grabs=J(g,'W2_YAWN?W2_YAWN.grabs.map(x=>({id:x.id,goal:x.goal})):[]');}
 for(let i=0;i<Math.round(5*fps)&&g.run('!!W2_YAWN');i++)tk();r.ended=!g.run('!!W2_YAWN');
 r.yawnRemoved=J(g,'__yr');r.offSides=J(g,'__side');for(let i=0;i<Math.round(5*fps);i++)tk(); // the bonus drops land
 r.danceDone=g.run('!WILD.dance');
 Object.assign(r,{coinsAfter:+g.run(COINS),aliveAfter:J(g,ALIVE),have:J(g,'WILD.have'),missingAfter:J(g,'wildMissing()'),phase:g.run('WILD.phase'),stats:J(g,'typeof CP58!=="undefined"?CP58.stats:null'),errs:J(g,'__errs')});
 g.close();return r;}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 // 0. only the CP-58 block, the wheel line and the build name differ from UAT 78
 {let S=fs.readFileSync(src,'utf8');const B=fs.readFileSync(base,'utf8'),add=fs.readFileSync(path.join(__dirname,'cp58-added.js'),'utf8');
  S=S.replace(add,'');for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).reverse())S=S.replace(b,a);
  check('0 only the CP-58 block, the wheel YAWN line and the build name differ from UAT 78',S===B);}
 // 1. the wheel's Yawn on mid-round boards: Level 1 (cheese, shrimp) and Level 3 (5 prizes), 3 seeds, 60 and 30 fps
 notes.wheel=[];let ok1=true,anyGoal=0,nGrab=0;
 for(const level of [1,3])for(const fps of [60,30])for(const seed of [1,2,3]){const r=await midRound(src,{seed,level,fps,yawn:'wheel'});
  const items=r.yawnRemoved.filter(k=>k.startsWith('item:')),coinsTaken=r.yawnRemoved.filter(k=>!k.startsWith('item:')),goals=r.grabs.filter(x=>x.goal&&items.includes('item:'+x.id)).map(x=>x.id);
  const back=goals.every(id=>(r.aliveAfter[id]|0)>=1||r.have[id]),dup=Object.keys(r.aliveAfter).filter(id=>(r.aliveAfter[id]|0)>(r.aliveBefore[id]|0));
  const row={level,fps,seed,taken:items.length,grabbed:r.grabs.map(x=>x.id+(x.goal?'*':'')),coinsTaken:coinsTaken.length,goalsBack:back,dup,coins:[r.coinsBefore,r.coinsAfter],missing:[r.missingBefore,r.missingAfter],ended:r.ended,danceDone:r.danceDone,errs:r.errs.length};
  notes.wheel.push(row);console.log(JSON.stringify(row));anyGoal+=goals.length;
  if(r.grabs.length)nGrab++;if(!(r.cp58&&r.grabs.length<=2&&items.length<=r.grabs.length&&!coinsTaken.length&&!r.offSides.filter(k=>k!=='item').length&&back&&!dup.length&&r.ended&&r.danceDone&&!r.errs.length))ok1=false;}
 check('1 wheel YAWN, Level 1 and 3 x 3 seeds x 60/30 fps: CP-58 Yawn starts from the wheel, goes for up to 2 prizes ('+nGrab+' of 12 runs had one in reach; with none it just yawns) and takes no coin, every stolen goal prize back ('+anyGoal+' stolen), no duplicates, no frame errors, wheel finishes',ok1&&anyGoal>0&&nGrab>=10,notes.wheel.map(r=>[r.level,r.fps,r.seed,r.grabbed.join(','),r.coinsTaken,r.goalsBack,r.dup.length,r.errs]));
 // 2. the Tuxedo's YAWN power is still CP-61's sweep: same pieces off as UAT 78
 notes.power=[];let ok2=true;for(const fps of [60,30])for(const seed of [1,2]){const r=await midRound(src,{seed,fps,yawn:'power'}),o=await midRound(base,{seed,fps,yawn:'power'});
  const row={fps,seed,off:r.offSides,offUAT78:o.offSides,coins:[r.coinsAfter,o.coinsAfter],errs:r.errs.length};notes.power.push(row);console.log(JSON.stringify(row));
  if(JSON.stringify(r.offSides)!==JSON.stringify(o.offSides)||r.coinsAfter!==o.coinsAfter||r.errs.length||!r.offSides.length)ok2=false;}
 check('2 Tuxedo YAWN power (Level 3, 2 seeds x 60/30 fps): identical to UAT 78 (CP-61 sweep: '+notes.power.map(r=>r.off.length).join('/')+' pieces off)',ok2,notes.power);
 // 3. no power during the CP-58 Yawn (ready again after); 4. the wheel waits for a running power Yawn
 {const r=await midRound(src,{seed:4,level:3,yawn:'wheel',extra:async(g,r,tk,fps)=>{g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;");
   for(let i=0;i<2*fps;i++)tk();r.readyDuring=g.run('pgpReady()');r.cp58At2=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');for(let i=0;i<4*fps;i++)tk();r.readyAfter=g.run('pgpReady()');}});
  notes.powerDuring=r;check('3 powers are locked during the CP-58 Yawn and ready again after it',r.cp58At2&&r.readyDuring===false&&r.readyAfter===true&&!r.errs.length,{during:r.readyDuring,after:r.readyAfter});}
 {const r=await midRound(src,{seed:4,level:3,yawn:'power',extra:async(g,r,tk,fps)=>{g.run(WHEEL);r.log=[];for(let i=0;i<10*fps;i++){tk();if(i%Math.round(fps/4)===0)r.log.push(g.run("W2_YAWN?(W2_YAWN.cp58?'cp58':'cp61'):'-'"));}
   r.danceDone=g.run('!WILD.dance');}});
  const s=r.log.join(' '),i61=s.lastIndexOf('cp61'),i58=s.indexOf('cp58');notes.wheelWaits=s;
  check('4 the wheel YAWN during a power Yawn waits for it, then plays the CP-58 Yawn',i61>=0&&i58>i61&&r.danceDone&&!r.errs.length,s);}
 // 5. art: the Runway face and eyes load and are drawn during the yawn and while eating (rendered run)
 {const {game:game43}=require('../cp43/harness.cjs');const g=await game43({src,seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});
  g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
  g.ticks(140);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);if(!g.run('PG'))g.run('pgInit()');
  g.run("PG.lv.passed=0;PG.lv.sel=1;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();g.ticks(300);
  await new Promise(r=>setTimeout(r,300));const loaded=J(g,'[!!CP58_RUNWAY,!!CP58_RUNWAY_EYES,CP58_RUNWAY&&CP58_RUNWAY.width,CP58_RUNWAY_EYES&&CP58_RUNWAY_EYES.width]');
  g.run("WILD.nextBonus=999;WILD.left=60;"+WHEEL);
  g.run("globalThis.__used={face:0,eyes:0};const __cf=cp58Face;cp58Face=function(){const d=ctx.drawImage;ctx.drawImage=function(im,...a){if(im===CP58_RUNWAY)__used.face++;if(im===CP58_RUNWAY_EYES)__used.eyes++;return d.call(this,im,...a);};try{return __cf();}finally{ctx.drawImage=d;}};");
  for(let i=0;i<6*60;i++){g.tick();if(i%2===0)g.c.draw();}const u=J(g,'__used'),e=J(g,'__errs');g.close();notes.art={loaded,used:u,errs:e};
  check('5 Runway round-yawn face and squinting eyes load ('+loaded[2]+'/'+loaded[3]+' px wide) and are drawn ('+u.face+' face frames, '+u.eyes+' eye frames), no frame errors',loaded[0]&&loaded[1]&&loaded[2]===1536&&u.face>10&&u.eyes>10&&!e.length,notes.art);}
 check('6 seven simultaneous pickups: identical frame trace and sound calls to UAT 78',(await burst(src))===(await burst(base)));
 check('7 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks79.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
