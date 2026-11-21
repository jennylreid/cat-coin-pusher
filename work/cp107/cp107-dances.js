
// ---------- CP-107 Dance break for the Siamese (call and response) and the Tortie (sassy strut with no-tap stops) (Jenny,
// Nov 21: "your ideas for dance beat are stellar. Please proceed with those. We're going to need new cat art for Torty for
// sure.") ----------
// The same method as CP-94 (Orange) and CP-101 (Ragdoll): on each cat's own board the Dance break is on (the same meter,
// music-note coin, start and perfect-dance wheel as the others), with its own grid, moves and three code-made music candidates (a UAT-only "Music: A | B | C" pill
// during the dance; Jenny's pick becomes final).
// The ladder: Tuxedo = entry, steady beat; Orange = wild; Ragdoll = slow waltz with flops; Siamese = listen and repeat;
// Tortie = read her mood.
// SIAMESE: call and response, 112 BPM on a half-beat grid (2 slots per beat). Four rounds; each round is one bar where the cat
//   sings a short rhythm (short, cute code-made mews, no taps) and one bar where the player taps it back. The phrase grows by one note a
//   round: 2, 3, 4, 5 notes (14 taps). A tap while the cat sings counts as off the beat ("Listen!"). Moves: the Siamese's
//   approved yawn face (CP-75, used as painted) is its singing face, shown on each yowl (instant switch); the head lifts and
//   tips back on each yowl, one mitt rises with it; in the player's bar the head tilts to listen and the mitts pat each tap.
// TORTIE: a sassy strut, 104 BPM on a half-beat grid. A steady strut, then sudden stops: the music cuts out with a swish, she
//   turns her head away, nose up, one mitt on her hip; a tap during a stop counts as off the beat ("Not now!"). Then she
//   struts on, sometimes at a new speed (quick bars at double time, slow bars at half time). 8 bars, 26 taps. Faces: the
//   Sharp Grin while she struts, Sweet (smug, mouth closed) while she looks away; instant switches. Her tail flick needs new
//   art (see tickets/CP-107.md); for now the swish is heard, not seen.
// Both lanes show what's coming: the Siamese's yowls slide in as hollow blue rings (not to be tapped), the Tortie's stops as
// an amber "hold" band; a small cue under the lane says LISTEN / YOUR TURN / HOLD (the music pill sits right of it).
// Overlaps (as the others): the Dance break waits while the cat's power or its side game runs, and they wait for it.
// Laser mode's "no Dance break" rule is lifted on the Siamese's own board only (its laser coin and Laser chase are unchanged;
// the fish stays off). The Tuxedo's, Orange's and Ragdoll's dances are unchanged; everything here checks D.siamese/D.tortie.
const CP107={
 siam:{bpm:112,per:2,window:.15,px:34,ahead:6,
  // the cat's phrase each round (slots in a bar of 8); the player's bar repeats it
  CALLS:[[0,4],[0,2,4],[0,2,4,5],[0,2,4,5,6]],
  // A minor pentatonic; the yowls sing these and the player's bar echoes them softly
  MEL:[[659.25,440],[440,523.25,659.25],[659.25,587.33,523.25,440],[440,523.25,587.33,659.25,783.99]],
  BASS:[110,87.31,130.81,98],CHORD:[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]]},
 tort:{bpm:104,per:2,window:.15,px:34,ahead:6,
  // t: tap slots in a bar of 8; stop: [first, last] silent slots (no tapping); slow: half-time feel; quick bars are the ones
  // with taps on neighbouring slots (double time)
  BARS:[{t:[0,2,4,6]},{t:[0,2],stop:[4,7]},{t:[0,2,4,6]},{t:[0,1,2,3],stop:[4,7]},
        {t:[0,4],slow:1},{t:[0],stop:[2,7],slow:1},{t:[0,1,2,3,4,6]},{t:[0,2,6],stop:[3,5]}],
  // E minor (dorian) strut; the tune plays the taps
  MEL:[[329.63,392,440,493.88],[493.88,440],[329.63,392,440,587.33],[659.25,587.33,493.88,440],
       [329.63,493.88],[659.25],[329.63,392,440,493.88,587.33,659.25],[493.88,587.33,659.25]],
  BASS:[82.41,82.41,98,110,82.41,73.42,98,82.41]},
 stats:{siam:0,tort:0,quiet:0},rec:null};
