// ---------- CP-73 rework (UAT 92; Jenny, Nov 18: "big 'FORMAL INSPECTION!' first, action starts only after it's gone;
// drop 'HMM.'; big 'SPLENDID.' after the sweep") ----------
// The words are big and centred again, in the lettering and place of the old callout (UAT 84-89). Formal inspection now
// opens with "FORMAL INSPECTION!" alone (1.2 s); the monocle, beam, highlights, cane and sweep run only after it has gone,
// on their own unchanged timeline, 1.25 s later. "HMM." is gone. "SPLENDID." shows once the sweep has finished. The power
// (and its locked button) lasts until "SPLENDID." has faded. The pieces are picked at the tap, as before; the random draws
// the words made are kept, at the same points of the power, so the game's randomness runs as before.
// While Formal inspection plays, other callouts (e.g. COIN RAIN) wait and show after it, so nothing covers its words, beam,
// highlights or cane.
const CP73B={intro:1.2,lead:1.25,splAt:CP63.sweep1+.15,splDur:1.1,pend:null};
let CP73W=null; // the big words showing: {word,color,dur,t0 (power time),rot,x,bam}
function cp73Total(){return CP73B.lead+Math.max(CP63.end,CP73B.splAt+CP73B.splDur);}
function cp73Draws(){return {rot:rand(-0.12,0.12),x:200+rand(-10,10)};} // the two random draws callout() made, in its order
function cp73Big(word,color,dur,t0,d){CP73W={word:String(word).toUpperCase(),color,dur,t0,rot:d.rot,x:d.x,bam:false};}
function cp73BigT(){const X=PGPX,c=CP73W;if(!c||!X||X.id!=='inspect')return -1;const t=X.t-c.t0;return t>=0&&t<c.dur?t:-1;}
function cp73BigOn(){return cp73BigT()>=0;}
// drawn exactly like the old callout (drawCallout): same place, size, pop, tilt, outline and fade
function cp73DrawBig(){const c=CP73W,t=cp73BigT();if(t<0)return;
 const pop=t<0.16?0.3+t/0.16*0.95:t<0.3?1.25-(t-0.16)/0.14*0.25:1+Math.sin(t*9)*0.015;
 ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(c.dur-t)*3));
 ctx.translate(c.x,Math.max(VIEW.y+350*VIEW.zy,VIEW.y+215*VIEW.zy+130));ctx.rotate(c.rot);ctx.scale(pop,pop);
 const lines=calloutLines(c.word),font=px=>`italic 900 ${px}px Impact, "Arial Black", system-ui`;
 ctx.font=font(64);const widest=Math.max(...lines.map(l=>ctx.measureText(l).width)),size=Math.min(64,64*290/widest),lh=size*1.02,th=lh*lines.length;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.font=font(size);
 lines.forEach((l,i)=>{const y=-th/2+lh*(i+0.5);ctx.lineWidth=Math.max(7,size/5);ctx.strokeStyle='#111';ctx.strokeText(l,0,y);
  ctx.fillStyle=c.color;ctx.fillText(l,0,y);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillText(l,-2,y-3);});
 ctx.restore();}
function cp73Holding(){return !!(PGPX&&PGPX.id==='inspect');}
const __cp73bDraw=drawCallout;drawCallout=function(){if(cp73Holding())return cp73DrawBig();return __cp73bDraw();};
// the words' pop and buzz play on the game tick (as the old callout's did), once per word
const __cp73bTick=calloutTick;calloutTick=function(dt){if(cp73Holding()){const c=CP73W;if(cp73BigOn()&&!c.bam){c.bam=true;try{sfx.bam();}catch(e){}try{navigator.vibrate&&navigator.vibrate(45);}catch(e){}}return;}return __cp73bTick(dt);};
const __cp73bEnd=pgpEnd;pgpEnd=function(){const X=PGPX;__cp73bEnd();if(X&&X.id==='inspect'){CP73W=null;CP73B.pend=null;}};
// Each cat's power in one plain line, shown in the cat picker under "<side game> · power: <name>" (Jenny, Nov 18: the
// cat's screen still said the Tuxedo's power was Yawn). Matches what each power does now (Zoomies after CP-72).
const CP73D={tuxedo:'A monocle spots the best pieces; the cane sweeps them forward.',
 orange:'Two kittens shove pieces off the front; the pusher runs double speed.',
 ragdoll:'Flops over the board and blocks both side gutters for 6 s.',
 siamese:'A big meow shakes the board; the pusher reaches twice as far.',
 tortie:'A fiery burst shoves a big group of coins forward.'};
// ---------- end CP-73 rework ----------
