// CP-40 Paw save (Wild 2 only). When a prize tips over a side edge it hangs and glows for about half a second, with
// a rising "uh-oh". Tapping it sends the cat's mitt (approved art, unchanged, sliding like the UAT 38 yawn swipe) to
// flick it back onto the board: swipe sound, "SAVED!" pop. 3 saves per round, shown as mitt icons in the HUD.
// A tap that misses the glowing prize does what taps normally do and uses no save. Developer: force a tip-off, saves dial.
const PAW40_KEY='catpusher.uat.pawsave.v1';
const PAW40={perRound:3,window:.5,hitR:64,slide:.16,hold:.08,back:.32,flick:2.6,lift:1.4};
try{const d=JSON.parse(localStorage.getItem(PAW40_KEY)||'null');if(d&&Number.isFinite(+d.perRound))PAW40.perRound=Math.min(9,Math.max(0,Math.round(+d.perRound)));}catch(e){}
let PAW40_STATE={saves:PAW40.perRound,teeter:null,swipe:null,pops:[],saved:0,missed:0};
function paw40On(){return !!(WILD&&WILD.on&&WILD.v2&&WILD.phase==='play'&&board.status==='playing'&&!inventoryOpen);}
// A prize starts to tip once its centre of mass is past a side edge (CP-24), on the open part of the side.
function paw40Tipping(b){if(b.dead||b.kind!=="item"||b.paw40Done||b.paw40Miss)return false;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
 return z>=GUARD_END&&z<T.FRONT-4&&Math.abs(x-200)>(T.R-T.L)/2&&y>-6&&y<40;}
function paw40Tick(dt){const S40=PAW40_STATE;
 for(let i=S40.pops.length-1;i>=0;i--){S40.pops[i].t+=dt;if(S40.pops[i].t>1)S40.pops.splice(i,1);}
 if(S40.swipe){const W=S40.swipe;W.t+=dt;
  if(!W.hit&&W.t>=PAW40.slide){W.hit=true;const b=W.b;
   if(!b.dead){const p=b.rb.translation();b.rb.setGravityScale(1,true);
    // the flick: back over the edge and up, so it lands on the table a little way in
    b.rb.setTranslation({x:p.x-W.side*.06,y:Math.max(p.y,.02),z:p.z},true);b.rb.setLinvel({x:-W.side*PAW40.flick,y:PAW40.lift,z:rand(-.3,.3)},true);b.rb.setAngvel({x:0,y:rand(-4,4),z:0},true);
    b.paw40Done=time+1.5;sfx.paw40&&sfx.paw40('swipe',1);const e=skyScreen(p.x/M,p.z/M,p.y/M);S40.pops.push({x:e.x-W.side*30,y:e.y-40,t:0});
    try{diagEvent('wild2','paw save '+b.id);}catch(e){}}}
  if(W.t>=PAW40.slide+PAW40.hold+PAW40.back)S40.swipe=null;}
 for(const b of bodies)if(b.paw40Done&&time>b.paw40Done)b.paw40Done=0;
 const T40=S40.teeter;
 if(T40){T40.t+=dt;const b=T40.b;
  if(b.dead){S40.teeter=null;}
  else if(T40.saving){/* held until the mitt arrives */const v=b.rb.linvel();b.rb.setLinvel({x:v.x*.5,y:Math.max(v.y,-.05),z:v.z*.5},true);if(S40.swipe&&S40.swipe.hit)S40.teeter=null;}
  else if(T40.t>=PAW40.window||!paw40On()){b.rb.setGravityScale(1,true);b.paw40Miss=true;b.rb.wakeUp();S40.teeter=null;S40.missed++;}
  else{/* hangs, slowly tipping, so there is time to see it and tap */const v=b.rb.linvel();b.rb.setLinvel({x:v.x*.6,y:Math.max(v.y,-.15),z:v.z*.6},true);}
 }
 if(!S40.teeter&&!S40.swipe&&S40.saves>0&&paw40On())for(const b of bodies)if(paw40Tipping(b)){
  S40.teeter={b,t:0,side:b.rb.translation().x/M<200?-1:1};b.rb.setGravityScale(.05,true);const v=b.rb.linvel();b.rb.setLinvel({x:v.x*.3,y:Math.max(v.y,-.1),z:v.z*.3},true);
  sfx.paw40&&sfx.paw40('uhoh',1);try{diagEvent('wild2','tip '+b.id);}catch(e){}break;}
}
function paw40Screen(b){const p=b.rb.translation();return skyScreen(p.x/M,p.z/M,p.y/M);}
// The tap: on the glowing prize, a save; anywhere else, a normal tap.
function paw40Pointer(p){const S40=PAW40_STATE,T40=S40.teeter;if(!T40||T40.saving||S40.saves<=0||!paw40On())return false;
 const e=paw40Screen(T40.b);if(Math.hypot(p.x-e.x,p.y-(e.y-14*e.s))>PAW40.hitR)return false;
 T40.saving=true;S40.saves--;S40.saved++;S40.swipe={t:0,side:T40.side,b:T40.b,hit:false,to:e};sfx.paw40&&sfx.paw40('whoosh',1);return true;}
