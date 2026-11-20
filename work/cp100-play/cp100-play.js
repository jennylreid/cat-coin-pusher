// ---------- CP-100 Home: PLAY goes to the endless board (Jenny, Nov 19: "I would like the play button to take us to the endless
// board... let's combine Board Lab and Levels into just all the boards we've tested or created, and those will [be] what the
// endless play will use"; her answers via PM: All boards starts the endless board on that layout, no timed levels; recipes unlock
// as the rotation reaches new boards; "We don't need a coin jar anymore"; Catnip from selling prizes; all lab boards incl. Giant
// towers rotate; PLAY opens the endless board with a gentle Level 1-style first board for new players.) UAT only. ----------
// - PLAY opens the endless board (the cat you're on). Home's card shows the endless board: the board you're on, your coins and
//   the refill, instead of Level n and its goal.
// - Home (Jenny, Nov 19): PLAY; under it "Level boards" and "Goal boards", each opening its own list (never a board); Daily
//   puzzles becomes a round button under Cats on the right ("a circular button under cats to the right"); Board lab's and the
//   centre Daily puzzles buttons go. All UAT only. ("we don't want to mix levels and lab boards if they operate differently")
//   Level boards: the open layouts that play on the wallet with no goal (the 10 level boards). Tap one: the endless board
//   starts on it. Only these are the NEW BOARD rotation.
//   Goal boards: every Board lab board (each has its own goal, and a drop budget or a timer). Tap one: it plays as it does in
//   Board lab today (its goal, its own coins and budget or timer, never the wallet), and the list comes back with the result.
//   Not in the rotation; candidates for daily challenges. A board added to Board lab's list appears here.
//   Developer switches (Tower fall, Timing strip) stay at the bottom of Goal boards with Developer on.
// - Recipes unlock as the rotation reaches new boards: reaching the 2nd board unlocks what passing Level 2 did, and so on to
//   the 6th (Tuna dish, Cheese plate, Shrimp skewers, Fish pie, Formal supper); the Kitchen appears with the first.
// - No coin jar: the coins are only the coin push's (the endless wallet). The Shop sells prizes for Catnip (1, a cat's own
//   prize 2) and sells ingredients for Catnip (4, a cat's own 8): the old coin prices divided by about 8 (sell 8/15, buy
//   30/60). Prizes over the pantry cap and a recipe coin with no recipe left give Catnip (+3) instead of jar coins. The top
//   bars show your coins (the wallet) and Catnip. The jar's coins stay in the save, unused and unshown.
// - A new player's first endless board is First push with Level 1's quiet rules (no bonus prizes, no cat sky drops) until
//   the first NEW BOARD. Players who already have an endless wallet keep theirs.
// Production and saves untouched (nothing deleted or renamed; levels progress kept in its save).
const CP100={list:null,body:null,mode:'levels',side:null};
function cp100Coins(){try{endRefill();const w=endLoad();return END.on&&WILD.on?S.coins:w.coins;}catch(e){return 0;}}
// one board list, for All boards and the rotation
function cp100Labs(){try{return (typeof LABH_ROUNDS!=='undefined'?LABH_ROUNDS.flatMap(r=>r[1]):[]).filter((k,i,a)=>LAB.B[k]&&a.indexOf(k)===i).map(k=>'lab:'+k);}catch(e){return END_LABS;}}
endOrder=function(){return END_LEVELS.slice();}; // the rotation: the open boards only (the level layouts); goal boards are played from the list
// a new player: the gentle first board
{const fresh=(()=>{try{return !localStorage.getItem(END.KEY);}catch(e){return false;}})();if(fresh){const w=endLoad();w.gentle=true;endSave();}}
{const __cp100Lv1=cp50Lv1;cp50Lv1=function(){if(END.on)return !!(END.w&&END.w.gentle&&endKey()==='L1');return __cp100Lv1();};}
// reaching new boards unlocks the recipes (as passing levels did)
function cp100Unlock(){try{const n=endLoad().seen.length;for(let i=1;i<=n;i++)pglUnlocks(i);pglCheckScreens();}catch(e){}}
{const __cp100Set=endSetBoard;endSetBoard=function(k){const w=endLoad();if(k!=='L1')w.gentle=false;const r=__cp100Set.apply(this,arguments);cp100Unlock();return r;};}
{const __cp100Start=endStart;endStart=function(){const r=__cp100Start.apply(this,arguments);cp100Unlock();return r;};}
// PLAY opens the endless board
{const __cp100Tap=pgMainTap;pgMainTap=function(p){try{const L=PGA.L;if(L&&L.play&&contains(L.play,p)&&endHomeFree()){pgSfx('tap');endStart();return;}}catch(e){}return __cp100Tap(p);};}
// Board lab's own button goes (its boards are in All boards)
labhBtn=function(){return null;};
// Home's card: the endless board instead of the level
{const __cp100Centre=pgCentre;pgCentre=function(y,t,o={}){if(PGU.screen!=='main'||!PG)return __cp100Centre.apply(this,arguments);const L={};
 wildText(o.name||PG_CAT[PGU.boardCat||PG.current||'tuxedo'].name.toUpperCase(),200,y,o.nameSize||30,'#ffd23f','#2a0b3e',6);
 const w=endLoad(),k=w.cur||endPickNext(),nm=k.startsWith('lab:')?(LAB.B[k.slice(4)]||{}).name:(PGL_LEVELS[+k.slice(1)-1]||{}).name;
 wildText('ENDLESS BOARD',200,y+38,22,'#fff','#2a0b3e',5);
 ctx.font='bold 15px system-ui';ctx.fillStyle='#ffe8b0';ctx.textAlign='center';ctx.fillText((w.cur?'On ':'First board: ')+(nm||'')+(w.cur?' · New board '+Math.round(Math.min(1,w.meter/END.METER)*100)+'%':''),200,y+72,330);
 const c=cp100Coins(),ms=endNextIn();ctx.font='bold 17px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins'+(ms==null?' · full':' · +1 in '+endClockText(ms)),200,y+104,330);
 L.help={x:200-58,y:y+CP50_HOME.help,w:116,h:26};uiRound(L.help.x,L.help.y,L.help.w,L.help.h,13,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);ctx.font='bold 12px system-ui';ctx.fillStyle='#e8dcff';ctx.fillText('? How to play',200,L.help.y+L.help.h/2+1);
 return L;};}
