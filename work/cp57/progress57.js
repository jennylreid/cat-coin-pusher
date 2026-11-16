// ---------- CP-45 Gameplay map prototype (UAT 49; UAT 50 rework) ----------
// UAT 50 (Jenny, Nov 14): the game opens on a short CatCoin title screen, then the Tuxedo's coin board. The board is
// home: no Home screen; a bar across the top of the board between rounds opens Kitchen, Porch, Album, Shop and Boards.
// The chain from GAMEPLAY_MAP.md, with placeholder art drawn in code: the coin board (level, coins, Catnip, buttons)
// -> a cat's board (Wild 2 or a mode) -> prizes become ingredients -> Kitchen (recipes by level, drop ingredients
// in the pot, stir, ding) -> Porch (2 food spots; a cat eats, stays a hidden while, real time; tap the camera) ->
// Album (a page per cat, a prize page; a full page stamps and gives Catnip) -> the cat's coin drops now and then on any
// board -> push it off and that cat's board opens. Shop: sell prizes, buy ingredients you can't win. Every item stops at
// a cap; extras turn into coins at once. Boards: Tuxedo = Wild 2, Orange = Treat toss, Ragdoll = Cozy,
// Siamese = Laser chase, Tortoiseshell = Tower wall. Other cats are recoloured COPIES of the Tuxedo art (never changed).
// Saved on this phone under catpusher.uat.progress.v1 (Developer dials under catpusher.uat.progressdev.v1).
const PG_KEY='catpusher.uat.progress.v1',PG_DEV_KEY='catpusher.uat.progressdev.v1',PG_DEVON_KEY='catpusher.uat.devdefault.v1';
const PG_CATS=['tuxedo','orange','ragdoll','siamese','tortie'];
const PG_CAT={
 tuxedo:{name:'Tuxedo',mode:null,board:'Tuxedo',own:['bowtie','notes'],fur:'#16161c',light:'#ffffff',tag:'#3a3a4a',eye:'#ffd21a'},
 orange:{name:'Orange',mode:'treats',board:'Treat toss',own:['tuna','yarn'],fur:'#ee8a2c',light:'#fff1dc',tag:'#d8701a',eye:'#7ad65a'},
 ragdoll:{name:'Ragdoll',mode:'cozy',board:'Cozy',own:['cheese','cushion'],fur:'#8f7d6e',light:'#fbf6ee',tag:'#8a6aa8',eye:'#6aaeff'},
 siamese:{name:'Siamese',mode:'laser',board:'Laser chase',own:['shrimp','bell'],fur:'#4e3626',light:'#f3e6cf',tag:'#3f6fc9',eye:'#4f9bff'},
 tortie:{name:'Tortoiseshell',short:'Tortie',mode:'towers',board:'Tower wall',own:['mouse','duck'],fur:'#231c1a',fur2:'#d9782e',light:'#f6e2c8',tag:'#a8401f',eye:'#c8d64a'}};
const PG_COMMON=['biscuit','milk','egg','feather','sardine']; // on every board
const PG_NEW_PRIZES=['bowtie','notes','cushion','biscuit','milk','egg','feather','sardine']; // drawn in code here
const PG_PRIZES=[...PG_CATS.flatMap(c=>PG_CAT[c].own),...PG_COMMON];
const PG_NAMES={bowtie:'Bow tie',notes:'Music notes',cushion:'Cushion',biscuit:'Fish biscuit',milk:'Milk',egg:'Egg',feather:'Feather',sardine:'Sardine'};
// Prices: sell / buy (buy only what no opened board drops)
function pgOwner(id){return PG_CATS.find(c=>PG_CAT[c].own.includes(id))||null;}
function pgSell(id){return pgOwner(id)?15:8;}
function pgBuy(id){return pgOwner(id)?60:30;}
// Recipes: unlock by level; each needs a prize from another cat's board (or the Shop).
const PG_RECIPES=[
 {id:'tunadish',name:'Tuna dish',short:'tuna',cat:'orange',level:2,need:{tuna:1,notes:1,biscuit:1,milk:1}},
 {id:'cheeseplate',name:'Cheese plate',short:'cheese',cat:'ragdoll',level:3,need:{cheese:1,yarn:1,egg:2}},
 {id:'skewers',name:'Shrimp skewers',short:'shrimp',cat:'siamese',level:4,need:{shrimp:1,sardine:2,notes:1}},
 {id:'fishpie',name:'Fish pie',short:'fish pie',cat:'tortie',level:5,need:{sardine:2,egg:1,bell:1}},
 {id:'supper',name:'Formal supper',short:'supper',cat:'tuxedo',level:6,need:{sardine:1,milk:1,cushion:1,bowtie:1}}];
const PG_R=Object.fromEntries(PG_RECIPES.map(r=>[r.id,r]));
const PG_SWITCH_LEVEL=5,PG_STAR2=20,PG_POSES=['calm','sweet','wild'];
const PG_DEV={window:0,xp:1,cap:9}; // window 0 = real time (20 min to 2 h); else seconds
try{const d=JSON.parse(localStorage.getItem(PG_DEV_KEY)||'null');if(d){if(Number.isFinite(+d.window))PG_DEV.window=Math.max(0,+d.window);if(Number.isFinite(+d.xp))PG_DEV.xp=Math.max(1,+d.xp);if(Number.isFinite(+d.cap))PG_DEV.cap=Math.max(1,Math.min(99,+d.cap));}}catch(e){}
function pgDevSave(){try{localStorage.setItem(PG_DEV_KEY,JSON.stringify(PG_DEV));}catch(e){}}
function pgFresh(){return {v:1,level:1,xp:0,coins:0,catnip:0,items:{},ever:{},recipes:{},dishes:{},porch:[null,null],photos:{},coinReady:{},
 open:{tuxedo:1},openOrder:['tuxedo'],current:'tuxedo',stars:{},rounds:0,stamped:{},lastMove:-1,won:false,wonShown:false,seen:{},newBoard:null,newPhoto:false};}
let PG=null,PG_INIT=false,PG_HOME_OFF=false;
const PGU={modes:false,modesT:0,sc:{at:-9,kind:null,hearts:[]},screen:'title',title:{t:0,coins:[],snd:0},fade:0,warmT:0,reenter:false,oldBoards:false,t:0,T:0,toasts:[],floats:[],fx:[],door:null,pick:false,pickT:0,cat:{tap:-9,hearts:[]},k:{sel:null,cook:null},
 porch:{pick:null,flash:0,fly:null,chirp:3},album:{page:0,flipT:9,dir:1,stampT:9},shop:{tab:'sell',flies:[],jarT:9},moment:null,boardCat:'tuxedo',level:null,win:null,sw:null};
function pgSave(){try{localStorage.setItem(PG_KEY,JSON.stringify(PG));}catch(e){}}
function pgNow(){return Date.now();}
function pgInit(){
 if(PG_INIT)return;PG_INIT=true;let d=null;try{d=JSON.parse(localStorage.getItem(PG_KEY)||'null');}catch(e){}
 if(d&&d.v===1){PG={...pgFresh(),...d};if(!Array.isArray(PG.porch)||PG.porch.length!==2)PG.porch=[null,null];}
 else{ // first open on this build: a UAT 48 save carries over, capped (extras become coins once)
  PG=pgFresh();PG.coins=Math.max(0,Math.round(S.coins||0));let extra=0;
  for(const id of ['cheese','shrimp','tuna']){const n=Math.max(0,(S.got&&S.got[id])|0);const keep=Math.min(n,PG_DEV.cap);PG.items[id]=keep;if(keep)PG.ever[id]=1;extra+=(n-keep)*pgSell(id);}
  PG.coins+=extra;PG.migrated={coins:S.coins|0,extra,at:new Date().toISOString()};pgSave();
  try{diagEvent('progress','new save coins='+PG.coins+' extra='+extra);}catch(e){}}
 PGU.screen=PG_HOME_OFF?'board':'title';PGU.title={t:0,coins:[],snd:0};
 try{if(/UAT/.test(BUILD)&&!localStorage.getItem(PG_DEVON_KEY)){S.dev=true;save();localStorage.setItem(PG_DEVON_KEY,'1');try{diagEvent('progress','developer on by default (UAT)');}catch(e){}}}catch(e){}
}
function pgCap(){return PG_DEV.cap;}
function pgHave(id){return PG.items[id]|0;}
function pgFloat(text,x,y,color){PGU.floats.push({text,x,y,t:0,color:color||'#ffd23f'});}
// Adds n of a prize, stopping at the cap: anything over turns into coins at once (a clink and a small "+n").
function pgAddItem(id,n=1,x=200,y=300){
 const room=Math.max(0,pgCap()-pgHave(id)),k=Math.min(room,n),over=n-k;PG.items[id]=pgHave(id)+k;if(n>0)PG.ever[id]=1;
 if(over>0){const c=over*pgSell(id);PG.coins+=c;pgFloat('+'+c,x,y,'#ffd23f');pgSfx('clink');}
 pgCheckStamps();pgSave();return over;}
function pgXPNeed(L){return 50+30*(L-1);}
function pgAddXP(n){PG.xp+=Math.round(n*PG_DEV.xp);const ups=[];while(PG.xp>=pgXPNeed(PG.level)){PG.xp-=pgXPNeed(PG.level);PG.level++;ups.push(PG.level);pgUnlocks(PG.level);}
 if(ups.length){PGU.level={L:PG.level,t:0};pgSfx('levelup');}pgSave();return ups;}
function pgUnlocks(L){for(const r of PG_RECIPES)if(r.level===L&&!PG.recipes[r.id]&&!(PG.photos[r.cat]>0)){PG.recipes[r.id]=1;PG.seen['r:'+r.id]=0;}
 pgToast('LEVEL '+L+'!','#7dff6a');
 if(L===2)pgToast('Kitchen, Porch and Shop are open: buttons up top','#ffe08a');
 const r=PG_RECIPES.find(r=>r.level===L);if(r)pgToast('New recipe: '+r.name,'#ffe08a');
 if(L===PG_SWITCH_LEVEL)pgToast('You can switch boards now: Boards, up top','#ffe08a');}
function pgToast(text,color,icon){PGU.toasts.push({text,color:color||'#fff',t:0,dur:2.6,icon:icon||null});if(PGU.toasts.length>6)PGU.toasts.shift();}
// --- which recipe the game is steering toward, and what it still needs ---
function pgRecipeOpen(r){return PG.level>=r.level;}
function pgCurrentRecipe(){
 const open=PG_RECIPES.filter(r=>pgRecipeOpen(r)&&!(PG.photos[r.cat]>0)&&!(PG.porch.some(s=>s&&s.cat===r.cat&&s.state!=='missed'))&&!(PG.dishes[r.id]>0));
 return open.find(r=>PG.recipes[r.id])||open[0]||null;}
function pgMissing(r){const m={};if(!r)return m;for(const id in r.need){const k=r.need[id]-pgHave(id);if(k>0)m[id]=k;}return m;}
function pgCanCook(r){return !!(r&&pgRecipeOpen(r)&&PG.recipes[r.id]&&!Object.keys(pgMissing(r)).length);}
// --- boards ---
function pgPool(cat){return [...PG_CAT[cat].own,...PG_COMMON];}
function pgWinnable(id){return PG_CATS.some(c=>PG.open[c]&&pgPool(c).includes(id));}
function pgNewest(){return PG.openOrder[PG.openOrder.length-1]||'tuxedo';}
function pgCanPlay(cat){return !!PG.open[cat]&&(PG.level>=PG_SWITCH_LEVEL||cat===pgNewest());}
function pgCatOfMode(m){return PG_CATS.find(c=>PG_CAT[c].mode===m)||'tuxedo';}
// The round's prize list: 5-7 prizes from the board's pool, weighted toward what the current recipe still needs.
function pgRoundList(cat){
 const pool=pgPool(cat),miss=pgMissing(pgCurrentRecipe()),n=Math.min(pool.length,PG.level<=2?5:PG.level<=4?6:7),out=[],w=pool.map(id=>miss[id]?6:PG_CAT[cat].own.includes(id)?2:1);
 while(out.length<n){let tot=0;pool.forEach((id,i)=>{if(!out.includes(id))tot+=w[i];});let r=Math.random()*tot;for(let i=0;i<pool.length;i++){if(out.includes(pool[i]))continue;r-=w[i];if(r<0){out.push(pool[i]);break;}}if(r>=0)break;}
 return out;}
const PG_DEFAULT_LIST=WILD_COLLECTION.slice();
function pgSetList(ids){WILD_COLLECTION.splice(0,WILD_COLLECTION.length,...ids);WILD_GOAL=WILD_COLLECTION.length;}
// Wild's prefill places the list on its seven prize spots (tuna's centre spot first).
function pgRoundPrizes(spots){if(!PG||PG_HOME_OFF||!WILD.on)return spots;return WILD_COLLECTION.slice(0,spots.length).map((id,i)=>[id,spots[i][1],spots[i][2]]);}
// --- new prizes, drawn in code (128 px canvases, like Wild's yarn and duck) ---
for(const id of PG_NEW_PRIZES){if(!WILD_PRIZES.includes(id))WILD_PRIZES.push(id);PRIZE_OPAQUE[id]=.86;PRIZE_ASPECT[id]=1;WILD_PRIZE_NAMES[id]=PG_NAMES[id];}
function pgName(id){return WILD_PRIZE_NAMES[id]||PG_NAMES[id]||id;}
const __pgPrizeArt=wildPrizeArt;
wildPrizeArt=function(id){
 if(!PG_NEW_PRIZES.includes(id))return __pgPrizeArt(id);if(WILD_ART[id])return WILD_ART[id];
 const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');WILD_ART[id]=cv;g.lineJoin='round';g.lineCap='round';
 g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(64,112,40,9,0,0,7);g.fill();
 if(id==='bowtie'){g.fillStyle='#d8263a';g.strokeStyle='#7a0f1c';g.lineWidth=4;for(const d of [-1,1]){g.beginPath();g.moveTo(64,64);g.lineTo(64+d*50,36);g.quadraticCurveTo(64+d*58,64,64+d*50,92);g.closePath();g.fill();g.stroke();}
  g.fillStyle='#ff5a6e';g.beginPath();g.roundRect(52,50,24,28,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(36,52,8,4,-.4,0,7);g.fill();}
 else if(id==='notes'){g.fillStyle='#ffd23f';g.strokeStyle='#5a3a00';g.lineWidth=4;g.beginPath();g.moveTo(44,90);g.lineTo(44,30);g.lineTo(98,20);g.lineTo(98,80);g.lineTo(90,80);g.lineTo(90,32);g.lineTo(52,40);g.lineTo(52,90);g.closePath();g.fill();g.stroke();
  for(const [x,y] of [[34,92],[88,82]]){g.beginPath();g.ellipse(x,y,15,11,-.4,0,7);g.fill();g.stroke();}}
 else if(id==='cushion'){let gr=g.createLinearGradient(0,30,0,100);gr.addColorStop(0,'#c99bff');gr.addColorStop(1,'#7a4ac8');g.fillStyle=gr;g.strokeStyle='#4a2580';g.lineWidth=4;g.beginPath();g.moveTo(16,40);g.quadraticCurveTo(64,22,112,40);g.quadraticCurveTo(122,68,112,96);g.quadraticCurveTo(64,112,16,96);g.quadraticCurveTo(6,68,16,40);g.closePath();g.fill();g.stroke();
  g.fillStyle='#ffd23f';g.beginPath();g.arc(64,68,7,0,7);g.fill();g.strokeStyle='rgba(74,37,128,.5)';g.lineWidth=2;for(const a of [0,1.57,3.14,4.71]){g.beginPath();g.moveTo(64,68);g.lineTo(64+Math.cos(a)*30,68+Math.sin(a)*18);g.stroke();}}
 else if(id==='biscuit'){g.fillStyle='#d9a05a';g.strokeStyle='#8a5a22';g.lineWidth=4;g.beginPath();g.moveTo(16,64);g.quadraticCurveTo(46,30,86,52);g.lineTo(112,34);g.lineTo(104,64);g.lineTo(112,94);g.lineTo(86,76);g.quadraticCurveTo(46,98,16,64);g.closePath();g.fill();g.stroke();
  g.fillStyle='#8a5a22';g.beginPath();g.arc(34,60,4,0,7);g.fill();for(const [x,y] of [[52,58],[64,70],[72,56]]){g.beginPath();g.arc(x,y,2.4,0,7);g.fill();}}
 else if(id==='milk'){g.fillStyle='#ffffff';g.strokeStyle='#5a7ab8';g.lineWidth=4;g.beginPath();g.moveTo(38,40);g.lineTo(64,22);g.lineTo(90,40);g.lineTo(90,104);g.lineTo(38,104);g.closePath();g.fill();g.stroke();
  g.fillStyle='#6aa8ff';g.fillRect(40,60,48,26);g.fillStyle='#fff';g.font='bold 18px system-ui';g.textAlign='center';g.textBaseline='middle';g.fillText('MILK',64,74);}
 else if(id==='egg'){let gr=g.createRadialGradient(52,48,6,64,64,46);gr.addColorStop(0,'#fffdf4');gr.addColorStop(1,'#ecd9b8');g.fillStyle=gr;g.strokeStyle='#a88a5a';g.lineWidth=4;g.beginPath();g.ellipse(64,66,34,44,0,0,7);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.ellipse(52,48,7,11,-.3,0,7);g.fill();}
 else if(id==='feather'){g.strokeStyle='#6a3aa8';g.lineWidth=4;g.beginPath();g.moveTo(26,108);g.quadraticCurveTo(64,64,104,20);g.stroke();
  for(let i=0;i<9;i++){const u=.2+i*.085,x=26+78*u,y=108-88*u;g.fillStyle=i%2?'#ff7ad5':'#7df0ff';g.beginPath();g.ellipse(x-10,y-4,16,6,-.9,0,7);g.fill();g.beginPath();g.ellipse(x+6,y+10,16,6,-.9,0,7);g.fill();}}
 else if(id==='sardine'){let gr=g.createLinearGradient(0,40,0,90);gr.addColorStop(0,'#5a7a9a');gr.addColorStop(.5,'#c8dcec');gr.addColorStop(1,'#eef6ff');g.fillStyle=gr;g.strokeStyle='#2a4058';g.lineWidth=4;
  g.beginPath();g.moveTo(14,64);g.quadraticCurveTo(50,34,92,58);g.lineTo(116,40);g.lineTo(108,64);g.lineTo(116,88);g.lineTo(92,70);g.quadraticCurveTo(50,94,14,64);g.closePath();g.fill();g.stroke();
  g.fillStyle='#111';g.beginPath();g.arc(30,60,4,0,7);g.fill();g.strokeStyle='rgba(42,64,88,.5)';g.lineWidth=2;g.beginPath();g.moveTo(42,52);g.quadraticCurveTo(46,64,42,76);g.stroke();}
 return cv;};
// --- placeholder cats: recoloured COPIES of the Tuxedo art (the Tuxedo's own art is never changed) ---
const PG_ART={};const PG_ART_KEYS=['head','headSweet','headWild','headSharp','paw','happyMitt'];var PG_ORIG=null;
function pgHex(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function pgRecolor(img,cat){
 const C=PG_CAT[cat];if(!img||!img.width)return img;const k=Math.min(1,900/img.width),cv=document.createElement('canvas');cv.pgW=img.width;cv.pgH=img.height;cv.width=Math.max(1,Math.round(img.width*k));cv.height=Math.max(1,Math.round(img.height*k));
 const g=cv.getContext('2d');g.drawImage(img,0,0,cv.width,cv.height);let d;try{d=g.getImageData(0,0,cv.width,cv.height);}catch(e){return img;}
 const p=d.data,fa=pgHex(C.fur),fb=C.fur2?pgHex(C.fur2):null,li=pgHex(C.light),Wd=cv.width,Hd=cv.height;
 for(let y=0;y<Hd;y++){const v=y/Hd;for(let x=0;x<Wd;x++){const i=(y*Wd+x)*4;if(p[i+3]<6)continue;const r=p[i],gg=p[i+1],b=p[i+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);if(mx-mn>46)continue;
  const L=(r+gg+b)/765;let f=fa;if(fb){const u=x/Wd;if(Math.sin(u*9.1+v*3.7)+Math.sin(u*4.3-v*8.2+1.3)+Math.sin((u+v)*6.1+2.1)>.55)f=fb;}
  p[i]=f[0]+(li[0]-f[0])*L;p[i+1]=f[1]+(li[1]-f[1])*L;p[i+2]=f[2]+(li[2]-f[2])*L;}}
 g.putImageData(d,0,0);return cv;}
function pgArt(cat,key){
 if(!PG_ORIG&&ART.head)PG_ORIG=Object.fromEntries(PG_ART_KEYS.map(k=>[k,ART[k]]));if(!PG_ORIG)return null;
 if(cat==='tuxedo')return PG_ORIG[key];const id=cat+':'+key;if(!PG_ART[id])PG_ART[id]=pgRecolor(PG_ORIG[key],cat);return PG_ART[id];}
function pgArtReady(cat,key){return cat==='tuxedo'||!!PG_ART[cat+':'+key];}
// Swaps the board's cat art for the cat's copy while its board plays; the originals come back on the way out.
function pgApplyArt(cat){if(!PG_ORIG&&ART.head)PG_ORIG=Object.fromEntries(PG_ART_KEYS.map(k=>[k,ART[k]]));if(!PG_ORIG)return;for(const k of PG_ART_KEYS)if(PG_ORIG[k])ART[k]=pgArt(cat,k)||PG_ORIG[k];}
function pgRestoreArt(){if(PG_ORIG)for(const k of PG_ART_KEYS)if(PG_ORIG[k])ART[k]=PG_ORIG[k];}
// Warm the copies one picture per frame on Home, so a board opens without a hitch.
function pgWarm(){if(!PG_ORIG&&ART.head)PG_ORIG=Object.fromEntries(PG_ART_KEYS.map(k=>[k,ART[k]]));if(!PG_ORIG)return;
 const cats=[PG.current,...PG_CATS.filter(c=>PG.open[c]||PG.porch.some(s=>s&&s.cat===c)||PG.photos[c]),...PG_CATS];
 for(const c of cats){if(c==='tuxedo')continue;for(const k of (PG.open[c]?PG_ART_KEYS:['head','headSweet','headWild']))if(!PG_ART[c+':'+k]){pgArt(c,k);return;}}}
// A cat's head at x,y (centre), width w (the game's 420 x 240 proportions), with simple pupils.
function pgHead(cat,x,y,w,face='calm',o={}){
 const key=face==='sweet'?'headSweet':face==='wild'?'headWild':'head',img=pgArt(cat,key)||pgArt(cat,'head');if(!img)return;const h=w*img.height/img.width;
 ctx.drawImage(img,x-w/2,y-h/2,w,h);
 if(face==='calm'&&!o.noPupils){const lx=o.look||0,ly=o.lookY||0;ctx.fillStyle='#120c12';for(const ex of [.306,.694]){ctx.beginPath();ctx.ellipse(x-w/2+w*ex+lx*w*.012,y-h/2+h*.52+ly*h*.02,w*.018,h*.1,0,0,7);ctx.fill();}
  ctx.fillStyle='#fff';for(const ex of [.306,.694]){ctx.beginPath();ctx.arc(x-w/2+w*ex+w*.012,y-h/2+h*.47,w*.008,0,7);ctx.fill();}}
 if(o.blink&&face==='calm'){ctx.fillStyle=PG_CAT[cat].fur;for(const ex of [.306,.694]){ctx.beginPath();ctx.ellipse(x-w/2+w*ex,y-h/2+h*.52,w*.1,h*.13*o.blink,0,0,7);ctx.fill();}}}
function pgTag(cat,x,y,s=1){const C=PG_CAT[cat],t=C.short||C.name;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.font='bold 14px system-ui';const w=Math.max(54,t.length*8.4+22);
 ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-w/2+8,-8);ctx.lineTo(0,-20);ctx.lineTo(w/2-8,-8);ctx.stroke();
 uiRound(-w/2,-11,w,22,8,C.tag,'#ffe08a',1.5);uiCircle(-w/2+9,0,3,'#ffe08a');ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,5,1);ctx.restore();}
