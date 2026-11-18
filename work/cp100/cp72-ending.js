// ---------- CP-72 (UAT 100; Jenny, Nov 18, on UAT 99: "can you shorten the up close pause and if that doesn't work we'll
// revert to your earlier version, prior to my close-up request.") ----------
// The showing-off close-up ('crazy') is held 0.4 s instead of 1 s; its quick zoom in (0.2 s) and back out (0.25 s) are
// unchanged, so the hang lasts 0.85 s (was 1.45 s). Everything else in Zoomies is unchanged.
// Settings -> Developer -> Engineer tools -> "Zoomies ending": Short close-up (this one, default) / Hang (UAT 96's: the
// poofed kitten hangs 1 s at 1.5x, no close-up), saved on this phone (localStorage catpusher.uat.cp72ending.v1).
const CP72E=(()=>{const KEY='catpusher.uat.cp72ending.v1',CHOICES=['short','hang'],NAMES={short:'Short close-up',hang:'Hang'},hold=.4;
 const L=Z72.leapHang;L.faceHang=L.faceIn+hold+L.faceOut;
 let pick='short';try{const v=localStorage.getItem(KEY);if(CHOICES.includes(v))pick=v;}catch(e){}
 const apply=()=>{L.style=pick==='hang'?'still':'crazy';};apply();
 function set(k){if(!CHOICES.includes(k))return;pick=k;try{localStorage.setItem(KEY,k);}catch(e){}apply();}
 return {KEY,CHOICES,NAMES,hold,set,get:()=>pick};})();
// the choice in Engineer tools, under "Zoomies sound"
const __cp72eCredits=openCredits;
openCredits=function(){const r=__cp72eCredits.apply(this,arguments);try{
 const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp72-ending'))return r;
 const box=document.createElement('div');box.id='cp72-ending';const hd=document.createElement('h3');hd.textContent='Zoomies ending';box.appendChild(hd);
 const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.ze===CP72E.get();b.textContent=(on?'✓ ':'')+CP72E.NAMES[b.dataset.ze];b.style.fontWeight=on?'700':'400';});
 for(const k of CP72E.CHOICES){const b=document.createElement('button');b.dataset.ze=k;b.style.marginRight='6px';b.onclick=()=>{CP72E.set(k);paint();};btns.push(b);box.appendChild(b);}
 paint();const after=eng.querySelector('#cp72-zsound')||eng.querySelector('#cp79-yawn');if(after&&after.nextSibling)eng.insertBefore(box,after.nextSibling);else if(after)eng.appendChild(box);else{const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}}catch(e){}return r;};
// ---------- end CP-72 (UAT 100) ----------
