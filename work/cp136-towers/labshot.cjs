// CP-93 UAT 136: real headless Chrome on the staged runtime folder. Checks the "Tower physics" choice in Engineer tools and at
// the bottom of Goal boards (4 options), then takes stills of each option on its board, at 412x915 and 360x640.
// Usage: node labshot.cjs boot136 [outDir]   -> prints one JSON line; exit 1 if anything is wrong
const http=require('http'),fs=require('fs'),path=require('path'),os=require('os'),{spawn}=require('child_process');
const DIR=path.resolve(process.argv[2]||'boot136'),OUT=path.resolve(process.argv[3]||path.join(__dirname,'../../tickets/CP-93-evidence/uat136'));
fs.mkdirSync(OUT,{recursive:true});const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const MIME={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.wav':'audio/wav','.mp3':'audio/mpeg','.flac':'audio/flac'};
const srv=http.createServer((q,s)=>{const u=decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/,'')||'index.html';const f=path.join(DIR,u);
 if(f.startsWith(DIR)&&fs.existsSync(f)&&fs.statSync(f).isFile()){s.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(s);}else{s.writeHead(404);s.end();}});
(async()=>{await new Promise(r=>srv.listen(0,'127.0.0.1',r));const port=srv.address().port,dbg=9400+Math.floor(Math.random()*400);
 const prof=fs.mkdtempSync(path.join(os.tmpdir(),'cp93p-'));
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
   const r={};
   r.engineer=await ev("(()=>{try{openCredits();}catch(e){return 'open: '+e.message}const b=document.querySelector('#cp93-physics');return b?[...b.querySelectorAll('button')].map(x=>x.textContent):null})()");
   r.dbg=await ev("({eng:!!document.querySelector('#cp70-engineer'),timing:!!document.querySelector('#cp83-timing'),err:typeof CP102!=='undefined'?CP102.panelErr||null:'none',dev:S.dev,inPanel:!!(panel&&panel.querySelector&&panel.querySelector('#cp93-physics'))})");
   await ev("try{closeCredits()}catch(e){};try{panel.style.display='none'}catch(e){}");
   await ev("cp100Open('goals')");await sleep(600);
   r.goals=await ev("[...document.querySelectorAll('#cp100boards [data-tp]')].map(x=>x.textContent)");await shot('goal-boards');
   await ev("document.getElementById('cp100boards').style.display='none'");
   r.modes={};
   for(const [m,board] of [['a','level2'],['today','giant'],['c','giant'],['ac','giant']]){
    await ev(`CP93P.set('${m}')`);
    if(board==='giant')await ev("CP93.seed=7919;labStart('giant')");else await ev("PG.lv.passed=Math.max(PG.lv.passed,1);PG.lv.sel=2;pgPlay('tuxedo');wildReset();wildStartCountdown();");
    await sleep(4500);await shot(`${board}-${m}`);
    r.modes[m]=await ev("({m:CP93P.get(),shelf:!!(typeof CP93!=='undefined'&&CP93.shelf),heavy:bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93==null).some(b=>b.cp93pOn),stacks:bodies.filter(b=>!b.dead&&b.kind==='stack').length})");}
   await ev("CP93P.set('today')");
   res.sizes[w+'x'+h]=r;
   const want=['Today','A: heavy towers, fast spill','C: giant towers on the shelf','A + C'];
   if(!Array.isArray(r.engineer)||r.engineer.map(s=>s.replace(/^✓ /,'')).join('|')!==want.join('|'))ok=false;
   if(!Array.isArray(r.goals)||r.goals.map(s=>s.replace(/^✓ /,'')).join('|')!==want.join('|'))ok=false;
   if(r.modes.today.shelf||!r.modes.c.shelf||!r.modes.ac.shelf||!r.modes.a.heavy)ok=false;
   ws.close();}
 }catch(e){res.errors.push('labshot: '+e.message);ok=false;}finally{ch.kill();srv.close();}
 if(res.errors.length)ok=false;res.passed=ok;fs.writeFileSync(path.join(OUT,'labshot.json'),JSON.stringify(res,null,1));console.log(JSON.stringify(res));process.exit(ok?0:1);})();
