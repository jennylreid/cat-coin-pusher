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
   if(SC.includes('fresh135')){const F=[];await ev("pgGo('main')");await sleep(800);for(let i=0;i<3;i++){const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);F.push(await ev("endKey()+(END.w&&END.w.gentle?' gentle':'')"));if(i===0){await ev("CP135P.n=0;globalThis.__g=[];globalThis.__g0=time;{const d=diagEvent;diagEvent=function(k,m){if(k==='cp135')__g.push(+(time-__g0).toFixed(2));return d.apply(this,arguments);};}for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);");const gt=[];for(let j=0;j<14;j++){await sleep(2000);gt.push(await ev("({t:+(time-__g0).toFixed(1),on:bodies.filter(b=>!b.dead&&b.kind==='item').length,inc:WILD.incoming.filter(o=>o.kind==='item').length})"));}
      res.gentle135=res.gentle135||{};res.gentle135[w+'x'+h]={refills:await ev('__g'),timeline:gt,ids:await ev("bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id)")};await shot('v135-gentle-refill');}await ev("cp51Pause('button')");await sleep(200);await ev('cp51Home()');await sleep(1500);}
    res.fresh135=res.fresh135||{};res.fresh135[w+'x'+h]=F;console.log('fresh135',w+'x'+h,JSON.stringify(F));}

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
   if(SC.includes('dbg134')){await ev("pgGo('main')");await sleep(900);const hd=await pt('pgMainRects().head');console.log('hd',JSON.stringify(hd));
    console.log(JSON.stringify(await ev("({free:endHomeFree(),screen:PGU.screen,labh:typeof labhFree,src:String(pgMainTap).slice(0,120),pd:String(pgPointerDown).slice(0,100)})")));
    await ev("globalThis.__pd=[];document.addEventListener('pointerdown',e=>__pd.push(['d',e.clientX,e.clientY,e.target.id]),true);document.addEventListener('pointerup',e=>__pd.push(['u',e.clientX,e.clientY]),true)");
    await call('Input.dispatchMouseEvent',{type:'mousePressed',x:hd.x,y:hd.y,button:'left',clickCount:1});await sleep(100);console.log('down',JSON.stringify(await ev("({d:CP134H.down&&{x:CP134H.down.x,y:CP134H.down.y},pd:__pd})")));
    await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:hd.x,y:hd.y,button:'left',clickCount:1});await sleep(100);console.log('up',JSON.stringify(await ev("({d:CP134H.down,pd:__pd,h:PGA.hearts.length,react:PGA.react})")));}
   if(SC.includes('v134')){const V={};await ev("pgGo('main')");await sleep(900);await shot('v134-home');
    const drag=async(x0,y0,dx,dy)=>{await call('Input.dispatchMouseEvent',{type:'mousePressed',x:x0,y:y0,button:'left',clickCount:1});for(let i=1;i<=6;i++){await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:x0+dx*i/6,y:y0+dy*i/6,button:'left',buttons:1});await sleep(16);}await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:x0+dx,y:y0+dy,button:'left',clickCount:1});};
    V.home=await ev("({modes:pgDock().modes,goalBtn:cp100GoalBtn(),goals:CP134_GOALS,cat:PGU.boardCat,hearts:PGA.hearts.length})");
    const hd=await pt('({x:pgMainRects().head.x,y:pgMainRects().head.y})');const k=await ev('scale');
    await drag(hd.x,hd.y,-90*k,6);await sleep(300);V.swipeL=await ev("({cat:PGU.boardCat,hearts:PGA.hearts.length,swipes:CP134H.swipes})");await shot('v134-home-swiped');
    await drag(hd.x,hd.y,90*k,-4);await sleep(300);V.swipeR=await ev("({cat:PGU.boardCat,hearts:PGA.hearts.length})");
    await tapAt(hd.x,hd.y);await sleep(200);V.tapHead=await ev("({cat:PGU.boardCat,hearts:PGA.hearts.length,radial:PGA.hearts.filter(h=>h.vx!==undefined).length,quads:[...new Set(PGA.hearts.filter(h=>h.vx!==undefined).map(h=>(h.vx>0?'R':'L')+(h.vy>0?'D':'U')))].sort().join(',')})");await sleep(450);await shot('v134-home-hearts');
    for(let i=0;i<5;i++){await drag(hd.x,hd.y,-90*k,0);await sleep(150);V['loop'+i]=await ev('PGU.boardCat');}
    // an unopened cat plays the endless board and stays unopened
    await ev("PG.open.siamese=0;PGU.boardCat='tortie';pgSave()");await drag(hd.x,hd.y,90*k,0);await sleep(300);V.toSiamese=await ev("({cat:PGU.boardCat,open:PG.open.siamese,current:PG.current})");
    const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);V.playSiamese=await ev("({end:END.on,cat:PGU.boardCat,mode:WILD.mode,open:PG.open.siamese,screen:PGU.screen,phase:WILD.phase})");await shot('v134-siamese-board');
    // new board title
    await ev("endNewBoard(endPickNext())");await sleep(1200);V.nb1=await ev("({pending:CP134N.pending,name:endName(),phase:WILD.phase})");await shot('v134-newboard-title');await sleep(3500);V.nb2=await ev("({pending:CP134N.pending,phase:WILD.phase})");await shot('v134-newboard-after');
    // Ragdoll: Pet the cat strip and the pause bars
    await ev("cp97Switch('ragdoll')");await sleep(400);await ev("WILD.petPending=null;petStart()");await sleep(700);await shot('v134-pet-title');
    V.geo=await ev("({strip:petStripY(),hud:petHudY(),done:petDoneRect(),chin:typeof cp97ChinY==='function'?cp97ChinY():null,back:skyScreen(200,T.BACK,0).y,front:skyScreen(200,T.FRONT,0).y,H,bars:cp134BarX(hudLayout()),own:cp134OwnBars(),wide:hudWide133()})");
    await sleep(1600);await shot('v134-pet-into-play');await ev("WILD.petGame.L=.5");await sleep(150);await shot('v134-pet-half');
    await ev("WILD.petGame.L=1;WILD.petGame.flat=0");await sleep(150);await shot('v134-pet-peak');await ev("WILD.petGame.flat=.6");await sleep(150);await shot('v134-pet-grumpy');
    const dn=await pt('petDoneRect()');await tapAt(dn.x,dn.y);await sleep(500);V.doneTap=await ev("WILD.petGame?WILD.petGame.phase:'gone'");await sleep(1200);await shot('v134-pet-result');await sleep(2500);
    // the Tuxedo's Dance break: one set of bars
    await ev("cp97Switch('tuxedo')");await sleep(300);await ev("try{WILD.danceForce=true;danceStartNow()}catch(e){}");await sleep(2500);V.dance=await ev("({dance:!!WILD.dance,own:cp134OwnBars()})");await shot('v134-dance-bars');
    res.v134=res.v134||{};res.v134[w+'x'+h]=V;console.log('v134',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('prod134')){const V={};await ev("pgGo('main')");await sleep(900);V.home=await ev("({build:BUILD,goals:CP134_GOALS,goalBtn:cp100GoalBtn(),lv:!!endBtn()})");await shot('prod134-home');
    await ev("cp100Open('goals')");await sleep(500);V.list=await ev("({mode:CP100.mode,goalRows:document.querySelectorAll('#cp100boards button[data-g]').length,rows:document.querySelectorAll('#cp100boards button[data-k]').length})");
    res.prod134=res.prod134||{};res.prod134[w+'x'+h]=V;console.log('prod134',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('perf134')){const P={};const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);
    await ev("globalThis.__st={n:0,ms:0,on:false};{const __s=step;step=function(){if(!__st.on)return __s.apply(this,arguments);const t=performance.now();try{return __s.apply(this,arguments);}finally{__st.ms+=performance.now()-t;__st.n++;}};}");
    for(const k of (process.env.BOARDS||'L1,L2,L3,L4,L5,L6,L7,L8').split(',')){await ev("endNewBoard('"+k+"');S.coins=9999;board.remaining=9999;END.sweep=null");await sleep(1500);
     await ev("globalThis.__dr=setInterval(()=>{try{S.coins=9999;board.remaining=9999;tryDrop(60+Math.random()*280)}catch(e){}},180)");await sleep(+(process.env.FILL||30000));await ev("clearInterval(__dr)");await sleep(2000);
     await ev("__st.n=0;__st.ms=0;__st.on=true;globalThis.__f0=performance.now()");await sleep(6000);
     P[k]=await ev("(()=>{__st.on=false;const n=__st.n;return {name:endName(),coins:cp51Pieces(),bodies:bodies.filter(b=>!b.dead).length,prizes:bodies.filter(b=>!b.dead&&b.kind!=='coin'&&b.kind!=='silver'&&b.kind!=='gold5').length,steps:n,msPerStep:+(__st.ms/n).toFixed(3),stepsPerSec:+(n*1000/(performance.now()-__f0)).toFixed(1),fps:+perf.fps.toFixed(1)}})()");
     await shot('perf134-'+k);console.log('perf',k,JSON.stringify(P[k]));}
    res.perf134=P;}
   if(SC.includes('v135')){const V={};const crop=async(n)=>{const k=await ev('scale');const r=await call('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:w,height:Math.round(120*k),scale:2}});fs.writeFileSync(path.join(OUT,`${n}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));};
    const toBoard=async cat=>{await ev("if(END.on&&WILD.on){cp51Pause&&0}");await ev(`pgGo('main');PGU.boardCat='${cat}';PG.current='${cat}';endLoad().coins=500;endStart();`);await sleep(4500);};
    for(const cat of ['tuxedo','siamese','ragdoll','orange']){await toBoard(cat);await crop('v135-top-'+cat);await shot('v135-board-'+cat);
     V['top_'+cat]=await ev("({wb:wildButton(),gone:cp135HomeGone(),gear:(()=>{try{return hudLayout()}catch(e){return null}})()})");}
    // a tap where Home was: stays on the board
    const hb=await pt('wildButton()');await tapAt(hb.x,hb.y);await sleep(800);V.homeTap=await ev("({screen:PGU.screen,end:END.on,paused:cp51Paused})");
    // pause -> Home works
    await ev("cp51Pause('button')");await sleep(300);await shot('v135-pause');await ev("cp51Home()");await sleep(1500);V.pauseHome=await ev("({screen:PGU.screen,end:END.on})");
    // prize refill: clear the prizes, watch for ~26 s
    await ev(`pgGo('main');PGU.boardCat='tuxedo';PG.current='tuxedo';endLoad().coins=500;endStart();`);await sleep(5000);
    await ev("CP135P.n=0;globalThis.__mine=[];{const d=diagEvent;diagEvent=function(k,m){if(k==='cp135')__mine.push(+(time-__t0).toFixed(2));return d.apply(this,arguments);};}for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);globalThis.__pr=[];globalThis.__t0=time;{const f=WILD.incoming.push;WILD.incoming.push=function(o){if(o.kind==='item')__pr.push(+(time-__t0).toFixed(2));return f.apply(this,arguments);};}");
    const tl=[];for(let i=0;i<13;i++){await sleep(2000);tl.push(await ev("({t:+(time-__t0).toFixed(1),on:bodies.filter(b=>!b.dead&&b.kind==='item').length,inc:WILD.incoming.filter(o=>o.kind==='item').length,mine:CP135P.n})"));}
    V.refill={mine:await ev('__mine'),drops:await ev('__pr'),timeline:tl,ids:await ev("bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id)"),coll:await ev('WILD_COLLECTION')};await shot('v135-refill');
    // no repeat: a fresh player, PLAY / Home x4, NEW BOARD x6
    await ev("localStorage.clear()");await reload();await title();await ev("pgGo('main')");await sleep(800);const seq=[];
    for(let i=0;i<4;i++){const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);seq.push('play:'+await ev('endKey()'));await ev("cp51Pause('button')");await sleep(200);await ev('cp51Home()');await sleep(1500);}
    const pp2=await pt('PGA.L.play');await tapAt(pp2.x,pp2.y);await sleep(3500);seq.push('play:'+await ev('endKey()'));
    for(let i=0;i<6;i++){await ev('endNewBoard(endPickNext())');await sleep(700);seq.push('new:'+await ev('endKey()'));}
    V.seq=seq;V.repeat=seq.some((x,i)=>i&&x.split(':')[1]===seq[i-1].split(':')[1]);V.firstGentle=seq[0]==='play:L1';
    V.levelBtn=await ev("(pgGo('main'),!!endBtn())");
    res.v135=res.v135||{};res.v135[w+'x'+h]=V;console.log('v135',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('prod135')){const V={};await ev("pgGo('main')");await sleep(900);V.home=await ev("({build:BUILD,levelBtn:endBtn(),goalBtn:cp100GoalBtn()})");await shot('prod135-home');
    await ev("cp100Open('levels')");await sleep(500);V.list=await ev("(document.getElementById('cp100boards')||{style:{}}).style.display||'none'");
    res.prod135=res.prod135||{};res.prod135[w+'x'+h]=V;console.log('prod135',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('refresh')){const V={};await ev("window.Android=window.Android||{};Android.checkUpdates=function(){globalThis.__cu=(globalThis.__cu|0)+1;};S.dev=true;");
    await ev(`pgGo('main');PGU.boardCat='tuxedo';PG.current='tuxedo';endLoad().coins=500;endStart();`);await sleep(4500);await shot('refresh-board');
    V.geo=await ev("({W,right:hudLayout().right,mainY:hudLayout().mainY,ref:W-hudLayout().right-66,dock:(()=>{try{const D=pgDock();return {gear:D.gear}}catch(e){return null}})()})");
    const k=await ev('scale'),c=await ev("(()=>{const b=document.getElementById('c').getBoundingClientRect();return {l:b.left,t:b.top}})()");
    for(const x of [306,318,326,334,342,352]){await ev("globalThis.__cu=0;globalThis.__oc=0;{const o=openCredits;if(!o.__w){openCredits=function(){__oc++;return o.apply(this,arguments)};openCredits.__w=1;}}");
     await tapAt(x*k+c.l,V.geo.mainY*k+c.t);await sleep(500);V['x'+x]=await ev("({checkUpdates:__cu,settings:__oc,screen:PGU.screen,end:END.on,coins:S.coins,panel:panel.style.display})");await ev("panel.style.display='none'");await sleep(200);}
    res.refresh=res.refresh||{};res.refresh[w+'x'+h]=V;console.log('refresh',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('v137')){const V={};const go=async cat=>{await ev(`pgGo('main');PGU.boardCat='${cat}';PG.current='${cat}';endLoad().coins=500;endStart();`);await sleep(4500);};
    await go('tuxedo');V.on=await ev('cp137On()');V.loaded=await ev("CP137_IDS.filter(id=>CP137.art[id].complete&&CP137.art[id].naturalWidth).length");
    // stills: every new prize on the board (three groups), and the rainbow beside the cheese
    const groups=[CP=>0,1,2,3];const IDS=await ev('CP137_IDS');const G=[IDS.slice(0,6),IDS.slice(6,12),IDS.slice(12).concat(['cheese'])];
    for(let gi=0;gi<G.length;gi++){await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;CP135P.MIN=0;");
     const ids=G[gi];await ev(`(${JSON.stringify(ids)}).forEach((id,i)=>{const x=95+(i%3)*105,y=560+((i/3)|0)*80;addCoin('item',id,x,COIN_HALF*6,y,yawTurn(0));});`);await sleep(1800);await shot('v137-prizes-'+(gi+1));}
    // the Star at full device resolution beside coins
    await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);addCoin('item','cstar',200,COIN_HALF*6,600,yawTurn(0));");await sleep(1500);
    {const q=await ev("(()=>{const b=bodies.find(b=>!b.dead&&b.id==='cstar');const t=b.rb.translation(),c=skyScreen(t.x/M,t.z/M,0);return {x:c.x,y:c.y}})()");const k2=await ev('scale');
     for(let i=0;i<3;i++){const r=await call('Page.captureScreenshot',{format:'png',clip:{x:q.x*k2-60,y:q.y*k2-80,width:120,height:110,scale:2.75}});fs.writeFileSync(path.join(OUT,`v137-star-zoom${i}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));await sleep(230);}}
    // landings: drop the six viewed prizes in from the sky, twice each; record the view each settles in
    await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);globalThis.__land=[];");
    const VW=await ev('CP137_VIEWED');const LAND=[];for(let r=0;r<3;r++){await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);");
     await ev(`(${JSON.stringify(VW)}).forEach((id,i)=>{const x=150+(i%3)*50,y=470+((i/3)|0)*60;WILD.incoming.push({kind:'item',id,x,y,t:.6+i*.2,t0:.6+i*.2,cp137:1});});`);
     for(let q=0;q<30&&await ev('WILD.incoming.length');q++)await sleep(400);await sleep(2500);LAND.push(...await ev("bodies.filter(b=>!b.dead&&CP137_VIEWED.includes(b.id)).map(b=>b.id+':'+(b.cp137?CP137_VIEWS[b.cp137.v]:'none'))"));if(r===0)await shot('v137-landings');}
    V.landings=LAND;
    await ev("addCoin('item','diamond',200,COIN_HALF*6,620,yawTurn(0));");await sleep(1200);
    {const tq="(()=>{const b=bodies.find(b=>!b.dead&&b.id==='diamond'&&b.cp137);return b?{v:CP137_VIEWS[b.cp137.v],frameAt:Math.floor(((time+b.cp137.ph)%1.75)*24)%42}:null})()";const t1=await ev(tq);await sleep(400);const t2=await ev(tq);V.twinkle=t1&&t2?{v:t1.v,frames:[t1.frameAt,t2.frameAt]}:null;}
    // the board drops two new prizes once 2 s into play; a bonus prize half the time
    await go('orange');for(let q=0;q<20&&!(await ev('CP137.boardDrops&&!WILD.incoming.length'));q++)await sleep(500);await sleep(1500);V.boardDrops=await ev("({flag:CP137.boardDrops,newOnBoard:bodies.filter(b=>!b.dead&&b.kind==='item'&&CP137_IDS.includes(b.id)).map(b=>b.id),n:CP137.n})");
    let nb=0,nn=0;for(let i=0;i<40;i++){const id=await ev("(()=>{const o={kind:'item',id:'egg',x:200,y:500,t:0,t0:0};const f=addCoin;let got=null;addCoin=function(k,id){got=id;return f.apply(this,arguments)};try{wildLandBonus(o)}finally{addCoin=f};return got})()");nb++;if(await ev(`CP137_IDS.includes(${JSON.stringify(id)})`))nn++;}
    V.bonusShare={landed:nb,newOnes:nn};
    // pounce: max 3 mice, meter under the pusher
    await go('tortie');await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);WILD.pouncePending=null;pounceStart()");let mx=0;const ys=[];
    for(let i=0;i<40;i++){await sleep(250);const r=await ev("WILD.pounce?{run:WILD.pounce.mice.filter(m=>m.state==='run').length,ys:WILD.pounce.mice.map(m=>Math.round(m.y)),phase:WILD.pounce.phase,next:WILD.pounce.next,n:WILD.pounce.n}:null");if(!r)break;mx=Math.max(mx,r.run);ys.push(...r.ys);if(i===12)await shot('v137-pounce');}
    V.pounce={maxRunning:mx,meterY:await ev('cp137PounceY()'),miceY:[Math.min(...ys),Math.max(...ys)],front:await ev('Math.round(skyScreen(200,T.FRONT,0).y)'),pusherFront:await ev('Math.round(skyScreen(200,PUSH_MAX,0).y)')};await sleep(4000);
    // top bar: Developer on in the app (stubbed): one gear, no update shortcut; taps
    await ev("window.Android=window.Android||{};Android.checkUpdates=function(){globalThis.__cu=(globalThis.__cu|0)+1;};S.dev=true;");await go('tuxedo');
    const k=await ev('scale'),c=await ev("(()=>{const b=document.getElementById('c').getBoundingClientRect();return {l:b.left,t:b.top}})()");
    const cr=await call('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:w,height:Math.round(110*k),scale:2}});fs.writeFileSync(path.join(OUT,`v137-topbar-${w}x${h}.png`),Buffer.from(cr.result.data,'base64'));
    const my=await ev('hudLayout().mainY');const taps={};for(const x of [306,318,334,362,378,390]){await ev("globalThis.__cu=0;globalThis.__mu=S.muted;panel.style.display='none'");await tapAt(x*k+c.l,my*k+c.t);await sleep(400);taps['x'+x]={cu:await ev('__cu'),settings:await ev("panel.style.display"),muteChanged:await ev('S.muted!==__mu')};}
    await ev("panel.style.display='none';S.dev=false");V.topbar={gear:await ev('pgPlayGear()'),taps};
    // the chip on a Goal board
    await ev("pgGo('main');cp100Open('goals')");await sleep(500);await ev("document.querySelector('#cp100boards button[data-g=cup]').click()");await sleep(4500);
    V.goal={lab:await ev('cp137GoalBoard()'),on:await ev('cp97On()'),locked:await ev('cp97Locked()'),cats:await ev('cp97Cats()'),cat:await ev('PGU.boardCat')};await shot('v137-goal-chip');
    const ch=await pt('cp97Chip()');await tapAt(ch.x,ch.y);await sleep(500);V.goal.rowOpen=await ev('CP97.open');await shot('v137-goal-row');
    const rg=await ev("(()=>{const f=cp97Row().faces.find(f=>f.cat==='ragdoll');return f?{x:f.x,y:f.y,w:f.w,h:f.h}:null})()");if(rg){const q=await pt(JSON.stringify(rg));await tapAt(q.x,q.y);await sleep(600);}
    V.goal.after=await ev("({cat:PGU.boardCat,mode:WILD.mode,lab:cp137GoalBoard(),phase:WILD.phase})");await shot('v137-goal-ragdoll');
    V.shop=await ev("(()=>{const was=PGU.shop&&PGU.shop.tab;PGU.shop=PGU.shop||{};PGU.shop.tab='sell';const n0=pgHave('diamond');pgAddItem('diamond');const rows=pgShopRows().map(r=>r.id||r.k||null);const r={inBag:pgHave('diamond')-n0,sellRow:rows.includes('diamond'),price:pgSell('diamond'),name:pgName('diamond')};PGU.shop.tab=was;return r;})()");
    res.v137=res.v137||{};res.v137[w+'x'+h]=V;console.log('v137',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('prod137')){const V={};await ev("pgGo('main')");await sleep(600);V.on=await ev('cp137On()');V.build=await ev('BUILD');res.prod137=res.prod137||{};res.prod137[w+'x'+h]=V;console.log('prod137',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('dbg137')){await ev(`pgGo('main');PGU.boardCat='tuxedo';PG.current='tuxedo';endLoad().coins=500;endStart();`);await sleep(4500);
    await ev("globalThis.__rm=[];{const f=removeCoin;removeCoin=function(b){if(b&&b.kind==='item')__rm.push([b.id,Math.round(time*10)/10,Math.round(b.rb.translation().z/M),Math.round(b.rb.translation().y/M),String(new Error().stack).slice(0,400)]);return f.apply(this,arguments);};}");
    await ev("for(const id of ['owl','hot_dog','crab']){WILD.incoming.push({kind:'item',id,x:120+Math.random()*160,y:500,t:.9,t0:.9,cp137:1});}");
    for(let i=0;i<10;i++){await sleep(700);console.log('t',JSON.stringify(await ev("({inc:WILD.incoming.map(o=>o.id+':'+o.t.toFixed(2)),on:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id+'@'+Math.round(b.rb.translation().z/M)+','+Math.round(b.rb.translation().y/M)),rm:__rm.length})")));}
    console.log('rm',JSON.stringify(await ev('__rm')));console.log('views',JSON.stringify(await ev("bodies.filter(b=>!b.dead&&CP137_IDS.includes(b.id)).map(b=>b.id+':'+(b.cp137?CP137_VIEWS[b.cp137.v]:'none'))")),JSON.stringify(await ev("(()=>{let n=0;const f=cp62DrawPrize;cp62DrawPrize=function(k,id,x,y,s,o){if(CP137_VIEWED.includes(id))n++;return f.apply(this,arguments)};draw();cp62DrawPrize=f;return n})()")));}
   if(SC.includes('dbg138')){await ev("pgGo('main')");await sleep(900);console.log('A',JSON.stringify(await ev("({screen:PGU.screen,b:c132Btn(),free:endHomeFree(),on:cp138On()})")));
    const cb=await ev("(()=>{const b=c132Btn();if(!b)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {x:b.x*k+c.left,y:b.y*k+c.top}})()");console.log('pt',JSON.stringify(cb));
    await ev("globalThis.__ol=[];{const f=openLoopScreen;openLoopScreen=function(v){__ol.push(v);return f.apply(this,arguments)}}");if(cb){await tapAt(cb.x,cb.y);await sleep(1000);}
    console.log('B',JSON.stringify(await ev("({ol:__ol,shown:!!(CP138.el&&CP138.el.style.display==='flex'),inv:inventoryOpen,screen:PGU.screen})")));}
   if(SC.includes('exit138')){const R={};const click=async sel=>{const q=await ev(`(()=>{const b=document.querySelector('${sel}');if(!b)return null;const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);if(!q)return false;await tapAt(q.x,q.y);return true;};
    const homeTap=async()=>{await ev("pgGo('main')");await sleep(800);const cb=await ev("(()=>{const b=c132Btn();if(!b)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {x:b.x*k+c.left,y:b.y*k+c.top}})()");
      await ev("globalThis.__ol=[]");await ev("if(!openLoopScreen.__w){const f=openLoopScreen;openLoopScreen=function(v){__ol.push(v);return f.apply(this,arguments)};openLoopScreen.__w=1}");if(cb)await tapAt(cb.x,cb.y);await sleep(900);
      const r=await ev("({ol:__ol.slice(),test:!!(CP138.el&&CP138.el.style.display==='flex'),frames:document.querySelectorAll('iframe').length,menu:(document.getElementById('cp87')||{style:{}}).style.display,open:CP87.open})");await ev("cp138Close();inventoryOpen=false");await sleep(400);return r;};
    for(const way of ['home','puzzles-then-home']){await ev("pgGo('main')");await sleep(600);await ev("cp87OpenMenu()");await sleep(800);
     await click('#cp87 button[data-p=cat-jam]');await sleep(2500);const playing=await ev("CP87.cur");
     if(way==='home')await click('#cp87 [data-a=home]');else{await click('#cp87 [data-a=back]');await sleep(600);await click('#cp87 [data-a=home]');}
     await sleep(800);R[way]={playing,after:await homeTap()};}
    // and PLAY still starts the board
    await ev("pgGo('main')");await sleep(700);const pp=await pt('PGA.L.play');await tapAt(pp.x,pp.y);await sleep(3500);R.play=await ev("({end:END.on,screen:PGU.screen,phase:WILD.phase})");
    res.exit138=res.exit138||{};res.exit138[w+'x'+h]=R;console.log('exit138',w+'x'+h,JSON.stringify(R));}
   if(SC.includes('v138')){const V={};await ev("pgGo('main')");await sleep(900);
    // prize fixes: views never change while falling and settling; the diamond is always the side view; sizes (stills beside the shrimp)
    await ev(`pgGo('main');PGU.boardCat='tuxedo';PG.current='tuxedo';endLoad().coins=500;endStart();`);await sleep(4500);
    await ev("CP135P.MIN=0;WILD.nextBonus=999;CP137.boardDrops=true;for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;");
    await ev("['sapphire_ring','balloon_animal','diamond','crab'].forEach((id,i)=>WILD.incoming.push({kind:'item',id,x:140+i*40,y:500,t:.5,t0:.5,cp137:1}))");
    const seen={};for(let i=0;i<30;i++){await sleep(100);const v=await ev("Object.fromEntries(bodies.filter(b=>!b.dead&&b.cp137&&['sapphire_ring','balloon_animal','diamond','crab'].includes(b.id)).map(b=>[b.id+'#'+b.rb.handle,CP137_VIEWS[b.cp137.v]]))");for(const k in v){(seen[k]=seen[k]||new Set()).add(v[k]);}}
    V.viewsWhileFalling=Object.fromEntries(Object.entries(seen).map(([k,v])=>[k,[...v]]));
    const G=[['shrimp','cheese','daisy','tulip','rose','sunflower'],['cornflower','hydrangea','rainbow','seahorse','owl','hot_water_bottle'],['balloon_animal','sapphire_ring','diamond','cstar','egg','sardine']];
    for(let gi=0;gi<G.length;gi++){await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;");
     await ev(`(${JSON.stringify(G[gi])}).forEach((id,i)=>{const x=95+(i%3)*105,y=560+((i/3)|0)*85;addCoin('item',id,x,COIN_HALF*6,y,yawTurn(0));});`);await sleep(1800);await shot('v138-sizes-'+(gi+1));}
    V.scale=await ev('CP138_SCALE');
    // the no-food Yawn goes for a prize anywhere on the board (a sock in the middle), else plain coins
    const yawnRun=async(setup)=>{await ev("CP135P.MIN=0;WILD.nextBonus=999;CP137.boardDrops=true;for(const b of [...bodies])if(!b.dead&&(b.kind==='item'||!cp71GPlain(b))&&b.kind!=='stack')removeCoin(b);WILD.incoming.length=0;CP71G.stats.gutter=0;CP138Y.stats={prizes:0,special:0,plain:0};"+setup);await sleep(1200);
      await ev("W2_YAWN=null;cp58StartYawn()");await sleep(700);await shot('v138-yawn-'+(setup?'prize':'plain'));await sleep(3200);
      return await ev("({stats:CP138Y.stats,gutter:CP71G.stats.gutter,sock:bodies.filter(b=>!b.dead&&b.id==='sock').length,yawn:!!W2_YAWN})");};
    V.yawnPrize=await yawnRun("addCoin('item','sock',200,COIN_HALF*6,560,yawTurn(0));");V.yawnPlain=await yawnRun("");
    // the on-board pills: Art Real|First and Towers Today|A|C|A+C
    await shot('v138-pills-real');V.pills=await ev("({on:cp138Pills(),rects:CP138A.rects.map(r=>r.k),y:cp138PillRow(),H,front:Math.round(skyScreen(200,T.FRONT,0).y)})");
    const tapK=async k=>{const r=await ev(`(()=>{const r=CP138A.rects.find(r=>r.k==='${k}');return r?{x:r.x+r.w/2,y:r.y+r.h/2}:null})()`);if(!r)return false;const q=await pt(JSON.stringify(r));const n0=await ev('bodies.filter(b=>!b.dead).length+WILD.incoming.length+pendingDrops.length');const c0=await ev('S.coins');await tapAt(q.x,q.y);await sleep(500);return {coins:(await ev('S.coins'))-c0};};
    V.tapFirst=await tapK('first');V.artAfter=await ev('CP138A.mode');await sleep(600);await shot('v138-pills-first');
    V.tapA=await tapK('a');V.towersAfter=await ev('CP93P.get()');V.tapToday=await tapK('today');V.tapReal=await tapK('real');V.back=await ev("[CP138A.mode,CP93P.get()]");

    // Cat Jam: the page text is the file, the menu lists it, it plays
    const file=fs.readFileSync(path.resolve(__dirname,'../cp104-cat-jam/cat-jam-v4.html'),'utf8');V.catjamSame=(await ev("CP87_PAGES['cat-jam']"))===file;V.catjamBytes=Buffer.byteLength(file);
    await ev("cp87OpenMenu()");await sleep(700);V.menu=await ev("[...document.querySelectorAll('#cp87 button[data-p]')].map(b=>b.dataset.p)");await shot('v138-puzzles-menu');
    const cj=await ev("(()=>{const b=document.querySelector('#cp87 button[data-p=cat-jam]');if(!b)return null;b.scrollIntoView({block:'center'});const r=b.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()");
    if(cj){await tapAt(cj.x,cj.y);await sleep(2500);V.catjam=await ev("(()=>{const f=document.querySelector('#cp87 iframe');if(!f)return {frame:false};let d=null;try{d=f.contentDocument}catch(e){};return {frame:true,cur:CP87.cur,canvas:!!(d&&d.querySelector('canvas')),w:f.clientWidth,h:f.clientHeight}})()");await shot('v138-catjam');}
    await ev("try{cp87Stop&&cp87Stop()}catch(e){};try{const m=document.getElementById('cp87');if(m)m.style.display='none'}catch(e){};CP87.open=false");await sleep(500);
    // Collections test: COLLECTIONS opens it; seven pages (a fresh page first: the puzzle frame is gone)
    await reload();await title();await ev("pgGo('main')");await sleep(900);const cb=await ev("(()=>{const b=c132Btn();if(!b)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {x:b.x*k+c.left,y:b.y*k+c.top}})()");
    if(cb){await tapAt(cb.x,cb.y);await sleep(1200);}V.opened=await ev("({on:cp138On(),shown:!!(CP138.el&&CP138.el.style.display==='flex'),inv:inventoryOpen})");
    await ev("cp138Save({placed:{}});for(const n in CP138_IDS){const id=CP138_IDS[n];PG.items[id]=Math.min(pgCap(),Math.max(pgHave(id),1));PG.ever[id]=1;}cp138Ui()");await sleep(800);
    for(const pg of ['Flowers','Kitchen','Playroom','Cozy','Fairground','Jewelry','Water']){await ev(`CP138.page='${pg}';cp138Ui()`);await sleep(900);await shot('v138-coll-'+pg.toLowerCase()+'-empty');}
    const drag=async(name,page)=>{await ev(`CP138.page='${page}';cp138Ui()`);await sleep(500);
      const a=await ev(`(()=>{const d=document.querySelector('#cp138sat [data-n="${name}"]');if(!d)return null;d.scrollIntoView({inline:'center'});const r=d.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
      const b=await ev(`(()=>{const [sx,sy]=cp138Center('${page}','${name}'),r=CP138.cv.getBoundingClientRect(); /* the averaged centre: for a flower, between its blooms */return {x:r.left+sx/368*r.width,y:r.top+sy/492*r.height}})()`);if(!a||!b)return {missing:true};
      await call('Input.dispatchMouseEvent',{type:'mousePressed',x:a.x,y:a.y,button:'left',clickCount:1});for(let i=1;i<=10;i++){await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:a.x+(b.x-a.x)*i/10,y:a.y+(b.y-a.y)*i/10,button:'left',buttons:1});await sleep(25);}
      await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:b.x,y:b.y,button:'left',clickCount:1});return {ok:true};};
    // a miss: dropped on empty sky, it goes back
    await ev("CP138.page='Flowers';cp138Ui()");await sleep(400);{const a=await ev(`(()=>{const d=document.querySelector('#cp138sat [data-n="Rose"]');const r=d.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);const r=await ev("(()=>{const r=CP138.cv.getBoundingClientRect();return {x:r.left+6,y:r.top+6}})()");
     await call('Input.dispatchMouseEvent',{type:'mousePressed',x:a.x,y:a.y,button:'left',clickCount:1});await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:r.x,y:r.y,button:'left',buttons:1});await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:r.x,y:r.y,button:'left',clickCount:1});await sleep(300);
     V.miss=await ev("({placed:[...cp138Placed('Flowers')],rose:pgHave('rose')})");}
    const b0=await ev("pgHave('sunflower')");V.dragFlower=await drag('Sunflower','Flowers');await sleep(350);await shot('v138-place-glow');await sleep(1400);await shot('v138-place-after');
    V.afterFlower=await ev("({placed:[...cp138Placed('Flowers')],bagBefore:"+b0+",bagAfter:pgHave('sunflower')})");
    for(const n of ['Daisy','Cornflower','Hydrangea','Rose'])await ev(`cp138Place('Flowers','${n}')`);await sleep(1600);V.dragLast=await drag('Tulip','Flowers');await sleep(1700);await shot('v138-complete-sweep');await sleep(1500);await shot('v138-complete-after');
    V.complete=await ev("({status:document.getElementById('cp138status').textContent,placed:cp138Placed('Flowers').size})");
    V.dragOwl=await drag('Owl','Cozy');await sleep(1700);V.cozy=await ev("[...cp138Placed('Cozy')]");await shot('v138-cozy-owl');
    V.dragDiamond=await drag('Diamond','Jewelry');await sleep(1700);V.jewelry=await ev("[...cp138Placed('Jewelry')]");await shot('v138-jewelry-diamond');
    V.dragCrab=await drag('Crab','Water');await sleep(1700);V.water=await ev("[...cp138Placed('Water')]");await shot('v138-water-crab');
    // old pages: reached from the test screen, every fillable spot shows, placing a new one takes it from the bag
    await ev("cp138Open()");await sleep(600);await ev("document.querySelector('#cp138 [data-a=old]').click()");await sleep(1200);
    V.old={inv:await ev('inventoryOpen'),screen:await ev('loopScreen'),slots:await ev("collectionGeometry().slots.map(r=>r.id+(r.future?'(scenery)':''))")};await shot('v138-old-water');
    const oldDrag=async id=>{const q=await ev(`(()=>{const g=collectionGeometry(),it=g.items.find(r=>r.id==='${id}'),sl=g.slots.find(r=>r.id==='${id}');if(!it||!sl)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {a:{x:(it.x+it.w/2)*k+c.left,y:(it.y+it.h/2)*k+c.top},b:{x:(sl.x+sl.w/2)*k+c.left,y:(sl.y+sl.h/2)*k+c.top}}})()`);if(!q)return 'not in satchel';
      await call('Input.dispatchMouseEvent',{type:'mousePressed',x:q.a.x,y:q.a.y,button:'left',clickCount:1});for(let i=1;i<=10;i++){await call('Input.dispatchMouseEvent',{type:'mouseMoved',x:q.a.x+(q.b.x-q.a.x)*i/10,y:q.a.y+(q.b.y-q.a.y)*i/10,button:'left',buttons:1});await sleep(25);}
      await call('Input.dispatchMouseEvent',{type:'mouseReleased',x:q.b.x,y:q.b.y,button:'left',clickCount:1});await sleep(500);return 'dragged';};
    await ev("PG.items.crab=Math.max(1,pgHave('crab'));PG.items.hot_dog=Math.max(1,pgHave('hot_dog'));delete placements.crab;delete placements.hot_dog;openLoopScreen('water')");await sleep(800);
    V.old.satchel=await ev("collectionGeometry().items.map(r=>r.id)");const c0=await ev("pgHave('crab')");V.old.placeCrab=await oldDrag('crab');V.old.crab=[c0,await ev("pgHave('crab')"),await ev('!!placements.crab')];await shot('v138-old-water-crab');
    await ev("openLoopScreen('cheese')");await sleep(800);V.old.kitchen=await ev("collectionGeometry().slots.map(r=>r.id+(r.future?'(outline)':''))");V.old.kitchenSatchel=await ev("collectionGeometry().items.map(r=>r.id)");await shot('v138-old-kitchen');
    const h0=await ev("pgHave('hot_dog')");V.old.placeHotdog=await oldDrag('hot_dog');V.old.hotdog=[h0,await ev("pgHave('hot_dog')"),await ev('!!placements.hot_dog')];await shot('v138-old-kitchen-hotdog');
    await ev("inventoryOpen=false;pgGo('main')");await sleep(600);
    await ev("cp138Close()");res.v138=res.v138||{};res.v138[w+'x'+h]=V;console.log('v138',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('prod138')){const V={};await ev("pgGo('main')");await sleep(800);V.on=await ev('cp138On()');V.pills=await ev("(pgGo('main'),endLoad().coins=500,endStart(),0)");await sleep(4500);V.pills=await ev('cp138Pills()');await ev("cp51Pause('button')");await sleep(200);await ev('cp51Home()');await sleep(1500);const cb=await ev("(()=>{const b=c132Btn();if(!b)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {x:b.x*k+c.left,y:b.y*k+c.top}})()");
    if(cb){await tapAt(cb.x,cb.y);await sleep(1200);}V.after=await ev("({test:!!(CP138.el&&CP138.el.style.display==='flex'),inv:inventoryOpen,loop:typeof loopScreen!=='undefined'?loopScreen:null})");await shot('prod138-collections');
    res.prod138=res.prod138||{};res.prod138[w+'x'+h]=V;console.log('prod138',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('dbg139')){await ev(`pgGo('main');PGU.boardCat='ragdoll';PG.current='ragdoll';endLoad().coins=500;endStart();`);await sleep(4500);await ev("CP139BODY.mode='b'");await sleep(500);
    console.log(JSON.stringify(await ev("({on:cp139BodyOn(),mode:CP139BODY.mode,uat:/\bUAT\b/.test(BUILD),won:WILD.on,scr:PGU.screen,inv:inventoryOpen,pgpx:typeof PGPX!=='undefined'?!!PGPX:null,c101:cp101BodyOn(),parts:!!z74ShoulderParts(),rim:!!z74RimPts(),f:CP139BODY.frames,err:CP139BODY.err||null,dm:String(drawMachine).slice(0,80)})")));}
   if(SC.includes('v139')){const V={};await ev(`pgGo('main');PGU.boardCat='tuxedo';PG.current='tuxedo';endLoad().coins=500;endStart();`);await sleep(4500);
    await ev("CP135P.MIN=0;WILD.nextBonus=999;CP137.boardDrops=true");
    V.art=await ev("(()=>{const all=CP137_IDS.map(id=>({id,src:String(CP137.art[id].src||''),ok:!!(CP137.art[id].complete&&CP137.art[id].naturalWidth)}));return {bad:all.filter(a=>!a.ok).map(a=>a.id),first:all.filter(a=>a.src.indexOf('cp138/first/')>=0).map(a=>a.id),views:Object.keys(CP137.views).length,tw:CP137.tw.length,starK:CP137_STAR_K}})()");
    V.missing=await ev("performance.getEntriesByType('resource').filter(e=>e.name.indexOf('img/art/')>=0&&e.responseStatus>=400).map(e=>e.name.split('/').slice(-2).join('/'))");
    const G=[['shrimp','cheese','daisy','tulip','rose','sunflower'],['cornflower','hydrangea','rainbow','seahorse','owl','hot_water_bottle'],['balloon_animal','sapphire_ring','diamond','oyster','accordion','crab']];
    for(let gi=0;gi<G.length;gi++){await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;WILD.nextBonus=999;callouts&&callouts.length&&(callouts.length=0);");
     await ev(`(${JSON.stringify(G[gi])}).forEach((id,i)=>{const x=95+(i%3)*105,y=560+((i/3)|0)*85;addCoin('item',id,x,COIN_HALF*6,y,yawTurn(0));});`);await sleep(2600);await shot('v139-prizes-'+(gi+1));}
    await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);addCoin('item','cstar',200,COIN_HALF*6,600,yawTurn(0));addCoin('item','hot_dog',290,COIN_HALF*6,610,yawTurn(0));");await sleep(1500);
    {const q=await ev("(()=>{const b=bodies.find(b=>!b.dead&&b.id==='cstar');const t=b.rb.translation(),c=skyScreen(t.x/M,t.z/M,0);return {x:c.x,y:c.y}})()");const k2=await ev('scale');
     for(let i=0;i<3;i++){const r=await call('Page.captureScreenshot',{format:'png',clip:{x:q.x*k2-70,y:q.y*k2-90,width:140,height:120,scale:2.75}});fs.writeFileSync(path.join(OUT,`v139-star-zoom${i}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));await sleep(230);}}
    // views: prizes keep the single art while they fall (no view state used)
    await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);['sapphire_ring','balloon_animal','diamond'].forEach((id,i)=>WILD.incoming.push({kind:'item',id,x:150+i*50,y:500,t:.4,t0:.4,cp137:1}))");await sleep(2500);
    V.drawn=await ev("(()=>{const seen=[];const f=cp62DrawPrize;let n=0;const o=WILD_ART;const got={};const g=drawPrize;drawPrize=function(k,id,x,y,s){if(['sapphire_ring','balloon_animal','diamond'].includes(id))got[id]=String(WILD_ART[id].src||'').split('/img/art/')[1];return g.apply(this,arguments)};draw();drawPrize=g;return got})()");
    V.diamondViews=await ev("(()=>{for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);const out=[];for(let i=0;i<8;i++){const b=addCoin('item','diamond',140+(i%4)*40,COIN_HALF*6,540+((i/4)|0)*70,yawTurn(0));out.push(CP137_VIEWS[cp137ViewOf(b).v]);}return out})()");await sleep(1400);await ev('callouts.length=0;floats.length=0;itemToasts.length=0');await sleep(80);await shot('v139-diamonds');
    // paw save: a prize tips over a side; tap it in time; it is batted toward the middle of the pile
    const ps=[];for(let k=0;k<3;k++){await ev("for(const b of [...bodies])if(!b.dead&&b.kind==='item')removeCoin(b);PAW40_STATE.saves=3;PAW40_STATE.teeter=null;PAW40_STATE.swipe=null;paw40ForceTip()");
     let T=null;for(let i=0;i<30&&!T;i++){await sleep(60);T=await ev("PAW40_STATE.teeter&&!PAW40_STATE.teeter.saving?(()=>{const e=paw40Screen(PAW40_STATE.teeter.b),k=scale,c=document.getElementById('c').getBoundingClientRect();return {x:e.x*k+c.left,y:(e.y-14*e.s)*k+c.top,id:PAW40_STATE.teeter.b.id}})():null");}
     if(!T){ps.push({tipped:false});continue;}await tapAt(T.x,T.y);await sleep(380);if(k===0){await ev('callouts.length=0;itemToasts.length=0');await sleep(60);await shot('v139-pawsave-bat');}await sleep(1600);
     ps.push({tipped:true,id:T.id,res:await ev(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${T.id}');if(!b)return {alive:false,saved:PAW40_STATE.saved};const p=b.rb.translation();return {alive:true,x:Math.round(p.x/M),z:Math.round(p.z/M),bats:CP139B.stats.bats,saved:PAW40_STATE.saved}})()`)});}
    V.pawsave=ps;
    // Body B: the pill, then every cat (stills), pill row clear of the build label
    {const r=await ev("(()=>{const r=CP138A.rects.find(r=>r.k==='b');return r?{x:r.x+r.w/2,y:r.y+r.h/2}:null})()");if(r){const q=await pt(JSON.stringify(r));await tapAt(q.x,q.y);await sleep(400);}}
    V.body={mode:await ev('CP139BODY.mode'),row:await ev('cp138PillRow()'),label:await ev('hudLayout().settingsY-10'),cats:{}};
    for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){await ev(`cp97Switch('${cat}')||(PGU.boardCat='${cat}')`);await sleep(900);const f0=await ev('CP139BODY.frames');await sleep(300);V.body.cats[cat]={drawn:(await ev('CP139BODY.frames'))>f0,err:await ev('CP139BODY.err||null')};await shot('v139-body-'+cat);}
    await ev("cp97Switch('tuxedo')");await sleep(300);
    V.again=await ev("(()=>{const cnt=()=>{let n=0;for(let k=0;k<2000;k++)if(W2_WHEEL[w2PickSlice()].kind==='again')n++;return n;};WILD.dances=5;w2ApplySlice(W2_WHEEL.find(x=>x.kind==='again'),{});const setTo=WILD.cp139Again;WILD.dances=6;const after=cnt();WILD.dances=9;const later=cnt();return {setTo,afterAgain:after,later,excluded:CP139A.stats.excluded}})()");
    await shot('v139-pills');V.pills=await ev("({on:cp138Pills(),rects:CP138A.rects.map(r=>r.k)})");
    res.v139=res.v139||{};res.v139[w+'x'+h]=V;console.log('v139',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('touch140')){const V={};await call('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
    const T=async(type,x,y)=>call('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1}]});
    const tdrag=async(a,b,steps=12)=>{await T('touchStart',a.x,a.y);for(let i=1;i<=steps;i++){await T('touchMove',a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps);await sleep(20);}await T('touchEnd',b.x,b.y);await sleep(400);};
    const ttap=async(p)=>{await T('touchStart',p.x,p.y);await sleep(60);await T('touchEnd',p.x,p.y);};
    await ev("pgGo('main');cp138Save({placed:{}});for(const n in CP138_IDS){const id=CP138_IDS[n];PG.items[id]=Math.min(pgCap(),Math.max(pgHave(id),2));}cp138Open();CP138.page='Flowers';cp138Ui()");await sleep(900);
    const chip=async n=>await ev(`(()=>{const d=document.querySelector('#cp138sat [data-n="${n}"]');if(!d)return null;d.scrollIntoView({inline:'center'});const r=d.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`);
    const tgt=async(page,n)=>await ev(`(()=>{const [sx,sy]=cp138Center('${page}','${n}'),r=CP138.cv.getBoundingClientRect();return {x:r.left+sx/368*r.width,y:r.top+sy/492*r.height}})()`);
    // 1 a touch drag from the satchel up onto the outline
    {const a=await chip('Sunflower'),b=await tgt('Flowers','Sunflower');await tdrag(a,b);V.drag=await ev("[...cp138Placed('Flowers')]");await shot('t140-drag');}
    // 2 a sideways swipe on the satchel scrolls it and places nothing
    {const a=await chip('Daisy');const s0=await ev("document.getElementById('cp138sat').scrollLeft");await tdrag(a,{x:a.x-160,y:a.y},10);V.swipe={placed:await ev("[...cp138Placed('Flowers')]"),scroll:[s0,await ev("document.getElementById('cp138sat').scrollLeft")]};}
    // 3 double-tap a satchel item: it flies to its spot and is placed
    {const a=await chip('Rose');await ttap(a);await sleep(120);await ttap(a);await sleep(250);await shot('t140-fly');await sleep(1200);V.dbl=await ev("[...cp138Placed('Flowers')]");await shot('t140-dbl-after');}
    // 4 old pages on touch: drag the crab from the old satchel onto its spot
    await ev("cp138Close();PG.items.crab=Math.max(1,pgHave('crab'));delete placements.crab;CP138.oldPass=true;openLoopScreen('water');CP138.oldPass=false");await sleep(900);
    {const q=await ev("(()=>{const g=collectionGeometry(),it=g.items.find(r=>r.id==='crab'),sl=g.slots.find(r=>r.id==='crab');if(!it||!sl)return null;const k=scale,c=document.getElementById('c').getBoundingClientRect();return {a:{x:(it.x+it.w/2)*k+c.left,y:(it.y+it.h/2)*k+c.top},b:{x:(sl.x+sl.w/2)*k+c.left,y:(sl.y+sl.h/2)*k+c.top}}})()");
     if(q){await tdrag(q.a,q.b);}V.old={placed:await ev('!!placements.crab'),crab:await ev("pgHave('crab')")};await shot('t140-old');}
    await ev("inventoryOpen=false");await call('Emulation.setTouchEmulationEnabled',{enabled:false});
    res.touch140=res.touch140||{};res.touch140[w+'x'+h]=V;console.log('touch140',w+'x'+h,JSON.stringify(V));}
   if(SC.includes('reload')){await reload();res.t3=await title();await tryTaps('reload');}
   await ws.close();}
 }catch(e){res.errors.push('probe '+String(e&&e.stack||e).slice(0,400));ok=false;}
 finally{try{ch.kill();}catch(e){}srv.close();}
 fs.writeFileSync(path.join(OUT,'probe.json'),JSON.stringify(res,null,1));console.log('errors',JSON.stringify(res.errors).slice(0,1500));process.exit(0);
})();
