
// ---------- CP-101 Ragdoll dance (Jenny, Nov 19: "Lazy waltz with big droopy flops on the beat sounds great.") ----------
// On the Ragdoll's own board (its level boards, Pet the cat mode) the Dance break is on: the same meter, music-note coin and
// start as the Tuxedo's and the Orange's. The Ragdoll's dance is the Orange's opposite: a slow waltz in 3/4 (96 BPM, one slot
// per beat, 3 count-in beats), 6 bars, 11 taps: flop | flop | flop-step-step | flop | flop . lift | flop-step-step. A tap is
// judged against the nearest tap (window +-0.16 s); a tap on a rest is off the beat. Moves (the Ragdoll's approved resting
// mitts and faces only, no new art; Jenny: "Ragdolls need to flop."): before each flop both mitts float up, then the whole cat
// flops on the beat: the mitts fall limp and splay (the usual coin jolt) with a floppy rebound, and the head slumps far to one
// side with its own closed eyes (the CP-75/CP-98 art; instant, no fade), then everything drifts
// back up slowly through beats 2 and 3, with a lazy sway; step taps dip one mitt. Music: three code-made waltzes (Developer >
// Engineer tools "Ragdoll dance music"). The Dance break waits while Pet the cat or the Hug runs, and they wait for it.
// The Tuxedo's and the Orange's dances are unchanged.
const CP101={bpm:96,per:1,window:.16,px:64,ahead:4,
 // 1 flop; 2 flop; 3 flop-step-step; 4 flop; 5 flop . lift; 6 flop-step-step
 BARS:[[0],[0],[0,1,2],[0],[0,2],[0,1,2]],
 // F major: F, Dm, Bb, C, F, C (the ending chord is F); the tune plays the taps
 MEL:[[523.25],[440],[466.16,440,392],[329.63],[349.23,440],[392,329.63,349.23]],
 BASS:[174.61,146.83,116.54,130.81,174.61,130.81],
 CHORD:[[349.23,440,523.25],[293.66,349.23,440],[233.08,293.66,349.23],[261.63,329.63,392],[349.23,440,523.25],[261.63,329.63,392]],
 KEY:'catpusher.uat.cp101music.v1',CHOICES:['A','B','C'],NAMES:{A:'A: Music box',B:'B: Lazy oom-pah',C:'C: Sleepy harp'},
 stats:{starts:0,taps:0}};
CP101.info=function(bar,s){const pat=CP101.BARS[bar%CP101.BARS.length],i=pat.indexOf(s);if(i<0)return null;return {i,type:s===0?'flop':'step'};};
CP101.get=function(){try{const v=localStorage.getItem(CP101.KEY);if(CP101.CHOICES.includes(v))return v;}catch(e){}return 'A';};
CP101.set=function(v){if(!CP101.CHOICES.includes(v))return;try{localStorage.setItem(CP101.KEY,v);}catch(e){}try{diagEvent('cp101','music='+v);}catch(e){}};
// the Ragdoll's own board (its level boards; not the old Developer "Cozy" mode, not the other cats)
function cp101Board(){return !!(WILD.on&&WILD.mode==='cozy'&&typeof PGU!=='undefined'&&PGU.boardCat==='ragdoll'&&typeof PG_HOME_OFF!=='undefined'&&!PG_HOME_OFF&&PG);}
const __cp101Feature=wildFeature;wildFeature=function(f){if(f==='dance'&&cp101Board())return true;return __cp101Feature(f);};

