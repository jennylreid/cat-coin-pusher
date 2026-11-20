// CP-93 tuning (no render): CFG='{"off":6,"lean":.045}' SEEDS=1,2,3 DUR=90 DROPS=1 node sweep.cjs
// Prints per seed: time each tower first spilled (s after GO; -1 never), segments broken, a tower down during the countdown.
const path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const CFG=process.env.CFG||'{}',TW=process.env.TW||'',SEEDS=(process.env.SEEDS||'1,2,3').split(',').map(Number),DUR=+(process.env.DUR||90),DROPS=process.env.DROPS!=='0',DECK=process.env.DECK||'';
(async()=>{const res=[];for(const seed of SEEDS){const g=await make33({sourceFile:path.resolve(__dirname,process.env.SRC||'release.html'),render:false,seed,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.run=s=>vm.runInContext(s,g.c);g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();
 g.run(`Object.assign(CP93.cfg,${CFG});${TW?`LAB.B.giant.giant.towers=${TW};`:''}${DECK?`LAB.B.giant.deck=${DECK};`:''}`);
 g.run(`CP93.seed=${seed*7919};`);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.run("WILD_BOARD.seed&&0;labStart('giant')");
 g.run("CP93.first={};{const o=labScore;labScore=function(x){return o(x);};}");
 let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();const early=+g.run("CP93.stats.spilled");
 g.run("CP93.t0=time;CP93.when=[-1,-1,-1];{const b0=breakStack;breakStack=function(b){if(b&&b.cp93!=null&&CP93.when[b.cp93]<0)CP93.when[b.cp93]=+(time-CP93.t0).toFixed(1);return b0(b);};}");
 let lastPh=0,inS=0,nextOk=0,drops=0;const xs=[150,250,200,120,280];
 for(let tick=0;tick<DUR*60;tick++){if(DROPS&&g.run("WILD.phase==='play'")){const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<lastPh)inS=0;lastPh=ph;
   if(inS<2&&tick>=nextOk){const r0=+g.run('board.released');g.run(`tryDrop({x:${xs[drops%xs.length]},y:DROP_Y})`);if(+g.run('board.released')>r0){drops++;inS++;nextOk=tick+17;}}}g.tick();}
 const r=JSON.parse(g.run("JSON.stringify({why:(CP93.tw||[]).map(t=>t.why||'-'),sl:(CP93.tw||[]).map(t=>+(t.slide||0).toFixed(1)),when:CP93.when,broke:CP93.stats.broke,segs:CP93.stats.built,bodies:bodies.length,phase:WILD.phase,got:LAB.st.got})"));r.seed=seed;r.early=early;r.drops=drops;res.push(r);console.log(JSON.stringify(r));}
})().catch(e=>{console.error(e);process.exit(1)});
