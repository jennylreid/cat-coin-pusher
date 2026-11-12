// CP-37: keep coins out from under the cat's face. The backstop above the pusher (LEDGE_BACK) is a tall solid wall, so
// coins scraped back by the pusher used to stack straight up it (5-7 high); everything above two high is drawn up
// under the chin and face, which is painted over the board. After each physics step, a coin (or prize, rain or note
// coin) whose drawn centre has climbed above the chin line is slid forward off the pile, so it stays in sight.
// Coins still falling in from a tap and tower bodies are left alone, and so is the win dance; nothing else in the
// physics changes.
const CP37_BACK_ZONE=LEDGE_BACK+160,CP37_CHIN_CLEAR=CHIN_Y+6,CP37_SLIDE=90; // depth checked; lowest allowed centre (screen); slide speed (units/s)
const __cp37Step=step;
step=function(){__cp37Step();
 if(inventoryOpen||danceWorld||board.status==='won'||board.status==='lost')return; // not while paused, or in the win dance's own copy of the coins
 for(const b of bodies){
  if(b.dead||b.kind==='stack'||b.danceDown||(b.input&&b.fresh))continue;
  const t=b.rb.translation(),z=t.z/M;if(z>CP37_BACK_ZONE)continue;
  if(screenOf(t.x/M,z,t.y/M).y>=CP37_CHIN_CLEAR)continue;
  const v=b.rb.linvel(),want=CP37_SLIDE*M;
  if(v.z<want){b.rb.setLinvel({x:v.x,y:v.y,z:want},true);}
 }
};
