
// ---------- CP-63 PROTOTYPE (Jenny, Nov 15/17): the Tuxedo's power becomes Formal inspection ----------
// A monocle drops onto the cat's eye; the cat inspects the board and the most valuable pieces light up one by one
// (goal prizes, other prizes, Quake coins, Rain coins, then plain coins lying on top of the pile). Then one big mitt
// lays a cane across the board behind them and sweeps forward: the highlighted pieces are carried to the front edge
// and over it, toward the player. The bottom layer of coins is never picked (only pieces lying on top, and prizes),
// so no hole is left where drops can't reach. The game keeps running at full speed throughout.
// Approved art is only moved: head, pupils, big mitts. Stand-ins drawn in code: the monocle, its chain, the cane,
// the gold highlight rings, the inspection lens and the power-button icon.
const CP63={ // timing (s); every beat is here so it can be tuned
 monoIn:.45, look0:.55, look1:1.95, caneIn:1.95, sweep0:2.45, sweep1:3.55, home:4.05, monoOut:3.9, end:4.4,
 max:5, maxPrizes:2, // how many pieces get inspected, and how many of them may be prizes
 topOnly:true, // coins must lie on top of the pile (the bottom layer stays); prizes always count
 offEdge:true, // the cane carries them over the front edge (false: it stops just short)
 words:['HMM.','SPLENDID.'],
 stats:{runs:0,picked:[],paid:[],lostSide:[],anyFront:0,anySide:0}};