// The mitt's offset during a save: slides out to the prize (ease in), a short flick, then back (the yawn's easing).
function paw40Offset(side,rest){const W=PAW40_STATE.swipe;if(!W||W.side!==side)return null;
 const s=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);},t=W.t,go=s(t/PAW40.slide),ret=s((t-PAW40.slide-PAW40.hold)/PAW40.back),f=go*(1-ret);
 const e=W.b.dead?W.to:paw40Screen(W.b);W.to=e;const tx=e.x+side*40-rest.x,ty=e.y-30-rest.y;
 const flick=t>PAW40.slide&&t<PAW40.slide+PAW40.hold?Math.sin((t-PAW40.slide)/PAW40.hold*Math.PI):0;
 return {x:tx*f-side*14*flick,y:ty*f,r:-side*(.35*f+.25*flick)};}
const __paw40MittRest=mittRest;
mittRest=function(side){const r=__paw40MittRest(side),d=paw40Offset(side,r);return d?{x:r.x+d.x,y:r.y+d.y}:r;};
const __paw40PawMotion=pawMotion;
pawMotion=function(side=0){const m=__paw40PawMotion(side);if(!side)return m;const W=PAW40_STATE.swipe;if(!W||W.side!==side)return m;
 const rest={x:200+side*135,y:VIEW.y+180*VIEW.zy+45},d=paw40Offset(side,rest);return d?{x:m.x+d.x,y:m.y+d.y,r:m.r+d.r}:m;};
