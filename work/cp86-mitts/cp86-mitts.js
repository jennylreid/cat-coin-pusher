// ---------- CP-86 Sonic meow mitts: three options (Jenny, Nov 19: "I would like to see B and C, and also above the head, like
// the yawn pose. I think above the head is probably going to work best because it's approved art. But if we can get another
// good pose, I'm all for it. So try B and C as well.") ----------
// She passed the rest of Sonic meow (face, eyes, shake, timing): only the mitts change. During the meow the two approved mitts
// travel into one pose, hold it while the cat shakes, and travel back to rest before the face switches back:
//  head (default): raised beside the head, the wheel's Yawn stretch exactly (cp58Mitt's S: the rest place + side*48 across,
//        185 up, the same turn).
//  B: forward and out (this morning's mock-up B).  C: pointing forward (mock-up C).
// B and C are placed from the cat's own rest place (cp58Rest), so they sit the same on every screen size; the numbers are the
// mock-ups' at 412x915 (rest place there: x 65, y 356.6).
// No fades: the mitts are always drawn, never appear or vanish; they travel in over CP86M.up s from the meow's start and back
// over CP86M.down s, reaching rest as the face switches back (CP86.tail before the end), so the face still swaps on a still
// cat. The whole-cat shake stays on the mitts (the same shiver as before, stronger on each meow). The previous lunge-and-knead
// motion is replaced. The approved mitts are only moved and turned; drawing only: the mitts' resting colliders are not moved.
// Developer choice: Settings -> Developer -> Engineer tools -> "Sonic meow mitts" (saved on this phone,
// catpusher.uat.cp86mitts.v1). The pick is read when a meow starts, so a meow never switches pose halfway.
const CP86M=(()=>{const KEY='catpusher.uat.cp86mitts.v1',CHOICES=['head','B','C'],NAMES={head:'Above the head',B:'B: forward and out',C:'C: pointing forward'};
 let pick='head';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){}
 function set(k){if(!CHOICES.includes(k))return;pick=k;try{localStorage.setItem(KEY,k);}catch(e){}try{diagEvent('cp86','mitts='+k);}catch(e){}}
 return {KEY,CHOICES,NAMES,set,get(){return pick;},up:.6,down:.6,
  // a = the left mitt's turn as seen (the right one mirrors it); dx is outward from the cat's middle, dy down the screen
  POSE:{head:{dx:48,dy:-185,a:.43},B:{dx:13,dy:163.4,a:.35},C:{dx:-85,dy:203.4,a:-.35}},stats:{meows:{}}};})();
function cp86MPick(){const X=PGPX;if(!X)return CP86M.get();if(!X.cp86m){X.cp86m=CP86M.get();CP86M.stats.meows[X.cp86m]=(CP86M.stats.meows[X.cp86m]||0)+1;}return X.cp86m;}
function cp86MTarget(side){const P=CP86M.POSE[cp86MPick()]||CP86M.POSE.head,R=cp58Rest(side);return {x:R.x+side*P.dx,y:R.y+P.dy,a:P.a};}
// how far into the pose: eased in from the meow's start, eased back to rest by the face's switch
function cp86MWeight(){const X=PGPX;if(!X||X.id!=='sonic'||cp86K()<=0)return 0;const end=cp86End(X);
 return cp58Ease(X.t/CP86M.up)*cp58Ease((end-X.t)/CP86M.down);}
// path 'rest': the rest pose draws the mitt at cp58Rest + base (pawMotion), turned by d.r then mirrored and turned -.12;
// path 'wait': the idle mitts at mittRest, turned (through the drawMittArm hook) by r on the left and -r on the right.
// Both are given the same place and seen turn; base is that path's own resting place (pawMotion's offset or mittRest).
cp86MittOff=function(side,path,base){const P=cp86Pose();if(!P)return null;const {k,p,sh}=P,w=cp86MWeight(),T=cp86MTarget(side);
 const jx=k*side*sh*3*(.4+p),jr=k*sh*.03*(.3+p); // the shake (as before): stronger on each meow
 if(path==='rest'){const R=cp58Rest(side),m=base||{x:0,y:0,r:0};
  return {x:w*(T.x-(R.x+m.x))+jx,y:w*(T.y-(R.y+m.y)),r:-side*(w*(T.a+.12)+jr)};}
 const b=base||mittRest(side),v=w*T.a+jr;
 return {x:w*(T.x-b.x)+jx,y:w*(T.y-b.y),r:side<0?v:-v};};
// Above the head only: the idle mitts are normally drawn before the head (behind it), so a mitt raised beside the head would be
// hidden. While the meow face shows they are drawn after the head, where the rest pose and the wheel's Yawn draw them. The
// layer changes only on the face's own switch frames (in and out) and only where the idle mitts would be drawn anyway. B and C
// stay behind the head as in the mock-ups (they move down, away from it), so they never change layer.
function cp86MOnTop(){return cp86K()>0&&cp86MPick()==='head'&&sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose();}
// the pick is fixed on the meow's first update (before it is drawn), so a choice made during a meow waits for the next one
const __cp86MUpdate=update;update=function(){const r=__cp86MUpdate.apply(this,arguments);try{if(PGPX&&PGPX.id==='sonic')cp86MPick();}catch(e){}return r;};
// the choice in Engineer tools, under the sound choices
const __cp86MCredits=openCredits;
openCredits=function(){const r=__cp86MCredits.apply(this,arguments);try{
 const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp86-mitts'))return r;
 const box=document.createElement('div');box.id='cp86-mitts';const hd=document.createElement('h3');hd.textContent='Sonic meow mitts';box.appendChild(hd);
 const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.m===CP86M.get();b.textContent=(on?'✓ ':'')+CP86M.NAMES[b.dataset.m];b.style.fontWeight=on?'700':'400';});
 for(const k of CP86M.CHOICES){const b=document.createElement('button');b.dataset.m=k;b.style.margin='0 6px 6px 0';b.onclick=()=>{CP86M.set(k);paint();};btns.push(b);box.appendChild(b);}
 paint();const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}catch(e){}return r;};
// ---------- end CP-86 mitts ----------
