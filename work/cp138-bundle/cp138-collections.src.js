// ---- UAT 138: CP-106 painted Collections pages, a UAT-only test (Jenny, Nov 20: "add the CP-106 painted Collections pages as a
// UAT-only test (drag prizes in, placement and completion payoff)") ----
// With the test on (UAT default; never on a production-named build), Home's COLLECTIONS button opens the test screen instead of
// today's Collections. Seven pages, picked by tabs: Flowers (the oil painting), Kitchen, Playroom, Cozy and Fairground (the v2
// paintings), Jewelry and Water (first pass). The art and outlines are CP-106's as delivered.
// - Each missing prize shows as its outline on the painting (a dark silhouette with a light rim; on Jewelry and Water, the prize's
//   own silhouette in its spot). Drag a prize from the satchel onto its outline: it takes one from the bag and the outline blends
//   into the painted light with a warm glow and a few glints (~1.4 s). The last prize of a page plays the completion payoff: a
//   sweep of light across the painting and sparkles (~2 s), then "Collection complete".
// - Drops are forgiving: anywhere inside or near any of its outlines, or anywhere around a flower's cluster of blooms, counts.
//   A drop anywhere else sends the prize back to the satchel. The test's placements are saved on this phone, separately.
// - Developer: Settings > Engineer tools > "Collections test": on/off, "Give all collection prizes" (one of each page prize in
//   the bag) and "Reset the test pages".
// - Today's Collections stays as it is whenever the test is off, and in production.
const CP138_DATA=/*DATA*/null;
const CP138_IDS={'Daisy':'daisy','Cornflower':'cornflower','Sunflower':'sunflower','Hydrangea':'hydrangea','Rose':'rose','Tulip':'tulip','Diamond':'diamond','Sapphire ring':'sapphire_ring',
 'Tuna':'tuna','Sardine':'sardine','Seahorse':'seahorse','Shrimp':'shrimp','Crab':'crab','Oyster with pearl':'oyster','Milk':'milk','Egg':'egg','Cheese':'cheese','Fish biscuit':'biscuit','Hot dog':'hot_dog',
 'Feather':'feather','Jingle bell':'bell','Toy mouse':'mouse','Rubber duck':'duck','Yarn ball':'yarn','Ball':'ball','Cardboard box':'box','Owl':'owl','Hot water bottle':'hot_water_bottle','Cushion':'cushion','Sock':'sock',
 'Rainbow':'rainbow','Music notes':'notes','Accordion':'accordion','Balloon animal':'balloon_animal','Bow tie':'bowtie'};
const CP138_PAGES=['Flowers','Kitchen','Playroom','Cozy','Fairground','Jewelry','Water'];
const CP138={KEY:'catpusher.uat.cp106test.v1',ON:'catpusher.uat.cp106teston.v1',el:null,cv:null,page:'Flowers',art:{},icons:{},sprites:{},fx:[],raf:0,drag:null,done:{},t0:0};
function cp138On(){try{const v=localStorage.getItem(CP138.ON);if(v==='1')return true;if(v==='0')return false;}catch(e){}return /\bUAT\b/.test(BUILD);}
function cp138SetOn(on){try{localStorage.setItem(CP138.ON,on?'1':'0');}catch(e){}}
function cp138Load(){try{return JSON.parse(localStorage.getItem(CP138.KEY)||'null')||{placed:{}};}catch(e){return {placed:{}};}}
function cp138Save(s){try{localStorage.setItem(CP138.KEY,JSON.stringify(s));}catch(e){}}
function cp138Img(f){if(!CP138.art[f]){const im=new Image();im.src='img/art/cp138/'+f;im.onload=()=>{try{cp138Draw();}catch(e){}};CP138.art[f]=im;}return CP138.art[f];}
function cp138Targets(page){const D=CP138_DATA,norm=c=>Array.isArray(c)?{outer:c,holes:[]}:c;const T={};
 if(page==='Flowers'){for(const n of D.pages.Flowers)T[n]=D.flowers[n].map(norm);}
 else if(D.masks[page]){for(const n of D.pages[page])T[n]=[norm(D.masks[page][n])];}
 return T;}
