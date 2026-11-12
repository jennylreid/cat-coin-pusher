// UAT 40 checks: the dance-break freeze fix (desktop, real runtime, sound ON through a fake Web Audio that is as strict as
// Chromium about connect() targets and parameter values). Writes tickets/CP-38-evidence/uat40/checks.json.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat40');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp39/release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
function strictAudio(g){const st={created:0,started:[]};const now=()=>g.ms()/1000-100;const fin=(...a)=>{for(const x of a)if(!Number.isFinite(x))throw new TypeError('non-finite audio value '+x);};
 const P=()=>({__param:true,_v:0,get value(){return this._v;},set value(x){fin(x);this._v=x;},setValueAtTime(v,t){fin(v,t);if(t<0)throw new RangeError('time');},linearRampToValueAtTime(v,t){fin(v,t);},exponentialRampToValueAtTime(v,t){fin(v,t);if(!(v>0)&&!(v<0))throw new RangeError('exp ramp to '+v);},cancelScheduledValues(t){fin(t);}});
 const node=()=>{st.created++;const n={__node:true,connect(d){if(!d||!(d.__node||d.__param||d.__dest))throw new TypeError("Failed to execute 'connect' on 'AudioNode': Overload resolution failed.");return d;},disconnect(){},start(t){if(t!==undefined)fin(t);n.t0=t??now();st.started.push(n);},stop(t){if(t!==undefined)fin(t);n.t1=t??now();},frequency:P(),gain:P(),Q:P(),detune:P(),type:'',buffer:null,loop:false,curve:null};return n;};
 g.c.AudioContext=class{constructor(){this.sampleRate=8000;this.state='running';this.destination={__dest:true};}get currentTime(){return now();}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createWaveShaper(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(4000)};}resume(){}};
 st.live=()=>{st.started=st.started.filter(n=>!(n.t1<=now()));return st.started.length;};return st;}
// one frame as the game runs it: physics, update and draw, with exceptions caught and recorded (the real frame() would stop)
function frames(g,n,errs){for(let i=0;i<n;i++){try{g.tick();if((g.nd=(g.nd||0)+1)%20===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
async function breakRun(src,v2,{perfect=true,slice=null,win=false}={}){
 const g=await game({src,seed:7,render:true});const st=strictAudio(g),errs=[];g.run('S.muted=false');g.run(v2?'wild2Enter()':'wildEnter()');g.c.__game.wildStartCountdown();frames(g,200,errs);g.run('WILD.left=170;S.coins=300');
 if(win){g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}}board.status='playing';wildFinish(true)");frames(g,60*5,errs);
  const r={errs,visitor:!!g.run('WILD.visitor'),liveNodes:st.live()};g.close();return r;}
 if(slice!=null)g.run('w2ForceSlice='+slice);g.run('danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k<300){if(!frames(g,1,errs))break;k++;}
 if(!g.run('!!WILD.dance')){g.close();return {errs:errs.concat('no dance')};}
 const n=g.run('WILD.dance.n');for(let b=0;b<n&&!errs.length;b++){if(!perfect&&b%5===3)continue;const target=g.run(`WILD.dance.p0+${b}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target-1/120&&frames(g,1,errs));g.tap();}
 k=0;while(g.run('!!WILD.dance')&&k<60*25&&frames(g,1,errs))k++;const t0=g.run('time');frames(g,60,errs);
 const r={errs,ended:!g.run('WILD.dance'),gameRunning:g.run('time')>t0,stage:g.run('WILD.dance&&WILD.dance.stage'),liveNodes:st.live(),nodesCreated:st.created};g.close();return r;}
(async()=>{
 // 1. Play is unchanged: Boards 1-3 identical to UAT 39 (sound off, as in all earlier comparisons).
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to UAT 39 after 25 s of play',a===b);}
 // 2. The freeze: UAT 39 (control) still throws at the end of a Wild 2 dance break with sound on; UAT 40 doesn't.
 {const r=await breakRun(OLD,true,{perfect:false});check('control: UAT 39 still throws at the end of a Wild 2 dance break (sound on) — the freeze',r.errs.some(e=>/connect/.test(e)),r.errs.slice(0,1));}
 for(const [label,v2,o] of [['Wild 2, imperfect',true,{perfect:false}],['Wild 2, perfect: +10',true,{slice:0}],['Wild 2, perfect: +15',true,{slice:1}],['Wild 2, perfect: RAIN 25',true,{slice:2}],
   ['Wild 2, perfect: QUAKE',true,{slice:4}],['Wild 2, perfect: +20',true,{slice:5}],['Wild 2, perfect: PRIZE',true,{slice:6}],['Wild 2, perfect: YAWN',true,{slice:7}],['Wild, perfect',false,{}],['Wild, imperfect',false,{perfect:false}]]){
  const r=await breakRun(NEW,v2,o);check('UAT 40, sound on: '+label+' — the break ends, no exception, the game keeps running',!r.errs.length&&r.ended&&r.gameRunning,r);}
 {const r=await breakRun(NEW,true,{win:true});check('UAT 40, sound on: Wild 2 win — visitor card and its sound, no exception',!r.errs.length&&r.visitor,r);}
 {const r=await breakRun(OLD,true,{win:true});check('control: UAT 39 throws on the Wild 2 visitor sound',r.errs.some(e=>/connect/.test(e)),r.errs.slice(0,1));}
 // 3. The frame-loop guard: an exception in a frame is logged and the next frame runs.
 {const g=await game({src:NEW,seed:3,render:true});let raf=0;g.c.requestAnimationFrame=()=>{raf++;};g.run("window.__u=update;update=function(dt){update=window.__u;throw new Error('test exception')}");
  let threw=false;try{g.run('frame(performance.now())');}catch(e){threw=true;}
  const ev=JSON.parse(g.run("JSON.stringify(diagSession.events.slice(-3))"));
  check('frame guard: a throwing frame does not escape, asks for the next frame and logs an error event',!threw&&raf>=1&&g.run('frameErrors')===1&&ev.some(e=>e[1]==='error'&&/test exception/.test(e[2])),{raf,ev});
  g.run('frame(performance.now()+16)');check('…and the next frame runs normally',g.run('frameErrors')===1);g.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