// A sitting cat for the Porch: a body in the cat's colours and its recoloured head.
function pgSittingCat(cat,x,y,s,t,face){const C=PG_CAT[cat];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 const br=1+.02*Math.sin(t*2.4);ctx.fillStyle=C.fur;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;
 ctx.save();ctx.rotate(Math.sin(t*1.7)*.15);ctx.beginPath();ctx.moveTo(40,40);ctx.bezierCurveTo(100,40,96,-30,70,-40);ctx.lineWidth=12;ctx.strokeStyle=C.fur2||C.fur;ctx.stroke();ctx.restore();
 ctx.beginPath();ctx.ellipse(0,20,52*br,58*br,0,0,7);ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.stroke();
 if(C.fur2){ctx.fillStyle=C.fur2;ctx.beginPath();ctx.ellipse(-22,10,18,26,.4,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(26,40,14,18,-.3,0,7);ctx.fill();}
 ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(0,30,26,38,0,0,7);ctx.fill();
 for(const d of [-1,1]){ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(d*22,74,15,9,0,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.stroke();}
 ctx.restore();pgHead(cat,x,y-52*s,170*s,face||'calm',{look:Math.sin(t*.7),blink:(t%4.2)<.12?1:0});}
// --- sounds (Pickup volume dial; sound off or background = silent) ---
function pgSfx(kind,vol=1){try{sfx.pg(kind,vol);}catch(e){}}
sfx.pg=function(kind,vol=1){
 const v=vol*(typeof pickupFx==='object'&&Number.isFinite(pickupFx.volume)?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=this._pgT(),B=(t0,f,a,d)=>this._pgBell(t0,f,a,d);
 if(kind==='door'){this._mt(190,t,.32,'sawtooth',.035*v,null,130);this._mn(t,.3,.05*v,700,4,null,.05);this._mt(95,t+.3,.12,'sine',.25*v,null,55);this._mn(t+.3,.05,.12*v,500,1);}
 else if(kind==='tap'){this._mt(520,t,.08,'triangle',.08*v,null,780);}
 else if(kind==='back'){this._mt(600,t,.1,'triangle',.07*v,null,380);}
 else if(kind==='meow'){const f=480+Math.random()*90;this._mt(f,t,.18,'triangle',.09*v,null,f*1.5);this._mt(f*1.5,t+.16,.34,'triangle',.08*v,null,f*.85);}
 else if(kind==='purr'){for(let i=0;i<6;i++)this._mn(t+i*.06,.05,.05*v,180,1.2);}
 else if(kind==='plop'){this._mt(340,t,.18,'sine',.3*v,null,90);this._mn(t+.04,.22,.09*v,1400,.8);for(let i=0;i<3;i++)this._mt(900+Math.random()*700,t+.08+i*.05,.06,'sine',.04*v,null,1800);}
 else if(kind==='stir'){this._mn(t,.28,.07*v,700+Math.random()*300,.7,null,.08);this._mt(140,t,.12,'sine',.05*v,null,110);}
 else if(kind==='bubble'){this._mt(300+Math.random()*300,t,.07,'sine',.05*v,null,900);}
 else if(kind==='ding'){B(t,1567.98,.18*v,2.2);B(t,2093,.1*v,1.8);B(t+.02,3135.96,.05*v,1.2);this._mn(t+.15,1.4,.04*v,5000,.5,null,.3);}
 else if(kind==='shutter'){this._mn(t,.03,.35*v,4200,1.5);this._mt(1800,t,.02,'square',.06*v);this._mn(t+.09,.04,.3*v,3000,1.5);this._mt(1200,t+.09,.02,'square',.05*v);}
 else if(kind==='bell'){B(t,1318.5,.08*v,1.2);B(t+.18,1567.98,.08*v,1.4);}
 else if(kind==='chirp'){const f=2600+Math.random()*900;for(let i=0;i<2+(Math.random()*2|0);i++)this._mt(f,t+i*.11,.07,'sine',.035*v,null,f*1.35);}
 else if(kind==='clink'){this._pgSteel(t,.5*v,1.2,false);}
 else if(kind==='jar'){this._pgSteel(t,.45*v,.75,true);}
 else if(kind==='till'){try{sfx.kaching();}catch(e){}}
 else if(kind==='flip'){this._mn(t,.22,.1*v,2200,.6,null,.04);this._mn(t+.12,.1,.06*v,900,.8);}
 else if(kind==='stamp'){this._mt(110,t,.2,'sine',.4*v,null,50);this._mn(t,.06,.2*v,600,1);[523.25,659.25,783.99,1046.5].forEach((f,i)=>this._mt(f,t+.2+i*.08,.35,'triangle',.08*v));B(t+.52,2093,.06*v,1.2);}
 else if(kind==='fanfare'||kind==='levelup'){const s=kind==='levelup'?[523.25,659.25,783.99,1046.5]:[392,523.25,659.25,783.99,1046.5,1318.5];s.forEach((f,i)=>{this._mt(f,t+i*.09,.4,'triangle',.1*v);this._mt(f,t+i*.09,.3,'sawtooth',.025*v);});B(t+s.length*.09,2093,.08*v,1.6);this._mn(t+s.length*.09,1,.06*v,6000,.5);}
 else if(kind==='lock'){this._mt(150,t,.12,'square',.05*v,null,90);this._mn(t,.06,.1*v,400,1);}
 else if(kind==='buy'){this._mt(660,t,.1,'triangle',.08*v);this._mt(990,t+.08,.18,'triangle',.08*v);}
 else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}
 else if(kind==='whoosh'){this._mn(t,.35,.08*v,1500,.7,null,.1);}
};
// ===================== the screens =====================
function pgTop(){return Math.max(8,hudLayout().top||0);} // under the phone's status bar
function pgBot(){return H-Math.max(0,hudLayout().bottom||0);} // above the navigation bar
function pgBack(){const y=pgTop()+44;return {x:12,y:y-20,w:84,h:40};}
function pgScreenCatRect(){const y0=pgTop();return {x:262,y:y0+4,w:128,h:80};}
function pgScreenReact(kind){PGU.sc.at=PGU.T;PGU.sc.kind=kind;if(kind==='tap'||kind==='happy'||kind==='purr'){const r=pgScreenCatRect();for(let i=0;i<(kind==='purr'?3:5);i++)PGU.sc.hearts.push({x:r.x+r.w/2+rand(-36,36),y:r.y+30,t:-i*.08});}}
function pgHeart(x,y,s,c){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-12,-2,-7,-12,0,-5);ctx.bezierCurveTo(7,-12,12,-2,0,6);ctx.fill();ctx.restore();}
function pgScreenCat(dt){const r=pgScreenCatRect(),t=PGU.T,S2=PGU.sc,el=t-S2.at,k=S2.kind,cat=PGU.boardCat||PG.current||'tuxedo';
 let dy=0,rot=0,face='calm',sc2=1;const live=el<1.6;
 if(live){if(k==='tap'||k==='happy'){face='sweet';dy=-Math.abs(Math.sin(el*9))*9*(1-el/1.6);}else if(k==='perk'){face='sweet';dy=-14*Math.max(0,1-el*2.2);sc2=1+.08*Math.max(0,1-el*2);}
  else if(k==='purr'){face='sweet';rot=Math.sin(el*24)*.035;}else if(k==='nod'){dy=el<.9?Math.abs(Math.sin(el*Math.PI*2/.45))*6:0;face=el>.3?'sweet':'calm';}}
 const breathe=Math.sin(t*1.6)*2,cx=r.x+r.w/2,cy=r.y+r.h/2+2;ctx.save();ctx.translate(cx,cy+dy+breathe*.5);ctx.rotate(rot);ctx.scale(sc2*(1+breathe*.004),sc2*(1-breathe*.004));
 pgHead(cat,0,0,r.w,face,{look:Math.sin(t*.5)*.8,lookY:Math.sin(t*.37),blink:((t+.3)%5.3)<.13?1:0});ctx.restore();
 for(let i=S2.hearts.length-1;i>=0;i--){const h=S2.hearts[i];h.t+=dt;if(h.t>1.3){S2.hearts.splice(i,1);continue;}if(h.t<0)continue;ctx.save();ctx.globalAlpha=Math.max(0,1-h.t/1.3);pgHeart(h.x+Math.sin(h.t*5)*7,h.y-h.t*50,.9,'#ff6ab8');ctx.restore();}}
function pgHeader(title,color){const y0=pgTop(),b=pgBack();ctx.fillStyle='rgba(18,11,28,.85)';ctx.fillRect(0,0,W,y0+86);
 uiRound(b.x,b.y,b.w,b.h,14,'rgba(255,255,255,.14)','#ffe08a',1.5);ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';pgChevron(b.x+17,b.y+b.h/2,-1,'#fff',6);ctx.fillText('Board',b.x+b.w/2+7,b.y+b.h/2+1);
 ctx.save();ctx.textAlign='left';ctx.font='italic 900 28px Impact, "Arial Black", system-ui';const tz=Math.min(28,28*146/Math.max(1,ctx.measureText(title).width));wildText(title,108,y0+38,tz,color||'#ffd23f','#2a0b3e',6);ctx.restore();
 pgCounters(y0+76);pgScreenCat(PGU.hdt||.016);}
function pgCounters(y){ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='bold 13px system-ui';
 const c=PG.coins,n=PG.catnip;ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins',16,y);ctx.fillStyle='#8dff9a';ctx.fillText(n+' Catnip',16+ctx.measureText(c+' coins').width+14,y);ctx.restore();}
function pgButton(r,label,fill,text,size,off){ctx.save();if(off)ctx.globalAlpha=.45;wildButtonDraw(r,label,fill,text,size||20);ctx.restore();}
function pgPrizeIcon(id,x,y,w,a=1){ctx.save();ctx.globalAlpha*=a;drawPrize('item',id,x,y+w*.3,w/(radius('item')*2.8));ctx.restore();}
function pgPaw(x,y,k,c){uiPaw(x,y,k,c||'#ffe08a');}
function pgLock(x,y,k=1){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,-6,8,Math.PI,0);ctx.stroke();uiRound(-12,-6,24,18,4,'#ffd23f','#8a5a00',1.5);uiCircle(0,2,2.6,'#5a3a00');ctx.restore();}
function pgChevron(x,y,d,c,s){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,s*.5);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-d*s*.5,y-s);ctx.lineTo(x+d*s*.5,y);ctx.lineTo(x-d*s*.5,y+s);ctx.stroke();ctx.restore();}
function pgPlayTri(x,y,c){ctx.save();ctx.fillStyle=c;ctx.strokeStyle='#0c3a12';ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-9,y-12);ctx.lineTo(x+12,y);ctx.lineTo(x-9,y+12);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();}
function pgGearIcon(x,y,r){ctx.save();ctx.translate(x,y);ctx.fillStyle='#e8dcff';for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.fillRect(-3,-r-3,6,7);}uiCircle(0,0,r,'#e8dcff');uiCircle(0,0,r*.42,'#2a1838');ctx.restore();}
function pgCatnipLeaf(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#5fd16a';ctx.strokeStyle='#1f6a28';ctx.lineWidth=1.5;for(const a of [-.6,0,.6]){ctx.save();ctx.rotate(a);ctx.beginPath();ctx.ellipse(0,-9,5,10,0,0,7);ctx.fill();ctx.stroke();ctx.restore();}ctx.restore();}
// --- dishes, drawn in code ---
function pgDish(id,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(0,18,46,10,0,0,7);ctx.fill();
 const plate=id==='cheeseplate'||id==='supper'||id==='skewers';
 if(plate){uiCircle(0,8,44,'#f4f0ff','#9a90b8',2);ctx.save();ctx.scale(1,.42);uiCircle(0,19,44,'#fff');ctx.restore();}
 else{ctx.fillStyle=id==='fishpie'?'#c8783a':'#5a8ad8';ctx.beginPath();ctx.moveTo(-42,0);ctx.quadraticCurveTo(-38,30,0,30);ctx.quadraticCurveTo(38,30,42,0);ctx.closePath();ctx.fill();ctx.fillStyle='#fff';ctx.globalAlpha=.25;ctx.fillRect(-30,8,60,4);ctx.globalAlpha=1;
  ctx.fillStyle=id==='fishpie'?'#e8b06a':'#cfe0ff';ctx.beginPath();ctx.ellipse(0,0,42,10,0,0,7);ctx.fill();}
 if(id==='tunadish'){for(const [dx,dy,c] of [[-16,-6,'#f28aa0'],[4,-10,'#e06a86'],[18,-3,'#f8a8b8'],[-4,-2,'#f5b0c0']]){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(dx,dy,11,7,.3,0,7);ctx.fill();}pgPrizeIcon('biscuit',22,-26,22);}
 else if(id==='cheeseplate'){for(const [dx,dy] of [[-14,-4],[12,-2]]){ctx.fillStyle='#ffd23f';ctx.strokeStyle='#c99a00';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(dx-14,dy+6);ctx.lineTo(dx+14,dy+6);ctx.lineTo(dx+10,dy-12);ctx.closePath();ctx.fill();ctx.stroke();}uiCircle(2,-14,7,'#fffdf4','#a88a5a',1.5);uiCircle(2,-14,3,'#ffc23a');}
 else if(id==='skewers'){for(const d of [-12,12]){ctx.strokeStyle='#a8743a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(d-26,4);ctx.lineTo(d+26,-14);ctx.stroke();for(let i=0;i<3;i++){ctx.strokeStyle='#ff7a4a';ctx.lineWidth=5;ctx.beginPath();ctx.arc(d-14+i*14,-2-i*6,6,.3,4.5);ctx.stroke();}}}
 else if(id==='fishpie'){ctx.strokeStyle='#a0602a';ctx.lineWidth=2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*14-6,-6);ctx.lineTo(i*14+6,6);ctx.stroke();}ctx.fillStyle='#8ab0d0';ctx.beginPath();ctx.moveTo(26,-6);ctx.lineTo(40,-18);ctx.lineTo(40,4);ctx.closePath();ctx.fill();}
 else if(id==='supper'){pgPrizeIcon('sardine',-4,-18,40);pgPrizeIcon('bowtie',22,-24,22);}
 ctx.restore();}
// ---------- HOME ----------
// --- the coin board is home (Jenny, Nov 14). Between rounds (goal card, end card) a bar sits across the top of the
// board, where the round's HUD is, so it never covers the cat's face or the table: level and XP, coins, Catnip,
// Settings, and buttons for Kitchen, Porch, Album, Shop and Boards (a pink paw when something waits). During a round the
// normal HUD is back.
const PG_DOCK_IDS=['kitchen','porch','album','shop','board'],PG_DOCK_LEVEL={kitchen:2,porch:2,album:0,shop:2,board:0};
const PG_DOCK_COL={board:['#ffb23f','#a8400f'],kitchen:['#ff8a5a','#7a2a1a'],porch:['#7ad65a','#1f5a1a'],album:['#d06aff','#4a1a6a'],shop:['#4fd0ff','#0a4a6a']};
function pgDockName(id){return {kitchen:'Kitchen',porch:'Porch',album:'Album',shop:'Shop',board:'Boards'}[id];}
function pgRestPhase(){return !!(PG&&!PG_HOME_OFF&&WILD.on&&!inventoryOpen&&PGU.screen==='board'&&(WILD.phase==='card'||(WILD.phase==='end'&&WILD.endT>=.9)));}
// The bar never reaches the cat's ear tips (about 10 px under VIEW.y), whatever the status bar's height: with less
// than 74 px of room it becomes one compact row (icon buttons, the XP as a ring around the level badge).
function pgDockLimit(){return (typeof VIEW==='object'&&Number.isFinite(VIEW.y)?VIEW.y:90)+10;}
function pgDock(){const h=hudLayout(),top=h.top,bot=Math.max(top+40,Math.min(Math.max(top+78,h.headerBottom+2),pgDockLimit()));
 if(bot-top<74){const rh=bot-top-8,cy=top+3+rh/2,n=S.dev?6:5,x0=42,x1=262,tw=(x1-x0-4*(n-1))/n,rect=i=>({x:x0+i*(tw+4),y:top+3,w:tw,h:rh});
  return {compact:true,top,bottom:bot,y1:cy,cy,rh,gear:{x:370,y:top+2,w:30,h:rh+2},coll:{x:316,y:top+2,w:26,h:rh+2},inv:{x:342,y:top+2,w:26,h:rh+2},modes:S.dev?rect(5):null,tiles:PG_DOCK_IDS.map((id,i)=>({id,...rect(i),level:PG_DOCK_LEVEL[id]}))};}
 const y1=top+15,ty=top+31,th=bot-ty-5,gap=5,tw=(W-12-gap*4)/5;
 return {top,bottom:bot,y1,gear:{x:W-40,y:top,w:40,h:30},coll:{x:248,y:top+1,w:30,h:28},inv:{x:280,y:top+1,w:30,h:28},modes:S.dev?{x:314,y:top+4,w:44,h:22}:null,tiles:PG_DOCK_IDS.map((id,i)=>({id,x:6+i*(tw+gap),y:ty,w:tw,h:th,level:PG_DOCK_LEVEL[id]}))};}
function pgWaiting(id){
 if(id==='kitchen')return PG_RECIPES.some(r=>pgCanCook(r))||PG_RECIPES.some(r=>PG.recipes[r.id]&&PG.seen['r:'+r.id]===0);
 if(id==='porch')return PG.porch.some(s=>s&&(s.state==='visit'||s.state==='missed'))||(PG.level>=2&&PG.porch.some(s=>!s)&&Object.values(PG.dishes).some(n=>n>0));
 if(id==='album')return !!PG.newPhoto;
 if(id==='board')return !!PG.newBoard;
 if(id==='shop'){const m=pgMissing(pgCurrentRecipe());return Object.keys(m).some(i=>!pgWinnable(i)&&PG.coins>=pgBuy(i));}
 return false;}
function pgDrawDock(){
 const D=pgDock(),t=PGU.T,a=WILD.phase==='card'?Math.min(1,(WILD.cardT||0)/.2):Math.min(1,((WILD.endT||0)-.9)/.2);if(!(a>0))return;
 ctx.save();ctx.globalAlpha=a;ctx.textBaseline='middle';
 let gr=ctx.createLinearGradient(0,0,0,D.bottom);gr.addColorStop(0,'#160a24');gr.addColorStop(1,'#2c1544');ctx.fillStyle=gr;ctx.fillRect(0,0,W,D.bottom);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,D.bottom,W,4);ctx.fillStyle='#ffe08a';ctx.fillRect(0,D.bottom-2,W,2);
 if(D.compact){pgDrawDockCompact(D,t);ctx.restore();return;}
 // level badge and XP bar
 const y=D.y1,need=pgXPNeed(PG.level),u=Math.min(1,PG.xp/need),bx=40,bw=100;
 uiCircle(21,y,14,'#ffd23f','#fff6d0',2);ctx.fillStyle='#3a1a00';ctx.textAlign='center';ctx.font='900 16px Impact, system-ui';ctx.fillText(PG.level,21,y+1);
 uiRound(bx,y-8,bw,16,8,'rgba(255,255,255,.12)','#ffe08a',1);if(u>0)uiRound(bx+1,y-7,Math.max(14,(bw-2)*u),14,7,'#7dff6a');
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui';ctx.fillText(PG.xp+' / '+need+' XP',bx+bw/2,y+1,bw-8);
 // coins (the jar) and Catnip
 uiCircle(152,y,8,'#f5c632','#a8740c',1.5);pgPaw(152,y+1,.16,'#a8740c');ctx.textAlign='left';ctx.font='bold 15px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,163,y+1,48);
 const cx=163+Math.min(48,ctx.measureText(String(PG.coins)).width)+15;pgCatnipLeaf(cx,y+7,.72);ctx.fillStyle='#8dff9a';ctx.fillText(PG.catnip,cx+12,y+1);
 // Collections and Inventory (moved up from the bottom strip), MODES (Developer only), Settings
 pgCollIcon(D.coll.x+D.coll.w/2,y);pgInvIcon(D.inv.x+D.inv.w/2,y);
 if(D.modes){const m=D.modes;uiRound(m.x,m.y,m.w,m.h,10,'rgba(20,60,60,.92)','#5ef0c0',1.5);ctx.fillStyle='#d8fff2';ctx.textAlign='center';ctx.font='900 11px Impact, system-ui';ctx.fillText('MODES',m.x+m.w/2,m.y+m.h/2+1);}
 pgGearIcon(D.gear.x+D.gear.w/2,y,9);
 // the buttons
 for(const r of D.tiles){const id=r.id,col=PG_DOCK_COL[id],locked=r.level&&PG.level<r.level,cxr=r.x+r.w/2,cyr=r.y+r.h/2;
  const pr=PGU.door&&PGU.door.id===id?Math.min(1,PGU.door.t/.24):0,press=1-.1*Math.sin(pr*Math.PI);
  ctx.save();ctx.translate(cxr,cyr);ctx.scale(press,press);ctx.translate(-cxr,-cyr);
  uiRound(r.x,r.y+3,r.w,r.h,12,'rgba(0,0,0,.4)');const g2=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g2.addColorStop(0,col[0]);g2.addColorStop(1,col[1]);uiRound(r.x,r.y,r.w,r.h,12,g2,'#fff6d0',1.5);
  const k=Math.max(.3,Math.min(.5,(r.h-18)/62));ctx.save();ctx.beginPath();ctx.rect(r.x+2,r.y+2,r.w-4,r.h-16);ctx.clip();ctx.translate(cxr,r.y+(r.h-14)/2+3);ctx.scale(k,k);pgDoorIcon(id,0,0,t);ctx.restore();
  ctx.textAlign='center';wildText(locked?'LEVEL '+r.level:pgDockName(id).toUpperCase(),cxr,r.y+r.h-9,11,locked?'#ffe08a':'#fff',col[1],3);
  if(locked){uiRound(r.x,r.y,r.w,r.h,12,'rgba(10,6,20,.55)');pgLock(r.x+r.w-13,r.y+14,.62);wildText('LEVEL '+r.level,cxr,r.y+r.h-9,11,'#ffe08a','#2a1838',3);}
  else if(pgWaiting(id)){const px=r.x+r.w-10,py=r.y+10,kk=1+.12*Math.sin(t*6);uiCircle(px,py,10*kk,'#fff','#ff6ab8',2);pgPaw(px,py+1,.24*kk,'#ff3a8a');}
  ctx.restore();}
 ctx.restore();}

