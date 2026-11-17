// CP-61 checks: no "Board full" slow-down; rain coins cut at every source; frozen pickup unchanged.
// Real runtime, Developer off. Usage: node checks61.cjs [SRC] [BASE]   (defaults: cp75/release.html on published UAT 74)
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const make=require('../cp72/runtime.cjs');
const {Path2D}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'../cp74/release.html'));
const ver=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8')),uat=ver.displayName.split(' ').pop();
const out=path.resolve(__dirname,'../../tickets/CP-61-evidence/uat'+uat);fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function game(file,seed=5){const g=await make({sourceFile:file,render:true,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.ptr=(t,x,y)=>{const s=g.run('scale');g.pointer(t,x*s,y*s);};g.tap=(x,y)=>{g.ptr('pointerdown',x,y);g.ptr('pointerup',x,y);};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");g.ticks(150);g.tap(200,700);g.ticks(40);return g;}
async function level(file,n,seed=5){const g=await game(file,seed);g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();PGU.screen='board';pgStartRound();`);
 if(!g.until("WILD.phase==='play'",900))throw new Error('no play');return g;}
const FILL="(()=>{let k=0;for(let y=440;y<=700&&k<150;y+=14)for(let x=90;x<=310&&k<150;x+=14){addCoin('coin',null,x,40+(k%3)*8,y,randomTurn(.1));k++;}return k;})()";
const PIECES="bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')).length";
// hold 6 s on a packed board: drops, Board full floats, message
async function packedHold(file){const g=await level(file,3);g.run('WILD.nextBonus=99;');g.run(FILL);g.ticks(30);const p0=J(g,PIECES),d0=J(g,'S.drops');
 g.run("globalThis.__full=0;");g.ptr('pointerdown',200,560);let msg=false;
 for(let i=0;i<360;i++){g.tick();g.run("for(const f of floats)if(f.text==='Board full'&&!f.__c){f.__c=1;__full++;}");if(J(g,'wildMessage()')==='Board full!')msg=true;}
 g.ptr('pointerup',200,560);return {piecesAtStart:p0,drops:J(g,'S.drops')-d0,boardFullFloats:J(g,'__full'),boardFullMessage:msg,errs:J(g,'__errs')};}
// bonus pick shares through the whole chain, on a level's board (the incoming queue cleared after each pick)
async function picks(file,n,N,crowd){const g=await level(file,n);if(crowd){g.run(FILL);g.ticks(20);}
 const r=J(g,`(()=>{const c={};for(let i=0;i<${N};i++){WILD.incoming.length=0;const k=WILD.incoming.length;wildScheduleBonus();const o=WILD.incoming[k];const kind=o?(o.kind==='item'?'prize':o.kind):'none';c[kind]=(c[kind]|0)+1;}WILD.incoming.length=0;return c;})()`);
 return {counts:r,pieces:J(g,PIECES)};}
const share=(c,N)=>Object.fromEntries(Object.entries(c).map(([k,v])=>[k,+(v/N).toFixed(3)]));
async function burst(file){const g=await game(file);g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 // 0. only the CP-61 edits differ from the base
 const edits=JSON.parse(fs.readFileSync(path.join(path.dirname(src),'edits.json'),'utf8'));let restored=fs.readFileSync(src,'utf8');
 for(const [a,b] of edits.slice().reverse())restored=restored.replace(b,a);
 check('0 only the '+(edits.length-1)+' CP-61 edits and the build name differ from the base',restored===fs.readFileSync(base,'utf8'));
 // 1. no slow-down
 const h1=await packedHold(src),h0=await packedHold(base);notes.packedHold={new:h1,base:h0};
 check('1 packed board ('+h1.piecesAtStart+' pieces), 6 s hold: '+h1.drops+' drops (base '+h0.drops+'), no Board full float or message, no frame errors',
  h1.piecesAtStart>=120&&h1.drops>=14&&h1.boardFullFloats===0&&!h1.boardFullMessage&&!h1.errs.length&&h0.drops<=8&&h0.boardFullFloats>0,{h1,h0});
 // 2. level start rain coins
 const want={1:[],2:['rain5','rain5'],3:['rain5','rain5','rain5'],4:['rain5'],5:['rain5','rain5'],6:['rain10','rain5','rain5'],7:['rain5'],8:['rain5'],9:['rain5'],10:[]};
 notes.startRain={};let okR=true;for(let n=1;n<=10;n++){const a=J(await level(src,n),"bodies.filter(b=>!b.dead&&RAIN[b.kind]&&b.kind!=='gold5').map(b=>b.kind).sort()"),b=J(await level(base,n),"bodies.filter(b=>!b.dead&&RAIN[b.kind]&&b.kind!=='gold5').map(b=>b.kind).sort()");
  notes.startRain[n]={base:b,new:a};if(JSON.stringify(a)!==JSON.stringify(want[n].slice().sort()))okR=false;}
 const tot=o=>o.reduce((s,k)=>s+({rain5:5,rain10:10,rain25:25}[k]),0);
 check('2 level start rain coins one size down on every level: '+Object.values(notes.startRain).reduce((s,r)=>s+tot(r.base),0)+' -> '+Object.values(notes.startRain).reduce((s,r)=>s+tot(r.new),0)+' coins over 10 levels',okR,notes.startRain);
 // 3. bonus picks
 const N=4000,p1=await picks(src,2,N),p0=await picks(base,2,N),pc=await picks(src,2,1000,true);notes.picks={new:share(p1.counts,N),base:share(p0.counts,N),crowded:{...share(pc.counts,1000),pieces:pc.pieces}};
 const s1=notes.picks.new,near=(x,y)=>Math.abs((x||0)-y)<.03;
 check('3a bonus drops (Level 2, '+N+' picks): Rain 5 '+(s1.rain5||0)+', Rain 10 '+(s1.rain10||0)+', Rain 25 '+(s1.rain25||0)+', nothing '+(s1.none||0)+' (base '+JSON.stringify(notes.picks.base)+')',
  near(s1.rain5,.18)&&near(s1.rain10,.08)&&near(s1.rain25,.02)&&near(s1.none,.30),notes.picks);
 check('3b crowded board ('+pc.pieces+' pieces): no rain bonus drops in 1000 picks',pc.pieces>=100&&!pc.counts.rain5&&!pc.counts.rain10&&!pc.counts.rain25,notes.picks.crowded);
 // 4. the wheel: no rain slices, two Yawns; every slice applied (SKY contents), odds from the weights; a Yawn slice starts the Yawn
 const g=await level(src,3);const wl=J(g,'W2_WHEEL.map(s=>s.label)'),odds=J(g,"(()=>{const t=W2_WHEEL.reduce((a,s)=>a+s.w,0);return W2_WHEEL.map(s=>s.label+' '+Math.round(s.w/t*100)+'%');})()");const sl={};
 const nW=J(g,'W2_WHEEL.length');for(let i=0;i<nW;i++){g.run('SKY.length=0;');g.run(`w2ApplySlice(W2_WHEEL[${i}],{})`);sl[i+' '+wl[i]]=J(g,"SKY.map(s=>s.kind)").reduce((c,x)=>(c[x]=(c[x]|0)+1,c),{});}
 const yg=await level(src,3);yg.run('WILD.nextBonus=999;w2ForceSlice=W2_WHEEL.findIndex(s=>s.kind===\'yawn\');w2StartWheelNow();');let yawned=false;
 for(let i=0;i<60*20&&!yawned;i++){if(J(yg,"!!(WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.waiting&&WILD.dance.st>.6)"))yg.tap(200,560);yg.tick();if(J(yg,'!!W2_YAWN'))yawned=true;}
 notes.wheel={labels:wl,odds,slices:sl,yawnSliceStartsYawn:yawned};
 const rainKinds=Object.values(sl).some(c=>c.rain5||c.rain10||c.rain25),coins=k=>(sl[k].coin|0)+(sl[k].silver|0);
 check('4 wheel: '+odds.join(', ')+'; no rain coins from any slice; Quake coin from QUAKE COIN; 25 coins from JACKPOT; a Yawn slice starts the Yawn',
  JSON.stringify(wl)===JSON.stringify(['QUAKE COIN','DANCE AGAIN','YAWN','PRIZE YOU NEED','PRIZE YOU NEED','JACKPOT 25','YAWN'])&&!rainKinds&&sl['0 QUAKE COIN'].quake===1&&coins('5 JACKPOT 25')===25&&coins('0 QUAKE COIN')===0&&yawned,notes.wheel);
 // 5. pet and pounce payoffs
 const pet=J(g,"(()=>{const r={};for(const [n,L,over] of [['perfect',1,.1],['close',.9,0],['early',.5,0]]){const D={phase:'play',t:3,L,over,grace:1.2,touching:false,log:[],peakT:0,strokes:0,ears:0};petStop(D,'done');r[n]=D.result.coins;}return r;})()");
 notes.pet=pet;notes.pounceCoins=J(g,'POUNCE.coins');
 check('5 Pet the cat pays 12 for perfect (was 24), Mouse pounce 2 a mouse (was 3)',pet.perfect===12&&pet.close<=10&&notes.pounceCoins===2,{pet,pounce:notes.pounceCoins});
 check('6 no frame errors in these runs',!J(g,'__errs').length);
 // 7. frozen pickup
 check('7 seven simultaneous pickups: identical frame trace and sound calls to the base',(await burst(src))===(await burst(base)));
 // 9. the wheel's Yawn on a full board (Level 3): top coins only, the bottom layer stays, drops still push
 const {yawnRun}=require('./yawn61.cjs');const yc=await yawnRun(src,false),yn=await yawnRun(src,true),yb=await yawnRun(base,true);notes.yawn={control:yc,new:yn,base:yb};
 check('9 Yawn on a full board: '+yn.after.offSides+' coins off the sides (base '+yb.after.offSides+'), bottom layer '+yn.before.bottom+' -> '+yn.after.bottom+' (no Yawn: '+yc.after.bottom+'; base '+yb.after.bottom+'), '+yn.after.emptyCells+' gaps (no Yawn: '+yc.after.emptyCells+'), '+yn.paidIn10s+' coins paid in the next 10 s of drops (base '+yb.paidIn10s+')',
  yn.after.offSides<=8&&yn.after.bottom>=yc.after.bottom-2&&yn.after.emptyCells<=yc.after.emptyCells+1&&yn.paidIn10s>0,notes.yawn);
 check('8 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks61.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
