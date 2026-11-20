// CP-93 UAT 122: real headless Chrome on the staged runtime folder. Home -> Board lab list (must show "CP-93" / "Giant towers"),
// then plays the giant board from the list and takes a start still 2.5 s in. Stills at 412x915 and 360x640.
// Usage: node labshot.cjs boot122 [outDir]   -> prints one JSON line; exit 1 if the list or the board is wrong
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const DIR=path.resolve(process.argv[2]||'boot122'),OUT=path.resolve(process.argv[3]||path.join(__dirname,'../../tickets/CP-93-evidence/uat122'));
fs.mkdirSync(OUT,{recursive:true});const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.flac':'audio/flac'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';const f=path.join(DIR,u);
 if(f.startsWith(DIR)&&fs.existsSync(f)&&fs.statSync(f).isFile()){s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}else{s.writeHead(404);s.end();}});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9400+Math.floor(Math.random()*400);
 const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp93-'));
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
   await ev("if(!PG)pgInit();PGU.title.t=9;pgTitleDone();S.dev=true;S.muted=true;PGU.screen='main';");await sleep(1200);
   await ev("labhOpen()");await sleep(700);await shot('lab-list');
   const list=await ev("(()=>{const t=(LABH.body&&LABH.body.innerText)||document.body.innerText;return {cp93:/CP-93/.test(t),giant:/Giant towers/.test(t),build:BUILD}})()");
   await ev("labhPlay('giant')");await sleep(2500);await shot('start-t2.5s');
   const board=await ev("({deck:[PUSH_MIN,PUSH_MAX],tops:bodies.filter(b=>b.cp93Top!==undefined).length,segs:bodies.filter(b=>b.cp93!==undefined).length,goal:(LAB.B.giant.lab||{}).text})");
   res.sizes[w+'x'+h]={list,board};
   if(!list||!list.cp93||!list.giant||!board||board.deck[0]!==350||board.deck[1]!==420||board.tops!==3)ok=false;
   ws.close();}
 }catch(e){res.errors.push('labshot: '+e.message);ok=false;}finally{ch.kill();srv.close();}
 if(res.errors.length)ok=false;res.passed=ok;fs.writeFileSync(path.join(OUT,'labshot.json'),JSON.stringify(res,null,1));console.log(JSON.stringify(res));process.exit(ok?0:1);})();
