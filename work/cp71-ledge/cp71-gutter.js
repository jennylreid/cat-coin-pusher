// ---------- CP-71 gutter push (Jenny, Nov 20, on UAT 129: "The yawn takes away, it doesn't give to the player... it's
// reaching toward the side of the board and pushing the coins into the gutter." "It should probably go after something
// like a special coin if it's close to the edge." "It shouldn't eat coins; it should push them into the gutter.") ----------
// Food runs are unchanged (the cat grabs and eats food as before). With no food in reach the wheel's Yawn no longer takes
// coins away by flicking them off behind the table (they shrank into the distance): it picks a few coins lying near a SIDE
// edge of the table's open part (a special coin near a side first, with a few ordinary coins next to it; with none, the
// ordinary coins nearest a side where most lie together), the mitt on that side drapes down to just inside them as before
// and pushes them outward: the coins themselves are driven by the physics over the side, past the low side lip, and fall
// into the gutter by the game's normal path (gutterOff: lost to the player, its usual fall; nothing removed, shrunk or
// hidden). The mitt then lifts and returns to rest. Approved mitt art, faces and the pickup are unchanged; no fades.
const CP71G={zone:60,wide:120,max:4,dz:55,settle:.08,push:.4,after:1.0,minSpeed:120,stats:{runs:0,pushed:0,gutter:0,special:0,picks:[]}};
function cp71GPlain(b){return b.kind==='coin'||b.kind==='silver'||b.kind==='gold5';}
function cp71GCoin(b){return !!b&&!b.dead&&!!b.rb&&b.kind!=='item'&&b.kind!=='stack';} // any coin, special coins included; never prizes, toys or tower blocks
// on the table's open part (the sides behind the guards are walled; the front ledge is left alone)
function cp71GOnTable(b){if(!cp71GCoin(b))return false;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
 return y>-3&&z>=GUARD_END+COIN_R&&z<=T.FRONT-15&&Math.abs(x-200)<=tableHalfAt(z)+2;} // (picked only up to T.FRONT-45; the pusher may nudge one forward before the mitt lands)
function cp71GGap(o){return tableHalfAt(o.z)-Math.abs(o.x-200);} // distance from the coin's centre to its side edge
cp58CoinTargets=function(){
 const all=[];for(const b of bodies){if(!cp71GOnTable(b))continue;const p=b.rb.translation(),o={b,x:p.x/M,z:p.z/M};if(o.z>T.FRONT-45)continue;o.side=o.x<200?-1:1;o.gap=cp71GGap(o);o.special=!cp71GPlain(b);all.push(o);}
 if(!all.length)return [];
 let A=null,zone=CP71G.zone;
 // a special coin near a side first (the nearest to its edge)
 const sp=all.filter(o=>o.special&&o.gap<=CP71G.wide).sort((a,d)=>a.gap-d.gap);if(sp.length){A=sp[0];zone=Math.max(CP71G.zone,A.gap+20);}
 if(!A)for(const zz of [CP71G.zone,CP71G.wide,9999]){const c=all.filter(o=>o.gap<=zz);if(!c.length)continue;zone=zz;
  for(const o of c)o.n=c.filter(q=>q.side===o.side&&Math.abs(q.z-o.z)<=CP71G.dz).length;c.sort((a,d)=>d.n-a.n||a.gap-d.gap);A=c[0];break;}
 const pick=[A,...all.filter(o=>o!==A&&o.side===A.side&&Math.abs(o.z-A.z)<=CP71G.dz&&o.gap<=zone+30).sort((a,d)=>(a.gap+.5*Math.abs(a.z-A.z))-(d.gap+.5*Math.abs(d.z-A.z))).slice(0,CP71G.max-1)];
 CP71G.stats.picks.push(pick.map(o=>[o.b.kind,Math.round(o.x),Math.round(o.z),Math.round(o.gap)]));if(CP71G.stats.picks.length>20)CP71G.stats.picks.shift();
 return pick.map(o=>o.b);};
// the side the push goes to is the target's side (the mitt on that side)
const __cp71GGrab=cp58CoinGrab;
cp58CoinGrab=function(grabs){__cp71GGrab(grabs);const g=grabs.find(x=>x.coins);if(!g)return;const x=g.b.rb.translation().x/M;g.side=x<200?-1:1;g.pushSide=g.side;};
// where the mitt aims: just inside the coins (toward the middle), level with them; and where the push ends (over the side)
function cp71GSpan(g){const L=[g.b,...(g.coins||[])].filter(cp71GCoin);if(!L.length)return null;const s=g.pushSide||g.side;
 let z=0,xin=s>0?1e9:-1e9;for(const c of L){const p=c.rb.translation();z+=p.z/M;xin=s>0?Math.min(xin,p.x/M):Math.max(xin,p.x/M);}z/=L.length;
 return {z,xin,xout:200+s*(tableHalfAt(z)+COIN_R*.6),s};}
