// Render a separate list, with overlapping convex coins ordered by their actual
// separating plane. A centre-height key cannot order a leaning/stacked coin.
let __coinPaintMasks=new Map();
const __coinPaintBodies=new Map(),__coinPaintPairs=new Map();let __coinPaintLast=null;
function coinPaintOrder(list){
 const audit=globalThis.__coinOrderAudit;if(audit)audit.frames=(audit.frames||0)+1;
 const base=list.slice().sort((a,b)=>a.sortK-b.sortK||a.uid-b.uid);
 if(!base.some(b=>__coinPaintBodies.has(b.uid))){__coinPaintBodies.clear();__coinPaintPairs.clear();__coinPaintLast=null;}
 const records=base.map(b=>{
  if(b.danceDown||!contactSolid(b)||__inputInFlight(b))return null;
  const t=b.rb.translation(),q=b.rb.rotation(),c=screenOf(t.x/M,t.z/M,t.y/M);
  const prev=__coinPaintBodies.get(b.uid);
  if(prev&&prev.t.x===t.x&&prev.t.y===t.y&&prev.t.z===t.z&&prev.q.x===q.x&&prev.q.y===q.y&&prev.q.z===q.z&&prev.q.w===q.w)return prev;
  let n=qrot(q,{x:0,y:1,z:0}),u=qrot(q,{x:1,y:0,z:0}),w=qrot(q,{x:0,y:0,z:1});
  if(n.y*LIFT+n.z*SQUASH<0){n={x:-n.x,y:-n.y,z:-n.z};w={x:-w.x,y:-w.y,z:-w.z};}
  const pn=projVec(n,c.s,c),pu=projVec(u,c.s,c),pw=projVec(w,c.s,c),points=[];
  const face=b.kind==='quake'?QUAKE_THICK-b.half:b.half;
  for(const h of [-b.half,face])for(let i=0;i<20;i++){
   const a=i*Math.PI/10,x=Math.cos(a)*b.r,z=Math.sin(a)*b.r;
   points.push({x:c.x+pn.x*h+pu.x*x+pw.x*z,y:c.y+pn.y*h+pu.y*x+pw.y*z});
  }
  // Treat art is an upright billboard anchored to the bottom of its rigid body.
  // Include its visible footprint when deciding overlap; retain its approved art.
  let prize=null;
  if(b.kind==='item'){
   const anchor=screenOf(t.x/M,t.z/M,__lift(b,t.z/M,t.y/M)-b.half);
   const width=radius('item')*anchor.s*(b.id==='tuna'?3.8:2.8);
   const height=b.id==='tuna'?width*ART.tuna.height/ART.tuna.width:width;
   prize={x:anchor.x-width/2,y:anchor.y-height*(b.id==='tuna'?.8:.7),width,height,id:b.id};
  }
  const poly=prize?[{x:prize.x,y:prize.y},{x:prize.x+prize.width,y:prize.y},{x:prize.x+prize.width,y:prize.y+prize.height},{x:prize.x,y:prize.y+prize.height}]:__coinHull(points),xs=poly.map(p=>p.x),ys=poly.map(p=>p.y);
  const record={b,t,q,c,pn,pu,pw,face,poly,prize,minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys)};
  __coinPaintBodies.set(b.uid,record);return record;
 });
 if(__coinPaintLast&&records.length===__coinPaintLast.records.length&&records.every((r,i)=>r===__coinPaintLast.records[i]&&base[i].uid===__coinPaintLast.ids[i]&&base[i].sortK===__coinPaintLast.keys[i]))return __coinPaintLast.order;
 const edges=base.map(()=>[]),indegree=base.map(()=>0);
 for(let i=0;i<base.length;i++)for(let j=i+1;j<base.length;j++){
  const a=records[i],b=records[j];if(!a||!b||a.maxX<=b.minX||b.maxX<=a.minX||a.maxY<=b.minY||b.maxY<=a.minY)continue;
  const key=a.b.uid+':'+b.b.uid;let pair=__coinPaintPairs.get(key);
  if(!pair||pair.a!==a||pair.b!==b){
   pair={a,b,d:0};
   if(__coinPolysOverlap(a.poly,b.poly)){
    const hit=a.b.rb.collider(0).shape.contactShape(a.t,a.q,b.b.rb.collider(0).shape,b.t,b.q,100);
    if(hit){const x=(a.t.x+b.t.x)/(2*M),h=(a.t.y+b.t.y)/(2*M),z=(a.t.z+b.t.z)/(2*M),p=__plane(z);
     pair.d=hit.normal1.x*(-(x-200)*p.dg/p.gx)+hit.normal1.y*((p.dy-h*LIFT*p.dg)/(LIFT*p.gx))+hit.normal1.z;pair.distance=hit.distance;}
   }
   __coinPaintPairs.set(key,pair);
  }
  const d=pair.d;
  if(Math.abs(d)<.015)continue;
  const behind=d>0?i:j,front=d>0?j:i;edges[behind].push(front);indegree[front]++;
  if(audit&&(a.b.kind==='item'||b.b.kind==='item')){audit.treatConstraints=(audit.treatConstraints||0)+1;if(behind>front){audit.treatLegacyWrong=(audit.treatLegacyWrong||0)+1;if(!audit.treatExample)audit.treatExample={a:{kind:a.b.kind,id:a.b.id,p:a.t,q:a.q},b:{kind:b.b.kind,id:b.b.id,p:b.t,q:b.q},distance:pair.distance,front:base[front].kind};}}
  if(audit){audit.constraints=(audit.constraints||0)+1;if(behind>front){audit.oldWrong=(audit.oldWrong||0)+1;if((audit.examples??=[]).length<5&&pair.distance>0)audit.examples.push({a:{uid:a.b.uid,p:a.t,q:a.q},b:{uid:b.b.uid,p:b.t,q:b.q},distance:pair.distance,front:base[front].uid});}}
 }
 const out=[],done=new Set();
 for(let k=0;k<base.length;k++){
  let i=base.findIndex((_,n)=>!done.has(n)&&indegree[n]===0);
  // Three overlapping silhouettes can form a painter's cycle. Keep a stable
  // fallback instead of changing physics state or changing order arbitrarily.
  if(i<0){if(audit)audit.cycleFallbacks=(audit.cycleFallbacks||0)+1;i=base.findIndex((_,n)=>!done.has(n));}
  done.add(i);out.push(base[i]);for(const j of edges[i])indegree[j]--;
 }
 __coinPaintMasks=new Map();const rank=new Map(out.map((b,i)=>[b.uid,i]));
 for(let i=0;i<base.length;i++)for(const j of edges[i])if(rank.get(base[j].uid)<rank.get(base[i].uid)){
  const uid=base[i].uid;if(!__coinPaintMasks.has(uid))__coinPaintMasks.set(uid,[]);
  const front=records[j];
  if(front.prize){__coinPaintMasks.get(uid).push({prize:front.prize});}
  else{
   if(!front.maskPoly){const points=[];for(const h of [-front.b.half,front.face])for(let k=0;k<48;k++){const a=k*Math.PI/24,x=Math.cos(a)*front.b.r,z=Math.sin(a)*front.b.r;points.push({x:front.c.x+front.pn.x*h+front.pu.x*x+front.pw.x*z,y:front.c.y+front.pn.y*h+front.pu.y*x+front.pw.y*z});}front.maskPoly=__coinHull(points);}
   __coinPaintMasks.get(uid).push(front.maskPoly);
  }
  if(audit)audit.clippedCycleEdges=(audit.clippedCycleEdges||0)+1;
 }
 __coinPaintLast={records,ids:base.map(b=>b.uid),keys:base.map(b=>b.sortK),order:out};return out;
}
const __prizeMaskRuns=new Map();
function __prizeRuns(id){
 if(__prizeMaskRuns.has(id))return __prizeMaskRuns.get(id);
 const cv=document.createElement('canvas');cv.width=64;cv.height=64;const cx=cv.getContext('2d');
 if(id==='tuna')cx.drawImage(ART.tuna,0,0,64,64);
 else{const w=ART.snacks.width/2;cx.drawImage(ART.snacks,id==='shrimp'?w:0,0,w,ART.snacks.height,0,0,64,64);}
 const data=cx.getImageData(0,0,64,64).data,runs=[];
 for(let y=0;y<64;y++)for(let x=0;x<64;){if(data[(y*64+x)*4+3]<32){x++;continue;}const start=x;while(x<64&&data[(y*64+x)*4+3]>=32)x++;runs.push([start/64,y/64,(x-start)/64,1/64]);}
 __prizeMaskRuns.set(id,runs);return runs;
}
function drawCoinOccluded(b){
 const masks=__coinPaintMasks.get(b.uid);
 if(!masks?.length){drawBody(b);return;}
 ctx.save();
 for(const poly of masks){
  ctx.beginPath();ctx.rect(-10000,-10000,20000,20000);
  if(poly.prize){const p=poly.prize;for(const [x,y,w,h] of __prizeRuns(p.id))ctx.rect(p.x+x*p.width,p.y+y*p.height,w*p.width,h*p.height);}
  else{ctx.moveTo(poly[0].x,poly[0].y);for(const p of poly.slice(1))ctx.lineTo(p.x,p.y);ctx.closePath();}
  ctx.clip('evenodd');
 }
 drawBody(b);ctx.restore();
}
function __coinHull(points){
 points.sort((a,b)=>a.x-b.x||a.y-b.y);
 const cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x),low=[],high=[];
 for(const p of points){while(low.length>1&&cross(low[low.length-2],low[low.length-1],p)<=0)low.pop();low.push(p);}
 for(let i=points.length-1;i>=0;i--){const p=points[i];while(high.length>1&&cross(high[high.length-2],high[high.length-1],p)<=0)high.pop();high.push(p);}
 low.pop();high.pop();return low.concat(high);
}
function __coinPolysOverlap(a,b){
 for(const poly of [a,b])for(let i=0;i<poly.length;i++){
  const p=poly[i],q=poly[(i+1)%poly.length],nx=p.y-q.y,ny=q.x-p.x;
  let loA=Infinity,hiA=-Infinity,loB=Infinity,hiB=-Infinity;
  for(const v of a){const d=nx*v.x+ny*v.y;if(d<loA)loA=d;if(d>hiA)hiA=d;}
  for(const v of b){const d=nx*v.x+ny*v.y;if(d<loB)loB=d;if(d>hiB)hiB=d;}
  if(hiA<=loB||hiB<=loA)return false;
 }
 return true;
}