// --- start: waits for the Hug; the Ragdoll's grid, rests and length ---
const __cp101Start=danceStart;
danceStart=function(){if(cp101Board()&&typeof PGPX!=='undefined'&&PGPX)return; // the Hug (or any power) first; the dance stays pending
 const had=WILD.dance;const r=__cp101Start.apply(this,arguments);const D=WILD.dance;
 if(!D||D===had||!cp101Board())return r;
 const q=60/CP101.bpm,bars=CP101.BARS,rest={};let taps=0;
 for(let b=0;b<bars.length;b++)for(let s=0;s<3;s++){if(bars[b].includes(s))taps++;else rest[b*3+s]=1;}
 Object.assign(D,{ragdoll:true,per:1,beat:q,n:bars.length*3,taps,rest,judged:{},sched:-DANCE_COUNT_IN,p0:danceNow()+.25+DANCE_COUNT_IN*q,
  window:CP101.window,px:CP101.px,ahead:CP101.ahead,move:1,music:CP101.get()});
 for(const k in rest)D.judged[k]='rest';
 CP101.stats.starts++;try{diagEvent('dance','ragdoll start bpm='+CP101.bpm+' taps='+taps+' music='+D.music);}catch(e){}
 return r;};
const __cp101Tap=danceTap;danceTap=function(e){const D=WILD.dance;if(D&&D.ragdoll)CP101.stats.taps++;return __cp101Tap.apply(this,arguments);};

// --- music: three waltzes, scheduled ahead on the audio clock like the others; a soft thud on every flop ---
const CP101_TRACKS={
 // A: music box. Bass on 1, soft marimba "pah-pah" on 2 and 3, a plucked music-box tune on the taps.
 A:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   if(o.s===0){L('bass',.9,d,o.bass);}else{L('marimba',.32,d,o.chord[1]);L('marimba',.26,d,o.chord[2]);}
   if(o.tap){L('pluck',.8,d,o.mel*2);L('tri',.35,d,o.mel*2);if(o.flop)L('tom',.45,d,85);}},
  end(d){sfx.cp94Loud('stopF',.6,d);}},
 // B: lazy oom-pah. A round triangle bass and soft kick on 1, quiet square chords on 2 and 3, a square tune on the taps.
 B:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   if(o.s===0){L('tri',1,d,o.bass);L('kick',.45,d);}else{L('sq',.28,d,o.chord[0]*2);L('sq',.22,d,o.chord[1]*2);L('hat',.25,d);}
   if(o.tap){L('sq',.75,d,o.mel);if(o.flop)L('tom',.55,d,80);}},
  end(d){sfx.cp94Loud('stopF',.6,d);}},
 // C: sleepy harp. A rolling plucked arpeggio on every beat, bass on 1, a marimba tune on the taps.
 C:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   L('pluck',.42,d,o.chord[o.s]);L('pluck',.34,d+o.half,o.chord[(o.s+1)%3]*2);if(o.s===0)L('bass',.75,d,o.bass);
   if(o.tap){L('marimba',1,d,o.mel*2);if(o.flop)L('tom',.45,d,90);}},
  end(d){sfx.cp94Loud('stopF',.6,d);}}};
function cp101Schedule(D){
 const now=danceNow(),lat=sfx.danceLatency(),T=CP101_TRACKS[D.music]||CP101_TRACKS.A;
 while(D.sched<=D.n&&D.p0+D.sched*D.beat-now<.15+lat){
  const k=D.sched,d=D.p0+k*D.beat-now-lat;D.sched++;
  if(k<0){sfx.cp94Loud('count',1,d,k===-1?1600:1200);continue;}
  if(k===D.n){T.end(d);continue;}
  const bar=(k/3|0)%CP101.BARS.length,s=k%3,f=CP101.info(bar,s);
  T.step({d,k,bar,s,tap:!!f,flop:!!f&&f.type==='flop',half:D.beat/2,mel:f?CP101.MEL[bar][f.i]:0,bass:CP101.BASS[bar],chord:CP101.CHORD[bar]});
 }}
const __cp101Sched=danceSchedule;danceSchedule=function(D){if(D&&D.ragdoll)return cp101Schedule(D);return __cp101Sched.apply(this,arguments);};

