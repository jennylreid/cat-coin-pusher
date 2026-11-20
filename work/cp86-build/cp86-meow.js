// ---------- CP-86 Sonic meow face (Jenny, Nov 18: "for the Siamese cat, we can use the yawn face with Sonic Meow, don't
// you think?"; go: "the Siamese shows its open-mouth yawn face during the meow") ----------
// During Sonic meow's action (after the CP-82 title), the Siamese shows its own open-mouth yawn face, the CP-75 Siamese
// copy of the approved yawn face (CP75_ART.siamese.face), drawn the way the wheel's Yawn draws it: over the normal face on
// the head's own canvas: switched in on the meow's first frame and held while the meows and the sound rings play; switched
// back in one frame near the end (see CP86.tail). Then the normal face. Existing art only; the rings, shake, sounds, reach and timing unchanged.
// No fades (Jenny, Nov 18: "Fades don't work, y'all."): the face switches in on the meow's first frame and back to the normal
// face in one frame 0.1 s before the meow ends (CP86.tail); the movement settles to rest over the 0.25 s before that switch.
const CP86={tail:.1,settle:.25};
function cp86End(X){return X.dur-CP86.tail;}
function cp86K(){const X=PGPX;if(!X||X.id!=='sonic'||CP75_CAT!=='siamese')return 0;const A=CP75_ART.siamese;if(!A||!A.face)return 0;
 return X.t<cp86End(X)?1:0;}
// Eyes (Jenny, Nov 18: "I want it to start with the eyes closed and then the eyes will open before the sonic meow ends."):
// the meow starts with the yawn face's own squint; on the last meow (3.75 s into the action) the eyes switch straight to
// open (no fade, Jenny Nov 18) and stay open until the face switches back. Open eyes = the cat's own eyes from its normal head painting (the current head art,
// clipped to the two eye areas) laid over the squint, then its normal tracking pupils. No new painting.
CP86.openAt=3.75;CP86.eyeArea=[[480,525],[1056,525]];CP86.eyeR=[205,170];
function cp86Open(){const X=PGPX;return X&&X.id==='sonic'&&X.t>=CP86.openAt?1:0;} // straight from closed to open (Jenny: no fade)
function cp86HeadArt(){const f=powerFace();return f==='wild'?ART.headWild:f==='sweet'||f==='happy'?ART.headSweet:ART.head;}
const __cp86Pupils=drawTrackingPupils;
drawTrackingPupils=function(){const k=cp86K();if(k<=0)return __cp86Pupils();
 const a0=ctx.globalAlpha;if(k<1)__cp86Pupils();ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);ctx.globalAlpha*=k;ctx.drawImage(CP75_ART.siamese.face,0,0);
 const e=cp86Open();if(e>0){const h=cp86HeadArt();if(h){ctx.save();ctx.globalAlpha=a0*e; /* full strength, not faded with the face: they are the normal face's own eyes, so they stay solid while the face leaves */ctx.beginPath();for(const [x,y] of CP86.eyeArea){ctx.moveTo(x+CP86.eyeR[0],y);ctx.ellipse(x,y,CP86.eyeR[0],CP86.eyeR[1],0,0,7);}ctx.clip();ctx.drawImage(h,0,0,1536,1024);ctx.restore();}}
 ctx.restore();
 if(e>0){ctx.save();ctx.globalAlpha=a0*e;__cp86Pupils();ctx.restore();}};
// Add-on (Jenny, Nov 18: "let the meow shake the whole cat and let the paws move around. Choose some action for the paws so
// the cat just doesn't look totally passive with a giant open maw."). While the face shows, the whole cat puts its body into
// each meow (Sonic meow meows at 0, 1.25, 2.5 and 3.75 s): a fast shiver of head and mitts, strongest on each meow, which
// also lunges the head forward and pushes both mitts forward and inward, turning them in (never up: no Yawn stretch).
// Between meows the mitts knead the board in turn. The approved head and mitts are only moved and turned (the head through
// petHeadXf, the mitts through pawMotion or mittRest, as the other poses do); it builds in with the face, and settles to rest over the 0.25 s before the face
// leaves, so the face changes back on a still head. Drawing only: the mitts' resting colliders are not moved.
// The lunge builds over 0.08 s (eased) and settles over the next ~0.9 s, so nothing jumps from one frame to the next (an
// instant jump on each meow read as a glitch, Jenny Nov 18).
function cp86Pulse(u){return u<.08?cp58Ease(u/.08):Math.exp(-(u-.08)*4.5);}
function cp86Pose(){const k0=cp86K();if(k0<=0)return null;const X=PGPX,t=X.t,end=cp86End(X),k=Math.min(k0,Math.max(0,Math.min(1,(end-t)/CP86.settle)));
 if(k<=0)return null;return {k,t,p:cp86Pulse(t%1.25),sh:Math.sin(t*58)};}
