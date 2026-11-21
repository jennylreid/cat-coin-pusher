// CP-93 tower rework (Jenny, Nov 20: the towers "float like they're light", "slide one way and then the other... like they're in
// a wave pool", "once a tower of coins starts to spill, it spills and makes a ruckus"; "I need to see all of these in UAT...
// label it all clearly"). Developer choice "Tower physics" (Settings > Developer > Engineer tools, and at the bottom of Goal
// boards with Developer on), saved on the phone (catpusher.uat.cp93physics.v1). Default Today = no change at all.
//  A: heavy towers, fast spill (every tower: level boards and the giant towers board)
//     - a tower weighs twice what its coins weigh (today it weighs 0.4 of them: "light, so the coins shove it along") and
//       falls at 2x gravity, so it tips and drops fast instead of floating;
//     - its base grips the table (0.25; today the table's ice, 0.035, wins), so the coin pile's breathing can't slosh it;
//     - no tip-over after a small shove: it slides as one block until it goes over the ledge, or is knocked;
//     - Quake also knocks each tower near its top, so it rocks and falls (today Quake lifts it evenly and it slides);
//     - a broken tower's coins fall at 2.5x gravity with almost no air drag for 1.2 s and fly apart (a "ruckus");
//     - towers never get the "calm" honey drag that every piece gets 2 s after the last drop.
//  C: giant towers on the shelf (giant towers board only, from the next round): the towers stand on the coin pile in front
//     of the pusher deck instead of on it, so they never ride the deck back and forth; the deck shoves coins into the pile,
//     the pile pushes each whole tower to the ledge and it pours over the front (or Quake / a hard knock lets it go).
//  A + C: both.
// Live: A's parts switch at once on the board in play; C (and A's weight for the giant towers) from the next giant round.
// Coins, prizes, drops, the pusher and the frozen pickup are unchanged: only towers and the coins a tower breaks into.
const CP93P=(()=>{const KEY='catpusher.uat.cp93physics.v1',NAMES={today:'Today',a:'A: heavy towers, fast spill',c:'C: giant towers on the shelf',ac:'A + C'},
  SHORT={today:'Today',a:'A',c:'C',ac:'A + C'};let mode='today';try{const v=localStorage.getItem(KEY);if(v in NAMES)mode=v;}catch(e){}
 return {KEY,NAMES,SHORT,ORDER:['today','a','c','ac'],get:()=>mode,A:()=>mode==='a'||mode==='ac',C:()=>mode==='c'||mode==='ac',
  cfg:{heavy:3.0,g:2,grip:0.25,quake:3,spillG:2.5,spillDamp:0.05,spillScatter:1.0,spillSecs:1.2,
       shelf:[665,650,660],shelfGrip:0.08,deckGrip:0.6,ledge:22},
  set(k){if(!(k in NAMES))return;mode=k;try{localStorage.setItem(KEY,k);}catch(e){}try{diagEvent('cp93','tower physics '+k);}catch(_){}try{cp93pLive();}catch(_){}}};})();
const CP93P_ORIG=(LAB.B.giant&&LAB.B.giant.giant)?LAB.B.giant.giant.towers.map(t=>t.slice()):null;
// A on one level-board tower (on = true) or back to today's (on = false)
function cp93pTower(b,on){if(!b||b.dead||b.kind!=='stack'||b.cp93!=null)return;const c=b.rb.collider(0),C=CP93P.cfg;
 if(b.cp93pLimit==null)b.cp93pLimit=b.limit;
 if(on){c.setDensity(C.heavy);c.setFriction(C.grip);c.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);b.rb.setGravityScale(C.g,true);b.limit=1e9;}
 else{c.setDensity(0.6);c.setFriction(COIN_FRICTION);c.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Average);b.rb.setGravityScale(1,true);b.limit=b.cp93pLimit;}
 b.cp93pOn=on;}
function cp93pLive(){for(const b of bodies)if(!b.dead&&b.kind==='stack'&&b.cp93==null)cp93pTower(b,CP93P.A());}
{const __cp93pAdd=addStack;addStack=function(...a){const b=__cp93pAdd(...a);try{if(CP93P.A()&&!(typeof cp93L==='function'&&cp93L()))cp93pTower(b,true);}catch(e){}return b;};}
// the giant towers board: C moves the towers onto the shelf; A makes the segments heavy and fast-falling
{const __cp93pBuild=cp93Build;cp93Build=function(){const L=typeof cp93L==='function'&&cp93L();
  if(L&&CP93P_ORIG){CP93.shelf=CP93P.C();L.giant.towers=CP93P_ORIG.map((t,i)=>CP93.shelf?[t[0],CP93P.cfg.shelf[i],t[2],t[3]]:t.slice());
   if(CP93.shelf)for(const b of [...bodies]){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation();if(L.giant.towers.some(t=>Math.hypot(t[0]-p.x/M,t[1]-p.z/M)<COIN_R*2+6))removeCoin(b);}}
  const r=__cp93pBuild();
  try{if(L){const A=CP93P.A(),C=CP93P.cfg;CP93.heavy=A;
   for(const b of bodies){if(b.dead)continue;const mine=b.cp93Top!=null||(b.kind==='stack'&&b.cp93!=null);if(!mine)continue;
    if(CP93.shelf){const p=b.rb.translation();b.rb.setTranslation({x:p.x,y:p.y-TONGUE_H*M,z:p.z},true);}
    if(b.kind!=='stack')continue;const c=b.rb.collider(0);
    if(A){c.setDensity(C.heavy);b.rb.setGravityScale(C.g,true);if(!CP93.shelf&&b.cp93Seg===0)c.setFriction(C.deckGrip);}
    if(CP93.shelf&&b.cp93Seg===0){c.setFriction(C.shelfGrip);c.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);}}}}catch(e){}return r;};}
