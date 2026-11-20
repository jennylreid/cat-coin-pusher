
// ---------- Next round #4: the Ragdoll's white chest (Jenny, Nov 20, UAT 132, Screenshots/hug-gold-gap-uat132-2026-11-20.webp:
// during the Hug the gold pusher block and a black line show between the chin and the board. Decided: a code-drawn white
// chest fill under the chin during the Hug, matching the face's white (no new painted art); Dance: white chest too, same as
// the Hug, replacing the grey shoulders; grey is the fallback). ----------
// The chest is one plain shape in the face's white (#f9f4ec, sampled from the Ragdoll's face) with a soft taupe edge like the
// face's outline: from behind the chin (its rounded top shows only when the head slumps in the dance) down to the board's back
// edge, covering the pusher's back and the board's dark back-rim line (to 2.5 units below it, on the pusher's back, never
// reaching the coins). Drawn during the Ragdoll's Hug (after the Hug's shoulders, before its travelling mitts) and during its
// Dance break (instead of the CP-101 grey shoulders). Set CP133C.mode='grey' to go back to the grey shoulders.
const CP133C={mode:'white',col:'#f9f4ec',edge:'rgba(151,129,108,.85)',frames:0};
function rchestGeo(){const r=z74RimPts();if(!r)return null;const L=z74Layout(),P=[...r.left,...r.right],top=Math.min(...P.map(p=>p.y)),near=P.filter(p=>p.y<top+3);
 return {r,top,x0:Math.min(...near.map(p=>p.x))-8,x1:Math.max(...near.map(p=>p.x))+8,yb:top+2.5,yt:L.chin-80};}
function rchestPath(G){const {x0,x1,yb,yt}=G;ctx.beginPath();ctx.moveTo(x0,yb);ctx.lineTo(x0,yt+24);ctx.quadraticCurveTo(x0,yt,x0+30,yt);ctx.lineTo(x1-30,yt);ctx.quadraticCurveTo(x1,yt,x1,yt+24);ctx.lineTo(x1,yb);}
function rchestDraw(){const G=rchestGeo();if(!G)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.fillStyle=CP133C.col;
 ctx.save();z74ClipOutside(G.r);rchestPath(G);ctx.closePath();ctx.fill();ctx.restore(); // outside the board
 ctx.save();ctx.beginPath();ctx.rect(G.x0,G.top-3,G.x1-G.x0,G.yb-G.top+3);ctx.clip();rchestPath(G);ctx.closePath();ctx.fill();ctx.restore(); // over the back-rim line
 ctx.save();z74ClipOutside(G.r);ctx.strokeStyle=CP133C.edge;ctx.lineWidth=2.5;ctx.lineJoin='round';rchestPath(G);ctx.stroke();ctx.restore(); // the soft edge
 ctx.restore();CP133C.frames++;}
// the Hug: right after its shoulders and the rim (z74Body), before its mitts
const __rchestBody=z74Body;z74Body=function(){const r=__rchestBody.apply(this,arguments);if(CP133C.mode==='white'){try{rchestDraw();}catch(e){CP133C.err=String(e);}}return r;};
// the Dance break: the white chest instead of the grey shoulders
const __rchestOn=cp101BodyOn;cp101BodyOn=function(){if(CP133C.mode!=='grey')return false;return __rchestOn.apply(this,arguments);};
function rchestDanceOn(){const D=WILD.on&&WILD.dance;return !!(CP133C.mode==='white'&&D&&D.ragdoll&&!inventoryOpen&&!(typeof PGPX!=='undefined'&&PGPX));}
const __rchestMachine=drawMachine;drawMachine=function(){const r=__rchestMachine.apply(this,arguments);
 if(rchestDanceOn()&&CP133C.f!==Z74.f){CP133C.f=Z74.f;try{rchestDraw();}catch(e){CP133C.err=String(e);}}return r;};
// ---------- end next round #4 ----------
