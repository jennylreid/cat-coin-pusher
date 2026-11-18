// CP-63 prototype check: Levels 1-5 x 3 seeds, the power played through the real button, no rendering.
// Records the picks, what was paid over the front, side falls during the power, button lock, frame errors.
// Usage: node check.cjs > check.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path');
(async()=>{const out=[];
 for(const level of [1,2,3,4,5])for(const seed of [3,7,11]){
  const g=await game({src:path.join(__dirname,'game','proto.html'),seed,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);
  g.run('S.muted=true;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');
  g.ticks(140);g.run(`const L=pglLv();L.passed=${level-1};L.sel=${level};`);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);
  g.run(`cp63DemoRound(${level})`);if(!g.until('WILD.phase==="play"',1500)){out.push({level,seed,err:'no play'});g.close();continue;}
  g.ticks(300);g.run('WILD.nextBonus=999');
  const ok=g.run('cp63DemoPlay()'),cat=g.run('pgpCat()');g.ticks(60);
  const locked=g.run('!pgpReady()'),again=(g.run('PG.powers[pgpCat()]=2'),g.run('cp63DemoPlay()'));// a second tap mid-power must do nothing
  g.ticks(Math.round(4.6*60));const after=g.run('JSON.stringify({on:!!CP63X,pgpx:!!PGPX,dance:!!(pawDance&&pawDance.cp63)})');
  out.push({level,seed,cat,ok,lockedDuring:locked,secondTapIgnored:!again,stats:JSON.parse(g.run('JSON.stringify(CP63.stats)')),after:JSON.parse(after),errs:JSON.parse(g.run('JSON.stringify(__errs)'))});g.close();}
 const sum={runs:out.length,started:out.filter(r=>r.ok).length,picked:out.reduce((n,r)=>n+(r.stats?r.stats.picked[0].length:0),0),
  paid:out.reduce((n,r)=>n+(r.stats?r.stats.paid.length:0),0),pickedLostSide:out.reduce((n,r)=>n+(r.stats?r.stats.lostSide.length:0),0),
  anySide:out.reduce((n,r)=>n+(r.stats?r.stats.anySide:0),0),anyFront:out.reduce((n,r)=>n+(r.stats?r.stats.anyFront:0),0),
  errs:out.reduce((n,r)=>n+(r.errs?r.errs.length:0),0),allLocked:out.every(r=>r.lockedDuring&&r.secondTapIgnored),allClean:out.every(r=>r.after&&!r.after.on&&!r.after.pgpx&&!r.after.dance)};
 console.log(JSON.stringify({sum,out},null,1));})().catch(e=>{console.error(e);process.exit(1);});
