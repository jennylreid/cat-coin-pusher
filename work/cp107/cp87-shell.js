// CP-87 (UAT only; Jenny, Nov 18: "in the UAT build, make another button for it on the home screen ... We can put all the
// games in there"): Home > "Daily puzzles" opens a menu of the five daily-puzzle prototypes (CP-84 Paw Swat, Cat Café;
// CP-85 Pocket Pounce, Moon Mint, Whisker Spark). Each plays full screen in a frame, with a bar to go back to the menu or Home.
// The puzzle pages are embedded unchanged; only a small audio shim is put at the top of each (the app's sound setting, and
// silence while the app is in the background). While the puzzles are open the game is paused (no frames run) and its sound
// is suspended. The game's own state, saves and rounds are not touched; the puzzles keep their own cp84-/cp85- keys.
const CP87_PAGES=/*CP87_PAGES*/{};
const CP87_LIST=[
 {id:'paw-swat',name:'Paw Swat',line:'Swat coins up into a hanging wall. Clear 3 of a colour and what hangs below falls.'},
 {id:'cat-cafe',name:'Cat Café',line:'Serve the cats in the right order. Each bowl pulls in its colour.'},
 {id:'pocket-pounce',name:'Pocket Pounce',line:'Fire the cat’s queue into pockets with a matching mouth.'},
 {id:'moon-mint',name:'Moon Mint',line:'Catch matching stacks through three windows on a turning carousel.'},
 {id:'whisker-spark',name:'Whisker Spark',line:'Tap a stack to fire along its row and column.'},
];
const CP87={open:false,el:null,frame:null,cur:null,acWas:false,openedAt:0};
const CP87_SHIM='<script>(function(){var O=window.AudioContext||window.webkitAudioContext;if(!O)return;'+
 'var P=O.prototype,D=null;while(P&&!D){D=Object.getOwnPropertyDescriptor(P,"destination");P=Object.getPrototypeOf(P);}if(!D)return;'+
 'var L=window.__cp87ac=[];if(window.__cp87vol===undefined)window.__cp87vol=1;'+
 'function C(o){var c=o?new O(o):new O();var g=O.prototype.createGain.call(c);g.connect(D.get.call(c));g.gain.value=window.__cp87vol;'+
 'Object.defineProperty(c,"destination",{get:function(){return g;}});L.push({c:c,g:g});return c;}'+
 'C.prototype=O.prototype;window.AudioContext=C;window.webkitAudioContext=C;'+
 'window.__cp87setVol=function(v){window.__cp87vol=v;L.forEach(function(x){x.g.gain.value=v;});};'+
 'window.__cp87hold=function(h){L.forEach(function(x){try{h?x.c.suspend():x.c.resume();}catch(e){}});};'+
 'window.__cp87close=function(){L.forEach(function(x){try{x.c.close();}catch(e){}});};})();<\/script>';
function cp87Doc(id){const s=CP87_PAGES[id]||'';const m=/<head[^>]*>/i.exec(s);return m?s.slice(0,m.index+m[0].length)+CP87_SHIM+s.slice(m.index+m[0].length):CP87_SHIM+s;}
function cp87Vol(){return (typeof S!=='undefined'&&S.muted)?0:1;}
function cp87Build(){
 if(CP87.el)return CP87.el;
 const st=document.createElement('style');st.textContent=
  '#cp87{position:fixed;inset:0;z-index:2147483000;background:#1d1030;color:#f4ecff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;display:none;flex-direction:column;'+
  'padding:max(var(--safe-top,0px),env(safe-area-inset-top,0px)) max(var(--safe-right,0px),env(safe-area-inset-right,0px)) max(var(--safe-bottom,0px),env(safe-area-inset-bottom,0px)) max(var(--safe-left,0px),env(safe-area-inset-left,0px));box-sizing:border-box;-webkit-user-select:none;user-select:none}'+
  '#cp87 .bar{flex:0 0 auto;height:50px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#2a1846;border-bottom:2px solid #ffd23f}'+
  '#cp87 .bar b{flex:1;text-align:center;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
  '#cp87 button{font:700 15px system-ui,sans-serif;color:#f4ecff;background:#3a2d52;border:1px solid #6b5a8a;border-radius:12px;min-height:40px;min-width:76px;padding:0 12px;touch-action:manipulation}'+
  '#cp87 .menu{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;align-items:center}'+
  '#cp87 .menu h2{margin:4px 0 0;font-size:26px;color:#ffd23f}#cp87 .menu p{margin:0 0 4px;opacity:.8;font-size:14px;text-align:center}'+
  '#cp87 .menu .pz{width:min(100%,380px);text-align:left;padding:14px 16px;border-radius:16px;background:#3a2d52;min-height:64px}'+
  '#cp87 .menu .pz span{display:block;font-size:18px;color:#fff;margin-bottom:3px}#cp87 .menu .pz small{display:block;font-weight:600;font-size:13px;opacity:.78;line-height:1.3}'+
  '#cp87 iframe{flex:1;width:100%;border:0;display:block;background:#000}';
 document.head.appendChild(st);
 const el=document.createElement('div');el.id='cp87';
 el.innerHTML='<div class="bar"><button data-a="back">‹ Puzzles</button><b>Daily puzzles</b><button data-a="home">Home</button></div>'+
  '<div class="menu"><h2>Daily puzzles</h2><p>Prototypes to try. Each one is a different game.</p>'+
  CP87_LIST.map(z=>'<button class="pz" data-p="'+z.id+'"><span>'+z.name+'</span><small>'+z.line+'</small></button>').join('')+'</div>';
 for(const t of ['pointerdown','pointerup','pointermove','touchstart','touchend','touchmove','mousedown','mouseup','click','wheel'])el.addEventListener(t,e=>e.stopPropagation());
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(performance.now()-CP87.openedAt<500)return; // the tap that opened the menu must not also press a card under the finger
  if(b.dataset.p)cp87Play(b.dataset.p);else if(b.dataset.a==='home')cp87Close();else if(b.dataset.a==='back'){if(CP87.cur)cp87Menu();else cp87Close();}});
 document.body.appendChild(el);CP87.el=el;return el;}
