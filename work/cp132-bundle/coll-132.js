// ---- UAT 132: Collections and Inventory open properly from Home; a round COLLECTIONS button (Jenny, Nov 20) ----
// Bug (Jenny on UAT 131: "When I tried to enter a board, the collection screen opened."): the small top-right card icon opened
// Collections out of sight on Home (Home doesn't draw the old screens; only the board view does), so it popped up the next time a
// board showed. Now Collections and Inventory, opened from Home, show at once over Home and take the taps; Close comes back to Home.
{const __c132Open=openLoopScreen;openLoopScreen=function(){try{if(PG&&!PG_HOME_OFF&&PGU.screen==='main'){PGU.screen='board';PGU.fade=Math.max(PGU.fade||0,.15);}}catch(e){}return __c132Open.apply(this,arguments);};}
// The cat chip (e.g. "Orange") no longer draws over the Collections or Inventory screen.
{const __c132Tag=pgTag;pgTag=function(){if(inventoryOpen)return;return __c132Tag.apply(this,arguments);};}
// The round COLLECTIONS button: same style and size as the others, right column under DAILY. Opens Collections (Water / Kitchen).
{const __c132Side=pgSideRects;pgSideRects=function(y0,gap){const r=__c132Side.apply(this,arguments);try{CP100.coll={x:W-36,y:CP100.side.y+gap,r:25};}catch(e){}return r;};}
function c132Btn(){if(PGU.screen!=='main'||typeof CP100!=='object'||!CP100.coll)return null;return CP100.coll;}
function c132Draw(){const b=c132Btn();if(!b)return;ctx.save();ctx.translate(b.x,b.y);uiCircle(0,3,b.r,'rgba(0,0,0,.35)');
 const g=ctx.createLinearGradient(0,-b.r,0,b.r);g.addColorStop(0,'#9b7bff');g.addColorStop(1,'#4a2a9a');uiCircle(0,0,b.r,g,'#fff6d0',2);
 // a fan of three cards (the top bar's Collections picture, drawn bigger)
 for(const [dx,rot,c] of [[-6,-.28,'#abd1c8'],[6,.28,'#e4f0df'],[0,0,'#2f7279']]){ctx.save();ctx.translate(dx,2);ctx.rotate(rot);uiRound(-8,-12,16,22,3,c,'#f6dfa4',1.5);ctx.restore();}
 ctx.fillStyle='#ffd23f';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?2.2:5;ctx.lineTo(Math.cos(a)*rr,1+Math.sin(a)*rr);}ctx.closePath();ctx.fill();
 ctx.textAlign='center';ctx.textBaseline='middle';const lab='COLLECTIONS';ctx.font='900 10px Impact, system-ui';const lw=ctx.measureText(lab).width+10;
 uiRound(-lw/2,b.r-4,lw,15,7,'rgba(16,8,28,.9)','#9b7bff',1);ctx.fillStyle='#fff';ctx.fillText(lab,0,b.r+4);ctx.restore();}
{const __c132DM=pgDrawMain;pgDrawMain=function(dt){const r=__c132DM(dt);try{if(endHomeFree())c132Draw();}catch(e){}return r;};}
{const __c132MT=pgMainTap;pgMainTap=function(p){try{if(endHomeFree()){const b=c132Btn();if(b&&Math.hypot(p.x-b.x,p.y-b.y)<b.r+8){pgSfx('tap');openLoopScreen('water');return;}}}catch(e){}return __c132MT(p);};}
// ---- end UAT 132 Collections ----
