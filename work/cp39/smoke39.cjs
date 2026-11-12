// UAT 39 smoke (desktop): every board loads, plays 4 s of hold-to-drop and draws without errors; the CP-37 code is live.
const {game}=require('./harness.cjs'),path=require('path');
(async()=>{const out=[];
 for(const b of ['b1','b2','b3','wild','wild2']){const g=await game({seed:4,render:true,src:path.resolve(__dirname,'release.html')}),a=g.c.__game;
  if(b==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else if(b==='wild2'){g.run('wild2Enter();wildStartCountdown()');g.ticks(240);}else g.run(`selectBoard(${{b1:0,b2:1,b3:2}[b]});S.coins=300;`);
  let err=null;try{for(let i=0;i<240;i++){if(i%60===0)g.run(`holding=true;holdPos={x:200+60*Math.sin(${i}),y:DROP_Y};`);g.tick();if(i%10===0)g.c.draw();}}catch(e){err=String(e);}
  out.push({board:b,ok:!err,err,build:g.run('BUILD'),bodies:g.run('bodies.filter(b=>!b.dead).length'),orderMemory:g.run('__cp37Order.size'),backstop:g.run('typeof CP37_BACK_ZONE')});g.close();}
 console.log(JSON.stringify(out));})();
