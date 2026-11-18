// CP-78 Yawn clip with sound (from CP-72's work/cp72-zoomies/record.cjs): headless Chrome plays the real game runtime
// (real time, real WebAudio) at 412x915 and records the game canvas plus everything the game sends to the speakers
// (MediaRecorder, webm). Round on Level <lv> with <cat>; the wheel's Yawn (cp58StartYawn) starts 1.2 s into the recording.
// Usage: node work/cp78-board/record.cjs <runtime folder> <out.webm> [lv] [cat] [seconds]   (server: PORT env, default 8878)
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',DBG=9400+Math.floor(Math.random()*400);
const [,,rt,outFile,lv='9',cat='tuxedo',secs='7.5']=process.argv,port=process.env.PORT||8878;const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp78rec-'));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
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
  await call('Page.navigate',{url:`http://127.0.0.1:${port}/work/cp78-board/${rt}/index.html`});
  for(let i=0;i<150;i++){await sleep(200);if(await ev("typeof PGU!=='undefined'&&typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0").catch(()=>false))break;}
  await ev(`window.Android={checkUpdates(){}};if(!PG)pgInit();PGU.title.t=9;pgTitleDone();PG.lv.passed=10;PG.lv.sel=${lv};PGU.boardCat='${cat}';wildReset();PGU.screen='board';pgStartRound();`);
  for(let i=0;i<90;i++){await sleep(100);if(await ev("WILD.phase==='play'"))break;}
  await ev(`PGU.boardCat='${cat}';WILD.left=99;WILD.nextBonus=999;try{S.muted=false;}catch(e){}`);await sleep(1500);
  const info=await ev(`new Promise(res=>{const cv=document.getElementById('c');const vs=cv.captureStream(30);const tr=[...vs.getVideoTracks()];
   if(window.__recAudio)tr.push(...window.__recAudio.stream.getAudioTracks());const st=new MediaStream(tr);
   const rec=new MediaRecorder(st,{mimeType:'video/webm;codecs=vp8,opus',videoBitsPerSecond:6e6});const parts=[];rec.ondataavailable=e=>parts.push(e.data);
   window.__stop=()=>new Promise(r=>{rec.onstop=async()=>{const b=new Blob(parts,{type:'video/webm'});const u8=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));r(btoa(s));};rec.stop();});
   rec.start(500);res({w:cv.width,h:cv.height,audio:!!window.__recAudio,state:window.__recAudio?window.__recAudio.context.state:null});})`);
  console.log('recording',JSON.stringify(info));
  await sleep(1200);await ev("WILD.left=99;WILD.nextBonus=999;cp58StartYawn();");
  const t0=Date.now();while(Date.now()-t0<(+secs)*1000-1200)await sleep(250);
  const b64=await ev('window.__stop()');fs.writeFileSync(outFile,Buffer.from(b64,'base64'));
  console.log(JSON.stringify({out:outFile,bytes:fs.statSync(outFile).size,build:await ev('BUILD')}));ws.close();
 }finally{ch.kill();}})().catch(e=>{console.error(e);process.exit(1);});
