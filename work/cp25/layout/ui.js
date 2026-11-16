let collectionDrag=null;
function screenLayout(){const h=hudLayout();return {top:h.top+24,left:Math.max(18,h.left+12),right:Math.min(382,W-h.right-12),bottom:H-h.bottom-18};}
function collectionGeometry(){
 const s=screenLayout(),width=s.right-s.left,satchel={x:s.left,y:s.bottom-170,w:width,h:164};
 const set=COLLECTIONS[loopScreen],ids=[...set.items,...set.future],rows=Math.ceil(ids.length/2);
 const areaTop=s.top+124,areaBottom=satchel.y-46,available=areaBottom-areaTop;
 const cellW=(width-12)/2,cellH=Math.min(230,(available-(rows-1)*12)/rows),offset=(available-(cellH*rows+(rows-1)*12))/2;
 const slots=ids.map((id,i)=>({id,x:s.left+(i%2)*(cellW+12),y:areaTop+offset+Math.floor(i/2)*(cellH+12),w:cellW,h:cellH,future:set.future.includes(id)}));
 const items=['cheese','shrimp','tuna'].map((id,i)=>({id,x:satchel.x+12+i*(width-24)/3,y:satchel.y+48,w:(width-24)/3,h:104}));
 return {...s,satchel,slots,items};
}
function contains(r,p){return p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h;}
function cancelCollectionDrag(){collectionDrag=null;}
function screenTap(p){
 const s=screenLayout();
 if(p.x>=s.right-64&&p.x<=s.right&&p.y>=s.top-16&&p.y<=s.top+26){cancelCollectionDrag();inventoryOpen=false;stopDrops();save();return;}
 if(p.y>=s.top+42&&p.y<=s.top+84&&p.x>=s.left&&p.x<=s.right){cancelCollectionDrag();loopScreen=p.x<(s.left+s.right)/2?'water':'cheese';collectionMessage='';}
}
function collectionPointerDown(e,p){
 if(collectionDrag)return;
 const g=collectionGeometry(),item=g.items.find(r=>contains(r,p));
 if(item&&S.got[item.id]>0){collectionDrag={id:item.id,pointer:e.pointerId,start:{...p},at:{...p},moved:false};cv.setPointerCapture(e.pointerId);return;}
 screenTap(p);
}
function collectionPointerMove(e,p){
 if(!collectionDrag||e.pointerId!==collectionDrag.pointer)return;
 collectionDrag.at={...p};if(Math.hypot(p.x-collectionDrag.start.x,p.y-collectionDrag.start.y)>=8)collectionDrag.moved=true;
}
function collectionPointerUp(e,p,drop){
 const drag=collectionDrag;if(!drag||e.pointerId!==drag.pointer)return;collectionDrag=null;
 if(!drop||!drag.moved){collectionMessage='Drag from your satchel into a silhouette.';return;}
 const slot=collectionGeometry().slots.find(r=>contains(r,p));
 if(slot?.id===drag.id&&!slot.future&&!placements[drag.id]){placeItem(drag.id);}
 else collectionMessage=slot?.id===drag.id&&placements[drag.id]?'Already placed · extra copy kept': 'Back in your satchel · match the silhouette';
}
function drawInventory(){
 const g=collectionGeometry(),set=COLLECTIONS[loopScreen],width=g.right-g.left;
 ctx.fillStyle='#160f24';ctx.fillRect(0,0,W,H);ctx.textBaseline='middle';
 // Simple frame and rivets are deliberate placeholders for a later art ticket.
 ctx.strokeStyle='#78617d';ctx.lineWidth=2;ctx.strokeRect(g.left-7,g.top-15,width+14,g.bottom-g.top+18);
 for(const x of [g.left-2,g.right+2])for(const y of [g.top-10,g.bottom-2]){ctx.fillStyle='#c8ad87';ctx.beginPath();ctx.arc(x,y,2,0,7);ctx.fill();}
 ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 25px system-ui';ctx.fillText('Collections',g.left+8,g.top+6);
 ctx.textAlign='right';ctx.font='bold 15px system-ui';ctx.fillText('Close',g.right-7,g.top+6);
 ['Water','Cheese'].forEach((name,i)=>{const x=g.left+i*width/2;ctx.fillStyle=loopScreen===name.toLowerCase()?'#775578':'#30213f';ctx.fillRect(x,g.top+42,width/2-3,42);ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 17px system-ui';ctx.fillText(name,x+width/4,g.top+64);});
 ctx.textAlign='center';ctx.fillStyle='#d0bedf';ctx.font='13px system-ui';ctx.fillText(collectionPaid[loopScreen]?'Reward collected · future prizes coming later':'Place '+set.items.map(id=>PRIZE_NAMES[id]).join(' + ')+' for '+set.reward+' coins',200,g.top+104,width-8);
 g.slots.forEach(r=>{
  const hover=collectionDrag?.moved&&collectionDrag.id===r.id&&contains(r,collectionDrag.at)&&!placements[r.id];
  ctx.fillStyle=hover?'#685174':'#30213f';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle=hover?'#ffe29a':'#5a4365';ctx.lineWidth=hover?3:1;ctx.strokeRect(r.x+2,r.y+2,r.w-4,r.h-4);
  const x=r.x+r.w/2,y=r.y+r.h*.45,k=Math.min(1.4,(r.h-48)/85);
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  if(placements[r.id])drawPrize('item',r.id,0,22,.85);else if(r.future)outlinePrize(r.id,0,0);else shadowPrize(r.id,0,0);
  ctx.restore();ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.fillText(PRIZE_NAMES[r.id],x,r.y+r.h-33);
  ctx.font='12px system-ui';ctx.fillStyle='#d0bedf';ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h-14);
 });
 ctx.textAlign='center';ctx.font='13px system-ui';ctx.fillStyle='#ffe29a';ctx.fillText(collectionMessage||'Drag a treat from the satchel to its silhouette.',200,g.satchel.y-23,width);
 if(collectionStars>0&&celebratingCollection===loopScreen){ctx.font='bold 18px system-ui';ctx.fillText('COLLECTION COMPLETE!',200,g.top+119,width);}
 const b=g.satchel;
 ctx.strokeStyle='#d1a77b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(155,b.y+8);ctx.lineTo(155,b.y-6);ctx.quadraticCurveTo(200,b.y-27,245,b.y-6);ctx.lineTo(245,b.y+8);ctx.stroke();
 ctx.fillStyle='#61432e';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeStyle='#be956d';ctx.lineWidth=2;ctx.strokeRect(b.x+3,b.y+3,b.w-6,b.h-6);
 ctx.fillStyle='#79533a';ctx.fillRect(b.x+5,b.y+5,b.w-10,34);ctx.strokeStyle='#bc946c';ctx.setLineDash([4,4]);ctx.strokeRect(b.x+8,b.y+8,b.w-16,b.h-16);ctx.setLineDash([]);
 ctx.textAlign='left';ctx.fillStyle='#ffebc4';ctx.font='bold 17px system-ui';ctx.fillText('Satchel',b.x+16,b.y+23);
 ctx.textAlign='right';ctx.font='13px system-ui';ctx.fillText(S.coins+' coins',b.x+b.w-15,b.y+23);
 g.items.forEach(r=>{
  ctx.fillStyle='#493225';ctx.fillRect(r.x+3,r.y,r.w-6,r.h);ctx.strokeStyle='#99704e';ctx.strokeRect(r.x+3,r.y,r.w-6,r.h);
  ctx.save();ctx.globalAlpha=(S.got[r.id]||0)>0?.999:.4;if(collectionDrag?.id!==r.id)drawPrize('item',r.id,r.x+r.w/2,r.y+66,.67);ctx.restore();
  ctx.textAlign='right';ctx.fillStyle='#fff0c6';ctx.font='bold 14px system-ui';ctx.fillText('×'+(S.got[r.id]||0),r.x+r.w-9,r.y+16);
  ctx.textAlign='center';ctx.font='12px system-ui';ctx.fillText(PRIZE_NAMES[r.id],r.x+r.w/2,r.y+88);
 });
 if(collectionDrag){ctx.save();ctx.globalAlpha=.95;drawPrize('item',collectionDrag.id,collectionDrag.at.x,collectionDrag.at.y+20,.98);ctx.restore();}
}
