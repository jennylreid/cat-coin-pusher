// ---------- CP-72 add-on (UAT 94; Jenny, Nov 18: "we have a similar problem to formal inspection with the words Zoomies
// getting in the way of the actual animation. So I'd like to have the announcement of what's coming, or the title, and then
// the animation without words over top of it.") ----------
// Zoomies now opens with the big centred "ZOOMIES!" alone (1.2 s, drawn like the old callout: same place, size, pop, tilt,
// outline and fade). Zoomies itself (turbo rev, double-speed pusher, the kittens) starts 1.25 s after the tap, once the word
// has gone, on its own unchanged clock. While Zoomies plays no words show over it: other callouts wait and show after it,
// and "2× PUSHER" is no longer drawn (the pusher's gold streaks and glow still show the speed). The random draws the
// callout made are kept at the tap, so the game's randomness runs as before.
const Z72T={intro:1.2,lead:1.25};
let Z72W=null; // the title showing: {word,color,rot,x,bam}
function z72Big(word,color,d){Z72W={word:String(word).toUpperCase(),color,rot:d.rot,x:d.x,bam:false};}
function z72Holding(){return !!(PGPX&&PGPX.id==='zoomies72');}
function z72BigT(){const X=PGPX,c=Z72W;if(!c||!z72Holding())return -1;return X.t<Z72T.intro?X.t:-1;}
function z72DrawBig(){const c=Z72W,t=z72BigT();if(t<0)return;const dur=Z72T.intro;
 const pop=t<0.16?0.3+t/0.16*0.95:t<0.3?1.25-(t-0.16)/0.14*0.25:1+Math.sin(t*9)*0.015;
 ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(dur-t)*3));
 ctx.translate(c.x,Math.max(VIEW.y+350*VIEW.zy,VIEW.y+215*VIEW.zy+130));ctx.rotate(c.rot);ctx.scale(pop,pop);
 const lines=calloutLines(c.word),font=px=>`italic 900 ${px}px Impact, "Arial Black", system-ui`;
 ctx.font=font(64);const widest=Math.max(...lines.map(l=>ctx.measureText(l).width)),size=Math.min(64,64*290/widest),lh=size*1.02,th=lh*lines.length;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.font=font(size);
 lines.forEach((l,i)=>{const y=-th/2+lh*(i+0.5);ctx.lineWidth=Math.max(7,size/5);ctx.strokeStyle='#111';ctx.strokeText(l,0,y);
  ctx.fillStyle=c.color;ctx.fillText(l,0,y);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillText(l,-2,y-3);});
 ctx.restore();}
const __z72tDraw=drawCallout;drawCallout=function(){if(z72Holding())return z72DrawBig();return __z72tDraw();};
const __z72tTick=calloutTick;calloutTick=function(dt){if(z72Holding()){const c=Z72W;if(c&&z72BigT()>=0&&!c.bam){c.bam=true;try{sfx.bam();}catch(e){}try{navigator.vibrate&&navigator.vibrate(45);}catch(e){}}return;}return __z72tTick(dt);};
const __z72tEnd=pgpEnd;pgpEnd=function(){const X=PGPX;__z72tEnd();if(X&&X.id==='zoomies72')Z72W=null;};
// the title is part of Zoomies (as Zoomies itself is a side game for earning and readiness)
const __z72tSide=pgpSideGame;pgpSideGame=function(){return __z72tSide()||z72Holding();};
// ---------- end CP-72 add-on ----------