let CP63X=null; // the inspection in progress
function cp63E(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function cp63Goal(id){return typeof WILD_COLLECTION!=='undefined'&&WILD_COLLECTION.includes(id)&&!WILD.have[id];}
function cp63Value(b){if(b.kind==='item')return cp63Goal(b.id)?100:60;if(b.kind==='quake')return 40;if(RAIN[b.kind])return RAIN[b.kind].n;return VALUE[b.kind]||1;}
function cp63Half(b){return typeof b.half==='number'?b.half:halfOf(b.kind);}
function cp63R(b){return b.kind==='item'?ITEM_R:RAIN[b.kind]?RAIN[b.kind].r:b.kind==='quake'?COIN_R*1.15:COIN_R;}
// The most valuable pieces on the table: worth most first, then nearest the front.
function cp63Pick(){const c=[];
 for(const b of bodies){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
  if(z<PUSH_MAX+20||z>T.FRONT-10||y<-3||Math.abs(x-200)>tableHalfAt(z)-6)continue;
  if(CP63.topOnly&&b.kind!=='item'&&y-cp63Half(b)<COIN_HALF*1.5)continue; // part of the bottom layer: stays
  c.push({b,v:cp63Value(b),z});}
 c.sort((a,b)=>b.v-a.v||b.z-a.z);const r=[];let pz=0;
 for(const o of c){if(r.length>=CP63.max)break;if(o.b.kind==='item'){if(pz>=CP63.maxPrizes)continue;pz++;}r.push(o.b);}return r;}
function cp63Start(){
 stopTickle();stopPawDance();pawDanceToken++;pawDance={started:time,silent:true,index:0,switched:true,anchor:0,cp63:true};happyUntil=0;
 const picks=cp63Pick().map((b,i)=>{const o={b,id:b.id||b.kind,kind:b.kind,v:cp63Value(b),i,lit:null,on:false,done:false};cp63Screen(o);return o;}); // where each is now (kept if it leaves early)
 // the order the lens visits them: back to front, so the cane follows the eye
 const tour=picks.slice().sort((a,b)=>a.b.rb.translation().z-b.b.rb.translation().z);
 const zs=picks.map(p=>p.b.rb.translation().z/M);
 CP63X={t:0,picks,tour,z0:Math.max(PUSH_MAX+10,(zs.length?Math.min(...zs):520)-55),fx:{},eye:null,lens:null,cane:null};
 CP63.stats.runs++;CP63.stats.picked.push(picks.map(p=>p.id));
 pgSfx('clink',1);try{diagEvent('powers','cp63 inspect '+picks.map(p=>p.id).join(','));}catch(e){}}
function cp63Screen(o){if(!o.b.dead){const p=o.b.rb.translation();o.at=skyScreen(p.x/M,p.z/M,p.y/M);}return o.at;}
// The lens: from piece to piece in tour order during the look.
function cp63LensAt(t){const X=CP63X,n=X.tour.length;if(!n)return null;const u=(t-CP63.look0)/(CP63.look1-CP63.look0);if(u<0||u>1.02)return null;
 const k=Math.min(n-1e-6,Math.max(0,u*n)),i=Math.floor(k),f=k-i,a=cp63Screen(X.tour[i]),b=i>0?cp63Screen(X.tour[i-1]):{x:200,y:a.y-80,s:a.s};
 const m=cp63E(f/.45);return {x:b.x+(a.x-b.x)*m,y:b.y+(a.y-b.y)*m,s:b.s+(a.s-b.s)*m,i,arrived:f>=.45};}
// The cane's depth (table units) at time t.
function cp63CaneZ(t){const X=CP63X,z1=CP63.offEdge?T.FRONT+18:T.FRONT-80;
 if(t<CP63.sweep0)return X.z0;const u=(t-CP63.sweep0)/(CP63.sweep1-CP63.sweep0);return X.z0+(z1-X.z0)*(u<1?u*u*(3-2*u)*.35+u*.65:1);}
function cp63CaneSpan(z){const hw=tableHalfAt(Math.min(T.FRONT,z));return {xl:200-hw+16,xr:200+hw-10};}
function cp63CaneVis(t){if(t<CP63.caneIn||t>CP63.home+.1)return 0;return Math.min(1,(t-CP63.caneIn)/.35,(CP63.home+.1-t)/.3);}
// The crook end (screen), where the right mitt holds the cane.
function cp63Crook(t){const z=cp63CaneZ(t),sp=cp63CaneSpan(z),p=skyScreen(sp.xr,Math.min(z,T.FRONT+30),14);return p;}
// --- the mitts and head (approved art, moved only) ---
function cp63Rest(side){return {x:200+side*135,y:VIEW.y+180*VIEW.zy+45};}
function cp63Mitt(side,t){const R=cp63Rest(side);
 if(side<0){ // the left mitt: a small lift while inspecting (kept clear of the monocle), then back
  const k=cp63E((t-.35)/.4)*(1-cp63E((t-CP63.caneIn)/.4));return {x:R.x+14*k,y:R.y-12*k,r:.16*k};}
 const C=cp63Crook(t),H={x:C.x-6,y:C.y-30,r:-.25};
 if(t<CP63.caneIn)return {x:R.x,y:R.y,r:0};
 if(t<CP63.sweep0){const k=cp63E((t-CP63.caneIn)/(CP63.sweep0-CP63.caneIn));return {x:R.x+(H.x-R.x)*k+30*Math.sin(Math.PI*k),y:R.y+(H.y-R.y)*k,r:H.r*k};}
 if(t<CP63.sweep1+.08)return H;
 const k=cp63E((t-CP63.sweep1-.08)/(CP63.home-CP63.sweep1-.08));return {x:H.x+(R.x-H.x)*k,y:H.y+(R.y-H.y)*k,r:H.r*(1-k)};}
const __cp63PawMotion=pawMotion;
pawMotion=function(side=0){const X=CP63X;if(!X||!pawDance||!pawDance.cp63)return __cp63PawMotion(side);const t=X.t;
 if(!side){const L=cp63LensAt(t),lean=cp63E((t-.3)/.3)*(1-cp63E((t-CP63.look1)/.3));const dx=L?Math.max(-1,Math.min(1,(L.x-200)/150)):0;
  return {x:3*dx*lean,y:5*lean,r:.04*dx*lean};}
 const P=cp63Mitt(side,t),R=cp63Rest(side);return {x:P.x-R.x,y:P.y-R.y,r:P.r};};
const __cp63PawGaze=pawGaze;
pawGaze=function(){const X=CP63X;if(!X)return __cp63PawGaze();const t=X.t;let tx=null;
 const L=cp63LensAt(t);if(L)tx=L.x;else if(t>=CP63.caneIn&&t<CP63.sweep1+.2){const c=cp63Crook(t);tx=200+(c.x-200)*.4;}
 if(tx==null)return null;return {x:Math.max(-1.6,Math.min(1.6,(tx-200)/110)),y:.35};};
// The monocle (stand-in, drawn in code) on the cat's left-of-screen eye, in head-art pixels like the pupils.
function cp63Monocle(){const X=CP63X,t=X.t;
 const inK=Math.min(1,t/CP63.monoIn),drop=t<CP63.monoIn?(1-inK)*-70+Math.sin(inK*Math.PI)*-8:0,bounce=t>=CP63.monoIn&&t<CP63.monoIn+.25?Math.sin((t-CP63.monoIn)/.25*Math.PI)*3:0;
 const out=t>CP63.monoOut?(t-CP63.monoOut)/(CP63.end-CP63.monoOut):0;if(out>=1)return;
 const sx=420/(ART.head.pgW||ART.head.width),sy=240/(ART.head.pgH||ART.head.height),e={x:500,y:515,rx:118,ry:108};
 const cx=-10+e.x*sx,cy=-25+e.y*sy+drop+bounce+out*out*90,rx=e.rx*sx*1.18,ry=e.ry*sy*1.22;
 try{const m=ctx.getTransform(),k=scale*renderPixelRatio,p=m.transformPoint({x:cx,y:cy});X.eye={x:p.x/k,y:p.y/k};}catch(e){}
 ctx.save();ctx.globalAlpha=Math.min(1,t/.12)*(1-out);ctx.translate(cx,cy);ctx.rotate(out*1.4);
 // the chain: hangs from the ring down and out over the cheek
 ctx.strokeStyle='#e8c35a';ctx.lineWidth=1.6;ctx.setLineDash([2.2,1.6]);ctx.beginPath();ctx.moveTo(-rx*.7,ry*.7);ctx.quadraticCurveTo(-rx*1.3,ry*2.6,-rx*2.1,ry*2.2);ctx.stroke();ctx.setLineDash([]);
 // glass, ring, glint
 ctx.fillStyle='rgba(205,235,255,.22)';ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.fill();
 ctx.lineWidth=4.2;ctx.strokeStyle='#5a3d08';ctx.stroke();ctx.lineWidth=2.6;ctx.strokeStyle='#f3cf63';ctx.stroke();
 ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(0,0,rx*.72,ry*.72,0,3.6,4.5);ctx.stroke();
 const gl=t>CP63.monoIn&&t<CP63.monoIn+.35?(t-CP63.monoIn)/.35:-1; // a glint sweeps across as it settles
 if(gl>=0){ctx.save();ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.clip();ctx.fillStyle='rgba(255,255,255,.55)';ctx.translate(-rx*1.5+gl*rx*3,0);ctx.rotate(.5);ctx.fillRect(-3,-ry*2,6,ry*4);ctx.restore();}
 ctx.restore();}
const __cp63Pupils=drawTrackingPupils;
drawTrackingPupils=function(){__cp63Pupils();if(CP63X)cp63Monocle();};
// --- on the board: the highlight rings, the lens beam and the cane, drawn under the mitts ---
function cp63Ring(p,r,a,pulse){const rx=r*p.s*1.15,ry=rx*.66;ctx.save();ctx.globalAlpha=a;
 ctx.fillStyle='rgba(255,215,80,.22)';ctx.beginPath();ctx.ellipse(p.x,p.y,rx*(1+.06*pulse),ry*(1+.06*pulse),0,0,7);ctx.fill();
 ctx.shadowColor='#ffd23f';ctx.shadowBlur=20;ctx.strokeStyle='#ffd84a';ctx.lineWidth=4.5;ctx.stroke();
 ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
function cp63Spark(x,y,s,a){ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#fffbe0';ctx.translate(x,y);ctx.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.28:s;ctx.lineTo(Math.cos(i*Math.PI/4)*r,Math.sin(i*Math.PI/4)*r);}ctx.closePath();ctx.fill();ctx.restore();}
function cp63DrawCane(t){const a=cp63CaneVis(t);if(a<=0)return;const z=Math.min(cp63CaneZ(t),T.FRONT+30),sp=cp63CaneSpan(z);
 const slide=cp63E((t-CP63.caneIn)/.35),xl=sp.xr-(sp.xr-sp.xl)*slide,A=skyScreen(xl,z,14),B=skyScreen(sp.xr,z,14),w=9.5*B.s;
 ctx.save();ctx.globalAlpha=a;ctx.lineCap='round';
 ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=w*1.1;ctx.beginPath();ctx.moveTo(A.x,A.y+9*B.s);ctx.lineTo(B.x,B.y+9*B.s);ctx.stroke(); // shadow on the coins
 // shaft, then the crook curling up at the right end (into the mitt)
 const hook=new Path2D();hook.moveTo(A.x,A.y);hook.lineTo(B.x,B.y);hook.quadraticCurveTo(B.x+20*B.s,B.y-2*B.s,B.x+18*B.s,B.y-22*B.s);hook.quadraticCurveTo(B.x+14*B.s,B.y-40*B.s,B.x-4*B.s,B.y-34*B.s);
 ctx.strokeStyle='#120c16';ctx.lineWidth=w;ctx.stroke(hook);ctx.strokeStyle='rgba(150,130,190,.55)';ctx.lineWidth=w*.28;ctx.translate(0,-w*.22);ctx.stroke(hook);ctx.translate(0,w*.22);
 // gold collar near the crook and a silver tip at the far end
 ctx.strokeStyle='#e8c35a';ctx.lineWidth=w*1.15;ctx.lineCap='butt';const cx=B.x-(B.x-A.x)*.06,cy=B.y-(B.y-A.y)*.06;ctx.beginPath();ctx.moveTo(cx-4*B.s,cy);ctx.lineTo(cx+4*B.s,cy);ctx.stroke();
 if(slide>.9){ctx.strokeStyle='#d8dde6';ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(A.x+8*A.s,A.y);ctx.stroke();}
 ctx.restore();}
function cp63DrawBoard(){const X=CP63X;if(!X)return;const t=X.t;
 const fade=1-cp63E((t-CP63.sweep1)/.5);
 // the inspection beam from the monocle to the lens
 const L=cp63LensAt(t);
 if(L&&X.eye){const r=34*L.s;ctx.save();const g=ctx.createLinearGradient(X.eye.x,X.eye.y,L.x,L.y);g.addColorStop(0,'rgba(255,230,140,.0)');g.addColorStop(1,'rgba(255,230,140,.5)');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(X.eye.x-6,X.eye.y);ctx.lineTo(L.x-r,L.y);ctx.lineTo(L.x+r,L.y);ctx.lineTo(X.eye.x+6,X.eye.y);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(225,245,255,.25)';ctx.strokeStyle='#ffe27a';ctx.lineWidth=3.5;ctx.shadowColor='#ffd23f';ctx.shadowBlur=12;ctx.beginPath();ctx.ellipse(L.x,L.y,r,r*.7,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}
 for(const o of X.picks){if(o.lit==null||o.done)continue;const p=cp63Screen(o);const u=t-o.lit,pulse=Math.sin(u*9);
  cp63Ring(p,cp63R(o.b),Math.min(1,u/.12)*fade,pulse);if(u<.35)cp63Spark(p.x+14*p.s,p.y-22*p.s,10*p.s*(1-u/.35)+3,1-u/.35);}
 cp63DrawCane(t);}
const __cp63DrawPaws=drawPaws;
drawPaws=function(){if(CP63X){ctx.save();try{cp63DrawBoard();}finally{ctx.restore();}}return __cp63DrawPaws();};
// --- the clock (runs inside the power's own tick, so pause/Home stop it) ---
function cp63Tick(t){const X=CP63X;if(!X)return;X.t=t;happyUntil=0;const fx=X.fx;
 if(t>=CP63.monoIn&&!fx.on){fx.on=1;pgSfx('ding',.6);}
 if(t>=CP63.look0&&!fx.hmm){fx.hmm=1;callout(CP63.words[0],{color:'#ffe27a',dur:1});}
 const L=cp63LensAt(t);if(L&&L.arrived){const o=X.tour[L.i];if(o.lit==null){o.lit=t;pgSfx('ding',.55+.1*L.i);}}
 if(t>=CP63.look1&&!fx.all){fx.all=1;for(const o of X.tour)if(o.lit==null)o.lit=t;}
 if(t>=CP63.caneIn&&!fx.cane){fx.cane=1;try{sfx.paw40('whoosh',1);}catch(e){}}
 if(t>=CP63.sweep0&&!fx.sweep){fx.sweep=1;try{sfx.paw40('swipe',1);}catch(e){}}
 if(t>=CP63.sweep0+.5&&!fx.word){fx.word=1;if(X.picks.length)callout(CP63.words[1],{color:'#ffe27a',dur:1.1});}
 if(t>=CP63.monoOut&&!fx.off){fx.off=1;pgSfx('flip',.7);}
 // the sweep: a highlighted piece the cane reaches is carried forward with it (and steered toward the tray's width)
 if(t>=CP63.sweep0&&t<CP63.sweep1+.25){const z=cp63CaneZ(t),zn=cp63CaneZ(t+1/60),vz=Math.max(2.2,(zn-z)*60*M*1.08);
  for(const o of X.picks){const b=o.b;if(o.done)continue;if(b.dead){o.done=true;continue;}const p=b.rb.translation(),x=p.x/M,pz=p.z/M;
   if(pz>T.FRONT+4){o.done=true;continue;}
   if(!o.on){if(z<pz-cp63R(b)-4)continue;o.on=true;}
   if(t>=CP63.sweep1&&!CP63.offEdge)continue;
   const v=b.rb.linvel(),keep=Math.max(PAY_L+28,Math.min(PAY_R-28,x)),vx=(keep-x)*.06+v.x*.4;
   b.rb.wakeUp();b.rb.setLinvel({x:vx,y:Math.max(v.y,.35),z:Math.max(v.z,vz)},true);}}
 if(!CP63.offEdge&&t>=CP63.sweep1&&!fx.stop){fx.stop=1;for(const o of X.picks){if(!o.on||o.done||o.b.dead)continue;const v=o.b.rb.linvel();o.b.rb.setLinvel({x:v.x*.3,y:v.y,z:Math.min(v.z,.2)},true);}}
 if(t>=CP63.end){cp63Stop();}}
function cp63Stop(){if(!CP63X)return;CP63X=null;if(pawDance&&pawDance.cp63)stopPawDance();}
// --- the power: the Tuxedo's button now plays Formal inspection ---
PGP.tuxedo={id:'inspect',name:'FORMAL INSPECTION',col:'#ffd76a'};
const __cp63Icon=pgpIcon;
pgpIcon=function(id,x,y,k,c){if(id!=='inspect')return __cp63Icon(id,x,y,k,c);ctx.save();ctx.translate(x,y);ctx.scale(k,k);
 ctx.strokeStyle=c;ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(-2,-2,8,0,7);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();
 ctx.lineWidth=1.4;ctx.setLineDash([2,1.5]);ctx.beginPath();ctx.moveTo(4,4);ctx.quadraticCurveTo(10,10,7,15);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-2,-2,5,3.6,4.6);ctx.stroke();ctx.restore();};
const __cp63How=pgpHow;pgpHow=function(cat){return __cp63How(cat);};
const __cp63Use=pgpUse;
pgpUse=function(){const cat=pgpCat(),P=PGP[cat];if(P.id!=='inspect')return __cp63Use();
 PG.powers[cat]=pgpCount(cat)-1;pgSave();stopDrops();try{diagEvent('powers','use '+P.id+' left='+PG.powers[cat]+' level='+pglSel());}catch(e){}
 callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}
 cp63Start();PGPX={id:'inspect',t:0,dur:CP63.end};};
const __cp63PgpTick=pgpTick;
pgpTick=function(dt){const was=PGPX&&PGPX.id==='inspect'?PGPX:null;__cp63PgpTick(dt);if(was)cp63Tick(was.t);};
const __cp63PgpEnd=pgpEnd;pgpEnd=function(){const X=PGPX;__cp63PgpEnd();if(X&&X.id==='inspect')cp63Stop();};
// counts as busy while it plays (no second power; a power earned meanwhile is awarded after)
const __cp63SideGame=pgpSideGame;pgpSideGame=function(){return __cp63SideGame()||!!CP63X;};
// what happened to the picked pieces (for the report): paid over the front, or lost over a side
const __cp63Fall=typeof fallOff==='function'?fallOff:null;
if(__cp63Fall){fallOff=function(b,...a){const X=CP63X;if(X&&!b.dead){const q=b.rb.translation();if(Math.abs(q.x/M-200)>(T.R-T.L)/2-2&&q.z/M<T.FRONT-4)CP63.stats.anySide++;else if(q.z/M>=T.FRONT-30)CP63.stats.anyFront++;}
 if(X&&X.picks.some(o=>o.b===b)){const q=b.rb.translation(),x=q.x/M,side=Math.abs(x-200)>(T.R-T.L)/2-2&&q.z/M<T.FRONT-4;(side?CP63.stats.lostSide:CP63.stats.paid).push(b.id||b.kind);}return __cp63Fall(b,...a);};}
// ---------- end CP-63 prototype ----------