// each cat's own board (its level boards and the endless board; not the old Developer modes, not the other cats)
function cp107Board(cat){return !!(WILD.on&&typeof PGU!=='undefined'&&PGU.boardCat===cat&&WILD.mode===(cat==='siamese'?'laser':'pounce')&&typeof PG_HOME_OFF!=='undefined'&&!PG_HOME_OFF&&PG);}
const cp107Siam=()=>cp107Board('siamese'),cp107Tort=()=>cp107Board('tortie');
const __cp107Feature=wildFeature;wildFeature=function(f){if(f==='dance'&&!CP107.noMeter&&(cp107Siam()||cp107Tort()))return true;return __cp107Feature(f);};
// Laser mode switches the meter, the music note and the dance off; on the Siamese's own board they're on (the fish stays off)
// (WILD.laser is a getter: "a board in Laser mode"; it reads false only while CP107.noLaser is set, inside these two calls)
{const P=Object.getOwnPropertyDescriptor(WILD,'laser');if(P&&P.get&&P.configurable)Object.defineProperty(WILD,'laser',{configurable:true,enumerable:P.enumerable,
 get(){return CP107.noLaser?false:P.get.call(this);},set(v){return P.set&&P.set.call(this,v);}});}
function cp107NoLaser(fn,self,args){const was=CP107.noLaser;CP107.noLaser=true;try{return fn.apply(self,args);}finally{CP107.noLaser=was;}}
const __cp107Fill=danceFill;danceFill=function(){if(cp107Siam())return cp107NoLaser(__cp107Fill,this,arguments);return __cp107Fill.apply(this,arguments);};
const __cp107Tweaks=laserTweaks;laserTweaks=function(){if(cp107Siam()){WILD.fishAt=999;WILD.fishN=9;return;}return __cp107Tweaks.apply(this,arguments);};
// the banner on the Siamese's board: the Dance meter, as on the other boards (Laser mode's "LASER COIN SOON" label, which sat
// in the same place, isn't drawn); while a Laser chase runs, the chase's own timer bar there instead of the meter
const __cp107Hud=drawWildHud;drawWildHud=function(hud){if(!cp107Siam())return __cp107Hud.apply(this,arguments);
 if(WILD.chase){CP107.noMeter=true;try{return __cp107Hud.apply(this,arguments);}finally{CP107.noMeter=false;}}
 return cp107NoLaser(__cp107Hud,this,arguments);};
// Mouse pounce waits for the Dance break (Laser chase already does)
const __cp107Pounce=pounceStart;pounceStart=function(){if(WILD.dance&&cp107Tort())return;return __cp107Pounce.apply(this,arguments);};
// the meter sits right of the banked side-game coin's slot on these boards too (as on the Orange's)
const __cp107Shift=danceMeterShift;danceMeterShift=function(){if((cp107Siam()||cp107Tort())&&typeof cp88Btn==='function'){const hud=hudLayout(),x0=W-Math.max(8,hud.right+10)-124,s=cp88Btn();return Math.max(0,Math.min(48,s.x+s.w+6-x0));}return __cp107Shift.apply(this,arguments);};

// --- the two grids ---
function cp107SiamAt(k){const C=CP107.siam,r=k>>4,call=(k&15)<8,s=k&7,P=C.CALLS[r]||[],i=P.indexOf(s);return {r,call,s,i,tap:!call&&i>=0,yowl:call&&i>=0};}
function cp107TortAt(k){const B=CP107.tort.BARS[k>>3]||{t:[]},s=k&7,i=B.t.indexOf(s),stop=!!(B.stop&&s>=B.stop[0]&&s<=B.stop[1]);
 const quick=i>=0&&(B.t.includes(s-1)||B.t.includes(s+1));return {bar:k>>3,s,i,tap:i>=0,stop,quick,slow:!!B.slow,B};}
function cp107Setup(D,kind){const C=CP107[kind],q=60/C.bpm,per=C.per,n=64,rest={},quiet=[];let taps=0;
 for(let k=0;k<n;k++){const f=kind==='siam'?cp107SiamAt(k):cp107TortAt(k);if(f.tap)taps++;else rest[k]=1;}
 if(kind==='siam')for(let r=0;r<4;r++)quiet.push([r*16,r*16+7]);
 else CP107.tort.BARS.forEach((B,b)=>{if(B.stop)quiet.push([b*8+B.stop[0],b*8+B.stop[1]]);});
 for(let k=-DANCE_COUNT_IN*per;k<0;k++)if(k%per)rest[k]=1; // count-in: one count per beat
 Object.assign(D,{[kind==='siam'?'siamese':'tortie']:true,per,beat:q/per,n,taps,rest,judged:{},quiet,sched:-DANCE_COUNT_IN*per,
  p0:danceNow()+.25+DANCE_COUNT_IN*q,window:C.window,px:C.px,ahead:C.ahead,move:1,music:CP107M.get(kind)});
 for(const k in rest)if(+k>=0)D.judged[k]='rest';
 CP107.stats[kind]++;try{diagEvent('dance',(kind==='siam'?'siamese':'tortie')+' start bpm='+C.bpm+' taps='+taps+' music='+D.music);}catch(e){}}

