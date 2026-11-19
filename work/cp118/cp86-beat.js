// ---------- CP-86 Sonic meow: a held beat after the rings (Jenny, Nov 19: "the sound wave should stop, and then there should
// be a beat where the cat's still in the sonic meow pose, and then the cat comes out of the pose. It's too mechanical right
// now.") ----------
// The power is unchanged: it ends at 5 s as before (the 2x reach, the board shake, the meows, the rings fading over its last
// 0.4 s, and whatever waits for the power). The cat's pose then carries on for a short visual tail, CP86T, which continues
// the meow's own clock: a held beat (CP86B.beat) with the meow face, eyes open and the mitts above the head, the shiver
// settling over its first CP86B.still; then the quick drop in front of the face to under the cheeks (CP86B.drop), the
// change of layer there (unseen), the tuck behind the cheeks into rest (CP86B.tuck), and the face switches back on that last
// frame. Drawing only. Floating texts and callouts keep waiting through the tail, as they wait for the power.
// If anything else starts during the tail (another power or its title, a side game, the wheel's Yawn), the tail goes straight
// to its drop, so the mitts still travel home (0.25 s) and nothing pops.
const CP86B={beat:.5,still:.25,drop:.15,tuck:.1,stats:{tails:0,cut:0}};
var CP86T=null;
function cp86X(){const X=PGPX;return X&&X.id==='sonic'?X:CP86T;}
function cp86DropAt(X){return X.dur+CP86B.beat;}
function cp86UnderAt(X){return X.dur+CP86B.beat+CP86B.drop;}
function cp86VE(X){return X.dur+CP86B.beat+CP86B.drop+CP86B.tuck;} // the face switches back here
cp86End=function(X){return cp86VE(X);};
cp86K=function(){const X=cp86X();if(!X||CP75_CAT!=='siamese')return 0;const A=CP75_ART.siamese;if(!A||!A.face)return 0;return X.t<cp86VE(X)?1:0;};
cp86Open=function(){const X=cp86X();return X&&X.t>=CP86.openAt?1:0;};
// the shiver: full during the meow, settled over the beat's first CP86B.still (the pose itself stays)
cp86Pose=function(){if(cp86K()<=0)return null;const X=cp86X(),t=X.t,k=Math.max(0,Math.min(1,(X.dur+CP86B.still-t)/CP86B.still));return {k,t,p:cp86Pulse(t%1.25),sh:Math.sin(t*58)};};
cp86MPick=function(){const X=cp86X();if(!X)return CP86M.get();if(!X.cp86m){X.cp86m=CP86M.get();CP86M.stats.meows[X.cp86m]=(CP86M.stats.meows[X.cp86m]||0)+1;}return X.cp86m;};
cp86MTarget=function(side){const X=cp86X(),t=X?X.t:0;let P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head;
 if(P.seq){const A=CP86M.POSE[P.seq[0]],B=CP86M.POSE[P.seq[1]],k=cp58Ease((t-CP86M.swap[0])/(CP86M.swap[1]-CP86M.swap[0]));P={dx:A.dx+(B.dx-A.dx)*k,dy:A.dy+(B.dy-A.dy)*k,a:A.a+(B.a-A.a)*k};}
 const R=cp58Rest(side),T={x:R.x+side*P.dx,y:R.y+P.dy,a:P.a};if(!X||t<cp86DropAt(X))return T;
 const d=cp86FDip(side),D={x:R.x+side*d.dx,y:R.y+d.dy,a:d.a},k=cp58Ease((t-cp86DropAt(X))/CP86B.drop);
 return {x:T.x+(D.x-T.x)*k,y:T.y+(D.y-T.y)*k,a:T.a+(D.a-T.a)*k};};
cp86MWeight=function(){const X=cp86X();if(!X||cp86K()<=0)return 0;const u=cp86UnderAt(X);
 return cp58Ease(X.t/CP86M.up)*(X.t<u?1:cp58Ease((cp86VE(X)-X.t)/CP86B.tuck));};
cp86MOnTop=function(){const X=cp86X();if(!X||cp86K()<=0||X.t>=cp86UnderAt(X))return false;const k=cp86MPick();
 return k!=='B'&&k!=='C'&&sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose();};
// the drop and under times as before, now after the beat (kept in CP86F for anything that reads them)
CP86F.drop=5+CP86B.beat;CP86F.under=5+CP86B.beat+CP86B.drop;
// floating texts wait through the tail too
cp86FloatHold=function(){if(PGPX||CP86T){for(let i=floats.length-1;i>=0;i--){const f=floats[i];if(f.cp86seen)continue;
   if(!CP86.holdPickupTexts&&cp86PickupText(f)){f.cp86seen=1;continue;}floats.splice(i,1);f.t=0;CP86.held.unshift(f);CP86.stats.held++;}}
 else if(CP86.held.length){for(const f of CP86.held){f.cp86seen=1;floats.push(f);CP86.stats.released++;}CP86.held=[];}};
// callouts (e.g. COIN RAIN) wait through the tail as they wait for the power (CP-82: no words over the action)
const __cp86BHolding=cp82Holding;cp82Holding=function(){return __cp86BHolding()||!!CP86T;};
// the tail starts when Sonic meow ends at its full time, and runs on the game's own clock
const __cp86BEnd=pgpEnd;
pgpEnd=function(){const X=PGPX;const r=__cp86BEnd.apply(this,arguments);
 if(X&&X.id==='sonic'&&X.t>=X.dur-1e-6&&!PGPX&&CP75_CAT==='siamese'){CP86T={id:'sonic',t:X.t,dur:X.dur,cp86m:X.cp86m,tail:1,fresh:1};CP86B.stats.tails++;}return r;};
const __cp86BUpdate=update;
update=function(dt){const r=__cp86BUpdate.apply(this,arguments);try{const T=CP86T;if(T){
  if(PGPX&&PGPX.id==='sonic')CP86T=null; // a new meow's action has begun (its title gave the tail time to finish)
  else{if((PGPX||pgpSideGame()||(typeof WILD==='object'&&WILD.dance))&&T.t<cp86DropAt(T)){T.t=cp86DropAt(T);CP86B.stats.cut++;}
   if(T.fresh)T.fresh=0;else T.t+=dt||0; /* the frame the power ended already advanced its clock */if(T.t>=cp86VE(T))CP86T=null;}}}catch(e){}return r;};
const __cp86BReset=wildReset;wildReset=function(){CP86T=null;return __cp86BReset.apply(this,arguments);};
const __cp86BExit=wildExit;wildExit=function(){CP86T=null;return __cp86BExit.apply(this,arguments);};
// ---------- end CP-86 held beat ----------
