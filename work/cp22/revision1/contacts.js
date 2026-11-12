// CP-22: a final hard contact constraint for flat currency. Rapier still supplies
// gravity, friction, tray motion and impulses; this closes its missed thin contacts.
function coinSolid(b){return b.kind==='coin'||b.kind==='silver'||b.kind==='quake';}
let coinImpactVel=new Map();
function coinRotationContacts(){
 // Flat currency has no roll/pitch motor. A slanted, supported coin may tumble
 // only after a descending body actually meets its upper face.
 for(const b of bodies)if(coinSolid(b)){
  const n=qrot(b.rb.rotation(),{x:0,y:1,z:0}),v=b.rb.linvel();
  const p=b.rb.translation();let above=false,supported=false;
  world.contactPairsWith(b.rb.collider(0),other=>{
   const r=other.parent();if(!r)return;
   world.contactPair(b.rb.collider(0),other,m=>{
    if(!m.numSolverContacts())return;
    if(r.isFixed()||r.translation().y<p.y)supported=true;
    if(r.isDynamic()&&r.translation().y>p.y&&(coinImpactVel.get(r.handle)??r.linvel().y)<v.y-.3)above=true;
   });
  });
  if(supported&&above&&n.y<Math.cos(10*Math.PI/180))b.contactFlip=true;
  const tray=p.z/M<=pusherY+b.r*.2&&p.y/M>=TONGUE_H;
  const base=tray?TONGUE_H:0;
  const onPlane=p.x/M>T.L&&p.x/M<T.R&&p.z/M<T.FRONT&&p.y/M<base+b.half+.7;
  if(n.y>.99999&&onPlane&&Math.abs(v.y)<.1){
   b.contactFlip=false;b.rb.setEnabledRotations(false,true,false,true);
  }else{
   b.rb.setEnabledRotations(true,true,true,true);
   if(!b.contactFlip){
    const q=b.rb.rotation(),av=b.rb.angvel(),angle=Math.acos(Math.max(-1,Math.min(1,n.y)));
    if(angle>Math.PI/5){
     // Keep the current yaw and cap lean; only an overhead impact unlocks a flip.
     const yaw=Math.atan2(2*(q.w*q.y+q.x*q.z),1-2*(q.y*q.y+q.z*q.z));
     const axis=Math.hypot(n.x,n.z)||1,h=Math.PI/10;
     b.rb.setRotation(qmul({x:n.z/axis*Math.sin(h),y:0,z:-n.x/axis*Math.sin(h),w:Math.cos(h)},yawTurn(yaw)),true);
     b.rb.setAngvel({x:0,y:av.y,z:0},true);
    }else{const speed=Math.hypot(av.x,av.z),k=speed>1?1/speed:1;b.rb.setAngvel({x:av.x*k,y:av.y,z:av.z*k},false);}
   }
  }
 }
}
function solidCoinContacts(before){
 const cs=bodies.filter(coinSolid).map(b=>({b,p:{...b.rb.translation()},flat:qrot(b.rb.rotation(),{x:0,y:1,z:0}).y>=.97}));
 for(let pass=0;pass<6;pass++){
  let changed=false;
  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
   const a=cs[i],b=cs[j],dx=a.p.x-b.p.x,dz=a.p.z-b.p.z,dy=a.p.y-b.p.y;
   if(!a.flat||!b.flat)continue;
   const height=(a.b.half+b.b.half)*M,rad=(a.b.r+b.b.r)*M;
   if(Math.abs(dx)>=rad||Math.abs(dz)>=rad)continue;
   const oldA=before.get(a.b.uid)||a.p,oldB=before.get(b.b.uid)||b.p;
   const crossed=(oldA.y-oldB.y)*dy<0&&Math.abs(oldA.y-oldB.y)>=height;
   if(!crossed&&Math.abs(dy)>=height-.002)continue;
   const dist=Math.hypot(dx,dz);if(dist>=rad-.002)continue;
   const wasAbove=Math.abs(oldA.y-oldB.y)>height*.65;
   const vertical=crossed||wasAbove||height-Math.abs(dy)<rad-dist;
   if(vertical){
    const top=(wasAbove?oldA.y>oldB.y:dy>0)?a:b,low=top===a?b:a;
    top.p.y=low.p.y+height;
    const v=top.b.rb.linvel(),lv=low.b.rb.linvel();
    if(v.y<lv.y)top.b.rb.setLinvel({x:v.x,y:lv.y,z:v.z},true);
    if(top.b.input&&top.b.fresh){top.b.contactLanded=true;top.b.rb.setGravityScale(1,true);}
    top.b.rb.setTranslation(top.p,true);
   }else{
    const nx=dist>1e-8?dx/dist:1,nz=dist>1e-8?dz/dist:0,pen=(rad-dist)/2;
    a.p.x+=nx*pen;a.p.z+=nz*pen;b.p.x-=nx*pen;b.p.z-=nz*pen;
    a.b.rb.setTranslation(a.p,true);b.b.rb.setTranslation(b.p,true);
    const av=a.b.rb.linvel(),bv=b.b.rb.linvel(),rel=(av.x-bv.x)*nx+(av.z-bv.z)*nz;
    if(rel<0){const ma=a.b.rb.mass(),mb=b.b.rb.mass(),imp=-rel/(1/ma+1/mb);
     a.b.rb.setLinvel({x:av.x+nx*imp/ma,y:av.y,z:av.z+nz*imp/ma},true);
     b.b.rb.setLinvel({x:bv.x-nx*imp/mb,y:bv.y,z:bv.z-nz*imp/mb},true);}
   }
   changed=true;
  }
  if(!changed)break;
 }
}