// Small code-drawn icons for the bar: Collections (a fan of cards) and Inventory (a satchel).
function pgCollIcon(x,y){ctx.save();ctx.translate(x,y);for(const [dx,r,c] of [[-5,-.25,'#abd1c8'],[5,.25,'#e4f0df'],[0,0,'#2f7279']]){ctx.save();ctx.translate(dx,1);ctx.rotate(r);uiRound(-6,-9,12,17,2,c,'#f6dfa4',1.2);ctx.restore();}ctx.fillStyle='#f5d58c';ctx.beginPath();ctx.moveTo(-3,-5);ctx.lineTo(3,-5);ctx.lineTo(3,3);ctx.lineTo(0,1);ctx.lineTo(-3,3);ctx.closePath();ctx.fill();ctx.restore();}
function pgInvIcon(x,y){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#f6dfa4';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-5,5,Math.PI,0);ctx.stroke();uiRound(-10,-5,20,15,4,'#b0602a','#f6dfa4',1.2);uiRound(-10,-5,20,7,3,'#8a4418');uiCircle(0,1,2.2,'#ffd23f');ctx.restore();}
// ---- UAT 51: on the cat boards nothing takes taps in the bottom strip (Jenny, Nov 14: "a lot of tapping takes place at
// the bottom of the screen"). Collections and Inventory move to the top bar between rounds; Settings is a small gear in
// the top HUD during a round (between EXIT and the sound button). Info-only readouts stay low.
function pgOwnHud(){return !!(PG&&!PG_HOME_OFF&&WILD.on&&PGU.screen==='board');}
const PG_OFF={x:-999,y:-999,w:0,h:0};
const __pgInvBtn=inventoryButton;inventoryButton=function(){return pgOwnHud()?PG_OFF:__pgInvBtn();};
const __pgCollTile=collectionsTile;collectionsTile=function(){return pgOwnHud()?{...PG_OFF,placement:'off'}:__pgCollTile();};
function pgPlayGear(){const h=hudLayout();return {x:W-h.right-80,y:h.mainY-17,w:36,h:34};}
function pgDrawPlayGear(){const g=pgPlayGear();uiCircle(g.x+g.w/2,g.y+g.h/2,15,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);pgGearIcon(g.x+g.w/2,g.y+g.h/2,8);}
// MODES (Developer only): the game's own modes picker, shown over the board.
function pgDrawModes(){if(!PGU.modes)return;PGU.modesT+=pgDrawDtM();const on=WILD.on,o=MODES_UI.open,t=MODES_UI.t;WILD.on=false;MODES_UI.open=true;MODES_UI.t=PGU.modesT;try{drawModesPicker();}catch(e){}finally{WILD.on=on;MODES_UI.open=o;MODES_UI.t=t;}}
function pgDrawDtM(){return 1/60;}
function pgModesTap(p){const R=modesPickerRects();for(const r of R.rows)if(contains(r,p)){PGU.modes=false;sfx.wild('beep',1);PGU.oldBoards=false;wildModeEnter(r.id);PGU.fade=.3;return;}PGU.modes=false;pgSfx('back');}

// The one-row bar for a tall status bar: level badge with an XP ring, icon buttons, coins and Catnip stacked, Collections,
// Inventory, Settings (MODES as a sixth button with Developer on).
function pgDrawDockCompact(D,t){const cy=D.cy,r=Math.min(14,D.rh/2-3),need=pgXPNeed(PG.level),u=Math.min(1,PG.xp/need);
 ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=3;ctx.beginPath();ctx.arc(20,cy,r+3,0,7);ctx.stroke();if(u>0){ctx.strokeStyle='#7dff6a';ctx.beginPath();ctx.arc(20,cy,r+3,-Math.PI/2,-Math.PI/2+u*Math.PI*2);ctx.stroke();}
 uiCircle(20,cy,r,'#ffd23f','#fff6d0',1.5);ctx.fillStyle='#3a1a00';ctx.textAlign='center';ctx.font='900 '+Math.round(r*1.1)+'px Impact, system-ui';ctx.fillText(PG.level,20,cy+1);
 for(const b of D.tiles){const id=b.id,col=PG_DOCK_COL[id],locked=b.level&&PG.level<b.level,cx=b.x+b.w/2,pr=PGU.door&&PGU.door.id===id?Math.min(1,PGU.door.t/.24):0,press=1-.1*Math.sin(pr*Math.PI);
  ctx.save();ctx.translate(cx,cy);ctx.scale(press,press);ctx.translate(-cx,-cy);const g2=ctx.createLinearGradient(0,b.y,0,b.y+b.h);g2.addColorStop(0,col[0]);g2.addColorStop(1,col[1]);uiRound(b.x,b.y,b.w,b.h,9,g2,'#fff6d0',1.2);
  const k=Math.max(.24,Math.min(.4,(b.h-4)/66));ctx.save();ctx.beginPath();ctx.rect(b.x+1,b.y+1,b.w-2,b.h-2);ctx.clip();ctx.translate(cx,cy+2);ctx.scale(k,k);pgDoorIcon(id,0,0,t);ctx.restore();
  if(locked){uiRound(b.x,b.y,b.w,b.h,9,'rgba(10,6,20,.6)');pgLock(cx,cy,.6);}
  else if(pgWaiting(id)){const kk=1+.12*Math.sin(t*6);uiCircle(b.x+b.w-6,b.y+6,7*kk,'#fff','#ff6ab8',1.5);pgPaw(b.x+b.w-6,b.y+7,.16*kk,'#ff3a8a');}
  ctx.restore();}
 if(D.modes){const m=D.modes;uiRound(m.x,m.y,m.w,m.h,9,'rgba(20,60,60,.92)','#5ef0c0',1.2);ctx.fillStyle='#d8fff2';ctx.textAlign='center';ctx.font='900 9px Impact, system-ui';ctx.fillText('MODES',m.x+m.w/2,cy+1,m.w-4);}
 ctx.textAlign='left';ctx.font='bold 12px system-ui';uiCircle(272,cy-8,5,'#f5c632','#a8740c',1);ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,280,cy-7,34);pgCatnipLeaf(272,cy+11,.5);ctx.fillStyle='#8dff9a';ctx.fillText(PG.catnip,280,cy+8,34);
 pgCollIcon(D.coll.x+D.coll.w/2,cy);pgInvIcon(D.inv.x+D.inv.w/2,cy);pgGearIcon(D.gear.x+D.gear.w/2,cy,8);}
function pgDoorIcon(id,x,y,t){
 if(id==='kitchen'){ctx.fillStyle='#3a3a48';ctx.beginPath();ctx.moveTo(x-30,y-8);ctx.lineTo(x+30,y-8);ctx.quadraticCurveTo(x+28,y+22,x,y+24);ctx.quadraticCurveTo(x-28,y+22,x-30,y-8);ctx.fill();ctx.fillStyle='#5a5a6a';ctx.fillRect(x-34,y-12,68,7);
  ctx.fillStyle='rgba(255,255,255,.7)';for(let i=0;i<3;i++){const u=(t*.6+i/3)%1;ctx.globalAlpha=(1-u)*.7;ctx.beginPath();ctx.arc(x-12+i*12+Math.sin(u*6+i)*4,y-18-u*26,4+u*5,0,7);ctx.fill();}ctx.globalAlpha=1;}
 else if(id==='porch'){ctx.fillStyle='#8a5a32';ctx.fillRect(x-34,y+6,68,8);ctx.fillStyle='#c98a4a';ctx.beginPath();ctx.moveTo(x-38,y-6);ctx.lineTo(x,y-30);ctx.lineTo(x+38,y-6);ctx.closePath();ctx.fill();ctx.fillStyle='#5a8ad8';ctx.beginPath();ctx.ellipse(x,y+4,16,6,0,0,7);ctx.fill();ctx.fillStyle='#f28aa0';ctx.beginPath();ctx.ellipse(x,y+1,10,4,0,0,7);ctx.fill();}
 else if(id==='album'){ctx.save();ctx.translate(x,y);ctx.rotate(-.08);uiRound(-30,-24,60,46,5,'#b0442a','#5a1a0a',2);uiRound(-22,-16,30,22,3,'#fff','#ccc',1);pgPaw(-7,-5,.32,'#b0442a');ctx.fillStyle='#ffd23f';ctx.fillRect(22,-24,4,46);ctx.restore();}
 else if(id==='shop'){ctx.fillStyle='rgba(200,230,255,.35)';ctx.strokeStyle='#d8eeff';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x-22,y-20,44,44,10);ctx.fill();ctx.stroke();ctx.fillStyle='#b88a4a';ctx.fillRect(x-18,y-26,36,8);
  for(let i=0;i<5;i++){uiCircle(x-12+(i%3)*12,y+16-(i/3|0)*8,6,'#f5c632','#a8740c',1);}}
 else if(id==='board'){uiCircle(x,y,22,'#f5c632','#a8740c',2);pgPaw(x,y+2,.42,'#a8740c');}}
// --- the title screen (Jenny, Nov 14): "CatCoin" drops in letter by letter (a clink each), coins rain, the Tuxedo pops
// up and meows, a little jingle. UAT 54 (Jenny: "keep it open and then allow the player to tap to play"): after the intro
// (PG_TITLE_INTRO s) it stays, alive (rays turning, letters bobbing, the cat looking around and smiling now and then, the
// rain going on), until a tap on TAP TO PLAY. Taps during the intro are ignored so it always plays out. The coin rain is
// the board's own coin, bigger (22-34 px), slower and floatier, always behind the title and the cat.
const PG_TITLE_INTRO=1.9,PG_TITLE_WORD='CatCoin';
function pgEaseBack(u){const c=1.7;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2);}
function pgEaseBounce(u){const n=7.5625,d=2.75;if(u<1/d)return n*u*u;if(u<2/d)return n*(u-=1.5/d)*u+.75;if(u<2.5/d)return n*(u-=2.25/d)*u+.9375;return n*(u-=2.625/d)*u+.984375;}
function pgTitleTick(dt){const T0=PGU.title;T0.t+=dt;
 const beats=[...[...PG_TITLE_WORD].map((c,i)=>[.3+i*.09+.3,'coin']),[1.15,'meow'],[1.5,'levelup']];
 while(T0.snd<beats.length&&T0.t>=beats[T0.snd][0]){pgSfx(beats[T0.snd][1],beats[T0.snd][1]==='coin'?.8:1);T0.snd++;}
 pgTitleCoinsTick(T0,dt);}
function pgTitleCoin(y){return {x:rand(24,376),y,vy:rand(70,120),r:rand(22,34),s:rand(0,6),vs:rand(1.6,3.2),wf:rand(.8,1.6),wa:rand(8,18)};}
// ---- UAT 56: four coin rains to compare (Developer "Title coins: 1-4", default 2) ----
const PG_TC_KEY='catpusher.uat.titlecoins.v1';let PG_TC=2;try{const v=+localStorage.getItem(PG_TC_KEY);if(v>=1&&v<=4)PG_TC=v;}catch(e){}
function pgTitleFast(y){const c=pgTitleCoin(y);c.vy=rand(170,260);c.vs=rand(3,6);c.wa*=.5;return c;}
function pgTitleFloor(T0,x){const k=Math.max(0,Math.min(19,Math.floor(x/20)));return T0.floor[k];}
function pgTitleCoinsTick(T0,dt){const mode=T0.mode||(T0.mode=PG_TC);
 if(mode===1||mode===2){ // twice as fast as UAT 54, still spinning; 2 shows the coin's edge (drawn in code)
  if(!T0.seeded){T0.seeded=1;for(let i=0;i<5;i++)T0.coins.push(pgTitleFast(-40-i*90));}
  if(T0.coins.length<18&&Math.random()<dt*6)T0.coins.push(pgTitleFast(-40));
  for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.y+=c.vy*dt;c.vy=Math.min(c.vy+90*dt,380);c.x+=Math.sin(T0.t*c.wf+c.s)*c.wa*dt;if(c.y>H+50)T0.coins.splice(i,1);}return;}
 if(mode===3){ // fountain: bursts of coins from the bottom that arc up and fall back, like a jackpot
  T0.burstT=(T0.burstT||0)-dt;if(T0.burstT<=0&&T0.coins.length<34){T0.burstT=rand(.45,.8);const bx=rand(70,330),n=3+(Math.random()*3|0);
   for(let i=0;i<n;i++){const c=pgTitleCoin(H+30);c.x=bx+rand(-16,16);c.vx=rand(-150,150);c.vy=-rand(720,980);c.vs=rand(4,8);T0.coins.push(c);}}
  for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=900*dt;if(c.y>H+60&&c.vy>0)T0.coins.splice(i,1);}return;}
 // 4, pile-up: coins fall fast and land on a growing pile at the bottom, a clink each
 if(!T0.floor){T0.floor=Array.from({length:20},()=>pgBot()+6);T0.pile=[];T0.clinkT=0;}
 T0.clinkT-=dt;
 if(T0.pile.length<90&&T0.coins.length<14&&Math.random()<dt*7)T0.coins.push(pgTitleFast(-40));
 for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.vy=Math.min(c.vy+600*dt,520);c.y+=c.vy*dt;const fl=pgTitleFloor(T0,c.x)-c.r*.45;
  if(c.y>=fl){c.y=fl;c.f=rand(.5,.62);c.tilt=rand(-.25,.25);T0.pile.push(c);T0.coins.splice(i,1);const k=Math.floor(c.x/20);for(let j=k-1;j<=k+1;j++)if(j>=0&&j<20)T0.floor[j]=Math.min(T0.floor[j],c.y-(j===k?11:6));
   if(T0.clinkT<=0){T0.clinkT=.07;pgSfx('coin',.35);}}}}
// A coin turning about its vertical axis with its thickness showing: the approved coin face (as it is), plus a gold edge
// drawn in code beside it, as wide as the coin's thickness times how far it has turned.
function pgThickCoin(csp,x,y,r,a){const c=Math.cos(a),sn=Math.sin(a),rx=Math.max(.06,Math.abs(c))*r,hs=csp.half*r/COIN_R,d=r*.24*sn;
 ctx.save();ctx.translate(x,y);
 if(Math.abs(d)>.4){const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff1a8');g.addColorStop(.45,'#d89a1c');g.addColorStop(1,'#7a4c04');ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(d,0,rx,r,0,0,7);ctx.fill();ctx.fillRect(Math.min(0,d),-r,Math.abs(d),2*r);
  ctx.strokeStyle='rgba(100,60,0,.45)';ctx.lineWidth=1;ctx.beginPath();for(let k=-r+3;k<r-1;k+=3.5){ctx.moveTo(Math.min(0,d),k);ctx.lineTo(Math.max(0,d),k);}ctx.stroke();}
 ctx.save();ctx.scale(rx/r,1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();
 if(Math.abs(c)<.5){ctx.globalAlpha=(.5-Math.abs(c))*.5;ctx.fillStyle='#3a2200';ctx.beginPath();ctx.ellipse(0,0,rx,r,0,0,7);ctx.fill();ctx.globalAlpha=1;}
 if(c>.9){ctx.globalAlpha=(c-.9)*8;uiCircle(-rx*.35,-r*.35,r*.18,'#fffbe6');ctx.globalAlpha=1;}
 ctx.restore();}
function pgTitleSkip(){if(PGU.title.t>=PG_TITLE_INTRO){pgSfx('whoosh');pgTitleDone();}}
function pgTitleDone(){if(PGU.screen!=='title')return;PGU.screen='board';PGU.fade=.3;if(!WILD.on)pgPlay(pgPlayCat());try{diagEvent('progress','title done t='+PGU.title.t.toFixed(2));}catch(e){}}
function pgDrawTitle(){
 const T0=PGU.title,t=T0.t;
 if(ART.background){const cover=Math.max(W/ART.background.width,H/ART.background.height),bw=ART.background.width*cover,bh=ART.background.height*cover;ctx.drawImage(ART.background,(W-bw)/2,(H-bh)/2,bw,bh);}else{ctx.fillStyle='#1d1030';ctx.fillRect(0,0,W,H);}
 let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(30,10,50,.55)');gr.addColorStop(1,'rgba(20,6,34,.9)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 const ty=Math.max(pgTop()+120,H*.27);
 // slow rays behind the title
 ctx.save();ctx.translate(200,ty);ctx.rotate(t*.35);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=i%2?'rgba(255,210,63,.13)':'rgba(255,122,213,.08)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-40,-H);ctx.lineTo(40,-H);ctx.fill();}ctx.restore();
 // coins raining, spinning
 const csp=sprite('coin'),mode=T0.mode||PG_TC;
 if(T0.pile)for(const c of T0.pile){const hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.tilt);ctx.scale(1,c.f);ctx.fillStyle='#8a5a06';ctx.beginPath();ctx.ellipse(0,c.r*.28/c.f,c.r,c.r,0,0,7);ctx.fill();ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();}
 if(mode!==1){for(const c of T0.coins)pgThickCoin(csp,c.x,c.y,c.r,c.s+t*c.vs);}
 else for(const c of T0.coins){const fl=Math.cos(c.s+t*c.vs),k=c.r/COIN_R,hs=csp.half*k;ctx.save();ctx.translate(c.x,c.y);
  ctx.globalAlpha=.35;ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.ellipse(0,0,c.r*1.25*Math.max(.3,Math.abs(fl)),c.r*1.25,0,0,7);ctx.fill();ctx.globalAlpha=1; // a soft glow so it reads on the dark sky
  ctx.scale(Math.max(.18,Math.abs(fl)),1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);if(fl>.9){ctx.globalAlpha=(fl-.9)*8;uiCircle(-c.r*.35,-c.r*.35,c.r*.18,'#fffbe6');}ctx.restore();}
 // the Tuxedo pops up from the bottom, then smiles
 const u=Math.min(1,Math.max(0,(t-.1)/.7)),hy=H+150-(H+150-H*.66)*pgEaseBack(u),face=(t>1.1&&t<2.3)||(t>3&&(t%6)<1.2)?'sweet':'calm';
 pgHead('tuxedo',200,hy+Math.sin(t*2.2)*4,340,face,{look:Math.sin(t*1.7)*.7,blink:((t+.5)%3)<.12?1:0});
 // the title, letter by letter
 const size=82;ctx.font='italic 900 '+size+'px Impact, "Arial Black", system-ui';const ws=[...PG_TITLE_WORD].map(ch=>ctx.measureText(ch).width),tot=ws.reduce((a,b)=>a+b,0)+4*(ws.length-1);
 let x=200-tot/2;ctx.textAlign='center';ctx.textBaseline='middle';
 [...PG_TITLE_WORD].forEach((ch,i)=>{const lt=t-(.3+i*.09),cx=x+ws[i]/2;x+=ws[i]+4;if(lt<0)return;const d=Math.min(1,lt/.3),y=ty-(1-pgEaseBounce(d))*300+(d>=1?Math.sin(t*3+i*.8)*4:0);
  const sq=d>=1&&lt<.42?1+.18*Math.sin((lt-.3)/.12*Math.PI):1;ctx.save();ctx.translate(cx,y);ctx.scale(sq,1/sq);ctx.rotate(Math.sin(t*2+i)*.04);
  wildText(ch,0,0,size,i<3?'#ffd23f':'#ff8ad8',i<3?'#4a1a00':'#3a0b2e',13);ctx.restore();});
 // "tap to play"
 if(t>=PG_TITLE_INTRO){const a=Math.min(1,(t-PG_TITLE_INTRO)/.3),k=1+.05*Math.sin(t*4.5),by=pgBot()-58;ctx.save();ctx.globalAlpha=a;ctx.translate(200,by);ctx.scale(k,k);
  uiRound(-96,-23,192,46,23,'rgba(0,0,0,.35)');uiRound(-96,-26,192,46,23,'#7dff6a','#fff6d0',3);ctx.font='italic 900 22px Impact, "Arial Black", system-ui';ctx.fillStyle='#0c3a12';ctx.fillText('TAP TO PLAY',0,-2);ctx.restore();}
 ctx.font='10px system-ui';ctx.fillStyle='rgba(255,255,255,.5)';ctx.textAlign='left';ctx.fillText(BUILD,8,pgBot()-6);}
