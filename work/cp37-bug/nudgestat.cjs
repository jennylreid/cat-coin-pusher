const {game}=require('../cp39/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]),board=process.argv[3];
(async()=>{const g=await game({seed:4,render:false,src}),a=g.c.__game;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');g.run('finishBoard=()=>{}');
 const hasFix=g.run('typeof CP37_BACK_ZONE!=="undefined"');
 if(hasFix)g.run(`globalThis.__nudged=new Map();globalThis.__nudgeTick=0;const s0=step;step=function(){__nudgeTick++;const before=new Map(bodies.map(b=>[b.uid,b.rb.linvel().z]));s0();}`);
 const stats=[];for(let s=0;s<40;s++){g.run(`S.coins=Math.max(S.coins,50);if(WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+4),y:DROP_Y};`);
  let n=0,awake=0;for(let k=0;k<60;k++){g.tick();if(hasFix)n+=g.run('bodies.filter(b=>!b.dead&&b.kind!=="stack"&&!(b.input&&b.fresh)&&b.rb.translation().z/M<=CP37_BACK_ZONE&&screenOf(b.rb.translation().x/M,b.rb.translation().z/M,b.rb.translation().y/M).y<CP37_CHIN_CLEAR).length');awake+=g.run('bodies.filter(b=>!b.dead&&!b.rb.isSleeping()).length');}
  stats.push([s,+(n/60).toFixed(1),+(awake/60).toFixed(0),g.run('bodies.filter(b=>!b.dead).length')]);}
 console.log(path.basename(path.dirname(src)),board,'[sec, coins above chin line per step, awake bodies, bodies]',JSON.stringify(stats.filter((_,i)=>i%4===3)));g.close();})();
