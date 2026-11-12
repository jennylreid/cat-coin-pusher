// CP-24: prizes tip off the sides. The low side lip (CP-21) stays for coins but prizes pass through it, so a prize
// whose centre of mass is past the side edge tips and falls. Dials: lip distance/height for coin spill, and a gentle
// outward slide for prizes riding on coins near a side edge.
const CP24={lipOut:0.9,lipH:4,tipAssist:.4,pileSlide:0,pileZone:ITEM_R,prizeGroups:0x0001FFFF,lipGroups:0xFFFFFFFE};
const __cp24AddCoin=addCoin;
addCoin=function(kind,id,x,h,y,rot,linvel,angvel){const b=__cp24AddCoin(kind,id,x,h,y,rot,linvel,angvel);
 if(kind==='item')b.rb.collider(0).setCollisionGroups(CP24.prizeGroups);return b;};
const __cp24Step=step;
// A prize whose centre is past an open side edge never rests there: it stays awake and gets a gentle outward push
// (tipAssist, m/s) until it falls (balanced on an overhanging coin it would otherwise go to sleep). Near a side edge
// on a coin pile, pileSlide (m/s) eases it outward a little.
step=function(){__cp24Step();if(inventoryOpen)return;
 const edge=(T.R-T.L)/2,held=typeof PAW40_STATE==='object'&&PAW40_STATE.teeter?PAW40_STATE.teeter.b:null;
 for(const b of bodies){if(b.dead||b.kind!=='item'||b===held||b.paw40Done)continue;
  const t=b.rb.translation(),x=t.x/M-200,z=t.z/M,h=t.y/M;if(z<GUARD_END||z>T.FRONT-4||h<-25)continue;
  const s=Math.sign(x),v=b.rb.linvel(),out=v.x*s;
  if(Math.abs(x)>edge){if(b.rb.isSleeping())b.rb.wakeUp();if(out<CP24.tipAssist)b.rb.applyImpulse({x:s*b.rb.mass()*(CP24.tipAssist-out)*.25,y:0,z:0},true);continue;}
  if(!CP24.pileSlide||b.rb.isSleeping()||Math.abs(x)<edge-CP24.pileZone||h<b.half+3)continue;
  if(out<CP24.pileSlide)b.rb.applyImpulse({x:s*b.rb.mass()*(CP24.pileSlide-out)*.08,y:0,z:0},true);}
};
// Rapier's own collision groups rule (also used by solidCoinContacts' fixed-obstacle pass, which tests shapes directly).
function __cp24Interact(a,b){const ga=a.collisionGroups(),gb=b.collisionGroups();return ((ga>>>16)&(gb&0xFFFF))!==0&&((gb>>>16)&(ga&0xFFFF))!==0;}
