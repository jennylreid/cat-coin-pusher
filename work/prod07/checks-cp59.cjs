// PROD-07 (CP-59 hotfix) behaviour checks, as UAT 73's (work/cp73/checks73.cjs), with production 2026.11.16 as the base: the cascade repro ends cleanly; normal Dance breaks, the wheel and the Wild 2 payoff match production 2026.11.16
// tick for tick; the frozen pickup is unchanged. Real runtime, Developer off, Level 3 "At the back" (Tuxedo).
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const make=require('../cp72/runtime.cjs');
const {Path2D}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../prod06/release.html'),out=path.resolve(__dirname,'../../tickets/CP-59-evidence/prod07');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,400):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function game(file,seed=5){const g=await make({sourceFile:file,render:true,width:400,height:889,pixelRatio:1,seed,storage:{}});g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");g.ticks(150);g.tap(200,700);g.ticks(40);return g;}
async function level3(file,seed){const g=await game(file,seed);g.run("pglLv().passed=2;pglLv().sel=3;pgSave();if(WILD.phase==='card')wildReset();");g.ticks(10);g.c.draw();
 const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);if(!g.until("WILD.phase==='play'",900))throw new Error('no play');return g;}
// taps the beats: 'all' (perfect), 'half' (every other beat), 'none'
function beatTap(g,mode,st){const D=J(g,"WILD.dance&&WILD.dance.phase!=='finale'?{p0:WILD.dance.p0,beat:WILD.dance.beat,lat:WILD.dance.latency,now:danceNow()}:null");if(!D||mode==='none')return;
 const x=(D.now-D.p0-D.lat)/D.beat,k=Math.round(x);if(k>=0&&Math.abs(x-k)*D.beat<1/120&&st.last!==k&&(mode==='all'||k%2===0)){g.tap(200,560);st.last=k;}}
const WAITING="!!(WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.waiting&&WILD.dance.st>.6)";
const TR="[+WILD.left.toFixed(4),+WILD.nextBonus.toFixed(4),WILD.dance?WILD.dance.phase+'/'+(WILD.dance.stage||''):'-',WILD.dance?JSON.stringify(WILD.dance.bank):'',S.coins,WILD.bonusN,SKY.length,WILD.rainLeft,bodies.filter(b=>!b.dead).length,WILD.got,WILD.phase,board.status,WILD.dance&&WILD.dance.wheel?WILD.dance.wheel.i:-1]";
// One Dance break on Level 3 from 4 s into the round, traced every tick until 3 s after it ends.
async function danceRun(file,{seed=5,mode='all',slice=null}={}){const g=await level3(file,seed);g.ticks(240);
 if(slice!=null)g.run('w2ForceSlice='+slice);g.run('WILD.danceForce=true');const st={};const trace=[];let end=null,wheel=null;
 for(let tk=0;tk<60*60;tk++){beatTap(g,mode,st);if(J(g,WAITING))g.tap(200,560);
  g.tick();trace.push(g.run('JSON.stringify('+TR+')'));
  if(wheel==null&&J(g,'!!(WILD.dance&&WILD.dance.wheel)'))wheel=J(g,'WILD.dance.wheel.i');
  if(end==null&&tk>30&&!J(g,'!!WILD.dance')&&!J(g,'!!WILD.dancePending'))end=tk;if(end!=null&&tk>=end+180)break;}
 const rows=trace.map(t=>JSON.parse(t)),first=rows.findIndex(r=>r[2]!=='-');
 return {end,first,leftAtStart:rows[first]&&rows[first][0],leftAtEnd:end!=null?rows[end-1][0]:null,wheel,hash:crypto.createHash('sha256').update(trace.join('\n')).digest('hex'),stages:[...new Set(rows.map(r=>r[2]))],errs:J(g,'__errs')};}
