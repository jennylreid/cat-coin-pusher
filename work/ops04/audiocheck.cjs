// OPS-04: the Dance break drums FLAC in real headless Chrome vs the published WAV. Serves work/ (both runtime folders).
// Checks: Web Audio decode sample-identical; <audio> duration equal; playback clock (currentTime vs wall clock) equal rate;
// played from 3 s before the end, 'ended' fires at the same time. Usage: node audiocheck.cjs <wav path under work/> <flac path under work/> [out.json]
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const ROOT=path.resolve(__dirname,'..'),[WAV,FLAC,OUT]=process.argv.slice(2),CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const srv=http.createServer((q,s)=>{const f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(!f.startsWith(ROOT)||!fs.existsSync(f)){s.writeHead(404);return s.end();}
 const t={'.wav':'audio/wav','.flac':'audio/flac','.html':'text/html'}[path.extname(f)]||'application/octet-stream',st=fs.statSync(f),rg=q.headers.range;
 if(rg){const [a,b]=rg.replace('bytes=','').split('-');const A=+a,Bb=b?+b:st.size-1;s.writeHead(206,{'Content-Type':t,'Accept-Ranges':'bytes','Content-Range':`bytes ${A}-${Bb}/${st.size}`,'Content-Length':Bb-A+1});fs.createReadStream(f,{start:A,end:Bb}).pipe(s);}
 else{s.writeHead(200,{'Content-Type':t,'Accept-Ranges':'bytes','Content-Length':st.size});fs.createReadStream(f).pipe(s);}});
const PAGE=`(async()=>{const W='/${WAV}',F='/${FLAC}',r={};
 const ac=new OfflineAudioContext(2,44100,44100);const dec=async u=>ac.decodeAudioData(await (await fetch(u)).arrayBuffer());
 const a=await dec(W),b=await dec(F);r.decode={wav:{ch:a.numberOfChannels,len:a.length,rate:a.sampleRate},flac:{ch:b.numberOfChannels,len:b.length,rate:b.sampleRate}};
 let same=a.length===b.length&&a.numberOfChannels===b.numberOfChannels,maxd=0;for(let c=0;c<a.numberOfChannels&&same;c++){const x=a.getChannelData(c),y=b.getChannelData(c);for(let i=0;i<x.length;i++){const d=Math.abs(x[i]-y[i]);if(d>maxd)maxd=d;}}
 r.decode.identical=same&&maxd===0;r.decode.maxDiff=maxd;
 const el=u=>new Promise((ok,no)=>{const e=new Audio(u);e.preload='auto';e.oncanplaythrough=()=>ok(e);e.onerror=()=>no(new Error('audio error '+u));e.load();});
 const ew=await el(W),ef=await el(F);r.duration={wav:ew.duration,flac:ef.duration};
 const clock=async e=>{e.currentTime=0;await e.play();await new Promise(z=>setTimeout(z,300));const t0=performance.now(),c0=e.currentTime;await new Promise(z=>setTimeout(z,3000));const rate=(e.currentTime-c0)/((performance.now()-t0)/1000);e.pause();return rate;};
 r.rate={wav:await clock(ew),flac:await clock(ef)};
 const end=async e=>{e.currentTime=e.duration-3;await new Promise(z=>e.onseeked=z);const t0=performance.now();await e.play();await new Promise(z=>e.onended=z);return (performance.now()-t0)/1000;};
 r.endsAfter={wav:await end(ew),flac:await end(ef)};
 r.passed=r.decode.identical&&Math.abs(r.duration.wav-r.duration.flac)<0.001&&Math.abs(r.rate.wav-r.rate.flac)<0.02&&Math.abs(r.endsAfter.wav-r.endsAfter.flac)<0.15;
 return JSON.stringify(r);})()`;
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9800+Math.floor(Math.random()*150),prof=fs.mkdtempSync(path.join(os.tmpdir(),'ops04a-'));
 const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+dbg,'about:blank'],{stdio:'ignore'});let res;
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${dbg}/json/list`)).json();break;}catch(e){await sleep(250);}}
  const t=await (await fetch(`http://127.0.0.1:${dbg}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  await call('Page.enable');await call('Page.navigate',{url:`http://127.0.0.1:${port}/ops04/release.html#blank`});await sleep(1500);
  const r=await call('Runtime.evaluate',{expression:PAGE,awaitPromise:true});res=r.result?.result?.value||JSON.stringify({passed:false,error:JSON.stringify(r.result?.exceptionDetails||r).slice(0,400)});ws.close();
 }finally{ch.kill();srv.close();}
 const o={wav:WAV,flac:FLAC,...JSON.parse(res)};console.log(JSON.stringify(o));if(OUT)fs.writeFileSync(OUT,JSON.stringify(o,null,1));process.exitCode=o.passed?0:1;})();
