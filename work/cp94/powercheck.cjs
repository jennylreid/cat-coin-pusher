// Real-browser boot + power check (CP-72 add-ons, UAT 94; from CP-63's): headless Chrome, real time, loads work/cp91/powercheck.html?dir=<runtime folder>
// from a local server (REVIEW_PORT or PORT env, default 8795) and reads #result. Usage: node bootcheck.cjs boot82 [boot81 ...]
// -> prints one JSON line per folder; exit 1 unless every folder reaches a round in play with no start error.
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',PORT=9333+Math.floor(Math.random()*500);
const prof=fs.mkdtempSync(path.join(os.tmpdir(),'bootcheck-'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--user-data-dir='+prof,'--remote-debugging-port='+PORT,'about:blank'],{stdio:'ignore'});
 let ok=true;try{let list;for(let i=0;i<40;i++){try{list=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();break;}catch(e){await sleep(250);}}
 for(const dir of process.argv.slice(2)){
  const t=await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  await call('Page.enable');await call('Page.navigate',{url:`http://127.0.0.1:${process.env.REVIEW_PORT||process.env.PORT||8795}/work/cp94/powercheck.html?dir=${dir}&r=${Date.now()}`});
  let res='PENDING';for(let i=0;i<200&&res==='PENDING';i++){await sleep(500);const r=await call('Runtime.evaluate',{expression:"document.getElementById('result')?document.getElementById('result').textContent:'PENDING'"});res=r.result&&r.result.result&&r.result.result.value||'PENDING';}
  console.log(res);let o={};try{o=JSON.parse(res);}catch(e){}if(!(o.title&&o.play&&o.power&&!o.errors.length))ok=false;ws.close();}
 }finally{ch.kill();}process.exitCode=ok?0:1;})();
