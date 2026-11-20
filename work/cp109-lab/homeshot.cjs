// Real-Chrome stills of Home (with the Board lab button) and the lab list, at phone sizes. Usage: node homeshot.cjs bootdir outDir
const {spawn}=require('child_process'),path=require('path'),os=require('os'),fs=require('fs');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe',PORT=9500+Math.floor(Math.random()*400);
const [,,dir='bootdev',out='../../tickets/CP-83-evidence/uat109']=process.argv;fs.mkdirSync(out,{recursive:true});
const prof=fs.mkdtempSync(path.join(os.tmpdir(),'homeshot-'));const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const ch=spawn(CHROME,['--headless=new','--disable-gpu','--no-first-run','--user-data-dir='+prof,'--remote-debugging-port='+PORT,'about:blank'],{stdio:'ignore'});
 try{for(let i=0;i<40;i++){try{await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();break;}catch(e){await sleep(250);}}
  for(const [w,h] of [[412,915],[360,640]]){const t=await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`,{method:'PUT'})).json();const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
   let id=0;const pend={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id&&pend[d.id]){pend[d.id](d);delete pend[d.id];}};
   const call=(method,params={})=>new Promise(r=>{const i=++id;pend[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
   const ev=async e=>{const r=await call('Runtime.evaluate',{expression:e,returnByValue:true});return r.result&&r.result.result&&r.result.result.value;};
   const shot=async n=>{const r=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,`${n}-${w}x${h}.png`),Buffer.from(r.result.data,'base64'));};
   await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:2,mobile:true});
   await call('Page.navigate',{url:`http://127.0.0.1:${process.env.REVIEW_PORT||8797}/work/cp109-lab/${dir}/index.html?r=${Date.now()}`});
   for(let i=0;i<60;i++){await sleep(250);if(await ev("typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0").catch(()=>false))break;}
   await ev("if(!PG)pgInit();PGU.title.t=9;pgTitleDone();S.dev=true;S.muted=true;PGU.screen='main';");await sleep(1200);await shot('home');
   await ev("(()=>{const b=labhBtn();pgMainTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");await sleep(600);await shot('lab-list');ws.close();}
 }finally{ch.kill();}console.log('ok');})().catch(e=>{console.error(e);process.exit(1);});
