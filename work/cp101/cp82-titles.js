// ---------- CP-82 Power titles first (UAT 101; Jenny, Nov 18: "For all the powers, the rule should be the words appear
// before the action is taken, because signs like meow and tortitude, in order to see them clearly, you want the words out of
// the way. Hug, it probably doesn't matter as much.") ----------
// Sonic meow (Siamese) and Tortitude (Tortie) now open the way Formal inspection (CP-73) and Zoomies (CP-72) do: the big
// centred name alone (1.2 s, drawn like the old callout: same place, size, pop, tilt, outline and fade), then the action
// 1.25 s after the tap, once the name has gone. The action is the same as before, started the same way (sounds, shake,
// rings, 2x reach for 5 s; flames, flash, shove, confetti); only "2x REACH" is no longer drawn over Sonic meow's rings.
// While the power plays (title and action) other callouts wait and show after it. The callout's two random draws are made
// at the tap, as before.
const CP82={intro:1.2,lead:1.25,ids:['sonic','tortitude']};
let CP82W=null; // the title showing: {word,color,rot,x,bam}
// each power's action, exactly as pgpUse started it before (build.py checks these lines against UAT 100's pgpUse)
const CP82A={
 sonic(){PGPX={id:'sonic',t:0,dur:5,next:0};shake=Math.max(shake,1.2);pgSfx('meow',1.6);try{sfx.wild('topple',1);}catch(e){}return;},
 tortitude(){PGPX={id:'tortitude',t:0,dur:1.6,flames:[]};let n=0;
  for(const b of bodies){if(b.dead||b.kind==='stack')continue;const q=b.rb.translation(),z=q.z/M,x=q.x/M;if(z<PUSH_MAX||z>T.FRONT-40||Math.abs(x-200)>150)continue;
   const k=(b.kind==='coin'||b.kind==='silver'?1:b.kind==='item'?.7:.85)*b.rb.mass()*(1.6+((z-PUSH_MAX)/(T.FRONT-PUSH_MAX))*.8);b.rb.wakeUp();b.rb.applyImpulse({x:(x-200)*.002*k,y:.9*k,z:2.6*k},true);n++;}
  for(let i=0;i<46;i++)PGPX.flames.push({x:rand(60,340),z:rand(360,T.FRONT-60),t:-rand(0,.5),s:rand(.7,1.4)});
  shake=Math.max(shake,1);try{sfx.dance('roar',1);}catch(e){}try{sfx.wild('topple',1);}catch(e){}try{wildConfetti(24);}catch(e){}WILD.pgpShoved=n;return;}};
function cp82Holding(){return !!(PGPX&&(PGPX.id==='cp82title'||CP82.ids.includes(PGPX.id)));}
function cp82BigT(){const X=PGPX;if(!CP82W||!X||X.id!=='cp82title')return -1;return X.t<CP82.intro?X.t:-1;}
function cp82DrawBig(){const c=CP82W,t=cp82BigT();if(t<0)return;const dur=CP82.intro;
 const pop=t<0.16?0.3+t/0.16*0.95:t<0.3?1.25-(t-0.16)/0.14*0.25:1+Math.sin(t*9)*0.015;
 ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(dur-t)*3));
 ctx.translate(c.x,Math.max(VIEW.y+350*VIEW.zy,VIEW.y+215*VIEW.zy+130));ctx.rotate(c.rot);ctx.scale(pop,pop);
 const lines=calloutLines(c.word),font=px=>`italic 900 ${px}px Impact, "Arial Black", system-ui`;
 ctx.font=font(64);const widest=Math.max(...lines.map(l=>ctx.measureText(l).width)),size=Math.min(64,64*290/widest),lh=size*1.02,th=lh*lines.length;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.font=font(size);
 lines.forEach((l,i)=>{const y=-th/2+lh*(i+0.5);ctx.lineWidth=Math.max(7,size/5);ctx.strokeStyle='#111';ctx.strokeText(l,0,y);
  ctx.fillStyle=c.color;ctx.fillText(l,0,y);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillText(l,-2,y-3);});
 ctx.restore();}
// the tap: the title alone; the action waits
const __cp82Use=pgpUse;
pgpUse=function(){const cat=pgpCat(),P=PGP[cat];if(!CP82.ids.includes(P.id))return __cp82Use();
 PG.powers[cat]=pgpCount(cat)-1;pgSave();stopDrops();try{diagEvent('powers','use '+P.id+' left='+PG.powers[cat]+' level='+pglSel());}catch(e){}
 const d=cp73Draws();CP82W={word:String(P.name+'!').toUpperCase(),color:P.col,rot:d.rot,x:d.x,bam:false};try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}
 PGPX={id:'cp82title',power:P.id,t:0,dur:1e9};};
// after the lead the action starts, on its own clock (the time past the lead carried over)
const __cp82Tick=pgpTick;
pgpTick=function(dt){const X=PGPX;const r=__cp82Tick(dt);
 if(X&&PGPX===X&&X.id==='cp82title'&&X.t>=CP82.lead){PGPX=null;CP82W=null;CP82A[X.power]();if(PGPX)PGPX.t=X.t-CP82.lead;}return r;};
// a round ending (or the board closing) during the title ends the power there, with no action
const __cp82End=pgpEnd;pgpEnd=function(){const X=PGPX;if(X&&X.id==='cp82title'){PGPX=null;CP82W=null;return;}return __cp82End();};
// no words over the action: other callouts wait until the power has ended
const __cp82Draw=drawCallout;drawCallout=function(){if(cp82Holding())return cp82DrawBig();return __cp82Draw();};
const __cp82CTick=calloutTick;calloutTick=function(dt){if(cp82Holding()){const c=CP82W;if(c&&cp82BigT()>=0&&!c.bam){c.bam=true;try{sfx.bam();}catch(e){}try{navigator.vibrate&&navigator.vibrate(45);}catch(e){}}return;}return __cp82CTick(dt);};
// the title is part of the power (nothing else starts under it)
const __cp82Side=pgpSideGame;pgpSideGame=function(){return __cp82Side()||!!(PGPX&&PGPX.id==='cp82title');};
// ---------- end CP-82 ----------
