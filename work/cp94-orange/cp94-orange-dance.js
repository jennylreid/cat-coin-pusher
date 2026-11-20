
// ---------- CP-94 Orange dance (Jenny, Nov 19: "let's do the orange cat"; Nov 18: a new dance "takes you off guard", a real
// cadence, "a steady beat with one outlier or one double speed beat... dun, dun, dun-dun-dun", its own catchy music) ----------
// On the Orange cat's own board the Dance break is on (the same meter, music-note coin and start as the Tuxedo's; PM OK Nov 19)
// and plays the Orange's dance. Jenny, Nov 19: "orange cats are wild cats": wilder, more energetic and a bit chaotic than the
// Tuxedo's tidy dance, still learnable in 3 to 5 tries. 108 BPM on a half-beat grid (D.per=2 slots per beat; slots that
// aren't in the bar's pattern are rests). Bars: steady (1 2 3 4); "dun, dun, dun-dun-dun" (1 2 3&4); the pounce (1, &2!, 3, 4);
// the scramble (1&2, 3&4): 19 taps. A tap is judged against the nearest tap slot (window ±0.15 s, the Tuxedo's); a tap on
// a rest is off the beat. Moves (the Orange's approved resting mitts and faces, no new art): big alternating swipes with a
// fixed wobble on the beats; quick runs lift both mitts in steps with a wiggle (Sharp Grin); the pounce slams both mitts
// down (Wild face). Faces switch instantly, no fades. Music: three code-made tracks (Developer > Engineer tools
// "Orange dance music"). The Tuxedo's Dance break is unchanged: every edit made for this passes through when
// D.rest/D.per/D.px are unset.
const CP94={bpm:108,per:2,window:.15,px:36,ahead:5,
 // Jenny, Nov 19: "orange cats are wild cats": faster than the Tuxedo, a pounce off the beat, a double burst to finish.
 // Each bar is one idea, said once and built on, so it stays learnable in a few tries.
 // 1 steady (1 2 3 4); 2 dun, dun, dun-dun-dun (1 2 3&4); 3 the pounce (1, &2!, 3, 4); 4 the scramble (1&2, 3&4)
 BARS:[[0,2,4,6],[0,2,4,5,6],[0,3,4,6],[0,1,2,4,5,6]],
 // the tune plays the taps (one note per tap), so the song teaches the rhythm; F major: F, Dm, Bb, C
 MEL:[[698.46,523.25,440,523.25],[587.33,440,587.33,659.25,698.46],[587.33,880,466.16,587.33],[523.25,587.33,659.25,659.25,698.46,783.99]],
 BASS:[174.61,146.83,116.54,130.81],FIFTH:[261.63,220,174.61,196],
 CHORD:[[349.23,440,523.25],[293.66,349.23,440],[233.08,293.66,349.23],[261.63,329.63,392]],
 KEY:'catpusher.uat.cp94music.v1',CHOICES:['A','B','C'],NAMES:{A:'A: Alley rock',B:'B: Wild mambo',C:'C: Ginger chip'},
 stats:{starts:0,taps:0}};
// each tap: 'beat' (on a beat, alone), 'quick' (part of a run of half-beat taps), 'pounce' (alone, off the beat)
CP94.info=function(bar,s){const pat=CP94.BARS[bar%CP94.BARS.length],i=pat.indexOf(s);if(i<0)return null;
 const P=u=>u%2===1&&pat.includes(u)&&!pat.includes(u-1),T=u=>pat.includes(u)&&!P(u); // a pounce: an off-beat tap with no tap just before
 if(P(s))return {i,type:'pounce',r0:s,len:1,step:0};
 const quick=T(s-1)||T(s+1);let r0=s;while(T(r0-1))r0--;let r1=s;while(T(r1+1))r1++;
 return {i,type:quick?'quick':'beat',r0,len:r1-r0+1,step:s-r0};};