// --- moves ---
const cp101S=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
// the dance's state at x (beats): lift (floating up before a flop), limp (just after it), the slump side, step dips, sway
function cp101State(x,D){
 const o={lift:0,limp:0,side:1,dip:{'-1':0,'1':0},sway:Math.sin(Math.PI*2*x/3),eyes:false};
 const k0=Math.floor(x);
 for(let k=k0-2;k<=k0+2;k++){if(k<0||k>=D.n||D.rest[k])continue;const f=CP101.info(k/3|0,k%3);if(!f)continue;const u=x-k;
  if(f.type==='flop'){
   // float up over the 1.4 beats before, drop on the beat (fast), hang limp, drift back up over 2 beats
   const up=u<-.12&&u>-1.6?cp101S((u+1.6)/1.25):u>=-.12&&u<0?1-cp101S((u+.12)/.12):0;
   // Jenny: "Ragdolls need to flop." A fast drop, a floppy little rebound, a long limp hang, then a slow drift back up
   const limp=u>=0&&u<2.6?(u<.08?cp101S(u/.08):(1-cp101S((u-.7)/1.9))*(1-.14*Math.sin(Math.PI*Math.min(1,(u-.08)/.42)))):0;
   if(up>o.lift)o.lift=up;if(limp>o.limp){o.limp=limp;o.side=(k/3|0)%2?1:-1;}if(u>=0&&u<1.1)o.eyes=true;}
  else{const side=k%3===1?-1:1,b=u>-.5&&u<.6?.5+.5*Math.cos(Math.PI*(u<0?u/.5:u/.6)):0;o.dip[side]=Math.max(o.dip[side],b);}}
 return o;}
function cp101Motion(side,x,D){const st=cp101State(x,D),L=st.lift,P=st.limp,s=st.side;
 // the whole cat flops: the head slumps far to one side and sinks; both mitts fall limp, splay out and droop; the mitt on the
 // slump side falls furthest
 if(!side)return {x:9*st.sway+s*24*P,y:30*P-8*L,r:.06*st.sway+s*.56*P};
 return {x:side*18*P+s*8*P-side*4*L,y:(42+(side===s?12:0))*P-28*L+14*st.dip[side],r:side*.46*P+s*.1*P-side*.12*L+.06*st.sway+(side*.08)*st.dip[side]};}
const __cp101Motion=pawMotion;
pawMotion=function(side=0){const D=WILD.on&&WILD.dance;if(D&&D.ragdoll){const x=danceBeatX();if(x!=null)return cp101Motion(side,x,D);}return __cp101Motion.apply(this,arguments);};
// eyes: the Ragdoll's own closed eyes (as in its petting squint) from each flop until it drifts back up; on or off, no fade
function cp101Eyes(){const D=WILD.on&&WILD.dance;if(!D||!D.ragdoll)return false;const x=danceBeatX();return x!=null&&cp101State(x,D).eyes;}
const __cp101Squint=petSquint;petSquint=function(){if(cp101Eyes())return 1;return __cp101Squint.apply(this,arguments);};

// --- the choice in Engineer tools ---
const __cp101Credits=openCredits;
openCredits=function(){const r=__cp101Credits.apply(this,arguments);try{
 const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp101-music'))return r;
 const box=document.createElement('div');box.id='cp101-music';const hd=document.createElement('h3');hd.textContent='Ragdoll dance music';box.appendChild(hd);
 const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.m===CP101.get();b.textContent=(on?'✓ ':'')+CP101.NAMES[b.dataset.m];b.style.fontWeight=on?'700':'400';});
 for(const k of CP101.CHOICES){const b=document.createElement('button');b.dataset.m=k;b.style.margin='0 6px 6px 0';b.onclick=()=>{CP101.set(k);paint();};btns.push(b);box.appendChild(b);}
 const p=document.createElement('p');p.style.cssText='margin:4px 0;font-size:13px;opacity:.8';p.textContent='Used from the Ragdoll’s next Dance break.';box.appendChild(p);
 paint();const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}catch(e){}return r;};
// ---------- end CP-101 ----------
