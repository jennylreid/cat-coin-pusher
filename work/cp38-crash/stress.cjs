// UAT 38 dance-break crash hunt (desktop, a copy of the UAT 38 build). Runs many dance breaks on Wild and Wild 2 and
// watches for exceptions (which would stop the game loop: frame() has no try/catch), live audio nodes, heap and arrays.
// Usage: node stress.cjs [release.html]
const {game,tapAtBeat}=require('./harness.cjs'),path=require('path');
const SRC=path.resolve(__dirname,process.argv[2]||'uat38.html');
// fake Web Audio that counts nodes and how many are still alive (started and not yet past their stop time)
function fakeAudio(g){const st={created:0,started:[],params:0};const now=()=>g.ms()/1000-100;
 const fin=(...a)=>{for(const x of a)if(!Number.isFinite(x))throw new TypeError('non-finite audio value '+x);};const P=()=>({__param:true,_v:0,get value(){return this._v;},set value(x){fin(x);this._v=x;},setValueAtTime(v,t){fin(v,t);if(t<0)throw new RangeError('time '+t);st.params++;},linearRampToValueAtTime(v,t){fin(v,t);st.params++;},exponentialRampToValueAtTime(v,t){fin(v,t);if(!(v>0)&&!(v<0))throw new RangeError('exp ramp to '+v);st.params++;},cancelScheduledValues(t){fin(t);}});
 const node=()=>{st.created++;const n={__node:true,connect(d){if(!d||!(d.__node||d.__param||d.__dest))throw new TypeError("Failed to execute 'connect' on 'AudioNode': Overload resolution failed.");return d;},disconnect(){},start(t){if(t!==undefined)fin(t);n.t0=t??now();st.started.push(n);},stop(t){if(t!==undefined)fin(t);n.t1=t??now();},frequency:P(),gain:P(),Q:P(),detune:P(),type:'',buffer:null,loop:false,curve:null};return n;};
 g.c.AudioContext=class{constructor(){this.sampleRate=8000;this.state='running';this.destination={__dest:true};}get currentTime(){return now();}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createWaveShaper(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(4000)};}resume(){}};
 st.live=()=>st.started.filter(n=>!(n.t1<=now())).length;st.prune=()=>{st.started=st.started.filter(n=>!(n.t1<=now()));};return st;}
