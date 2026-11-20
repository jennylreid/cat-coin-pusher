// OPS-04: real headless Chrome boot of a runtime folder. Serves the folder itself (logs every request and its status),
// records failed requests, console errors and exceptions, clicks PLAY, waits, prints one JSON line.
// Usage: node probe.cjs <runtime folder> [seconds]
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const DIR=path.resolve(process.argv[2]),SECS=+(process.argv[3]||25),CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const served=[],missing=[];
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.flac':'audio/flac','.txt':'text/plain'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';const f=path.join(DIR,u);
 if(f.startsWith(DIR)&&fs.existsSync(f)&&fs.statSync(f).isFile()){served.push(u);s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}
 else{missing.push(u);s.writeHead(404);s.end();}});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9400+Math.floor(Math.random()*400);
 const prof=fs.mkdtempSync(path.join(os.tmpdir(),'ops04-'));
 const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+dbg,'about:blank'],{stdio:'ignore'});
 const out={dir:DIR,errors:[],failed:[]};
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json();break;}catch(e){await sleep(250);}}
  const t=await (await fetch(`http://127.0.0.1:${dbg}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];return;}
   if(d.method==='Runtime.exceptionThrown')out.errors.push('exception: '+(d.params.exceptionDetails.exception?.description||d.params.exceptionDetails.text).slice(0,200));
   if(d.method==='Runtime.consoleAPICalled'&&d.params.type==='error')out.errors.push('console: '+d.params.args.map(a=>a.value??a.description).join(' ').slice(0,200));
   if(d.method==='Log.entryAdded'&&d.params.entry.level==='error')out.errors.push('log: '+d.params.entry.text.slice(0,200)+' '+(d.params.entry.url||''));
   if(d.method==='Network.loadingFailed'&&!d.params.canceled)out.failed.push(d.params.errorText);
   if(d.method==='Network.responseReceived'&&d.params.response.status>=400)out.failed.push(d.params.response.status+' '+d.params.response.url);};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e,awaitPromise:true});return r.result?.result?.value;};
  for(const m of ['Page.enable','Runtime.enable','Log.enable','Network.enable'])await call(m);
  await call('Emulation.setDeviceMetricsOverride',{width:412,height:915,deviceScaleFactor:1,mobile:true});
  await call('Page.navigate',{url:`http://127.0.0.1:${port}/index.html`});await sleep(8000);
  out.title=await ev("document.title");
  out.playClicked=await ev("(()=>{const b=[...document.querySelectorAll('button,[role=button],div,a')].find(e=>/^\s*PLAY\s*$/i.test(e.textContent)&&e.offsetParent);if(b){b.click();return true}return false})()");
  await sleep(SECS*1000);
  const shot=await call('Page.captureScreenshot',{format:'png'});if(shot.result)fs.writeFileSync(path.join(__dirname,'shots',path.basename(DIR)+'.png'),Buffer.from(shot.result.data,'base64'));
  ws.close();}catch(e){out.errors.push('probe: '+e.message);}finally{ch.kill();srv.close();}
 out.served=[...new Set(served)].sort();out.missing=[...new Set(missing)].filter(u=>u!=='favicon.ico');
 console.log(JSON.stringify(out));})();
