// UAT 41 checks (real runtime, desktop): Wild 2 goal card, music mix, pusher rhythm and Turbo. Writes
// tickets/CP-38-evidence/uat41/checks.json, levels.json and frames. Usage: node checks41.cjs <baseline release.html>
const {game,tapAtBeat}=require('./harness.cjs'),{makeContext,stats,SR}=require('./audio-render.cjs'),{measure,mp3}=require('./levels.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat41');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,process.argv[3]||'release.html'),OLD=path.resolve(process.argv[2]);
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
function strictAudio(g){const st={created:0,started:[]};const now=()=>g.ms()/1000-100;const fin=(...a)=>{for(const x of a)if(!Number.isFinite(x))throw new TypeError('non-finite audio value '+x);};
 const P=()=>({__param:true,_v:0,get value(){return this._v;},set value(x){fin(x);this._v=x;},setValueAtTime(v,t){fin(v,t);if(t<0)throw new RangeError('time');},linearRampToValueAtTime(v,t){fin(v,t);},exponentialRampToValueAtTime(v,t){fin(v,t);if(!(v>0)&&!(v<0))throw new RangeError('exp ramp to '+v);},cancelScheduledValues(t){fin(t);}});
 const node=()=>{st.created++;const n={__node:true,connect(d){if(!d||!(d.__node||d.__param||d.__dest))throw new TypeError("Failed to execute 'connect' on 'AudioNode': Overload resolution failed.");return d;},disconnect(){},start(t){if(t!==undefined)fin(t);n.t0=t??now();st.started.push(n);},stop(t){if(t!==undefined)fin(t);n.t1=t??now();},frequency:P(),gain:P(),Q:P(),detune:P(),type:'',buffer:null,loop:false,curve:null};return n;};
 g.c.AudioContext=class{constructor(){this.sampleRate=8000;this.state='running';this.destination={__dest:true};}get currentTime(){return now();}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createWaveShaper(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(4000)};}resume(){}};
 st.live=()=>{st.started=st.started.filter(n=>!(n.t1<=now()));return st.started.length;};return st;}
