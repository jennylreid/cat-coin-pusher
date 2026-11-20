
// ---------- Next round #6: Developer power buttons switch to that power's cat first (Jenny, Nov 20: "I think that would be
// convenient"; e.g. Hug from the Tuxedo switches to the Ragdoll), then start it as before (CP-102: no power used from the
// player's stock). On the endless board the endless board stays on, with that cat. Side game buttons are unchanged.
const __rpowStart=cp102Start;
cp102Start=function(kind,id){
 if(kind==='power'&&PGP[id]){if(!PG)pgInit();if(!PG.open[id]){PG.open[id]=1;if(PG.openOrder&&!PG.openOrder.includes(id))PG.openOrder.push(id);}
  if(!(WILD.on&&PGU.screen==='board'&&PGU.boardCat===id)){const endless=typeof END!=='undefined'&&END.on;panel.style.display='none';pgSwitchBoard(id);
   if(endless&&!END.on)END.on=true;try{diagEvent('cp102','power '+id+': switched to its cat'+(endless?' (endless)':''));}catch(e){}}}
 return __rpowStart.apply(this,arguments);};
// ---------- end next round #6 ----------
