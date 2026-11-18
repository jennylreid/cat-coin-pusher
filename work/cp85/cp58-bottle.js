// ---------- CP-58 add-on (UAT 85; Jenny, Nov 17): the Yawn eats food only; milk leaves an empty bottle ----------
// The wheel's Yawn only takes food (cheese, shrimp, tuna, fish biscuit, sardine, egg, milk); toys are never taken. With no
// food in reach the mitt takes a few top coins as before. Milk: the cat drinks it (white drips instead of crumbs), then
// tosses the empty bottle onto the board, where it is a real piece with milk's own size, collider and weight. Pushed off
// (front or side) it plays a plain bottle clink and is gone: it is never a prize, never counted, never picked up.
// At most 2 empty bottles on the board; with 2 already there the cat keeps the third (it isn't thrown).
// New art: img/art/cp58-milk-empty.png, made from Jenny's milk B with the milk gone (milk B itself is unchanged).
const CP58_FOOD=['cheese','shrimp','tuna','biscuit','sardine','egg','milk'];
const CP58_BOTTLE={max:2,toss:4.27,fly:.42,h:70,stats:{tossed:0,kept:0,off:0,side:0}};
let CP58_BOTTLE_ART=null;
cp58RunwayLoad('img/art/cp58-milk-empty.png',im=>{CP58_BOTTLE_ART=im;});
function cp58Bottles(){let n=0;for(const b of bodies)if(b.bottle&&!b.dead)n++;return n;}
// The empty bottle draws exactly like milk (same size, anchor and occlusion), with the empty painting.
const __cp58BottleDraw=drawPrize;
drawPrize=function(kind,id,x,y,s){if(id!=='bottle')return __cp58BottleDraw(kind,id,x,y,s);if(!CP58_BOTTLE_ART)return;
 const old=WILD_ART.milk;WILD_ART.milk=CP58_BOTTLE_ART;try{return __cp58BottleDraw(kind,'milk',x,y,s);}finally{WILD_ART.milk=old;}};
// A plain glass clink.
sfx.cp58Clink=function(vol=1){if(!this._w2ok())return;const t=this._pgT(),B=(t0,f,a,d)=>this._pgBell(t0,f,a,d);
 B(t,2489,.12*vol,.3);B(t,3951,.05*vol,.18);B(t+.075,2637,.06*vol,.22);};
// At the gulp: the drunk milk's bottle stays in the mitt, then is tossed onto the board in front of the pusher.
function cp58BottleGulp(Y){const g=Y.grabs.find(g=>g.held&&!g.coins&&g.id==='milk');if(!g)return;
 if(cp58Bottles()>=CP58_BOTTLE.max){CP58_BOTTLE.stats.kept++;return;}
 const z=rand(PUSH_MAX+50,PUSH_MAX+150),x=200+g.side*rand(15,70);Y.bottle={g,x,z,landed:false};}
function cp58BottleLand(B){if(cp58Bottles()>=CP58_BOTTLE.max){CP58_BOTTLE.stats.kept++;return;}
 const b=addCoin('item','bottle',B.x,CP58_BOTTLE.h,B.z,yawTurn(0),{x:0,y:-3,z:.4},{x:0,y:0,z:0});b.bottle=true;b.rb.enableCcd(true);
 CP58_BOTTLE.stats.tossed++;try{diagEvent('wild2','cp58 empty bottle tossed');}catch(e){}}
const __cp58BottleTick=w2YawnTick;
w2YawnTick=function(dt){const Y=W2_YAWN;__cp58BottleTick(dt);
 if(Y&&Y.cp58&&Y.bottle&&!Y.bottle.landed&&Y.t>=CP58_BOTTLE.toss+CP58_BOTTLE.fly){Y.bottle.landed=true;cp58BottleLand(Y.bottle);}};
// Drawn over the board like the held prizes: in the mitt by the mouth, then an arc with a spin down to where it lands.
const __cp58BottleText=yawnText;
yawnText=function(){__cp58BottleText();const Y=W2_YAWN;if(!Y||!Y.cp58||!Y.bottle||Y.bottle.landed||!CP58_BOTTLE_ART)return;
 const B=Y.bottle,g=B.g,t=Y.t,m=cp58Mouth(),S0={x:m.x+g.side*14,y:m.y+8,s:1.05};let p=S0,r=0;
 if(t>=CP58_BOTTLE.toss){const u=Math.min(1,(t-CP58_BOTTLE.toss)/CP58_BOTTLE.fly),E=skyScreen(B.x,B.z,CP58_BOTTLE.h);
  p={x:S0.x+(E.x-S0.x)*u,y:S0.y+(E.y-S0.y)*u-70*Math.sin(Math.PI*u),s:S0.s+(E.s-S0.s)*u};r=g.side*u*Math.PI*1.5;}
 ctx.save();ctx.translate(p.x,p.y);ctx.rotate(r);drawPrize('item','bottle',0,0,p.s);ctx.restore();};
// Over the edge: a clink and gone (front or side). Squeezed through the table it goes back on top, as coins do.
const __cp58BottleFall=fallOff;
fallOff=function(b,x){if(!b||!b.bottle)return __cp58BottleFall.apply(this,arguments);if(b.dead)return;
 const t=b.rb.translation(),z=t.z/M,inside=Math.abs(x-200)<=(T.R-T.L)/2-2;
 if(inside&&z<T.FRONT-30){b.rb.setTranslation({x:(200+(x-200)*.6)*M,y:30*M,z:Math.max(z,PUSH_MAX+COIN_R+4)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);b.rb.setAngvel({x:0,y:0,z:0},true);return;}
 const at=screenOf(t.x/M,z,t.y/M),side=!inside&&z<T.FRONT-4;
 if(side)falling.push({x:at.x,y:at.y,vx:x<200?-40:40,vy:60,kind:'item',id:'bottle',won:false,t:0,s:at.s,gutter:true,__screenStart:at,__sourceX:at.x,__sourceY:at.y});
 else{const p=proj(x,T.FRONT);falling.push({x:p.x,y:p.y+4,vx:0,vy:60,kind:'item',id:'bottle',won:false,t:0,s:p.s,__screenStart:at,__sourceX:p.x,__sourceY:p.y+4});}
 CP58_BOTTLE.stats[side?'side':'off']++;try{sfx.cp58Clink(1);}catch(e){}
 removeCoin(b);};
const __cp58BottleGutter=gutterOff;
gutterOff=function(b,x){if(b&&b.bottle)return fallOff(b,x);return __cp58BottleGutter.apply(this,arguments);};
// ---------- end CP-58 add-on ----------