function cp87Bar(title,back){const el=CP87.el;el.querySelector('.bar b').textContent=title;el.querySelector('[data-a="back"]').style.visibility=back?'visible':'hidden';}
function cp87Stop(){const f=CP87.frame;CP87.frame=null;CP87.cur=null;if(!f)return;
 try{f.contentWindow.__cp87close&&f.contentWindow.__cp87close();}catch(e){}try{f.srcdoc='';f.remove();}catch(e){}}
function cp87Menu(){cp87Stop();const el=CP87.el;el.querySelector('.menu').style.display='flex';cp87Bar('Daily puzzles',false);}
function cp87Play(id){const z=CP87_LIST.find(q=>q.id===id);if(!z||!CP87_PAGES[id])return;cp87Stop();
 const el=CP87.el;el.querySelector('.menu').style.display='none';cp87Bar(z.name,true);
 const f=document.createElement('iframe');f.title=z.name;f.setAttribute('allow','autoplay');
 f.onload=()=>{try{f.contentWindow.__cp87setVol&&f.contentWindow.__cp87setVol(cp87Vol());}catch(e){}};
 f.srcdoc=cp87Doc(id);el.appendChild(f);CP87.frame=f;CP87.cur=id;try{diagEvent('progress','cp87 '+id);}catch(e){}}
function cp87OpenMenu(){const el=cp87Build();CP87.open=true;CP87.openedAt=performance.now();el.style.display='flex';cp87Menu();
 setTimeout(()=>{if(!CP87.open)return;try{CP87.acWas=!!(ac&&ac.state==='running');if(CP87.acWas)ac.suspend();}catch(e){}},250); // after the tap soundtry{recordedSfx.stopAll();}catch(e){}
 try{diagEvent('progress','cp87 menu');}catch(e){}}
function cp87Close(){cp87Stop();if(CP87.el)CP87.el.style.display='none';CP87.open=false;
 try{if(CP87.acWas&&ac)ac.resume();}catch(e){}CP87.acWas=false;try{last=performance.now();acc=0;}catch(e){}}
// the game is paused while the puzzles are open (Home is between rounds, so nothing is in play)
const __cp87Frame=frameBody;
frameBody=function(now){if(CP87.open){last=now;acc=0;requestAnimationFrame(frame);return;}return __cp87Frame(now);};
// background: the puzzle goes quiet too, and comes back with the app's sound setting
const __cp87Paused=appPaused;
appPaused=function(p){try{const w=CP87.frame&&CP87.frame.contentWindow;if(w&&w.__cp87hold){w.__cp87hold(!!p);if(!p&&w.__cp87setVol)w.__cp87setVol(cp87Vol());}}catch(e){}return __cp87Paused?__cp87Paused(p):undefined;};
// Home: the "Daily puzzles" button under PLAY
function cp87Btn(){const L=PGA.L,R=pgMainRects();if(!L||!L.play)return null;const w=176,h=36;let y=L.play.y+L.play.h+14;y=Math.min(y,R.bot-h-2);return {x:200-w/2,y,w,h};}
function cp87Free(){return PGU.screen==='main'&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door;}
const __cp87Draw=pgDrawMain;
pgDrawMain=function(dt){const r=__cp87Draw(dt);try{if(cp87Free()){const b=cp87Btn();if(b){
 uiRound(b.x,b.y,b.w,b.h,18,'rgba(47,181,168,.92)','rgba(220,255,250,.85)',1.5);
 ctx.save();ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText('Daily puzzles',200,b.y+b.h/2+1);ctx.restore();}}}catch(e){}return r;};
const __cp87Tap=pgMainTap;
pgMainTap=function(p){try{if(cp87Free()){const b=cp87Btn();if(b&&contains({x:b.x-4,y:b.y-4,w:b.w+8,h:b.h+8},p)){pgSfx('tap');cp87OpenMenu();return;}}}catch(e){}return __cp87Tap(p);};
