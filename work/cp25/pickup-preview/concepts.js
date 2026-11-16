// Design preview only. Not included in a game package or Settings.
function drawPickupConcept(style,t=.7){
 const fade=Math.min(1,t/.35,(2.5-t)/.5),x=200,y=H*.54;
 ctx.save();ctx.globalAlpha=Math.max(0,fade);ctx.translate(x,y);
 const glow=ctx.createRadialGradient(0,0,12,0,0,150);glow.addColorStop(0,style==='moon'?'rgba(165,231,236,.45)':'rgba(255,223,151,.45)');glow.addColorStop(1,'rgba(255,230,180,0)');ctx.fillStyle=glow;ctx.fillRect(-160,-160,320,320);
 if(style==='halo'){
  for(let k=0;k<2;k++){ctx.strokeStyle=k?'rgba(255,238,190,.28)':'rgba(255,230,164,.8)';ctx.lineWidth=k?1:2;ctx.beginPath();ctx.arc(0,0,93+k*9,0,Math.PI*2);ctx.stroke();}
  for(let i=0;i<28;i++){const a=i*2.399,r=112+(i%5)*8;conceptStar(Math.cos(a)*r,Math.sin(a)*r,(i%3)*1.1+1.2,'#ffe6aa');}
 }else if(style==='moon'){
  ctx.save();ctx.rotate(-.45);for(let i=0;i<3;i++){ctx.strokeStyle=['#d2f3ec','#f6e7b4','#70b9c7'][i];ctx.globalAlpha=fade*(.65-i*.14);ctx.lineWidth=2-i*.4;ctx.beginPath();ctx.ellipse(0,0,105+i*9,57+i*9,0,.1,Math.PI*1.75);ctx.stroke();}ctx.restore();
  for(let i=0;i<12;i++){const a=i*2.399;conceptStar(Math.cos(a)*(100+i%3*15),Math.sin(a)*(76+i%4*14),i%3+1,'#dcf9f1');}
 }else{
  for(let i=0;i<7;i++){ctx.save();ctx.rotate(i*Math.PI*2/7);const g=ctx.createLinearGradient(0,30,0,150);g.addColorStop(0,'rgba(255,232,164,0)');g.addColorStop(.6,'rgba(255,232,164,.16)');g.addColorStop(1,'rgba(255,232,164,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-6,55);ctx.quadraticCurveTo(-26,103,0,155);ctx.quadraticCurveTo(26,103,6,55);ctx.fill();ctx.restore();}
  for(let i=0;i<22;i++){const a=i*2.399,r=95+i%4*15;conceptStar(Math.cos(a)*r,Math.sin(a)*r,i%3+1,'#ffedc0');}
 }
 drawPrize('item','cheese',0,48,1.7);ctx.restore();
}
function conceptStar(x,y,r,color){ctx.save();ctx.translate(x,y);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(0,-r*2);ctx.quadraticCurveTo(r*.2,-r*.2,r*2,0);ctx.quadraticCurveTo(r*.2,r*.2,0,r*2);ctx.quadraticCurveTo(-r*.2,r*.2,-r*2,0);ctx.quadraticCurveTo(-r*.2,-r*.2,0,-r*2);ctx.fill();ctx.restore();}
