// CP-37 flicker check with an ID buffer. node flicker.cjs <src> <tag> [board] [warmSec] [winSec] [seed]
// Plays hold-to-drop for warmSec (board kept in play), then each tick draws the board coins only, in the game's own
// order and with its own clip masks, but each coin filled with a unique flat colour over its outline. Per coin we get
// the pixels where it is on top. A flicker is a coin that barely moved (< 0.5 units, < 2 degrees) whose on-top area
// drops by over 35% for 1-3 frames and then comes back (it blinked behind another coin and back again).
const {game}=require('../cp37/harness.cjs'),fs=require('fs'),path=require('path');
const src=path.resolve(process.argv[2]||'uat37.html'),tag=process.argv[3]||'before',board=process.argv[4]||'wild',WARM=+(process.argv[5]||40),WIN=+(process.argv[6]||8),seed=+(process.argv[7]||4);
const O=path.resolve(__dirname,'out',tag);fs.mkdirSync(O,{recursive:true});
(async()=>{
 const g=await game({seed,render:true,src}),a=g.c.__game,cv=g.c.document.getElementById('cv'),W=cv.width,Hh=cv.height,M=g.run('M');
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else if(board==='wild2'){g.run('wild2Enter();wildStartCountdown()');g.ticks(240);}else g.run(`selectBoard(${{b1:0,b2:1,b3:2}[board]});S.coins=999;`);
 g.run('finishBoard=()=>{}'); // keep the board in play for the whole run (test only)
 const hold=s=>g.run(`S.coins=Math.max(S.coins,50);if(globalThis.WILD&&WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+${seed}),y:DROP_Y};`);
 for(let s=0;s<WARM;s++){hold(s);g.ticks(60);}
 // ID pass: drawBody fills the coin's outline (the same hull the order code uses) in a colour that encodes its uid.
 g.run(`globalThis.__idDraw=function(b){const r=__coinPaintBodies.get(b.uid);let P=r&&r.poly;if(!P){const t=b.rb.translation(),q=b.rb.rotation(),c=screenOf(t.x/M,t.z/M,t.y/M),n=projVec(qrot(q,{x:0,y:1,z:0}),c.s,c),u=projVec(qrot(q,{x:1,y:0,z:0}),c.s,c),w=projVec(qrot(q,{x:0,y:0,z:1}),c.s,c),pts=[];for(const h of [-b.half,b.half])for(let i=0;i<20;i++){const a=i*Math.PI/10,x=Math.cos(a)*b.r,z=Math.sin(a)*b.r;pts.push({x:c.x+n.x*h+u.x*x+w.x*z,y:c.y+n.y*h+u.y*x+w.y*z});}P=__coinHull(pts);}ctx.fillStyle='rgb('+(b.uid&255)+','+(((b.uid>>8)&63)|128)+',165)';ctx.beginPath();ctx.moveTo(P[0].x,P[0].y);for(const p of P.slice(1))ctx.lineTo(p.x,p.y);ctx.closePath();ctx.fill();}`);
 const idPass=(full)=>{if(full)g.c.draw();g.run('{const real=drawBody;drawBody=__idDraw;ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle="#000";ctx.fillRect(0,0,cv.width,cv.height);ctx.restore();ctx.save();ctx.setTransform(...__camera);ctx.imageSmoothingEnabled=false;try{__drawBoardBodies();}finally{drawBody=real;ctx.restore();}}');
  const d=cv.getContext('2d').getImageData(0,0,W,Hh).data,cnt=new Map(),ids=new Uint16Array(W*Hh);
  for(let k=0;k<d.length;k+=4){if(d[k+2]!==165||!(d[k+1]&128))continue;const uid=d[k]|((d[k+1]&63)<<8);ids[k>>2]=uid;cnt.set(uid,(cnt.get(uid)||0)+1);}cnt.ids=ids;return cnt;};
 const pose=()=>new Map(g.run('bodies.filter(b=>!b.dead&&!b.danceDown&&b.kind!=="item").map(b=>[b.uid,b.rb.translation(),b.rb.rotation()])').map(([u,t,q])=>[u,{t:{...t},q:{...q}}]));
 const hist=new Map();let I0=null,I1=null,aba=0,abaPx=0,stillAba=0,stillAbaPx=0,P0=null,P1=null,maskToggles=0;const maskWas=new Map();const abaEx=[];let events=0,frames=0,coinFrames=0;const ex=[];const pngs=[];
 for(let s=0;s<WIN*60;s++){
  if(s%60===0)hold(WARM+s/60);
  g.tick();const P=pose(),cnt=idPass(s%60===0);frames++;
  {const I2=cnt.ids;if(I0){const pairs=new Map();for(let i=0;i<I2.length;i++){const a=I0[i];if(a&&a===I2[i]&&I1[i]!==a){const k=a+':'+I1[i];pairs.set(k,(pairs.get(k)||0)+1);}}
   const still=u=>{const a0=P0&&P0.get(u),a2=P.get(u);if(!a0||!a2)return false;return Math.hypot(a2.t.x-a0.t.x,a2.t.y-a0.t.y,a2.t.z-a0.t.z)/M<.15&&Math.abs(a2.q.x*a0.q.x+a2.q.y*a0.q.y+a2.q.z*a0.q.z+a2.q.w*a0.q.w)>Math.cos(.5*Math.PI/360);};
   for(const [k,n] of pairs){abaPx+=n;const [ua,ub]=k.split(':').map(Number);const st=still(ua)&&(ub===0||still(ub));if(st){stillAbaPx+=n;if(n>=40)stillAba++;}if(n>=150){aba++;if(abaEx.length<10)abaEx.push({frame:frames,pair:k,px:n,still:st});}}}I0=I1;I1=I2;P0=P1;P1=P;}
  {const now=new Set(g.run('[...__coinPaintMasks.keys()]'));for(const u of new Set([...maskWas.keys(),...now])){if((maskWas.get(u)||false)!==now.has(u))maskToggles++;maskWas.set(u,now.has(u));}}if(process.env.DBG&&s%30===0){console.log("ids",cnt.size,"bodies",P.size,"sum",[...cnt.values()].reduce((a,b)=>a+b,0));fs.writeFileSync(path.join(O,"idpass.png"),cv.toBuffer("image/png"));}
  pngs.push(null);
  for(const [uid,p] of P){const v=cnt.get(uid)||0;let h=hist.get(uid);if(!h){h=[];hist.set(uid,h);}h.push({v,p,f:frames});if(h.length>6)h.shift();coinFrames++;
   // dip then recovery: frame A (base), 1-3 frames low, then back
   if(h.length>=3){const last=h[h.length-1];for(let back=2;back<=4&&back<h.length;back++){const base=h[h.length-1-back];if(base.v<120)continue;
     const mid=h.slice(h.length-back,h.length-1);if(mid.length===0)continue;
     const still=[...mid,last].every(x=>Math.hypot(x.p.t.x-base.p.t.x,x.p.t.y-base.p.t.y,x.p.t.z-base.p.t.z)/M<.5&&Math.abs(x.p.q.x*base.p.q.x+x.p.q.y*base.p.q.y+x.p.q.z*base.p.q.z+x.p.q.w*base.p.q.w)>Math.cos(Math.PI/180));
     if(still&&mid.every(x=>x.v<base.v*.65)&&last.v>base.v*.85){events++;if(ex.length<10)ex.push({frame:frames,uid,base:base.v,dip:Math.min(...mid.map(x=>x.v)),back:last.v,z:+(base.p.t.z/M).toFixed(1),h:+(base.p.t.y/M).toFixed(1)});h.splice(0,h.length-1);break;}}}
  }
 }
 const out={board,seed,src:path.basename(src),frames,coinFrames,flickerEvents:events,stillAbaEvents:stillAba,stillAbaPx,maskToggles,abaEvents:aba,abaPerSecond:+(aba/WIN).toFixed(2),abaPx,abaExamples:abaEx,perSecond:+(events/WIN).toFixed(2),examples:ex,bodies:g.run('bodies.filter(b=>!b.dead).length')};
 fs.writeFileSync(path.join(O,`flicker-${board}-s${seed}.json`),JSON.stringify(out,null,1));console.log(JSON.stringify(out));g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
