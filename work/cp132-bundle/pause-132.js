// ---- UAT 132: no END ROUND on the endless board's pause menu (Jenny, Nov 20: it does nothing there; there are no rounds) ----
// On the endless board the pause card loses END ROUND and its line ("Ends the round now...") and is 60 px shorter; RESUME,
// Sound, How to play and Home are unchanged. Goal boards and the timed levels keep END ROUND as before.
{const __p132R=cp51Rects;cp51Rects=function(){const R=__p132R.apply(this,arguments);if(!(typeof endActive==='function'&&endActive()))return R;
  R.card={...R.card,h:R.card.h-60};for(const k of ['sound','help','home'])R[k]={...R[k],y:R[k].y-60};R.finish={x:-9999,y:-9999,w:0,h:0};return R;};}
{const __p132D=cp51DrawPop;cp51DrawPop=function(){if(!(typeof endActive==='function'&&endActive())||CP51.view==='rules')return __p132D.apply(this,arguments);
  const wb=wildButtonDraw,ft=ctx.fillText;wildButtonDraw=function(r,label,...a){if(label==='END ROUND')return;return wb.call(this,r,label,...a);};
  ctx.fillText=function(t,...a){if(t==='Ends the round now. You keep your prizes and coins.')return;return ft.call(ctx,t,...a);};
  try{return __p132D.apply(this,arguments);}finally{wildButtonDraw=wb;ctx.fillText=ft;}};}
// Goal boards: END ROUND did nothing (found while checking this; also so on UAT 131). The goal counts as reached there
// (WILD_GOAL), so it asked for a win, and a goal board ignores a win it hasn't earned (only Collect boards take it). Now END ROUND
// on a goal board ends the round as not won (won if the board's own win was already on its way), and the Goal boards list comes
// back with the result, as when the drops run out.
{const __p132F=cp51Finish;cp51Finish=function(){if(!(typeof LAB==='object'&&LAB.on&&LAB.on()&&WILD.on))return __p132F.apply(this,arguments);
  cp51Resume('finish');wildFinish(false,'finish');};}
// ---- end UAT 132 pause menu ----