CP94.get=function(){try{const v=localStorage.getItem(CP94.KEY);if(CP94.CHOICES.includes(v))return v;}catch(e){}return 'A';};
CP94.set=function(v){if(!CP94.CHOICES.includes(v))return;try{localStorage.setItem(CP94.KEY,v);}catch(e){}try{diagEvent('cp94','music='+v);}catch(e){}};
// the Orange cat's own board (its level boards; not the old Developer "Treat toss" mode, not the other cats)
function cp94Board(){return !!(WILD.on&&WILD.mode==='treats'&&typeof PGU!=='undefined'&&PGU.boardCat==='orange'&&typeof PG_HOME_OFF!=='undefined'&&!PG_HOME_OFF&&PG);}
const __cp94Feature=wildFeature;wildFeature=function(f){if(f==='dance'&&cp94Board())return true;return __cp94Feature(f);};

// judging on a grid with rests: the nearest tap slot; the next tap slot after k
function danceSlot(D,t){const x=(t-D.p0)/D.beat,k=Math.round(x);if(!D.rest||!D.rest[k])return k;
 const a=k-1,b=k+1,ra=!!D.rest[a],rb=!!D.rest[b];if(ra&&rb)return k;if(ra)return b;if(rb)return a;return Math.abs(x-a)<=Math.abs(x-b)?a:b;}
function danceNextTap(D,k){let j=k+1;if(D.rest)while(D.rest[j]&&j<D.n)j++;return j;}

// the meter moves right of the Treat toss slot (CP-88) on the Orange's board, so the two never overlap
function danceMeterShift(){if(!cp94Board()||typeof cp88Btn!=='function')return 0;const hud=hudLayout(),x0=W-Math.max(8,hud.right+10)-124,s=cp88Btn();return Math.max(0,Math.min(48,s.x+s.w+6-x0));}

// --- start: the Orange's grid, rests and length ---
const __cp94Start=danceStart;
danceStart=function(){const had=WILD.dance;const r=__cp94Start.apply(this,arguments);const D=WILD.dance;
 if(!D||D===had||!cp94Board())return r;
 const q=60/CP94.bpm,per=CP94.per,bars=CP94.BARS,rest={};let taps=0;
 for(let b=0;b<bars.length;b++)for(let s=0;s<8;s++){if(bars[b].includes(s))taps++;else rest[b*8+s]=1;}
 for(let k=-DANCE_COUNT_IN*per;k<0;k++)if(k%per)rest[k]=1; // count-in: one count per beat
 Object.assign(D,{orange:true,per,beat:q/per,n:bars.length*8,taps,rest,judged:{},sched:-DANCE_COUNT_IN*per,p0:danceNow()+.25+DANCE_COUNT_IN*q,
  window:CP94.window,px:CP94.px,ahead:CP94.ahead,move:1,music:CP94.get()});
 for(const k in rest)if(+k>=0)D.judged[k]='rest';
 CP94.stats.starts++;try{diagEvent('dance','orange start bpm='+CP94.bpm+' taps='+taps+' music='+D.music);}catch(e){}
 return r;};
const __cp94Tap=danceTap;danceTap=function(e){const D=WILD.dance;if(D&&D.orange)CP94.stats.taps++;return __cp94Tap.apply(this,arguments);};

