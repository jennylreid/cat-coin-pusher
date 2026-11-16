const {game}=require('./harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('fixed38.html'),seed:4});const rt=g.realNow;g.run('wild2Enter();wildStartCountdown();');g.ticks(200);g.run('S.coins=999;WILD.left=170');
 // a busy Wild 2 board: drops plus two rain 25s and a dance pour, like the phone sessions
 for(let i=0;i<300;i++){if(i%6===0)g.c.__game.tryDrop({x:200+120*Math.sin(i*.7),y:g.run('DROP_Y')});g.tick();}
 for(const k of ['rain25','rain25']){g.run(`(()=>{const b=addCoin('${k}',null,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);g.ticks(300);}
 g.run('w2Rain(20)');g.ticks(200);
 const cnt=()=>g.run("({coins:bodies.filter(b=>!b.dead).length,ccd:bodies.filter(b=>!b.dead&&b.rb.isCcdEnabled&&b.rb.isCcdEnabled()).length,sleeping:bodies.filter(b=>!b.dead&&b.rb.isSleeping()).length})");
 const step=n=>{let s=0;for(let i=0;i<n;i++){const t=rt();g.c.step();s+=rt()-t;g.c.update(1/60);}return +(s/n).toFixed(3);};
 console.log('with CCD as shipped',JSON.stringify(cnt()),'ms/step',step(300));
 g.run('for(const b of bodies)if(!b.dead)b.rb.enableCcd(false)');console.log('CCD off',JSON.stringify(cnt()),'ms/step',step(300));
 g.close();
 const g2=await game({src:path.resolve('fixed38.html'),seed:4});g2.run('selectBoard(0);S.coins=999');for(let i=0;i<600;i++){if(i%6===0)g2.c.__game.tryDrop({x:200+120*Math.sin(i*.7),y:g2.run('DROP_Y')});g2.tick();}
 const s2=()=>{let s=0;for(let i=0;i<300;i++){const t=rt();g2.c.step();s+=rt()-t;g2.c.update(1/60);}return +(s/300).toFixed(3);};
 console.log('Board 1 reference',g2.run("JSON.stringify({coins:bodies.filter(b=>!b.dead).length,ccd:bodies.filter(b=>!b.dead&&b.rb.isCcdEnabled()).length})"),'ms/step',s2());g2.close();})();