function pgPlayCat(){return pgCanPlay(PG.current)?PG.current:pgNewest();}
// --- the board picker (the Boards button on the board) ---
function pgPickRects(){const top=Math.max(pgTop()+90,H-640),rows=PG_CATS.map((c,i)=>({c,x:30,y:top+70+i*86,w:340,h:76}));return {card:{x:16,y:top,w:368,h:70+PG_CATS.length*86+60},rows,close:{x:140,y:top+70+PG_CATS.length*86+12,w:120,h:34}};}
function pgDrawBoardPick(dt){const R=pgPickRects(),u=Math.min(1,PGU.pickT/.2);ctx.save();ctx.globalAlpha=u;ctx.fillStyle='rgba(8,4,16,.72)';ctx.fillRect(0,0,W,H);
 wildPanel(R.card,'#4b1f6e','#1d0f33');wildText('PICK A BOARD',200,R.card.y+38,30,'#ffd23f','#2a0b3e',6);
 for(const r of R.rows){const C=PG_CAT[r.c],open=PG.open[r.c],can=pgCanPlay(r.c);uiRound(r.x,r.y,r.w,r.h,16,open?(can?'rgba(255,255,255,.14)':'rgba(255,255,255,.06)'):'rgba(0,0,0,.3)',open?C.tag:'#554',2);
  if(open)pgHead(r.c,r.x+48,r.y+r.h/2,80,'calm',{noPupils:false});else{ctx.save();ctx.globalAlpha*=.5;ctx.filter='brightness(0)';pgHead(r.c,r.x+48,r.y+r.h/2,80,'calm',{noPupils:true});ctx.restore();ctx.fillStyle='#fff';ctx.font='900 26px Impact, system-ui';ctx.textAlign='center';ctx.fillText('?',r.x+48,r.y+r.h/2+2);}
  ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.fillText(open?C.name:'???',r.x+100,r.y+26);ctx.font='13px system-ui';ctx.fillStyle='#e8dcff';
  ctx.fillText(open?C.board:'Win its cat coin to open',r.x+100,r.y+50,r.w-150);if(open&&PG.stars[r.c]){const tw=Math.min(r.w-150,ctx.measureText(C.board).width);for(let i=0;i<PG.stars[r.c];i++)w43Star(r.x+112+tw+i*17,r.y+49,7,'#ffd23f');}
  if(open&&!can){ctx.textAlign='center';pgLock(r.x+r.w-36,r.y+28,.9);ctx.font='bold 11px system-ui';ctx.fillStyle='#ffe08a';ctx.fillText('Level '+PG_SWITCH_LEVEL,r.x+r.w-36,r.y+52);}
  else if(open&&WILD.on&&r.c===PGU.boardCat){ctx.textAlign='center';ctx.font='900 13px Impact, system-ui';ctx.fillStyle='#7dff6a';ctx.fillText('PLAYING',r.x+r.w-38,r.y+r.h/2+1);}
  else if(open)pgPlayTri(r.x+r.w-34,r.y+r.h/2,'#7dff6a');}
 ctx.textAlign='center';uiRound(R.close.x,R.close.y,R.close.w,R.close.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Close',200,R.close.y+R.close.h/2+1);ctx.restore();}
// Starts a cat's board (Wild 2 for the Tuxedo, the mode for the others) with that cat's art.
function pgPlay(cat){
 if(!PG.open[cat])return false;PG.current=cat;PG.newBoard=null;PGU.pick=false;PGU.boardCat=cat;pgSave();const m=PG_CAT[cat].mode;
 const ok=m?wildModeEnter(m):wild2Enter();if(ok){PGU.screen='board';pgApplyArt(cat);try{diagEvent('progress','play '+cat);}catch(e){}}return ok;}
// ---------- KITCHEN ----------
function pgKitchenRows(){const y=pgTop()+92;return PG_RECIPES.map((r,i)=>({r,x:16,y:y+i*112,w:368,h:102}));}
function pgDrawKitchen(dt){
 const t=PGU.t;let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5a2a1a');gr.addColorStop(1,'#2a120a');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(255,220,180,.06)';for(let x=0;x<W;x+=40)for(let y=(x/40%2)*20;y<H;y+=40)ctx.fillRect(x,y,20,20); // tiles
 const K=PGU.k;if(K.cook){pgDrawCook(dt);return;}
 pgHeader('KITCHEN','#ffb07a');
 for(const row of pgKitchenRows()){const r=row.r,open=pgRecipeOpen(r),held=!!PG.recipes[r.id],done=PG.photos[r.cat]>0,can=pgCanCook(r),miss=pgMissing(r);
  if(row.y+row.h>H)break;uiRound(row.x,row.y,row.w,row.h,16,open?'rgba(255,240,220,.92)':'rgba(255,240,220,.25)','#8a4a1a',2);
  if(!open){ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 16px system-ui';ctx.fillText('A new recipe at level '+r.level,214,row.y+row.h/2);pgLock(200-ctx.measureText('A new recipe at level '+r.level).width/2-8,row.y+row.h/2+2,.8);continue;}
  pgDish(r.id,row.x+48,row.y+48+(can?Math.sin(t*3)*2:0),.72);pgHead(r.cat,row.x+48,row.y+86,44,'calm',{noPupils:true});
  ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='#3a1a0a';ctx.font='bold 17px system-ui';ctx.fillText(r.name,row.x+96,row.y+20);ctx.font='12px system-ui';ctx.fillStyle='#7a4a2a';ctx.fillText('for the '+PG_CAT[r.cat].name+(done?' · photographed':''),row.x+96,row.y+38);
  let ix=row.x+108;for(const id in r.need){const have=pgHave(id),n=r.need[id],ok=have>=n;pgPrizeIcon(id,ix,row.y+60,28,ok?1:.55);ctx.textAlign='center';ctx.font='bold 11px system-ui';ctx.fillStyle=ok?'#1f7a1a':'#c0302a';ctx.fillText(Math.min(have,99)+'/'+n,ix,row.y+88);ix+=40;}
  const b={x:row.x+row.w-86,y:row.y+row.h/2-20,w:76,h:40};row.btn=b;
  if(!held){ctx.textAlign='center';ctx.fillStyle='#7a4a2a';ctx.font='bold 11px system-ui';ctx.fillText('Used up',b.x+b.w/2,b.y+12);ctx.font='10px system-ui';ctx.fillText('win a recipe',b.x+b.w/2,b.y+26);ctx.fillText('coin on a board',b.x+b.w/2,b.y+38);}
  else{if(can){const k=1+.05*Math.sin(t*6);ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(k,k);ctx.translate(-(b.x+b.w/2),-(b.y+b.h/2));}pgButton(b,'COOK',can?'#3ccf4e':'#8a8a8a',can?'#0c3a12':'#333',18,!can);if(can)ctx.restore();}
  if(held&&PG.seen['r:'+r.id]===0){ctx.fillStyle='#ff3a8a';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.fillText('NEW!',row.x+row.w-48,row.y+12);}}
 for(const r of PG_RECIPES)if(PG.recipes[r.id]&&PG.seen['r:'+r.id]===0)PG.seen['r:'+r.id]=1;
 ctx.textAlign='center';ctx.fillStyle='#ffe0c0';ctx.font='12px system-ui';const tip=pgCurrentRecipe();
 ctx.fillText(tip?'Missing something? Win it on a board, or buy it in the Shop.':'Recipes are used up when cooked. Win one back from a recipe coin.',200,pgBot()-22,380);}
const PG_POT={x:200,r:96};function pgPotY(){return Math.min(pgBot()-170,610);}
function pgStartCook(r){
 const ids=[];for(const id in r.need)for(let i=0;i<r.need[id];i++)ids.push(id);const n=ids.length,y=pgTop()+190;
 PGU.k.cook={r,stage:'add',t:0,stir:0,lastA:null,steam:[],splash:[],items:ids.map((id,i)=>{const x=200+(i-(n-1)/2)*Math.min(78,340/n);return {id,x,y,hx:x,hy:y,in:false,fly:null,drag:false};}),dingT:0};
 pgSfx('tap');try{diagEvent('progress','cook '+r.id);}catch(e){}}
function pgDrawCook(dt){
 const C=PGU.k.cook,t=PGU.t,py=pgPotY();C.t+=dt;
 pgHeader(C.r.name.toUpperCase(),'#ffb07a');
 // shelf
 ctx.fillStyle='#8a5a32';ctx.fillRect(20,pgTop()+224,360,12);ctx.fillStyle='#5a3a1a';ctx.fillRect(20,pgTop()+236,360,6);
 // stove and pot
 ctx.fillStyle='#2a2a34';uiRound(60,py+40,280,90,14,'#2a2a34','#55556a',2);for(const d of [-1,1]){const fl=.7+.3*Math.sin(t*20+d);ctx.fillStyle='rgba(80,140,255,'+fl+')';ctx.beginPath();ctx.ellipse(200+d*40,py+52,22,6,0,0,7);ctx.fill();}
 const wob=C.stage==='stir'&&C.stirring?Math.sin(t*30)*1.5:0;
 ctx.fillStyle='#4a4a5a';ctx.beginPath();ctx.moveTo(200-PG_POT.r,py-30);ctx.lineTo(200+PG_POT.r,py-30);ctx.quadraticCurveTo(200+PG_POT.r,py+48,200,py+52);ctx.quadraticCurveTo(200-PG_POT.r,py+48,200-PG_POT.r,py-30);ctx.fill();
 ctx.fillStyle='#6a6a7a';uiRound(200-PG_POT.r-8,py-38,PG_POT.r*2+16,14,7,'#6a6a7a');for(const d of [-1,1])uiRound(200+d*(PG_POT.r+12)-10,py-26,20,10,5,'#6a6a7a');
 const inN=C.items.filter(i=>i.in).length,fill=inN/C.items.length;
 const soup=C.stage==='ding'||C.stage==='done'?'#e8a050':C.stage==='stir'?'#d0904a':'#c88a5a';ctx.save();ctx.translate(wob,0);ctx.fillStyle=soup;ctx.beginPath();ctx.ellipse(200,py-30,PG_POT.r-6,22,0,0,7);ctx.fill();
 if(fill>0&&C.stage==='add'){for(const it of C.items.filter(i=>i.in))pgPrizeIcon(it.id,200+Math.sin(it.id.length*3+C.items.indexOf(it))*50,py-40+Math.cos(C.items.indexOf(it))*6,26,.8);}
 if(C.stage!=='add'){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(200,py-30,40+20*Math.sin(C.stir*.5),10,C.stir*.3,0,5);ctx.stroke();}
 ctx.restore();
 // bubbles and steam
 if(Math.random()<dt*(C.stage==='add'?2:6))C.steam.push({x:200+rand(-60,60),y:py-36,t:0,big:C.stage==='ding'});
 if(C.stage==='stir'&&Math.random()<dt*3)pgSfx('bubble',.6);
 for(let i=C.steam.length-1;i>=0;i--){const s=C.steam[i];s.t+=dt;if(s.t>(s.big?2.2:1.4)){C.steam.splice(i,1);continue;}ctx.save();ctx.globalAlpha=(1-s.t/(s.big?2.2:1.4))*.55;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x+Math.sin(s.t*3+s.x)*10,s.y-s.t*(s.big?120:60),(s.big?14:6)+s.t*10,0,7);ctx.fill();ctx.restore();}
 for(let i=C.splash.length-1;i>=0;i--){const s=C.splash[i];s.t+=dt;if(s.t>.6){C.splash.splice(i,1);continue;}s.vy+=600*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;ctx.fillStyle='rgba(232,170,100,'+(1-s.t/.6)+')';ctx.beginPath();ctx.arc(s.x,s.y,4,0,7);ctx.fill();}
 // ingredients on the shelf, flying, or dragged
 for(const it of C.items){if(it.in)continue;if(it.fly){it.fly.t+=dt;const u=Math.min(1,it.fly.t/.45);it.x=it.fly.x+(200-it.fly.x)*u;it.y=it.fly.y+(py-40-it.fly.y)*u-Math.sin(u*Math.PI)*90;if(u>=1)pgIntoPot(it);}
  pgPrizeIcon(it.id,it.x,it.y-20,it.drag?62:54);}
 ctx.textAlign='center';ctx.textBaseline='middle';
 if(C.stage==='add'){ctx.fillStyle='#fff';ctx.font='bold 17px system-ui';ctx.fillText('Drag or tap each ingredient into the pot',200,pgTop()+112,370);ctx.fillStyle='#ffe0c0';ctx.font='13px system-ui';ctx.fillText(inN+' of '+C.items.length+' in',200,pgTop()+134);}
 else if(C.stage==='stir'){const p=Math.min(1,C.stir/PG_STIR);ctx.fillStyle='#fff';wildText('STIR!',200,pgTop()+120,44,'#ffd23f','#5a1a00',7);ctx.font='bold 15px system-ui';ctx.fillStyle='#ffe0c0';ctx.fillText('Draw circles in the pot (or tap it)',200,pgTop()+160);
  ctx.lineWidth=10;ctx.strokeStyle='rgba(255,255,255,.15)';ctx.beginPath();ctx.arc(200,py-30,PG_POT.r+34,0,7);ctx.stroke();ctx.strokeStyle='#7dff6a';ctx.beginPath();ctx.arc(200,py-30,PG_POT.r+34,-Math.PI/2,-Math.PI/2+p*Math.PI*2);ctx.stroke();
  // the spoon follows the stir
  const a=C.spoonA??-1;ctx.save();ctx.translate(200+Math.cos(a)*48,py-34+Math.sin(a)*12);ctx.rotate(-.5+Math.cos(a)*.2);ctx.fillStyle='#c8904a';ctx.fillRect(-4,-110,8,110);ctx.beginPath();ctx.ellipse(0,0,14,9,0,0,7);ctx.fill();ctx.restore();}
 else{const u=Math.min(1,C.dingT/.35);C.dingT+=dt;ctx.save();ctx.translate(200,pgTop()+150);const k=C.dingT<.35?.4+.8*u:1.2-.2*Math.min(1,(C.dingT-.35)/.3)+.03*Math.sin(C.dingT*8);ctx.scale(k,k);ctx.rotate(-.05);wildText('DING!',0,0,72,'#ffd23f','#5a1a00',10);ctx.restore();
  if(C.dingT>.5){const a=Math.min(1,(C.dingT-.5)/.3);ctx.save();ctx.globalAlpha=a;pgDish(C.r.id,200,pgTop()+260,1.4+.05*Math.sin(t*3));ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.fillText(C.r.name+' for the '+PG_CAT[C.r.cat].name+'!',200,pgTop()+330);
   const B=pgCookButtons();pgButton(B.porch,'SET IT ON THE PORCH','#7ad65a','#0c3a12',17);uiRound(B.back.x,B.back.y,B.back.w,B.back.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Kitchen',200,B.back.y+B.back.h/2+1);ctx.restore();}}}
const PG_STIR=Math.PI*2*2.5; // two and a half turns
function pgCookButtons(){const y=pgPotY()-200;return {porch:{x:60,y:y+70,w:280,h:50},back:{x:140,y:y+130,w:120,h:30}};}
function pgIntoPot(it){const C=PGU.k.cook;it.in=true;it.fly=null;it.drag=false;pgSfx('plop');const py=pgPotY();for(let i=0;i<10;i++)C.splash.push({x:200+rand(-30,30),y:py-36,vx:rand(-120,120),vy:rand(-320,-160),t:0});
 if(C.items.every(i=>i.in)){C.stage='stir';C.stir=0;pgToast('Now stir!','#ffd23f');}}
function pgStirAdd(da){const C=PGU.k.cook;if(!C||C.stage!=='stir')return;C.stir+=Math.abs(da);C.stirring=true;C.spoonA=(C.spoonA??-1)+da;C.swish=(C.swish||0)+Math.abs(da);if(C.swish>1.2){C.swish=0;pgSfx('stir');}
 if(C.stir>=PG_STIR)pgFinishCook();}
function pgFinishCook(){const C=PGU.k.cook,r=C.r;C.stage='ding';C.dingT=0;pgSfx('ding');for(let i=0;i<14;i++)C.steam.push({x:200+rand(-70,70),y:pgPotY()-36,t:rand(0,.3),big:true});
 for(const id in r.need)PG.items[id]=Math.max(0,pgHave(id)-r.need[id]);PG.recipes[r.id]=0;PG.dishes[r.id]=Math.min(pgCap(),(PG.dishes[r.id]|0)+1);pgAddXP(15);pgSave();try{diagEvent('progress','cooked '+r.id);}catch(e){}}
// ---------- PORCH ----------
function pgSpots(){const y=Math.min(pgBot()-230,640);return [{x:110,y},{x:290,y}];}
function pgCamera(){return {x:150,y:pgBot()-104,w:100,h:76};}
function pgVisitWindow(){return PG_DEV.window>0?PG_DEV.window*1000:(20+Math.random()*100)*60000;}
function pgEatWait(){return PG_DEV.window>0?Math.min(8000,PG_DEV.window*500):(45+Math.random()*45)*1000;}
function pgSetFood(i,rid){const r=PG_R[rid];if(!r||!(PG.dishes[rid]>0)||PG.porch[i])return false;PG.dishes[rid]--;const now=pgNow();
 PG.porch[i]={dish:rid,cat:r.cat,setAt:now,eatAt:now+pgEatWait(),leaveAt:0,state:'food'};pgSfx('plop');pgSave();try{diagEvent('progress','porch '+i+' '+rid);}catch(e){}return true;}
// Real time: checked every half second on every screen (and on opening, for whatever happened while the game was closed).
function pgPorchTick(){const now=pgNow();let ch=false;
 PG.porch.forEach((s,i)=>{if(!s)return;
  if(s.state==='food'&&now>=s.eatAt){s.state='visit';s.leaveAt=s.eatAt+pgVisitWindow();s.arrive=PGU.T;ch=true;const dn=PG_R[s.dish].short;
   pgToast('Someone ate the '+dn,'#ffe08a','paw');if(PGU.screen==='porch')pgSfx('bell');try{diagEvent('progress','ate '+s.dish);}catch(e){}}
  if(s.state==='visit'&&now>=s.leaveAt){s.state='missed';ch=true;if(PGU.screen==='porch')pgSfx('back');try{diagEvent('progress','missed '+s.cat);}catch(e){}}
  if(s.state==='photo'&&now>=(s.goneAt||0)){PG.porch[i]=null;ch=true;}});
 if(ch)pgSave();}
function pgPhoto(i){const s=PG.porch[i];if(!s||s.state!=='visit')return;const n=PG.photos[s.cat]|0,first=n===0;PG.photos[s.cat]=Math.min(3,n+1);PG.newPhoto=true;
 s.state='photo';s.pose=PG_POSES[Math.min(2,n)];s.goneAt=pgNow()+2600;PGU.porch.flash=1;const sp=pgSpots()[i];PGU.porch.fly={cat:s.cat,pose:s.pose,x:sp.x,y:sp.y-80,t:0};pgSfx('shutter');
 pgAddXP(25);if(first&&!PG.open[s.cat]){PG.coinReady[s.cat]=1;pgToast(PG_CAT[s.cat].name+"'s cat coin can drop on any board now!",'#ffd23f');}
 pgCheckStamps();pgCheckWin();pgSave();try{diagEvent('progress','photo '+s.cat+' '+s.pose);}catch(e){}}
function pgPorchPickRects(){const ds=PG_RECIPES.filter(r=>PG.dishes[r.id]>0),top=pgBot()-200-ds.length*64;return {card:{x:30,y:top,w:340,h:84+ds.length*64+40},rows:ds.map((r,i)=>({r,x:46,y:top+60+i*64,w:308,h:56})),close:{x:140,y:top+64+ds.length*64+4,w:120,h:30}};}
function pgDrawPorch(dt){
 const t=PGU.t,P=PGU.porch;
 // garden: sky, sun, hedge, grass, then the wooden porch
 let gr=ctx.createLinearGradient(0,0,0,H*.55);gr.addColorStop(0,'#6ac8ff');gr.addColorStop(1,'#cfefff');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 uiCircle(320,pgTop()+150,34,'#fff3a0');ctx.fillStyle='rgba(255,255,255,.85)';for(const [x,y,s] of [[80,pgTop()+130,1],[230,pgTop()+190,.7]]){const dx=((t*8*s+x)%(W+120))-60;ctx.beginPath();ctx.arc(dx,y,18*s,0,7);ctx.arc(dx+20*s,y-8*s,22*s,0,7);ctx.arc(dx+44*s,y,18*s,0,7);ctx.fill();}
 const hy=H*.5;ctx.fillStyle='#3f8a3a';ctx.beginPath();ctx.moveTo(0,hy);for(let x=0;x<=W;x+=20)ctx.lineTo(x,hy-18-10*Math.sin(x*.07+1));ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
 ctx.fillStyle='#62b04a';ctx.fillRect(0,hy,W,H);for(let i=0;i<40;i++){const x=(i*37)%W,y=hy+10+(i*53)%60;ctx.strokeStyle='#4a9a3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3+Math.sin(t*2+i)*2,y-10);ctx.stroke();}
 // flowers that sway
 for(let i=0;i<6;i++){const x=24+i*72,y=hy+30+(i%2)*14;ctx.strokeStyle='#2a7a2a';ctx.beginPath();ctx.moveTo(x,y+16);ctx.lineTo(x+Math.sin(t*1.5+i)*3,y);ctx.stroke();uiCircle(x+Math.sin(t*1.5+i)*3,y,6,['#ff7ad5','#ffd23f','#fff'][i%3]);uiCircle(x+Math.sin(t*1.5+i)*3,y,2.5,'#ff9a2a');}
 const fy=H*.6;ctx.fillStyle='#b77a45';ctx.fillRect(0,fy,W,H-fy);ctx.strokeStyle='#8a5a32';ctx.lineWidth=2;for(let y=fy;y<H;y+=26){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
 for(let i=0;i<9;i++){ctx.fillStyle='#f4e6d0';ctx.fillRect(10+i*46,fy-60,10,60);}ctx.fillStyle='#e6d4b8';ctx.fillRect(0,fy-66,W,10);
 pgHeader('PORCH','#9aff7a');
 // birds now and then
 P.chirp-=dt;if(P.chirp<=0){P.chirp=rand(2.5,6);pgSfx('chirp',.8);P.bird={t:0,x:rand(60,340)};}
 if(P.bird){P.bird.t+=dt;const b=P.bird;if(b.t>1.2)P.bird=null;else{ctx.fillStyle='#3a3a5a';ctx.save();ctx.translate(b.x+b.t*60,pgTop()+210-b.t*40);ctx.beginPath();ctx.moveTo(-10,0);ctx.quadraticCurveTo(-5,-8*Math.abs(Math.sin(b.t*20)),0,0);ctx.quadraticCurveTo(5,-8*Math.abs(Math.sin(b.t*20)),10,0);ctx.stroke();ctx.restore();}}
 const sp=pgSpots();
 PG.porch.forEach((s,i)=>{const p=sp[i];
  // mat and bowl
  ctx.fillStyle='rgba(120,40,60,.55)';ctx.beginPath();ctx.ellipse(p.x,p.y+26,72,20,0,0,7);ctx.fill();
  if(!s){ctx.fillStyle='#5a8ad8';ctx.beginPath();ctx.moveTo(p.x-34,p.y);ctx.quadraticCurveTo(p.x-30,p.y+24,p.x,p.y+24);ctx.quadraticCurveTo(p.x+30,p.y+24,p.x+34,p.y);ctx.closePath();ctx.fill();ctx.fillStyle='#a8c4f0';ctx.beginPath();ctx.ellipse(p.x,p.y,34,8,0,0,7);ctx.fill();
   ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='bold 13px system-ui';ctx.fillText(Object.values(PG.dishes).some(n=>n>0)?'tap to set food out':'empty',p.x,p.y+52);if(Object.values(PG.dishes).some(n=>n>0)){uiCircle(p.x,p.y-30,14+Math.sin(t*4)*2,'rgba(255,255,255,.85)');ctx.fillStyle='#3a8a2a';ctx.font='900 20px system-ui';ctx.fillText('+',p.x,p.y-29);}return;}
  if(s.state==='food'){pgDish(s.dish,p.x,p.y,.8);ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText(PG_R[s.dish].name+' · waiting…',p.x,p.y+52);
   for(let k=0;k<3;k++){const u=((t*.5+k/3)%1);ctx.save();ctx.globalAlpha=(1-u)*.6;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x-10+k*10+Math.sin(u*6)*5,p.y-16-u*40,3+u*4,0,7);ctx.fill();ctx.restore();}return;}
  if(s.state==='visit'||s.state==='photo'){const a=Math.min(1,(PGU.T-(s.arrive??-9))/.6),x=p.x+(1-a)*(i?120:-120);
   ctx.save();ctx.globalAlpha=Math.max(.15,a);pgSittingCat(s.cat,x,p.y-52,.78,t+i,s.state==='photo'&&s.pose?s.pose:'calm');ctx.restore();
   ctx.fillStyle='rgba(90,138,216,.9)';ctx.beginPath();ctx.ellipse(p.x+(i?-46:46),p.y+14,24,7,0,0,7);ctx.fill(); // the empty bowl
   pgTag(s.cat,x,p.y+44,.85);return;}
  if(s.state==='missed'){ctx.fillStyle='#5a8ad8';ctx.beginPath();ctx.ellipse(p.x,p.y+8,34,9,0,0,7);ctx.fill();
   for(let k=0;k<5;k++)pgPaw(p.x-40+k*20+(k%2)*6,p.y+40-k*16+(k%2)*8,.28,'rgba(60,30,20,.55)');
   ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('Missed! Paw prints…',p.x,p.y+60);ctx.font='11px system-ui';ctx.fillText('tap to tidy up',p.x,p.y+76);}});
 // the camera: big, and it bounces while a cat is here
 const here=PG.porch.some(s=>s&&s.state==='visit'),c=pgCamera(),k=here?1+.06*Math.sin(t*7):1;ctx.save();ctx.translate(c.x+c.w/2,c.y+c.h/2);ctx.scale(k,k);ctx.globalAlpha=here?1:.45;
 uiRound(-c.w/2,-c.h/2+8,c.w,c.h-8,14,'#2a2a34','#fff',2.5);uiRound(-20,-c.h/2,40,14,5,'#2a2a34','#fff',2);uiCircle(0,8,24,'#5a6a8a','#fff',3);uiCircle(0,8,14,'#1a2a4a');uiCircle(-5,3,4,'rgba(255,255,255,.7)');uiCircle(c.w/2-14,-c.h/2+18,5,'#ff5a5a');ctx.restore();
 ctx.fillStyle=here?'#fff':'rgba(255,255,255,.7)';ctx.textAlign='center';ctx.font='bold 14px system-ui';ctx.fillText(here?'Tap the camera to take its photo!':'A cat visits when it smells food',200,c.y-14);
 // flash and the photo flying to the Album
 if(P.flash>0){ctx.fillStyle='rgba(255,255,255,'+P.flash+')';ctx.fillRect(0,0,W,H);P.flash=Math.max(0,P.flash-dt*2.4);}
 if(P.fly){const f=P.fly;f.t+=dt;const u=Math.min(1,f.t/1.1),e=u*u,x=f.x+(W-40-f.x)*e,y=f.y+(pgTop()+20-f.y)*e,s=1.4-1.1*e;ctx.save();ctx.translate(x,y);ctx.rotate(-.2+u*.4);ctx.scale(s,s);uiRound(-46,-52,92,104,4,'#fff','#ccc',1);ctx.save();ctx.beginPath();ctx.rect(-38,-44,76,72);ctx.clip();ctx.fillStyle='#bfe6ff';ctx.fillRect(-38,-44,76,72);pgHead(f.cat,0,-6,96,f.pose);ctx.restore();ctx.restore();
  if(u>=1){P.fly=null;pgSfx('flip',.7);pgToast('Photo in the Album!','#fff');}}
 if(P.pick)pgDrawPorchPick();}
function pgDrawPorchPick(){const R=pgPorchPickRects();ctx.fillStyle='rgba(8,4,16,.6)';ctx.fillRect(0,0,W,H);wildPanel(R.card,'#2d6a2a','#123a10');ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.fillText('Set out which dish?',200,R.card.y+30);
 for(const r of R.rows){uiRound(r.x,r.y,r.w,r.h,14,'rgba(255,255,255,.14)','#ffe08a',1.5);pgDish(r.r.id,r.x+40,r.y+30,.55);ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';ctx.fillText(r.r.name+' ×'+PG.dishes[r.r.id],r.x+84,r.y+20);ctx.font='12px system-ui';ctx.fillStyle='#d8ffd0';ctx.fillText('the '+PG_CAT[r.r.cat].name+' loves it',r.x+84,r.y+40);}
 ctx.textAlign='center';uiRound(R.close.x,R.close.y,R.close.w,R.close.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Close',200,R.close.y+R.close.h/2+1);}
// ---------- ALBUM ----------
function pgPages(){return ['prizes',...PG_CATS];}
function pgCheckStamps(){if(!PG)return;let got=0;
 for(const c of PG_CATS)if((PG.photos[c]|0)>=3&&!PG.stamped[c]){PG.stamped[c]=1;PG.catnip+=3;got+=3;pgToast(PG_CAT[c].name+"'s album page is full! +3 Catnip",'#8dff9a');pgSfx('stamp');}
 if(PG_PRIZES.every(id=>PG.ever[id])&&!PG.stamped.prizes){PG.stamped.prizes=1;PG.catnip+=5;got+=5;pgToast('Prize page full! +5 Catnip','#8dff9a');pgSfx('stamp');}
 return got;}
function pgCheckWin(){if(PG.won)return;if(PG_CATS.every(c=>PG.photos[c]>0&&PG.open[c])){PG.won=true;try{diagEvent('progress','YOU WON');}catch(e){}}}
function pgAlbumArrows(){const y=pgBot()-80;return {prev:{x:20,y,w:70,h:56},next:{x:W-90,y,w:70,h:56}};}
function pgDrawAlbum(dt){
 const A=PGU.album,t=PGU.t;let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#3a1a4a');gr.addColorStop(1,'#1a0a24');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 pgHeader('ALBUM','#e8a6ff');PG.newPhoto=false;
 const pages=pgPages(),pid=pages[A.page],top=pgTop()+88,bh=pgBot()-top-100;A.flipT+=dt;const fu=Math.min(1,A.flipT/.3),sq=A.flipT<.3?Math.abs(Math.cos(fu*Math.PI)):1;
 ctx.save();ctx.translate(200,0);ctx.scale(Math.max(.04,sq),1);ctx.translate(-200,0);
 uiRound(18,top,364,bh,12,'#b0442a','#5a1a0a',3);uiRound(28,top+10,344,bh-20,8,'#fff8ea','#d8c8a8',1);
 ctx.textAlign='center';ctx.textBaseline='middle';
 if(pid==='prizes'){wildText('PRIZES',200,top+44,30,'#b0442a','#fff8ea',2);const n=PG_PRIZES.length,cols=3,cw=104,ch=Math.min(92,(bh-110)/Math.ceil(n/cols));
  PG_PRIZES.forEach((id,i)=>{const x=200+((i%cols)-1)*cw,y=top+86+(i/cols|0)*ch;const ever=!!PG.ever[id];pgPrizeIcon(id,x,y,ch*.5,ever?1:.18);ctx.fillStyle=ever?'#3a1a0a':'#b8a890';ctx.font='bold 11px system-ui';ctx.fillText(ever?pgName(id):'?',x,y+ch*.42);
   if(ever){ctx.font='bold 10px system-ui';ctx.fillStyle='#7a5a3a';ctx.fillText('×'+pgHave(id),x+ch*.34,y-ch*.12);}const o=pgOwner(id);if(o){ctx.fillStyle=PG_CAT[o].tag;ctx.beginPath();ctx.arc(x-ch*.32,y-ch*.12,4,0,7);ctx.fill();}});
  if(PG.stamped.prizes)pgStamp(300,top+bh-70,t);}
 else{const C=PG_CAT[pid],n=PG.photos[pid]|0;wildText(C.name.toUpperCase(),200,top+44,30,C.tag,'#fff8ea',2);ctx.font='12px system-ui';ctx.fillStyle='#7a5a3a';ctx.fillText(C.board+' · only here: '+C.own.map(pgName).join(', '),200,top+72,330);
  const fh=Math.min(170,(bh-120)/2);PG_POSES.forEach((pose,i)=>{const x=i===2?200:i===0?118:282,y=top+100+(i===2?fh+16:0)+fh/2,w=fh*.86;
   ctx.save();ctx.translate(x,y);ctx.rotate((i-1)*.05);uiRound(-w/2,-fh/2,w,fh,4,'#fff','#ccc',1);ctx.fillStyle=i<n?'#bfe6ff':'#e8e0d0';ctx.fillRect(-w/2+8,-fh/2+8,w-16,fh-36);
   if(i<n){ctx.save();ctx.beginPath();ctx.rect(-w/2+8,-fh/2+8,w-16,fh-36);ctx.clip();pgHead(pid,0,-10,w*1.1,pose);ctx.restore();}else{ctx.fillStyle='#b8a890';ctx.font='900 34px Impact, system-ui';ctx.fillText('?',0,-14);}
   ctx.fillStyle='#7a5a3a';ctx.font='bold 11px system-ui';ctx.fillText(i<n?pose:'pose '+(i+1),0,fh/2-14);ctx.restore();});
  ctx.fillStyle='#7a5a3a';ctx.font='12px system-ui';ctx.fillText(n?(n<3?'More photos, more poses: feed it again':'Page full!'):'Set out its favourite dish on the Porch',200,top+bh-30,330);
  if(PG.stamped[pid])pgStamp(300,top+bh-80,t);}
 ctx.restore();
 const B=pgAlbumArrows();for(const [k,r] of Object.entries(B)){uiRound(r.x,r.y,r.w,r.h,16,'rgba(255,255,255,.14)','#e8a6ff',2);ctx.fillStyle='#fff';ctx.font='900 30px system-ui';pgChevron(r.x+r.w/2,r.y+r.h/2,k==='prev'?-1:1,'#fff',11);}
 ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText((A.page+1)+' / '+pages.length,200,B.prev.y+B.prev.h/2);}
function pgStamp(x,y,t){ctx.save();ctx.translate(x,y);ctx.rotate(-.25);ctx.globalAlpha=.85;ctx.strokeStyle='#d0302a';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,40,0,7);ctx.stroke();ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,33,0,7);ctx.stroke();ctx.fillStyle='#d0302a';ctx.font='900 15px Impact, system-ui';ctx.textAlign='center';ctx.fillText('COMPLETE',0,-4);pgCatnipLeaf(0,18,.8);ctx.restore();}
function pgAlbumFlip(d){const n=pgPages().length;PGU.album.page=(PGU.album.page+d+n)%n;PGU.album.flipT=0;pgSfx('flip');}
// ---------- SHOP ----------
function pgShopTabs(){const y=pgTop()+250;return {sell:{x:30,y,w:164,h:44},buy:{x:206,y,w:164,h:44}};}
function pgShopRows(){const tab=PGU.shop.tab,y0=pgTop()+306,ids=tab==='sell'?PG_PRIZES.filter(id=>pgHave(id)>0):PG_PRIZES.filter(id=>!pgWinnable(id));
 const need=pgMissing(pgCurrentRecipe());if(tab==='buy')ids.sort((a,b)=>(!!need[b])-(!!need[a]));
 const rh=Math.min(64,(pgBot()-y0-30)/Math.max(1,ids.length));return ids.map((id,i)=>({id,x:24,y:y0+i*rh,w:352,h:rh-6,btn:{x:270,y:y0+i*rh+(rh-6)/2-18,w:96,h:36}}));}
function pgDrawShop(dt){
 const t=PGU.t,Sh=PGU.shop;let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0f4a6a');gr.addColorStop(1,'#08202e');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='rgba(255,255,255,.05)';for(let x=0;x<W;x+=28)ctx.fillRect(x,0,14,H); // awning stripes
 pgHeader('SHOP','#7ae0ff');
 // the coin jar: fills with your coins
 const jx=200,jy=pgTop()+160,jw=120,jh=120,fill=Math.min(1,PG.coins/600);Sh.jarT+=dt;const wob=Sh.jarT<.3?Math.sin(Sh.jarT*40)*3*(1-Sh.jarT/.3):0;
 ctx.save();ctx.translate(jx+wob,jy);ctx.fillStyle='rgba(200,230,255,.18)';ctx.strokeStyle='#d8eeff';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(-jw/2,-jh/2,jw,jh,22);ctx.fill();ctx.stroke();ctx.fillStyle='#b88a4a';ctx.fillRect(-jw/2+8,-jh/2-12,jw-16,14);
 ctx.save();ctx.beginPath();ctx.roundRect(-jw/2+4,-jh/2+4,jw-8,jh-8,18);ctx.clip();const lvl=jh/2-4-(jh-8)*fill;for(let y=jh/2;y>lvl;y-=9)for(let x=-jw/2+10;x<jw/2;x+=16)uiCircle(x+((y/9|0)%2)*8,y,8,'#f5c632','#a8740c',1);ctx.restore();
 ctx.fillStyle='#fff';ctx.font='bold 18px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(PG.coins+' coins',0,jh/2+18);ctx.restore();
 const T2=pgShopTabs();for(const k of ['sell','buy']){const r=T2[k],on=Sh.tab===k;uiRound(r.x,r.y,r.w,r.h,14,on?'#ffd23f':'rgba(255,255,255,.12)','#fff6d0',2);ctx.fillStyle=on?'#3a1a00':'#fff';ctx.font='900 18px Impact, system-ui';ctx.fillText(k==='sell'?'SELL PRIZES':'BUY INGREDIENTS',r.x+r.w/2,r.y+r.h/2+1,r.w-10);}
 const rows=pgShopRows(),need=pgMissing(pgCurrentRecipe());
 if(!rows.length){ctx.fillStyle='#cfe6f4';ctx.font='15px system-ui';ctx.fillText(Sh.tab==='sell'?'No prizes yet. Win some on a board!':'Everything can be won on your boards.',200,pgTop()+340,360);}
 for(const r of rows){uiRound(r.x,r.y,r.w,r.h,12,need[r.id]?'rgba(125,255,106,.18)':'rgba(255,255,255,.1)',need[r.id]?'#7dff6a':'rgba(255,255,255,.3)',1.5);pgPrizeIcon(r.id,r.x+30,r.y+r.h/2-6,Math.min(40,r.h-6));
  ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText(pgName(r.id)+(Sh.tab==='sell'?'  ×'+pgHave(r.id):''),r.x+62,r.y+r.h/2-8,190);
  ctx.font='11px system-ui';ctx.fillStyle='#cfe6f4';const o=pgOwner(r.id);ctx.fillText(need[r.id]?'your recipe needs it':o?'only on the '+PG_CAT[o].name+"'s board":'on every board',r.x+62,r.y+r.h/2+10,190);
  const price=Sh.tab==='sell'?pgSell(r.id):pgBuy(r.id),off=Sh.tab==='buy'&&(PG.coins<price||pgHave(r.id)>=pgCap());ctx.textAlign='center';
  pgButton(r.btn,(Sh.tab==='sell'?'+':'')+price,Sh.tab==='sell'?'#ffd23f':'#3ccf4e',Sh.tab==='sell'?'#3a1a00':'#0c3a12',18,off);}
 for(let i=Sh.flies.length-1;i>=0;i--){const f=Sh.flies[i];f.t+=dt;const u=Math.min(1,f.t/.5);if(u>=1){Sh.flies.splice(i,1);continue;}const x=f.x+(jx-f.x)*u,y=f.y+(jy-40-f.y)*u-Math.sin(u*Math.PI)*60;uiCircle(x,y,8,'#f5c632','#a8740c',1);}
 ctx.textAlign='center';ctx.fillStyle='#cfe6f4';ctx.font='12px system-ui';ctx.fillText(Sh.tab==='sell'?'Tip: keep what your recipes need':'Things you can’t win on your boards yet',200,pgBot()-14);}
function pgShopTap(r){const Sh=PGU.shop;
 if(Sh.tab==='sell'){if(pgHave(r.id)<1)return;PG.items[r.id]--;PG.coins+=pgSell(r.id);Sh.flies.push({x:r.btn.x+r.btn.w/2,y:r.btn.y,t:0});Sh.flies.push({x:r.btn.x+r.btn.w/2,y:r.btn.y,t:-.08});Sh.jarT=0;pgSfx('jar');pgSfx('clink',.6);pgSave();return;}
 const p=pgBuy(r.id);if(PG.coins<p||pgHave(r.id)>=pgCap()){pgSfx('lock');return;}PG.coins-=p;PG.items[r.id]=pgHave(r.id)+1;PG.ever[r.id]=1;pgSfx('till');pgFloat('+1 '+pgName(r.id),r.x+150,r.y,'#7dff6a');pgCheckStamps();pgSave();}
// ---------- the round: list, star, rewards, cat coins, recipe coins ----------
RAIN.recipecoin={n:0,pgcoin:'recipe',r:33,half:4.4,face:['#fff6e0','#ff9a4a','#8a3a10'],edge:'#7a3010'};
for(const c of PG_CATS){if(c==='tuxedo')continue;RAIN['cc_'+c]={n:0,pgcoin:'cat',cat:c,r:34,half:4.4,face:['#fff8e0',PG_CAT[c].tag,'#2a1a10'],edge:'#3a2a10'};}
for(const k in RAIN)if(RAIN[k].pgcoin){EDGE[k]=RAIN[k].edge;PRIZE_OPAQUE[k]=.95;PRIZE_ASPECT[k]=1;}
const __pgRainFace=rainFace;
rainFace=function(g,c,r,kind){const R=RAIN[kind];if(!R||!R.pgcoin)return __pgRainFace(g,c,r,kind);
 const [c1,c2,c3]=R.face;let gr=g.createRadialGradient(c-r*.35,c-r*.4,r*.1,c,c,r);gr.addColorStop(0,c1);gr.addColorStop(.55,c2);gr.addColorStop(1,c3);g.fillStyle=gr;g.beginPath();g.arc(c,c,r,0,7);g.fill();
 g.lineWidth=r*.1;g.strokeStyle='#ffd23f';g.beginPath();g.arc(c,c,r*.86,0,7);g.stroke();g.textAlign='center';g.textBaseline='middle';
 if(R.pgcoin==='cat'){const C=PG_CAT[R.cat],s=r/30;g.fillStyle=C.fur;g.beginPath();g.moveTo(c-17*s,c-4*s);g.lineTo(c-15*s,c-22*s);g.lineTo(c-5*s,c-12*s);g.lineTo(c+5*s,c-12*s);g.lineTo(c+15*s,c-22*s);g.lineTo(c+17*s,c-4*s);g.quadraticCurveTo(c+16*s,c+14*s,c,c+14*s);g.quadraticCurveTo(c-16*s,c+14*s,c-17*s,c-4*s);g.fill();
  if(C.fur2){g.fillStyle=C.fur2;g.beginPath();g.arc(c+7*s,c-6*s,6*s,0,7);g.fill();}g.fillStyle=C.light;g.beginPath();g.ellipse(c,c+6*s,8*s,6*s,0,0,7);g.fill();g.fillStyle=C.eye;for(const d of [-1,1]){g.beginPath();g.ellipse(c+d*7*s,c-3*s,3.4*s,4*s,0,0,7);g.fill();}
  g.font='bold '+Math.round(r*.19)+'px system-ui';g.fillStyle='#fff6d0';g.fillText('CAT COIN',c,c+r*.62);}
 else{g.fillStyle='#fff8ea';g.fillRect(c-r*.36,c-r*.42,r*.72,r*.7);g.strokeStyle='#8a3a10';g.lineWidth=r*.05;for(let i=0;i<3;i++){g.beginPath();g.moveTo(c-r*.24,c-r*.24+i*r*.16);g.lineTo(c+r*.24,c-r*.24+i*r*.16);g.stroke();}
  g.font='bold '+Math.round(r*.19)+'px system-ui';g.fillStyle='#fff6d0';g.fillText('RECIPE',c,c+r*.6);}};
// The list and the star are picked before the board is built (wildReset), for the board's cat.
const __pgPickStar=w43PickStar;
w43PickStar=function(){if(!PG||PG_HOME_OFF)return __pgPickStar();const miss=pgMissing(pgCurrentRecipe()),need=WILD_COLLECTION.filter(id=>miss[id]);const pool=need.length?need:WILD_COLLECTION;return pool[Math.random()*pool.length|0];};
const __pgPlaceStar=w43PlaceStar;
w43PlaceStar=function(){if(!PG||PG_HOME_OFF)return __pgPlaceStar();const star=WILD.star;if(!star)return;const items=bodies.filter(b=>!b.dead&&b.kind==='item');const sb=items.find(b=>b.id===star);if(!sb)return;
 const back=items.reduce((a,b)=>!a||b.rb.translation().z<a.rb.translation().z?b:a,null);if(!back||back===sb)return;const a=sb.rb.translation(),c=back.rb.translation();sb.rb.setTranslation(c,true);back.rb.setTranslation(a,true);};
const __pgReset=wildReset;
wildReset=function(){
 const pg=PG&&!PG_HOME_OFF;if(pg&&WILD.on){pgSetList(pgRoundList(PGU.boardCat||'tuxedo'));}
 const r=__pgReset();if(pg)pgFixAllLines();Object.assign(WILD,{pgCoins:0,pgPerfect:false,pgDone:false,pgResult:null,pgAdded:{},pgCC:false,pgRC:false});return r;};
// Every prize pushed off the front goes in the pantry (capped).
const __pgCollected=wildPrizeCollected;
wildPrizeCollected=function(b,x){const r=__pgCollected(b,x);if(PG&&!PG_HOME_OFF&&WILD.on){const p=proj(x,T.FRONT);pgAddItem(b.id,1,p.x,p.y-40);WILD.pgAdded[b.id]=true;}return r;};
// Coins pushed off the front during a round go to the jar too.
const __pgFallOff=fallOff;
fallOff=function(b,x){
 if(PG&&WILD.on&&!b.dead&&board.status==='playing'){const z=b.rb.translation().z/M,side=Math.abs(x-200)>(T.R-T.L)/2-2;if(!side&&z>=T.FRONT-30){if(b.kind==='coin'||b.kind==='silver')WILD.pgCoins++;else if(b.kind==='gold5')WILD.pgCoins+=5;}}
 return __pgFallOff(b,x);};
const __pgRainCollected=wildRainCollected;
wildRainCollected=function(b,x){const R=RAIN[b.kind];if(!R||!R.pgcoin||!PG)return __pgRainCollected(b,x);
 if(R.pgcoin==='cat')pgOpenBoard(R.cat);else pgWinRecipe();};
function pgOpenBoard(cat){if(PG.open[cat])return;PG.open[cat]=1;PG.openOrder.push(cat);PG.current=cat;PG.newBoard=cat;delete PG.coinReady[cat];pgAddXP(30);pgCheckWin();pgSave();
 PGU.moment={cat,t:0};pgSfx('fanfare');try{wildConfetti(90);}catch(e){}try{diagEvent('progress','board open '+cat);}catch(e){}}
function pgWinRecipe(){const r=PG_RECIPES.find(r=>pgRecipeOpen(r)&&!PG.recipes[r.id]&&!(PG.photos[r.cat]>0))||PG_RECIPES.find(r=>pgRecipeOpen(r)&&!PG.recipes[r.id]);
 if(r){PG.recipes[r.id]=1;PG.seen['r:'+r.id]=0;callout('RECIPE: '+r.name.toUpperCase()+'!',{color:'#ffb07a',dur:1.6});pgSfx('buy');}else{PG.coins+=25;callout('+25 COINS TO THE JAR',{color:'#ffd23f',dur:1.2});}pgSave();}
function pgCCEligible(){return PG_CATS.filter(c=>PG.coinReady[c]&&!PG.open[c]);}
function pgRCEligible(){return PG_RECIPES.some(r=>pgRecipeOpen(r)&&!PG.recipes[r.id]&&!(PG.photos[r.cat]>0)&&!(PG.dishes[r.id]>0)&&!PG.porch.some(s=>s&&s.cat===r.cat&&s.state!=='missed'));}
let PG_FORCE_CC=null;
const __pgBonus=wildScheduleBonus;
wildScheduleBonus=function(){
 if(PG&&!PG_HOME_OFF&&WILD.on&&WILD.phase==='play'){const cc=pgCCEligible();
  const want=PG_FORCE_CC||(cc.length&&!WILD.pgCC&&(WILD.goT||0)>8&&Math.random()<.3?cc[Math.random()*cc.length|0]:null);
  if(want){PG_FORCE_CC=null;WILD.pgCC=true;const y=rand(470,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'cc_'+want,id:null,x,y,t:1.1,t0:1.1});WILD.bonusN++;sfx.wild('whistle',1);callout(PG_CAT[want].name.toUpperCase()+"'S CAT COIN!",{color:'#ffd23f',dur:1.5});return;}
  if(!WILD.pgRC&&pgRCEligible()&&(WILD.goT||0)>12&&Math.random()<.15){WILD.pgRC=true;const y=rand(470,620),x=200+rand(-1,1)*(tableHalfAt(y)-50);WILD.incoming.push({kind:'recipecoin',id:null,x,y,t:.9,t0:.9});WILD.bonusN++;sfx.wild('whistle',1);return;}}
 return __pgBonus();};
const __pgLand=wildLandBonus;
wildLandBonus=function(o){const R=RAIN[o.kind];if(!R||!R.pgcoin)return __pgLand(o);
 const b=addCoin(o.kind,null,o.x,320,o.y,randomTurn(rand(.05,.2)),{x:0,y:-4,z:0},{x:0,y:rand(-2,2),z:0});b.rb.enableCcd(true);b.deliveryStartHeight=320;b.wildBonus=true;b.wildLandAt=time;
 const p=screenOf(o.x,o.y,0);rings.push({x:p.x,y:p.y,t:0,s:p.s});floats.push({text:R.pgcoin==='cat'?'CAT COIN! PUSH IT OFF':'RECIPE COIN!',x:p.x,y:p.y-30,t:0,big:true});sfx.wild('thud',1);};
// The end of a round: stars, XP, coins to the jar, prizes to the pantry.
function pgStars(win){if(!win)return 0;let s=1;if(WILD.left>=PG_STAR2)s=2;if(s===2&&WILD.pgPerfect)s=3;return s;}
function pgRoundEnd(win){
 if(!PG||PG_HOME_OFF||WILD.pgDone)return;WILD.pgDone=true;const cat=PGU.boardCat||'tuxedo';
 for(const id of WILD_COLLECTION)if(WILD.have[id]&&!WILD.pgAdded[id]){pgAddItem(id,1);WILD.pgAdded[id]=true;}
 const stars=pgStars(win),coins=(WILD.pgCoins|0)+10*stars,xp0=10+4*(WILD.got|0)+15*stars,lv=PG.level;
 PG.coins+=coins;PG.rounds++;if(stars>(PG.stars[cat]|0))PG.stars[cat]=stars;let nip=0;if(stars===3){PG.catnip+=1;nip=1;}
 const ups=pgAddXP(xp0);WILD.pgResult={stars,xp:Math.round(xp0*PG_DEV.xp),coins,nip,level:ups.length?PG.level:0,lv};pgSave();
 try{diagEvent('progress','round '+cat+' win='+win+' stars='+stars+' coins='+coins+' xp='+xp0+' level='+PG.level);}catch(e){}}
const __pgFinish=wildFinish;
wildFinish=function(win,reason){const was=board.status;const r=__pgFinish(win,reason);if(!PG_HOME_OFF)WILD.visitAt=null;if(was==='playing'&&(board.status==='won'||board.status==='lost'))pgRoundEnd(board.status==='won');return r;};
// The visiting-cat card is gone for good: visits live on the Porch now.
const __pgVisit=w2Visit;w2Visit=function(){if(PG_HOME_OFF)return __pgVisit();};
// A side game played perfectly in the round (dance, treat toss, pet the cat; laser: no misses) earns the 3rd star.
const __pgW2=sfx.wild2;sfx.wild2=function(kind,...a){if(kind==='perfect'&&WILD.on)WILD.pgPerfect=true;return __pgW2.call(this,kind,...a);};
if(typeof laserEndLog==='function'){const __pgLaserEnd=laserEndLog;laserEndLog=function(D){if(WILD.on&&D&&!D.logged&&D.misses===0&&D.hits>=3)WILD.pgPerfect=true;return __pgLaserEnd(D);};}
// End card: stars and what you earned, in place of the old stats lines (called from Wild's end card).
function pgEndText(R){const P=WILD.pgResult;if(!P||PG_HOME_OFF)return false;const y=R.card.y+140;
 for(let i=0;i<3;i++)w43Star(200+(i-1)*34,y-2,13,i<P.stars?'#ffd23f':'rgba(255,255,255,.18)');
 ctx.font='bold 13px system-ui';ctx.fillStyle='#fff6d0';ctx.textAlign='center';ctx.fillText('+'+P.xp+' XP · +'+P.coins+' coins to the jar'+(P.nip?' · +1 Catnip':'')+(P.level?' · LEVEL '+P.level+'!':''),200,y+20,330);
 return true;}
// Goal-card lines: the visitor and star-visitor lines become the stars line.
const PG_STAR_LINE=['pgstars','Win: 1 star · '+PG_STAR2+' s left: 2 stars','and a perfect side game: 3 stars'];
function pgFixLines(a){if(!Array.isArray(a))return;for(let i=0;i<a.length;i++)if(a[i]&&(a[i][0]==='visitor'||a[i][0]==='star'))a[i]=PG_STAR_LINE;}
function pgFixAllLines(){pgFixLines(W2_CARD_LINES);for(const k in WILD_MODES)pgFixLines(WILD_MODES[k].cardLines);if(typeof LASER_CARD_LINES!=='undefined')pgFixLines(LASER_CARD_LINES);if(typeof PET_CARD_LINES!=='undefined')pgFixLines(PET_CARD_LINES);if(typeof PET_W2_LINES!=='undefined')pgFixLines(PET_W2_LINES);}
const __pgCardIcon=w2CardIcon;
w2CardIcon=function(kind,x,y){if(kind==='pgstars'){for(let i=0;i<3;i++)w43Star(x-14+i*14,y+(i===1?-5:2),8,'#ffd23f');return;}return __pgCardIcon(kind,x,y);};
// --- one move per dance: each dance uses one of the Dancing pose's 4 moves, a different one from last time ---
function pgNextMove(){let last=PG?PG.lastMove:-1,m=Math.random()*4|0;if(m===last)m=(m+1+(Math.random()*3|0))%4;if(PG){PG.lastMove=m;pgSave();}return m;}
const __pgDanceStart=danceStart;danceStart=function(){__pgDanceStart();if(WILD.dance&&PG&&!PG_HOME_OFF)WILD.dance.move=pgNextMove();};
const __pgPawDance=startPawDance;startPawDance=function(){__pgPawDance();if(pawDance&&!pawDance.dbreak&&PG&&!PG_HOME_OFF)pawDance.oneMove=pgNextMove();};
const __pgPhase=pawDancePhase;pawDancePhase=function(){const r=__pgPhase();if(r&&!r.intro&&pawDance&&pawDance.oneMove!=null&&!pawDance.dbreak)r.index=pawDance.oneMove;return r;};
// --- entering and leaving boards ---
const __pgW2Enter=wild2Enter;wild2Enter=function(){const r=__pgW2Enter();if(r)PGU.screen='board';return r;};
const __pgModeEnter=wildModeEnter;wildModeEnter=function(id){if(!PGU.pgPlaying)PGU.boardCat=pgCatOfMode(id);const r=__pgModeEnter(id);return r;};
const __pgPlay=pgPlay;pgPlay=function(cat){PGU.pgPlaying=true;try{return __pgPlay(cat);}finally{PGU.pgPlaying=false;}};
// Leaving a board (EXIT during a round) comes straight back to a cat's board and its next goal card, on the next frame
// (so Developer code that leaves one board for another doesn't bounce).
const __pgExit=wildExit;wildExit=function(){PGU.moment=null;const r=__pgExit();pgRestoreArt();pgSetList(PG_DEFAULT_LIST);if(r&&PG&&!PG_HOME_OFF&&!PGU.entering&&!PGU.oldBoards){PGU.screen='board';PGU.reenter=true;}return r;};
function pgBoardCatNow(){return PGU.boardCat&&pgCanPlay(PGU.boardCat)?PGU.boardCat:pgPlayCat();}
function pgReenter(){PGU.reenter=false;if(!PG||PG_HOME_OFF||PGU.oldBoards||WILD.on)return;PGU.screen='board';pgPlay(pgBoardCatNow());}
// Switches to another cat's board (its goal card).
function pgSwitchBoard(cat){PGU.entering=true;try{if(WILD.on)wildExit();}finally{PGU.entering=false;}PGU.pick=false;PGU.reenter=false;const ok=pgPlay(cat);if(ok)PGU.fade=.3;return ok;}
// wildModeEnter leaves any board first: stay on the board then.
const __pgModeEnter2=wildModeEnter;wildModeEnter=function(id){PGU.entering=true;try{const r=__pgModeEnter2(id);if(r){PGU.screen='board';pgApplyArt(PGU.boardCat||pgCatOfMode(id));}return r;}finally{PGU.entering=false;}};
// ---------- input ----------
function pgGo(screen){if(screen==='board'){PGU.screen='board';PGU.pick=false;PGU.t=0;if(!WILD.on&&!PG_HOME_OFF&&!PGU.oldBoards)pgPlay(pgBoardCatNow());try{diagEvent('progress','screen board');}catch(e){}return;}PGU.screen=screen;PGU.t=0;PGU.pick=false;if(screen==='kitchen'){PGU.k.cook=null;}if(screen==='porch'){PGU.porch.pick=null;PGU.porch.chirp=.6;}if(screen==='album'){PGU.album.flipT=0;}try{diagEvent('progress','screen '+screen);}catch(e){}}
function pgPointerDown(e,p){
 const sc=PGU.screen;if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return;}
 if(['kitchen','porch','album','shop'].includes(sc)&&contains(pgScreenCatRect(),p)){pgScreenReact('tap');pgSfx('meow');pgSfx('purr',.7);return;}
 if(contains(pgBack(),p)&&!(sc==='kitchen'&&PGU.k.cook&&PGU.k.cook.stage==='ding')){pgSfx('back');if(sc==='kitchen'&&PGU.k.cook){PGU.k.cook=null;return;}pgGo('board');return;}
 if(sc==='kitchen'){const C=PGU.k.cook;
  if(!C){const rows=pgKitchenRows();for(const row of rows){const b={x:row.x+row.w-86,y:row.y+row.h/2-20,w:76,h:40};if(contains(b,p)){if(pgCanCook(row.r))pgStartCook(row.r);else{pgSfx('lock');pgToast(PG.recipes[row.r.id]?'Missing ingredients':'Used up: win a recipe coin','#ffe08a');}return;}}return;}
  if(C.stage==='add'){for(const it of C.items){if(it.in||it.fly)continue;if(Math.hypot(p.x-it.x,p.y-(it.y-20))<34){it.drag=true;it.dx=p.x;it.dy=p.y;it.down=PGU.t;C.drag=it;pgSfx('tap',.6);return;}}return;}
  if(C.stage==='stir'){const py=pgPotY();if(Math.hypot(p.x-200,(p.y-(py-30))*1.6)<PG_POT.r+60){C.lastA=Math.atan2(p.y-(py-30),p.x-200);C.down=true;pgStirAdd(.55);}return;}
  if(C.stage==='ding'&&C.dingT>.6){const B=pgCookButtons();if(contains(B.porch,p)){PGU.k.cook=null;pgGo('porch');const i=PG.porch.findIndex(s=>!s);if(i>=0)PGU.porch.pick=i;}else if(contains(B.back,p)){PGU.k.cook=null;pgSfx('back');}}
  return;}
 if(sc==='porch'){const P=PGU.porch;
  if(P.pick!==null){const R=pgPorchPickRects();for(const r of R.rows)if(contains(r,p)){pgSetFood(P.pick,r.r.id);P.pick=null;return;}P.pick=null;pgSfx('back');return;}
  const c=pgCamera(),i=PG.porch.findIndex(s=>s&&s.state==='visit');if(contains(c,p)||(i>=0&&Math.hypot(p.x-pgSpots()[i].x,p.y-(pgSpots()[i].y-50))<80)){if(i>=0)pgPhoto(i);else pgSfx('lock');return;}
  pgSpots().forEach((sp,k)=>{if(Math.hypot(p.x-sp.x,p.y-sp.y)>80)return;const s=PG.porch[k];if(!s){if(Object.values(PG.dishes).some(n=>n>0)){P.pick=k;pgSfx('tap');}else{pgSfx('lock');pgToast('Cook a dish in the Kitchen first','#ffe08a');}}
   else if(s.state==='missed'){PG.porch[k]=null;pgSave();pgSfx('whoosh');pgToast('It will come back if you cook again','#fff');}else if(s.state==='food')pgSfx('tap');});
  return;}
 if(sc==='album'){const B=pgAlbumArrows();if(contains(B.prev,p))pgAlbumFlip(-1);else if(contains(B.next,p))pgAlbumFlip(1);else{PGU.album.sx=p.x;}return;}
 if(sc==='shop'){const T2=pgShopTabs();for(const k of ['sell','buy'])if(contains(T2[k],p)){PGU.shop.tab=k;pgSfx('tap');return;}for(const r of pgShopRows())if(contains(r.btn,p)||contains(r,p)){pgShopTap(r);return;}return;}}
function pgPointerMove(e){const sc=PGU.screen;if(sc!=='kitchen')return false;const C=PGU.k.cook;if(!C)return false;const p=toGame(e);
 if(C.stage==='add'&&C.drag){C.drag.x=p.x;C.drag.y=p.y+20;return true;}
 if(C.stage==='stir'&&C.down){const py=pgPotY(),a=Math.atan2(p.y-(py-30),p.x-200);if(C.lastA!=null){let d=a-C.lastA;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;if(Math.abs(d)<1.2)pgStirAdd(d);}C.lastA=a;return true;}
 return false;}
function pgPointerUp(e){const sc=PGU.screen;if(sc==='board'||sc==='title')return false;
 if(sc==='album'&&PGU.album.sx!=null){const p=toGame(e),dx=p.x-PGU.album.sx;PGU.album.sx=null;if(Math.abs(dx)>50)pgAlbumFlip(dx<0?1:-1);return true;}
 if(sc!=='kitchen')return false;const C=PGU.k.cook;if(!C)return false;C.down=false;C.stirring=false;
 if(C.drag){const it=C.drag,py=pgPotY();C.drag=null;it.drag=false;const moved=Math.hypot(it.x-it.hx,it.y-it.hy);
  if(Math.hypot(it.x-200,(it.y-20-(py-40))*1.3)<PG_POT.r+20)pgIntoPot(it);else if(moved<14){it.fly={t:0,x:it.hx,y:it.hy};it.x=it.hx;it.y=it.hy;pgSfx('whoosh',.6);}else{it.x=it.hx;it.y=it.hy;}}
 return true;}
const __pgPetMove=petPointerMove;petPointerMove=function(e){if(!PG_HOME_OFF&&PG&&pgPointerMove(e))return true;return __pgPetMove(e);};
const __pgPetUp=petPointerUp;petPointerUp=function(e){if(!PG_HOME_OFF&&PG&&pgPointerUp(e))return true;return __pgPetUp(e);};
// Taps on the board: the YOU WON card, the board picker, and between rounds the top bar and the end card's New goal.
function pgBoardPointer(p){
 if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return true;}
 if(PGU.pick){const R=pgPickRects();for(const r of R.rows)if(contains(r,p)){if(WILD.on&&r.c===PGU.boardCat){PGU.pick=false;pgSfx('back');}else if(pgCanPlay(r.c)){pgSfx('door');pgSwitchBoard(r.c);}else{pgSfx('lock');pgToast(PG.open[r.c]?'Switching boards opens at level '+PG_SWITCH_LEVEL:'Win its cat coin to open this board','#ffe08a');}return true;}PGU.pick=false;pgSfx('back');return true;}
 if(PGU.modes){pgModesTap(p);return true;}
 if(PGU.door)return true;
 if(WILD.on&&!inventoryOpen&&!pgRestPhase()&&contains(pgPlayGear(),p)){openCredits();return true;}
 if(!pgRestPhase())return false;
 if(WILD.phase==='end'){const R=wildEndRects();if(contains(R.back,p)||(contains(R.again,p)&&!pgCanPlay(PGU.boardCat))){pgSfx('tap');if(!pgCanPlay(PGU.boardCat))pgSwitchBoard(pgPlayCat());else wildReset();return true;}}
 const D=pgDock();if(p.y>D.bottom)return false; // below the bar: the card's own taps
 if(contains(D.gear,p)){openCredits();return true;}
 if(contains(D.coll,p)){pgSfx('tap');openLoopScreen('water');return true;}
 if(contains(D.inv,p)){pgSfx('tap');openLoopScreen('inventory');return true;}
 if(D.modes&&contains(D.modes,p)){pgSfx('tap');PGU.modes=true;PGU.modesT=0;return true;}
 for(const t of D.tiles){if(!contains(t,p))continue;if(t.level&&PG.level<t.level){pgSfx('lock');pgToast(pgDockName(t.id)+' opens at level '+t.level,'#ffe08a');return true;}pgSfx('door');PGU.door={id:t.id,t:0};return true;}
 return true;} // the bar swallows the rest of its taps
function pgBackText(){return PG_HOME_OFF||!PG?'Back to the game':'New goal';}
const __pgPointer=wildPointer;
wildPointer=function(e,p){
 if(!PG_HOME_OFF&&PG){if(PGU.screen==='title'){pgTitleSkip();return true;}
  if(PGU.screen!=='board'){if(PGU.door)return true;pgPointerDown(e,p);return true;}
  if(pgBoardPointer(p))return true;}
 return __pgPointer(e,p);};
// ---------- the frame: the title and the Kitchen, Porch, Album and Shop replace the board (no physics while they show) ----------
const __pgStep=step;step=function(){if(!PG_HOME_OFF&&PG&&PGU.screen!=='board')return;return __pgStep();};
let pgTickAcc=0;
const __pgUpdate=update;
update=function(dt){
 __pgUpdate(dt);if(!PG_INIT&&world)pgInit();if(!PG)return;
 PGU.t+=dt;PGU.T+=dt;pgTickAcc+=dt;if(pgTickAcc>=.5){pgTickAcc=0;pgPorchTick();}
 for(let i=PGU.toasts.length-1;i>=0;i--){const T3=PGU.toasts[i];if(i===0||T3.t>0)T3.t+=dt;if(T3.t>T3.dur)PGU.toasts.splice(i,1);}
 for(let i=PGU.floats.length-1;i>=0;i--){PGU.floats[i].t+=dt;if(PGU.floats[i].t>1.2)PGU.floats.splice(i,1);}
 if(!PG_HOME_OFF&&PGU.screen==='title')pgTitleTick(dt);if(PGU.reenter)pgReenter();if(PGU.fade>0)PGU.fade=Math.max(0,PGU.fade-dt);
 if(PGU.door){PGU.door.t+=dt;if(PGU.door.t>=.24){const id=PGU.door.id;PGU.door=null;if(id==='board'){PGU.pick=true;PGU.pickT=0;}else pgGo(id);}}
 if(PGU.pick)PGU.pickT+=dt;
 if(PGU.moment){PGU.moment.t+=dt;if(PGU.moment.t>3.2)PGU.moment=null;}
 if(PGU.level){PGU.level.t+=dt;if(PGU.level.t>2.4)PGU.level=null;}
 if(PGU.win)PGU.win.t+=dt;else if(PG.won&&!PG.wonShown&&!PG_HOME_OFF&&((PGU.screen!=='board'&&PGU.screen!=='title')||pgRestPhase())){PG.wonShown=true;PGU.win={t:0};pgSfx('fanfare');pgSave();}
 // the cats' recoloured copies are made one picture at a time, between rounds and on the other screens
 PGU.warmT-=dt;if(PGU.warmT<=0&&!PGU.door&&((PGU.screen!=='board'&&PGU.screen!=='title')||pgRestPhase())){PGU.warmT=.25;pgWarm();}};
// The round timer holds while a cat-coin moment plays.
const __pgTick=wildTick;wildTick=function(dt){if(PGU.moment&&WILD.on&&WILD.phase==='play'){WILD.left+=dt;}return __pgTick(dt);};
const __pgDraw=draw;
function pgDrawDt(){const n=performance.now(),dt=Math.min(.05,PGU.lastDraw!=null?(n-PGU.lastDraw)/1000:.016);PGU.lastDraw=n;return Math.max(0,dt);}
draw=function(){
 if(PG_HOME_OFF||!PG){__pgDraw();return;}
 if(PGU.reenter)pgReenter();
 if(PGU.screen==='board'){__pgDraw();pgBoardOverlay();return;}
 ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';const dt=pgDrawDt();
 PGU.hdt=dt;try{({main:pgDrawMain,title:pgDrawTitle,kitchen:pgDrawKitchen,porch:pgDrawPorch,album:pgDrawAlbum,shop:pgDrawShop}[PGU.screen]||pgDrawTitle)(dt);}catch(e){try{frameError(e);}catch(_){}}
 if(PGU.screen!=='title'){pgFloatsDraw();pgToastsDraw();pgLevelDraw();pgWinDraw();}
 ctx.font='10px system-ui';ctx.fillStyle='rgba(255,255,255,.5)';ctx.textAlign='left';ctx.fillText(BUILD,8,pgBot()-6);};
function pgFloatsDraw(){for(const f of PGU.floats){const u=f.t/1.2;ctx.save();ctx.globalAlpha=1-u*u;ctx.textAlign='center';ctx.font='900 18px Impact, system-ui';ctx.lineWidth=4;ctx.strokeStyle='#2a1a00';ctx.strokeText(f.text,f.x,f.y-u*40);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y-u*40);ctx.restore();}}
// Messages: on the board they sit below the cat's chin; elsewhere under the top bar. One at a time.
function pgToastsDraw(){const T3=PGU.toasts[0];if(!T3)return;const onBoard=PGU.screen==='board',card=onBoard&&WILD.on&&WILD.v2&&WILD.phase==='card'&&!inventoryOpen,L=card?w2CardLayout():null,
 y=card?L.back.y+L.back.h/2:onBoard?(typeof w43ChinY==='function'?w43ChinY():300)+34:PGU.screen==='porch'?pgTop()+104:PGU.screen==='album'?pgBot()-112:pgBot()-56,a=Math.min(1,T3.t/.2,(T3.dur-T3.t)/.3);
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=Math.max(0,a);ctx.font='bold 16px system-ui';const ic=T3.icon==='paw'?26:0,w=Math.min(380,ctx.measureText(T3.text).width+40+ic);
 uiRound(200-w/2,y-17,w,34,17,'rgba(20,10,30,.88)',T3.color,2);ctx.fillStyle=T3.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(T3.text,200-ic/2,y+1,w-20-ic);
 if(ic)pgPaw(200+w/2-24,y+1,.3,T3.color);ctx.restore();}
function pgLevelDraw(){const L=PGU.level;if(!L||PGU.screen==='board')return;const u=Math.min(1,L.t/.3),y=H*.42;ctx.save();ctx.globalAlpha=Math.min(1,(2.4-L.t)/.4);ctx.translate(200,y);ctx.scale(.5+.5*u,.5+.5*u);ctx.rotate(-.05);wildText('LEVEL '+L.L+'!',0,0,60,'#7dff6a','#0c3a12',9);ctx.restore();}
function pgWinDraw(){const V=PGU.win;if(!V)return;const t=V.t;ctx.save();ctx.fillStyle='rgba(8,4,16,'+Math.min(.8,t)+')';ctx.fillRect(0,0,W,H);
 PG_CATS.forEach((c,i)=>{const x=60+i*70,y=H*.45+Math.sin(t*8+i*1.3)*18;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*6+i)*.25);pgHead(c,0,0,110,i%2?'sweet':'calm');ctx.restore();});
 ctx.translate(200,H*.28);const k=1+.06*Math.sin(t*5);ctx.scale(k,k);wildText('YOU WON!',0,0,64,'#ffd23f','#3a1a00',10);ctx.font='bold 16px system-ui';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('Every cat photographed, every board open',0,46);ctx.restore();
 if(Math.random()<.03)pgFloat('MEOW!',rand(60,340),H*.62,'#ff7ad5');}
// On a cat's board: its name tag under the chin, messages, and the big moment when a cat coin opens a board.
function pgBoardOverlay(){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);if(!WILD.on){ctx.restore();pgToastsDraw();return;}
 const cat=PGU.boardCat||'tuxedo',cy=typeof w43ChinY==='function'?w43ChinY():300;if(WILD.phase==='play'||WILD.phase==='count')pgTag(cat,W-46,cy-14,.8);
 pgFloatsDraw();const M2=PGU.moment;
 if(M2){const t=M2.t,u=Math.min(1,t/.4),a=Math.min(1,(3.2-t)/.4),y=cy+190;ctx.globalAlpha=a;ctx.fillStyle='rgba(12,6,24,.7)';ctx.fillRect(0,cy+20,W,330);
  ctx.save();ctx.translate(200,y);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=i%2?'rgba(255,210,63,.25)':'rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-30,-220);ctx.lineTo(30,-220);ctx.fill();}ctx.restore();
  ctx.save();ctx.translate(200,y);ctx.scale(.3+.7*(1-Math.pow(1-u,3)),.3+.7*(1-Math.pow(1-u,3)));pgHead(M2.cat,0,0,260,t%1.2<.6?'sweet':'calm');ctx.restore();
  wildText(PG_CAT[M2.cat].name.toUpperCase()+"'S BOARD",200,cy+50,32,'#ffd23f','#3a1a00',6);wildText('IS OPEN!',200,cy+90,34,'#7dff6a','#0c3a12',6);
  ctx.font='bold 14px system-ui';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(PG_CAT[M2.cat].board+(PG.level>=PG_SWITCH_LEVEL?' · pick it from Boards, up top':' · it plays from the next round'),200,y+100);}
 if(WILD.on&&pgRestPhase())pgDrawDock();else if(WILD.on&&!inventoryOpen)pgDrawPlayGear();
 ctx.restore();pgToastsDraw();
 const dt=pgDrawDt();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 if(PGU.pick)pgDrawBoardPick(dt);ctx.restore();pgDrawModes();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';pgWinDraw();if(PGU.fade>0){ctx.fillStyle='rgba(10,4,20,'+Math.min(1,PGU.fade/.3)+')';ctx.fillRect(0,0,W,H);}ctx.restore();}
// Music on the Kitchen, Album and Shop; the Porch has garden sounds; the title screen its own jingle.
const __pgBgm=bgmWanted;bgmWanted=function(){if(!PG_HOME_OFF&&PG&&PGU.screen!=='board'){if(S.muted||!(W2.music>0)||document.hidden||(typeof inBackground!=='undefined'&&inBackground))return false;return PGU.screen!=='porch'&&PGU.screen!=='title';}return __pgBgm();};
// ---------- Developer ----------
function pgDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px',
 row=(k,label,val)=>'<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">'+label+'</span><button data-pg="'+k+'" data-dir="-1" style="'+b+'">−</button><b style="min-width:64px;text-align:center">'+val+'</b><button data-pg="'+k+'" data-dir="1" style="'+b+'">+</button></div>';
 const mb=(id,l)=>'<button data-pgmode="'+id+'" class="wide" style="margin:3px 0">'+l+'</button>';
 return '<div class="set" id="pg-dev"><h3><span>Gameplay map (CP-45)</span><span>level '+(PG?PG.level:1)+'</span></h3>'
 +row('window','Visit window',PG_DEV.window?PG_DEV.window+' s':'real (20 min–2 h)')+row('xp','XP speed',PG_DEV.xp+'×')+row('cap','Item cap',PG_DEV.cap)
 +'<button id="pg-coins" class="wide">Give all cat coins (open every board)</button><button id="pg-cc" class="wide">Drop a cat coin in the next round</button><button id="pg-visit" class="wide">Cat visits now</button><button id="pg-give" class="wide">Give 3 of every prize + 300 coins</button><button id="pg-reset" class="wide">Reset progression</button>'
 +'<h3 style="margin-top:10px"><span>MODES</span><span>test any board</span></h3>'+mb('wild2','Tuxedo')+WILD_MODE_ORDER.map(id=>mb(id,WILD_MODES[id].name)).join('')+mb('home-off','Old boards 1–3 (leave the cat boards)')+'</div>';}
const __pgDevHtml=wildDevHtml;wildDevHtml=function(){return pgDevHtml()+__pgDevHtml();};
const __pgDevBind=wildDevBind;
wildDevBind=function(panel){__pgDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const steps={window:[0,20,30,60,120,300,600],xp:[1,2,5,10],cap:[1,2,3,5,9,15,30]};
 for(const btn of box.querySelectorAll('[data-pg]'))btn.onclick=()=>{const k=btn.dataset.pg,L=steps[k];let i=L.indexOf(PG_DEV[k]);if(i<0)i=0;i=Math.max(0,Math.min(L.length-1,i+ +btn.dataset.dir));PG_DEV[k]=L[i];pgDevSave();try{diagEvent('progress-tuning',k+'='+PG_DEV[k]);}catch(e){}re();};
 const on=(id,f)=>{const el=box.querySelector('#'+id);if(el)el.onclick=()=>{if(!PG)pgInit();f();pgSave();re();};};
 on('pg-coins',()=>{for(const c of PG_CATS)if(!PG.open[c]){PG.open[c]=1;PG.openOrder.push(c);}PG.current=pgNewest();PG.newBoard=PG.current;pgCheckWin();pgToast('Every board is open','#ffd23f');});
 on('pg-cc',()=>{const c=PG_CATS.find(c=>!PG.open[c]);if(c){PG.coinReady[c]=1;PG_FORCE_CC=c;pgToast(PG_CAT[c].name+"'s coin drops in the next round",'#ffd23f');}});
 on('pg-visit',()=>{const now=pgNow();let i=PG.porch.findIndex(s=>s&&(s.state==='food'||s.state==='visit'));if(i<0){i=PG.porch.findIndex(s=>!s||s.state==='missed');if(i<0)i=0;const r=pgCurrentRecipe()||PG_RECIPES[0];PG.porch[i]={dish:r.id,cat:r.cat,setAt:now,eatAt:now,leaveAt:0,state:'food'};}
  const s=PG.porch[i];if(s.state==='food')s.eatAt=now;pgPorchTick();});
 on('pg-give',()=>{for(const id of PG_PRIZES){PG.items[id]=Math.min(pgCap(),pgHave(id)+3);PG.ever[id]=1;}PG.coins+=300;pgCheckStamps();});
 on('pg-reset',()=>{PG=pgFresh();PGU.toasts=[];PGU.pick=false;PGU.screen='board';if(WILD.on&&PGU.boardCat!=='tuxedo')pgSwitchBoard('tuxedo');pgToast('Progression reset','#fff');});
 for(const btn of box.querySelectorAll('[data-pgmode]'))btn.onclick=()=>{panel.style.display='none';const id=btn.dataset.pgmode;
  if(id==='home-off'){PGU.oldBoards=true;if(WILD.on)wildExit();PGU.screen='board';return;}PGU.oldBoards=false;PGU.entering=true;try{if(WILD.on)wildExit();}finally{PGU.entering=false;}PGU.screen='board';if(id==='wild2'){PGU.boardCat='tuxedo';if(wild2Enter())pgApplyArt('tuxedo');}else wildModeEnter(id);};};
// Test hook: the UAT 47/48 suites start on the old board (no title, no cat boards).
function pgHomeOff(){PG_HOME_OFF=true;PGU.screen='board';}

// The screen cat reacts to what happens on its screen.
const __pgFinishCook=pgFinishCook;pgFinishCook=function(){const r=__pgFinishCook();pgScreenReact('happy');pgSfx('meow',.8);return r;};
const __pgPhotoR=pgPhoto;pgPhoto=function(i){const n=PG.porch[i]&&PG.porch[i].state;const r=__pgPhotoR(i);if(n==='visit')pgScreenReact('perk');return r;};
const __pgPorchTickR=pgPorchTick;pgPorchTick=function(){const v=PG?PG.porch.filter(s=>s&&s.state==='visit').length:0;const r=__pgPorchTickR();if(PG&&PGU.screen==='porch'&&PG.porch.filter(s=>s&&s.state==='visit').length>v){pgScreenReact('perk');pgSfx('meow',.7);}return r;};
const __pgStampsR=pgCheckStamps;pgCheckStamps=function(){const n=PG?PG.catnip:0;const r=__pgStampsR();if(PG&&PG.catnip>n){pgScreenReact('purr');pgSfx('purr',.9);}return r;};
const __pgShopTapR=pgShopTap;pgShopTap=function(r){const c=PG.coins;const out=__pgShopTapR(r);if(PG.coins>c)pgScreenReact('nod');return out;};

const __pgModeName=wildModeName;wildModeName=function(){return PG&&!PG_HOME_OFF&&!wildMode()?'TUXEDO':__pgModeName();};

function danceBeatX(){const D=WILD.on&&WILD.dance;if(!D||!pawDance||!pawDance.dbreak||D.phase==='finale')return null;const x=(danceNow()-D.p0)/D.beat;return x>=0&&x<D.n?x:null;}
function danceBeatShape(x){const D=WILD.dance,k=Math.floor(x),ph=x-k;return {k,s:k%2?-1:1,lift:Math.sin(Math.PI*ph),e:Math.max(0,Math.min(1,(D.n-x)/.5,(x+.25)/.25))};}
const __dbMotion=pawMotion;
pawMotion=function(side=0){const x=danceBeatX();if(x==null)return __dbMotion(side);const m=WILD.dance.move,{k,s,lift,e}=danceBeatShape(x);
 if(m===0)return {x:0,y:0,r:0};
 if(m===1){if(!side)return {x:12*e*s*lift,y:-15*e*lift,r:.075*e*s*lift};const mine=(side>0)===(k%2===0);return {x:-side*12*e,y:-(mine?58:10)*e*lift,r:(mine?.38:.1)*e*side*lift};}
 if(m===2)return side?{x:22*e*s*lift,y:-24*e*lift*(side>0===(k%2===0)?1.6:.6),r:.32*e*s*lift}:{x:24*e*s*lift,y:-19*e*lift,r:.12*e*s*lift};
 return side?{x:-side*20*e,y:-68*e*lift,r:side*.32*e*lift}:{x:10*e*s*lift,y:-30*e*lift,r:.07*e*s*lift};};
const __dbGaze=pawGaze;
pawGaze=function(){const x=danceBeatX();if(x==null||WILD.dance.move!==0)return __dbGaze();const {e}=danceBeatShape(x),c=Math.cos(Math.PI*x);return {x:1.7*e*c,y:-.3*e*Math.abs(c)};};

// --- UAT 55: A/B of the between-rounds layout (CP-45 A/B brief; Jenny, Nov 14: one clear thing to do, where you are and
// how hard it is, everything else quiet at the edges; "CatCoin needs to have a cat and coins right away").
// Both variants share one hierarchy: one big PLAY; "Level n" and a difficulty tag; the goal ("Collect these 7" with the
// prize icons); Kitchen, Porch, Album (left) and Shop, Boards (right) as small round buttons in the side columns, with a
// "!" when something waits there and the same unlock rules; a slim top bar (level/XP, coins, Catnip, Collections,
// Inventory, MODES with Developer, Settings). Nothing goes over the cat's face; nothing in the bottom strip during play.
//  A, main screen: between rounds a screen of its own: the board's cat (floating head) over a coin rain and a pile of coins,
//     with the hierarchy. PLAY goes onto the board and starts the round; the end card's New goal comes back here.
//  B, board view: no extra screen; between rounds the coin board stays behind, the hierarchy sits in the goal card's area
//     (below the chin) instead of the old card and the row of five equal buttons.
// "?" shows the old goal card (the rules), from which a tap starts the round as before.
// Developer: "Home layout: A main screen / B board view" (default A, takes effect at once) and a difficulty tag per board.
const PG_AB_KEY='catpusher.uat.homelayout.v1',PG_DIFF_KEY='catpusher.uat.difficulty.v1';
const PG_DIFFS=['Normal','Hard','Super hard'],PG_DIFF_COL={Normal:['#7dff6a','#0c3a12'],Hard:['#ffb23f','#4a2200'],'Super hard':['#ff5a8a','#4a0a22']};
const PG_DIFF_DEFAULT={tuxedo:'Normal',orange:'Normal',ragdoll:'Hard',siamese:'Hard',tortie:'Super hard'}; // placeholders, by opening order
let PG_AB='A',PG_DIFF={...PG_DIFF_DEFAULT};
try{const a=localStorage.getItem(PG_AB_KEY);if(a==='A'||a==='B')PG_AB=a;const d=JSON.parse(localStorage.getItem(PG_DIFF_KEY)||'null');if(d)for(const c in PG_DIFF_DEFAULT)if(PG_DIFFS.includes(d[c]))PG_DIFF[c]=d[c];}catch(e){}
function pgABSave(){try{localStorage.setItem(PG_AB_KEY,PG_AB);localStorage.setItem(PG_DIFF_KEY,JSON.stringify(PG_DIFF));}catch(e){}}
function pgABOn(){return !!(PG&&!PG_HOME_OFF&&!PGU.oldBoards);}
function pgDiff(cat){return PG_DIFF[cat]||'Normal';}
const PG_SIDE_L=['kitchen','porch','album'],PG_SIDE_R=['shop','board'];

// the slim top bar: row 1 only (the five big buttons move to the side columns)
const __abDock=pgDock;
pgDock=function(){const D=__abDock();if(!pgABOn())return D;const top=D.top,bot=D.bottom,y1=Math.round((top+bot)/2)-1,r=y1-15; // the same band as before (it covers the round's HUD), one row centred in it
 return {top,bottom:bot,y1,gear:{x:W-40,y:r,w:40,h:30},coll:{x:248,y:r+1,w:30,h:28},inv:{x:280,y:r+1,w:30,h:28},modes:S.dev?{x:314,y:r+4,w:44,h:22}:null,tiles:[]};};

// side columns: from y0 down, 3 on the left and 2 on the right
function pgSideRects(y0,gap){const r=[];PG_SIDE_L.forEach((id,i)=>r.push({id,x:36,y:y0+i*gap,r:25}));PG_SIDE_R.forEach((id,i)=>r.push({id,x:W-36,y:y0+i*gap,r:25}));
 return r.map(b=>({...b,level:PG_DOCK_LEVEL[b.id],hit:{x:b.x-32,y:b.y-30,w:64,h:68}}));}
function pgDrawSide(rects,t){for(const b of rects){const id=b.id,col=PG_DOCK_COL[id],locked=b.level&&PG.level<b.level,pr=PGU.door&&PGU.door.id===id?Math.min(1,PGU.door.t/.24):0,k=1-.12*Math.sin(pr*Math.PI);
  ctx.save();ctx.translate(b.x,b.y);ctx.scale(k,k);uiCircle(0,3,b.r,'rgba(0,0,0,.35)');const g=ctx.createLinearGradient(0,-b.r,0,b.r);g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);uiCircle(0,0,b.r,g,'#fff6d0',2);
  ctx.save();ctx.beginPath();ctx.arc(0,0,b.r-2,0,7);ctx.clip();ctx.scale(.42,.42);pgDoorIcon(id,0,4,t);ctx.restore();
  if(locked){uiCircle(0,0,b.r,'rgba(10,6,20,.6)');pgLock(0,0,.7);}
  ctx.textAlign='center';ctx.textBaseline='middle';const lab=locked?'LEVEL '+b.level:pgDockName(id).toUpperCase();ctx.font='900 10px Impact, system-ui';const lw=ctx.measureText(lab).width+10;
  uiRound(-lw/2,b.r-4,lw,15,7,'rgba(16,8,28,.9)',locked?'#ffe08a':col[0],1);ctx.fillStyle=locked?'#ffe08a':'#fff';ctx.fillText(lab,0,b.r+4);
  if(!locked&&pgWaiting(id)){const kk=1+.1*Math.sin(t*6);uiCircle(b.r*.72,-b.r*.72,9*kk,'#ff3a6a','#fff',2);ctx.fillStyle='#fff';ctx.font='900 '+Math.round(13*kk)+'px Impact, system-ui';ctx.fillText('!',b.r*.72,-b.r*.72+1);}
  ctx.restore();}}
