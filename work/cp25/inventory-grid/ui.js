// Inventory and Collections are separate destinations. Existing counters only.
function collectionsTile(){const h=hudLayout(),bottom=VIEW.y+screenOf(200,T.FRONT,0).y*VIEW.zy;return h.bottomY-4>bottom+6?{x:W/2-90,y:h.bottomY-4,w:44,h:44,placement:'footer'}:{x:W-h.right-100,y:h.headerBottom-41,w:44,h:44,placement:'header'};}
function drawCollectionsTile(){
 const b=collectionsTile(),x=b.x+b.w/2,y=b.y+b.h/2;ctx.save();
 ctx.beginPath();for(let i=0;i<=160;i++){const angle=i/160*Math.PI*2,r=20+1.7*Math.cos(angle*10),px=x+Math.cos(angle)*r,py=y+Math.sin(angle)*r;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();ctx.fillStyle='#fff2ce';ctx.fill();ctx.strokeStyle='#c28e3f';ctx.lineWidth=1.1;ctx.stroke();
 uiCircle(x,y,17,'#f6dfa4','#d0ad65',.7);for(let i=0;i<10;i++){const a=i*Math.PI/5;uiCircle(x+Math.cos(a)*19,y+Math.sin(a)*19, .8,'#b48b4a');}
 ctx.save();ctx.translate(x-4,y-1);ctx.rotate(-.18);uiRound(-8,-10,15,20,2,'#abd1c8','#315f63',.8);ctx.restore();ctx.save();ctx.translate(x+4,y-1);ctx.rotate(.18);uiRound(-7,-10,15,20,2,'#e4f0df','#315f63',.8);ctx.restore();uiRound(x-7,y-8,15,20,2,'#225d65','#143d46',.8);ctx.fillStyle='#f5d58c';ctx.beginPath();ctx.moveTo(x-3,y-7);ctx.lineTo(x+3,y-7);ctx.lineTo(x+3,y+3);ctx.lineTo(x,y+1);ctx.lineTo(x-3,y+3);ctx.closePath();ctx.fill();
 if(b.placement==='footer'){ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='12px system-ui';ctx.fillStyle='#fff0cc';ctx.fillText('Collections',x,b.y+b.h+10);}ctx.restore();
}
function inventoryGrid(){
 const s=screenLayout(),size=64,gap=16,left=s.left+12;
 const entries=[...['cheese','shrimp','tuna'].map((id,i)=>({id,kind:'treat',name:PRIZE_NAMES[id],count:S.got[id]||0,x:left+i*(size+gap),y:s.top+86,w:size,h:size})),...['quake','sweep'].map((id,i)=>({id,kind:'power',name:id==='quake'?'Quake':'Paw Sweep',count:powerCount(id),x:left+i*(size+gap),y:s.top+246,w:size,h:size}))];
 return {...s,entries};
}
function drawInventoryOnly(){
 const g=inventoryGrid();ctx.fillStyle='#172e38';ctx.fillRect(0,0,W,H);ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='bold 25px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Inventory',g.left+8,g.top+6);ctx.textAlign='right';ctx.font='15px system-ui';ctx.fillText('Close',g.right-7,g.top+6);
 ctx.textAlign='left';ctx.font='bold 14px system-ui';ctx.fillStyle='#dbc79b';ctx.fillText('Treats',g.left+12,g.top+60);ctx.fillText('Powers',g.left+12,g.top+220);
 for(const r of g.entries){
  uiRound(r.x,r.y,r.w,r.h,12,'#24434c','#53736e',1);ctx.save();ctx.globalAlpha=r.count>0?1:.38;
  if(r.kind==='treat')drawPrize('item',r.id,r.x+r.w/2,r.y+43,.56);
  else if(r.id==='quake'){uiCircle(r.x+32,r.y+30,20,'#164955','#e8c16b',1.3);ctx.fillStyle='#f7d16e';const x=r.x+32,y=r.y+30;ctx.beginPath();ctx.moveTo(x+4,y-15);ctx.lineTo(x-12,y+3);ctx.lineTo(x-1,y+3);ctx.lineTo(x-5,y+15);ctx.lineTo(x+13,y-4);ctx.lineTo(x+2,y-4);ctx.closePath();ctx.fill();}
  else uiPaw(r.x+32,r.y+35,.82,'#f8e7bd');ctx.restore();
  const count=String(r.count),badgeWidth=Math.max(18,9+count.length*6),bx=r.x+r.w-badgeWidth+3,by=r.y+r.h-14;uiRound(bx,by,badgeWidth,18,7,'#f1dda4','#243d43',1);ctx.fillStyle='#24434b';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText(count,bx+badgeWidth/2,by+9);
  ctx.font='10px system-ui';ctx.fillStyle='#e8dcc1';ctx.fillText(r.name,r.x+r.w/2,r.y+r.h+15,76);
 }
}
