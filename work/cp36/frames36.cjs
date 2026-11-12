// UAT 36 evidence frames: Pop pickup (rise, peak, shrink) and the new Wild end cards with the dancing cat.
// Real runtime, @napi-rs/canvas CPU renderer at DPR 1.35, H 888.9 (desktop; not phone evidence).
const make=require('../cp33/runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const O=path.resolve(__dirname,'../../tickets/UAT-36-evidence');fs.mkdirSync(O,{recursive:true});
async function game(seed,height=888.889){const g=await make({sourceFile:path.resolve(__dirname,'release.html'),render:true,height,seed});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const ticks=(g,n)=>{for(let i=0;i<n;i++)g.tick();};
(async()=>{
 {const g=await game(4),run=s=>vm.runInContext(s,g.c);ticks(g,30);
  for(const [id,x,tag] of [['cheese',200,'cheese'],['tuna',265,'tuna'],['shrimp',135,'shrimp']]){
   run(`queueTreatAward('${id}',${x},null,true)`);ticks(g,6);shot(g,`pop-${tag}-1-rising`);ticks(g,10);shot(g,`pop-${tag}-2-peak`);ticks(g,18);shot(g,`pop-${tag}-3-shrink-spin`);ticks(g,60);}
  run("pickupFx.popStyle=0");run("queueTreatAward('cheese',200,null,true)");ticks(g,40);shot(g,'current-style-cheese-held');ticks(g,90);
  g.close();}
 {const g=await game(4),a=g.c.__game,run=s=>vm.runInContext(s,g.c);a.wildEnter();a.wildStartCountdown();ticks(g,300);
  run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='rain10');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");
  let k=0;while(!run("treatAwards.some(f=>f.pop&&f.t>=f.tr)")&&k<300){g.tick();k++;}shot(g,'pop-rain10-peak');ticks(g,240);
  // forced win: the last needed prize goes over the front
  run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;");run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");
  k=0;while(a.WILD.phase!=='end'&&k<600){g.tick();k++;}
  for(const [n,tag] of [[20,'1-word'],[70,'2-card'],[60,'3-dance'],[45,'4-dance'],[45,'5-dance']]){ticks(g,n);shot(g,'win-card-'+tag);}
  const R=a.wildEndRects();g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);ticks(g,200);
  run("WILD.have={cheese:1,shrimp:1,tuna:1,yarn:1};WILD.got=4;WILD.left=0.2");ticks(g,110);shot(g,'lose-card-times-up');
  g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);ticks(g,200);
  run("WILD.have={cheese:1,duck:1};WILD.got=2;S.coins=0;board.earnedQuakes=0;WILD.nextBonus=99");k=0;while(a.WILD.phase==='play'&&k<1500){g.tick();run('WILD.nextBonus=99');k++;}ticks(g,90);shot(g,'lose-card-out-of-coins');
  g.close();}
 {const g=await game(4,720),a=g.c.__game,run=s=>vm.runInContext(s,g.c);a.wildEnter();a.wildStartCountdown();ticks(g,200);run("WILD.left=0.2");ticks(g,110);shot(g,'short-screen-720-lose-card');g.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
