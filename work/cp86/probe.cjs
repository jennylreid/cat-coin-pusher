// quick probe: a Jackpot mid-round, numbers per second. node probe.cjs <level> <seed> <fps>
const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
(async()=>{const [level=3,seed=1,fps=60]=process.argv.slice(2).map(Number);
 const g=await make({sourceFile:path.resolve(__dirname,'release.html'),width:400,height:889,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=1e5;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);const run=s=>vm.runInContext(s,g.c);
 const tk=fps===60?()=>{ms+=1000/60;t();}:()=>{ms+=1000/30;run('step();step();update(1/30);');};
 run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++){ms+=1000/60;t();}tap(200,700);for(let i=0;i<30;i++){ms+=1000/60;t();}
 run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(run("WILD.phase")!=='play'&&k++<900){ms+=1000/60;t();}
 const per=Math.round(fps/2);for(let k=0;k<20*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 run('WILD.left=Math.max(WILD.left,90);'+(process.env.NOJP?'':'WILD.jpPending=true;'+(process.env.Y?'CP64.y=['+process.env.Y+'];':'')));
 const S="JSON.stringify({jp:!!WILD.jp,t:WILD.jp?+WILD.jp.t.toFixed(1):null,n:WILD.jp?WILD.jp.n:null,left:+WILD.left.toFixed(2),pieces:bodies.filter(b=>!b.dead).length,items:bodies.filter(b=>!b.dead&&b.kind==='item').length,inc:WILD.incoming.length,got:WILD.got,phase:WILD.phase,awards:treatAwards.length,coins:S.coins,dance:WILD.dance?String(WILD.dance.phase)+String(WILD.dance.stage):null,pend:!!WILD.dancePending,happy:WILD.happy,st:board.status,p51:cp51Paused,inv:inventoryOpen,sw:sweepTime,cq:catquakeTime,wh:WILD.winHeld,jpw:WILD.jpWinHeld})";
 for(let s=0;s<14;s++){{const o=JSON.parse(run(S));console.log(s,o.jp,o.n,"pieces",o.pieces,"items",o.items,"got",o.got,"awards",o.awards,"lost",run("WILD.lostN|0"),o.phase)};for(let i=0;i<fps;i++){if(i%per===0)tap(200,560);tk();}}
 console.log(run('JSON.stringify(CP64.stats)'),run('JSON.stringify(__errs)'));g.close&&g.close();})();