// a goal board's round ends: the list comes back (Board lab's own list never shows); Home from the list turns the lab off
labhOpen=function(){cp100Open('goals');};
// the Shop in Catnip
pgSell=function(id){return pgOwner(id)?2:1;};
pgBuy=function(id){return pgOwner(id)?8:4;};
// --- All boards: the list ---
function cp100Name(k){return k.startsWith('lab:')?(LAB.B[k.slice(4)]||{}).name:(PGL_LEVELS[+k.slice(1)-1]||{}).name;}
function cp100GoalSub(k){const L=LAB.B[k];if(!L)return '';return (L.lab&&L.lab.text||'Goal')+' · '+(L.budget?L.budget+' drops':Math.round((L.secs||0)/60*10)/10+' min, '+(L.coins|0)+' coins');}
function cp100Build(){if(CP100.list)return CP100.list;const el=document.createElement('div');el.id='cp100boards';
 el.style.cssText='position:fixed;inset:0;z-index:60;display:none;flex-direction:column;background:rgba(18,10,34,.97);color:#f4ecff;font:15px system-ui,sans-serif;overflow:hidden';
 const st=document.createElement('style');st.textContent='#cp100boards .bar{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #4a3a6a}'+
  '#cp100boards .bar b{font-size:18px}#cp100boards .body{overflow-y:auto;padding:8px 14px 24px;flex:1}#cp100boards h3{margin:14px 0 6px;font-size:13px;color:#bfaee0;letter-spacing:.05em;text-transform:uppercase}'+
  '#cp100boards button{font:700 15px system-ui,sans-serif;color:#f4ecff;background:#3a2d52;border:1px solid #6b5a8a;border-radius:12px;min-height:40px;padding:0 12px;touch-action:manipulation}'+
  '#cp100boards .bd{display:flex;flex-direction:column;align-items:flex-start;width:100%;margin:5px 0;padding:8px 12px;text-align:left}#cp100boards .bd small{font-weight:400;color:#cfc2ea;font-size:13px;margin-top:2px}'+
  '#cp100boards .bd.cur{background:#2fb5a8;color:#08201d;border-color:#bff5ee}#cp100boards .bd.cur small{color:#08201d}#cp100boards .goal{background:#4a2a3e;border-color:#a8708a}#cp100boards .res{margin:6px 0 2px;color:#ffe08a;font-weight:700}#cp100boards p{margin:2px 0 6px;color:#cfc2ea;font-size:13px}'+
  '#cp100boards .sw{display:flex;align-items:center;gap:6px;margin:6px 0;flex-wrap:wrap}#cp100boards .sw span{min-width:96px;color:#cfc2ea}#cp100boards .sw button.on{background:#2fb5a8;color:#08201d;border-color:#bff5ee}';
 el.appendChild(st);const bar=document.createElement('div');bar.className='bar';bar.innerHTML='<span style="width:76px"></span><b id="cp100title">Level boards</b><button data-a="home">Home</button>';el.appendChild(bar);CP100.title=bar.querySelector('#cp100title');
 const body=document.createElement('div');body.className='body';el.appendChild(body);CP100.body=body;
 el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;try{pgSfx('tap');}catch(_){}
  if(b.dataset.a==='home'){el.style.display='none';if(typeof LABH!=='undefined'&&(LABH.active||LAB.st.sel))labhHome();return;}
  if(b.dataset.k){el.style.display='none';return cp100Play(b.dataset.k);}if(b.dataset.g){el.style.display='none';return cp100Goal(b.dataset.g);}
  if(b.dataset.tf&&typeof LABT!=='undefined'){LABT.set(b.dataset.tf);cp100Paint();}if(b.dataset.ts&&typeof LAB2T!=='undefined'){LAB2T.set(b.dataset.ts);cp100Paint();}});
 document.body.appendChild(el);CP100.list=el;return el;}