const __cp71GScreen=cp58PrizeScreen;
cp58PrizeScreen=function(g){if(!g||!g.coins)return __cp71GScreen(g);
 if(!g.pushing){const s=cp71GSpan(g);if(s){g.span=s;const e=skyScreen(s.xin-s.s*COIN_R*.7,s.z,0);g.at={x:e.x,y:e.y,s:e.s};}}
 if(!g.at)return __cp71GScreen(g);return g.at;};
// at the mitt's hit: the push starts (no rummage, no flick)
cp71Rummage=function(g){const Y=W2_YAWN;g.rummage=true;g.pushing=true;g.pushT0=Y.t+CP71G.settle;g.knockAt=g.pushT0+CP71G.push;Y.knockEnd=g.knockAt+CP71G.after;
 const s=g.span||cp71GSpan(g);g.span=s;
 const e0=skyScreen(s.xin-s.s*COIN_R*.7,s.z,0),e1=skyScreen(s.xout-s.s*COIN_R*.7,s.z,0);g.pushFrom={x:e0.x,y:e0.y};g.pushTo={x:e1.x,y:e1.y};
 g.pushList=[g.b,...(g.coins||[]).filter(c=>c!==g.b)].filter(cp71GOnTable);
 for(const c of g.pushList){const x=c.rb.translation().x/M,z=c.rb.translation().z/M;c.cp71Side=s.s;c.cp71Speed=Math.max(CP71G.minSpeed,(tableHalfAt(z)+COIN_R*2-Math.abs(x-200))/CP71G.push*1.15);
  try{c.rb.collider(0).setCollisionGroups(CP24.prizeGroups);}catch(e){} // past the low side lip, as a coin tipping over the side does
  if(!cp71GPlain(c))CP71G.stats.special++;}
 CP71G.stats.runs++;CP71G.stats.pushed+=g.pushList.length;sfx.paw40&&sfx.paw40('swipe',.8);try{diagEvent('wild2','cp71 gutter push '+g.pushList.length);}catch(e){}};
cp71Knock=function(g){g.knocked=true;}; // nothing flies off behind the table any more
// the mitt: settles, pushes outward over the side in step with the coins, then lifts and returns to rest
cp71Mitt=function(g,side,t,T0,C,R){const k=t-T0.hit;
 if(!g.pushFrom||k<CP71G.settle)return C;
 const dx=C.x-g.pushFrom.x,dy=C.y-g.pushFrom.y,E={x:g.pushTo.x+dx,y:g.pushTo.y+dy,r:C.r+side*.15};
 const u=(k-CP71G.settle)/CP71G.push;if(u<1)return cp58Lerp(C,E,cp58Ease(u));
 const v=(k-CP71G.settle-CP71G.push)/.6;if(v>=1)return R;const F={x:E.x-side*6,y:E.y-50,r:E.r-side*.2};
 return v<.25?cp58Lerp(E,F,cp58Ease(v/.25)):cp58Lerp(F,R,cp58Ease((v-.25)/.75));};
// the coins move with the mitt: driven outward during the push until past the side, then the physics drops them in the gutter;
// one that somehow stays on the table gets its lip back
const __cp71GTick=w2YawnTick;
w2YawnTick=function(dt){const Y=W2_YAWN;__cp71GTick(dt);if(!Y||!Y.cp58)return;
 for(const g of Y.grabs){if(!g.pushing||!g.pushList)continue;const t=Y.t;if(t<g.pushT0)continue;
  const live=t<=g.knockAt+.15;
  for(const c of g.pushList){if(c.dead||!c.rb)continue;const p=c.rb.translation(),x=p.x/M,z=p.z/M,past=Math.abs(x-200)>tableHalfAt(z)+COIN_R*.5;
   if(past)continue;
   if(!live){if(!c.cp71Restored&&Math.abs(x-200)<tableHalfAt(z)-COIN_R){c.cp71Restored=1;try{c.rb.collider(0).setCollisionGroups(0xFFFFFFFF);}catch(e){}}continue;}
   if(c.rb.isSleeping&&c.rb.isSleeping())c.rb.wakeUp();const v=c.rb.linvel(),want=c.cp71Speed*M;
   if(v.x*c.cp71Side<want)c.rb.setLinvel({x:c.cp71Side*want,y:v.y,z:v.z*.5},true);}}};
// counts what reached the gutter (for the checks)
const __cp71GGutter=gutterOff;
gutterOff=function(b,x){if(b&&b.cp71Side&&!b.dead)CP71G.stats.gutter++;return __cp71GGutter.apply(this,arguments);};
// ---------- end CP-71 gutter push ----------
