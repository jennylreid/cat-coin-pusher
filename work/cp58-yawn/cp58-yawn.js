
// ---------- CP-58 PROTOTYPE (Jenny, Nov 16): the Yawn, stretch, side-eye and grab ----------
// Replaces the old Yawn (paws sweeping coins off the sides). The cat yawns big (head back, eyes squeezed, mouth wide),
// stretches both mitts up and out with a shiver, then side-eyes away while one mitt drapes casually down onto the board
// and grabs the prize nearest the front (a goal prize first); the other mitt grabs a second one. Both are carried to the
// mouth and eaten (chomp, crumbs, Happy eyes). Coins are never touched, so no gap. A stolen goal prize drops back in.
// Approved art is only moved: head, faces, mitts, pupils, prize paintings. Placeholders drawn in code: the open yawn
// mouth, the squeezed-shut yawn eyes, the chewing mouth, the crumbs.
const CP58={ // timing (s); every beat is here so it can be tuned
 up:.7, peak:1.35, eyesOpen:1.5, drape:2.25, snap:.2, carry:.6, grab2:2.55, snap2:.25, eat:3.15, chomps:[3.25,3.5,3.75,4.0], gulp:4.2, back:4.25, end:4.75,
 dropAt:4.3, lookAway:true, maxGrabs:2, stats:{runs:0,grabbed:[],replaced:[]}};