function cp100Paint(){const B=CP100.body;if(!B)return;const w=endLoad(),esc=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));let h='';
 const row=(k,sub)=>'<button class="bd'+(w.cur===k?' cur':'')+'" data-k="'+k+'"><span>'+esc(cp100Name(k))+(w.seen.includes(k)?' ✓':'')+'</span><small>'+esc(sub)+'</small></button>';
 if(typeof LABH!=='undefined'&&LABH.result)h+='<div class="res">'+esc(LABH.result)+'</div>';
 const goals=CP100.mode==='goals';try{if(CP100.title)CP100.title.textContent=goals?'Goal boards':'Level boards';}catch(e){}
 if(!goals){h+='<p>Open boards: they play on your coins, with no goal. NEW BOARD picks from these.</p>';END_LEVELS.forEach((k,i)=>h+=row(k,'Board '+(i+1)+' · '+(PGL_LEVELS[i].tag||'')));}
 else{h+='<p>Each has its own goal and drops (or a timer). Your coins stay as they are.</p>';cp100Labs().forEach(k=>{const g=k.slice(4),won=typeof LABH!=='undefined'&&LABH.won[g],pl=typeof LABH!=='undefined'&&LABH.played[g];
  h+='<button class="bd goal" data-g="'+g+'"><span>'+esc(cp100Name(k))+(won?' ✓★':pl?' ✓':'')+'</span><small>'+esc(cp100GoalSub(g))+'</small></button>';});}
 if(goals&&S.dev&&typeof LABT!=='undefined'){h+='<h3>Developer</h3><div class="sw"><span>Tower fall</span>'+['today','topple'].map(k=>'<button data-tf="'+k+'" class="'+(LABT.get()===k?'on':'')+'">'+LABT.NAMES[k]+'</button>').join('')+'</div>';
  if(typeof LAB2T!=='undefined')h+='<div class="sw"><span>Timing strip</span>'+['off','on'].map(k=>'<button data-ts="'+k+'" class="'+(LAB2T.mode===k?'on':'')+'">'+(k==='on'?'On':'Off')+'</button>').join('')+'</div>';}
 B.innerHTML=h;}
