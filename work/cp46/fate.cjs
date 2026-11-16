const {game}=require('./harness.cjs');
(async()=>{for(const seed of [21,22,23]){const g=await game({seed});const a=g.c.__game;g.run('laserEnter()');a.wildStartCountdown();g.ticks(200);
 let t=0,last=-9,ev=[];let seen=0;
 g.run("window.__lg=[];const __g0=gutterOff;gutterOff=function(b,x){if(b.kind==='laser')__lg.push('side');return __g0.apply(this,arguments);}");
 while(t<70&&g.run("WILD.phase==='play'")){if(g.run('!!WILD.chase'))break;
  if(t-last>=.25){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}
  const n=g.run("WILD.incoming.filter(o=>o.kind==='laser').length+bodies.filter(b=>!b.dead&&b.kind==='laser').length");
  if(n!==seen){ev.push([+t.toFixed(1),n,g.run("JSON.stringify(bodies.filter(b=>!b.dead&&b.kind==='laser').map(b=>Math.round(b.rb.translation().z/M)))")]);seen=n;}
  g.tick();t+=1/60;}
 console.log(seed,'t',t.toFixed(1),'chase',g.run('!!WILD.chase'),'left',g.run('WILD.left').toFixed(1),JSON.stringify(ev),g.run('JSON.stringify(__lg)'),'bonusN',g.run('WILD.bonusN'));g.close();}})();
