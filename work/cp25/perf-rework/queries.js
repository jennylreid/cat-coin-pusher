// The geometry is immutable in this game. Reuse its native representation;
// Rapier's public Shape.contactShape otherwise allocates/destroys both shapes
// for every contact query. Poses and results still use the same Rapier routines.
let queryWorld=null,queryShapes=new WeakMap(),queryNative=[],queryGeometry=new Map();
function nativeShape(shape){
 if(queryWorld!==world){for(const raw of queryNative)raw.free();queryNative=[];queryGeometry=new Map();queryShapes=new WeakMap();queryWorld=world;}
 let raw=queryShapes.get(shape);if(!raw){const key=JSON.stringify(shape);raw=queryGeometry.get(key);if(!raw){raw=shape.intoRaw();queryGeometry.set(key,raw);queryNative.push(raw);}queryShapes.set(shape,raw);}return raw;
}
function contactQuery(shape,p,q,other,op,oq,prediction){
 const a=nativePose(p,q),b=nativePose(op,oq),rp=a.p,rq=a.q,ro=b.p,rot=b.q;
 const hit=nativeShape(shape).contactShape(rp,rq,nativeShape(other),ro,rot,prediction);if(!hit)return null;
  try{return {distance:hit.distance(),normal1:RAPIER.VectorOps.fromRaw(hit.normal1())};}finally{hit.free();}
}
function castQuery(shape,p,q,v,other,op,oq,ov,target,max,stop){
 if(!castMayReach(shape,p,q,v,other,op,oq,ov,target,max))return null;
 const a=nativePose(p,q),b=nativePose(op,oq),rp=a.p,rq=a.q,ro=b.p,rot=b.q,rv=RAPIER.VectorOps.intoRaw(v),rov=RAPIER.VectorOps.intoRaw(ov);
 try{const hit=nativeShape(shape).castShape(rp,rq,rv,nativeShape(other),ro,rot,rov,target,max,stop);if(!hit)return null;
  try{return {time_of_impact:hit.time_of_impact()};}finally{hit.free();}
 }
 finally{rv.free();rov.free();}
}
// Per-pass native poses are reused as contacts revisit a body. Translation
// corrections update their raw coordinates before the next query.
let queryPoses=new WeakMap(),queryPoseNative=[];
function resetQueryPoses(){for(const raw of queryPoseNative)raw.free();queryPoseNative=[];queryPoses=new WeakMap();}
function nativePose(p,q){
 let pose=queryPoses.get(p);
 if(!pose){pose={p:RAPIER.VectorOps.intoRaw(p),q:RAPIER.RotationOps.intoRaw(q),x:p.x,y:p.y,z:p.z,qx:q.x,qy:q.y,qz:q.z,qw:q.w};queryPoses.set(p,pose);queryPoseNative.push(pose.p,pose.q);}
 else{
  if(pose.x!==p.x){pose.p.x=p.x;pose.x=p.x;}if(pose.y!==p.y){pose.p.y=p.y;pose.y=p.y;}if(pose.z!==p.z){pose.p.z=p.z;pose.z=p.z;}
  if(pose.qx!==q.x){pose.q.x=q.x;pose.qx=q.x;}if(pose.qy!==q.y){pose.q.y=q.y;pose.qy=q.y;}if(pose.qz!==q.z){pose.q.z=q.z;pose.qz=q.z;}if(pose.qw!==q.w){pose.q.w=q.w;pose.qw=q.w;}
 }
 return pose;
}
// Conservative swept AABB rejection before native casts. This uses exactly
// the frozen rotations and constant velocities supplied to the native cast.
function queryExtents(shape,q){
 const n=qrot(q,{x:0,y:1,z:0});
 if(shape.type===RAPIER.ShapeType.RoundCylinder||shape.type===RAPIER.ShapeType.Cylinder){
  const border=shape.borderRadius||0,h=shape.halfHeight,r=shape.radius;
  const axis=v=>h*Math.abs(v)+r*Math.sqrt(Math.max(0,1-v*v))+border+1e-6;
  return {x:axis(n.x),y:axis(n.y),z:axis(n.z)};
 }
 if(shape.type===RAPIER.ShapeType.Cuboid||shape.type===RAPIER.ShapeType.RoundCuboid){
  const h=shape.halfExtents,border=(shape.borderRadius||0)+1e-6,x=qrot(q,{x:h.x,y:0,z:0}),y=qrot(q,{x:0,y:h.y,z:0}),z=qrot(q,{x:0,y:0,z:h.z});
  return {x:Math.abs(x.x)+Math.abs(y.x)+Math.abs(z.x)+border,y:Math.abs(x.y)+Math.abs(y.y)+Math.abs(z.y)+border,z:Math.abs(x.z)+Math.abs(y.z)+Math.abs(z.z)+border};
 }
 return null;
}
function castMayReach(shape,p,q,v,other,op,oq,ov,target,max){
 const a=queryExtents(shape,q),b=queryExtents(other,oq);if(!a||!b)return true;
 for(const axis of ['x','y','z']){const start=p[axis]-op[axis],end=start+(v[axis]-ov[axis])*max,r=a[axis]+b[axis]+Math.max(0,target);if(Math.min(start,end)>r||Math.max(start,end)<-r)return false;}
 return true;
}
