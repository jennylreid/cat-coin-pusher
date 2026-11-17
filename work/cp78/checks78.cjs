// UAT 78 checks (CP-61 rework): both Yawns visibly knock off a handful (4-8) of pieces of any kind from the top of the pile,
// never sweep the bottom layer, on mid-round Level 3 Tuxedo boards like the phone test (4 seeds, 60 and 30 fps) and a full
// board; only the Yawn block differs from UAT 77; frozen pickup identical; production untouched. Usage: node checks78.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');const {yawnRun}=require('../cp75/yawn61.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp77/release.html'),out=path.resolve(__dirname,'../../tickets/CP-61-evidence/uat78');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const LAYER="(()=>{const bins={};let bottom=0;for(const b of bodies){if(b.dead||!(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))continue;const p=b.rb.translation(),x=p.x/M,y=p.y/M,z=p.z/M;if(z<380||z>570)continue;if(y<COIN_HALF*1.8){bottom++;bins[Math.floor((x-200)/(COIN_R*2))+','+Math.floor((z-380)/(COIN_R*2))]=1;}}let empty=0;for(let i=-4;i<4;i++)for(let j=0;j<Math.floor(190/(COIN_R*2));j++){const zc=380+(j+.5)*COIN_R*2;if(Math.abs(i+.5)*COIN_R*2<tableHalfAt(zc)-COIN_R*2&&!bins[i+','+j])empty++;}return {bottom,emptyCells:empty};})()";
const TOPN="(()=>{let n=0;for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),z=p.z/M,y=p.y/M,h=typeof b.half==='number'?b.half:halfOf(b.kind);if(z>GUARD_END+COIN_R&&z<T.FRONT-30&&y-h>=COIN_HALF*1.5)n++;}return n;})()";
const SIDE="globalThis.__side=[];const __rc=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side.push(b.kind);}catch(e){}return __rc.apply(this,arguments);};";
async function midRound(file,{seed,secs=25,fps=60,yawn}){const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 // a phone frame at this rate: the game's frame loop runs 60/fps physics steps, then one update with the frame's dt
 g.tick=fps===60?()=>{ms+=1000/60;t();}:()=>{ms+=1000/fps;g.run('for(let i=0;i<'+Math.round(60/fps)+';i++)step();update('+(1/fps)+');');};
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);g.tick();}
 g.run('WILD.nextBonus=999;');const before=J(g,LAYER),topN=J(g,TOPN);g.run(SIDE);
 if(yawn==='power')g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");else if(yawn)g.run('w2StartYawn();');
 for(let i=0;i<Math.round(3.4*fps);i++)g.tick();
 return {seed,fps,yawn:yawn||'none',topPiecesBefore:topN,offSides:J(g,'__side'),before,after:J(g,LAYER),errs:J(g,'__errs')};}