function cp58Ease(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function cp58Lerp(a,b,k){return {x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k,r:(a.r||0)+((b.r||0)-(a.r||0))*k};}
function cp58Rest(side){return {x:200+side*135,y:VIEW.y+180*VIEW.zy+45,r:0};}
function cp58Goal(id){return typeof WILD_COLLECTION!=='undefined'&&WILD_COLLECTION.includes(id)&&!WILD.have[id];}
// The prizes worth stealing: on the table, not falling, nearest the front first; goal prizes before others.
function cp58Targets(){
 const c=[];for(const b of bodies){if(b.dead||b.kind!=='item')continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
  if(z<GUARD_END-40||z>T.FRONT-6||y<-3||Math.abs(x-200)>(T.R-T.L)/2+2)continue;c.push({b,score:z+(cp58Goal(b.id)?400:0)});}
 c.sort((a,b)=>b.score-a.score);return c.slice(0,CP58.maxGrabs).map(o=>o.b);}
w2StartYawn=function(){
 stopTickle();stopPawDance();pawDanceToken++;pawDance={started:time,silent:true,index:0,switched:true,anchor:0,yawn:true};happyUntil=0;
 const tg=cp58Targets(),grabs=[];
 tg.forEach((b,i)=>{const x=b.rb.translation().x/M;let side=x<200?-1:1;if(i===1)side=-grabs[0].side;grabs.push({b,id:b.id,side,goal:cp58Goal(b.id),held:false,gone:false,bites:0});});
 const away=grabs.length?(CP58.lookAway?-grabs[0].side:grabs[0].side):1;
 W2_YAWN={t:0,cp58:true,grabs,away,crumbs:[],mouth:null,fx:{}};CP58.stats.runs++;sfx.wild2('yawn',1);
 try{diagEvent('wild2','cp58 yawn grabs='+grabs.map(g=>g.id).join(','));}catch(e){}};
// When each grab happens: the first mitt drapes then snaps; the second snaps straight from rest.
function cp58Times(i){return i===0?{from:CP58.peak,hover:CP58.drape,hit:CP58.drape+CP58.snap,home:CP58.drape+CP58.snap+CP58.carry}
 :{from:CP58.grab2-.01,hover:CP58.grab2,hit:CP58.grab2+CP58.snap2,home:CP58.grab2+CP58.snap2+CP58.carry};}
function cp58PrizeScreen(g){if(!g.b.dead){const p=g.b.rb.translation();g.at=skyScreen(p.x/M,p.z/M,p.y/M);}return g.at;}
function cp58Mouth(){return W2_YAWN&&W2_YAWN.mouth||{x:200,y:w43ChinY()-28};}
// The mitt's absolute position (screen) and turn at time t.
function cp58Mitt(side,t){
 const Y=W2_YAWN,R=cp58Rest(side),S={x:R.x+side*48,y:R.y-185,r:-side*.55}; // S: the stretch, up and out beside the head
 const shiver=t>CP58.up&&t<CP58.peak?Math.sin(t*58)*Math.min(1,(t-CP58.up)/.15):0;
 let P;
 if(t<CP58.peak){P=cp58Lerp(R,S,cp58Ease(t/CP58.up));P.x+=side*3.5*shiver;P.r+=.06*shiver;}
 else P=null;
 const i=Y.grabs.findIndex(g=>g.side===side),g=Y.grabs[i];
 const chin=()=>{const m=cp58Mouth();return {x:m.x+side*62,y:m.y+48,r:side*.35};};
 if(!P){
  if(!g){P=cp58Lerp(S,R,cp58Ease((t-CP58.peak)/.6));}
  else{const T0=cp58Times(i),e=cp58PrizeScreen(g),C={x:Math.max(40,Math.min(360,e.x+side*10)),y:e.y-34,r:-side*.35};
   const H={x:C.x+side*52,y:C.y-70,r:-side*.15};
   if(i===0){
    if(t<T0.hover){const u=(t-T0.from)/(T0.hover-T0.from),k=cp58Ease(u);P=cp58Lerp(S,H,k);P.x+=side*55*Math.sin(Math.PI*k);P.r+=-side*.25*Math.sin(Math.PI*k);} // the casual drape: out wide, then down
   }else if(t<T0.hover){P=cp58Lerp(S,R,cp58Ease((t-CP58.peak)/.6));}
   if(!P&&t<T0.hit){const from=i===0?H:cp58Lerp(S,R,cp58Ease((T0.hover-CP58.peak)/.6));P=cp58Lerp(from,C,cp58Ease((t-T0.hover)/(T0.hit-T0.hover)));}
   if(!P&&t<T0.home){const fl=t-T0.hit<.08?Math.sin((t-T0.hit)/.08*Math.PI):0;P=cp58Lerp(C,chin(),cp58Ease((t-T0.hit)/CP58.carry));P.x-=side*10*fl;}
   if(!P&&t<CP58.back){P=chin();P.y+=Y.chew||0;}
   if(!P){P=cp58Lerp(chin(),R,cp58Ease((t-CP58.back)/(CP58.end-CP58.back-.05)));}
  }
 }
 return P;}
const __cp58PawMotion=pawMotion;
pawMotion=function(side=0){
 const Y=W2_YAWN;if(!Y||!Y.cp58||!pawDance||!pawDance.yawn)return __cp58PawMotion(side);const t=Y.t;
 if(!side){ // the head: back for the yawn (with the shiver), a small tilt for the side-eye, a bob while chewing
  const back=cp58Ease(t/.5)*(1-cp58Ease((t-1.25)/.3)),sh=t>CP58.up&&t<CP58.peak?Math.sin(t*58)*.8:0;
  return {x:sh,y:-16*back+(Y.chew||0)*.6,r:-.02*back};}
 const P=cp58Mitt(side,t),R=cp58Rest(side);return {x:P.x-R.x,y:P.y-R.y,r:P.r};};
const __cp58PawGaze=pawGaze;
pawGaze=function(){const Y=W2_YAWN;if(!Y||!Y.cp58)return __cp58PawGaze();const t=Y.t;
 const T0=Y.grabs.length?cp58Times(Y.grabs.length-1).home:2.6;
 const k=cp58Ease((t-CP58.eyesOpen)/.12)*(1-cp58Ease((t-T0)/.2));return k>0?{x:Y.away*2*k,y:-.75*k}:null;};
// Face overlays inside the head's own drawing (head-art pixels, as drawHappyFeatures does).
function cp58Face(){const Y=W2_YAWN,t=Y.t;
 try{const m=ctx.getTransform(),k=scale*renderPixelRatio,p=m.transformPoint({x:199.5,y:171});Y.mouth={x:p.x/k,y:p.y/k};}catch(e){}
 const yawn=t>.05&&t<CP58.eyesOpen?cp58Ease((t-.05)/.35)*(1-cp58Ease((t-1.25)/.22)):0;
 const eat=t>CP58.eat&&t<CP58.end-.15;
 ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);
 if((t>.25&&t<CP58.eyesOpen-.05)||eat){ // eyes shut: squeezed flat for the yawn (placeholder), the Happy face's arcs while eating
  ctx.globalAlpha=1;ctx.fillStyle='#000';for(const c of [480,1056]){ctx.beginPath();ctx.ellipse(c,525,183,148,0,0,7);ctx.fill();}
  ctx.strokeStyle='#ffda35';ctx.lineWidth=30;ctx.lineCap='round';
  for(const side of [-1,1]){const c=768+side*205;ctx.beginPath();if(eat){ctx.moveTo(c-100,540);ctx.quadraticCurveTo(c,360,c+100,540);}
   else{ctx.moveTo(c-105,505);ctx.quadraticCurveTo(c,560,c+105,505);ctx.moveTo(c+side*-60,470);ctx.lineTo(c+side*-100,440);}ctx.stroke();}
  ctx.globalAlpha=1;}
 if(yawn>0){ // the open yawn mouth (placeholder)
  const w=60+120*yawn,h=30+250*yawn,top=812;ctx.fillStyle='#3a0b14';ctx.strokeStyle='#000';ctx.lineWidth=12;
  ctx.beginPath();ctx.ellipse(766,top+h/2,w/2,h/2,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#ff8fa3';ctx.beginPath();ctx.ellipse(766,top+h*.78,w*.34,h*.17,0,0,7);ctx.fill();
  ctx.fillStyle='#fff';for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(766+s*w*.32,top+h*.08);ctx.lineTo(766+s*w*.22,top+h*.08);ctx.lineTo(766+s*w*.27,top+h*.08+34*yawn);ctx.closePath();ctx.fill();}}
 if(eat){ // chewing: the Happy mouth, opening to a small round mouth on each chomp (placeholder)
  const o=Y.chewOpen||0;if(o>.05){ctx.fillStyle='#3a0b14';ctx.strokeStyle='#000';ctx.lineWidth=10;ctx.beginPath();ctx.ellipse(766,840,50+40*o,18+50*o,0,0,7);ctx.fill();ctx.stroke();}
  else ctx.drawImage(ART.happyMouth,0,0);}
 ctx.restore();}