// --- music: the Orange's own track, scheduled ahead on the audio clock like the Tuxedo's ---
const CP94_TRACKS={
 // A: rock. A driving half-beat saw bass, kick and snare, loud hats; a plucked lead plays the taps; claps and a cowbell on
 // the quick runs; a crash and a tom on the pounce.
 A:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   if(o.s===0||o.s===4||o.pounce)L('kick',1,d);if(o.s===2||o.s===6)L('snare',1,d);if(o.k===0)L('crash',.7,d);
   L('hat',o.s%2?.6:1,d);L('grit',o.s%2?.7:1,d,o.s%4===2?o.bass*2:o.bass);
   if(o.tap){L('pluck',1,d,o.mel);if(o.quick){L('clap',.8,d);L('cowbell',.6,d);}if(o.pounce){L('crash',.8,d);L('tom',1,d,140);}}},
  end(d){sfx.cp94Loud('stopF',1,d);}},
 // B: mambo, fast. Claves on every tap, congas between, a shaker, a cowbell on the beats; timbale hits on the quick runs,
 // a crash on the pounce; a marimba plays the taps.
 B:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   if(o.s===0)L('kick',.9,d);if(o.k===0)L('crash',.5,d);L('shaker',o.s%2?.7:1,d);if(o.s%2===0)L('cowbell',.35,d);
   if(o.tap){L('clave',1,d);L('marimba',1,d,o.mel);if(o.quick)L('tom',.7,d,300+o.step*60);if(o.pounce){L('crash',.8,d);L('tom',1,d,180);}}
   else L('conga',.75,d,o.s%4===3?196:233);
   if(o.s===0||o.s===4)L('bass',1,d,o.bass);if(o.s===6)L('bass',.7,d,o.fifth);},
  end(d){sfx.cp94Loud('stopF',1,d);}},
 // C: chiptune, fast. Noise drums, a triangle bass, a busy square arpeggio between the taps; a square lead plays the taps,
 // rising blips on the quick runs, a crash and a high blip on the pounce.
 C:{step(o){const L=(k,v,d,a)=>sfx.cp94Loud(k,v,d,a),d=o.d;
   if(o.s===0||o.s===4||o.pounce)L('kick',.9,d);if(o.s===2||o.s===6)L('chipsnare',1,d);L('hat',o.s%2?.5:.8,d);
   L('tri',1,d,o.s%2?o.bass*2:o.bass);
   if(!o.tap){L('sq',.5,d,o.chord[(o.s>>1)%3]*2);L('sq',.35,d+o.half,o.chord[((o.s>>1)+1)%3]*2);}
   if(o.tap){L('sq',1,d,o.mel);if(o.quick)L('blip',.8,d,o.mel*2);if(o.pounce){L('crash',.6,d);L('blip',1,d,o.mel*3);}}},
  end(d){sfx.cp94Loud('stopF',1,d);}}};
function cp94Schedule(D){
 const now=danceNow(),lat=sfx.danceLatency(),T=CP94_TRACKS[D.music]||CP94_TRACKS.A;
 while(D.sched<=D.n&&D.p0+D.sched*D.beat-now<.15+lat){
  const k=D.sched,d=D.p0+k*D.beat-now-lat;D.sched++;
  if(k<0){if(!D.rest[k])sfx.cp94Loud('count',1,d,k===-D.per?1600:1200);sfx.cp94Loud('hat',.6,d);continue;}
  if(k===D.n){T.end(d);continue;}
  const bar=(k/8|0)%CP94.BARS.length,s=k%8,f=CP94.info(bar,s);
  T.step({d,k,bar,s,i:f?f.i:-1,tap:!!f,quick:!!f&&f.type==='quick',pounce:!!f&&f.type==='pounce',step:f?f.step:0,half:D.beat/2,
   mel:f?CP94.MEL[bar][f.i]:0,bass:CP94.BASS[bar],fifth:CP94.FIFTH[bar],chord:CP94.CHORD[bar]});
 }}
const __cp94Sched=danceSchedule;danceSchedule=function(D){if(D&&D.orange)return cp94Schedule(D);return __cp94Sched.apply(this,arguments);};