// a prize drawn by the game's own prize renderer into a small canvas (icons and Jewelry/Water spots), trimmed to its pixels
function cp138Sprite(id){if(CP138.sprites[id])return CP138.sprites[id];const c=document.createElement('canvas');c.width=c.height=160;const g=c.getContext('2d'),o=ctx;
 try{ctx=g;pgPrizeIcon(id,80,62,140);}catch(e){}finally{ctx=o;}
 let bb=null;try{const d=g.getImageData(0,0,160,160).data;let x0=160,y0=160,x1=-1,y1=-1;for(let y=0;y<160;y++)for(let x=0;x<160;x++)if(d[(y*160+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}if(x1>=0)bb=[x0,y0,x1-x0+1,y1-y0+1];}catch(e){}
 const r={cv:c,bb:bb||[0,0,160,160],ready:!!bb};if(bb)CP138.sprites[id]=r;return r;}
function cp138Path(g,t,k){g.beginPath();for(const poly of [t.outer,...(t.holes||[])]){poly.forEach((p,i)=>i?g.lineTo(p[0]*k,p[1]*k):g.moveTo(p[0]*k,p[1]*k));g.closePath();}}
function cp138Hit(t,x,y){const inPoly=(P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))c=!c;}return c;};
 if(inPoly(t.outer)&&!(t.holes||[]).some(inPoly))return true;let best=1e9;for(const [px,py] of t.outer)best=Math.min(best,Math.hypot(px-x,py-y));return best<26;}
// forgiving drops: anywhere inside or near any of the prize's outlines, or anywhere around its cluster (a flower's blooms)
function cp138HitAll(page,name,x,y){const T=cp138Targets(page)[name];if(!T||!T.length)return false;if(T.some(t=>cp138Hit(t,x,y)))return true;
 let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const t of T)for(const [px,py] of t.outer){x0=Math.min(x0,px);y0=Math.min(y0,py);x1=Math.max(x1,px);y1=Math.max(y1,py);}
 const m=24;if(x>=x0-m&&x<=x1+m&&y>=y0-m&&y<=y1+m)return true;
 const seg=(ax,ay,bx,by)=>{const dx=bx-ax,dy=by-ay,l=dx*dx+dy*dy||1,u=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/l));return Math.hypot(ax+u*dx-x,ay+u*dy-y);};
 for(const t of T){const P=t.outer;for(let i=0,j=P.length-1;i<P.length;j=i++)if(seg(P[j][0],P[j][1],P[i][0],P[i][1])<=30)return true;}return false;}
function cp138Slot(page,name){const D=CP138_DATA,i=D.pages[page].indexOf(name),L=D.layouts[page];return L&&L[i]?L[i]:null;}
function cp138SlotRect(page,name){const s=cp138Slot(page,name);if(!s)return null;const [cx,cy,w,h]=s,sp=cp138Sprite(CP138_IDS[name]),[,, bw,bh]=sp.bb,k=Math.min(w/bw,h/bh);return {x:cx-bw*k/2,y:cy-bh*k/2,w:bw*k,h:bh*k,sp};}
function cp138Placed(page){return new Set((cp138Load().placed[page])||[]);}
function cp138Ease(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}
// drawing the page (368 x 492 scene, drawn at 2x)
function cp138Draw(){const c=CP138.cv;if(!c)return;const g=c.getContext('2d'),K=2,page=CP138.page,placed=cp138Placed(page),now=performance.now()/1000;
 g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);const bg=cp138Img(page.toLowerCase()+'.png');if(bg.complete&&bg.naturalWidth)g.drawImage(bg,0,0,368*K,492*K);else{g.fillStyle='#241a35';g.fillRect(0,0,c.width,c.height);}
 const D=CP138_DATA,names=D.pages[page],fading={};for(const f of CP138.fx)if(f.kind==='place'&&f.page===page)fading[f.name]=1-cp138Ease((now-f.t)/.57);
 if(D.layouts[page]){for(const n of names){const R=cp138SlotRect(page,n);if(!R)continue;const a=placed.has(n)?(fading[n]!==undefined?1-fading[n]:1):0;
   if(a<1){g.save();g.globalAlpha=1-a;cp138Silhouette(g,R,K);g.restore();}
   if(a>0){g.save();g.globalAlpha=a;g.shadowColor='rgba(26,18,34,.45)';g.shadowBlur=8;g.shadowOffsetX=3*K;g.shadowOffsetY=5*K;g.drawImage(R.sp.cv,R.sp.bb[0],R.sp.bb[1],R.sp.bb[2],R.sp.bb[3],R.x*K,R.y*K,R.w*K,R.h*K);g.restore();}}
  if(page==='Jewelry'){const pr=cp138Img('jewelry-prongs.png');if(pr.complete&&pr.naturalWidth)g.drawImage(pr,0,0,368*K,492*K);}}
 else{const T=cp138Targets(page),col=page==='Flowers'?'#30362e':'#332b3a';
  for(const n of names){const al=placed.has(n)?(fading[n]!==undefined?fading[n]:0):1;if(al<=0)continue;g.save();g.globalAlpha=al;
   T[n].forEach((t,i)=>{cp138Path(g,t,K);g.fillStyle=col;g.fill('evenodd');if(page!=='Flowers'||i===0){g.lineWidth=1.6;g.strokeStyle='rgba(249,223,181,.85)';g.stroke();}});g.restore();}}
 cp138DrawFx(g,K,now);}
