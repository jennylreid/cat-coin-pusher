// Dance break regression (CP-61 bug found in UAT 75-77): a Dance break on Level 3 (Tuxedo), every beat tapped on time.
// Reports beats, hits, what was banked, and what the payoff poured. Usage: node dance78.cjs FILE [seed]
const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function danceRun(file,seed=5){const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<120;i++)g.tick();
 g.run("WILD.nextBonus=999;globalThis.__sky={};const __sd=skyDrop;skyDrop=function(kind){__sky[kind]=(__sky[kind]|0)+1;return __sd.apply(this,arguments);};WILD.happy=DANCE.notches;WILD.dancePending={f:null,wait:9};");
 k=0;while(!g.run('!!WILD.dance')&&k++<600)g.tick();if(!g.run('!!WILD.dance'))return {error:'no dance started'};
 let last=-1,taps=0,bank=null,n=J(g,'WILD.dance.n');
 for(let i=0;i<60*40&&g.run('!!WILD.dance');i++){const D=J(g,"WILD.dance.phase!=='finale'?{p0:WILD.dance.p0,beat:WILD.dance.beat,lat:WILD.dance.latency,now:danceNow()}:null");
  if(D){const x=(D.now-D.p0-D.lat)/D.beat,kk=Math.round(x);if(kk>=0&&kk<n&&Math.abs(x-kk)*D.beat<1/120&&last!==kk){tap(200,560);last=kk;taps++;}}
  else if(!bank)bank=J(g,'{hits:WILD.dance.hits,bank:WILD.dance.bank,coins:WILD.dance.coins,rainCoins:WILD.dance.rainCoins}');
  g.tick();}
 return {beats:n,taps,...bank,poured:J(g,'__sky'),danceCoins:J(g,'WILD.danceCoins|0'),errs:J(g,'__errs')};}
module.exports={danceRun};
if(require.main===module)(async()=>{console.log(JSON.stringify(await danceRun(path.resolve(process.argv[2]),+(process.argv[3]||5))));})().catch(e=>{console.error(e);process.exit(1)});
