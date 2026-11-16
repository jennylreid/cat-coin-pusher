const {game}=require('./harness.cjs');
(async()=>{for(const mode of ['normal','chase','chase-nopounce','normal-again']){const g=await game({seed:7});g.run('laserEnter()');g.c.__game.wildStartCountdown();g.ticks(200);
 if(mode.startsWith('chase')){g.run('laserStartNow()');g.until('!!WILD.chase&&WILD.chase.phase==="play"',600);if(mode==='chase-nopounce')g.run('WILD.chase.cd=1e9');}
 if(mode==='normal-again')g.ticks(300);
 const t0=g.realNow();for(let i=0;i<300;i++){if(mode.startsWith('chase')&&i%20===0)g.pointer(i?'pointermove':'pointerdown',150+i/2,650);g.tick();}
 console.log(mode,((g.realNow()-t0)/300).toFixed(2),'awake',g.run('bodies.filter(b=>!b.dead&&b.rb&&!b.rb.isSleeping()).length'),'of',g.run('bodies.filter(b=>!b.dead).length'));g.close();}})();
