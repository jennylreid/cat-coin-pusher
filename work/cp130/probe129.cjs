// CP-100 UAT 129 bug probe (Level/Goal boards not reachable) -- based on shots100.cjs.  real headless Chrome on the staged runtime folder, a fresh player. Home (PLAY, Level boards, Goal boards, the round Daily button),
// the All boards list (every board, Giant towers included), PLAY -> the gentle first board, a NEW BOARD -> Line up and the
// Kitchen, and the Shop in Catnip. Stills at 412x915 and 360x640. Usage: node shots100.cjs boot127 [outDir]
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const DIR=path.resolve(process.argv[2]||'boot127'),OUT=path.resolve(process.argv[3]||path.join(__dirname,'probe-out'));
fs.mkdirSync(OUT,{recursive:true});const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.flac':'audio/flac'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';const f=(u==='index.html'&&process.env.INDEX)?path.resolve(process.env.INDEX):path.join(DIR,u);
 if((f.startsWith(DIR)||f===path.resolve(process.env.INDEX||'-'))&&fs.existsSync(f)&&fs.statSync(f).isFile()){s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}else{s.writeHead(404);s.end();}});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9400+Math.floor(Math.random()*400);
 const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp100-'));
 const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+dbg,'about:blank'],{stdio:'ignore'});
 const res={dir:DIR,sizes:{},errors:[]};let ok=true;
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json();break;}catch(e){await sleep(250);}}
  for(const [w,h] of (process.env.SIZES?JSON.parse(process.env.SIZES):[[412,915],[360,640],[384,854]])){
   const t=await (await fetch(`http://127.0.0.1:${dbg}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
   let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];return;}
    if(d.method==='Runtime.exceptionThrown')res.errors.push(w+': '+(d.params.exceptionDetails.exception?.description||d.params.exceptionDetails.text).slice(0,200));};
   const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
   const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e,returnByValue:true});return r.result?.result?.value;};
   const shot=async n=>{const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(OUT,`${n}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));};
   await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:2,mobile:true});
   await call('Page.navigate',{url:`http://127.0.0.1:${port}/index.html?r=${Date.now()}`});
   for(let i=0;i<80;i++){await sleep(250);if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0"))break;}
   const reload=async()=>{await call('Page.navigate',{url:`http://127.0.0.1:${port}/index.html?r=${Date.now()}`});for(let i=0;i<80;i++){await sleep(250);if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0&&typeof PG!=='undefined'&&!!PG"))break;}await sleep(1500);};
   const tapAt=async(px,py)=>{await call('Input.dispatchMouseEvent',{type:'mousePressed',x:px,y:py,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:px,y:py,button:'left',clickCount:1});};
   const DIAG="(()=>{const q=f=>{try{return f()}catch(e){return 'ERR '+e.message}};const L=document.getElementById('cp100boards');return {screen:PGU.screen,phase:WILD.phase,wild:WILD.on,end:END.on,ab:PG_AB,abOn:q(()=>pgABOn()),homeOff:PG_HOME_OFF,oldBoards:PGU.oldBoards,win:!!PGU.win,pick:!!PGU.pick,modes:!!PGU.modes,door:!!PGU.door,rules:!!PGU.rules,labhEl:LABH.el?LABH.el.style.display:null,labhActive:LABH.active,free:q(()=>endHomeFree()),play:q(()=>PGA.L&&PGA.L.play),lv:q(()=>endBtn()),goal:q(()=>cp100GoalBtn()),daily:q(()=>cp100DailyBtn()),list:L?L.style.display:null,dev:S.dev,level:PG.level};})()";
   const pt=async e=>await ev("(()=>{const b="+e+",k=scale,c=document.getElementById('c').getBoundingClientRect();if(!b)return null;const x=(b.x+(b.w?b.w/2:0))*k+c.left,y=(b.y+(b.h?b.h/2:0))*k+c.top;const el=document.elementFromPoint(x,y);return {x,y,hit:el?(el.id||el.tagName)+(el.className?'.'+el.className:''):null};})()");
   const tryTaps=async name=>{const r={before:await ev(DIAG)};await shot(name+'-home');
    for(const [k,e,mode] of [['lv','endBtn()','levels'],['goal','cp100GoalBtn()','goals']]){const p=await pt(e);r[k+'Pt']=p;if(!p){r[k]='no button';continue;}
     await tapAt(p.x,p.y);await sleep(700);r[k]=await ev("({list:(document.getElementById('cp100boards')||{style:{}}).style.display,mode:CP100.mode,rows:document.querySelectorAll('#cp100boards button[data-k]').length,goals:document.querySelectorAll('#cp100boards button[data-g]').length,screen:PGU.screen,end:END.on,lab:LABH.active})");
     await shot(name+'-after-'+k);await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){}");await sleep(500);}
    res.sizes[w+'x'+h]=res.sizes[w+'x'+h]||{};res.sizes[w+'x'+h][name]=r;console.log(w+'x'+h,name,JSON.stringify(r));};
   const LONG="S.dev=true;try{localStorage.setItem(PG_DEVON_KEY,'1')}catch(e){};PG.level=Math.max(PG.level,40);for(const c of PG_CATS)PG.open[c]=1;PG.shown={kitchen:1,shop:1,porch:1,album:1,board:1};PG.seenScr={kitchen:1,shop:1,porch:1,album:1,board:1};try{for(let i=1;i<=10;i++)pglUnlocks(i);}catch(e){};LABH.played={cup:1,tower:1};LABH.won={cup:1};LABH.result='Cup shot: won';PG.catnip=(PG.catnip||0)+30;pgSave();const w=endLoad();w.coins=420;w.gentle=false;w.seen=['L1','L2','L3'];w.cur='L3';endSave();pgGo('main');";
   const title=async()=>{for(let i=0;i<4;i++){const sc=await ev('PGU.screen');if(sc!=='title')break;const q=await pt('({x:200,y:700})');await tapAt(q.x,q.y);await sleep(1500);}await sleep(1000);return await ev('PGU.screen');};
   const touchAt=async(px,py)=>{await call('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:px,y:py,id:1}]});await sleep(90);await call('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
   const tryTouch=async name=>{const r={before:await ev(DIAG)};await ev("globalThis.__clk=[];document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('button');__clk.push((e.target.id||e.target.tagName)+(b?' btn:'+(b.dataset.k||b.dataset.g||b.dataset.a||b.textContent.slice(0,20)):''));},true);");
    for(const [k,e] of [['lv','endBtn()'],['goal','cp100GoalBtn()'],['daily','cp100DailyBtn()']]){const p=await pt(e);if(!p){r[k]='no button';continue;}await ev("__clk.length=0");
     await touchAt(p.x,p.y);await sleep(900);r[k]=await ev("({list:(document.getElementById('cp100boards')||{style:{}}).style.display,mode:CP100.mode,screen:PGU.screen,end:END.on,endKey:END.on?endKey():null,lab:LABH.active,daily:typeof CP87!=='undefined'&&!!CP87.open,clicks:__clk.slice()})");
     if(r[k].list==='flex'||r[k].daily){const sel=k==='lv'?'#cp100boards button[data-k=L1]':k==='goal'?'#cp100boards button[data-g=cup]':'#cp87 button';
       const rp=await ev("(()=>{const b=document.querySelector('"+sel+"');if(!b)return null;b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,t:b.textContent.slice(0,30)};})()");
       await shot(name+'-touch-'+k+'-list');if(rp){await sleep(300);await touchAt(rp.x,rp.y);await sleep(1500);r[k].row=Object.assign({tapped:rp.t},await ev("({list:(document.getElementById('cp100boards')||{style:{}}).style.display,screen:PGU.screen,end:END.on,endKey:END.on?endKey():null,lab:LABH.active,frame:!!document.querySelector('#cp87 iframe')&&document.querySelector('#cp87 iframe').offsetParent!==null,ate:typeof CP100G!=='undefined'?CP100G.ate:null})"));}}
     await shot(name+'-touch-'+k);console.log(w+'x'+h,name,k,JSON.stringify(r[k]));
     // back to Home whatever happened
     await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){};try{if(typeof cp87Close==='function')cp87Close();const m=document.getElementById('cp87');if(m)m.style.display='none';if(typeof CP87!=='undefined')CP87.open=false;}catch(e){}");await sleep(300);
     if(await ev("PGU.screen")!=='main'){const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1500);}if(await ev("LABH.active")){await ev("try{labhHome()}catch(e){}");await sleep(800);}
      await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){}");await sleep(500);}
     r[k].backHome=await ev("PGU.screen");}
    res.sizes[w+'x'+h]=res.sizes[w+'x'+h]||{};res.sizes[w+'x'+h][name+'-touch']=r;};
   const SC=(process.env.SC||'fresh,long,endexit,labexit,layoutB,reload').split(',');
   await reload();await ev("localStorage.clear()");await reload();res.t1=await title();
   if(SC.includes('fresh'))await tryTaps('fresh');
   await ev(LONG);await sleep(800);await reload();res.t2=await title();if(SC.includes('long'))await tryTaps('long');
   if(SC.includes('endexit')){const pp=await pt('PGA.L.play');if(!pp){res.errors.push('endexit: no PLAY');}else{await tapAt(pp.x,pp.y);await sleep(4000);res.endPlay=await ev(DIAG);await shot('endexit-playing');
    const hb=await pt('wildButton()');await tapAt(hb.x,hb.y);await sleep(1500);await tryTaps('endexit');}}
   if(SC.includes('labexit')){await ev("cp100Open('goals')");await sleep(400);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(3000);res.labPlay=await ev(DIAG);
    const hb=await pt('wildButton()');await tapAt(hb.x,hb.y);await sleep(1500);res.labAfterHome=await ev(DIAG);await shot('labexit-after-home');await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){}");await sleep(800);await tryTaps('labexit');}
   if(SC.includes('layoutB')){await ev("PG_AB='B';pgABSave();pgGo('main')");await sleep(900);await tryTaps('layoutB');await ev("PG_AB='A';pgABSave();pgGo('main')");await sleep(600);}
   if(SC.includes('touch')){await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await tryTouch('touch');await call('Emulation.setTouchEmulationEnabled',{enabled:false});}
   if(SC.includes('rag')){await ev("PG.current=PGU.boardCat='ragdoll';PG.open.ragdoll=true;endLoad().coins=500;endStart();");await sleep(4000);
    for(let i=0;i<30;i++){await ev("tryDrop({x:"+(150+i*3)+",y:DROP_Y})");await sleep(250);}await sleep(1500);await shot('rag-endless');
    res.rag=await ev("({mode:WILD.mode,cat:PGU.boardCat,happy:WILD.happy,notches:DANCE.notches,lock:cp97Locked(),cats:cp97Cats(),why:(()=>{const r=[];for(const k of ['dance','dancePending','petGame','petPending','jp','jpPending','toss','chase','pounce'])if(WILD[k])r.push(k);if(typeof PGPX!=='undefined'&&PGPX)r.push('PGPX:'+JSON.stringify(PGPX).slice(0,120));if(!cp97On())r.push('off:'+endActive()+'/'+WILD.phase+'/'+PGU.screen);if(typeof CP86T!=='undefined'&&CP86T)r.push('CP86T');if(pgpSideGame())r.push('side');if(END.sweep)r.push('sweep');if(sweepTime>0)r.push('sweepTime');if(catquakeTime>0)r.push('quake');for(const b of bodies)if(!b.dead&&CP97_COINS.includes(b.kind))r.push('coin:'+b.kind);for(const o of WILD.incoming)if(CP97_COINS.includes(o.kind))r.push('inc:'+o.kind);if(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)r.push('paw40:'+JSON.stringify(PAW40_STATE.swipe).slice(0,100));return r;})()})");console.log('rag',JSON.stringify(res.rag));}
   if(SC.includes('gap')){await ev("PG.current=PGU.boardCat='orange';PG.open.orange=true;endLoad().coins=500;endStart();");await sleep(3000);
    res.gap=res.gap||{};res.gap[w+'x'+h]=await ev("({gap:cp99Gap(),beneath:cp99Beneath(),y:cp99MeterY(),front:skyScreen(200,T.FRONT,0).y,hud:(()=>{const l=hudLayout();return {bottomY:l.bottomY,headerBottom:l.headerBottom,H}})()})");console.log('gap',w+'x'+h,JSON.stringify(res.gap[w+'x'+h]));
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}}
   if(SC.includes('u130')){const U={};
    // chip: the Ragdoll with only Tuxedo and Ragdoll open
    await ev("for(const c of PG_CATS)PG.open[c]=(c==='tuxedo'||c==='ragdoll');pgSave();PG.current=PGU.boardCat='ragdoll';endLoad().coins=600;endStart();");await sleep(3000);
    let heartY=null,t0=Date.now(),freeAt=null,locked0=null;
    for(let i=0;i<400;i++){await ev("tryDrop({x:"+(140+(i*37)%120)+",y:DROP_Y})");await sleep(300);
     const st=await ev("({h:(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='heart');return b?Math.round(b.rb.translation().z/M):null})(),inc:WILD.incoming.filter(o=>o.kind==='heart').map(o=>Math.round(o.y)),lock:cp97Locked(),pet:!!(WILD.petGame||WILD.petPending)})");
     if(st.inc.length&&heartY==null){heartY=st.inc[0];}if(st.h!=null&&locked0==null){locked0=Date.now();await shot('u130-heart-on-board');}
     if(locked0!=null&&!st.lock&&freeAt==null&&st.h==null&&!st.pet){freeAt=Date.now();break;}}
    U.heart={landDepth:heartY,secondsLockedByHeart:locked0&&freeAt?Math.round((freeAt-locked0)/100)/10:null};
    await ev("CP97.open=false");const cp=await pt('cp97Chip()');await tapAt(cp.x,cp.y);await sleep(400);U.row=await ev("({open:CP97.open,cats:cp97Row().faces.map(f=>f.cat)})");await shot('u130-cat-row');
    const fs_=await ev("(()=>{const f=cp97Row().faces.find(f=>f.cat==='siamese');const k=scale,c=document.getElementById('c').getBoundingClientRect();return f?{x:(f.x+f.w/2)*k+c.left,y:(f.y+f.h/2)*k+c.top}:null})()");
    if(fs_){await tapAt(fs_.x,fs_.y);await sleep(800);}U.switched=await ev("({cat:PGU.boardCat,mode:WILD.mode,siameseOpen:!!PG.open.siamese,saved:JSON.parse(localStorage.getItem(PG_KEY)||'{}').open})");await shot('u130-switched-siamese');
    await ev("for(const c of PG_CATS)PG.open[c]=1;pgSave();");
    // Treat toss meter: the Orange
    await ev("CP97.open=false;cp97Switch('orange')");await sleep(500);await ev("WILD.tossPending=null;tossStart()");await sleep(2500);
    U.toss={y:await ev("cp99MeterY()"),k:await ev("cp99MeterK()"),front:await ev("skyScreen(200,T.FRONT,0).y"),H:await ev("H"),on:await ev("!!WILD.toss")};await shot('u130-toss-meter');
    await sleep(9000);
    // lost prize off a side: no red rail flash
    const lp=await ev("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item');if(!b)return null;const id=b.id;gutterOff(b,10);return id;})()");await sleep(120);await shot('u130-lost-prize');U.lost={id:lp,lostN:await ev("W43_LOST.length")};
    U.pet=await ev("({peak:PET.peak,def:PET_DEFAULTS.peak})");U.build=await ev("BUILD");
    res.u130=res.u130||{};res.u130[w+'x'+h]=U;console.log('u130',w+'x'+h,JSON.stringify(U));
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}}
   if(SC.includes('flash')){await ev("PG.current=PGU.boardCat='tuxedo';endLoad().coins=600;endStart();");await sleep(3000);
    await ev("W43_LOST.push({id:'cheese',side:-1,z:520,t:0,star:false});W43_LOST.push({id:'shrimp',side:1,z:560,t:0,star:false});");await sleep(150);await shot('flash-lost-both-sides');
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}}
   if(SC.includes('reload')){await reload();res.t3=await title();await tryTaps('reload');}
   await ws.close();}
 }catch(e){res.errors.push('probe '+String(e&&e.stack||e).slice(0,400));ok=false;}
 finally{try{ch.kill();}catch(e){}srv.close();}
 fs.writeFileSync(path.join(OUT,'probe.json'),JSON.stringify(res,null,1));console.log('errors',JSON.stringify(res.errors).slice(0,1500));process.exit(0);
})();
