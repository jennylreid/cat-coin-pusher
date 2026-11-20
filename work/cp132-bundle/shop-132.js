// ---- UAT 132: a round SHOP button on Home (Jenny, Nov 20: "We need to add a shop button. A round one.") ----
// Same style and size as Kitchen, Porch, Album, Cats and Daily, with its label; in the left column under the last shown button
// (under ALBUM). Always there on Home (no longer waiting for a recipe that needs a bought ingredient), with the same "LEVEL 2"
// lock as before for brand-new players. It opens the Shop screen (Sell / Buy in Catnip). It leaves the right column, so Daily
// sits under Cats. Icon: a code-drawn shopping bag in the round buttons' style (no jar, no painted art).
{const __s132=pgSideRects;pgSideRects=function(y0,gap){const r=__s132.apply(this,arguments).filter(b=>b.id!=='shop');
  try{let i=0;for(const b of r)if(b.x>200){b.y=y0+(i++)*gap;b.hit={x:b.x-32,y:b.y-30,w:64,h:68};} // the right column closes up
   const nL=r.filter(b=>b.x<200).length,nR=r.filter(b=>b.x>200).length,x=36,y=y0+nL*gap;
   r.push({id:'shop',x,y,r:25,level:PG_DOCK_LEVEL.shop||0,hit:{x:x-32,y:y-30,w:64,h:68}});
   if(typeof CP100==='object')CP100.side={x:W-36,y:y0+nR*gap,r:25};}catch(e){}return r;};}
{const __s132Icon=pgDoorIcon;pgDoorIcon=function(id,x,y,t){if(id!=='shop')return __s132Icon.apply(this,arguments);
  ctx.save();ctx.translate(x,y);
  ctx.strokeStyle='#f6dfa4';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.arc(0,-12,13,Math.PI,0);ctx.stroke(); // handle
  uiRound(-27,-14,54,42,8,'#ffb23f','#7a3a10',3); // the bag
  ctx.fillStyle='#e8892a';ctx.fillRect(-27,-14,54,9);
  ctx.fillStyle='#fff6d0';ctx.beginPath();ctx.arc(0,9,9,0,7);ctx.fill();pgPaw(0,10,.24,'#a8400f'); // a paw tag
  ctx.restore();};}
// ---- end UAT 132 SHOP button ----