function pgSideTap(rects,p){for(const b of rects){if(!contains(b.hit,p))continue;if(b.level&&PG.level<b.level){pgSfx('lock');pgToast(pgDockName(b.id)+' opens at level '+b.level,'#ffe08a');return true;}pgSfx('door');PGU.door={id:b.id,t:0};return true;}return false;}

// the centre: board name, Level n + difficulty, the goal, PLAY, "?"
function pgDiffPill(x,y,tag){ctx.font='900 15px Impact, system-ui';const w=ctx.measureText(tag.toUpperCase()).width+22,c=PG_DIFF_COL[tag]||PG_DIFF_COL.Normal;uiRound(x-w/2,y-12,w,24,12,c[0],'#fff6d0',1.5);ctx.fillStyle=c[1];ctx.textAlign='center';ctx.fillText(tag.toUpperCase(),x,y+1);return w;}
function pgCentre(y,t,o={}){const cat=PGU.boardCat||'tuxedo',L={};
 wildText(o.name||wildModeName(),200,y,o.nameSize||30,'#ffd23f','#2a0b3e',6);
 // Level n and the tag side by side
 ctx.font='italic 900 22px Impact, "Arial Black", system-ui';const lt='LEVEL '+pgBoardLevel(),lw=ctx.measureText(lt).width;ctx.font='900 15px Impact, system-ui';const tw=ctx.measureText(pgDiff(cat).toUpperCase()).width+22,tot=lw+10+tw,x0=200-tot/2;
 ctx.textAlign='left';wildText(lt,x0,y+38,22,'#fff','#2a0b3e',5);ctx.textAlign='center';pgDiffPill(x0+lw+10+tw/2,y+37,pgDiff(cat));
 // the goal
 ctx.font='bold 15px system-ui';ctx.fillStyle='#ffe8b0';ctx.fillText('Collect these '+WILD_GOAL,200,y+72);
 const n=WILD_COLLECTION.length,sp=Math.min(42,238/Math.max(1,n));WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(n-1)/2)*sp,y+98,Math.min(40,sp-2),!!WILD.have[id]));
 // "?" how to play
 L.help={x:200-58,y:y+130,w:116,h:26};uiRound(L.help.x,L.help.y,L.help.w,L.help.h,13,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);ctx.font='bold 12px system-ui';ctx.fillStyle='#e8dcff';ctx.fillText('? How to play',200,L.help.y+L.help.h/2+1);
 return L;}
