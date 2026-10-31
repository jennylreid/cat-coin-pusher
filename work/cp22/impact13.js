// Delivery uses accelerated gravity to preserve the approved screen-top fall.
// Resolve the first impact at its swept contact point, then use a soft metal
// impact speed. Do not feed screen-delivery energy into the table's physics.
function deliveryImpact(){
 for(const b of bodies){
  if(!b.input||!b.fresh||b.contactLanded)continue;
  const rb=b.rb,v=rb.linvel();if(v.y>=-1.2)continue;
  const c=rb.collider(0),p=rb.translation(),q=rb.rotation();let earliest=STEP/4,found=false;
  world.forEachCollider(other=>{
   if(other.handle===c.handle||!other.isEnabled()||other.isSensor())return;
   const r=other.parent();if(!r)return;
   const op=other.translation();if(r.isDynamic()&&(Math.abs(op.x-p.x)>1||Math.abs(op.z-p.z)>1))return;
   const hit=c.shape.castShape(p,q,v,other.shape,op,other.rotation(),r.linvel(),.0001,STEP/4,true);
   if(hit&&hit.time_of_impact<=earliest){earliest=hit.time_of_impact;found=true;}
  });
  if(!found)continue;
  rb.setTranslation({x:p.x+v.x*earliest,y:p.y+v.y*earliest,z:p.z+v.z*earliest},true);
  rb.setGravityScale(1,true);rb.setLinvel({x:v.x,y:-1.2,z:v.z},true);
  b.contactLanded=true;
 }
}
// Ordinary metal contacts dissipate impact energy; the board is not a pinball
// surface. Bound residual contact launches at every solver interval. This does
// not alter free delivery, falling payout, or an active power's impulses.
function dampCoinImpacts(){
 if(shake>0||sweepTime>0)return;
 for(const b of bodies){
  if(!coinSolid(b)||b.rb.isSleeping()||(b.input&&b.fresh&&!b.contactLanded))continue;
  const rb=b.rb,p=rb.translation();if(p.y<0||p.z/M>T.FRONT||p.x/M<T.L||p.x/M>T.R)continue;
  const v=rb.linvel(),speed=Math.hypot(v.x,v.z),k=speed>1.2?1.2/speed:1;
  if(k<1||v.y>.35)rb.setLinvel({x:v.x*k,y:Math.min(v.y,.35),z:v.z*k},true);
 }
}