const push=(g,id,kind='item')=>g.run(`(()=>{let b=bodies.find(b=>!b.dead&&b.kind==='${kind}'&&(${kind==='item'}?b.id==='${id}':true));if(!b)b=addCoin('${kind}',${kind==='item'?`'${id}'`:'null'},200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
const errors=[];
function safeTick(g,n=1){for(let i=0;i<n;i++){try{if(g.phone)g.frame();else{g.tick();if((g.nd=(g.nd||0)+1)%10===0&&g.c.draw)g.c.draw();}}catch(e){errors.push({at:g.label,err:String(e&&e.stack||e).split('\n').slice(0,4).join(' | ')});return false;}}return true;}
const arrays="JSON.stringify({bodies:bodies.filter(b=>!b.dead).length,allBodies:bodies.length,sky:typeof SKY!=='undefined'?SKY.length:0,fx:WILD.dance?WILD.dance.fx.length:0,confetti:WILD.confetti.length,floats:floats.length,rings:rings.length,callouts:callouts.length,treatAwards:treatAwards.length,incoming:WILD.incoming.length})";
async function run(label,v2,scenario,breaks){
 const g=await game({src:SRC,seed:11,render:true});g.label=label;g.phone=!!process.env.PHONE;const st=fakeAudio(g);g.run('S.muted=false;S.dev=true');
 const enter=()=>{g.run(v2&&g.run("typeof wild2Enter==='function'")?'wild2Enter()':'wildEnter()');g.c.__game.wildStartCountdown();safeTick(g,200);g.run('S.coins=400;WILD.left=170;');};
 enter();if(g.phone){for(let i=0;i<110;i++){g.c.__game.tryDrop({x:200+120*Math.sin(i*.7),y:g.run('DROP_Y')});safeTick(g,1);}}const samples=[];
 for(let k=0;k<breaks;k++){g.label=label+' #'+k;
  if(g.run("WILD.phase!=='play'")){if(g.run('WILD.on'))g.run('wildExit()');enter();}
  g.run('WILD.left=Math.max(WILD.left,60)');
  const how=scenario(k);
  if(how.note){g.run("WILD.incoming.push({kind:'note',id:null,x:200,y:600,t:.1,t0:.1})");safeTick(g,60);push(g,null,'note');}
  else if(how.prizes){for(let i=0;i<4;i++){g.run("(()=>{const ids=WILD_COLLECTION.filter(id=>WILD.have[id]);const id=ids.length?ids[0]:'cheese';const b=addCoin('item',id,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");safeTick(g,40);}}
  else g.run('danceStartNow()');
  let t=0;while(!g.run('!!WILD.dance')&&t<400){if(!safeTick(g))break;t++;}
  if(!g.run('!!WILD.dance')){errors.push({at:g.label,err:'dance did not start'});continue;}
  g.until("!WILD.dance||WILD.dance.phase==='dance'",300);
  if(how.slice!=null)g.run('w2ForceSlice='+how.slice);
  const nBeats=g.run('WILD.dance?WILD.dance.n:0');
  for(let b=0;b<nBeats&&g.run('!!WILD.dance');b++){
   if(how.background&&b===5){const ms0=g.ms();g.c.performance.now=(()=>{const base=g.ms;let off=how.background*1000;return ()=>base()+off;})();safeTick(g,1);} // the app went to the background for a while (no frames)
   if(how.settings&&b===6){g.run("panel.style.display='block'");safeTick(g,120);g.run("panel.style.display='none'");}
   if(how.exit&&b===7){const w=g.run('wildButton()');g.tap(w.x+w.w/2,w.y+w.h/2);break;}
   if(how.win&&b===8){g.run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese");push(g,'cheese');}
   const miss=how.perfect?false:(b%5===3);if(how.spam){for(let i=0;i<6;i++){g.tap();safeTick(g,2);}continue;}
   try{tapAtBeat(g,b,miss?.3:0);}catch(e){errors.push({at:g.label,err:'tap: '+e});break;}
   if(errors.length>50)break;}
  let w=0;while(g.run('!!WILD.dance')&&w<60*20){if(!safeTick(g))break;w++;}
  safeTick(g,90);st.prune();
  samples.push({k,live:st.live(),created:st.created,heapMB:+(process.memoryUsage().heapUsed/1e6).toFixed(1),arrays:JSON.parse(g.run(arrays))});
 }
 g.close();return samples;
}
(async()=>{
 const scen={
  'natural (4 prizes), imperfect':k=>({prizes:true}),
  'music note, perfect':k=>({note:true,perfect:true,slice:k%8}),
  'forced, perfect, every slice':k=>({perfect:true,slice:k%8}),
  'forced, spam taps':k=>({spam:true}),
  'Settings and background mid-break':k=>({perfect:true,settings:true,background:k%2?3:40}),
  'EXIT mid-break':k=>({exit:true}),
  'win during the break':k=>({perfect:true,win:true}),
 };
 for(const v2 of [false,true])for(const [name,fn] of Object.entries(scen)){
  if(process.env.ONLY&&!name.includes(process.env.ONLY))continue;const label=(v2?'Wild 2':'Wild')+': '+name,s=await run(label,v2,fn,+(process.env.BREAKS||12));
  const first=s[0],last=s[s.length-1];console.log(JSON.stringify({label,breaks:s.length,liveAudioNodes:[first&&first.live,last&&last.live],createdNodes:last&&last.created,heapMB:[first&&first.heapMB,last&&last.heapMB],arraysLast:last&&last.arrays}));
 }
 console.log('ERRORS',errors.length);for(const e of errors.slice(0,30))console.log("ERR "+JSON.stringify(e).slice(0,330));
})().catch(e=>{console.error('FATAL',e);process.exitCode=1;});