function pgPlayButton(y,t,hh=78){const k=1+.035*Math.sin(t*4),r={x:78,y,w:244,h:hh};ctx.save();ctx.translate(200,y+hh/2);ctx.scale(k,k);ctx.translate(-200,-(y+hh/2));
 uiRound(r.x,r.y+6,r.w,r.h,30,'rgba(0,0,0,.4)');const g=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g.addColorStop(0,'#ffe36a');g.addColorStop(.55,'#ffc21f');g.addColorStop(1,'#e8900a');uiRound(r.x,r.y,r.w,r.h,30,g,'#fff6d0',3);
 uiRound(r.x+14,r.y+8,r.w-28,18,9,'rgba(255,255,255,.35)');ctx.textAlign='center';wildText('PLAY',200,r.y+r.h/2+3,Math.min(46,hh*.6),'#fff','#7a3a00',8);ctx.restore();return r;}
function pgStartRound(){PGU.rules=false;const L=w2CardLayout();pgSfx('door');__pgPointer({timeStamp:0,preventDefault(){}},{x:200,y:L.start.y+L.start.h/2});}

// ---- B: the board view's between-rounds panel (in place of the goal card) ----
function pgBLayout(){const h=hudLayout(),ch=w43ChinY(),bot=Math.min(H-Math.max(24,h.bottom+16),h.bottomY-12); // UAT 57: the panel ends above the bottom readouts (rule 11)
 const py=Math.max(ch+8+194,bot-96),ph=Math.max(50,Math.min(78,bot-6-py));return {ch,bot,panel:{x:72,y:ch+8,w:256,h:bot-ch-8},play:py,playH:ph,side:pgSideRects(ch+46,Math.min(96,(bot-ch-80)/3))};}
