// Probe: what starts a Dance break after a Jackpot (UAT 89). node after-jp.cjs FILE mode(wheel|dev|quake) level seed
const path=require('path'),vm=require('vm');const make=require('C:/Users/jenny/OneDrive/work/CoinPusher/work/cp72/runtime.cjs');
const [file,mode,level,seed]=[process.argv[2],process.argv[3],+process.argv[4],+process.argv[5]];
(async()=>{const g=await make({sourceFile:path.resolve(file),render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);const run=s=>vm.runInContext(s,g.c);const J=s=>JSON.parse(run('JSON.stringify('+s+')'));
 const tick=()=>{ms+=1000/60;t();};const sc=()=>+run('scale');const tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)tick();tap(200,700);for(let i=0;i<30;i++)tick();
 run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(run("WILD.phase")!=='play'&&k++<900)tick();
 let n=0;const play=(s,taps=true)=>{for(let i=0;i<s*60;i++){if(taps&&n++%30===0)tap(200+110*Math.sin(n/60*1.2+seed),560);tick();}};
 run(`globalThis.__ev=[];globalThis.__cause=null;globalThis.__jpEnd=null;
  const pc=wildPrizeCollected;wildPrizeCollected=function(b,x){const c=__cause;__cause=b&&b.jp?'jackpot prize':'normal prize';try{return pc(b,x);}finally{__cause=c;}};
  const rc=wildRainCollected;wildRainCollected=function(b,x){const c=__cause;__cause=b&&b.kind==='note'?'music note':'rain';try{return rc(b,x);}finally{__cause=c;}};
  const df=danceFill;danceFill=function(m,x){const h=WILD.happy;const r=df(m,x);if(WILD.happy!==h)__ev.push({t:time,ev:'fill',cause:__cause,from:h,to:WILD.happy,jp:!!WILD.jp});return r;};
  const e=cp64End;cp64End=function(w){const J=WILD.jp;const r=e(w);__jpEnd=time;__ev.push({t:time,ev:'jpEnd',happy:WILD.happy,held:!!(J&&J.heldDance),pending:!!WILD.dancePending});return r;};
  const ds=danceStart;danceStart=function(){__ev.push({t:time,ev:'danceStart',happy:WILD.happy});return ds.apply(this,arguments);};
  const sb=wildScheduleBonus;wildScheduleBonus=function(){const n0=WILD.incoming.length;const r=sb();const o=WILD.incoming[WILD.incoming.length-1];if(WILD.incoming.length>n0)__ev.push({t:time,ev:'bonus',kind:o.kind,id:o.id});return r;};`);
 play(10);const happyBefore=+run('WILD.happy');
 if(mode==='dev')run('WILD.jpPending=true;');
 else run(`WILD.left=Math.max(WILD.left,60);w2ForceSlice=W2_WHEEL.findIndex(s=>s.kind==='${mode==='quake'?'quake':'jackpot'}');w2StartWheelNow();`);
 // wait for the Jackpot (or for the wheel's dance to end in the quake control)
 k=0;if(mode==='quake'){while(!run('!!WILD.dance')&&k++<600)play(1/60);k=0;while(run('!!WILD.dance')&&k++<3000)play(1/60);run('__jpEnd=time;__ev.push({t:time,ev:"wheelEnd",happy:WILD.happy})');}
 else{while(!run('!!WILD.jp')&&k++<1500)play(1/60);k=0;while(run('!!WILD.jp')&&k++<900)play(1/60);}
 const end=+run('__jpEnd');k=0;const keep=run('WILD.left');run('WILD.left=Math.max(WILD.left,45)');
 while(!run('!!WILD.dance')&&run("WILD.phase")==='play'&&k++<40*60)play(1/60);
 const ev=J('__ev').filter(e=>e.t>=end-12).map(e=>({...e,t:+(e.t-end).toFixed(1)}));const st=ev.find(e=>e.ev==='danceStart'&&e.t>=0);
 const lastFill=st?[...ev].filter(e=>e.ev==='fill'&&e.t<=st.t).pop():null;
 console.log(JSON.stringify({mode,level,seed,happyBefore,danceAfterS:st?st.t:null,cause:st?(lastFill?lastFill.cause:'held/forced'):'none in 40 s',fills:ev.filter(e=>e.ev==='fill').map(e=>[e.t,e.cause,e.to]),bonuses:ev.filter(e=>e.ev==='bonus'&&e.t>=0).map(e=>[e.t,e.kind]).slice(0,6),jpEnd:ev.find(e=>e.ev==='jpEnd'),missing:J('wildMissing().length'),noteN:J('[WILD.noteN,WILD.noteAt,WILD.bonusN]')}));
 process.exit(0);})().catch(e=>{console.error(e);process.exit(1)});
