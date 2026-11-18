// CP-64 stills (and clip frames) in real headless Chrome, real time, from the full UAT 86 runtime (boot86/, served by the
// review server on 8795). Level 3 round, Developer off; a perfect dance's wheel forced onto JACKPOT, then the cascade.
// Usage: node shots86.cjs [412x915,360x640] [--clip] -> tickets/CP-64-evidence/uat86/*.png (+ clip/ frames)
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',PORT=9333+Math.floor(Math.random()*500);
const OUT=path.resolve(__dirname,'../../tickets/CP-64-evidence/uat86');fs.mkdirSync(OUT,{recursive:true});
const args=process.argv.slice(2),clip=args.includes('--clip'),sizes=(args.find(a=>/x/.test(a))||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
const CLIPDIR=process.env.CLIPDIR||path.join(os.tmpdir(),'cp64clip');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const prof=fs.mkdtempSync(path.join(os.tmpdir(),'shots86-'));
 const ch=spawn(CHROME,['--headless=new','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+prof,'--remote-debugging-port='+PORT,'about:blank'],{stdio:'ignore'});
 const info=[];try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();break;}catch(e){await sleep(250);}}
 for(const [w,h] of sizes){const sz=w+'x'+h;
  const t=await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
  let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
  const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
  const ev=async x=>{const r=await call('Runtime.evaluate',{expression:x,returnByValue:true});if(r.result&&r.result.exceptionDetails)throw new Error(x.slice(0,80)+': '+JSON.stringify(r.result.exceptionDetails).slice(0,300));return r.result&&r.result.result&&r.result.result.value;};
  const shot=async name=>{const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(OUT,name+'-'+sz+'.png'),Buffer.from(r.result.data,'base64'));};
  await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:2,mobile:true});await call('Page.enable');
  await call('Page.navigate',{url:`http://127.0.0.1:8795/work/cp86/boot86/index.html?r=${Date.now()}`});
  for(let i=0;i<120;i++){await sleep(250);try{if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0"))break;}catch(e){}}
  await ev("window.__errs=[];addEventListener('error',e=>__errs.push(String(e.message)));const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)};S.dev=false;S.muted=true;");
  await ev("if(!PG)pgInit();PGU.title.t=9;pgTitleDone();PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");
  for(let i=0;i<80&&!(await ev("WILD.phase==='play'"));i++)await sleep(100);
  // play a little: drops across the board
  for(let i=0;i<24;i++){await ev(`{const cv=document.getElementById('cv'),s=scale,x=(200+100*Math.sin(${i}))*s,y=560*s;cv.dispatchEvent(new PointerEvent('pointerdown',{clientX:x,clientY:y,pointerId:1,bubbles:true}));cv.dispatchEvent(new PointerEvent('pointerup',{clientX:x,clientY:y,pointerId:1,bubbles:true}));}`).catch(()=>{});await sleep(330);}
  await ev("WILD.left=Math.max(WILD.left,45);WILD.happy=0;w2ForceSlice=W2_WHEEL.findIndex(s=>s.kind==='jackpot');w2StartWheelNow();");
  await sleep(1300);await shot('0-wheel-tap-to-spin');await ev("w43StartSpin(WILD.dance,true)");
  for(let i=0;i<100&&!(await ev("!!(WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.result)"));i++)await sleep(100);await sleep(500);await shot('1-wheel-jackpot');
  for(let i=0;i<150&&!(await ev("!!WILD.jp"));i++)await sleep(100);
  const t0=Date.now(),left0=await ev('WILD.left');let n=0,frames=0;const fpsSamples=[];
  const targets=[[1.2,'2-cascade-1s'],[3.5,'3-cascade-3s'],[6,'4-cascade-6s'],[8.2,'5-cascade-8s']];let k=0;
  while(await ev('!!WILD.jp')&&Date.now()-t0<14000){const s=(Date.now()-t0)/1000;
   if(k<targets.length&&s>=targets[k][0]){await shot(targets[k][1]);k++;}
   if(clip&&w===412){fs.mkdirSync(CLIPDIR,{recursive:true});const r=await call('Page.captureScreenshot',{format:'jpeg',quality:70});fs.writeFileSync(path.join(CLIPDIR,String(frames++).padStart(4,'0')+'.jpg'),Buffer.from(r.result.data,'base64'));}
   else await sleep(60);}
  const dur=(Date.now()-t0)/1000;await sleep(900);await shot('6-after');
  const st=JSON.parse(await ev("JSON.stringify({stats:CP64.stats,left:WILD.left,phase:WILD.phase,win:WILD.win,got:WILD.got,pieces:bodies.filter(b=>!b.dead).length,errs:__errs,build:BUILD})"));
  info.push({sz,realSeconds:+dur.toFixed(2),left0,...st,clipFrames:frames});ws.close();}
 }finally{ch.kill();}
 console.log(JSON.stringify(info));fs.writeFileSync(path.join(OUT,'shots.json'),JSON.stringify(info,null,1));})().catch(e=>{console.error(e);process.exit(1)});