// --- moves ---
const cp94S=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
// a press: travels over the slot before the tap, strongest on it, back over the slot after
function cp94Bump(u){return u<-1||u>1?0:.5+.5*Math.cos(Math.PI*u);}
// a fixed wobble per slot (the same every time, so the chaos stays learnable)
function cp94J(k,n){const v=Math.sin(k*12.9898+n*78.233)*43758.5453;return (v-Math.floor(v))*2-1;}
// the dance's state at x (slots): swipes per side, the pounce, the quick runs' lift and wiggle, faces
function cp94State(x,D){
 const o={swipe:{'-1':0,'1':0},lean:0,jit:0,pounce:0,lift:0,wig:0,grin:false,wild:false};
 const k0=Math.floor(x);
 for(let k=k0-1;k<=k0+2;k++){if(k<0||k>=D.n||D.rest[k])continue;const f=CP94.info(k/8|0,k%8);if(!f)continue;
  if(f.type==='beat'){const side=(k/2|0)%2?1:-1,b=cp94Bump((x-k)/1.1);o.swipe[side]=Math.max(o.swipe[side],b);o.lean+=side*b;o.jit+=cp94J(k,1)*b;}
  else if(f.type==='pounce'){const b=cp94Bump((x-k)/1.2);o.pounce=Math.max(o.pounce,b);o.jit+=cp94J(k,2)*b;if(x>=k-.05&&x<k+.9)o.wild=true;}}
 // quick runs: each step rises over the half slot before its tap, with a wiggle; the drop lands a slot after the run
 const bar=Math.max(0,x)/8|0,pat=CP94.BARS[bar%CP94.BARS.length];
 if(pat&&x<D.n){for(const s of pat){const f=CP94.info(bar,s);if(f.type!=='quick'||f.step!==0)continue;const t0=bar*8+s,m=f.len;
   let L=0;for(let j=0;j<m;j++)L+=cp94S((x-(t0+j)+.5)/.5);L*=1-cp94S((x-(t0+m))/1);
   if(L>o.lift){o.lift=L;o.wig=Math.sin(Math.PI*2*(x-t0))*Math.min(1,L);}if(x>=t0-.05&&x<t0+m+.5)o.grin=true;}}
 return o;}
function cp94Motion(side,x,D){const st=cp94State(x,D),L=st.lift,P=st.pounce;
 if(!side)return {x:10*st.lean+6*st.wig,y:4*Math.max(st.swipe[-1],st.swipe[1])-6*L+9*P,r:.08*st.lean+.05*st.jit+.06*st.wig};
 const sw=st.swipe[side],other=st.swipe[-side];
 return {x:-side*16*sw+side*8*other-side*5*L+side*7*st.wig-side*10*P,y:28*sw-12*other-L*(20+6*side*st.wig)+26*P,
  r:-side*.18*sw+.08*st.jit+side*.12*L+side*.1*st.wig-side*.1*P};}
const __cp94Motion=pawMotion;
pawMotion=function(side=0){const D=WILD.on&&WILD.dance;if(D&&D.orange){const x=danceBeatX();if(x!=null)return cp94Motion(side,x,D);}return __cp94Motion.apply(this,arguments);};
function cp94Face(){const D=WILD.on&&WILD.dance;if(!D||!D.orange)return null;const x=danceBeatX();if(x==null)return null;const st=cp94State(x,D);return st.wild?'wild':st.grin?'grin':null;}
function cp94Grin(){return cp94Face()==='grin';}
// the face switch: the Sharp Grin (the Orange's copy of the approved art) instead of Sweet, swapped in and out on a frame, no fade
const __cp94Head=petDrawHead;petDrawHead=function(img){const f=cp94Face();if(f==='grin'&&ART.headSharp)img=ART.headSharp;else if(f==='wild'&&ART.headWild)img=ART.headWild;return __cp94Head.call(this,img);};

// --- the choice in Engineer tools ---
const __cp94Credits=openCredits;
openCredits=function(){const r=__cp94Credits.apply(this,arguments);try{
 const eng=panel.querySelector&&panel.querySelector('#cp70-engineer');if(!S.dev||!eng||eng.querySelector('#cp94-music'))return r;
 const box=document.createElement('div');box.id='cp94-music';const hd=document.createElement('h3');hd.textContent='Orange dance music';box.appendChild(hd);
 const btns=[];const paint=()=>btns.forEach(b=>{const on=b.dataset.m===CP94.get();b.textContent=(on?'✓ ':'')+CP94.NAMES[b.dataset.m];b.style.fontWeight=on?'700':'400';});
 for(const k of CP94.CHOICES){const b=document.createElement('button');b.dataset.m=k;b.style.margin='0 6px 6px 0';b.onclick=()=>{CP94.set(k);paint();};btns.push(b);box.appendChild(b);}
 const p=document.createElement('p');p.style.cssText='margin:4px 0;font-size:13px;opacity:.8';p.textContent="Used from the Orange cat's next Dance break.";box.appendChild(p);
 paint();const sum=eng.querySelector('summary');if(sum&&sum.nextSibling)eng.insertBefore(box,sum.nextSibling);else eng.appendChild(box);}catch(e){}return r;};
// ---------- end CP-94 ----------