const __abCard=drawWild2Card;
drawWild2Card=function(){if(!pgABOn()||PG_AB!=='B'||PGU.rules)return __abCard();const B=pgBLayout(),t=PGU.T,pop=Math.min(1,(WILD.cardT||0)/.25);
 ctx.save();ctx.globalAlpha=pop;ctx.fillStyle='rgba(12,6,24,.4)';ctx.fillRect(0,B.ch,W,H-B.ch); // the board keeps moving behind
 uiRound(B.panel.x,B.panel.y,B.panel.w,B.panel.h,20,'rgba(29,15,51,.5)','rgba(255,214,120,.55)',1.5);uiRound(B.panel.x,B.panel.y,B.panel.w,172,20,'rgba(29,15,51,.95)'); // the goal reads clearly; the board shows below itctx.textAlign='center';ctx.textBaseline='middle';
 PGU.bL=pgCentre(B.panel.y+30,t);PGU.bL.play=pgPlayButton(B.play,t,B.playH);pgDrawSide(B.side,t);ctx.restore();};
const __abBoardPointer=pgBoardPointer;
pgBoardPointer=function(p){
 if(pgABOn()&&PG_AB==='B'&&!PGU.rules&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door&&pgRestPhase()&&WILD.phase==='card'){
  if(p.y<=pgDock().bottom)return __abBoardPointer(p);const B=pgBLayout(),L=PGU.bL;
  if(pgSideTap(B.side,p))return true;
  if(L&&contains(L.play,p)){pgStartRound();return true;}
  if(L&&contains(L.help,p)){pgSfx('tap');PGU.rules=true;return true;}
  return true;}
 return __abBoardPointer(p);};
