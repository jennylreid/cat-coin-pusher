// ---- UAT 130 (Jenny's phone tests on UAT 129, Pixel; PM, Nov 20) ----
// 2. Cat chip on the Ragdoll's endless board. Cause: the Ragdoll's PET (heart) coin follows the levels' rule there: it comes as
//    the 1st or 2nd bonus drop and lands mid-board (depth 430-620), so ordinary play takes minutes to push it off, and while a
//    side-game coin is on the board the chip is locked (padlock, faded). On the endless board it now lands in the front part
//    (depth 600-680), like the other side-game coins (CP-92), so it goes over soon. And all five cats are in the switch row
//    on the endless board (Jenny: all five available), whether or not a cat is open yet; that doesn't open the cat anywhere else.
{const __u130Bonus=wildScheduleBonus;wildScheduleBonus=function(){const n0=WILD.incoming.length;const r=__u130Bonus.apply(this,arguments);
 try{if(typeof endActive==='function'&&endActive())for(let i=n0;i<WILD.incoming.length;i++){const o=WILD.incoming[i];if(o&&o.kind==='heart'){const y=rand(600,680);o.y=y;o.x=200+rand(-1,1)*(tableHalfAt(y)-70);}}}catch(e){}return r;};}
cp97Cats=function(){return (typeof endActive==='function'&&endActive())?PG_CATS.slice():PG_CATS.filter(c=>PG.open[c]);};
{const __u130Switch=cp97Switch;cp97Switch=function(cat){if(!(typeof endActive==='function'&&endActive())||!PG||PG.open[cat])return __u130Switch.apply(this,arguments);
 const was=PG.open[cat];PG.open[cat]=true;try{return __u130Switch.apply(this,arguments);}finally{PG.open[cat]=was;try{pgSave();}catch(e){}}};} // the switch saved with the cat open; save again without it
// 3. Treat toss meter beneath the board on every phone. CP-99 put it there only with 30 px of room under the board; most
//    phones have about 14 (Pixel-size 412x869: 14; 360x640: none), so it went back above the cat's head. Now, with too little
//    room it sits just below the board's front edge, a little smaller, over the bottom bar's top.
{const __u130Y=cp99MeterY,__u130K=cp99MeterK;
 cp99MeterY=function(){const g=cp99Gap();if(g.room>=30)return __u130Y();const k=.85,f=skyScreen(200,T.FRONT,0).y;return Math.min(f+2+20*k,H-6-20*k);};
 cp99MeterK=function(){const g=cp99Gap();if(g.room>=30)return __u130K();return .85;};}
// 4. No red rail flash when a prize is lost off a side (Jenny: it looks like a bug). The prize still tumbles over the edge,
//    its icon shakes, and "LOST THE ...!" and the sound stay. Not part of the frozen pickup (that is the front-edge pop).
w43LostDraw=function(){for(const L of W43_LOST){const ex=L.side<0?T.L:T.R;
  const u=Math.min(1,L.t/1.1),e=skyScreen(ex,L.z,0),x=e.x+L.side*(18+60*u),y=e.y+260*u*u-24*Math.sin(u*Math.PI),s=e.s*(1-.35*u);
  ctx.save();ctx.globalAlpha=1-u*u;ctx.translate(x,y);ctx.rotate(L.side*u*5);drawPrize('item',L.id,0,0,s);ctx.restore();
  if(L.star){ctx.save();ctx.globalAlpha=1-u;w43Star(x,y-30*s,14,'#ffd23f');ctx.restore();}}};
// 5. Pet the cat's purr meter reaches its peak sooner: 2.5 s of stroking instead of 3.5 (the default; build edit). A phone
//    still on the old default 3.5 moves to 2.5; a value tuned in Developer stays.
try{if(PET.peak===3.5){PET.peak=2.5;}}catch(e){}
// ---- end UAT 130 ----
