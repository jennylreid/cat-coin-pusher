// ---------- CP-71 (Jenny, Nov 17; UAT 90): the Yawn never eats coins ----------
// With food in reach nothing changes (grab, eat; milk drunk and its bottle tossed). With no food in reach the mitt comes
// down onto the top coins as before (same pick: up to 4 lying on top where most lie together, re-checked), rummages for a
// moment, then flicks them back over the rear edge of the table: they arc back with a spin, drop behind the table with
// the game's real coin sounds, and are gone. No carry to the mouth, no chewing, no eating face; the Yawn ends early.
// Never the bottom layer (only coins still lying on top when the mitt flicks), so no gap.
const CP71={rummage:.32,flyMin:.55,flyMax:.75,after:1.25,stats:{rummages:0,knocked:0,eaten:0}};
function cp71Top(c){return !c.dead&&c.rb.translation().y/M-cp61Half(c)>=COIN_HALF*1.5;}
// at the mitt's hit (coins): rummage, then knock at g.knockAt
function cp71Rummage(g){const Y=W2_YAWN;g.rummage=true;g.knockAt=Y.t+CP71.rummage;Y.knockEnd=g.knockAt+CP71.after;CP71.stats.rummages++;
 sfx.paw40&&sfx.paw40('swipe',.7);try{diagEvent('wild2','cp71 rummage');}catch(e){}}
function cp71Knock(g){const Y=W2_YAWN;g.knocked=true;const L=[g.b,...(g.coins||[]).filter(c=>c!==g.b)].filter(cp71Top);
 Y.flyers=Y.flyers||[];
 L.forEach((c,i)=>{const p=c.rb.translation(),x=p.x/M,z=p.z/M,h=p.y/M;
  Y.flyers.push({kind:c.kind,x0:x,z0:z,h0:h,x1:x+rand(-30,30),z1:T.BACK-rand(20,55),dur:rand(CP71.flyMin,CP71.flyMax),t:-i*.06,peak:rand(70,110),
   spin:rand(9,14)*(Math.random()<.5?-1:1),played:0});removeCoin(c);});
 CP71.stats.knocked+=L.length;if(L.length)sfx.paw40&&sfx.paw40('whoosh',.8);try{diagEvent('wild2','cp71 knocked '+L.length+' coins behind the table');}catch(e){}}
// the mitt for a coin grab after its hit: a quick rummage on the spot, then a flick up and back to rest
function cp71Mitt(g,side,t,T0,C,R){const k=t-T0.hit;
 if(k<CP71.rummage)return {x:C.x+side*9*Math.sin(k*30),y:C.y+3*Math.sin(k*44),r:C.r+.1*Math.sin(k*30)};
 const u=(k-CP71.rummage)/.55;if(u>=1)return R;const F={x:C.x-side*6,y:C.y-60,r:C.r-side*.3};
 return u<.3?cp58Lerp(C,F,cp58Ease(u/.3)):cp58Lerp(F,R,cp58Ease((u-.3)/.7));}
function cp71At(f){const u=Math.max(0,Math.min(1,f.t/f.dur));
 return {u,x:f.x0+(f.x1-f.x0)*u,z:f.z0+(f.z1-f.z0)*u,h:f.h0+(-50-f.h0)*u+f.peak*4*u*(1-u)};}
const __cp71Tick=w2YawnTick;
w2YawnTick=function(dt){const Y=W2_YAWN;__cp71Tick(dt);if(!Y||!Y.cp58)return;
 for(const g of Y.grabs)if(g.rummage&&!g.knocked&&Y.t>=g.knockAt)cp71Knock(g);
 if(Y.flyers)for(const f of Y.flyers){f.t+=dt;
  if(f.t>=0&&!f.played){f.played=1;try{pgSfx('coin',.8);}catch(e){}}
  if(f.t>=f.dur&&f.played===1){f.played=2;try{pgSfx('coin',.3);}catch(e){}}}};
// drawn over the board like the held prizes; hidden once it drops below the table's rear edge (behind the table)
const __cp71Text=yawnText;
yawnText=function(){__cp71Text();const Y=W2_YAWN;if(!Y||!Y.cp58||!Y.flyers)return;
 for(const f of Y.flyers){if(f.t<0||f.t>=f.dur)continue;const a=cp71At(f);if(a.z<T.BACK&&a.h<0)continue;
  const e=skyScreen(a.x,a.z,Math.max(a.h,-50)),sp=sprite(f.kind==='silver'?'coin':f.kind),r=sp.half*e.s,ang=f.t*f.spin;
  ctx.save();ctx.translate(e.x,e.y);ctx.rotate(ang*.3);ctx.scale(1,.25+.75*Math.abs(Math.cos(ang)));ctx.drawImage(sp.cv,-r,-r,2*r,2*r);ctx.restore();}};
// ---------- end CP-71 ----------