function cp138Silhouette(g,R,K){const s=R.sp,tmp=document.createElement('canvas');tmp.width=Math.ceil(R.w*K)+8;tmp.height=Math.ceil(R.h*K)+8;const t=tmp.getContext('2d');
 for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2],[-1.5,-1.5],[1.5,1.5],[-1.5,1.5],[1.5,-1.5]])t.drawImage(s.cv,s.bb[0],s.bb[1],s.bb[2],s.bb[3],4+dx,4+dy,R.w*K,R.h*K);
 t.globalCompositeOperation='source-in';t.fillStyle='rgba(250,230,188,.82)';t.fillRect(0,0,tmp.width,tmp.height);t.globalCompositeOperation='source-over';
 const sil=document.createElement('canvas');sil.width=tmp.width;sil.height=tmp.height;const u=sil.getContext('2d');u.drawImage(s.cv,s.bb[0],s.bb[1],s.bb[2],s.bb[3],4,4,R.w*K,R.h*K);u.globalCompositeOperation='source-in';u.fillStyle='rgba(36,26,53,.72)';u.fillRect(0,0,sil.width,sil.height);
 t.drawImage(sil,0,0);g.drawImage(tmp,R.x*K-4,R.y*K-4);}
function cp138Center(page,name){const R=cp138SlotRect(page,name);if(R)return [R.x+R.w/2,R.y+R.h/2];const T=cp138Targets(page)[name];let sx=0,sy=0,n=0;for(const t of T)for(const [x,y] of t.outer){sx+=x;sy+=y;n++;}return [sx/n,sy/n];}
function cp138DrawFx(g,K,now){for(let i=CP138.fx.length-1;i>=0;i--){const f=CP138.fx[i],u=now-f.t;if(u>f.len){CP138.fx.splice(i,1);continue;}if(f.page!==CP138.page)continue;g.save();
  if(f.kind==='place'){const p=Math.sin(Math.PI*Math.min(1,u/1.22)),[cx,cy]=f.at,r=70*K;const gr=g.createRadialGradient(cx*K,cy*K,0,cx*K,cy*K,r);gr.addColorStop(0,'rgba(255,214,140,'+(.55*p)+')');gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(cx*K-r,cy*K-r,2*r,2*r);
   for(const s of f.glints){const v=(u-s.d)/.5;if(v<0||v>1)continue;cp138Glint(g,(cx+s.x)*K,(cy+s.y)*K,s.r*K*Math.sin(Math.PI*v),Math.sin(Math.PI*v));}}
  if(f.kind==='complete'){const sw=cp138Ease((u-.2)/1.45),li=Math.sin(Math.PI*cp138Ease((u-.18)/1.9));const x=(-60+490*sw)*K,gr=g.createLinearGradient(x-110*K,0,x+110*K,0);gr.addColorStop(0,'rgba(255,240,200,0)');gr.addColorStop(.5,'rgba(255,240,200,'+(.42*li)+')');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.fillRect(0,0,368*K,492*K);
   for(const s of f.glints){const v=(u-s.d)/.55;if(v<0||v>1)continue;cp138Glint(g,s.x*K,s.y*K,s.r*K*Math.sin(Math.PI*v),Math.sin(Math.PI*v));}}
  g.restore();}}
