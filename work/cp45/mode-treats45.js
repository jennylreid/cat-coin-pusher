// ---------- CP-41 the Treat toss mode (UAT 45) ----------
// Wild 2's board and goal with Treat toss as its featured side game instead of the Dance break (no happy meter, no
// music-note coin). The fish coin starts it. The Tuxedo runs it for now (no new cat art).
registerWildMode({id:'treats',name:'TREAT TOSS',blurb:'Catch treats the cat flips into the air',
 colors:['#5ef0c0','#0b2a2a','#173f42'],panel:['#1f5a5c','#0b2224'],features:{toss:true},
 cardLines:[['fish','Push the fish coin off','and the cat tosses treats!'],['catch','Tap treats in the air','to catch them'],['perfect','Catch every one','for a RAIN 10 coin'],
  ['visitor','Win','and a cat comes to visit'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']],
 icon(x,y){const sp=sprite('fish');ctx.drawImage(sp.cv,x-24,y-24,48,48);},
 cardIcon(kind,x,y){
  if(kind==='fish'){const sp=sprite('fish');ctx.drawImage(sp.cv,x-17,y-17,34,34);return true;}
  if(kind==='catch'){const g=tossGlow();ctx.drawImage(g,x-22,y-22,44,44);drawPrize('item','shrimp',x,y+6,30/prizeWidth('shrimp',1));ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+12,y-10,6,0,7);ctx.stroke();return true;}
  if(kind==='perfect'){wildText('×16',x,y,18,'#7dff6a','#0c3a12',4);return true;}
  return false;}
});
