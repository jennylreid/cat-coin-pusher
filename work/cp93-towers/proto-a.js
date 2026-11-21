// CP-93 tower rework, prototype A (not published; work/cp93-towers only): "heavy, grounded towers that spill like coins".
// Switches in CP93P so each part can be compared on its own. Main-board towers only, except quake/spill/idle (all towers).
const CP93P={heavy:1.5,grip:0.3,noTip:true,quakeTop:1.4,spillG:2.2,spillDamp:0.1,spillScatter:0.9,spillSecs:0.9,noIdle:true};
// heavy: a tower weighs what its coins weigh (today 0.6 vs coins 1.5, so a 7-coin tower weighs less than 3 coins)
// grip: tower base friction on the table (today the table's 0.035 wins, "Min" rule: towers sit on ice)
// noTip: no tip-over after being shoved a few units; it slides as a unit and spills only when it goes over the ledge or is knocked
// quakeTop: Quake also hits each tower near its top, so it rocks and falls (today Quake lifts the whole tower evenly)
// spill*: coins from a broken tower fall with 2.2x gravity and little air drag for 0.9 s, and fly apart a little
// noIdle: towers never get the "calm" honey damping (4) that every body gets 2 s after the last drop
{const __addStack=addStack;addStack=function(...a){const b=__addStack(...a);try{
  if(typeof cp93L==='function'&&cp93L())return b; // the giant board keeps its own rules
  const c=b.rb.collider(0);if(CP93P.heavy)c.setDensity(CP93P.heavy);
  if(CP93P.grip!=null){c.setFriction(CP93P.grip);c.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);}
  if(CP93P.noTip)b.limit=1e9;b.cp93p=true;}catch(e){}return b;};}
{const __breakStack=breakStack;breakStack=function(b){const n0=bodies.length;const r=__breakStack(b);try{
  if(CP93P.spillG){for(const c of bodies.slice(n0)){if(c.dead)continue;c.rb.setGravityScale(CP93P.spillG,true);c.rb.setLinearDamping(CP93P.spillDamp);
    const a=Math.random()*Math.PI*2,s=CP93P.spillScatter*(0.4+Math.random()*0.6),v=c.rb.linvel();c.rb.setLinvel({x:v.x+Math.cos(a)*s,y:v.y,z:v.z+Math.abs(Math.sin(a))*s},true);
    c.cp93pUntil=time+CP93P.spillSecs;}}}catch(e){}return r;};}
{const __stepCatquake=stepCatquake;stepCatquake=function(){const was=catquakeHit;__stepCatquake();try{
  if(CP93P.quakeTop&&!was&&catquakeHit){for(const b of [...bodies]){if(b.dead||b.kind!=='stack')continue;
    if(b.cp93!=null&&typeof cp93Let==='function'){const tw=(CP93.tw||[])[b.cp93];if(tw&&!tw.tipped)cp93Let(b.cp93,false,'quake');}
    const t=b.rb.translation(),top=qrot(b.rb.rotation(),{x:0,y:b.half*M,z:0}),k=b.rb.mass()*TOWER_TIP_PUSH*CP93P.quakeTop,sx=(Math.random()-.5)*1.2;
    b.tipping=true;b.rb.applyImpulseAtPoint({x:sx*k,y:0,z:k},{x:t.x+top.x,y:t.y+top.y,z:t.z+top.z},true);}}}catch(e){}};}
{const __step=step;step=function(){__step();try{
  for(const c of bodies){if(c.cp93pUntil&&!c.dead&&time>c.cp93pUntil){c.rb.setGravityScale(1,true);c.rb.setLinearDamping(calm?IDLE_DAMP:COIN_DAMP);c.cp93pUntil=0;}}
  if(CP93P.noIdle&&calm)for(const b of bodies)if(!b.dead&&b.kind==='stack'&&b.rb.linearDamping()>1){b.rb.setLinearDamping(0.15);b.rb.setAngularDamping(0.5);}}catch(e){}};}
