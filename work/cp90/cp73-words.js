// ---------- CP-73 (Jenny, Nov 17; UAT 90): Formal inspection's words stay out of the beam ----------
// "FORMAL INSPECTION!", "HMM." and "SPLENDID." no longer use the big callout over the board (which also queued behind
// other callouts and could land on the beam). They show small and brief in the band above the cat's head (the goal-row
// band the hat already covers), same lettering and colour, same pop sound and buzz. "FORMAL INSPECTION!" lasts 0.5 s,
// gone before the lens starts (CP63.look0 = 0.55 s). Formal inspection's behaviour, timing, art and sounds are unchanged.
const CP73={dur:{intro:.5,hmm:1,splendid:1.1},msgs:[]};
function cp73Say(word,color,dur){rand(-0.12,0.12);rand(-10,10); // the two random draws callout() made, so the game's randomness stays as in UAT 89
 CP73.msgs.length=0;CP73.msgs.push({word:String(word).toUpperCase(),color,dur,t0:time});
 try{sfx.bam();}catch(e){}try{navigator.vibrate&&navigator.vibrate(45);}catch(e){}}
function cp73Band(){const R=cp50RowLayout();return {cy:R.cy,h:Math.max(18,R.D)};}
function cp73Draw(){const c=CP73.msgs[0];if(!c)return;const t=time-c.t0;if(t<0||t>=c.dur){if(t>=c.dur)CP73.msgs.shift();return;}
 const B=cp73Band(),font=px=>`italic 900 ${px}px Impact, "Arial Black", system-ui`,pop=t<.1?.6+t/.1*.5:t<.2?1.1-(t-.1):1;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=Math.max(0,Math.min(1,(c.dur-t)*6,t*12));
 ctx.font=font(40);const w=ctx.measureText(c.word).width,size=Math.min(B.h*.8,28,40*250/w);
 ctx.translate(200,B.cy);ctx.scale(pop,pop);ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.font=font(size);
 ctx.lineWidth=Math.max(4,size/5);ctx.strokeStyle='#111';ctx.strokeText(c.word,0,0);ctx.fillStyle=c.color;ctx.fillText(c.word,0,0);
 ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillText(c.word,-1,-2);ctx.restore();}
const __cp73Callout=drawCallout;drawCallout=function(){__cp73Callout();try{cp73Draw();}catch(e){}};
// ---------- end CP-73 ----------
