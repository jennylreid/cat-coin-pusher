
// ---------- CP-74 Hug rescue + arms hold everything (UAT 131 rescue; Jenny on UAT 131: "Fix: hug arms stop prizes completely,
// nothing goes over: yes.") ----------
// Jenny (UAT 129): "anything that is about to fall off the edge or close to the edge gets relocated during the hug; it gets
// moved inward to safety." Any coin, prize or toy on the open part of the table (from the end of the fixed side wall to the
// front) whose outer edge is less than SAFE units from a side edge gets an inward push on its own velocity (real physics: it
// slides, carrying what it touches; no teleport, no fade), easing off as it reaches SAFE. It runs from the moment the arms
// start reaching in until the end of the let-go.
// Why the sock got out (UAT 131): a piece already hanging over a side edge when the walls appeared ended up inside the wall,
// whose bottom was exactly at table level, and was squeezed out underneath it (traced headless: a coin at x 372, y 0 slid out
// under the wall 1.25 s into the hold). Fix: (1) the nudge starts as the arms start reaching in (was 0.15 s after the walls
// went up), so a teetering piece is pulled back onto the table before the walls exist; (2) the same two walls, same place,
// same timing, now reach from below the table top (WALL_BOT) to well above any pile (WALL_TOP), so nothing goes under or over.
const Z74R={
 SAFE:30,    // a piece's outer edge ends at least 30 units (just over one coin radius, 26) inside the side edge
 VMAX:90,    // the fastest inward slide, units per second (a coin crosses its own width in under a second: visible, calm)
 K:8,        // per second: the push is K x the distance still to go, capped at VMAX (eases in to SAFE)
 WALL_BOT:-40, // the walls start 40 below the table top (was 0: pieces at the edge could slip out underneath)
 WALL_TOP:320, // ...and end 320 above it (was 80; piles near the sides reach about 50)
 stats:{moved:0,ticks:0,maxIn:0}};
function z74RescueTick(X){if(X.t>=Z74.ON+Z74.HOLD+Z74.OUT)return;const half=(T.R-T.L)/2,z0=GUARD_END-30,ids=X.rescued||(X.rescued=new Set());Z74R.stats.ticks++;
 for(const b of bodies){if(!b||b.dead||!b.rb)continue;const rb=b.rb;try{if(!rb.isEnabled()||!rb.isDynamic())continue;}catch(e){continue;}
  const p=rb.translation(),x=p.x/M,y=p.y/M,z=p.z/M;if(y<-2||z<z0||z>T.FRONT+4)continue;
  const d=x-200,gap=half-(Math.abs(d)+(b.r||COIN_R));if(gap>=Z74R.SAFE)continue;
  const want=Math.min(Z74R.VMAX,Z74R.K*(Z74R.SAFE-gap))*M,s=d<0?1:-1,v=rb.linvel();
  if(v.x*s<want){rb.setLinvel({x:s*want,y:v.y,z:v.z},true);if(!ids.has(b.uid)){ids.add(b.uid);Z74R.stats.moved++;}Z74R.stats.maxIn=Math.max(Z74R.stats.maxIn,Z74R.SAFE-gap);}}}
const __z74RTick=pgpTick;pgpTick=function(dt){__z74RTick(dt);const X=PGPX;if(X&&X.z74){try{z74RescueTick(X);}catch(e){Z74.err=String(e);}}};
// the same two gutter walls (same x, z, length, thickness, friction and timing), taller and reaching below the table top
z74Walls=function(){const len=T.FRONT-GUARD_END+40,z=(GUARD_END+T.FRONT)/2,h=(Z74R.WALL_TOP-Z74R.WALL_BOT)/2,yc=(Z74R.WALL_TOP+Z74R.WALL_BOT)/2;
 return [-1,1].map(s=>world.createCollider(RAPIER.ColliderDesc.cuboid(8*M,h*M,len/2*M).setTranslation((200+s*((T.R-T.L)/2+8))*M,yc*M,z*M).setFriction(.2)));};
