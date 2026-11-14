# UAT 56 additions (exec'd by patch56.py after extra55.py, same rep()).
# 1. The cat head is drawn at the art's own proportions (1536 x 1024 = 1.5). It was drawn at 420:240 (1.75), about 17% too
#    wide, on the title, the main screen, the side screens and the board picker. (The board's own cat, the locked CP-21
#    layout, is left as it is: 1.59 on screen.)
rep("img=pgArt(cat,key)||pgArt(cat,'head');if(!img)return;const h=w*240/420;", "img=pgArt(cat,key)||pgArt(cat,'head');if(!img)return;const h=w*img.height/img.width;")
s += r'''
// ---- UAT 56 (Jenny, Nov 14, via the PM) ----
// 2. During a round the EXIT button is "Board" with a back arrow: it goes back to this board's between-rounds view. Made
//    a little shorter and kept at least 20 px above the meter's row, so it never touches the Dance meter's label on any
//    phone size (rule 11, nothing overlaps).
const __abWildButton=wildButton;
wildButton=function(){if(!(PG&&!PG_HOME_OFF&&WILD.on))return __abWildButton();const h=hudLayout(),bottom=Math.min(h.mainY+15,h.bannerY-20),hh=Math.max(20,Math.min(28,bottom-h.top-1));return {x:257,y:bottom-hh,w:56,h:hh};};
const __abWildBtnDraw=drawWildButton;
drawWildButton=function(){if(!(PG&&!PG_HOME_OFF&&WILD.on))return __abWildBtnDraw();if(inventoryOpen)return;const b=wildButton();
 ctx.save();uiRound(b.x,b.y,b.w,b.h,b.h/2,'#3a2350','rgba(232,220,255,.75)',1.5);pgChevron(b.x+12,b.y+b.h/2,-1,'#f4ecff',4.5);ctx.fillStyle='#f4ecff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 12px system-ui';ctx.fillText('Board',b.x+b.w/2+6,b.y+b.h/2+1,b.w-20);ctx.restore();};
// The round's Settings gear follows the same rule (its circle stays above the meter's label).
pgPlayGear=function(){const h=hudLayout(),bottom=Math.min(h.mainY+17,h.bannerY-20),hh=Math.max(22,Math.min(34,bottom-h.top-1));return {x:W-h.right-80,y:bottom-hh,w:36,h:hh};};
pgDrawPlayGear=function(){const g=pgPlayGear(),r=Math.min(15,g.h/2);uiCircle(g.x+g.w/2,g.y+g.h/2,r,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);pgGearIcon(g.x+g.w/2,g.y+g.h/2,Math.min(8,r-5));};
// 3. The Dance meter (was "Happy Cat"): a music note, a pulse each time it fills a notch, and the first time ever it fills,
//    a hint under it: "Prizes fill it. Full = Dance break!".
const PG_DHINT_KEY='catpusher.uat.dancehint.v1';
const __abHud=drawWildHud;
drawWildHud=function(hud){__abHud(hud);if(!wildFeature('dance')||!PG||PG_HOME_OFF)return;const x0=W-Math.max(8,hud.right+10)-124,y=hud.bannerY;
 if(WILD.happyT<.45&&WILD.happy>0&&!WILD.dance){const u=WILD.happyT/.45;ctx.save();ctx.globalAlpha=(1-u)*.9;ctx.strokeStyle='#ffd0f4';ctx.lineWidth=2+3*(1-u);uiRound(x0+20-6*u,y-10-6*u,104+12*u,20+12*u,9+3*u,null,ctx.strokeStyle,ctx.lineWidth);ctx.restore();}
 const D=PGU.dHint;if(D&&WILD.phase==='play'){const a=Math.min(1,D.t/.25,(4-D.t)/.4);if(a>0){ctx.save();ctx.globalAlpha=a;const bw=236,bx=W-8-bw,by=y+16;
  uiRound(bx,by,bw,30,12,'rgba(40,12,52,.95)','#ff9ad8',1.5);ctx.fillStyle='rgba(40,12,52,.95)';ctx.beginPath();ctx.moveTo(x0+60,by-7);ctx.lineTo(x0+52,by+1);ctx.lineTo(x0+68,by+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffe0f4';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Prizes fill it. Full = Dance break!',bx+bw/2,by+15,bw-14);ctx.restore();}}};
const __abDanceFill=danceFill;
danceFill=function(n,x){const h0=WILD.happy;const r=__abDanceFill(n,x);
 if(PG&&!PG_HOME_OFF&&h0===0&&WILD.happy>0){let seen=false;try{seen=!!localStorage.getItem(PG_DHINT_KEY);}catch(e){}if(!seen){PGU.dHint={t:0};try{localStorage.setItem(PG_DHINT_KEY,'1');}catch(e){}}}return r;};
const __abUpd56=update;update=function(dt){__abUpd56(dt);if(PGU&&PGU.dHint){PGU.dHint.t+=dt;if(PGU.dHint.t>4)PGU.dHint=null;}};
// 4. "Level" is the board number in sequence (GAMEPLAY_MAP section 14): rounds won so far + 1, counted from UAT 56 on.
//    (The XP badge in the top bar stays until the progression ticket replaces it.)
function pgBoardLevel(){return (PG&&PG.passed|0)+1;}
const __abRoundEnd=pgRoundEnd;pgRoundEnd=function(win){const done=WILD.pgDone;__abRoundEnd(win);if(!done&&win&&PG&&!PG_HOME_OFF){PG.passed=(PG.passed|0)+1;pgSave();}};
// 5. Developer: the title coin rain (1-4), replay the title, show the Dance meter hint again
const __abDevHtml56=pgDevHtml;
pgDevHtml=function(){const h=__abDevHtml56(),b='min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;padding:0 10px',
  names=['','1 faster','2 faster, coin edge','3 fountain','4 pile-up'];
 const rows='<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Title coins</span><button id="pg-tc" style="'+b+'">'+names[PG_TC]+'</button></div>'
  +'<button id="pg-title" class="wide">Show the title screen again</button><button id="pg-dhint" class="wide">Show the Dance meter hint again</button>';
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __abDevBind56=wildDevBind;
wildDevBind=function(panel){__abDevBind56(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const tc=box.querySelector('#pg-tc');if(tc)tc.onclick=()=>{PG_TC=PG_TC%4+1;try{localStorage.setItem(PG_TC_KEY,String(PG_TC));}catch(e){}try{diagEvent('progress-tuning','titlecoins='+PG_TC);}catch(e){}re();};
 const tl=box.querySelector('#pg-title');if(tl)tl.onclick=()=>{panel.style.display='none';PGU.title={t:0,coins:[],snd:0};PGU.screen='title';};
 const dh=box.querySelector('#pg-dhint');if(dh)dh.onclick=()=>{try{localStorage.removeItem(PG_DHINT_KEY);}catch(e){}pgToast('The hint shows the next time the meter fills','#ffd0f4');re();};};
'''