// --- start: waits for the cat's power and side game; then its own grid ---
const __cp107Start=danceStart;
danceStart=function(){const S7=cp107Siam(),T7=cp107Tort();
 if((S7||T7)&&((typeof PGPX!=='undefined'&&PGPX)||WILD.chase||WILD.pounce))return; // they first; the dance stays pending
 const had=WILD.dance;const r=S7?cp107NoLaser(__cp107Start,this,arguments):__cp107Start.apply(this,arguments);const D=WILD.dance;
 if(!D||D===had||!(S7||T7))return r;
 cp107Setup(D,S7?'siam':'tort');return r;};

// --- taps: a tap while the Siamese sings or during the Tortie's stop is off the beat (and blocks her next tap) ---
function cp107Quiet(D,adj){const x=(adj-D.p0)/D.beat;for(const [a,b] of D.quiet)if(x>=a-.5&&x<=b+.5)return [a,b];return null;}
const __cp107Tap=danceTap;danceTap=function(e){const D=WILD.dance;
 if(D&&(D.siamese||D.tortie)&&D.phase!=='finale'&&D.quiet){
  const now=danceNow(),stamp=e&&Number.isFinite(e.timeStamp)&&e.timeStamp>0&&Math.abs(performance.now()-e.timeStamp)<500?e.timeStamp/1000:now,adj=stamp-D.latency;
  const k=danceSlot(D,adj),err=adj-(D.p0+k*D.beat),onTap=k>=0&&k<D.n&&!D.rest[k]&&Math.abs(err)<=D.window,Q=onTap?null:cp107Quiet(D,adj);
  if(Q){D.blocked=danceNextTap(D,Q[1]);D.misses++;D.streak=0;CP107.stats.quiet++;danceFx(D.siamese?'Listen!':'Not now!','#b9a6d6');sfx.dance('miss',1);
   try{diagEvent('dance',(D.siamese?'siamese':'tortie')+' quiet tap');}catch(_){}return;}}
 return __cp107Tap.apply(this,arguments);};

// --- sound: the Siamese's mew and the Tortie's swish, made on the Dance break's own music bus ---
// The game has no meow recording of its own (its meows are code-made too; the Pixabay cat songs in the project have their
// meows mixed over music), so the Siamese's voice is made in code. Jenny: "We want it to be cute, not annoying": a short,
// rounded "mi-ew" (sine and triangle, a soft vowel, a little vibrato), quieter than the band, one per note so the phrase
// stays clear.
const CP107A={noise:null};
function cp107Voice(kind,vol,delay,f,dur){try{if(!sfx._w2ok())return;const bus=sfx._dBus(),ac=bus&&bus.context;if(!ac)return;
 const v=vol*(typeof pickupFx==='object'&&pickupFx?pickupFx.volume:1);if(!(v>0))return;const t=ac.currentTime+Math.max(0,delay);
 if(kind==='yowl'){
  const d=Math.max(.14,Math.min(.38,dur||.26)),nodes=[];
  const osc=(type,mul)=>{const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f*.9*mul,t);o.frequency.exponentialRampToValueAtTime(f*1.1*mul,t+d*.3);o.frequency.exponentialRampToValueAtTime(f*.84*mul,t+d);nodes.push(o);return o;};
  const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=5.5;lg.gain.value=f*.012;lfo.connect(lg);nodes.push(lfo);
  const body=osc('sine',1),edge=osc('triangle',1),vow=osc('sawtooth',1);for(const o of [body,edge,vow])lg.connect(o.frequency);
  const bp=ac.createBiquadFilter();bp.type='bandpass';bp.Q.value=4;bp.frequency.setValueAtTime(1900,t);bp.frequency.linearRampToValueAtTime(2500,t+d*.3);bp.frequency.linearRampToValueAtTime(1300,t+d);
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;
  const g=ac.createGain(),gb=ac.createGain(),ge=ac.createGain(),gv=ac.createGain();gb.gain.value=.55;ge.gain.value=.3;gv.gain.value=.16;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.26*v,t+.03);g.gain.setValueAtTime(.26*v,t+d*.55);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  body.connect(gb);edge.connect(ge);vow.connect(bp);bp.connect(gv);for(const x of [gb,ge,gv])x.connect(lp);lp.connect(g);g.connect(bus);
  for(const n of nodes){n.start(t);n.stop(t+d+.05);}}
 else if(kind==='swish'){ // the tail flick: a quick airy sweep up
  if(!CP107A.noise){const n=ac.createBuffer(1,ac.sampleRate*.5|0,ac.sampleRate),c=n.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1;CP107A.noise=n;}
  const s=ac.createBufferSource(),bp=ac.createBiquadFilter(),g=ac.createGain();s.buffer=CP107A.noise;bp.type='bandpass';bp.Q.value=1.4;
  bp.frequency.setValueAtTime(700,t);bp.frequency.exponentialRampToValueAtTime(4200,t+.2);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.35*v,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.26);
  s.connect(bp);bp.connect(g);g.connect(bus);s.start(t);s.stop(t+.3);}
 CP107.voices=(CP107.voices|0)+1;}catch(e){CP107.audioErr=String(e);}}