// The cascade repro: 4 prizes in, a break starts with the bonus clock at 0.01 s, the 5th prize comes in, perfect taps.
async function cascade(file,secs=60){const g=await level3(file,5);g.ticks(240);
 g.run("for(const id of WILD_COLLECTION.slice(0,4))WILD.have[id]=true;WILD.got=4;WILD.danceForce=true");g.until('!!WILD.dance',600);g.run('WILD.nextBonus=0.01');
 g.run("WILD.have[WILD_COLLECTION[4]]=true;WILD.got=5;wildFinish(true)");const held=J(g,'!!WILD.winHeld'),b0=J(g,'WILD.bonusN'),left0=J(g,'WILD.left');const st={};let tk=0;
 for(;tk<secs*60;tk++){beatTap(g,'all',st);if(J(g,WAITING))g.tap(200,560);g.tick();if(g.run('WILD.phase')!=='play')break;}
 return {held,secs:+(tk/60).toFixed(1),phase:J(g,'WILD.phase'),status:J(g,'board.status'),win:J(g,'WILD.win'),bonusDrops:J(g,'WILD.bonusN')-b0,left0,left:J(g,'WILD.left'),dance:J(g,"WILD.dance?WILD.dance.phase+'/'+WILD.dance.stage:null"),pieces:J(g,'bodies.filter(b=>!b.dead).length'),errs:J(g,'__errs')};}
async function burst(file){const g=await game(file);g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 const text=fs.readFileSync(src,'utf8'),before=fs.readFileSync(base,'utf8');
 const restored=text.replace("const BUILD = '2026.11.16.2';","const BUILD = '2026.11.16';")
  .replace("if(!(WILD.dance||WILD.toss||WILD.chase||WILD.petGame||WILD.pounce)){WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}} // CP-59: no bonus clock during a side game","WILD.nextBonus-=dt;if(WILD.nextBonus<=0){WILD.nextBonus=rand(6,9);wildScheduleBonus();}")
  .replace("if(D.stage==='pour'){if((!SKY.length&&D.st>.6)||D.st>4)","if(D.stage==='pour'){if(!SKY.length&&D.st>.6)").replace("if(D.stage==='settle'){if((!SKY.length&&D.st>.5)||D.st>4)","if(D.stage==='settle'){if(!SKY.length&&D.st>.5)");
 check('0 only the build name and the three CP-59 lines differ from production 2026.11.16',restored===before);
 // 1. the cascade
 const c72=await cascade(base),c73=await cascade(src);notes.cascade={uat72:c72,uat73:c73};
 check('1a production 2026.11.16 reproduces the freeze: 60 s with the timer held, the win held and bonuses every frame',c72.phase==='play'&&c72.left===c72.left0&&c72.held&&c72.bonusDrops>1000,c72);
 check('1b this build: the same round ends with the win, no bonus drops during the break, no frame errors',c73.held&&c73.phase==='end'&&c73.win===true&&c73.bonusDrops===0&&c73.secs<40&&!c73.errs.length,c73);
 // 2. normal Dance breaks and every wheel slice
 const runs=[['perfect dance (wheel)',{mode:'all'}],['half the beats',{mode:'half'}],['no taps',{mode:'none'}],['perfect dance, seed 9',{mode:'all',seed:9}],['half the beats, seed 9',{mode:'half',seed:9}]];
 const slices=J(await game(src),'W2_WHEEL.map(s=>s.label)');slices.forEach((l,i)=>runs.push(['wheel lands on '+l+' (slice '+i+')',{mode:'all',slice:i}]));
 notes.dance=[];for(const [name,o] of runs){const a=await danceRun(base,o),b=await danceRun(src,o);notes.dance.push({name,uat72:a,uat73:{...b,hash:b.hash===a.hash?'same':b.hash}});
  check('2 '+name+': identical to production 2026.11.16 tick by tick (timer held at '+a.leftAtStart+' s, ends at tick '+a.end+', stages '+a.stages.join(' > ')+')',a.hash===b.hash&&a.end!=null&&a.leftAtStart===a.leftAtEnd&&!b.errs.length,{end72:a.end,end73:b.end,wheel:[a.wheel,b.wheel]});}
 // 3. frozen pickup
 check('3 seven simultaneous pickups: identical frame trace and sound calls to production 2026.11.16',(await burst(src))===(await burst(base)));
 check('4 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks-cp59.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
