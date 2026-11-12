// ---------- CP-38 follow-up: the Wild 2 goal card (UAT 41) ----------
// Wild 2's own card explains the board before anything starts: the goal, then one line with an icon per idea (happy
// meter, tap on the beat, perfect spin, visitor, rain coins, bonus drops), and a big TAP TO START. Any tap on the card
// starts the 3-2-1 countdown, except "Back to the game"; the timer only runs after GO!. Wild 1's card is unchanged.
const W2_CARD_LINES=[['meter','Prizes fill the happy meter','and the cat dances!'],['beat','Tap on the beat','to bank coins'],['wheel','Hit every beat','to spin the wheel'],
 ['visitor','Win','and a cat comes to visit'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']];
const __c41CardRects=wildCardRects;
function w2CardLayout(){
 // fits the screen: taller screens get more room per line, a 720-tall screen still fits
 const top=Math.max(hudLayout().headerBottom-30,40),bottom=H-Math.max(28,hudLayout().bottom+24),room=bottom-top;
 const row=Math.max(38,Math.min(60,(room-334)/W2_CARD_LINES.length)),h=Math.min(room,334+row*W2_CARD_LINES.length),y=top+(room-h)/2;
 const linesY=y+190,s=linesY+row*W2_CARD_LINES.length+30;
 return {card:{x:14,y,w:372,h},row,linesY,start:{x:46,y:s,w:308,h:70},back:{x:120,y:s+80,w:160,h:30}};
}
wildCardRects=function(){if(!WILD.v2)return __c41CardRects();const L=w2CardLayout();return {card:L.card,go:L.card,back:L.back};};
const __c41Pointer=wildPointer;
wildPointer=function(e,p){
 if(WILD.on&&WILD.v2&&WILD.phase==='card'&&world&&!inventoryOpen){
  if(contains(wildButton(),p)){wildExit();return true;}
  const L=w2CardLayout();if(contains(L.back,p)){wildExit();return true;}
  wildStartCountdown();sfx.wild('beep',1);return true; // anywhere else on the screen starts it
 }
 return __c41Pointer(e,p);
};
function w2CardIcon(kind,x,y){
 if(kind==='meter'){ctx.fillStyle='#ff6ab8';ctx.beginPath();const s=11;ctx.moveTo(x-14,y+s*.75);ctx.bezierCurveTo(x-14-s*1.3,y-s*.2,x-14-s*.6,y-s*1.2,x-14,y-s*.45);ctx.bezierCurveTo(x-14+s*.6,y-s*1.2,x-14+s*1.3,y-s*.2,x-14,y+s*.75);ctx.fill();
  for(let i=0;i<3;i++)uiRound(x-1+i*10,y-6,8,12,3,i<2?'#ff5fb0':'rgba(40,16,50,.9)','#ff9ad8',1);return;}
 if(kind==='beat'){uiCircle(x,y,15,null,'#ffffff',3);danceNoteGlyph(x-25,y,.8,'#ff7ad5');danceNoteGlyph(x+25,y,.8,'#ff7ad5');return;}
 if(kind==='wheel'){const cols=['#ffb23f','#ff7ad5','#ff5a2c','#4fe0b0','#4f8bff','#c86aff','#ffd23f','#6a6a7a'];for(let i=0;i<8;i++){ctx.fillStyle=cols[i];ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,17,i*Math.PI/4,(i+1)*Math.PI/4);ctx.closePath();ctx.fill();}uiCircle(x,y,17,null,'#ffe08a',2);uiCircle(x,y,4,'#ffd23f');ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(x-5,y-23);ctx.lineTo(x+5,y-23);ctx.lineTo(x,y-14);ctx.closePath();ctx.fill();return;}
 if(kind==='visitor'){drawVisitorCat('orange',x,y+2,.3);return;}
 if(RAIN[kind]){const sp=sprite(kind);ctx.drawImage(sp.cv,x-16,y-16,32,32);return;}
 if(kind==='!'){uiCircle(x,y,15,'#ff7ad5');ctx.fillStyle='#fff';ctx.font='900 21px Impact, system-ui';ctx.textAlign='center';ctx.fillText('!',x,y+1);}
}
function drawWild2Card(){
 const L=w2CardLayout(),R=L.card,pop=Math.min(1,WILD.cardT/.25),k=.7+.3*(1-Math.pow(1-pop,3)),cy=R.y+R.h/2;
 ctx.fillStyle='rgba(12,6,24,'+(.7*pop)+')';ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(200,cy);ctx.scale(k,k);ctx.translate(-200,-cy);ctx.textAlign='center';ctx.textBaseline='middle';
 wildPanel(R,'#4b1f6e','#1d0f33');
 wildText('WILD 2',200,R.y+40,46,'#a6ff6a','#10301a',8);
 ctx.fillStyle='#ffd23f';ctx.font='900 24px Impact, "Arial Black", system-ui';ctx.fillText('GOAL: COLLECT ALL '+WILD_GOAL+' PRIZES',200,R.y+84,350);
 WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*44,R.y+112,38,false));
 ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.fillText('before the '+WILD_SECONDS+' s timer or your coins run out',200,R.y+166,350);
 // one line per idea, icon on the left
 const big=L.row>=44;
 W2_CARD_LINES.forEach(([ic,a,b],i)=>{const y=L.linesY+i*L.row+L.row/2;if(i===4){ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(44,y-L.row/2);ctx.lineTo(356,y-L.row/2);ctx.stroke();}
  w2CardIcon(ic,62,y);ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold '+(big?18:16)+'px system-ui';
  if(big){ctx.fillText(a,96,y-10,280);ctx.fillStyle='#ffe08a';ctx.font='bold 16px system-ui';ctx.fillText(b,96,y+11,280);}
  else{ctx.fillText(a+' '+b,96,y,282);}
  ctx.textAlign='center';});
 // the start: big, pulsing, and the whole card starts it
 const s=L.start,pulse=1+.04*Math.sin(performance.now()/180);ctx.save();ctx.translate(s.x+s.w/2,s.y+s.h/2);ctx.scale(pulse,pulse);ctx.translate(-(s.x+s.w/2),-(s.y+s.h/2));
 wildButtonDraw(s,'TAP TO START','#3ccf4e','#0c3a12',34);ctx.restore();
 ctx.fillStyle='#e8dcff';ctx.font='bold 14px system-ui';ctx.fillText('The timer starts after 3, 2, 1, GO!',200,s.y-14);
 uiRound(L.back.x,L.back.y,L.back.w,L.back.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Back to the game',200,L.back.y+L.back.h/2+1);
 ctx.restore();
}
const __c41Draw=wildDraw;
wildDraw=function(){__c41Draw();if(WILD.on&&WILD.v2&&WILD.phase==='card'&&!inventoryOpen){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);drawWild2Card();ctx.restore();}};