// every music event goes through here (CP107.rec, when set by a check, lists them)
function cp107L(k,v,d,a,dur){if(CP107.rec)CP107.rec.push([k,+v.toFixed(2),+(a||0).toFixed(2)]);if(k==='yowl'||k==='swish')cp107Voice(k,v,d,a,dur);else sfx.cp94Loud(k,v,d,a);}

// --- music: three candidates per cat (Jenny: "pick some good music and let me do some A/B/C testing"); a UAT-only pill
// "Music: A | B | C" under the lane during that cat's dance switches from the next note and is remembered ---
const CP107M={siam:{KEY:'catpusher.uat.cp107siam.v1',NAMES:{A:'Purr groove',B:'Bossa lounge',C:'Chip chat'}},
 tort:{KEY:'catpusher.uat.cp107tort.v1',NAMES:{A:'Funky strut',B:'Swing sashay',C:'Disco diva'}},CHOICES:['A','B','C']};
CP107M.get=function(c){try{const v=localStorage.getItem(CP107M[c].KEY);if(CP107M.CHOICES.includes(v))return v;}catch(e){}return 'A';};
CP107M.set=function(c,v){if(!CP107M.CHOICES.includes(v))return;try{localStorage.setItem(CP107M[c].KEY,v);}catch(e){}try{diagEvent('cp107',c+' music='+v);}catch(e){}};
function cp107PillOn(){return typeof BUILD==='string'&&/\bUAT\b/.test(BUILD);}
// The Siamese's tracks keep the cat's bar sparse (room for the mews) and fill in a little on the player's bar.
// o: d (delay), k, s (slot in the bar), call (the cat's bar), yowl, tap, i, mel, bass, chord, beat
const CP107_SIAM={
 // A: purr groove. Kick on 1 and 3, a soft clap on 2 and 4, hats, a round bass; a marimba echoes the player's taps
 A:{step(o){const L=cp107L,d=o.d,s=o.s;if(s===0||s===4)L('kick',.75,d);if(s===2||s===6)L('clap',.45,d);L('hat',s%2?.4:.65,d);
   if(s===0)L('bass',.85,d,o.bass);if(s===4)L('bass',.55,d,o.bass*1.5);if(s===0&&!o.call){L('marimba',.25,d,o.chord[0]*2);L('marimba',.2,d,o.chord[2]*2);}
   if(o.tap)L('marimba',.45,d,o.mel);},
  end(d){const L=cp107L;L('crash',.6,d);L('bass',1,d,110);L('marimba',.6,d,440);L('marimba',.5,d,659.25);}},
 // B: bossa lounge. A soft 3-3-2 clave, a shaker, a gentle kick, a triangle bass (root and fifth); quiet square chords on
 // the player's bar only; a soft pluck echoes the taps
 B:{step(o){const L=cp107L,d=o.d,s=o.s;if(s===0||s===3||s===6)L('clave',.45,d);L('shaker',s%2?.3:.42,d);if(s===0||s===4)L('kick',.5,d);
   if(s===0||s===4)L('tri',.8,d,o.bass);if(s===3||s===7)L('tri',.55,d,o.bass*1.5);
   if(!o.call&&(s===2||s===6)){L('sq',.22,d,o.chord[0]*2);L('sq',.18,d,o.chord[1]*2);L('sq',.15,d,o.chord[2]*2);}
   if(o.tap)L('pluck',.5,d,o.mel);},
  end(d){const L=cp107L;L('clave',.6,d);L('tri',1,d,110);for(const f of [440,523.25,659.25])L('sq',.25,d,f);}},
 // C: chip chat. Chip drums, a bouncing triangle bass (root, octave); little square arpeggios between the player's taps;
 // a square blip echoes the taps
 C:{step(o){const L=cp107L,d=o.d,s=o.s;if(s===0||s===4)L('kick',.7,d);if(s===2||s===6)L('chipsnare',.6,d);if(s%2)L('hat',.35,d);
   if(s%2===0)L('tri',.85,d,s%4?o.bass*2:o.bass);
   if(!o.call&&!o.tap)L('sq',.24,d,o.chord[s%3]*2);if(o.tap)L('sq',.5,d,o.mel);},
  end(d){const L=cp107L;L('kick',.8,d);L('tri',1,d,110);L('blip',.7,d,880);L('sq',.4,d,659.25);}}};
