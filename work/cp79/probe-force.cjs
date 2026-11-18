// probe: does Settings > Developer "Wheel lands on YAWN" (w2ForceWheel) lead to the CP-58 Yawn, and is the button in Settings?
const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
(async()=>{const g=await make({sourceFile:path.join(__dirname,'release.html'),render:false,seed:3,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.run=s=>vm.runInContext(s,g.c);let ms=1e5;g.c.performance={now:()=>ms,timeOrigin:0};const t0=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t0();};
 g.run("S.muted=true;");for(let i=0;i<150;i++)g.tick();const sc=+g.run('scale');g.pointer('pointerdown',200*sc,700*sc);g.pointer('pointerup',200*sc,700*sc);for(let i=0;i<30;i++)g.tick();
 console.log('dev',g.run('S.dev'),'button in wildDevHtml',g.run("typeof wildDevHtml==='function'&&/Wheel lands on YAWN/.test(wildDevHtml())"));
 const i=+g.run("W2_WHEEL.findIndex(s=>s.kind==='yawn')");console.log('yawn slice',i,g.run("JSON.stringify(W2_WHEEL.map(s=>s.label))"));
 g.run('w2ForceWheel('+i+')');let seen=[];
 for(let k=0;k<60*60;k++){g.tick();if(k%60===0){const s=g.run("JSON.stringify([WILD.phase,WILD.dance&&WILD.dance.stage,W2_YAWN?(W2_YAWN.cp58?'cp58':'cp61'):'-',pglOn()])");if(seen[seen.length-1]!==s){seen.push(s);console.log(k/60,s);}}
  if(g.run("!!(W2_YAWN&&W2_YAWN.cp58)")){console.log('CP-58 Yawn at',k/60,'s',g.run("JSON.stringify(W2_YAWN.grabs.map(x=>x.id))"));break;}
  // tap the beats so the Dance break can be perfect
  if(g.run("!!(WILD.dance&&WILD.dance.phase!=='finale'&&WILD.dance.beat)")){const due=g.run("(()=>{const D=WILD.dance;const t=performance.now()/1000;const k=Math.round((t-D.p0-D.latency)/D.beat);return Math.abs(D.p0+k*D.beat+D.latency-t)<1/120;})()");if(due){g.pointer('pointerdown',200*sc,500*sc);g.pointer('pointerup',200*sc,500*sc);}}}
 g.close();})().catch(e=>{console.error(e);process.exit(1)});