const __cp58Pupils=drawTrackingPupils;
drawTrackingPupils=function(){const Y=W2_YAWN;if(!Y||!Y.cp58)return __cp58Pupils();const t=Y.t;
 const shut=(t>.25&&t<CP58.eyesOpen-.05)||(t>CP58.eat&&t<CP58.end-.15);if(!shut)__cp58Pupils();cp58Face();};
w2YawnTick=function(dt){
 const Y=W2_YAWN;if(!Y)return;if(!Y.cp58){return;}Y.t+=dt;happyUntil=0;const t=Y.t,fx=Y.fx;
 if(t>=CP58.eyesOpen&&!fx.look){fx.look=1;sfx.wild2('tick',.8);}
 Y.grabs.forEach((g,i)=>{const T0=cp58Times(i);
  if(t>=T0.hover&&!g.whoosh){g.whoosh=1;sfx.paw40&&sfx.paw40('whoosh',1);}
  if(t>=T0.hit&&!g.held){g.held=true;cp58PrizeScreen(g);g.s0=g.at.s;if(!g.b.dead)removeCoin(g.b);sfx.paw40&&sfx.paw40('swipe',1);CP58.stats.grabbed.push(g.id);
   try{diagEvent('wild2','cp58 grab '+g.id);}catch(e){}}});
 // chewing
 Y.chew=0;Y.chewOpen=0;for(const c of CP58.chomps){const u=(t-c)/.22;if(u>=0&&u<1){Y.chewOpen=Math.sin(u*Math.PI);Y.chew=5*Math.sin(u*Math.PI);}}
 CP58.chomps.forEach((c,i)=>{if(t>=c&&!fx['c'+i]){fx['c'+i]=1;if(Y.grabs.length){sfx.wild2('catch',1);for(const g of Y.grabs)g.bites=i+1;
  if(i===0)callout('NOM.',{color:'#ffd23f',dur:.9});const m=cp58Mouth();for(let k=0;k<7;k++)Y.crumbs.push({x:m.x+rand(-14,14),y:m.y+rand(-4,6),vx:rand(-70,70),vy:rand(-120,-30),t:0,c:Math.random()<.5?'#f4c24a':'#e8a060'});}}});
 if(t>=CP58.gulp&&!fx.gulp){fx.gulp=1;if(Y.grabs.length){pgSfx('plop',1);for(const g of Y.grabs)g.gone=true;}}
 // a stolen goal prize comes back as the game's own bonus drop (marker, whistle, drop from the sky), one after the other
 if(t>=CP58.dropAt&&!fx.drop){fx.drop=1;let n=0;Y.dropping=true;const miss=wildMissing();for(const g of Y.grabs)if(g.held&&miss.includes(g.id)&&WILD.on&&WILD.phase==='play'){
   const y=rand(430,650),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'item',id:g.id,x,y,t:.9+n*.45,t0:.9});WILD.bonusN++;n++;CP58.stats.replaced.push(g.id);}
  if(n){sfx.wild('whistle',1);callout(n>1?"THEY'LL DROP BACK!":"IT'LL DROP BACK!",{color:'#7dff6a',dur:1.2});}}
 for(let i=Y.crumbs.length-1;i>=0;i--){const c=Y.crumbs[i];c.t+=dt;c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=520*dt;if(c.t>.8)Y.crumbs.splice(i,1);}
 if(t>=CP58.end){W2_YAWN=null;if(pawDance&&pawDance.yawn)stopPawDance();try{pgSfx('purr',.6);}catch(e){}}
};
// While a stolen prize is in the cat's mitt, the bonus-drop clock doesn't count it as missing (it comes back at the end).
const __cp58Missing=wildMissing;
wildMissing=function(){const r=__cp58Missing(),Y=W2_YAWN;if(!Y||!Y.cp58||Y.dropping)return r;return r.filter(id=>!Y.grabs.some(g=>g.held&&g.id===id));};
// Overlay (screen coordinates): the YAAAWN text (unchanged), then the held prizes and crumbs.
const __cp58YawnText=yawnText;
yawnText=function(){const Y=W2_YAWN;if(!Y)return;__cp58YawnText();if(!Y.cp58)return;const t=Y.t,m=cp58Mouth();
 Y.grabs.forEach((g,i)=>{if(!g.held||g.gone)return;const T0=cp58Times(i),M0=cp58Mitt(g.side,t),claw={x:M0.x-g.side*4,y:M0.y+30};
  const k=cp58Ease((t-T0.hit-.1)/(CP58.carry-.1)),pos={x:claw.x+(m.x+g.side*14-claw.x)*k,y:claw.y+(m.y+8-claw.y)*k};
  const s=(g.s0+(1.05-g.s0)*k)*(1-.22*g.bites);
  ctx.save();ctx.translate(pos.x,pos.y);ctx.rotate(g.side*.25*(1-k));drawPrize('item',g.id,0,0,s);ctx.restore();});
 for(const c of Y.crumbs){ctx.globalAlpha=1-c.t/.8;ctx.fillStyle=c.c;ctx.fillRect(c.x-2,c.y-2,4,4);}ctx.globalAlpha=1;};
// ---------- end CP-58 prototype ----------