// The Tortie's tracks: each a strut that stops dead on a stop (nothing sounds inside a stop, nothing spills into one).
// o: d, k, s, tap, i, mel, bass, slow, quickBar, back (the first slot after a stop), beat, intoStop (the next slot is a stop)
const CP107_TORT={
 // A: funky strut. Kick, snare on 2 and 4, hats, a gritty walking bass, a cowbell on the quick bars; a pluck plays the taps
 A:{step(o){const L=cp107L,d=o.d,s=o.s,b=o.bass;if(o.back||o.k===0)L('crash',.55,d);
   if(o.slow){if(s===0)L('kick',.9,d);if(s===4)L('snare',.9,d);if(s%2===0)L('hat',.55,d);if(s===0||s===6)L('grit',.8,d,s?b*1.5:b);}
   else{if(s===0||s===3||s===4)L('kick',.85,d);if(s===2||s===6)L('snare',.85,d);L('hat',s%2?.45:.7,d);
    if(o.quickBar){if(!o.intoStop)L('hat',.35,d+o.beat/2);if(s%2===0)L('cowbell',.3,d);}
    if(s%2===0)L('grit',.75,d,[b,b*1.5,b*2,b*1.5][s>>1]);}
   if(o.tap){L('pluck',1,d,o.mel);if(!o.quick)L('clap',.35,d);}},
  end(d){const L=cp107L;L('crash',.8,d);L('kick',1,d);L('bass',1,d,82.41);for(const f of [659.25,493.88,329.63])L('pluck',.8,d,f);}},
 // B: swing sashay. A swung shaker, brushes on 2 and 4, a walking triangle bass; muted-horn squares play the taps
 B:{step(o){const L=cp107L,d=o.d,s=o.s,b=o.bass;if(o.back||o.k===0)L('crash',.4,d);
   if(s%2===0)L('shaker',.55,d);else L('shaker',.38,d+o.beat*.33);
   if(o.slow){if(s===0)L('kick',.7,d);if(s===4)L('snare',.55,d);if(s===0||s===4)L('tri',.85,d,s?b*1.5:b);}
   else{if(s===0||s===4)L('kick',.6,d);if(s===2||s===6)L('snare',.5,d);if(s%2===0)L('tri',.85,d,[b,b*1.26,b*1.5,b*1.68][s>>1]);}
   if(o.tap){L('sq',.6,d,o.mel);L('marimba',.3,d,o.mel);}},
  end(d){const L=cp107L;L('crash',.6,d);L('tri',1,d,82.41);L('sq',.5,d,659.25);L('sq',.4,d,493.88);}},
 // C: disco diva. Four on the floor, open hats off the beat, claps on 2 and 4, an octave bass; strings play the taps
 C:{step(o){const L=cp107L,d=o.d,s=o.s,b=o.bass;if(o.back||o.k===0)L('crash',.6,d);
   if(o.slow){if(s===0||s===4)L('kick',.9,d);if(s===4)L('clap',.6,d);if(s%2)L('hat',.5,d);if(s%4===0)L('bass',.85,d,b);}
   else{if(s%2===0)L('kick',.9,d);else L('hat',.6,d);if(s===2||s===6)L('clap',.6,d);L('bass',.7,d,s%2?b*2:b);}
   if(o.tap){L('pluck',.8,d,o.mel);L('marimba',.45,d,o.mel*2);}},
  end(d){const L=cp107L;L('crash',.8,d);L('kick',1,d);L('bass',1,d,82.41);for(const f of [659.25,493.88,392])L('pluck',.7,d,f);}}};

