const {game}=require('./harness.cjs'),path=require('path');
const SRC=path.resolve(process.argv[2]||'preview.html');
// a player who taps late by `late` s with gaussian-ish jitter `sd`; taps along with the count-in too
function rnd(seed){let s=seed>>>0;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
async function run(auto,late,sd,breaks=2){const g=await game({src:SRC,seed:5});const r=rnd(42),out=[];
 g.run('S.dev=true;DANCE.auto='+auto+';wild2Enter();wildStartCountdown()');g.ticks(200);
 for(let b=0;b<breaks;b++){g.run('WILD.left=170;danceStartNow()');g.until('!!WILD.dance',300);const D0=g.run('JSON.stringify({p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n})'),D=JSON.parse(D0);
  for(let k=-3;k<D.n;k++){const j=(r()+r()+r()-1.5)*sd*2,at=D.p0+k*D.beat+late+j;while(g.ms()/1000<at-1/120)g.tick();g.tap();}
  g.until("WILD.dance&&WILD.dance.phase==='finale'",600);const hits=g.run('WILD.dance.hits');g.until('!WILD.dance',1800);
  const ev=JSON.parse(g.run("JSON.stringify(diagSession.events.filter(e=>e[1]==='dance-taps').slice(-1)[0]||null)"));out.push({hits,taps:ev&&JSON.parse(ev[2])});}
 const learned=g.run('DANCE_LEARNED');g.close();return {out,learned};}
(async()=>{
 for(const [late,sd] of [[.12,.04],[.05,.03],[.2,.05]]){
  const off=await run(0,late,sd),on=await run(1,late,sd);
  console.log(`late ${late*1000} ms sd ${sd*1000}: auto off hits ${off.out.map(o=>o.hits).join(',')} | auto on hits ${on.out.map(o=>o.hits).join(',')} learned ${Math.round(on.learned*1000)} ms`);
  if(late===.12){const t=on.out[0].taps;console.log(' dance-taps event:',JSON.stringify({...t,log:t.log.slice(0,5)}).slice(0,420));}}
 // send log feedback with a fake app bridge
 const g=await game({src:SRC,seed:3});const els={};const el=id=>els[id]||(els[id]={id,textContent:'',style:{},disabled:false});
 g.run("panel.querySelector=s=>window.__el(s.replace('#',''));");g.c.__el=el;
 g.run("window.Android={st:{connected:true,durable:true,state:'Log file linked',savedAt:0},getDiagnosticStatus(){return JSON.stringify(this.st)},savePerformanceLog(t){const a=this;window.__saved=(window.__saved||0)+1;},connectDiagnosticFile(){},sharePerformanceLog(){}};");
 g.run('diagSendFile()');const b1=el('diag-send-file').textContent;
 g.run("Android.st={...Android.st,state:'Saved to log file; OneDrive sync may take a moment',savedAt:Date.now()};onDiagnosticStatus(Android.st)");const b2=el('diag-send-file').textContent;
 g.run('diagSendFile()');g.run("onDiagnosticStatus({connected:true,state:'Could not save the log file; reconnect or try Share log',savedAt:0})");const b3=el('diag-send-file').textContent;
 console.log('send log:',JSON.stringify({tapped:b1,afterSave:b2,afterError:b3,saveCalls:g.run('window.__saved||0')}));g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