const __cp86HeadXf=petHeadXf;
petHeadXf=function(){__cp86HeadXf();const P=cp86Pose();if(!P)return;const {k,p,sh}=P;
 ctx.translate(200+k*sh*(1.2+2.8*p),110+k*6*p);ctx.rotate(k*sh*.012*(.3+p));ctx.translate(-200,-110);};
function cp86MittOff(side){const P=cp86Pose();if(!P)return null;const {k,t,p,sh}=P;
 const knead=Math.max(0,Math.sin(t*2*Math.PI*2.4+(side>0?Math.PI:0)))*(1-p);
 return {x:k*(-side*22*p+side*sh*3*(.4+p)),y:k*(40*p+12*knead),r:k*(side*.3*p+side*.08*knead)};}
// the mitts at rest are drawn one of two ways: the rest pose (pawMotion) or the idle "waiting" mitts (mittRest, then a fixed
// turn and drawMittArm); both get the same offset and turn
const __cp86Paw=pawMotion;
pawMotion=function(side=0){const m=__cp86Paw(side);if(!side)return m;const o=cp86MittOff(side);return o?{x:m.x+o.x,y:m.y+o.y,r:m.r+o.r}:m;};
const __cp86MittRest=mittRest;mittRest=function(side){const r=__cp86MittRest(side);CP86.side=side;const o=cp86MittOff(side);return o?Object.assign({},r,{x:r.x+o.x,y:r.y+o.y}):r;};
const __cp86Arm=drawMittArm;drawMittArm=function(w,h){const o=CP86.side?cp86MittOff(CP86.side):null;if(o)ctx.rotate(CP86.side<0?o.r:-o.r); // the right mitt is drawn mirrored
 return __cp86Arm.apply(this,arguments);};
// Floating texts wait for the powers (PM, Nov 18, Jenny's rule: "For all the powers... the words appear before the
// action... we aren't going to put words over top of them"): while any power plays (title and action, all five powers),
// a new floating text such as "BONUS PRIZE!" is held back and shows, from its start, once the power has ended; the thing it
// announces (the bonus drop and so on) happens as normal. Not held: the frozen pickup's own board texts ("2 / 5",
// "REPEAT +5 COINS", "COLLECTION!"; DEVELOPER.md "Pickup (frozen)"), unless CP86.holdPickupTexts is set.
CP86.held=[];CP86.holdPickupTexts=false;CP86.stats={held:0,released:0};
function cp86PickupText(f){return /^\d+ \/ \d+$|^COLLECTION!$|^REPEAT \+5 COINS$/.test(String(f.text));}
function cp86FloatHold(){if(PGPX){for(let i=floats.length-1;i>=0;i--){const f=floats[i];if(f.cp86seen)continue;
   if(!CP86.holdPickupTexts&&cp86PickupText(f)){f.cp86seen=1;continue;}floats.splice(i,1);f.t=0;CP86.held.unshift(f);CP86.stats.held++;}}
 else if(CP86.held.length){for(const f of CP86.held){f.cp86seen=1;floats.push(f);CP86.stats.released++;}CP86.held=[];}}
// after each update (where floats are made and aged) and before the frame is drawn
const __cp86Update=update;update=function(dt){const r=__cp86Update.apply(this,arguments);try{for(const f of floats)if(!PGPX)f.cp86seen=1;cp86FloatHold();}catch(e){}return r;};
// a round reset or the board closing drops what was held, as it clears the floats
const __cp86Reset=wildReset;wildReset=function(){CP86.held=[];return __cp86Reset.apply(this,arguments);};
const __cp86Exit=wildExit;wildExit=function(){CP86.held=[];return __cp86Exit.apply(this,arguments);};
// ---------- end CP-86 ----------
