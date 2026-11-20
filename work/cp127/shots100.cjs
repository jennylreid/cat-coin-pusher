// CP-100 UAT 127: real headless Chrome on the staged runtime folder, a fresh player. Home (PLAY, Level boards, Goal boards, the round Daily button),
// the All boards list (every board, Giant towers included), PLAY -> the gentle first board, a NEW BOARD -> Line up and the
// Kitchen, and the Shop in Catnip. Stills at 412x915 and 360x640. Usage: node shots100.cjs boot127 [outDir]
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const DIR=path.resolve(process.argv[2]||'boot127'),OUT=path.resolve(process.argv[3]||path.join(__dirname,'../../tickets/CP-100-evidence/uat127'));
fs.mkdirSync(OUT,{recursive:true});const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.flac':'audio/flac'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';const f=path.join(DIR,u);
 if(f.startsWith(DIR)&&fs.existsSync(f)&&fs.statSync(f).isFile()){s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}else{s.writeHead(404);s.end();}});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9400+Math.floor(Math.random()*400);
 const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp100-'));
 const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+dbg,'about:blank'],{stdio:'ignore'});
 const res={dir:DIR,sizes:{},errors:[]};let ok=true;
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json();break;}catch(e){await sleep(250);}}
  for(const [w,h] of [[412,915],[360,640]]){
   const t=await (await fetch(`http://127.0.0.1:${dbg}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
   let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];return;}
    if(d.method==='Runtime.exceptionThrown')res.errors.push(w+': '+(d.params.exceptionDetails.exception?.description||d.params.exceptionDetails.text).slice(0,200));};
   const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
   const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e,returnByValue:true});return r.result?.result?.value;};
   const shot=async n=>{const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(OUT,`${n}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));};
   await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:2,mobile:true});
   await call('Page.navigate',{url:`http://127.0.0.1:${port}/index.html?r=${Date.now()}`});
   for(let i=0;i<80;i++){await sleep(250);if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0"))break;}
   await ev("localStorage.clear();");await call('Page.navigate',{url:`http://127.0.0.1:${port}/index.html?r=${Date.now()}`});
   for(let i=0;i<80;i++){await sleep(250);if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0"))break;}
   await ev("if(!PG)pgInit();PGU.title.t=9;pgTitleDone();S.muted=true;PGU.screen='main';");await sleep(1500);await shot('1-home');
   const home=await ev("({btn:endBtn(),lab:labhBtn(),coins:cp100Coins(),gentle:!!endLoad().gentle,build:BUILD})");
   // real taps (mouse events at the button's place on screen, as a finger would): Level boards, then Goal boards, then Daily
   const tapAt=async(px,py)=>{await call('Input.dispatchMouseEvent',{type:'mousePressed',x:px,y:py,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:px,y:py,button:'left',clickCount:1});};
   const at=async e=>await ev("(()=>{const b="+e+",k=scale;return b?{x:(b.x+(b.w?b.w/2:0))*k,y:(b.y+(b.h?b.h/2:0))*k}:null;})()");
   const lv=await at('endBtn()');await tapAt(lv.x,lv.y);await sleep(700);
   const tapRes=await ev("({list:!!CP100.list&&CP100.list.style.display==='flex',mode:CP100.mode,board:END.on||PGU.screen==='board',rows:document.querySelectorAll('#cp100boards button[data-k]').length,goals:document.querySelectorAll('#cp100boards button[data-g]').length,title:(document.getElementById('cp100title')||{}).textContent})");
   await shot('2-level-boards');await ev("document.getElementById('cp100boards').querySelector('button[data-a=home]').click()");await sleep(400);
   const gb=await at('cp100GoalBtn()');await tapAt(gb.x,gb.y);await sleep(700);
   const goalRes=await ev("({list:!!CP100.list&&CP100.list.style.display==='flex',mode:CP100.mode,board:END.on||PGU.screen==='board',rows:document.querySelectorAll('#cp100boards button[data-k]').length,goals:document.querySelectorAll('#cp100boards button[data-g]').length,title:(document.getElementById('cp100title')||{}).textContent,cup:!!document.querySelector('#cp100boards button[data-g=cup]')})");
   await shot('2b-goal-boards');await ev("document.getElementById('cp100boards').querySelector('button[data-a=home]').click()");await sleep(400);
   // Home with every round button (a player who has opened the screens): Daily under Cats on the right
   await ev("for(const c of PG_CATS)PG.open[c]=1;PG.shown={kitchen:1,shop:1,porch:1,album:1,board:1};PG.seenScr={kitchen:1,shop:1,porch:1,album:1,board:1};");await sleep(800);await shot('1b-home-all-buttons');
   const db=await ev("(()=>{const d=cp100DailyBtn(),k=scale;const side=pgMainRects().side.filter(b=>b.x>200).map(b=>({id:b.id,y:b.y}));return d?{x:d.x*k,y:d.y*k,gy:d.y,side}:null;})()");
   await tapAt(db.x,db.y);await sleep(700);const daily=await ev("({open:typeof CP87!=='undefined'&&!!CP87.open,board:END.on})");await shot('1c-daily-from-round-button');
   await ev("try{cp87Close&&cp87Close()}catch(e){};try{const el=document.getElementById('cp87menu');if(el)el.style.display='none';CP87.open=false;}catch(e){};for(const c of PG_CATS)if(c!=='tuxedo')PG.open[c]=0;PG.shown={};");await sleep(300);
   res.home=res.home||{};res.home[w+'x'+h]={levels:tapRes,goals:goalRes,daily,db};
   if(!tapRes.list||tapRes.board||tapRes.rows!==10||tapRes.goals!==0||!goalRes.list||goalRes.board||goalRes.goals!==12||goalRes.rows!==0||!goalRes.cup||!daily.open||daily.board||!db.side.length||db.gy<=Math.max(...db.side.map(b=>b.y)))ok=false;
   await ev("cp100Open('levels')");await sleep(500);
   const list=await ev("(()=>{const el=document.getElementById('cp100boards');const t=el?el.innerText:'';return {shown:!!el&&el.style.display==='flex',rows:el?el.querySelectorAll('button[data-k]').length:0,goals:el?el.querySelectorAll('button[data-g]').length:0,giant:/Giant towers/.test(t),first:/First push/.test(t),order:endOrder().length}})()");list.tap=tapRes;list.goalTap=goalRes;
   await ev("document.getElementById('cp100boards').querySelector('button[data-a=home]').click()");await sleep(400);
   await ev("(()=>{const L=PGA.L,r=L.play;pgMainTap({x:r.x+r.w/2,y:r.y+r.h/2});})()");await sleep(4500);await shot('3-play-gentle-first-board');
   const play=await ev("({on:END.on,key:endKey(),lv1:cp50Lv1(),phase:WILD.phase})");
   await ev("PG.photos={};END.w.meter=END.METER;endStartSweep()");await sleep(5200);await shot('4-after-new-board');
   const nb=await ev("({key:endKey(),recipe:'tunadish' in PG.recipes,kitchen:!!(PG.shown&&PG.shown.kitchen)})");
   await ev("wildReset();PG.items.egg=2;PG.items.bowtie=1;PG.catnip=5;PGU.shop.tab='sell';pgGo('shop')");await sleep(900);await shot('5-shop-sell');
   await ev("PGU.shop.tab='buy'");await sleep(500);await shot('6-shop-buy');
   // a goal board from the list: Cup shot with its goal and 18 drops; the wallet untouched
   await ev("pgGo('main');globalThis.__w=endLoad().coins;cp100Open('goals')");await sleep(600);await shot('7-all-boards-goal-section');
   await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);await shot('8-goal-board-cup');
   const goal=await ev("({lab:LAB.on(),sel:LAB.st.sel,budget:labBudget(),end:END.on,wallet:endLoad().coins===__w})");res.goal=res.goal||{};res.goal[w+'x'+h]=goal;
   if(!goal||!goal.lab||goal.sel!=='cup'||goal.budget!==18||goal.end||!goal.wallet)ok=false;
   await ev("labhHome()");await sleep(300);
   res.sizes[w+'x'+h]={home,list,play,nb};
   if(!home||home.lab!==null||home.coins!==100||!home.gentle||!list.shown||list.rows!==10||list.order!==10||!play.on||play.key!=='L1'||!play.lv1||nb.key!=='L2'||!nb.recipe||!nb.kitchen)ok=false;
   ws.close();}
 }catch(e){res.errors.push('shots100: '+e.message);ok=false;}finally{ch.kill();srv.close();}
 if(res.errors.length)ok=false;res.passed=ok;fs.writeFileSync(path.join(OUT,'shots100.json'),JSON.stringify(res,null,1));console.log(JSON.stringify(res));process.exit(ok?0:1);})();
