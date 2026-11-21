
// ---------- Dance beat A/B, all five Dance breaks (Jenny, Nov 21, approved verbatim: "Dances: beat strong in the count-in,
// then fades so the music leads; small buzz on my taps (stronger on perfect), not on every beat. 'Beat: A | B' pill (A =
// today, B = new) to compare." Her reason: "I really want to hear the music, and the beat is kind of drowning out the
// music.") ----------
// A = today: nothing changes. B:
//  - The guide beat is each dance's own drum layer (kick, snare, clap, hats, claves, shakers, cowbell, congas, toms, crashes;
//    there is no separate click). It plays full through the count-in and the first bar, then fades over the second bar down
//    to 35% (never silent) and stays there, so the melody, the bass and the cat's own voice carry the rhythm. Those melodic
//    parts are untouched, as are the tap sounds and the count-in clicks.
//  - Taps: a short phone buzz on every hit (12 ms) and a slightly stronger one (28 ms) on a tap right on the beat (within
//    40% of the timing window). Nothing on a miss, an off-beat tap or a beat with no tap; never one per beat. Phones (or
//    WebViews) that can't vibrate skip it quietly.
//  - A small UAT-only pill "Beat: A | B" above the lane during every Dance break; a tap switches at once and is remembered;
//    it is never a dance tap. Production (a build name without "UAT") has no pill and plays A until Jenny picks.
const BEATAB={KEY:'catpusher.uat.dancebeat.v1',LOW:.35,PERFECT:.4,BUZZ:12,BUZZ_PERFECT:28,
 DRUMS:['kick','snare','clap','hat','crash','chipsnare','shaker','clave','cowbell','conga','tom'],rec:null,buzzes:[],stats:{buzz:0,perfect:0}};
BEATAB.get=function(){try{const v=localStorage.getItem(BEATAB.KEY);if(v==='A'||v==='B')return v;}catch(e){}return 'A';};
BEATAB.set=function(v){if(v!=='A'&&v!=='B')return;try{localStorage.setItem(BEATAB.KEY,v);}catch(e){}try{diagEvent('beatab','beat='+v);}catch(e){}};
function beatabPillOn(){return typeof BUILD==='string'&&/\bUAT\b/.test(BUILD);}
// the drum layer's level for a note heard `delay` seconds from now: 1 through the count-in and the first bar, then down to
// LOW across the second bar (the Ragdoll's bars are 3 beats, the others' 4)
function beatabLevel(delay){const D=WILD.on&&WILD.dance;if(!D||D.phase==='finale'||BEATAB.get()!=='B')return 1;
 let lat=0;try{lat=sfx.danceLatency();}catch(e){}const beats=(danceNow()+delay+lat-D.p0)/D.beat/(D.per||1),bar=D.ragdoll?3:4;
 if(beats<bar)return 1;if(beats>=2*bar)return BEATAB.LOW;return 1-(1-BEATAB.LOW)*(beats-bar)/bar;}
for(const fn of ['danceLoud','cp94Loud']){const prev=sfx[fn];if(typeof prev!=='function')continue;
 sfx[fn]=function(kind,vol=1,delay=0,arg=0){const k=BEATAB.DRUMS.includes(kind)?beatabLevel(delay):1,v=vol*k;
  if(BEATAB.rec)BEATAB.rec.push([kind,+v.toFixed(3)]);return prev.call(this,kind,v,delay,arg);};}
// taps: the buzz (B only), after the game has judged the tap
const __beatabTap=danceTap;danceTap=function(e){const D=WILD.dance;if(!D||D.phase==='finale'||BEATAB.get()!=='B')return __beatabTap.apply(this,arguments);
 const h0=D.hits,now=danceNow(),stamp=e&&Number.isFinite(e.timeStamp)&&e.timeStamp>0&&Math.abs(performance.now()-e.timeStamp)<500?e.timeStamp/1000:now,adj=stamp-D.latency;
 const k=D.rest&&typeof danceSlot==='function'?danceSlot(D,adj):Math.round((adj-D.p0)/D.beat),err=Math.abs(adj-(D.p0+k*D.beat));
 const r=__beatabTap.apply(this,arguments);
 if(WILD.dance===D&&D.hits>h0){const perfect=err<=D.window*BEATAB.PERFECT,ms=perfect?BEATAB.BUZZ_PERFECT:BEATAB.BUZZ;BEATAB.stats.buzz++;if(perfect)BEATAB.stats.perfect++;
  if(BEATAB.buzzes.length<200)BEATAB.buzzes.push(ms);try{navigator.vibrate&&navigator.vibrate(ms);}catch(_){}}
 return r;};
// the pill: above the lane, left; a tap on it is never a dance tap
function beatabRects(){const Y=DANCE_LANE_Y-64;return {box:{x:18,y:Y,w:122,h:26},b:[{k:'A',x:70,y:Y+3,w:30,h:20},{k:'B',x:104,y:Y+3,w:30,h:20}]};}
function beatabPill(){const D=WILD.on&&WILD.dance;return !!(D&&D.phase!=='finale'&&beatabPillOn());}
const __beatabDraw=danceDraw;danceDraw=function(){const r=__beatabDraw.apply(this,arguments);if(!beatabPill())return r;const D=WILD.dance,R=beatabRects(),m=BEATAB.get();
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.globalAlpha=Math.min(1,(time-D.started)/.25);ctx.textAlign='center';ctx.textBaseline='middle';
 uiRound(R.box.x,R.box.y,R.box.w,R.box.h,13,'rgba(26,10,44,.85)','#ff9ad8',1.5);ctx.font='bold 12px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText('Beat:',44,R.box.y+13);
 for(const b of R.b){const on=m===b.k;uiRound(b.x,b.y,b.w,b.h,10,on?'#ff7ad5':'rgba(255,255,255,.12)',on?'#ffffff':'rgba(255,255,255,.4)',1.2);ctx.font='bold 13px system-ui';ctx.fillStyle=on?'#2a0b3e':'#ffffff';ctx.fillText(b.k,b.x+b.w/2,b.y+b.h/2+1);}
 ctx.restore();return r;};
const __beatabPointer=wildPointer;wildPointer=function(e,p){if(beatabPill()&&p){const R=beatabRects(),B=R.box;
  if(p.x>=B.x-4&&p.x<=B.x+B.w+4&&p.y>=B.y-6&&p.y<=B.y+B.h+6){const b=R.b.find(b=>p.x>=b.x-3&&p.x<=b.x+b.w+3);if(b&&b.k!==BEATAB.get())BEATAB.set(b.k);return true;}}
 return __beatabPointer.apply(this,arguments);};
// ---------- end Dance beat A/B ----------
