
// ---------- CP-74 Hug rescue (UAT 131): while the arms hold the gutters, pieces near a side edge slide inward ----------
// Jenny (UAT 129): "anything that is about to fall off the edge or close to the edge gets relocated during the hug; it gets
// moved inward to safety." The Hug's length, art, walls and hearts are unchanged. Each tick of the 6 s hold and the let-go, any coin,
// prize or toy on the open part of the table (from the end of the fixed side wall to the front) whose outer edge is less
// than SAFE units from a side edge gets an inward push on its own velocity (real physics: it slides, carrying what it
// touches; no teleport, no fade). The push eases off as it reaches SAFE, so a piece settles there instead of overshooting.
// It keeps going through the 1.5 s let-go (the arms are still on screen), so nothing is left at an edge when the walls go.
const Z74R={
 SAFE:30,    // a piece's outer edge ends at least 30 units (just over one coin radius, 26) inside the side edge
 VMAX:90,    // the fastest inward slide, units per second (a coin crosses its own width in under a second: visible, calm)
 K:8,        // per second: the push is K x the distance still to go, capped at VMAX (eases in to SAFE)
 START:.15,  // seconds after the walls go up before the gathering starts (the arms have just landed)
 stats:{moved:0,ticks:0,maxIn:0}};
function z74RescueTick(X){const t=X.t-Z74.ON;if(t<Z74R.START||X.t>=Z74.ON+Z74.HOLD+Z74.OUT)return;const half=(T.R-T.L)/2,z0=GUARD_END-30,ids=X.rescued||(X.rescued=new Set());Z74R.stats.ticks++;
 for(const b of bodies){if(!b||b.dead||!b.rb)continue;const rb=b.rb;try{if(!rb.isEnabled()||!rb.isDynamic())continue;}catch(e){continue;}
  const p=rb.translation(),x=p.x/M,y=p.y/M,z=p.z/M;if(y<-2||z<z0||z>T.FRONT+4)continue;
  const d=x-200,gap=half-(Math.abs(d)+(b.r||COIN_R));if(gap>=Z74R.SAFE)continue;
  const want=Math.min(Z74R.VMAX,Z74R.K*(Z74R.SAFE-gap))*M,s=d<0?1:-1,v=rb.linvel();
  if(v.x*s<want){rb.setLinvel({x:s*want,y:v.y,z:v.z},true);if(!ids.has(b.uid)){ids.add(b.uid);Z74R.stats.moved++;}Z74R.stats.maxIn=Math.max(Z74R.stats.maxIn,Z74R.SAFE-gap);}}}
const __z74RTick=pgpTick;pgpTick=function(dt){__z74RTick(dt);const X=PGPX;if(X&&X.z74){try{z74RescueTick(X);}catch(e){Z74.err=String(e);}}};