// one frame as the game runs it: physics, update and draw, with exceptions caught and recorded (the real frame() would stop)
function frames(g,n,errs){for(let i=0;i<n;i++){try{g.tick();if((g.nd=(g.nd||0)+1)%20===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
async function breakRun(src,v2,{perfect=true,slice=null,win=false}={}){
 const g=await game({src,seed:7,render:true});const st=strictAudio(g),errs=[];g.run('S.muted=false');g.run(v2?'wild2Enter()':'wildEnter()');g.c.__game.wildStartCountdown();frames(g,200,errs);g.run('WILD.left=170;S.coins=300');
 if(win){g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}}board.status='playing';wildFinish(true)");frames(g,60*5,errs);
  const r={errs,visitor:!!g.run('WILD.visitor'),liveNodes:st.live()};g.close();return r;}
 if(slice!=null)g.run('w2ForceSlice='+slice);g.run('danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k<300){if(!frames(g,1,errs))break;k++;}
 if(!g.run('!!WILD.dance')){g.close();return {errs:errs.concat('no dance')};}
 const n=g.run('WILD.dance.n');for(let b=0;b<n&&!errs.length;b++){if(!perfect&&b%5===3)continue;const target=g.run(`WILD.dance.p0+${b}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target-1/120&&frames(g,1,errs));g.tap();}
 k=0;while(g.run('!!WILD.dance')&&k<60*25&&frames(g,1,errs))k++;const t0=g.run('time');frames(g,60,errs);
 const r={errs,ended:!g.run('WILD.dance'),gameRunning:g.run('time')>t0,stage:g.run('WILD.dance&&WILD.dance.stage'),liveNodes:st.live(),nodesCreated:st.created};g.close();return r;}
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
async function wildTrace(src,seed,v2){const g=await game({src,seed});const a=g.c.__game;g.run(v2?'wild2Enter()':'wildEnter()');a.wildStartCountdown();g.ticks(200);
 let t=0,last=-9;while(t<40){if(t-last>=.25){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({left:+WILD.left.toFixed(3),coins:S.coins,got:WILD.got,rained:WILD.rained,turbo:WILD.turboDone,b:"+bodiesJSON+"})");g.close();return r;}
(async()=>{
 // 1. Nothing else changes in play: Boards 1-3, Wild and Wild 2 (40 s with Turbo) identical to UAT 40.
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to UAT 40 after 25 s of play',a===b);}
 for(const v2 of [false,true]){const a=await wildTrace(OLD,6,v2),b=await wildTrace(NEW,6,v2);check((v2?'Wild 2':'Wild')+' round (40 s, through Turbo) identical to UAT 40 once started',a===b);}
 // 2. The Wild 2 goal card.
 for(const h of [888.889,720]){const g=await game({src:NEW,render:true,height:h,seed:4});g.ticks(30);const b=g.run('wild2Button()');g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(30);shot(g,'wild2-goal-card'+(h<800?'-720':''));
  const L=g.run('JSON.stringify(w2CardLayout())'),Lo=JSON.parse(L);
  check('card fits the screen (H '+Math.round(h)+'): goal, 6 icon lines, TAP TO START and Back inside the card',Lo.card.y>=0&&Lo.card.y+Lo.card.h<=h&&Lo.back.y+Lo.back.h<=Lo.card.y+Lo.card.h&&Lo.start.y>=Lo.linesY+6*Lo.row&&Lo.row>=38,Lo);
  const left=g.run('WILD.left');g.ticks(180);check('the timer does not run while the card is up (H '+Math.round(h)+')',g.run("WILD.phase==='card'")&&g.run('WILD.left')===left);
  if(h>800){g.tap(200,Lo.linesY+Lo.row*2);check('a tap anywhere on the card starts the 3-2-1 countdown',g.run("WILD.phase==='count'"));g.ticks(60*3.1);check('the timer starts after GO',g.run("WILD.phase==='play'")&&g.run('WILD.left')<left);}
  else{g.tap(Lo.back.x+Lo.back.w/2,Lo.back.y+Lo.back.h/2);check('"Back to the game" leaves without starting',!g.run('WILD.on'));}
  g.close();}
 {const g=await game({src:NEW,render:true,seed:4});g.ticks(30);const b=g.run('wildButton()');g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(30);shot(g,'wild1-goal-card-unchanged');
  const R=g.c.__game.wildCardRects();g.tap(200,R.card.y+120);check('Wild 1 card unchanged: a tap off GO does not start it',g.run("WILD.phase==='card'"));g.close();}
 // 3. Music mix and dials.
 {const storage={'catpusher.uat.wild2.v1':JSON.stringify({music:.5,pusher:.7})};const g=await game({src:NEW,seed:4,storage});
  check('Music volume defaults to 100% (the old music setting is not carried over); the pusher setting is kept',g.run('W2.music')===1&&g.run('W2.pusher')===.7);
  g.run('S.dev=true');const html=g.run('wildDevHtml()');check('the dial reads 100% and goes to 200%',/Music volume: 100%/.test(html)&&g.run("(()=>{for(let i=0;i<15;i++)W2.music=Math.min(W2_MAX.music,Math.round((W2.music+.1)*10)/10);return W2.music;})()")===2);
  g.run('w2Save()');check('saved under the new key',JSON.parse(storage['catpusher.uat.music.v2']).music===2);g.close();}
 const levels={};
 for(const [label,src,m] of [['UAT 40 music 50% (old track, old default)',OLD,.5],['UAT 41 kawaii pop 100% (default)',NEW,1],['UAT 41 kawaii pop 200% (max)',NEW,2]])
  levels[label]=await measure(src,'W2.pusher=0;W2.music='+m,35.5,2.2); // one full 33.3 s loop
 const A=path.resolve(__dirname,'../cp33/assets/sounds/effects')+'/';levels['coin landing (coin-land.mp3 at its volume 0.25)']=mp3(A+'coin-land.mp3',.25,.84);levels['coin drop (coin-drop.mp3 at 0.24)']=mp3(A+'coin-drop.mp3',.24,1.1);
 levels['audition track 4 (levels.json)']={phoneBandRms:.0225,peak:.247,note:'the level Jenny heard; 6 dB over a coin landing above 250 Hz'};
 levels['UAT 40 pusher sound']=await measure(OLD,'W2.music=0',12.8,0);levels['UAT 41 pusher sound']=await measure(NEW,'W2.music=0',12.8,0);
 const L=levels,d100=L['UAT 41 kawaii pop 100% (default)'],d200=L['UAT 41 kawaii pop 200% (max)'],coin=L['coin landing (coin-land.mp3 at its volume 0.25)'];
 check('Music volume 100% is the audition level (phone-band RMS within 1.5 dB of 0.0225)',Math.abs(20*Math.log10(d100.phoneBandRms/.0225))<=1.5,d100);
 check('no clipping at 200%: music peak under 0 dBFS, and with a coin landing on top',d200.peak<1&&d200.peak+coin.whole.peak<1,{d200,coinPeak:coin.whole.peak});
 check('music sits under the coins: a coin hit is louder than the music (full-band RMS)',coin.hit100ms.rmsDb>d100.rmsDb,{coinHit:coin.hit100ms.rmsDb,music:d100.rmsDb});
 // the track plays on every board, gives way to the dance music, and comes back
 {const g=await game({src:NEW,seed:4,render:true});const st=strictAudio(g),errs=[];g.run('S.muted=false;window.__m=0;window.__inDance=0;{const f=sfx.mus.bind(sfx);sfx.mus=(...a)=>{window.__m++;if(WILD.on&&WILD.dance)window.__inDance++;return f(...a);};}');frames(g,60*34,errs);
  check('Board 1: the kawaii pop loop plays in full (about 2,250 notes a 33.3 s loop), no exception',g.run('window.__m')>=2200&&!errs.length,{notes:g.run('window.__m'),errs});
  g.run('wild2Enter();wildStartCountdown()');frames(g,200,errs);g.run('WILD.left=170;danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k<300&&frames(g,1,errs))k++;frames(g,30,errs);const m0=g.run('window.__m');
  k=0;while(g.run('!!WILD.dance')&&k<60*25&&frames(g,1,errs))k++;check('the dance music takes over: no background notes scheduled while the dance break is on',g.run('window.__inDance')===0,{inDance:g.run('window.__inDance')});
  frames(g,120,errs);check('…and the background music comes back after, no exception',g.run('window.__m')>m0+20&&!errs.length,{errs});g.close();}
 // crash regression (UAT 40 fix): dance breaks with sound and music on, strict audio
 for(const [label,v2,o] of [['Wild 2, imperfect',true,{perfect:false}],['Wild 2, perfect: YAWN',true,{slice:7}],['Wild 2, perfect: RAIN 25',true,{slice:2}],['Wild, perfect',false,{}]]){
  const r=await breakRun(NEW,v2,o);check('sound on: '+label+' — the break ends, no exception, the game keeps running',!r.errs.length&&r.ended&&r.gameRunning,r);}
 fs.writeFileSync(path.join(OUT,'levels.json'),JSON.stringify(levels,null,1));console.log(JSON.stringify(levels));
 // 4. Pusher rhythm and Turbo.
 for(const turbo of [false,true]){const g=await game({src:NEW,seed:4});let ctx;g.c.AudioContext=class{constructor(){ctx=makeContext(()=>g.ms()/1000-100);return ctx;}};
  g.run('wild2Enter();wildStartCountdown();S.coins=999');g.ticks(60*3.3);g.run('S.muted=false;W2.music=0;window.__n=0;window.__t=[];{const f=sfx.slide.bind(sfx);sfx.slide=(...a)=>{window.__n++;window.__t.push(a[3]);return f(...a);};}'+(turbo?'WILD.left=25.02;':''));
  g.ticks(10);const n0=g.run('window.__n');g.ticks(60*6.4);const n=g.run('window.__n')-n0;
  if(!turbo)check('pusher: a beat on every stroke, forward and back (4 in 6.4 s at the normal 3.2 s cycle)',n===4,{n});
  else{check('Turbo: twice the strokes (8 in 6.4 s), marked turbo (higher, louder)',n===8&&g.run('window.__t.slice(-4).every(Boolean)'),{n});
   g.ticks(60*2.5);const k=g.run('window.__n');g.ticks(60*6.4);check('…and back to normal when Turbo ends',g.run('window.__n')-k===4&&!g.run('window.__t[window.__t.length-1]'));}
  g.close();}
 {const g=await game({src:NEW,render:true,seed:4});g.run('wild2Enter();wildStartCountdown();S.coins=999');g.ticks(60*3.3);g.run('WILD.left=25.02');g.ticks(30);
  check('the callout says "TURBO PUSHER! 2× SPEED"',g.run("callouts.some(c=>c.word==='TURBO PUSHER! 2× SPEED')"));shot(g,'turbo-callout');g.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
