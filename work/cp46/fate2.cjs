const {game}=require('./harness.cjs');
(async()=>{for(const seed of [21,22,23,24]){const g=await game({seed,src:require('path').resolve('release.html')});const a=g.c.__game;g.run('laserEnter()');a.wildStartCountdown();g.ticks(200);
 let t=0,last=-9,ev=[];let seen=-1;
 while(t<80&&g.run("WILD.phase==='play'")){if(g.run('!!WILD.chase'))break;
  if(t-last>=.4){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}
  const st=g.run("JSON.stringify([WILD.incoming.filter(o=>o.kind==='laser').length,bodies.filter(b=>!b.dead&&b.kind==='laser').map(b=>{const p=b.rb.translation();return [Math.round(p.x/M),Math.round(p.z/M)]})])");
  if(st!==seen&&Math.floor(t*2)%4===0){ev.push(t.toFixed(0)+':'+st);seen=st;}
  g.tick();t+=1/60;}
 console.log(seed,'t',t.toFixed(1),'chase',g.run('!!WILD.chase'),'phase',g.run('WILD.phase'),'win',g.run('WILD.win'),'reason',g.run('WILD.reason'),'left',g.run('WILD.left').toFixed(1),'coins',g.run('S.coins'),ev.slice(-6).join(' '));g.close();}})();