function cp107SiamSchedule(D){const C=CP107.siam,now=danceNow(),lat=sfx.danceLatency(),L=cp107L,T=CP107_SIAM[D.music]||CP107_SIAM.A;
 while(D.sched<=D.n&&D.p0+D.sched*D.beat-now<.15+lat){const k=D.sched,d=D.p0+k*D.beat-now-lat;D.sched++;
  if(k<0){if(!D.rest[k])L('count',1,d,k===-D.per?1600:1200);L('hat',.5,d);continue;}
  if(k===D.n){T.end(d);L('yowl',1,d,880,.36);continue;}
  const f=cp107SiamAt(k),r=f.r;if(k===0)L('crash',.5,d);
  T.step({d,k,s:f.s,call:f.call,yowl:f.yowl,tap:f.tap,i:f.i,mel:f.i>=0?C.MEL[r][f.i]:0,bass:C.BASS[r],chord:C.CHORD[r],beat:D.beat});
  if(f.yowl){const P=C.CALLS[r],nx=P[f.i+1]!=null?P[f.i+1]:8;L('yowl',1,d,C.MEL[r][f.i],Math.min(nx-f.s,2)*D.beat*.8);}}}
function cp107TortSchedule(D){const C=CP107.tort,now=danceNow(),lat=sfx.danceLatency(),L=cp107L,T=CP107_TORT[D.music]||CP107_TORT.A;
 while(D.sched<=D.n&&D.p0+D.sched*D.beat-now<.15+lat){const k=D.sched,d=D.p0+k*D.beat-now-lat;D.sched++;
  if(k<0){if(!D.rest[k])L('count',1,d,k===-D.per?1600:1200);L('hat',.5,d);continue;}
  if(k===D.n){T.end(d);continue;}
  const f=cp107TortAt(k);
  if(f.stop){if(f.s===f.B.stop[0]){L('swish',1,d);L('tom',.5,d,90);}continue;}
  T.step({d,k,s:f.s,tap:f.tap,i:f.i,quick:f.quick,mel:f.tap?C.MEL[f.bar][f.i]:0,bass:C.BASS[f.bar],slow:f.slow,quickBar:f.B.t.some(u=>f.B.t.includes(u+1)),
   back:k>0&&cp107TortAt(k-1).stop,intoStop:cp107TortAt(k+1).stop,beat:D.beat});}}
const __cp107Sched=danceSchedule;danceSchedule=function(D){if(D&&D.siamese)return cp107SiamSchedule(D);if(D&&D.tortie)return cp107TortSchedule(D);return __cp107Sched.apply(this,arguments);};
// the pill (UAT only): right of the cue, under the lane; a tap on it is never a dance tap
function cp107PillRects(){const Y=DANCE_LANE_Y+40;return ['A','B','C'].map((k,i)=>({k,x:262+i*38,y:Y,w:34,h:24}));}
function cp107Pill(){const D=WILD.on&&WILD.dance;if(!D||!(D.siamese||D.tortie)||D.phase==='finale'||!cp107PillOn())return null;return {D,c:D.siamese?'siam':'tort'};}

// --- moves ---
const cp107E=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u);};
function cp107Bump(u,w){u/=w;return u<-1||u>1?0:.5+.5*Math.cos(Math.PI*u);}
// the Siamese at x (slots): yowl (singing, with its side), listen (the player's bar), pats per side, a bob on the beat
function cp107SiamState(x,D){const o={yowl:0,yside:1,listen:0,pat:{'-1':0,'1':0},bob:Math.max(0,Math.cos(Math.PI*x))*.5,sing:false};
 const k0=Math.floor(x);
 for(let k=k0-6;k<=k0+2;k++){if(k<0||k>=D.n)continue;const f=cp107SiamAt(k);const u=x-k;
  if(f.yowl){const P=CP107.siam.CALLS[f.r],nx=P[f.i+1]!=null?P[f.i+1]:8,len=Math.min(nx-f.s,3)*.92;
   const e=u>=-.15&&u<len?Math.min(cp107E((u+.15)/.25),1-cp107E((u-len+.35)/.35)):0;if(e>o.yowl){o.yowl=e;o.yside=f.i%2?1:-1;}if(u>=-.05&&u<len-.1)o.sing=true;}
  if(f.tap){const side=f.i%2?1:-1,b=cp107Bump(u,1);o.pat[side]=Math.max(o.pat[side],b);}}
 const r=Math.floor(Math.max(0,x)/16),inBar=x-r*16;o.listen=x>=0&&x<D.n&&inBar>=7.5?Math.min(cp107E((inBar-7.5)/.6),1-cp107E((inBar-15.4)/.6)):0;
 return o;}
