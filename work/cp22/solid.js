// Enforce actual 3-D separating contacts, including steep coins. Small ordinary
// solver tolerances are left alone so stationary contacts can sleep.
function solidCoinContacts(before){
 const cs=bodies.filter(coinSolid).map(b=>{const q={...b.rb.rotation()},ny=Math.abs(qrot(q,{x:0,y:1,z:0}).y),side=Math.sqrt(Math.max(0,1-ny*ny));return {b,p:{...b.rb.translation()},q,c:b.rb.collider(0),vr:(b.half*ny+b.r*side)*M,hr:(b.r+b.half*side)*M};});
 const obstacles=[];world.forEachCollider(c=>{const r=c.parent();if(c.isEnabled()&&!c.isSensor()&&r&&!r.isDynamic()){
  const q=c.rotation(),h=c.halfExtents(),x=qrot(q,{x:h.x,y:0,z:0}),y=qrot(q,{x:0,y:h.y,z:0}),z=qrot(q,{x:0,y:0,z:h.z});
  obstacles.push({c,p:c.translation(),q,ext:{x:Math.abs(x.x)+Math.abs(y.x)+Math.abs(z.x),y:Math.abs(x.y)+Math.abs(y.y)+Math.abs(z.y),z:Math.abs(x.z)+Math.abs(y.z)+Math.abs(z.z)},v:r.linvel()});
 }});
 function move(a,n,d){a.p.x+=n.x*d;a.p.y+=n.y*d;a.p.z+=n.z*d;a.b.rb.setTranslation(a.p,true);}
 function stopInto(a,n,surfaceVelocity){const rb=a.b.rb,v=rb.linvel(),rel=(v.x-surfaceVelocity.x)*n.x+(v.y-surfaceVelocity.y)*n.y+(v.z-surfaceVelocity.z)*n.z;if(rel<0)rb.setLinvel({x:v.x-n.x*rel,y:v.y-n.y*rel,z:v.z-n.z*rel},true);}
 for(let pass=0;pass<3;pass++){
  let changed=false;
  for(const a of cs){
   if(a.b.rb.isSleeping())continue;
   // A correction against a coin must never leave that coin inside the plate,
   // table, or rear wall. Resolve those same native shapes in each contact pass.
   for(const o of obstacles){
    const cp=o.p,e=o.ext;if(Math.abs(cp.x-a.p.x)>=e.x+a.hr-.0015||Math.abs(cp.y-a.p.y)>=e.y+a.vr-.0015||Math.abs(cp.z-a.p.z)>=e.z+a.hr-.0015)continue;
    const hit=a.c.shape.contactShape(a.p,a.q,o.c.shape,cp,o.q,0);
    if(!hit||hit.distance>=-.0015)continue;
    const n={x:-hit.normal1.x,y:-hit.normal1.y,z:-hit.normal1.z};
    move(a,n,-hit.distance+.0001);stopInto(a,n,o.v);changed=true;
   }
  }
  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
   const a=cs[i],b=cs[j];
   if(a.b.rb.isSleeping()&&b.b.rb.isSleeping())continue;
   const r=a.hr+b.hr;
   if(Math.abs(a.p.x-b.p.x)>=r||Math.abs(a.p.y-b.p.y)>=a.vr+b.vr-.0015||Math.abs(a.p.z-b.p.z)>=r||Math.hypot(a.p.x-b.p.x,a.p.z-b.p.z)>=r)continue;
   const hit=a.c.shape.contactShape(a.p,a.q,b.c.shape,b.p,b.q,0);
   if(!hit||hit.distance>=-.0015)continue;
   let n={...hit.normal1};const oa=before.get(a.b.uid)||a.p,ob=before.get(b.b.uid)||b.p;
   if((ob.x-oa.x)*n.x+(ob.y-oa.y)*n.y+(ob.z-oa.z)*n.z<0)n={x:-n.x,y:-n.y,z:-n.z};
   const depth=-hit.distance+.0001;
   if(Math.abs(n.y)>.6){
    const top=n.y>0?b:a,low=top===a?b:a,up=top===b?n:{x:-n.x,y:-n.y,z:-n.z};
    move(top,up,depth);stopInto(top,up,low.b.rb.linvel());
    if(top.b.input&&top.b.fresh){top.b.contactLanded=true;top.b.rb.setGravityScale(1,true);}
   }else{
    const ma=a.b.rb.mass(),mb=b.b.rb.mass(),wa=mb/(ma+mb),wb=1-wa;
    move(a,n,-depth*wa);move(b,n,depth*wb);
    const av=a.b.rb.linvel(),bv=b.b.rb.linvel(),rel=(bv.x-av.x)*n.x+(bv.y-av.y)*n.y+(bv.z-av.z)*n.z;
    if(rel<0){a.b.rb.setLinvel({x:av.x+n.x*rel*wa,y:av.y+n.y*rel*wa,z:av.z+n.z*rel*wa},true);b.b.rb.setLinvel({x:bv.x-n.x*rel*wb,y:bv.y-n.y*rel*wb,z:bv.z-n.z*rel*wb},true);}
   }
   changed=true;
  }
  if(!changed)break;
 }
}