function paw40Draw(){const S40=PAW40_STATE;
 const T40=S40.teeter;if(T40&&!T40.b.dead){const e=paw40Screen(T40.b),pulse=.5+.5*Math.sin(T40.t*28),r=(radius('item')*1.7+6*pulse)*e.s;
  ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(e.x,e.y-14*e.s,r*.2,e.x,e.y-14*e.s,r*1.4);
  g.addColorStop(0,'rgba(255,240,120,'+(.55+.3*pulse)+')');g.addColorStop(.6,'rgba(255,170,40,'+(.35+.25*pulse)+')');g.addColorStop(1,'rgba(255,120,0,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y-14*e.s,r*1.4,0,7);ctx.fill();ctx.restore();
  ctx.save();ctx.globalAlpha=.85+.15*pulse;ctx.strokeStyle='#fff6b0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(e.x,e.y-14*e.s,r,0,7);ctx.stroke();ctx.restore();}
 for(const P of S40.pops){const u=P.t,k=u<.15?.6+2.8*u:1+.04*Math.sin(u*20);ctx.save();ctx.globalAlpha=1-Math.max(0,(u-.7)/.3);ctx.translate(P.x,P.y-30*u);ctx.scale(k,k);wildText('SAVED!',0,0,30,'#7dff6a','#0c3a12',6);ctx.restore();}
}
// HUD: the saves left, as small copies of the mitt art, beside the collection icons.
function paw40Hud(hud){if(!(WILD.on&&WILD.v2))return;const n=PAW40.perRound;if(!n)return;
 const w=22,h=w*ART.paw.height/ART.paw.width,gap=24,cx=W-hud.right-58,y=hud.bottomY+45,x0=cx-(n-1)*gap/2;ctx.save();
 for(let i=0;i<n;i++){ctx.save();ctx.globalAlpha=i<PAW40_STATE.saves?1:.25;ctx.translate(x0+i*gap,y);ctx.drawImage(ART.paw,-w/2,-h/2,w,h);ctx.restore();}ctx.restore();}
const __paw40Hud=drawWildHud;drawWildHud=function(hud){__paw40Hud(hud);paw40Hud(hud);};
const __paw40Reset=wildReset;wildReset=function(){__paw40Reset();for(const b of bodies)b.paw40Done=0;PAW40_STATE={saves:PAW40.perRound,teeter:null,swipe:null,pops:[],saved:0,missed:0};};
const __paw40Pointer=wildPointer;wildPointer=function(e,p){if(__paw40Pointer(e,p))return true;return paw40Pointer(p);};
const __paw40Tick=wildTick;wildTick=function(dt){__paw40Tick(dt);if(!WILD.on||inventoryOpen||panel.style.display==='block')return;paw40Tick(dt);};
const __paw40Draw=wildDraw;wildDraw=function(){__paw40Draw();if(!(WILD.on&&WILD.v2))return;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);paw40Draw();ctx.restore();};
// Developer: force a tip-off now (a prize placed hanging over a side edge), and the saves-per-round dial.
function paw40ForceTip(){if(!WILD.on||!WILD.v2){if(WILD.on)wildExit();wild2Enter();}if(WILD.phase!=='play'){if(WILD.phase==='end')wildReset();wildStartCountdown();WILD.paw40Force=true;return;}
 const side=Math.random()<.5?-1:1,z=rand(GUARD_END+40,T.FRONT-60),id=(wildMissing()[0])||WILD_COLLECTION[0];
 const b=addCoin('item',id,200+side*((T.R-T.L)/2+4),COIN_HALF*2+halfOf('item')+2,z,yawTurn(0));b.wild=true;b.rb.setLinvel({x:side*.4,y:0,z:0},true);}
const __paw40Tick2=wildTick;wildTick=function(dt){__paw40Tick2(dt);if(WILD.paw40Force&&WILD.phase==='play'){WILD.paw40Force=false;paw40ForceTip();}};
function paw40DevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="paw40-dev"><h3><span>Paw save (Wild 2)</span><span>tuning</span></h3><div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Paw saves per round</span><button data-paw40="-1" style="'+b+'">−</button><b style="min-width:28px;text-align:center">'+PAW40.perRound+'</b><button data-paw40="1" style="'+b+'">+</button></div><button id="paw40-tip" class="wide">Paw save: force a tip-off now</button></div>';}
const __paw40DevHtml=wildDevHtml;wildDevHtml=function(){return __paw40DevHtml()+paw40DevHtml();};
const __paw40DevBind=wildDevBind;wildDevBind=function(panel){__paw40DevBind(panel);const box=panel.querySelector&&panel.querySelector('#paw40-dev');if(!box)return;
 for(const btn of box.querySelectorAll('[data-paw40]'))btn.onclick=()=>{PAW40.perRound=Math.min(9,Math.max(0,PAW40.perRound+ +btn.dataset.paw40));PAW40_STATE.saves=Math.min(PAW40_STATE.saves,PAW40.perRound);try{localStorage.setItem(PAW40_KEY,JSON.stringify({perRound:PAW40.perRound}));diagEvent('paw40-tuning','perRound='+PAW40.perRound);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 box.querySelector('#paw40-tip').onclick=()=>{panel.style.display='none';paw40ForceTip();};};
// Sounds: a rising "uh-oh" when a prize starts to tip, the mitt's whoosh, and the swipe that sends it back (with a pop).
sfx.paw40=function(kind,vol=1){const v=vol*(typeof pickupFx==='object'&&Number.isFinite(pickupFx.volume)?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
 if(kind==='uhoh'){this._mt(330,t,.16,'triangle',.11*v,master,392);this._mt(440,t+.17,.32,'triangle',.12*v,master,660);this._mt(880,t+.17,.28,'sine',.04*v,master,1320);}
 else if(kind==='whoosh'){this._mn(t,.16,.14*v,900,.8,master,.06);}
 else if(kind==='swipe'){this._mn(t,.12,.2*v,2400,.9,master,.01);this._mt(180,t,.1,'sine',.25*v,master,90);[783.99,1046.5,1318.5].forEach((f,i)=>this._mt(f,t+.05+i*.05,.22,'triangle',.07*v));bell(t+.2,2093,.05*v,.6);}
};
