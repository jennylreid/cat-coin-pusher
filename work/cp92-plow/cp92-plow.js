// ---------- CP-92 rework 2: the NEW BOARD sweep is a plow (Jenny, Nov 19 on UAT 123: "it needs to actually push everything in front
// of it like a shovel. It's going up, it's getting up underneath the coins, and then it's like pushing them off like a slide...
// consider it like a snow plow... shoveling or snow plowing all the coins off the board.") ----------
// Replaces UAT 123's sweep timing (cp92-sweep2.js stays for the pusher's reach and the no-pay falls). The pusher first pulls
// all the way back (its back wall scrapes off anything riding on its deck, as on every stroke), then a blade rises at its
// front face and the two travel the whole board together, blade first, out past the front edge: everything is shoved ahead of
// the blade and over the edge, nothing climbs onto the deck. The blade is as wide as the board wherever it is (side wings
// slide out from behind it as the board widens), as tall as a tall tower, drawn in code in the pusher's wood and gold (the
// pusher art itself is unchanged). Then both go home and the next layout is set up. Nothing is paid; no fades.
const END_PLOW={pre:.35,out:2.4,hold:.35,back:.85,tail:.25,BH:64,THK:8,WW:62,edge:T.FRONT+COIN_R*2+6,bodies:null};
function endPlowFront(){return (END.sweep&&END.sweep.z!=null?END.sweep.z:pusherY)+END_PLOW.THK;}
function endPlowParts(zf){const half=Math.max(PUSH_HALF,tableHalfAt(Math.min(T.FRONT,zf))),wx=Math.max(PUSH_HALF-END_PLOW.WW,half-END_PLOW.WW);return {half,parts:[[200,PUSH_HALF],[200-wx,END_PLOW.WW],[200+wx,END_PLOW.WW]]};}
function endPlowMake(){endPlowFree();const P=endPlowParts(endPlowFront()),zc=endPlowFront()-END_PLOW.THK/2;END_PLOW.bodies=[];
 for(const [x,hw] of P.parts){const rb=world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(x*M,END_PLOW.BH/2*M,zc*M));
  world.createCollider(RAPIER.ColliderDesc.cuboid(hw*M,END_PLOW.BH/2*M,END_PLOW.THK/2*M).setFriction(.2),rb);END_PLOW.bodies.push(rb);}}
function endPlowMove(){if(!END_PLOW.bodies)return;const zf=endPlowFront(),P=endPlowParts(zf),zc=zf-END_PLOW.THK/2;
 P.parts.forEach(([x],i)=>{try{END_PLOW.bodies[i].setNextKinematicTranslation({x:x*M,y:END_PLOW.BH/2*M,z:zc*M});}catch(e){}});}
function endPlowFree(){if(END_PLOW.bodies){for(const rb of END_PLOW.bodies)try{world.removeRigidBody(rb);}catch(e){}}END_PLOW.bodies=null;}
endStartSweep=function(){stopDrops();holding=false;taps=[];pendingDrops=[];WILD.incoming=[];WILD.rainLeft=0;WILD.rains=[];
 END.sweep={t:0,v2:true,plow:true,z0:pusherY,z:pusherY,left:null,made:false};END.stats.resets++;
 try{sfx.wild('turbo',1);}catch(e){}try{diagEvent('cp92','plow '+endKey());}catch(e){}};
endSweepTick=function(dt){const S0=END.sweep;if(!S0||!S0.v2)return;S0.t+=dt;WILD.nextBonus=Math.max(WILD.nextBonus,3);
 const A=END_PLOW,t=S0.t,t0=A.pre,t1=t0+A.out,t2=t1+A.hold,t3=t2+A.back,t4=t3+A.tail,E=(u)=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
 if(t<t0)S0.z=S0.z0+(PUSH_MIN-S0.z0)*E(t/t0); // pull back: the deck is scraped clean
 else if(t<t1){if(!S0.made){S0.made=true;endPlowMake();}S0.z=PUSH_MIN+(A.edge-PUSH_MIN)*E((t-t0)/A.out);}
 else if(t<t2)S0.z=A.edge;
 else if(t<t3)S0.z=PUSH_MIN+(A.edge-PUSH_MIN)*(1-E((t-t2)/A.back));
 else if(t<t4)S0.z=PUSH_MIN;
 else{endPlowFree();S0.left=bodies.filter(b=>!b.dead).length;END.stats.sweepLeft=(END.stats.sweepLeft|0)+S0.left;for(const b of [...bodies])if(!b.dead)removeCoin(b);
  END.sweep=null;pushPhase=0;endNewBoard(endPickNext());return;}
 endPlowMove();pushPhase=.57*PUSH_PERIOD;};
// leaving mid-sweep (Home): the blade goes with it
{const __plowStop=endStop;endStop=function(){endPlowFree();return __plowStop.apply(this,arguments);};}
{const __plowReset=wildReset;wildReset=function(){if(END_PLOW.bodies&&!(END.sweep&&END.sweep.plow))endPlowFree();return __plowReset.apply(this,arguments);};}
// the blade: drawn right after the pusher in the pusher's wood with a gold top edge; it rises as it starts and drops as it ends
function endPlowDraw(){const S0=END.sweep;if(!S0||!S0.plow||!END_PLOW.bodies)return;const A=END_PLOW,t=S0.t-A.pre,tE=A.out+A.hold+A.back;
 const up=Math.min(1,t/.25,(tE-t)/.25);if(up<=0)return;const zf=Math.min(endPlowFront(),T.FRONT+40),P=endPlowParts(zf),h=A.BH*up,L=200-P.half,R=200+P.half;
 const a=screenOf(L,zf,0),b=screenOf(R,zf,0),c=screenOf(R,zf,h),d=screenOf(L,zf,h),ct=screenOf(R,zf-A.THK,h),dt=screenOf(L,zf-A.THK,h);
 ctx.save();ctx.lineJoin='round'; // drawn in the board's own pass (the pusher's transform), under the coins in front of it
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(b.x,b.y+8*b.s);ctx.lineTo(a.x,a.y+8*a.s);ctx.closePath();ctx.fill(); // shadow on the table
 ctx.fillStyle='#8a5a2a';ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.lineTo(ct.x,ct.y);ctx.lineTo(dt.x,dt.y);ctx.closePath();ctx.fill(); // top edge
 const g=ctx.createLinearGradient(0,d.y,0,a.y);g.addColorStop(0,'#e8bd72');g.addColorStop(1,'#a8743a');ctx.fillStyle=g;
 ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#5a3812';ctx.lineWidth=1.6;ctx.stroke();
 ctx.strokeStyle='#ffe08a';ctx.lineWidth=3*b.s;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(c.x,c.y);ctx.stroke(); // gold rim
 ctx.strokeStyle='rgba(90,56,18,.45)';ctx.lineWidth=1.2;for(const f of [.33,.66]){const p=screenOf(L,zf,h*f),q=screenOf(R,zf,h*f);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();} // planks
 ctx.restore();}
{const __plowTongue=drawTongue;drawTongue=function(){const r=__plowTongue.apply(this,arguments);try{endPlowDraw();}catch(e){}return r;};}
// ---------- end CP-92 rework 2 ----------
