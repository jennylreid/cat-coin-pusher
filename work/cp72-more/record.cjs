// CP-72 video with sound: headless Chrome plays the prototype page (real time, real WebAudio) at 412x915 and records the
// game canvas plus everything the game sends to the speakers (MediaRecorder, webm). The power is played through the real
// button after the round starts. Usage: node record.cjs page.html?query outFile.webm seconds [port]
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',DBG=9400+Math.floor(Math.random()*400);
const [,,page,outFile,secs='14',port='8797']=process.argv;const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp72rec-'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// every AudioContext also feeds a recording stream (the game's master gain goes to ctx.destination)
const HOOK=`(()=>{const AC=window.AudioContext;if(!AC)return;const con=AudioNode.prototype.connect;
 AudioNode.prototype.connect=function(d,...a){const r=con.call(this,d,...a);try{if(d===this.context.destination){const c=this.context;if(!c.__rec){c.__rec=c.createMediaStreamDestination();window.__recAudio=c.__rec;}con.call(this,c.__rec);}}catch(e){}return r;};})();`;
(async()=>{const ch=spawn(CHROME,['--headless=new','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+DBG,'--window-size=412,915','about:blank'],{stdio:'ignore'});
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${DBG}/json/list`)).json();break;}catch(e){await sleep(250);}}
  const t=await (await fetch(`http://127.0.0.1:${DBG}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e,awaitPromise:true,returnByValue:true});if(r.result&&r.result.exceptionDetails)throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0,400));return r.result&&r.result.result&&r.result.result.value;};
  await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:412,height:915,deviceScaleFactor:1,mobile:true});
  await call('Page.addScriptToEvaluateOnNewDocument',{source:HOOK});
  await call('Page.navigate',{url:`http://127.0.0.1:${port}/work/cp72-more/game/${page}`});
  // wait for the round to be in play, then start recording (the page's own &auto=1 plays the power after &at= seconds)
  for(let i=0;i<240;i++){await sleep(250);const p=await ev("typeof WILD!=='undefined'&&WILD.phase").catch(()=>null);if(p==='play')break;}
  await ev("(()=>{try{S.muted=false;S.dev=false;}catch(e){}})()");
  const info=await ev(`new Promise(res=>{const cv=document.getElementById('c');const vs=cv.captureStream(30);const tr=[...vs.getVideoTracks()];
   if(window.__recAudio)tr.push(...window.__recAudio.stream.getAudioTracks());const st=new MediaStream(tr);
   const rec=new MediaRecorder(st,{mimeType:'video/webm;codecs=vp8,opus',videoBitsPerSecond:6e6});const parts=[];rec.ondataavailable=e=>parts.push(e.data);
   window.__stop=()=>new Promise(r=>{rec.onstop=async()=>{const b=new Blob(parts,{type:'video/webm'});const u8=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));r(btoa(s));};rec.stop();});
   rec.start(500);res({w:cv.width,h:cv.height,audio:!!window.__recAudio,state:window.__recAudio?window.__recAudio.context.state:null});})`);
  console.log('recording',JSON.stringify(info));
  const t0=Date.now();const fps=[];const marks={};let last=-1;while(Date.now()-t0<(+secs)*1000){await sleep(100);
   const st=await ev("(()=>{const X=Z72X,k=X&&X.kits[0];return X?(k&&k.P?k.P.seg:'run')+'|'+X.t.toFixed(2):(PGPX?PGPX.id:'-');})()").catch(()=>'?');
   const key=String(st).split('|')[0];if(!(key in marks))marks[key]=+((Date.now()-t0)/1000).toFixed(2);if(Date.now()-t0-last>=1000){last=Date.now()-t0;fps.push(st);}}
  console.log('marks',JSON.stringify(marks));
  const b64=await ev('window.__stop()');fs.writeFileSync(outFile,Buffer.from(b64,'base64'));
  console.log(JSON.stringify({out:outFile,bytes:fs.statSync(outFile).size,trace:fps,stats:await ev("JSON.stringify(typeof Z72!=='undefined'?Z72.stats:null)")}));ws.close();
 }finally{ch.kill();}})().catch(e=>{console.error(e);process.exit(1);});
