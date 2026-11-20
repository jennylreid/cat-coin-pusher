// ---------- CP-92 rework: the NEW BOARD sweep is the pusher itself (Jenny, Nov 19 on UAT 119: "nothing gets cleared by it, and it
// doesn't move the entire length of the board either"; her Nov 18 idea: "have the pusher push all the way to the end of the
// board, clearing the entire thing and then resetting the board in front of the player's eyes with a new setup") ----------
// Replaces UAT 119's drawn bar. The real pusher (approved art, its own size, drawn as always) travels the whole board, from
// where it is to past the front edge, shoving every coin, tower and prize over; they fall as coins always fall (the
// front-fall drop), and nothing is paid (no wallet, no pantry, no pickup). It holds at the edge a moment; anything left in
// the side strips beside it (the pusher is narrower than the front of the table) slides off the same way. Then it goes back
// and the next layout is set up in front of the player. Drops are blocked throughout, as before. No fades.
const END_SW2={out:2.1,hold:.8,back:.9,tail:.6,edge:T.FRONT+34}; // about 4.4 s in all (PM, Nov 19: tail about 0.6 s)
END.SWEEP.cross=-1;END.SWEEP.hold=0; // UAT 119's bar: never drawn again (its alpha is 0)
function endSw2Ease(u){u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);}
endStartSweep=function(){stopDrops();holding=false;taps=[];pendingDrops=[];END.sweep={t:0,v2:true,z0:pusherY,z:pusherY,left:null};WILD.incoming=[];WILD.rainLeft=0;WILD.rains=[]; /* nothing falls in from the sky during the sweep */END.stats.resets++;
 try{sfx.wild('turbo',1);}catch(e){}try{diagEvent('cp92','sweep2 '+endKey());}catch(e){}};
// the pusher's reach while the sweep runs: its stroke is held at full and its reach set so the front face is at the sweep's depth
{const __sw2Reach=pglReach;pglReach=function(){const S0=END.sweep;if(S0&&S0.v2&&endActive())return (S0.z-PUSH_MIN)/(PUSH_MAX-PUSH_MIN);return __sw2Reach.apply(this,arguments);};}
// a steady shove forward: what rode on the pusher's deck, slid off its back, or sat in the side strips its sides didn't reach
function endSw2Shove(sp=330){for(const b of bodies){if(b.dead)continue;try{const v=b.rb.linvel();b.rb.wakeUp&&b.rb.wakeUp();b.rb.setLinvel({x:v.x*.9,y:Math.min(v.y,.5*M),z:Math.max(v.z,sp*M)},true);}catch(e){}}}
// out: the pusher travels to past the front edge; hold: it stays there while the rest slides off; back: it goes home while
// the shove goes on (pieces that were behind it follow the others off); tail: a moment more; then the next layout is built
endSweepTick=function(dt){const S0=END.sweep;if(!S0||!S0.v2)return;S0.t+=dt;WILD.nextBonus=Math.max(WILD.nextBonus,3);const A=END_SW2,t=S0.t,t1=A.out,t2=t1+A.hold,t3=t2+A.back,t4=t3+A.tail;
 if(t<t1)S0.z=S0.z0+(A.edge-S0.z0)*endSw2Ease(t/t1);
 else if(t<t2){S0.z=A.edge;endSw2Shove();}
 else if(t<t3){S0.z=PUSH_MIN+(A.edge-PUSH_MIN)*(1-endSw2Ease((t-t2)/A.back));endSw2Shove(560);}
 else if(t<t4){S0.z=PUSH_MIN;endSw2Shove(560);}
 else{S0.left=bodies.filter(b=>!b.dead).length;END.stats.sweepLeft=(END.stats.sweepLeft|0)+S0.left;for(const b of [...bodies])if(!b.dead)removeCoin(b); // anything still on the table (rare)
  END.sweep=null;pushPhase=0;endNewBoard(endPickNext());return;}
 pushPhase=.57*PUSH_PERIOD;}; // the stroke held at full: the reach does the moving
// swept pieces fall like coins always fall, and pay nothing
{const __sw2Fall=fallOff;fallOff=function(b,x){if(endActive()&&END.sweep&&END.sweep.v2&&b&&!b.dead){
  const z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2;
  if(side&&z<T.FRONT-4){if(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')return gutterOff(b,x);removeCoin(b);return;} // a prize off a side: no "LOST THE ..." callout (the board is being cleared)
  if(['coin','silver','gold5','item','quake'].includes(b.kind)||RAIN[b.kind]){const p=proj(x,T.FRONT);falling.push({x:p.x,y:p.y+4,vx:0,vy:60,kind:b.kind,id:b.id,won:false,t:0,s:p.s});}
  removeCoin(b);return;}
 return __sw2Fall.apply(this,arguments);};}
// ---------- end CP-92 rework ----------