function cp100Open(mode){if(mode)CP100.mode=mode;const el=cp100Build();cp100Paint();el.style.display='flex';try{diagEvent('cp100','list '+CP100.mode);}catch(e){}}
// --- Home: the Goal boards button (under Level boards) and the Daily puzzles round button (under Cats, right) ---
cp87Btn=function(){return null;}; // the centre Daily puzzles button goes; Level boards takes its place
function cp100GoalBtn(){const b=endBtn();if(!b)return null;const R=pgMainRects(),h=b.h,y=Math.min(b.y+b.h+10,R.bot-h-2);return {x:b.x,y,w:b.w,h};}
{const __cp100Side=pgSideRects;pgSideRects=function(y0,gap){const r=__cp100Side.apply(this,arguments);try{const n=r.filter(b=>b.x>200).length;CP100.side={x:W-36,y:y0+n*gap,r:25};}catch(e){}return r;};}
function cp100DailyBtn(){const d=CP100.side;if(!d||PGU.screen!=='main')return null;return d;}
function cp100DrawDaily(){const b=cp100DailyBtn();if(!b)return;ctx.save();ctx.translate(b.x,b.y);uiCircle(0,3,b.r,'rgba(0,0,0,.35)');
 const g=ctx.createLinearGradient(0,-b.r,0,b.r);g.addColorStop(0,'#5ee6d4');g.addColorStop(1,'#1f8f84');uiCircle(0,0,b.r,g,'#fff6d0',2);
 // a little calendar page with a star: the day's puzzle
 uiRound(-11,-10,22,20,4,'#fff8ec','#2a5a55',1.5);ctx.fillStyle='#e0533a';ctx.fillRect(-11,-10,22,6);ctx.fillStyle='#2a5a55';ctx.fillRect(-6,-13,2.5,5);ctx.fillRect(3.5,-13,2.5,5);
 ctx.fillStyle='#ffc21f';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?2.6:6;ctx.lineTo(Math.cos(a)*rr,3+Math.sin(a)*rr);}ctx.closePath();ctx.fill();
 ctx.textAlign='center';ctx.textBaseline='middle';const lab='DAILY';ctx.font='900 10px Impact, system-ui';const lw=ctx.measureText(lab).width+10;uiRound(-lw/2,b.r-4,lw,15,7,'rgba(16,8,28,.9)','#5ee6d4',1);ctx.fillStyle='#fff';ctx.fillText(lab,0,b.r+4);
 ctx.restore();}
{const __cp100DM=pgDrawMain;pgDrawMain=function(dt){const r=__cp100DM(dt);try{if(endHomeFree()){const b=cp100GoalBtn();if(b){uiRound(b.x,b.y,b.w,b.h,b.h/2,'rgba(47,181,168,.92)','rgba(220,255,250,.85)',1.5);
   ctx.save();ctx.font='bold '+(b.h<34?14:15)+'px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#ffffff';ctx.fillText('Goal boards',200,b.y+b.h/2+1);ctx.restore();}
  if(typeof cp87OpenMenu==='function')cp100DrawDaily();}}catch(e){}return r;};}
{const __cp100MT=pgMainTap;pgMainTap=function(p){try{if(endHomeFree()){const b=cp100GoalBtn();if(b&&contains({x:b.x-4,y:b.y-2,w:b.w+8,h:b.h+6},p)){pgSfx('tap');cp100Open('goals');return;}
   const d=cp100DailyBtn();if(d&&typeof cp87OpenMenu==='function'&&Math.hypot(p.x-d.x,p.y-d.y)<d.r+8){pgSfx('tap');cp87OpenMenu();return;}}}catch(e){}return __cp100MT(p);};}
// a goal board: Board lab's own path (its goal, coins, budget or timer); the wallet isn't touched
function cp100Goal(g){if(!LAB.B[g])return;try{if(END.on)endStop();}catch(e){}try{diagEvent('cp100','goal '+g);}catch(e){}labhPlay(g);}
function cp100Play(k){if(!endOrder().includes(k))return;const w=endLoad();w.cur=k;w.meter=0;END.emptyT=0;if(k!=='L1')w.gentle=false;endSave();try{diagEvent('cp100','play '+k);}catch(e){}endStart();}
// ---------- end CP-100 ----------
