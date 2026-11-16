// CP-37 measurement (desktop, real runtime + @napi-rs/canvas, DPR 1.35). node measure.cjs <src> <tag> [board] [seconds] [seed]
// Hold to drop for N s with the aim sweeping. Every 6 ticks: for each coin on the board, the share of its drawn outline
// that lies under the cat art (head, face, mitts) or under the back-wall clip. Every tick: the coin draw order;
// a "flip" is an overlapping pair whose order swaps, a "flicker" is a pair that swaps back within 10 ticks.
const {game}=require('../cp37/harness.cjs'),fs=require('fs'),path=require('path');
const src=path.resolve(process.argv[2]||'uat37.html'),tag=process.argv[3]||'before',board=process.argv[4]||'b3',SEC=+(process.argv[5]||60),seed=+(process.argv[6]||4);
const O=path.resolve(__dirname,'out',tag);fs.mkdirSync(O,{recursive:true});
(async()=>{
 const g=await game({seed,render:true,src}),a=g.c.__game,cv=g.c.document.getElementById('cv');
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else if(board==='wild2'){g.run('wild2Enter();wildStartCountdown()');g.ticks(240);}else g.run(`selectBoard(${{b1:0,b2:1,b3:2}[board]});S.coins=999;`);
 g.run('finishBoard=()=>{}'); // keep the board in play for the whole run (test only)
 // order capture
 let lastOrder=null;const orig=g.c.coinPaintOrder;
 g.c.coinPaintOrder=function(list){const out=orig(list);lastOrder=out;return out;};
 const W=cv.width,Hh=cv.height;
 const grab=()=>{g.c.draw();return cv.getContext('2d').getImageData(0,0,W,Hh).data;};
 const H0=()=>g.run('({h:ART.head,w:ART.headWild,s:ART.headSweet,p:drawPaws,hp:drawHappyPaws,tp:drawTrackingPupils,hf:drawHappyFeatures})');
 const blank=g.c.document.createElement('canvas');g.c.__cp37blank=blank;
 const restore=()=>g.run('ART.head=__cp37save.h;ART.headWild=__cp37save.w;ART.headSweet=__cp37save.s;drawPaws=__cp37save.p;drawHappyPaws=__cp37save.hp;drawTrackingPupils=__cp37save.tp;drawHappyFeatures=__cp37save.hf');
 const diff=(A,B)=>{const m=new Uint8Array(W*Hh);for(let i=0;i<W*Hh;i++){const k=i*4;if(Math.abs(A[k]-B[k])+Math.abs(A[k+1]-B[k+1])+Math.abs(A[k+2]-B[k+2])>24)m[i]=1;}return m;};
 const catMask=()=>{g.c.__cp37save=H0();const A=grab();
  g.run('ART.head=ART.headWild=ART.headSweet=__cp37blank;drawTrackingPupils=drawHappyFeatures=()=>{}');const F=grab();restore(); // face only blanked
  g.run('drawPaws=drawHappyPaws=()=>{}');const P=grab();restore(); // mitts only blanked
  const face=diff(A,F),mitt=diff(A,P),m=new Uint8Array(W*Hh);for(let i=0;i<m.length;i++)m[i]=face[i]?1:mitt[i]?2:0;return m;};
 const covered=(mask)=>{ // per coin: share of hull samples under the cat or clipped by the back wall
  const cam=g.run('__camera'),res=[];
  const recs=g.run('[...__coinPaintBodies.values()]');const live=new Set(g.run('bodies.filter(b=>!b.dead&&!b.danceDown&&contactSolid(b)&&!__inputInFlight(b)&&(r=>r&&r.t.x===b.rb.translation().x&&r.t.y===b.rb.translation().y&&r.t.z===b.rb.translation().z)(__coinPaintBodies.get(b.uid))).map(b=>b.uid)')); // drawn as a board coin this frame, with a current record
  for(const r of recs){if(!live.has(r.b.uid)||r.b.kind==='item')continue;
   const P=r.poly;let n=0,h=0,hf=0;const xs=P.map(p=>p.x),ys=P.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
   const inside=(x,y)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const pi=P[i],pj=P[j];if((pi.y>y)!==(pj.y>y)&&x<(pj.x-pi.x)*(y-pi.y)/(pj.y-pi.y)+pi.x)c=!c;}return c;};
   const clipBack=r.t.z/g.run('M')-r.b.r<g.run('LEDGE_BACK')-.5;
   for(let i=0;i<=12;i++)for(let j=0;j<=12;j++){const x=x0+(x1-x0)*i/12,y=y0+(y1-y0)*j/12;if(!inside(x,y))continue;n++;
    if(clipBack&&y<218){h++;hf++;continue;}
    const X=Math.round(cam[0]*x+cam[2]*y+cam[4]),Y=Math.round(cam[1]*x+cam[3]*y+cam[5]);const v=X>=0&&Y>=0&&X<W&&Y<Hh?mask[Y*W+X]:0;if(v){h++;if(v===1)hf++;}}
   const t=r.t,M=g.run('M'),v=r.b.rb.linvel(),sp=Math.hypot(v.x,v.y,v.z)/M;res.push({uid:r.b.uid,f:n?h/n:0,ff:n?hf/n:0,z:+(t.z/M).toFixed(1),h:+(t.y/M).toFixed(1),x:+(t.x/M).toFixed(1),sp:+sp.toFixed(0),kind:r.b.kind});}
  return res;};
 let mask=null,frame=0;const stats={board,seed,src:path.basename(src),samples:0,hidden90:[],rest90:[],restFace:[],restMitt:[],maxRestFace:0,maxRestMitt:0,maxRest:0,restEx:[],hidden50:[],vanish:0,maxHidden:0,flips:0,flickers:0,pairFrames:0,examples:[],ms:[]};
 const vis=new Map(),pairState=new Map();
 for(let s=0;s<SEC*60;s++){
  if(s%60===0)g.run(`S.coins=Math.max(S.coins,50);if(globalThis.WILD&&WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:${200}+70*Math.sin(${s/60}*0.9+${seed}),y:DROP_Y};`);
  g.tick();frame++;if(global.gc&&s%300===0)global.gc();
  const t0=g.realNow();
  if(s%60===0)mask=catMask();else g.run('coinPaintOrder(bodies)'); // full renders only for the cat mask
  stats.ms.push(g.realNow()-t0);
  // order stability
  if(lastOrder){const pos=new Map(lastOrder.map((b,i)=>[b.uid,i]));const recs=g.run('__coinPaintBodies');
   const ov=g.run('__coinPaintPairs');
   for(const [key,p] of ov){if(!p.a||!p.b)continue;const ua=p.a.b.uid,ub=p.b.b.uid;if(!pos.has(ua)||!pos.has(ub))continue;
    if(!(p.a.maxX>p.b.minX&&p.b.maxX>p.a.minX&&p.a.maxY>p.b.minY&&p.b.maxY>p.a.minY))continue;
    stats.pairFrames++;const o=pos.get(ua)<pos.get(ub)?1:-1,st=pairState.get(key);
    if(st&&st.o!==o&&st.f===frame-1){stats.flips++;if(st.flipAt&&frame-st.flipAt<=10){stats.flickers++;if(stats.examples.length<8)stats.examples.push({frame,ua,ub,za:+(p.a.t.z/g.run('M')).toFixed(1),zb:+(p.b.t.z/g.run('M')).toFixed(1),d:p.d});}st.flipAt=frame;}
    pairState.set(key,{o,f:frame,flipAt:st?st.flipAt:0});}
  }
  if(s%6===0&&mask){const c=covered(mask);stats.samples++;const h9=c.filter(x=>x.f>=.9),h5=c.filter(x=>x.f>=.5),r9=h9.filter(x=>x.sp<30),rf=r9.filter(x=>x.ff>=x.f/2),rm=r9.filter(x=>x.ff<x.f/2);stats.restFace.push(rf.length);stats.restMitt.push(rm.length);stats.maxRestFace=Math.max(stats.maxRestFace,rf.length);stats.maxRestMitt=Math.max(stats.maxRestMitt,rm.length);stats.rest90.push(r9.length);stats.maxRest=Math.max(stats.maxRest,r9.length);if(r9.length&&stats.restEx.length<12)stats.restEx.push({t:+(s/60).toFixed(1),coins:r9.map(x=>[x.kind,x.x,x.z,x.h,x.sp,+x.f.toFixed(2),x.ff>=x.f/2?'face':'mitt'])});stats.hidden90.push(h9.length);stats.hidden50.push(h5.length);stats.maxHidden=Math.max(stats.maxHidden,h9.length);
   for(const x of c){const was=vis.get(x.uid);if(was!==undefined&&was<.5&&x.f>=.9&&x.ff>=x.f/2){stats.vanish++;if((stats.vanishEx??=[]).length<10)stats.vanishEx.push({t:+(s/60).toFixed(1),kind:x.kind,x:x.x,z:x.z,h:x.h,speed:x.sp});}vis.set(x.uid,x.f);}
   if(s%600===594){stats['at'+Math.round(s/60)]=h9.map(x=>[x.kind,x.x,x.z,x.h,x.sp,+x.f.toFixed(2)]);}
  }
 }
 const avg=xs=>+(xs.reduce((p,x)=>p+x,0)/Math.max(1,xs.length)).toFixed(2);
 const out={...stats,hidden90avg:avg(stats.hidden90),resting90avg:avg(stats.rest90),restingFaceAvg:avg(stats.restFace),restingMittAvg:avg(stats.restMitt),hidden50avg:avg(stats.hidden50),hidden90end:stats.hidden90.at(-1),drawMs:avg(stats.ms),bodies:g.run('bodies.filter(b=>!b.dead).length'),coins:g.run('S.coins'),used:g.run('board.used')};
 delete out.hidden90;delete out.rest90;delete out.restFace;delete out.restMitt;delete out.hidden50;delete out.ms;
 fs.writeFileSync(path.join(O,`measure-${board}-s${seed}.json`),JSON.stringify(out,null,1));
 g.c.draw();fs.writeFileSync(path.join(O,`end-${board}-s${seed}.png`),cv.toBuffer('image/png'));
 console.log(JSON.stringify({board,seed,hidden90avg:out.hidden90avg,resting90avg:out.resting90avg,maxResting:out.maxRest,restingFaceAvg:out.restingFaceAvg,maxRestingFace:out.maxRestFace,restingMittAvg:out.restingMittAvg,maxRestingMitt:out.maxRestMitt,maxHidden:out.maxHidden,end:out.hidden90end,vanish:out.vanish,flips:out.flips,flickers:out.flickers,pairFrames:out.pairFrames,drawMs:out.drawMs,bodies:out.bodies}));
 g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
