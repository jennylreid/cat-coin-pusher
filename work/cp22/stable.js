// CP-22 revision: native contacts only; no post-solver translations or rotation snaps.
function coinSolid(b){return b.kind==='coin'||b.kind==='silver'||b.kind==='quake';}
let coinImpactVel=new Map();
function coinRotationContacts(){
 for(const b of bodies)if(coinSolid(b)){
  const rb=b.rb,p=rb.translation(),v=rb.linvel(),av=rb.angvel();rb.resetTorques(false);
  const n=qrot(rb.rotation(),{x:0,y:1,z:0});
  const onGround=n.y>.9999&&p.y/M<b.half+.7&&p.x/M>T.L&&p.x/M<T.R&&p.z/M<T.FRONT;
  if(onGround){if(!b.rotLocked){rb.setEnabledRotations(false,false,false,true);b.rotLocked=true;}b.contactFlip=false;continue;}
  let above=false,supported=false,plane=false,px=0,pz=0,points=0;
  world.contactPairsWith(rb.collider(0),other=>{
   const r=other.parent();if(!r)return;
   world.contactPair(rb.collider(0),other,m=>{
    if(!m.numSolverContacts())return;
    if(r.isFixed()||r.translation().y<p.y){supported=true;if(Math.abs(m.normal().y)>.995){plane=true;for(let i=0;i<m.numSolverContacts();i++){const at=m.solverContactPoint(i);px+=at.x;pz+=at.z;points++;}}}
    if(r.isDynamic()&&r.translation().y>p.y&&(coinImpactVel.get(r.handle)??r.linvel().y)<v.y-1.2)above=true;
   });
  });
  if(supported&&above&&Math.abs(v.y)<.35&&Math.abs(n.y)<Math.cos(10*Math.PI/180)){b.flipUntil=time+.65;b.restFaceSign=undefined;}
  b.contactFlip=time<(b.flipUntil??-1);
  const centred=points>0&&Math.hypot(px/points-p.x,pz/points-p.z)<b.r*M*.25;
  const quiet=Math.abs(n.y)>.9999&&supported&&plane&&centred&&Math.hypot(v.x,v.y,v.z)<.03&&Math.hypot(av.x,av.y,av.z)<.1;
  b.quietCoin=quiet?(b.quietCoin||0)+STEP/4:0;
  const locked=b.quietCoin>.15&&!above;
  if(locked!==!!b.rotLocked){rb.setEnabledRotations(!locked,!locked,!locked,true);b.rotLocked=locked;}
  if(locked){b.contactFlip=false;continue;}
  if(!b.contactFlip){
   // A damped restoring torque acts before the contact solver. It helps coins
   // settle flat without overriding the solver's collision response afterward.
   const sign=b.restFaceSign??(b.restFaceSign=n.y>=0?1:-1),inertia=rb.mass()*(3*(b.r*M)**2+(2*b.half*M)**2)/12;
   const x=inertia*(-n.z*sign*225-30*av.x),z=inertia*(n.x*sign*225-30*av.z);
   if(Math.abs(x)+Math.abs(z)>1e-7)rb.addTorque({x,y:0,z},true);
  }
 }
}
