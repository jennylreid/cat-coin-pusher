// ---------- CP-90 Zoomies: painted kittens (UAT 117; Jenny, Nov 19: "I prefer the original Ginger Puff cat." / "I need to
// see both. I need to see them in action as well.") ----------
// Settings -> Developer -> Engineer tools -> "Zoomies kittens": Painted (default) / Original, saved on this phone
// (localStorage catpusher.uat.cp90kittens.v1). Painted: both kittens are Codex's painted art (img/art/cp90-ginger-run.webp,
// cp90-cream-run.webp) whenever they are not puffed, and the peek at the bottom edge is the painted crown and eyes
// (cp90-ginger-peek.webp, cropped at the screen-edge line). The puff (the spook jump and the ginger kitten's final leap and
// hang) is always the original code drawing. Original: exactly today's Zoomies.
// Only the drawing changes: every position, size, tilt (lean), stretch (sprint/leap), bob and flip is the original
// kitten's, applied to the painted art drawn at (-32,-72,64,80) in kitten units (512x640 canvas, 8 px per unit, anchor
// (256,576) on the kitten's feet; work/cp90-kittens, tickets/CP-90.md). No fades: painted <-> puff is an instant switch on
// the frame the puff starts or ends.
const CP90=(()=>{const KEY='catpusher.uat.cp90kittens.v1',CHOICES=['painted','original'],NAMES={painted:'Painted',original:'Original'};
 let pick='painted';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){}
 const art={},stats={painted:0,original:0,peek:0};
 for(const [k,f] of [['ginger','cp90-ginger-run.webp'],['cream','cp90-cream-run.webp'],['peek','cp90-ginger-peek.webp']])cp58RunwayLoad('img/art/'+f,im=>{art[k]=im;});
 return {KEY,CHOICES,NAMES,art,stats,peekNow:false,dropNow:false,get:()=>pick,set(k){if(!CHOICES.includes(k))return;pick=k;try{localStorage.setItem(KEY,k);}catch(e){}}};})();
const __cp90Kitten=z72Kitten;
z72Kitten=function(x,y,s,C,ph,dir,skid,alpha,lean,puff,rot,pose){
 const im=CP90.get()==='painted'&&!(puff>0)&&!CP90.dropNow?(CP90.peekNow?CP90.art.peek:C===Z72.coats[1]?CP90.art.cream:CP90.art.ginger):null;
 if(!im){CP90.stats.original++;return __cp90Kitten.apply(this,arguments);}
 CP90.stats.painted++;if(CP90.peekNow)CP90.stats.peek++;
 // the original kitten's transforms, exactly as z72Kitten applies them before drawing (puff is 0 here)
 ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(lean||0);
 if(pose==='sprint')ctx.scale(1.1,.86);else if(pose==='leap')ctx.scale(.92,1.14);
 const bob=rot?0:Math.abs(Math.sin(ph))*3;ctx.translate(0,-bob);if(rot){ctx.translate(0,-22);ctx.rotate(rot);ctx.translate(0,22);}
 ctx.drawImage(im,-32,-72,64,80);ctx.restore();};
// The drop from the hang to the bottom edge stays the original drawing all the way (its fur settles on the way down), so
// the painted art comes back on one frame: the one where the kitten stops at the edge. The hold and duck use the peek crop
// (its cut line is under the screen edge there).
if(typeof cp72PeekDraw==='function'){const __cp90Peek=cp72PeekDraw;
cp72PeekDraw=function(){const k=Z72X&&Z72X.kits[0],pk=k&&k.P&&k.P.pk;CP90.peekNow=pk==='hold'||pk==='duck';CP90.dropNow=pk==='drop';
 try{return __cp90Peek.apply(this,arguments);}finally{CP90.peekNow=false;CP90.dropNow=false;}};}
// the choice in Engineer tools (always there with Developer on)
const __cp90Credits=openCredits;
openCredits=function(){const r=__cp90Credits.apply(this,arguments);try{
 const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp90-kittens'))return r;
 const box=document.createElement('div');box.id='cp90-kittens';const hd=document.createElement('h3');hd.textContent='Zoomies kittens';box.appendChild(hd);
 const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.k===CP90.get();b.textContent=(on?'✓ ':'')+CP90.NAMES[b.dataset.k];b.style.fontWeight=on?'700':'400';});
 for(const k of CP90.CHOICES){const b=document.createElement('button');b.dataset.k=k;b.style.marginRight='6px';b.onclick=()=>{CP90.set(k);paint();};btns.push(b);box.appendChild(b);}
 paint();const after=eng.querySelector('#cp79-yawn');if(after&&after.nextSibling)eng.insertBefore(box,after.nextSibling);else if(after)eng.appendChild(box);
 else{const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}}catch(e){}return r;};
// ---------- end CP-90 ----------