function cp138Glint(g,x,y,r,a){if(r<=0)return;g.save();g.globalAlpha=a;g.translate(x,y);g.fillStyle='#fff8e0';g.beginPath();for(let i=0;i<8;i++){const ang=i*Math.PI/4,rr=i%2?r*.28:r;g.lineTo(Math.cos(ang)*rr,Math.sin(ang)*rr);}g.closePath();g.fill();g.restore();}
function cp138Loop(){if(!CP138.el||CP138.el.style.display==='none'){CP138.raf=0;return;}cp138Draw();if(CP138.drag)cp138DrawDrag();CP138.raf=requestAnimationFrame(cp138Loop);}
// placing a prize
function cp138Place(page,name){const s=cp138Load();s.placed[page]=s.placed[page]||[];if(s.placed[page].includes(name))return;const id=CP138_IDS[name];if(pgHave(id)<1)return;
 PG.items[id]=pgHave(id)-1;try{pgSave();}catch(e){}s.placed[page].push(name);cp138Save(s);const now=performance.now()/1000,at=cp138Center(page,name);
 CP138.fx.push({kind:'place',page,name,t:now,len:1.45,at,glints:[0,1,2,3,4,5,6].map(i=>({x:Math.cos(i*2.4)*rand(14,44),y:Math.sin(i*2.4)*rand(10,36),d:.29+i*.05,r:rand(6,10)}))});
 try{pgSfx('stamp');}catch(e){}
 if(s.placed[page].length===CP138_DATA.pages[page].length){CP138.fx.push({kind:'complete',page,t:now+.9,len:2.3,glints:Array.from({length:14},(_,i)=>({x:rand(30,340),y:rand(40,460),d:.5+i*.06,r:rand(7,11)}))});setTimeout(()=>{try{pgSfx('win');}catch(e){}cp138Ui();},900);}
 try{diagEvent('cp138','place '+page+' '+name);}catch(e){}cp138Ui();}
// the screen (a DOM overlay like the board lists)
function cp138Build(){if(CP138.el)return CP138.el;const el=document.createElement('div');el.id='cp138';
 el.style.cssText='position:fixed;inset:0;z-index:60;display:none;flex-direction:column;align-items:center;background:#171123;color:#fae9cd;font-family:system-ui;overflow:hidden;touch-action:none;user-select:none';
 el.innerHTML='<div style="width:100%;max-width:460px;display:flex;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 12px 6px;box-sizing:border-box"><b style="flex:1;font-size:22px">Collections <small style="font-size:12px;color:#c9b8cd">(test)</small></b><button data-a="old" style="min-height:40px;padding:0 12px;margin-right:8px;border-radius:10px;border:1px solid #6b5a8a;background:#30233f;color:#fae9cd;font-weight:700">Old pages</button><button data-a="close" style="min-height:40px;padding:0 16px;border-radius:10px;border:1px solid #6b5a8a;background:#392b47;color:#fae9cd;font-weight:700">Close</button></div>'+
  '<div id="cp138tabs" style="width:100%;max-width:460px;display:flex;flex-wrap:wrap;gap:6px;padding:0 12px;box-sizing:border-box"></div><div id="cp138status" style="margin:6px 0 4px;font-weight:700;font-size:14px;color:#c9b8cd"></div>'+
  '<canvas id="cp138cv" width="736" height="984" style="border:1px solid #a58370;border-radius:4px;background:#241a35"></canvas><div id="cp138msg" style="margin:6px 0;font-size:13px;color:#eac484;text-align:center"></div>'+
  '<div style="width:100%;max-width:460px;padding:0 12px 12px;box-sizing:border-box"><div style="background:#614332;border:2px solid #c69a70;border-radius:12px;padding:6px 8px"><b style="font-size:15px">Satchel</b><div id="cp138sat" style="display:flex;gap:8px;overflow-x:auto;padding:6px 0 2px;min-height:70px"></div></div></div>';
 document.body.appendChild(el);CP138.el=el;CP138.cv=el.querySelector('#cp138cv');
 el.querySelector('[data-a=close]').onclick=()=>{try{pgSfx('back');}catch(e){}cp138Close();};
 el.querySelector('[data-a=old]').onclick=()=>{try{pgSfx('tap');}catch(e){}cp138Close();try{CP138.oldPass=true;openLoopScreen('water');}finally{CP138.oldPass=false;}};
 el.addEventListener('pointermove',cp138Move);el.addEventListener('pointerup',cp138Up);el.addEventListener('pointercancel',cp138Up);
 return el;}
