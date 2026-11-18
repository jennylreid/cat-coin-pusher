// CP-64 add-on check (UAT 89): Jackpot prizes leave the Dance meter unchanged; normal prizes still fill it.
// Usage: node check-meter.cjs NEW.html OLD.html [out.json]   (OLD = the build without the add-on, to show the check bites)
const fs=require('fs'),path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
const [NEW,OLD,OUT]=process.argv.slice(2).map(f=>f&&path.resolve(f));
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function round(file,{seed,level=3,fps=60}){const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 const tk=fps===60?()=>{ms+=1000/60;t();}:()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale');g.tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++){ms+=1000/60;t();}g.tap(200,700);for(let i=0;i<30;i++){ms+=1000/60;t();}
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){ms+=1000/60;t();}
 g.fps=fps;g.k=0;g.play=(n,tap=true)=>{for(let i=0;i<n;i++){if(tap&&g.k++%Math.round(fps/2)===0)g.tap(200+110*Math.sin(g.k/fps*1.2+seed),560);tk();}};
 g.play(8*fps);
 // log every prize collection: from the Jackpot or not, meter before and after
 g.run("globalThis.__pc=[];const __o=wildPrizeCollected;wildPrizeCollected=function(b,x){const h=WILD.happy;const r=__o(b,x);__pc.push({jp:!!(b&&(b.jp||b.__jpT)),jpOn:!!WILD.jp,id:b&&b.id,h0:h,h1:WILD.happy});return r;};"+
  "const __l=wildLandBonus;wildLandBonus=function(o){const ac=addCoin;if(o&&o.jp)addCoin=function(){const b=ac.apply(this,arguments);if(b)b.__jpT=true;return b;};try{return __l(o);}finally{addCoin=ac;}};"+
  "const __o2=wildPrizeCollected;wildPrizeCollected=function(b,x){if(b&&b.__jpT&&!b.jp)b.__old=true;return __o2(b,x);};");
 return g;}
async function jackpotRun(file,seed,level,fps){const g=await round(file,{seed,level,fps});
 let k=0;while(g.run('!!WILD.dance')&&k++<30*fps)g.play(1);
 g.run('WILD.dancePending=null;WILD.danceForce=false;WILD.happy=0;WILD.left=60;WILD.jpPending=true;__pc.length=0;');
 k=0;while(!g.run('!!WILD.jp')&&k++<3*fps)g.play(1,false);
 let dances=0,danceDuring=false;k=0;while(g.run('!!WILD.jp')&&k++<14*fps){g.play(1,false);if(g.run('!!WILD.dance'))danceDuring=true;}
 const happyAtEnd=+g.run('WILD.happy');g.run('WILD.lastPay=time;');
 for(let i=0;i<4*fps;i++){g.play(1,false);if(g.run('!!WILD.dance||!!WILD.dancePending'))dances++;} // the tail: Jackpot prizes still landing / falling after the end
 const pc=J(g,'__pc'),jpPc=pc.filter(p=>p.jp||p.__old),tagged=J(g,"__pc.filter(p=>p.jp).length");
 const r={file:path.basename(path.dirname(file))+'/'+path.basename(file),seed,level,fps,collected:pc.length,jackpotPrizes:pc.filter(p=>p.jp).length,jackpotPrizesAfterEnd:pc.filter(p=>p.jp&&!p.jpOn).length,
  meterRiseFromJackpot:pc.filter(p=>p.jp).reduce((s,p)=>s+(p.h1-p.h0),0),otherPrizes:pc.filter(p=>!p.jp).length,meterRiseFromOther:pc.filter(p=>!p.jp).reduce((s,p)=>s+(p.h1-p.h0),0),
  happyAtEnd,happyAfterTail:+g.run('WILD.happy'),danceDuring,danceAfter:dances>0,stats:J(g,'CP64.stats'),errs:J(g,'__errs').length};
 g.close&&g.close();return r;}
async function normalPrize(file){const g=await round(file,{seed:4,level:3,fps:60});
 g.run('WILD.dancePending=null;WILD.happy=0;__pc.length=0;');
 const id=J(g,"WILD_COLLECTION.find(i=>i!==WILD.star)");
 const r=J(g,`(()=>{const out=[];for(let i=0;i<3;i++){const h=WILD.happy;const b=addCoin('item','${id}',200,40,700,yawTurn(0));wildPrizeCollected(b,200);removeCoin(b);out.push(WILD.happy-h);}return {rises:out,happy:WILD.happy,notches:DANCE.notches};})()`);
 // a normal prize collected while a Jackpot runs still fills the meter
 g.run('WILD.happy=0;WILD.jpPending=true;');let k=0;while(!g.run('!!WILD.jp')&&k++<180)g.play(1,false);
 const d=J(g,`(()=>{const h=WILD.happy;const b=addCoin('item','${id}',200,40,700,yawTurn(0));wildPrizeCollected(b,200);removeCoin(b);return {jp:!!WILD.jp,rise:WILD.happy-h};})()`);
 g.close&&g.close();return {...r,duringJackpot:d};}
(async()=>{const rows=[];for(const [seed,level,fps] of [[1,3,60],[2,8,60],[3,3,30],[4,8,30]])rows.push(await jackpotRun(NEW,seed,level,fps));
 rows.forEach(r=>console.log(JSON.stringify(r)));
 const np=await normalPrize(NEW);console.log(JSON.stringify({normal:np}));
 let old=null;if(OLD){old=await jackpotRun(OLD,1,3,60);console.log('old',JSON.stringify(old));}
 const ok=rows.every(r=>r.jackpotPrizes>=10&&r.meterRiseFromJackpot===0&&r.meterRiseFromOther<=r.otherPrizes&&!r.danceDuring&&(r.otherPrizes>0||(!r.danceAfter&&r.happyAfterTail===0))&&r.stats&&r.stats.why==='done'&&!r.errs)
  &&np.rises.every(x=>x===1)&&np.duringJackpot.jp&&np.duringJackpot.rise===1&&(!old||(old.jackpotPrizes>=10&&old.meterRiseFromJackpot>0));
 const res={check:'10 Jackpot prizes leave the Dance meter unchanged (during the Jackpot and after it ends); normal prizes still fill it, also during a Jackpot',pass:ok,runs:rows,normal:np,oldBuild:old};
 console.log((ok?'PASS ':'FAIL ')+res.check);if(OUT)fs.writeFileSync(OUT,JSON.stringify(res,null,1));if(!ok)process.exitCode=1;})().catch(e=>{console.error(e);process.exit(1)});
