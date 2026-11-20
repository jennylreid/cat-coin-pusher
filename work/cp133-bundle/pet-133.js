// ---- UAT 133 item 3: Pet the cat's meter is a glowing ring around the cat's head (Jenny, Nov 20) ----
// "Beneath the board it's unnoticed; up high the hand covered it": the strip is replaced by a thin glowing ring hugging the head
// (code-drawn, no art; a line, so the face stays readable). It fills clockwise from the top as you pet, to the PEAK star at the
// same point as the strip's (78%); past the peak the red "grumpy" part grows, as on the strip. Fill and timing are unchanged.
// DONE, the title and the result go back under the chin where they were before UAT 132 (y 468); the title "PET THE CAT!" also
// stays up through the first second of play (fading), a little longer than before.
petHudY=function(){return PET_HUD_Y;};
function petRing133(D,fade){const L=D.phase==='end'?D.result.L:D.L,top=headToScreen(200,58).y,bot=headToScreen(200,224).y,c={x:200,y:(top+bot)/2},rx=182,ry=Math.max(50,(bot-top)/2); // forehead to just under the chin, below the banner
 const a0=-Math.PI/2,P=.78,ang=f=>a0+f*Math.PI*2,fill=Math.min(1,L)*P,grr=Math.min(1,D.flat||0)*(1-P);
 ctx.save();ctx.lineCap='round';
 ctx.lineWidth=6;ctx.strokeStyle='rgba(255,180,220,.22)';ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,0,Math.PI*2);ctx.stroke(); // the track
 ctx.strokeStyle='rgba(255,90,60,.25)';ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,ang(P)+.06,ang(1)-.02);ctx.stroke(); // grumpy zone
 if(fill>.005){ctx.shadowColor='#ff8ac8';ctx.shadowBlur=14+10*L;ctx.lineWidth=7;ctx.strokeStyle=L>=.97?'#ffe066':'#ff9ad4';ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,a0,ang(fill));ctx.stroke();}
 if(grr>.005){ctx.shadowColor='#ff5a3a';ctx.shadowBlur=12;ctx.strokeStyle='#ff4a2a';ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,ang(P),ang(P)+grr*Math.PI*2);ctx.stroke();}
 ctx.shadowBlur=0;const at=L>=.97&&(D.flat||0)<.4,st=at?1.25+.15*Math.sin(time*14):1,px=c.x+rx*Math.cos(ang(P)),py=c.y+ry*Math.sin(ang(P));
 ctx.translate(px,py);ctx.scale(st,st);ctx.fillStyle=at?'#fff6a0':'#ffd23f';ctx.strokeStyle='#5a2a00';ctx.lineWidth=1.5;
 ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?5:12;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
// ---- end UAT 133 item 3 ----
