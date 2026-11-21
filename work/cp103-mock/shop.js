function pgShopTabs(){
 const y=pgTop()+77;
 return {sell:{x:18,y,w:178,h:42},buy:{x:204,y,w:178,h:42}};
}
function pgShopRows(){
 const sell=PGU.shop.tab==='sell';
 const ids=PG_PRIZES.filter(id=>sell?pgHave(id)>0:!pgWinnable(id));
 const need=pgMissing(pgCurrentRecipe());
 if(!sell)ids.sort((a,b)=>(!!need[b])-(!!need[a]));
 const top=pgTop()+133, gap=9, columns=3, rows=Math.ceil(ids.length/columns);
 const w=(364-gap*(columns-1))/columns;
 const h=Math.min(124,(pgBot()-34-top-gap*(rows-1))/Math.max(1,rows));
 return ids.map((id,i)=>{
  const x=18+(i%columns)*(w+gap),y=top+Math.floor(i/columns)*(h+gap);
  return {id,x,y,w,h,btn:{x:x+w/2-23,y:y+h-26,w:46,h:22}};
 });
}
function pgDrawShop(dt){
 const shop=PGU.shop,sell=shop.tab==='sell',top=pgTop(),balanceY=top+44;
 const bg=ctx.createLinearGradient(0,0,0,H);
 bg.addColorStop(0,'#1d414c');bg.addColorStop(1,'#101d2d');
 ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
 const back=pgBack();
 uiRound(back.x,back.y,back.w,back.h,12,'#19333e','#52717a',1);
 pgChevron(back.x+16,balanceY,-1,'#fdf3dd',5);
 ctx.font='700 14px system-ui';ctx.fillStyle='#fdf3dd';
 ctx.fillText('Home',back.x+50,balanceY);
 ctx.textAlign='left';ctx.font='800 27px system-ui';ctx.fillText('Shop',108,balanceY-1);
 uiRound(250,balanceY-16,132,32,16,'#112e35','#517669',1);
 pgCatnipLeaf(267,balanceY+6,.60);
 ctx.font='750 14px system-ui';ctx.fillStyle='#d3f5ba';
 ctx.fillText(PG.catnip+' Catnip',281,balanceY,91);
 ctx.textAlign='center';
 for(const [key,r] of Object.entries(pgShopTabs())){
  const active=shop.tab===key;
  uiRound(r.x,r.y,r.w,r.h,11,active?'#d2ebdc':'#17323e',active?'#d2ebdc':'#52717a',1);
  ctx.fillStyle=active?'#163d38':'#e5f2ed';ctx.font='750 15px system-ui';
  ctx.fillText(key==='sell'?'Sell prizes':'Buy ingredients',r.x+r.w/2,r.y+r.h/2);
 }
 const rows=pgShopRows(),need=pgMissing(pgCurrentRecipe());
 for(const r of rows){
  const cx=r.x+r.w/2,owner=pgOwner(r.id),price=sell?pgSell(r.id):pgBuy(r.id);
  const atCap=!sell&&pgHave(r.id)>=pgCap(),off=!sell&&(PG.catnip<price||atCap);
  uiRound(r.x,r.y+2,r.w,r.h,13,'#101f29');
  uiRound(r.x,r.y,r.w,r.h,13,'#fff2db',need[r.id]?'#63ce92':'#d6c6a8',need[r.id]?3:1);
  const artH=r.h-43,artY=r.y+artH*.52;
  const glow=ctx.createRadialGradient(cx,artY,0,cx,artY,42);
  glow.addColorStop(0,'#ffffff');glow.addColorStop(1,'#fff2db00');
  ctx.fillStyle=glow;ctx.fillRect(r.x+8,r.y+3,r.w-16,artH+3);
  pgPrizeIcon(r.id,cx,artY+2,Math.min(64,artH*.91));
  if(owner){
   uiCircle(r.x+17,r.y+16,12,'#f9dfb8');
   pgHead(owner,r.x+17,r.y+16,24,'calm',{noPupils:true});
  }
  if(sell||pgHave(r.id)>0){
   uiRound(r.x+r.w-36,r.y+6,30,19,9,'#234754');
   ctx.fillStyle='#fff8e9';ctx.font='750 11px system-ui';
   ctx.fillText('×'+pgHave(r.id),r.x+r.w-21,r.y+15.5);
  }
  ctx.fillStyle='#16343a';ctx.font='750 13px system-ui';
  ctx.fillText(pgName(r.id),cx,r.y+r.h-34,r.w-10);
  const b=r.btn,priceY=b.y+b.h/2;
  uiRound(b.x,b.y,b.w,b.h,11,off?'#e2ded2':'#d5eacb');
  pgCatnipLeaf(cx-12,priceY+5,.43);
  ctx.fillStyle=off?'#5b615b':'#254d32';ctx.font='800 12px system-ui';
  ctx.fillText((sell?'+':'')+price,cx+7,priceY);
 }
 for(let i=shop.flies.length-1;i>=0;i--){
  const f=shop.flies[i];f.t+=dt;const u=Math.min(1,f.t/.5);
  if(u>=1){shop.flies.splice(i,1);continue;}
  if(u>=0){
   const x=f.x+(267-f.x)*u,y=f.y+(balanceY-f.y)*u-Math.sin(u*Math.PI)*60;
   uiCircle(x,y,8,'#f5c632','#a8740c',1);
  }
 }
 ctx.fillStyle='#d5e6df';ctx.font='600 12px system-ui';
 const hint=rows.some(r=>need[r.id])?'Green border: needed for your recipe':
  sell?'Keep what your recipes need':'Ingredients you can’t win on your boards yet';
 const empty=sell?'No prizes yet. Win some on a board!':'Everything can be won on your boards.';
 const last=rows.at(-1);
 ctx.fillText(last?hint:empty,200,last?last.y+last.h+13:top+166,364);
 ctx.restore();
}