async function burst(file){const g=await make({sourceFile:file,render:true,width:400,height:889,pixelRatio:1,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 const S=fs.readFileSync(src,'utf8'),B=fs.readFileSync(base,'utf8'),cut=(s,a,b)=>s.slice(0,s.indexOf(a))+s.slice(s.indexOf(b));
 let R=cut(S,'const CP61_YAWN_MAX=6;','function yawnText(){');for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).reverse())R=R.replace(b,a);
 check('0 only the Yawn block, the merge switch-off and the drop-time gold 5s differ from UAT 77',R===cut(B,'const CP61_YAWN_MAX=6;','function yawnText(){'));
 // 6/7. no merging on the board; gold 5s only when coins are dropped in
 for(const [name,file] of [['new',src],['UAT 77',base]]){const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed:3,storage:{'catpusher.uat.devdefault.v1':'1'}});
  let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
  g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();const s=+g.run('scale');g.pointer('pointerdown',200*s,700*s);g.pointer('pointerup',200*s,700*s);for(let i=0;i<30;i++)g.tick();
  g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
  g.run("WILD.nextBonus=999;WILD.left=999;(()=>{let k=0;for(let y=440;y<=700&&k<110;y+=13)for(let x=90;x<=310&&k<110;x+=13){addCoin('coin',null,x,40+(k%3)*8,y,randomTurn(.1));k++;}})()");for(let i=0;i<240;i++)g.tick();
  const plain0=+g.run('w43PlainCount()'),m0=+g.run('WILD.merged|0'),g0=+g.run("bodies.filter(b=>!b.dead&&b.kind==='gold5').length");for(let i=0;i<600;i++)g.tick();
  const merged=+g.run('WILD.merged|0')-m0,gold=+g.run("bodies.filter(b=>!b.dead&&b.kind==='gold5').length")-g0,plain1=+g.run('w43PlainCount()');
  g.run('SKY.length=0;w2Rain(25,.03);');const sky=J(g,"SKY.reduce((c,s)=>(c[s.kind]=(c[s.kind]|0)+1,c),{})");const n0=+g.run('bodies.filter(b=>!b.dead).length');g.run("globalThis.__landed={};const __sl=skyLand;skyLand=function(s){const n=bodies.length;const r=__sl(s);if(bodies.length>n){const k=bodies[bodies.length-1].kind;__landed[k]=(__landed[k]|0)+1;}else __landed.vanished=(__landed.vanished|0)+1;return r;}");
  for(let i=0;i<120;i++)g.tick();notes['merge+rain '+name]={plainBefore:plain0,plainAfter10s:plain1,merged,newGold5:gold,rainScheduled:sky,landed:J(g,'__landed')};}
 const a=notes['merge+rain new'],b=notes['merge+rain UAT 77'];
 check('6 a crowded board ('+a.plainBefore+' plain coins) for 10 s: '+a.merged+' merges, '+a.newGold5+' new gold 5s (UAT 77: '+b.merged+' merges)',a.plainBefore>=100&&a.merged===0&&a.newGold5===0&&b.merged>0,{a,b});
 check('7 a RAIN 25 onto that board: '+JSON.stringify(a.rainScheduled)+' fall from the sky and all land ('+JSON.stringify(a.landed)+'); UAT 77: '+JSON.stringify(b.rainScheduled)+' fell, '+JSON.stringify(b.landed),a.rainScheduled.gold5===5&&!a.rainScheduled.coin&&!a.rainScheduled.silver&&!a.landed.vanished&&a.landed.gold5===5&&(b.landed.vanished|0)>0);
 // 1. mid-round boards like the phone test
 notes.mid=[];let ok1=true;
 for(const fps of [60,30])for(const seed of [1,2,3,4]){const c=await midRound(src,{seed,fps});for(const y of ['wheel','power']){const r=await midRound(src,{seed,fps,yawn:y}),o=await midRound(base,{seed,fps,yawn:y});
   const row={fps,seed,yawn:y,top:r.topPiecesBefore,off:r.offSides,offUAT77:o.offSides.length,bottom:[r.before.bottom,r.after.bottom,c.after.bottom],gaps:[r.after.emptyCells,c.after.emptyCells],errs:r.errs.length};notes.mid.push(row);console.log(JSON.stringify(row));
   const wt=r.offSides.reduce((s,k)=>s+(k==='item'?2:1),0);row.weight=wt;if(!(wt>=4&&r.offSides.length<=8&&r.after.bottom>=c.after.bottom-2&&r.after.emptyCells<=c.after.emptyCells+3&&!r.errs.length))ok1=false;}}
 const kinds=[...new Set(notes.mid.flatMap(r=>r.off))],n=a=>Math.min(...a)+'-'+Math.max(...a);
 check('1 mid-round Level 3 (Tuxedo), 4 seeds x 60/30 fps x wheel/power: '+n(notes.mid.map(r=>r.off.length))+' pieces off each time, always at least a couple of prizes or a handful of coins ('+kinds.join(', ')+'; UAT 77: '+n(notes.mid.map(r=>r.offUAT77))+'), bottom layer and gaps as with no Yawn',ok1&&kinds.includes('item'),notes.mid.map(r=>[r.fps,r.seed,r.yawn,r.off.length,r.bottom,r.gaps]));
 // 2. an early, thin board (8 s in): still a handful if anything lies on top
 notes.early=[];let ok2=true;for(const seed of [1,2]){const r=await midRound(src,{seed,secs:8,yawn:'wheel'});notes.early.push({seed,top:r.topPiecesBefore,off:r.offSides});if(r.topPiecesBefore>0&&r.offSides.length<Math.min(4,r.topPiecesBefore))ok2=false;}
 check('2 early board (8 s in): '+notes.early.map(r=>r.off.length+' off of '+r.top+' on top').join('; '),ok2,notes.early);
 // 3. full board: both Yawns, drops still push
 const fc=await yawnRun(src,false),fw=await yawnRun(src,true),fp=await yawnRun(src,'power');notes.full={control:fc.after,wheel:fw,power:fp};
 const okF=y=>y.after.offSides>=2&&y.after.offSides<=8&&y.after.bottom>=fc.after.bottom-2&&y.after.emptyCells<=fc.after.emptyCells+1&&y.paidIn10s>0;
 check('3 full board: wheel '+fw.after.offSides+' off, power '+fp.after.offSides+' off; bottom '+fw.after.bottom+'/'+fp.after.bottom+' (no Yawn '+fc.after.bottom+'); drops still pay ('+fw.paidIn10s+'/'+fp.paidIn10s+')',okF(fw)&&okF(fp)&&fp.power==='yawn');
 // 8. Dance break regression: every beat tapped on time banks every hit, and the payoff pours the banked coins
 {const {danceRun}=require('./dance78.cjs');const d=[await danceRun(src,5),await danceRun(src,9)],d0=await danceRun(base,5);notes.dance={new:d,uat77:d0};
  const ok=d.every(r=>r.hits===r.beats&&r.taps===r.beats&&r.bank.coin+r.bank.rain5+r.bank.rain10===r.hits&&!r.bank.rain10&&((r.poured.coin|0)+(r.poured.silver|0)+(r.poured.gold5|0))>=r.bank.coin&&(r.poured.rain5|0)>=r.bank.rain5&&!r.errs.length);
  check('8 Dance break, '+d[0].beats+' beats tapped on time: banks '+d.map(r=>r.bank.coin+r.bank.rain5).join(' and ')+' (UAT 77: '+(d0.bank.coin+d0.bank.rain5)+'), and the payoff pours them',ok&&d0.bank.coin===0,notes.dance);}
 check('4 seven simultaneous pickups: identical frame trace and sound calls to UAT 77',(await burst(src))===(await burst(base)));
 check('5 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks78.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