function cp107SiamMotion(side,x,D){const st=cp107SiamState(x,D),Y=st.yowl,Ls=st.listen,b=st.bob;
 if(!side)return {x:6*Y*st.yside-5*Ls,y:-16*Y+3*b,r:-.1*Y*st.yside-.13*Ls+.03*b*(Math.floor(x)%2?1:-1)};
 const up=side===st.yside?Y:0,p=st.pat[side];
 return {x:-side*8*up+side*4*p,y:-34*up+22*p-4*b,r:side*.22*up-side*.12*p};}
// the Tortie at x (slots): steps per side, the stop (turned away, mitt on hip), the head toss
function cp107TortState(x,D){const o={step:{'-1':0,'1':0},sway:0,toss:0,stop:0,dir:1,looking:false};
 const k0=Math.floor(x);
 for(let k=k0-4;k<=k0+2;k++){if(k<0||k>=D.n)continue;const f=cp107TortAt(k);if(!f.tap)continue;const u=x-k,w=f.slow?1.8:f.quick?.7:1.1,side=f.i%2?1:-1,b=cp107Bump(u,w);
  o.step[side]=Math.max(o.step[side],b);o.sway+=side*b;if(!f.quick)o.toss+=side*b;}
 const bar=Math.floor(Math.max(0,x)/8),B=CP107.tort.BARS[bar];
 if(B&&B.stop&&x<D.n){const a=bar*8+B.stop[0],e=bar*8+B.stop[1]+1,u=x;o.stop=u>=a-.3&&u<e?Math.min(cp107E((u-a+.3)/.35),1-cp107E((u-e+.3)/.3)):0;o.dir=bar%4<2?1:-1;o.looking=u>=a-.1&&u<e-.15;}
 return o;}
function cp107TortMotion(side,x,D){const st=cp107TortState(x,D),S=st.stop,dir=st.dir,k=1-S;
 if(!side)return {x:(10*st.sway)*k+dir*18*S,y:-4*Math.abs(st.sway)*k-10*S,r:(.1*st.toss)*k+dir*.26*S};
 const p=st.step[side]*k,hip=side===dir?S:0;
 return {x:side*10*p+side*16*hip,y:26*p-28*hip,r:-side*.16*p+side*.34*hip};}
const __cp107Motion=pawMotion;
pawMotion=function(side=0){const D=WILD.on&&WILD.dance;if(D&&(D.siamese||D.tortie)){const x=danceBeatX();if(x!=null)return D.siamese?cp107SiamMotion(side,x,D):cp107TortMotion(side,x,D);}return __cp107Motion.apply(this,arguments);};
// faces: the Siamese's yawn face while it sings (as its Sonic meow shows it); the Tortie's Sharp Grin while she struts, Sweet while she looks away
function cp107Face(){const D=WILD.on&&WILD.dance;if(!D||!(D.siamese||D.tortie))return null;const x=danceBeatX();if(x==null)return null;
 if(D.siamese)return cp107SiamState(x,D).sing?'sing':null;return cp107TortState(x,D).looking?'away':'strut';}
const __cp107Head=petDrawHead;petDrawHead=function(img){const f=cp107Face();
 if(f==='strut'&&ART.headSharp)img=ART.headSharp;else if(f==='away'&&ART.headSweet)img=ART.headSweet;
 return __cp107Head.call(this,img);};
// the singing face is drawn the way the Siamese's own Sonic meow (CP-86) draws it: the yawn face over the head, no pupils
const __cp107Pupils=drawTrackingPupils;drawTrackingPupils=function(){
 if(cp107Face()==='sing'&&typeof CP75_ART!=='undefined'&&CP75_ART.siamese&&CP75_ART.siamese.face){ctx.save();ctx.translate(-10,-25);ctx.scale(420/1536,240/1024);ctx.drawImage(CP75_ART.siamese.face,0,0);ctx.restore();return;}
 return __cp107Pupils.apply(this,arguments);};

