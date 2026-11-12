const {game,tapAtBeat}=require('./harness.cjs');
const push=(g,id)=>g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
(async()=>{const g=await game({seed:4,render:true}),a=g.c.__game,rt=g.realNow;a.wildEnter();a.wildStartCountdown();g.ticks(240);
 const fr=()=>{let t0=rt();g.tick();const p=rt()-t0;t0=rt();g.c.draw();return [p,rt()-t0,g.run('bodies.filter(b=>!b.dead).length')];};
 const st=(xs,i)=>+(xs.reduce((s,x)=>s+x[i],0)/xs.length).toFixed(2);const rep=(n,xs)=>console.log(n,'physics',st(xs,0),'draw',st(xs,1),'bodies',st(xs,2));
 for(let i=0;i<60;i++)fr();
 let b=[];for(let i=0;i<180;i++)b.push(fr());rep('normal',b);
 g.run('WILD.happy=3');push(g,'cheese');g.until('!!WILD.dance');let d=[];
 for(let k=0;k<16;k++){const target=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target)d.push(fr());g.tap();}rep('dance',d);
 g.until("WILD.dance.phase==='finale'");let r=[];while(g.run('!!WILD.dance'))r.push(fr());rep('rain (finale)',r);let r2=[];for(let i=0;i<120;i++)r2.push(fr());rep('after rain 2s',r2);
 // reference: an existing rain 25 from UAT 36 on the same board
 g.run("(()=>{const b=addCoin('rain25',null,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");let q=[];for(let i=0;i<240;i++)q.push(fr());rep('existing rain25 (reference)',q);
 g.close();})();