function cp138Fit(){const el=CP138.el,c=CP138.cv;if(!el)return;const top=el.querySelector('#cp138cv').getBoundingClientRect().top,avail=window.innerHeight-top-150,w=Math.min(window.innerWidth-24,368*1.25,avail*368/492);c.style.width=Math.max(200,w)+'px';c.style.height=Math.max(200,w)*492/368+'px';}
function cp138Ui(){const el=cp138Build(),page=CP138.page,placed=cp138Placed(page),names=CP138_DATA.pages[page];
 el.querySelector('#cp138tabs').innerHTML=CP138_PAGES.map(p=>{const n=CP138_DATA.pages[p].length,k=cp138Placed(p).size;return '<button data-p="'+p+'" style="flex:1 0 auto;min-height:34px;padding:0 10px;border-radius:8px;font-weight:700;font-size:13px;color:#fae9cd;'+(p===page?'background:#684d72;border:1px solid #eac484':'background:#30233f;border:1px solid #493652')+'">'+p+(k===n?' ✓':'')+'</button>';}).join('');
 for(const b of el.querySelectorAll('#cp138tabs button'))b.onclick=()=>{CP138.page=b.dataset.p;try{pgSfx('tap');}catch(e){}cp138Ui();};
 const done=placed.size===names.length;el.querySelector('#cp138status').textContent=done?'Collection complete':placed.size+' of '+names.length+' placed';el.querySelector('#cp138status').style.color=done?'#eac484':'#c9b8cd';
 const rest=names.filter(n=>!placed.has(n)),have=rest.filter(n=>pgHave(CP138_IDS[n])>0);
 el.querySelector('#cp138msg').textContent=done?'Every prize is in place.':have.length?'Drag a prize from the satchel to its outline.':'Win these prizes on the boards to fill the page.';
 const sat=el.querySelector('#cp138sat');sat.innerHTML='';
 for(const n of rest){const id=CP138_IDS[n],k=pgHave(id),d=document.createElement('div');d.dataset.n=n;d.style.cssText='flex:0 0 auto;width:78px;height:66px;border-radius:8px;background:#3e2a23;border:1px solid #987051;position:relative;'+(k?'':'opacity:.38');
  const sp=cp138Sprite(id),ic=document.createElement('canvas');ic.width=120;ic.height=80;const g=ic.getContext('2d'),[bx,by,bw,bh]=sp.bb,s=Math.min(110/bw,58/bh);g.drawImage(sp.cv,bx,by,bw,bh,60-bw*s/2,32-bh*s/2,bw*s,bh*s);ic.style.cssText='width:60px;height:40px;position:absolute;left:9px;top:3px;pointer-events:none';
  d.appendChild(ic);const lb=document.createElement('div');lb.textContent=n;lb.style.cssText='position:absolute;left:0;right:0;bottom:3px;text-align:center;font-size:10px;pointer-events:none';d.appendChild(lb);
  const ct=document.createElement('div');ct.textContent='×'+k;ct.style.cssText='position:absolute;right:4px;top:2px;font-size:10px;font-weight:700;pointer-events:none';d.appendChild(ct);
  if(k)d.addEventListener('pointerdown',e=>cp138Down(e,n));sat.appendChild(d);}
 if(!rest.length){sat.innerHTML='<div style="padding:18px 6px;font-size:13px">All prizes placed</div>';}
 cp138Fit();cp138Draw();}