// --- the lane: the Siamese's yowls (hollow blue rings) and the Tortie's stops (an amber hold band); the cue below ---
const __cp107Draw=danceDraw;danceDraw=function(){const r=__cp107Draw.apply(this,arguments);const D=WILD.dance;if(!D||!(D.siamese||D.tortie)||D.phase==='finale')return r;
 const x=(danceNow()-D.p0)/D.beat,Y=DANCE_LANE_Y,px=D.px,ah=D.ahead,fade=Math.min(1,(time-D.started)/.25);
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=fade;
 ctx.save();ctx.beginPath();ctx.rect(20,Y-32,360,64);ctx.clip();
 if(D.siamese){for(let k=Math.max(0,Math.floor(x)-1);k<=Math.min(D.n-1,Math.floor(x)+Math.ceil(ah));k++){const f=cp107SiamAt(k);if(!f.yowl)continue;const u=k-x;if(u<-.3||u>ah)continue;
   ctx.globalAlpha=fade*(u<0?Math.max(0,1+u/.3):.9);for(const s of [-1,1]){const nx=200+s*u*px;ctx.lineWidth=3;ctx.strokeStyle='#8fd3ff';ctx.beginPath();ctx.arc(nx,Y,11,0,7);ctx.stroke();
    ctx.lineWidth=2;ctx.beginPath();ctx.arc(nx,Y,5,-.9,.9);ctx.stroke();}}}
 else{for(const [a,b] of D.quiet){const u0=a-.5-x,u1=b+.5-x;if(u1<-.3||u0>ah)continue;ctx.globalAlpha=fade*.85;
   for(const s of [-1,1]){const xa=200+s*Math.max(-.3,u0)*px,xb=200+s*Math.min(ah,u1)*px,l=Math.min(xa,xb),w=Math.abs(xb-xa);if(w<1)continue;
    uiRound(l,Y-9,w,18,9,'rgba(255,178,63,.35)','#ffb23f',2);const hx=200+s*u0*px;if(u0>-.3&&u0<ah){ctx.fillStyle='#ffb23f';ctx.fillRect(hx-6,Y-7,4,14);ctx.fillRect(hx+2,Y-7,4,14);}}}}
 ctx.restore();
 // the cue
 let cue=null,col='#ffe0f4';if(x>=-.5&&x<D.n){if(D.siamese){const inBar=((x%16)+16)%16;cue=x<0||inBar<7.6?['LISTEN','#8fd3ff']:['YOUR TURN','#ffd23f'];}
  else{const Q=D.quiet.find(([a,b])=>x>=a-.4&&x<b+.6);if(Q)cue=['HOLD','#ffb23f'];}}
 const P=cp107Pill(),cx=P?110:200;
 if(cue){ctx.globalAlpha=fade;ctx.textAlign='center';ctx.textBaseline='middle';uiRound(cx-50,Y+40,100,24,12,'rgba(26,10,44,.85)',cue[1],1.5);ctx.font='bold 13px system-ui';ctx.fillStyle=cue[1];ctx.fillText(cue[0],cx,Y+52);}
 if(P){ctx.globalAlpha=fade;ctx.textAlign='center';ctx.textBaseline='middle';uiRound(192,Y+38,186,28,14,'rgba(26,10,44,.85)','#ff9ad8',1.5);
  ctx.font='bold 12px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText('Music:',226,Y+52);
  for(const b of cp107PillRects()){const on=P.D.music===b.k;uiRound(b.x,b.y+2,b.w,b.h-4,10,on?'#ff7ad5':'rgba(255,255,255,.12)',on?'#ffffff':'rgba(255,255,255,.4)',1.2);
   ctx.font='bold 13px system-ui';ctx.fillStyle=on?'#2a0b3e':'#ffffff';ctx.fillText(b.k,b.x+b.w/2,Y+53);}}
 ctx.restore();return r;};
// a tap on the pill switches the music from the next note and remembers it; the pill's taps are never dance taps
const __cp107Pointer=wildPointer;wildPointer=function(e,p){const P=cp107Pill();
 if(P&&p&&p.x>=188&&p.x<=382&&p.y>=DANCE_LANE_Y+34&&p.y<=DANCE_LANE_Y+70){const b=cp107PillRects().find(b=>p.x>=b.x-2&&p.x<=b.x+b.w+2);
  if(b&&P.D.music!==b.k){P.D.music=b.k;CP107M.set(P.c,b.k);}return true;}
 return __cp107Pointer.apply(this,arguments);};
// ---------- end CP-107 ----------
