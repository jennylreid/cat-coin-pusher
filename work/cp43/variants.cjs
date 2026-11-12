const PH=require('./harness-phone.cjs'),path=require('path');
const stat=xs=>{xs=[...xs].sort((a,b)=>a-b);return {avg:+(xs.reduce((s,x)=>s+x,0)/xs.length).toFixed(1),p95:+xs[Math.floor(xs.length*.95)].toFixed(1)};};
async function busy(setup){const g=await PH.game({src:path.resolve('release.html'),seed:4,render:true}),rt=g.realNow;g.phone=true;g.run('wild2Enter();wildStartCountdown()');g.ticks(60);g.run('S.coins=999;WILD.left=170;'+setup);
 const phys=[];let acc=0;{const step=g.c.step;g.c.step=()=>{const t0=rt();step();acc+=rt()-t0;};}
 let t=0,last=-9;const ev=[[4,'wildStartRain(10)'],[10,'wildStartRain(25)'],[18,'w2Rain(20,.05)'],[44,'w2Rain(20,.05)']];
 while(t<50){for(const e of ev)if(!e.done&&t>=e[0]){e.done=true;g.run(e[1]);}if(t-last>=.25){g.c.__game.tryDrop({x:200+110*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}acc=0;g.frame();phys.push(acc);t+=1/12;}
 const r={setup,phys:stat(phys.slice(240)),bodies:g.run('bodies.filter(b=>!b.dead).length')};g.close();return r;}
(async()=>{for(const s of [''])console.log(JSON.stringify(await busy(s)));})();
