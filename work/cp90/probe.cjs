const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
(async()=>{const g=await make({sourceFile:path.resolve(__dirname,'release.html'),render:false,width:400,height:889,pixelRatio:1,seed:3,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.tick=()=>{ms+=1000/60;t();};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<600;i++){if(i%30==0)tap(200+100*Math.sin(i/40),560);g.tick();}g.run('WILD.left=99;');
 g.run("for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;");
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 let tr=[];for(let i=0;i<7*60;i++){g.tick();if(i%15==0)tr.push(g.run("W2_YAWN?(W2_YAWN.t.toFixed(2)+':'+(W2_YAWN.flyers?W2_YAWN.flyers.map(f=>{const a=cp71At(f);return Math.round(a.z)+'/'+Math.round(a.h)}).join(','):'')+(W2_YAWN.grabs.some(g=>g.held)?'H':'')):'-'"));}
 console.log(tr.join(' '));console.log(J(g,'CP71.stats'),J(g,'CP58.stats'),J(g,'__errs'));g.close();})().catch(e=>{console.error(e);process.exit(1)});