// C: a tower on the shelf is held together until its base reaches the ledge (or it leans, or is knocked hard), then goes over
{const __cp93pSlide=cp93Slide;cp93Slide=function(d){if(!CP93.shelf)return __cp93pSlide(d);if(!CP93.tw)return;
 for(let gi=0;gi<CP93.tw.length;gi++){const T9=CP93.tw[gi];if(T9.tipped)continue;
  const segs=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93===gi);const base=segs.find(b=>b.cp93Seg===0);if(!base||segs.length<2){cp93Let(gi,false,'gone');continue;}
  const t=base.rb.translation(),z=t.z/M,bv=base.rb.linvel();T9.slide=z-(T9.z0??(T9.z0=z));
  if(z>T.FRONT-CP93P.cfg.ledge||qrot(base.rb.rotation(),{x:0,y:1,z:0}).y<Math.cos(6*Math.PI/180)){cp93Let(gi,true,'edge');continue;}
  let hit=false;for(const b of segs){if(b===base)continue;const v=b.rb.linvel();if(Math.hypot(v.x-bv.x,v.z-bv.z)>CP93.cfg.knock*1.6){hit=true;break;}}
  if(hit&&time>(CP93.t0b||0)+2){cp93Let(gi,false,'knock');continue;}
  const settled=true;const prize=bodies.find(b=>!b.dead&&b.cp93Top===gi); // on the shelf the hold starts at once: no loose settle
  for(const b of prize?[...segs,prize]:segs){if(b===base)continue;
   if(settled&&!b.cp93Off){const p=b.rb.translation();b.cp93Off={x:p.x-t.x,y:p.y-t.y,z:p.z-t.z};b.cp93Rot={...b.rb.rotation()};}
   if(b.cp93Off){b.rb.setTranslation({x:t.x+b.cp93Off.x,y:t.y+b.cp93Off.y,z:t.z+b.cp93Off.z},true);b.rb.setRotation(b.cp93Rot,true);}
   b.rb.setLinvel({x:bv.x,y:b.cp93Off?bv.y:Math.min(b.rb.linvel().y,bv.y),z:bv.z},true);b.rb.setAngvel({x:0,y:0,z:0},true);}}};}
// A or C on the giant board: while a tower is held together, its upper segments don't touch its base or each other (they are
// placed on it every step anyway), so the hold can't push its own base along; they still meet coins, walls and the prize.
// Normal contacts come back the moment the tower is let go. (Today's hold leans on a grippy base to hide this; on the shelf
// with a slippery base a held tower walked forward by itself.)
const CP93P_BASE=((0x0004<<16)|0xFFFD)>>>0,CP93P_UP=((0x0002<<16)|0xFFF9)>>>0,CP93P_ALL=0xFFFFFFFF;
function cp93pGroups(gi,on){for(const b of bodies){if(b.dead||b.kind!=='stack'||b.cp93!==gi)continue;b.rb.collider(0).setCollisionGroups(on?(b.cp93Seg===0?CP93P_BASE:CP93P_UP):CP93P_ALL);}}
{const __cp93pLet=cp93Let;cp93Let=function(gi,turn,why){try{if(CP93.grouped&&CP93.grouped[gi]){CP93.grouped[gi]=false;cp93pGroups(gi,false);}}catch(e){}return __cp93pLet(gi,turn,why);};}
{const __cp93pStep2=step;step=function(){const r=__cp93pStep2();try{if(typeof cp93L==='function'&&cp93L()&&CP93.tw&&(CP93.heavy||CP93.shelf)&&(CP93.shelf||time>(CP93.t0b||0)+.5)){
  if(!CP93.grouped)CP93.grouped=[];for(let gi=0;gi<CP93.tw.length;gi++)if(!CP93.tw[gi].tipped&&CP93.grouped[gi]==null){CP93.grouped[gi]=true;cp93pGroups(gi,true);}}}catch(e){}return r;};}
{const __cp93pBuild2=cp93Build;cp93Build=function(){CP93.grouped=null;return __cp93pBuild2();};}
// A: a broken tower's coins drop fast and fly apart
{const __cp93pBreak=breakStack;breakStack=function(b){const n0=bodies.length,on=CP93P.A()&&b&&!b.dead;const r=__cp93pBreak(b);try{
  if(on){const C=CP93P.cfg;for(const c of bodies.slice(n0)){if(c.dead||c.kind==='stack')continue;c.rb.setGravityScale(C.spillG,true);c.rb.setLinearDamping(C.spillDamp);
    const a=Math.random()*Math.PI*2,s=C.spillScatter*(0.4+Math.random()*0.6),v=c.rb.linvel();c.rb.setLinvel({x:v.x+Math.cos(a)*s,y:v.y,z:v.z+Math.abs(Math.sin(a))*s},true);
    c.cp93pUntil=time+C.spillSecs;}}}catch(e){}return r;};}
