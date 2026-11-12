// Transient presentation only. Inventory is credited and saved by fallOff, once.
const treatAwards=[];
function queueTreatAward(id){treatAwards.push({id,t:0});}
function dismissTreatAward(){if(treatAwards.length)treatAwards.shift();}
function tickTreatAwards(dt){if(treatAwards.length){treatAwards[0].t+=dt;if(treatAwards[0].t>=2)dismissTreatAward();}}
function collectionsTile(){
 const h=hudLayout(),anchor=screenOf(370,315,0);
 return {x:W-h.right-48,y:VIEW.y+anchor.y*VIEW.zy-20,w:44,h:44};
}
function hitCollectionsTile(p){const b=collectionsTile();return p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h;}
function drawCollectionsTile(){
 const b=collectionsTile();ctx.save();ctx.fillStyle='#30213f';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeStyle='#e1c68d';ctx.lineWidth=1.5;ctx.strokeRect(b.x+1,b.y+1,b.w-2,b.h-2);
 ctx.strokeRect(b.x+14,b.y+6,17,20);ctx.beginPath();ctx.moveTo(b.x+18,b.y+6);ctx.lineTo(b.x+18,b.y+26);ctx.stroke();ctx.fillStyle='#ffe5a5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 9px system-ui';ctx.fillText('Collections',b.x+b.w/2,b.y+35,b.w-4);ctx.restore();
}
function drawTreatAward(){
 const a=treatAwards[0];if(!a)return;
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);
 ctx.fillStyle='rgba(12,7,20,.48)';ctx.fillRect(0,0,W,H);
 const y=Math.max(hudLayout().headerBottom+20,(H-340)/2),fade=Math.min(1,a.t/.12,(2-a.t)/.18);ctx.globalAlpha=Math.max(0,fade);
 ctx.fillStyle='#2e1d40';ctx.fillRect(40,y,320,340);ctx.strokeStyle='#efcf83';ctx.lineWidth=2;ctx.strokeRect(46,y+6,308,328);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffe6a4';ctx.font='bold 29px system-ui';ctx.fillText('You got it!',200,y+43);
 for(let i=0;i<8;i++){const r=i*Math.PI/4,shine=1+.08*Math.sin(a.t*8+i);ctx.strokeStyle=i%2?'#d7bddc':'#ffe6a4';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(200+Math.cos(r)*111*shine,y+165+Math.sin(r)*72*shine);ctx.lineTo(200+Math.cos(r)*123*shine,y+165+Math.sin(r)*84*shine);ctx.stroke();}
 drawPrize('item',a.id,200,y+215,2);
 ctx.fillStyle='#fff';ctx.font='bold 25px system-ui';ctx.fillText(PRIZE_NAMES[a.id]||a.id,200,y+265);
 ctx.font='13px system-ui';ctx.fillStyle='#d7c8e3';ctx.fillText('Added to your satchel · tap to dismiss',200,y+306);
 if(treatAwards.length>1){ctx.font='12px system-ui';ctx.fillText('+'+(treatAwards.length-1)+' more',200,y+363);}
 ctx.restore();
}
