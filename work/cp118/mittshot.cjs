// CP-86: runs meowshot.html in headless Chrome (412x915 at device scale 2) from a local server (REVIEW_PORT), saving
// <OUT>/real-<name>-412x915.png when the page asks. Usage: OUT=<dir> REVIEW_PORT=8797 node meowshot.cjs <work-relative boot dir>
const VW=+(process.env.VW||412),VH=+(process.env.VH||915);
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',PORT=9333+Math.floor(Math.random()*500),OUT=path.resolve(process.env.OUT||path.join(__dirname,'out'));fs.mkdirSync(OUT,{recursive:true});
const prof=fs.mkdtempSync(path.join(os.tmpdir(),'meowshot-'));const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+PORT,'about:blank'],{stdio:'ignore'});
 let ok=false;try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();break;}catch(e){await sleep(250);}}
  const t=await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e});return r.result&&r.result.result&&r.result.result.value;};
  await call('Emulation.setDeviceMetricsOverride',{width:VW,height:VH+300,deviceScaleFactor:2,mobile:true});await call('Page.enable');
  await call('Page.navigate',{url:`http://127.0.0.1:${process.env.REVIEW_PORT||8797}/work/cp118/mittshot.html?dir=${process.env.DIR}&pick=${process.env.PICK||""}&w=${VW}&h=${VH}&at=${process.env.AT||""}&yawn=${process.env.YAWN||""}&panel=${process.env.PANEL||""}&dance=${process.env.DANCE||""}&alpha=${process.env.ALPHA||""}&r=${Date.now()}`});
  let res='PENDING';for(let i=0;i<400&&res==='PENDING';i++){await sleep(200);const s=await ev('window.__shot');
   if(s){const r=await call('Page.captureScreenshot',{format:'png',clip:{x:0,y:0,width:VW,height:VH,scale:1}});fs.writeFileSync(path.join(OUT,`${s}-${VW}x${VH}.png`),Buffer.from(r.result.data,'base64'));await ev('window.__shot=null');}
   res=await ev("document.getElementById('result').textContent")||'PENDING';}
  console.log(res);try{ok=!JSON.parse(res).errors.length;}catch(e){}ws.close();}finally{ch.kill();}process.exitCode=ok?0:1;})();