// A: Quake also knocks each tower near its top
{const __cp93pQuake=stepCatquake;stepCatquake=function(){const was=catquakeHit;__cp93pQuake();try{
  if(CP93P.A()&&!was&&catquakeHit){for(const b of [...bodies]){if(b.dead||b.kind!=='stack')continue;
    if(b.cp93!=null&&CP93.tw){const tw=CP93.tw[b.cp93];if(tw&&!tw.tipped)cp93Let(b.cp93,false,'quake');}
    const t=b.rb.translation(),top=qrot(b.rb.rotation(),{x:0,y:b.half*M,z:0}),k=b.rb.mass()*TOWER_TIP_PUSH*CP93P.cfg.quake,sx=(Math.random()-.5)*1.2;
    b.tipping=true;b.rb.applyImpulseAtPoint({x:sx*k,y:0,z:k},{x:t.x+top.x,y:t.y+top.y,z:t.z+top.z},true);}}}catch(e){}};}
// A: spill coins back to normal after 1.2 s; towers never get the calm honey drag
{const __cp93pStep=step;step=function(){const r=__cp93pStep();try{
  for(const c of bodies){if(c.cp93pUntil&&!c.dead&&time>c.cp93pUntil){c.rb.setGravityScale(1,true);c.rb.setLinearDamping(calm?IDLE_DAMP:COIN_DAMP);c.cp93pUntil=0;}}
  if(CP93P.A()&&calm)for(const b of bodies)if(!b.dead&&b.kind==='stack'&&b.rb.linearDamping()>1){b.rb.setLinearDamping(0.15);b.rb.setAngularDamping(0.5);}}catch(e){}return r;};}
// a clear label on the board while a choice other than Today is on
{const __cp93pHud=drawBoardHUD;drawBoardHUD=function(){const r=__cp93pHud.apply(this,arguments);try{if(CP93P.get()!=='today'){
  const hud=hudLayout(),tx='Tower physics: '+CP93P.NAMES[CP93P.get()];ctx.save();ctx.font='bold 11px system-ui';ctx.textAlign='left';const w=ctx.measureText(tx).width+12;
  ctx.fillStyle='rgba(120,40,0,.92)';ctx.fillRect(hud.left+2,hud.bottomY-47,w,16);ctx.fillStyle='#ffe08a';ctx.fillText(tx,hud.left+8,hud.bottomY-35);ctx.restore();}}catch(e){}return r;};}
// the choice in Engineer tools (under Timing strip) and at the bottom of Goal boards
function cp93pButtons(on){return CP93P.ORDER.map(k=>'<button data-tp="'+k+'" class="'+(CP93P.get()===k?'on':'')+'">'+(on&&CP93P.get()===k?'✓ ':'')+CP93P.NAMES[k]+'</button>').join('');}
{const __cp93pCredits=openCredits;openCredits=function(){const r=__cp93pCredits.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp93-physics'))return r;
  const box=document.createElement('div');box.id='cp93-physics';const hd=document.createElement('h3');hd.textContent='Tower physics';box.appendChild(hd);
  const note=document.createElement('div');note.style.cssText='font-size:12px;opacity:.8;margin:2px 0 4px';note.textContent='Level boards and Giant towers. Giant towers: from the next round.';box.appendChild(note);
  const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.tp===CP93P.get();b.textContent=(on?'✓ ':'')+CP93P.NAMES[b.dataset.tp];b.style.fontWeight=on?'700':'400';});
  for(const k of CP93P.ORDER){const b=document.createElement('button');b.dataset.tp=k;b.style.margin='0 6px 6px 0';b.onclick=()=>{CP93P.set(k);paint();};btns.push(b);box.appendChild(b);}
  paint();const ts=eng.querySelector('#cp83-timing')||eng.querySelector('#cp83-tower');if(ts&&ts.parentNode)ts.parentNode.insertBefore(box,ts.nextSibling);else eng.appendChild(box);}catch(e){}return r;};}
if(typeof cp100Paint==='function'){const __cp93pPaint=cp100Paint;cp100Paint=function(){__cp93pPaint();try{const B=CP100.body;if(!B||CP100.mode!=='goals'||!S.dev)return;
  const d=document.createElement('div');d.className='sw';d.innerHTML='<span>Tower physics</span>'+cp93pButtons(false);B.appendChild(d);}catch(e){}};
 const __cp93pBuildList=cp100Build;cp100Build=function(){const had=!!CP100.list;const el=__cp93pBuildList();if(!had&&el)el.addEventListener('click',e=>{const b=e.target.closest('button');
   if(b&&b.dataset.tp){CP93P.set(b.dataset.tp);cp100Paint();}});return el;};}