function cp138Open(){const el=cp138Build();el.style.display='flex';CP138.t0=performance.now();cp138Ui();if(!CP138.raf)CP138.raf=requestAnimationFrame(cp138Loop);try{diagEvent('cp138','open');}catch(e){}}
function cp138Close(){if(CP138.el)CP138.el.style.display='none';CP138.drag=null;}
// dragging from the satchel onto the painting
function cp138Down(e,n){e.preventDefault();CP138.drag={n,x:e.clientX,y:e.clientY,id:e.pointerId};try{e.target.setPointerCapture&&e.target.releasePointerCapture&&0;}catch(_){}try{pgSfx('tap');}catch(_){}}
function cp138Move(e){const d=CP138.drag;if(!d)return;d.x=e.clientX;d.y=e.clientY;}
function cp138Scene(cx,cy){const r=CP138.cv.getBoundingClientRect();return [(cx-r.left)/r.width*368,(cy-r.top)/r.height*492];}
function cp138Up(e){const d=CP138.drag;if(!d)return;CP138.drag=null;const page=CP138.page,[sx,sy]=cp138Scene(e.clientX,e.clientY);let ok=false;
 if(sx>=0&&sx<=368&&sy>=0&&sy<=492){const R=cp138SlotRect(page,d.n);if(R)ok=sx>=R.x-26&&sx<=R.x+R.w+26&&sy>=R.y-26&&sy<=R.y+R.h+26;else ok=cp138HitAll(page,d.n,sx,sy);}
 if(ok)cp138Place(page,d.n);else{try{pgSfx('back');}catch(_){}}cp138Draw();}
function cp138DrawDrag(){const d=CP138.drag,c=CP138.cv;if(!d)return;const r=c.getBoundingClientRect(),g=c.getContext('2d'),K=c.width/r.width,sp=cp138Sprite(CP138_IDS[d.n]),[bx,by,bw,bh]=sp.bb,s=Math.min(60/bw,60/bh)*(c.width/368);
 g.save();g.globalAlpha=.92;g.drawImage(sp.cv,bx,by,bw,bh,(d.x-r.left)*K-bw*s/2,(d.y-r.top)*K-bh*s/2,bw*s,bh*s);g.restore();}
// Home's COLLECTIONS opens the test while it's on
{const __ol138=openLoopScreen;openLoopScreen=function(view){if(view==='water'&&cp138On()&&!CP138.oldPass&&typeof PGU==='object'&&PGU.screen==='main'){cp138Open();return;}return __ol138.apply(this,arguments);};}
// Developer: Settings > Engineer tools > Collections test
{const __oc138=openCredits;openCredits=function(){const r=__oc138.apply(this,arguments);try{
  const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp138-dev'))return r;
  const box=document.createElement('div');box.id='cp138-dev';const hd=document.createElement('h3');hd.textContent='Collections test (CP-106)';box.appendChild(hd);
  const mk=(t,f)=>{const b=document.createElement('button');b.className='wide';b.textContent=t;b.onclick=()=>{f(b);};box.appendChild(b);return b;};
  const lab=b=>{b.textContent='Collections test: '+(cp138On()?'On':'Off');};const sw=mk('',b=>{cp138SetOn(!cp138On());lab(b);});lab(sw);
  mk('Give all collection prizes',b=>{for(const n in CP138_IDS){const id=CP138_IDS[n];PG.items[id]=Math.min(pgCap(),Math.max(pgHave(id),1));PG.ever[id]=1;}try{pgSave();}catch(e){}b.textContent='Given: one of each collection prize';});
  mk('Reset the test pages',b=>{cp138Save({placed:{}});b.textContent='Test pages reset';});eng.appendChild(box);}catch(e){}return r;};}
// ---- end UAT 138 Collections test ----
