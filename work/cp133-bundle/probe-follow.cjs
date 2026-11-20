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
   if(SC.includes('audit')){await sleep(600);
    const A=await ev(`(()=>{const R=[],add=(n,r,kind)=>{if(r&&Number.isFinite(r.x))R.push({n,kind:kind||'rect',x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+(r.w||0).toFixed(1),h:+(r.h||0).toFixed(1),r:r.r||0});};
     const q=f=>{try{return f()}catch(e){return null}};const D=pgDock(),M=pgMainRects(),L=PGA.L||{};
     add('dock.gear',D.gear);add('dock.coll (Collections)',D.coll);add('dock.inv (Inventory)',D.inv);add('dock.modes',D.modes);add('dock zone (all taps above y='+Math.round(D.bottom)+' go to the dock)',{x:0,y:0,w:W,h:D.bottom},'zone');
     for(const t of (D.tiles||[]))add('dock.tile '+t.id+' (not tappable)',t,'ghost');
     for(const sd of (M.side||[]))add('side '+sd.id,sd.r?{x:sd.x-sd.r,y:sd.y-sd.r,w:2*sd.r,h:2*sd.r}:sd);
     for(const k of Object.keys(L)){const r=L[k];if(r&&typeof r==='object'&&Number.isFinite(r.x))add('PGA.L.'+k,r);}
     add('endBtn = Level boards',q(()=>endBtn()));add('cp100GoalBtn = Goal boards',q(()=>cp100GoalBtn()));const d=q(()=>cp100DailyBtn());if(d)add('cp100DailyBtn',{x:d.x-d.r,y:d.y-d.r,w:2*d.r,h:2*d.r});
     add('cp87Btn (old Daily)',q(()=>cp87Btn()));add('labhBtn (Board lab)',q(()=>labhBtn()));add('head (meow)',{x:M.head.x-M.head.w*.45,y:M.head.y-M.head.w*.45/1.2,w:M.head.w*.9,h:M.head.w*.9/1.2},'oval');
     return {R,W,H,dockBottom:D.bottom,compact:!!D.compact,sideRaw:M.side};})()`);
    // overlaps between tappable rects
    const T=A.R.filter(r=>r.kind==='rect'||r.kind==='oval');const ov=[];for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const a=T[i],b=T[j];const ix=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),iy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(ix>0&&iy>0)ov.push([a.n,b.n,Math.round(ix),Math.round(iy)]);}
    A.overlaps=ov;
    await ev("(()=>{const c=document.getElementById('c'),b=c.getBoundingClientRect();let o=document.getElementById('hitov');if(!o){o=document.createElement('canvas');o.id='hitov';document.body.appendChild(o);}o.style.cssText='position:fixed;left:'+b.left+'px;top:'+b.top+'px;width:'+b.width+'px;height:'+b.height+'px;pointer-events:none;z-index:99999';o.width=b.width*2;o.height=b.height*2;const x=o.getContext('2d'),k=scale*2;x.lineWidth=3;x.font='bold 18px sans-serif';const R="+JSON.stringify(A.R)+";const col={rect:'#00ff66',oval:'#00e5ff',zone:'rgba(255,255,0,.9)',ghost:'#ff3b3b'};for(const r of R){x.strokeStyle=col[r.kind];x.setLineDash(r.kind==='zone'||r.kind==='ghost'?[8,6]:[]);if(r.kind==='oval'){x.beginPath();x.ellipse((r.x+r.w/2)*k,(r.y+r.h/2)*k,r.w/2*k,r.h/2*k,0,0,7);x.stroke();}else x.strokeRect(r.x*k,r.y*k,r.w*k,r.h*k);x.fillStyle=col[r.kind];if(r.kind!=='zone')x.fillText(r.n.split(' ')[0].replace('dock.','').replace('PGA.L.','L.'),r.x*k+3,r.y*k+18);}})()");
    await sleep(200);await shot('audit-home-hitrects');await ev("document.getElementById('hitov').remove()");
    res.audit=res.audit||{};res.audit[w+'x'+h]=A;console.log('audit',w+'x'+h,JSON.stringify({rects:A.R.map(r=>r.n+' '+[r.x,r.y,r.w,r.h].join(',')),overlaps:ov}));}
   if(SC.includes('topbtns')){await sleep(500);
    await ev("(()=>{const c=document.getElementById('c'),b=c.getBoundingClientRect();let o=document.createElement('canvas');o.id='circ';document.body.appendChild(o);o.style.cssText='position:fixed;left:'+b.left+'px;top:'+b.top+'px;width:'+b.width+'px;height:'+b.height+'px;pointer-events:none;z-index:99999';o.width=b.width*2;o.height=b.height*2;const x=o.getContext('2d'),k=scale*2,D=pgDock();x.lineWidth=5;x.strokeStyle='#ff2d55';x.font='bold 26px sans-serif';x.fillStyle='#ff2d55';for(const [r,t] of [[D.coll,'1'],[D.inv,'2']]){x.beginPath();x.arc((r.x+r.w/2)*k,(r.y+r.h/2)*k,Math.max(r.w,r.h)*.75*k,0,7);x.stroke();x.fillText(t,(r.x+r.w/2)*k-8,(r.y+r.h+22)*k);}})()");
    await sleep(150);await shot('home-top-buttons-circled');await ev("document.getElementById('circ').remove()");
    for(const [n,e] of [['collections','pgDock().coll'],['inventory','pgDock().inv']]){const q=await pt(e);await tapAt(q.x,q.y);await sleep(900);await shot('opens-'+n);res['open_'+n]=await ev("({inventoryOpen,loopScreen})");await ev("try{closeCollectionScreen()}catch(e){}");await sleep(600);}}
   if(SC.includes('pet')){await ev("PG.current=PGU.boardCat='ragdoll';PG.open.ragdoll=true;endLoad().coins=500;endStart();");await sleep(3500);await ev("WILD.petPending=null;petStart()");await sleep(2600);
    res.pet=res.pet||{};res.pet[w+'x'+h]=await ev("({on:!!WILD.petGame,y:petHudY(),done:petDoneRect(),front:skyScreen(200,T.FRONT,0).y,H,peak:PET.peak,def:PET_DEFAULTS.peak,room:cp99Gap().room})");await shot('pet-meter');console.log('pet',w+'x'+h,JSON.stringify(res.pet[w+'x'+h]));
    const dn=await pt('petDoneRect()');await tapAt(dn.x,dn.y);await sleep(400);res.pet[w+'x'+h].doneTap=await ev("WILD.petGame?WILD.petGame.phase:'gone'");await sleep(3500);
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}}
   if(SC.includes('inv2')){const R2={};for(const [n,e] of [['inventory','pgDock().inv'],['collections','pgDock().coll']]){const q=await pt(e);await tapAt(q.x,q.y);await sleep(2000);await shot('inv2-'+n+'-after-2s');
     const st=await ev("({screen:PGU.screen,inventoryOpen,loopScreen,phase:WILD.phase,paused:typeof cp51Paused!=='undefined'?cp51Paused:null})");
     const pl=await pt('PGA.L.play');await tapAt(pl.x,pl.y);await sleep(2500);await shot('inv2-'+n+'-then-play');
     R2[n]={after:st,afterPlay:await ev("({screen:PGU.screen,inventoryOpen,loopScreen,phase:WILD.phase,end:END.on})")};
     await ev("try{closeCollectionScreen()}catch(e){}");await sleep(500);const hb=await pt('wildButton()');if(hb&&await ev("PGU.screen")!=='main'){await tapAt(hb.x,hb.y);await sleep(1500);}}
    res.inv2=res.inv2||{};res.inv2[w+'x'+h]=R2;console.log('inv2',w+'x'+h,JSON.stringify(R2));}
   if(SC.includes('chip132')){const C={};
    await ev("for(const c of PG_CATS)PG.open[c]=1;pgSave();PG.current=PGU.boardCat='ragdoll';endLoad().coins=600;endStart();");await sleep(3000);
    // the heart lands where it did in 129 (depth 430-620): schedule it as the levels' rule does
    let land=null;for(let i=0;i<120&&land==null;i++){await ev("tryDrop({x:"+(150+(i*29)%100)+",y:DROP_Y})");await sleep(250);land=await ev("(()=>{const o=WILD.incoming.find(o=>o.kind==='heart');if(o)return Math.round(o.y);const b=bodies.find(b=>!b.dead&&b.kind==='heart');return b?'onboard':null})()");}
    if(land==null||land==='onboard'){await ev("WILD.heartN=0;WILD.heartAt=WILD.bonusN;wildScheduleBonus();");land=await ev("(()=>{const o=WILD.incoming.find(o=>o.kind==='heart');return o?Math.round(o.y):null})()");}
    C.heartLand=land;await sleep(2500);
    C.heartOn=await ev("bodies.filter(b=>!b.dead&&b.kind==='heart').map(b=>({x:Math.round(b.rb.translation().x/M),z:Math.round(b.rb.translation().z/M)}))");
    C.lockWithCoin=await ev("cp97Locked()");await shot('chip132-heart-on-board-unlocked');
    const cp=await pt('cp97Chip()');await tapAt(cp.x,cp.y);await sleep(400);C.rowOpen=await ev("CP97.open");
    const fo=await ev("(()=>{const f=cp97Row().faces.find(f=>f.cat==='orange');const k=scale,c=document.getElementById('c').getBoundingClientRect();return f?{x:(f.x+f.w/2)*k+c.left,y:(f.y+f.h/2)*k+c.top}:null})()");if(fo){await tapAt(fo.x,fo.y);await sleep(600);}
    C.afterSwitch=await ev("({cat:PGU.boardCat,hearts:bodies.filter(b=>!b.dead&&b.kind==='heart').length,fish:bodies.filter(b=>!b.dead&&b.kind==='fish').map(b=>({x:Math.round(b.rb.translation().x/M),z:Math.round(b.rb.translation().z/M)})),converted:CP132.converted,lock:cp97Locked()})");await shot('chip132-converted-to-fish');
    // incoming converts too
    await ev("WILD.incoming.push({kind:'fish',id:null,x:200,y:520,t:.9,t0:.9})");C.lockIncoming=await ev("cp97Locked()");await ev("cp97Switch('siamese')");C.incomingAfter=await ev("WILD.incoming.map(o=>o.kind)");
    // locks during active play only
    await ev("cp97Switch('ragdoll')");await sleep(300);await ev("WILD.petPending=null;petStart()");await sleep(600);C.lockPet=await ev("cp97Locked()");await shot('chip132-locked-during-pet');
    await sleep(14000);C.afterPet=await ev("({pet:!!WILD.petGame,lock:cp97Locked()})");
    res.chip132=res.chip132||{};res.chip132[w+'x'+h]=C;console.log('chip132',w+'x'+h,JSON.stringify(C));
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}}
   if(SC.includes('pause132')){const P={};
    await ev("endLoad().coins=600;endStart();");await sleep(6000);P.can=await ev("cp51CanPause()");await ev("cp51Pause('button')");await sleep(700);
    P.endless=await ev("({paused:cp51Paused,finish:cp51Rects().finish,card:cp51Rects().card,home:cp51Rects().home})");await shot('pause-endless');
    // a tap where END ROUND was does nothing (still paused, still on the board)
    const old={x:66+134,y:P.endless.card.y+152+20};const k=await ev("scale");const c=await ev("(()=>{const b=document.getElementById('c').getBoundingClientRect();return {l:b.left,t:b.top}})()");
    await tapAt(old.x*k+c.l,old.y*k+c.t);await sleep(500);P.tapOld=await ev("({paused:cp51Paused,end:END.on,phase:WILD.phase})");
    const hm=await pt('cp51Rects().home');await tapAt(hm.x,hm.y);await sleep(1500);P.home=await ev("PGU.screen");
    // a goal board keeps END ROUND
    await ev("cp100Open('goals')");await sleep(400);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);
    await ev("cp51Pause('button')");await sleep(700);P.goal=await ev("({paused:cp51Paused,finish:cp51Rects().finish,lab:LABH.active})");await shot('pause-goal-board');
    const f2=await pt('cp51Rects().finish');await tapAt(f2.x,f2.y);await sleep(3500);P.goalAfterEnd=await ev("({paused:cp51Paused,phase:WILD.phase,lab:LABH.active,screen:PGU.screen,list:(document.getElementById('cp100boards')||{style:{}}).style.display,result:LABH.result})");await shot('pause-goal-after-end-round');
    res.pause132=res.pause132||{};res.pause132[w+'x'+h]=P;console.log('pause132',w+'x'+h,JSON.stringify(P));}
   if(SC.includes('goalend')){await ev("cp100Open('goals')");await sleep(400);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);
    const G={before:await ev("({end:END.on,endActive:endActive(),lab:LAB.on(),phase:WILD.phase,status:board.status,can:cp51CanPause(),winHeld:WILD.winHeld,got:WILD.got})")};
    await ev("globalThis.__fin=[];{const f=wildFinish;wildFinish=function(w,r){__fin.push([w,r,board.status]);return f.apply(this,arguments);};}");await ev("cp51Pause('button')");await sleep(300);await ev("cp51Finish()");await sleep(1500);
    G.after=await ev("({phase:WILD.phase,status:board.status,fin:__fin,endT:WILD.endT})");console.log('goalend',JSON.stringify(G));}
   if(SC.includes('shop132')){await ev("PG.shown={kitchen:1,porch:1,album:1,board:1};PG.seenScr={kitchen:1,porch:1,album:1,board:1};pgSave();pgGo('main');");await sleep(900);await shot('shop132-home');
    const S2={side:await ev("pgMainRects().side.map(b=>b.id+'@'+Math.round(b.x)+','+Math.round(b.y))"),daily:await ev("cp100DailyBtn()"),name:await ev("(()=>{const L=PGA.L||{};return L.name||null})()")};
    const sp=await pt("(()=>{const b=pgMainRects().side.find(b=>b.id==='shop');return {x:b.x,y:b.y}})()");await tapAt(sp.x,sp.y);await sleep(1500);S2.after=await ev("PGU.screen");await shot('shop132-opened');await ev("pgGo('main')");await sleep(900);S2.sideAfterVisit=await ev("pgMainRects().side.map(b=>b.id+'@'+Math.round(b.x)+','+Math.round(b.y))");S2.dailyAfterVisit=await ev("cp100DailyBtn()");await shot('shop132-home-after-visit');
    res.shop132=res.shop132||{};res.shop132[w+'x'+h]=S2;console.log('shop132',w+'x'+h,JSON.stringify(S2));await ev("pgGo('main')");await sleep(600);}
   if(SC.includes('coll132')){await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});const C={};
    await ev("pgGo('main')");await sleep(800);C.btn=await ev("c132Btn()");C.daily=await ev("cp100DailyBtn()");C.side=await ev("pgMainRects().side.map(b=>b.id+'@'+Math.round(b.x)+','+Math.round(b.y))");await shot('coll132-home');
    for(const [n,e] of [['round','c132Btn()'],['card-icon','pgDockMainColl()'],['bag-icon','pgDockMainInv()']]){
     await ev("globalThis.pgDockMainColl=()=>pgDock().coll;globalThis.pgDockMainInv=()=>pgDock().inv;");const q=await pt(e);await touchAt(q.x,q.y);await sleep(1200);
     C[n]=await ev("({screen:PGU.screen,inventoryOpen,loopScreen})");await shot('coll132-open-'+n);
     // Close (top right of the old screens): tap where it's drawn
     const cl=await ev("(()=>{const s=typeof collectionScreenRect==='function'?collectionScreenRect():null;return s})()");
     await ev("try{closeCollectionScreen()}catch(e){}");await sleep(900);C[n+'Closed']=await ev("({screen:PGU.screen,inventoryOpen})");}
    await call('Emulation.setTouchEmulationEnabled',{enabled:false});
    res.coll132=res.coll132||{};res.coll132[w+'x'+h]=C;console.log('coll132',w+'x'+h,JSON.stringify(C));}
   if(SC.includes('collclose')){await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});const C={};await ev("pgGo('main')");await sleep(800);
    const q=await pt('c132Btn()');await touchAt(q.x,q.y);await sleep(1200);C.open=await ev("({screen:PGU.screen,inventoryOpen})");
    await touchAt(w*0.89,h*0.033);await sleep(1200);C.afterClose=await ev("({screen:PGU.screen,inventoryOpen})");await shot('collclose-after');
    // a coin reward check: where would the collection reward go?
    C.coins=await ev("({S:S.coins,wallet:typeof cp100Coins==='function'?cp100Coins():null})");
    await call('Emulation.setTouchEmulationEnabled',{enabled:false});console.log('collclose',w+'x'+h,JSON.stringify(C));}
   if(SC.includes('cwallet')){const C={};await ev("pgGo('main')");await sleep(700);
    await ev("S.got.tuna=1;S.got.shrimp=1;delete placements.tuna;delete placements.shrimp;collectionPaid.water=false;save();");
    C.before=await ev("({wallet:cp100Coins(),S:S.coins})");const q=await pt('c132Btn()');await tapAt(q.x,q.y);await sleep(900);
    C.shown=await ev("collectionPurseDisplay()");await ev("placeItem('tuna');placeItem('shrimp')");await sleep(2600);
    C.after=await ev("({wallet:cp100Coins(),S:S.coins,paid:collectionPaid.water,shown:collectionPurseDisplay(),saved:JSON.parse(localStorage.getItem(END.KEY)).coins})");await shot('cwallet-satchel');
    await ev("try{closeCollectionScreen()}catch(e){}");await sleep(800);C.home=await ev("PGU.screen");
    res.cwallet=res.cwallet||{};res.cwallet[w+'x'+h]=C;console.log('cwallet',w+'x'+h,JSON.stringify(C));}
   if(SC.includes('look133')){await ev("pgGo('main');cp100Open('goals')");await sleep(400);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);await shot('look-goal-hud');
    res.look=res.look||{};res.look[w+'x'+h]={btn:await ev("cp51Btn()"),hud:await ev("(()=>{const l=hudLayout();return {left:l.left,bannerY:l.bannerY,top:l.top}})()"),clock:await ev("wildClock()"),left:await ev("WILD.left"),coins:await ev("S.coins"),budget:await ev("typeof labBudget==='function'?labBudget():null")};
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){}");await sleep(500);
    await ev("PG.current=PGU.boardCat='ragdoll';PG.open.ragdoll=true;endLoad().coins=500;endStart();");await sleep(3500);await ev("WILD.petPending=null;petStart()");await sleep(300);await shot('look-pet-title');await sleep(1200);await shot('look-pet-title-2');await sleep(1500);await shot('look-pet-play');
    console.log('look',w+'x'+h,JSON.stringify(res.look[w+'x'+h]));const hb2=await pt('wildButton()');if(hb2){await tapAt(hb2.x,hb2.y);await sleep(1200);}}
   if(SC.includes('v133')){const V={};await ev("pgGo('main')");await sleep(900);await shot('v133-home');
    V.home=await ev("({dock:(()=>{const D=pgDock();return {coll:D.coll,inv:D.inv,modes:D.modes,gear:D.gear}})()})");
    // a tap where the card and bag icons were: nothing opens
    await ev("globalThis.__ol=openLoopScreen;globalThis.__olN=0;openLoopScreen=function(){__olN++;return __ol.apply(this,arguments);}");
    for(const [x,y] of [[263,49],[295,49]]){const k=await ev('scale'),c=await ev("(()=>{const b=document.getElementById('c').getBoundingClientRect();return {l:b.left,t:b.top}})()");await tapAt(x*k+c.l,y*k+c.t);await sleep(500);}
    V.oldIconTaps=await ev("({opened:__olN,screen:PGU.screen,inv:inventoryOpen})");await ev("openLoopScreen=__ol");
    // the board banner
    const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);await shot('v133-board-banner');V.banner=await ev("endName()");
    // Pet the cat ring at three moments (Ragdoll)
    await ev("cp97Switch('ragdoll')");await sleep(400);V.petStart=await ev("(()=>{WILD.petPending=null;petStart();return {g:!!WILD.petGame,phase:WILD.phase,cat:PGU.boardCat,mode:WILD.mode,status:board.status}})()");await sleep(700);V.petAt1=await ev("WILD.petGame?WILD.petGame.phase+' '+WILD.petGame.t.toFixed(2):'none'");await shot('v133-pet-title');
    await sleep(1600);await shot('v133-pet-title-into-play');await ev("WILD.petGame.L=.5");await sleep(150);await shot('v133-pet-ring-half');
    await ev("WILD.petGame.L=1;WILD.petGame.flat=0");await sleep(150);await shot('v133-pet-ring-peak');await ev("WILD.petGame.flat=.6");await sleep(150);await shot('v133-pet-ring-grumpy');
    V.done=await ev("petDoneRect()");const dn=await pt('petDoneRect()');await tapAt(dn.x,dn.y);await sleep(500);V.doneTap=await ev("WILD.petGame?WILD.petGame.phase:'gone'");await sleep(1200);await shot('v133-pet-result');await sleep(2500);
    const hb=await pt('wildButton()');if(hb){await tapAt(hb.x,hb.y);await sleep(1200);}
    // a goal board's top bar
    await ev("cp100Open('goals')");await sleep(400);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);await shot('v133-goal-hud');
    V.goal={btn:await ev("cp51Btn()"),wide:await ev("hudWide133()"),clock:await ev("wildClock()")};
    res.v133=res.v133||{};res.v133[w+'x'+h]=V;console.log('v133',w+'x'+h,JSON.stringify(V));
    const hb2=await pt('wildButton()');if(hb2){await tapAt(hb2.x,hb2.y);await sleep(1200);}await ev("try{const el=document.getElementById('cp100boards');if(el&&el.style.display==='flex')el.querySelector('button[data-a=home]').click();}catch(e){}");await sleep(500);}
   if(SC.includes('headgeo')){await ev("PG.current=PGU.boardCat='ragdoll';endLoad().coins=500;endStart();");await sleep(3000);
    console.log('geo',w+'x'+h,JSON.stringify(await ev("({h0:headToScreen(200,0),h60:headToScreen(200,60),h100:headToScreen(200,100),h160:headToScreen(200,160),h215:headToScreen(200,215),side:headToScreen(400,120),chin:typeof cp97ChinY==='function'?cp97ChinY():null,front:skyScreen(200,T.FRONT,0).y,hud:hudLayout().headerBottom})")));}
   if(SC.includes('reload')){await reload();res.t3=await title();await tryTaps('reload');}
   await ws.close();}
 }catch(e){res.errors.push('probe '+String(e&&e.stack||e).slice(0,400));ok=false;}
 finally{try{ch.kill();}catch(e){}srv.close();}
 fs.writeFileSync(path.join(OUT,'probe.json'),JSON.stringify(res,null,1));console.log('errors',JSON.stringify(res.errors).slice(0,1500));process.exit(0);
})();