const __abCountdown=wildStartCountdown;wildStartCountdown=function(){PGU.rules=false;return __abCountdown();};

// ---- A: the main screen ----
const PGA={coins:[],seeded:0,pile:null,react:-9,hearts:[]};
function pgMainRects(){const top=pgDock().bottom,bot=H-Math.max(24,hudLayout().bottom+16),k=Math.max(.72,Math.min(1,(bot-top)/700)); // shorter phones: the cat and gaps shrink so nothing overlaps (rule 11)
 const name=top+268*k,play=Math.max(name+178,bot-165);return {top,bot,head:{x:200,y:top+118*k,w:240*k},name,play,side:pgSideRects(top+48,Math.min(100,(name+150-top-48)/2.4))};}
function pgMainPile(){if(PGA.pile)return PGA.pile;const a=[];let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let row=0;row<4;row++){const n=9-row*2;for(let i=0;i<n;i++)a.push({x:200+(i-(n-1)/2)*44+(r()-.5)*14,y:-row*20+(r()-.5)*6,r:22+r()*6,f:.55+r()*.45,ph:r()*6});}return PGA.pile=a;}
function pgDrawMain(dt){const R=pgMainRects(),t=PGU.T,cat=PGU.boardCat||'tuxedo';
 if(ART.background){const cover=Math.max(W/ART.background.width,H/ART.background.height),bw=ART.background.width*cover,bh=ART.background.height*cover;ctx.drawImage(ART.background,(W-bw)/2,(H-bh)/2,bw,bh);}else{ctx.fillStyle='#1d1030';ctx.fillRect(0,0,W,H);}
 let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(30,10,50,.5)');gr.addColorStop(1,'rgba(20,6,34,.88)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(200,R.head.y);ctx.rotate(t*.2);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=i%2?'rgba(255,210,63,.1)':'rgba(255,122,213,.06)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-40,-H);ctx.lineTo(40,-H);ctx.fill();}ctx.restore();
 // the coin rain (the board's own coin, as on the title) and a pile of coins under PLAY
 if(!PGA.seeded){PGA.seeded=1;for(let i=0;i<6;i++)PGA.coins.push(pgTitleCoin(rand(0,H*.7)));}
 if(PGA.coins.length<12&&Math.random()<dt*2.2)PGA.coins.push(pgTitleCoin(-40));const csp=sprite('coin');
 for(let i=PGA.coins.length-1;i>=0;i--){const c=PGA.coins[i];c.y+=c.vy*dt*.8;c.vy=Math.min(c.vy+45*dt,170);c.x+=Math.sin(t*c.wf+c.s)*c.wa*dt;if(c.y>H+50){PGA.coins.splice(i,1);continue;}
  const fl=Math.cos(c.s+t*c.vs),hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,c.y);ctx.globalAlpha=.3;ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.ellipse(0,0,c.r*1.2*Math.max(.3,Math.abs(fl)),c.r*1.2,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.scale(Math.max(.18,Math.abs(fl)),1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();}
 const py=R.play+150;for(const c of pgMainPile()){const hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,py+c.y);ctx.scale(1,c.f);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);if(((t*.7+c.ph)%5)<.12)uiCircle(-c.r*.3,-c.r*.3,c.r*.2,'#fffbe6');ctx.restore();}
 // the board's cat: floats, blinks, looks around; a tap gets the sweet face, hearts and a meow
 const el=t-PGA.react,live=el<1.4,by=Math.sin(t*1.6)*4-(live?Math.abs(Math.sin(el*9))*10*(1-el/1.4):0);
 pgHead(cat,R.head.x,R.head.y+by,R.head.w,live||(t%7)<1?'sweet':'calm',{look:Math.sin(t*.5)*.8,lookY:Math.sin(t*.37),blink:((t+.3)%4.7)<.13?1:0});
 for(let i=PGA.hearts.length-1;i>=0;i--){const h=PGA.hearts[i];h.t+=dt;if(h.t>1.3){PGA.hearts.splice(i,1);continue;}if(h.t<0)continue;ctx.save();ctx.globalAlpha=Math.max(0,1-h.t/1.3);pgHeart(h.x+Math.sin(h.t*5)*7,h.y-h.t*50,1,'#ff6ab8');ctx.restore();}
 ctx.textAlign='center';ctx.textBaseline='middle';PGA.L=pgCentre(R.name,t);PGA.L.play=pgPlayButton(R.play,t);pgDrawSide(R.side,t);
 pgDrawMainBar();
 if(PGU.pick)pgDrawBoardPick(dt);ctx.save();pgDrawModes();ctx.restore();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';}
// the slim top bar on the main screen (the board's own bar drawing, always fully shown)
function pgDrawMainBar(){const c=WILD.cardT,ph=WILD.phase;WILD.cardT=1;WILD.phase='card';try{pgDrawDock();}finally{WILD.cardT=c;WILD.phase=ph;}}
function pgMainTap(p){const R=pgMainRects(),L=PGA.L;
 if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return;}
 if(PGU.pick||PGU.modes){pgBoardPointer(p);return;}
 if(PGU.door)return;
 const D=pgDock();if(p.y<=D.bottom){if(contains(D.gear,p))openCredits();else if(contains(D.coll,p)){pgSfx('tap');openLoopScreen('water');}else if(contains(D.inv,p)){pgSfx('tap');openLoopScreen('inventory');}else if(D.modes&&contains(D.modes,p)){pgSfx('tap');PGU.modes=true;PGU.modesT=0;}return;}
 if(pgSideTap(R.side,p))return;
 if(L&&contains(L.play,p)){PGU.screen='board';PGU.fade=.25;pgStartRound();return;}
 if(L&&contains(L.help,p)){pgSfx('tap');PGU.rules=true;PGU.screen='board';PGU.fade=.2;return;}
 if(Math.hypot(p.x-R.head.x,(p.y-R.head.y)*1.2)<R.head.w*.45){PGA.react=PGU.T;pgSfx('meow');pgSfx('purr',.7);for(let i=0;i<5;i++)PGA.hearts.push({x:R.head.x+rand(-60,60),y:R.head.y-40,t:-i*.08});}}
const __abDown=pgPointerDown;pgPointerDown=function(e,p){if(PGU.screen==='main'){pgMainTap(p);return;}return __abDown(e,p);};
// A: between rounds (a goal card is up and no rules asked for), the main screen shows instead of the board; B: never.
const __abUpdate=update;
update=function(dt){__abUpdate(dt);if(!PG||!pgABOn())return;
 if(PG_AB==='A'&&PGU.screen==='board'&&WILD.on&&WILD.phase==='card'&&!PGU.rules&&!PGU.door&&!inventoryOpen){PGU.screen='main';PGU.fade=Math.max(PGU.fade,.2);}
 if(PGU.screen==='main'&&(PG_AB==='B'||!WILD.on||WILD.phase!=='card'))PGU.screen='board';}; // B, or a round started some other way (Developer)
// leaving a side screen between rounds comes back to the main screen in A
const __abGo=pgGo;pgGo=function(screen){__abGo(screen);if(screen==='board'&&pgABOn()&&PG_AB==='A'&&WILD.on&&WILD.phase==='card')PGU.screen='main';};

// ---- Developer: the layout switch and the difficulty tags ----
const __abDevHtml=pgDevHtml;
pgDevHtml=function(){const h=__abDevHtml(),b='min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;padding:0 10px';
 const rows='<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Home layout</span><button id="pg-ab" style="'+b+'">'+(PG_AB==='A'?'A main screen':'B board view')+'</button></div>'
  +PG_CATS.map(c=>'<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Difficulty: '+PG_CAT[c].name+'</span><button data-pgdiff="'+c+'" style="'+b+'">'+pgDiff(c)+'</button></div>').join('');
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __abDevBind=wildDevBind;
wildDevBind=function(panel){__abDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const ab=box.querySelector('#pg-ab');if(ab)ab.onclick=()=>{PG_AB=PG_AB==='A'?'B':'A';pgABSave();try{diagEvent('progress-tuning','layout='+PG_AB);}catch(e){}re();};
 for(const btn of box.querySelectorAll('[data-pgdiff]'))btn.onclick=()=>{const c=btn.dataset.pgdiff;PG_DIFF[c]=PG_DIFFS[(PG_DIFFS.indexOf(pgDiff(c))+1)%PG_DIFFS.length];pgABSave();try{diagEvent('progress-tuning','difficulty '+c+'='+PG_DIFF[c]);}catch(e){}re();};};

// ---- UAT 56 (Jenny, Nov 14, via the PM) ----
// 2. During a round the EXIT button is "Board" with a back arrow: it goes back to this board's between-rounds view. Made
//    a little shorter and kept at least 20 px above the meter's row, so it never touches the Dance meter's label on any
//    phone size (rule 11, nothing overlaps).
const __abWildButton=wildButton;
wildButton=function(){if(!(PG&&!PG_HOME_OFF&&WILD.on))return __abWildButton();const h=hudLayout(),bottom=Math.min(h.mainY+15,h.bannerY-20),hh=Math.max(20,Math.min(28,bottom-h.top-1));return {x:257,y:bottom-hh,w:56,h:hh};};
const __abWildBtnDraw=drawWildButton;
drawWildButton=function(){if(!(PG&&!PG_HOME_OFF&&WILD.on))return __abWildBtnDraw();if(inventoryOpen)return;const b=wildButton();
 ctx.save();uiRound(b.x,b.y,b.w,b.h,b.h/2,'#3a2350','rgba(232,220,255,.75)',1.5);pgChevron(b.x+12,b.y+b.h/2,-1,'#f4ecff',4.5);ctx.fillStyle='#f4ecff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 12px system-ui';ctx.fillText('Board',b.x+b.w/2+6,b.y+b.h/2+1,b.w-20);ctx.restore();};
// The round's Settings gear follows the same rule (its circle stays above the meter's label).
pgPlayGear=function(){const h=hudLayout(),bottom=Math.min(h.mainY+17,h.bannerY-20),hh=Math.max(22,Math.min(34,bottom-h.top-1));return {x:W-h.right-80,y:bottom-hh,w:36,h:hh};};
pgDrawPlayGear=function(){const g=pgPlayGear(),r=Math.min(15,g.h/2);uiCircle(g.x+g.w/2,g.y+g.h/2,r,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);pgGearIcon(g.x+g.w/2,g.y+g.h/2,Math.min(8,r-5));};
// 3. The Dance meter (was "Happy Cat"): a music note, a pulse each time it fills a notch, and the first time ever it fills,
//    a hint under it: "Prizes fill it. Full = Dance break!".
const PG_DHINT_KEY='catpusher.uat.dancehint.v1';
const __abHud=drawWildHud;
drawWildHud=function(hud){__abHud(hud);if(!wildFeature('dance')||!PG||PG_HOME_OFF)return;const x0=W-Math.max(8,hud.right+10)-124,y=hud.bannerY;
 if(WILD.happyT<.45&&WILD.happy>0&&!WILD.dance){const u=WILD.happyT/.45;ctx.save();ctx.globalAlpha=(1-u)*.9;ctx.strokeStyle='#ffd0f4';ctx.lineWidth=2+3*(1-u);uiRound(x0+20-6*u,y-10-6*u,104+12*u,20+12*u,9+3*u,null,ctx.strokeStyle,ctx.lineWidth);ctx.restore();}
 const D=PGU.dHint;if(D&&WILD.phase==='play'){const a=Math.min(1,D.t/.25,(4-D.t)/.4);if(a>0){ctx.save();ctx.globalAlpha=a;const bw=236,bx=W-8-bw,by=y+16;
  uiRound(bx,by,bw,30,12,'rgba(40,12,52,.95)','#ff9ad8',1.5);ctx.fillStyle='rgba(40,12,52,.95)';ctx.beginPath();ctx.moveTo(x0+60,by-7);ctx.lineTo(x0+52,by+1);ctx.lineTo(x0+68,by+1);ctx.closePath();ctx.fill();
  ctx.fillStyle='#ffe0f4';ctx.font='bold 13px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Prizes fill it. Full = Dance break!',bx+bw/2,by+15,bw-14);ctx.restore();}}};
const __abDanceFill=danceFill;
danceFill=function(n,x){const h0=WILD.happy;const r=__abDanceFill(n,x);
 if(PG&&!PG_HOME_OFF&&h0===0&&WILD.happy>0){let seen=false;try{seen=!!localStorage.getItem(PG_DHINT_KEY);}catch(e){}if(!seen){PGU.dHint={t:0};try{localStorage.setItem(PG_DHINT_KEY,'1');}catch(e){}}}return r;};
const __abUpd56=update;update=function(dt){__abUpd56(dt);if(PGU&&PGU.dHint){PGU.dHint.t+=dt;if(PGU.dHint.t>4)PGU.dHint=null;}};
// 4. "Level" is the board number in sequence (GAMEPLAY_MAP section 14): rounds won so far + 1, counted from UAT 56 on.
//    (The XP badge in the top bar stays until the progression ticket replaces it.)
function pgBoardLevel(){return (PG&&PG.passed|0)+1;}
const __abRoundEnd=pgRoundEnd;pgRoundEnd=function(win){const done=WILD.pgDone;__abRoundEnd(win);if(!done&&win&&PG&&!PG_HOME_OFF){PG.passed=(PG.passed|0)+1;pgSave();}};
// 5. Developer: the title coin rain (1-4), replay the title, show the Dance meter hint again
const __abDevHtml56=pgDevHtml;
pgDevHtml=function(){const h=__abDevHtml56(),b='min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;padding:0 10px',
  names=['','1 faster','2 faster, coin edge','3 fountain','4 pile-up'];
 const rows='<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Title coins</span><button id="pg-tc" style="'+b+'">'+names[PG_TC]+'</button></div>'
  +'<button id="pg-title" class="wide">Show the title screen again</button><button id="pg-dhint" class="wide">Show the Dance meter hint again</button>';
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __abDevBind56=wildDevBind;
wildDevBind=function(panel){__abDevBind56(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const tc=box.querySelector('#pg-tc');if(tc)tc.onclick=()=>{PG_TC=PG_TC%4+1;try{localStorage.setItem(PG_TC_KEY,String(PG_TC));}catch(e){}try{diagEvent('progress-tuning','titlecoins='+PG_TC);}catch(e){}re();};
 const tl=box.querySelector('#pg-title');if(tl)tl.onclick=()=>{panel.style.display='none';PGU.title={t:0,coins:[],snd:0};PGU.screen='title';};
 const dh=box.querySelector('#pg-dhint');if(dh)dh.onclick=()=>{try{localStorage.removeItem(PG_DHINT_KEY);}catch(e){}pgToast('The hint shows the next time the meter fills','#ffd0f4');re();};};
