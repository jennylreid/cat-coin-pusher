const make=require('../runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/stage2/draft.html')}),a=g.c.__game;
let previous=[],candidates=0,sweptHits=0,through=0,substeps=0;const examples=[];
const nativeStep=a.world.step.bind(a.world);a.world.step=function(){previous=a.bodies.filter(b=>['coin','silver','quake','item'].includes(b.kind)).map(b=>({b,p:{...b.rb.translation()},q:{...b.rb.rotation()},s:b.rb.collider(0).shape}));return nativeStep();};
const solid=g.c.solidCoinContacts;g.c.solidCoinContacts=function(before){solid(before);substeps++;
 for(let i=0;i<previous.length;i++)for(let j=i+1;j<previous.length;j++){
  const x=previous[i],y=previous[j],xp=x.b.rb.translation(),yp=y.b.rb.translation(),oldDy=x.p.y-y.p.y,newDy=xp.y-yp.y;
  if(oldDy*newDy>=0||Math.hypot((x.p.x+xp.x-y.p.x-yp.x)/2,(x.p.z+xp.z-y.p.z-yp.z)/2)>(x.b.r+y.b.r)*.01)continue;
  const xq=x.b.rb.rotation(),yq=y.b.rb.rotation(),old=x.s.contactShape(x.p,x.q,y.s,y.p,y.q,.01),now=x.s.contactShape(xp,xq,y.s,yp,yq,.01);
  if(old&&old.distance<.002||now&&now.distance<.002)continue;
  candidates++;
  const vx={x:xp.x-x.p.x,y:xp.y-x.p.y,z:xp.z-x.p.z},vy={x:yp.x-y.p.x,y:yp.y-y.p.y,z:yp.z-y.p.z};
  const hit=x.s.castShape(x.p,x.q,vx,y.s,y.p,y.q,vy,0,1,true);if(!hit)continue;sweptHits++;
  let deepest=0;
  const mix=(u,v,k)=>({x:u.x+(v.x-u.x)*k,y:u.y+(v.y-u.y)*k,z:u.z+(v.z-u.z)*k});
  const mixQ=(u,v,k)=>{if(u.x*v.x+u.y*v.y+u.z*v.z+u.w*v.w<0)v={x:-v.x,y:-v.y,z:-v.z,w:-v.w};const q={...mix(u,v,k),w:u.w+(v.w-u.w)*k},d=Math.hypot(q.x,q.y,q.z,q.w);return {x:q.x/d,y:q.y/d,z:q.z/d,w:q.w/d};};
  for(const k of [.2,.4,.5,.6,.8]){const c=x.s.contactShape(mix(x.p,xp,k),mixQ(x.q,xq,k),y.s,mix(y.p,yp,k),mixQ(y.q,yq,k),0);if(c)deepest=Math.max(deepest,-c.distance*100);}
  if(deepest>.3){through++;if(examples.length<3)examples.push({substep:substeps,ids:[x.b.uid,y.b.uid],kinds:[x.b.kind,y.b.kind],old:[x.p,y.p],now:[{...xp},{...yp}],q:[x.q,y.q,xq,yq],deepest});}
 }
};
for(let f=0;f<60*20;f++){if(f%12===0)a.tryDrop({x:200+60*Math.sin(f*.37)});g.tick();}
const out={substeps,fullySeparatedCentreOrderCrossings:candidates,sweptShapeHits:sweptHits,confirmedThroughCrossings:through,examples};fs.writeFileSync('tickets/CP-25-evidence/stage2/swept.json',JSON.stringify(out,null,2));console.log(out);g.close();})();

