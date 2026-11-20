p='cp94-orange-dance.js';s=open(p,encoding='utf-8').read()
def cut(a,b,new):
    global s
    i=s.index(a);j=s.index(b);s=s[:i]+new+s[j:]
cut("const CP94={","CP94.get=function",r"""const CP94={bpm:108,per:2,window:.15,px:36,ahead:5,
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
 const quick=pat.includes(s-1)||pat.includes(s+1);let r0=s;while(pat.includes(r0-1))r0--;let r1=s;while(pat.includes(r1+1))r1++;
 return {i,type:quick?'quick':s%2?'pounce':'beat',r0,len:r1-r0+1,step:s-r0};};
""")
cut("const CP94_TRACKS={","function cp94Schedule(D){",r"""const CP94_TRACKS={
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
""")
a="""  const bar=(k/8|0)%CP94.BARS.length,s=k%8,pat=CP94.BARS[bar],i=pat.indexOf(s);
  T.step({d,k,bar,s,i,tap:i>=0,triple:pat.length===5&&i>=2,mel:i>=0?CP94.MEL[bar][i]:0,bass:CP94.BASS[bar],fifth:CP94.FIFTH[bar],chord:CP94.CHORD[bar]});"""
assert s.count(a)==1
s=s.replace(a,"""  const bar=(k/8|0)%CP94.BARS.length,s=k%8,f=CP94.info(bar,s);
  T.step({d,k,bar,s,i:f?f.i:-1,tap:!!f,quick:!!f&&f.type==='quick',pounce:!!f&&f.type==='pounce',step:f?f.step:0,half:D.beat/2,
   mel:f?CP94.MEL[bar][f.i]:0,bass:CP94.BASS[bar],fifth:CP94.FIFTH[bar],chord:CP94.CHORD[bar]});""")
cut("// a press: travels down","const __cp94Motion=pawMotion;",r"""// a press: travels over the slot before the tap, strongest on it, back over the slot after
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
""")
a="""function cp94Grin(){const D=WILD.on&&WILD.dance;if(!D||!D.orange)return false;const x=danceBeatX();return x!=null&&cp94State(x,D).grin;}"""
assert s.count(a)==1
s=s.replace(a,"""function cp94Face(){const D=WILD.on&&WILD.dance;if(!D||!D.orange)return null;const x=danceBeatX();if(x==null)return null;const st=cp94State(x,D);return st.wild?'wild':st.grin?'grin':null;}
function cp94Grin(){return cp94Face()==='grin';}""")
a="const __cp94Head=petDrawHead;petDrawHead=function(img){if(cp94Grin()&&ART.headSharp)img=ART.headSharp;return __cp94Head.call(this,img);};"
assert s.count(a)==1
s=s.replace(a,"const __cp94Head=petDrawHead;petDrawHead=function(img){const f=cp94Face();if(f==='grin'&&ART.headSharp)img=ART.headSharp;else if(f==='wild'&&ART.headWild)img=ART.headWild;return __cp94Head.call(this,img);};")
open(p,'w',encoding='utf-8').write(s)
# voices: grit (gritty saw bass) and tom
b=open('build.py',encoding='utf-8').read()
a="""  "else if(kind==='stopF')"""
assert b.count(a)==1
b=b.replace(a,"""  "else if(kind==='grit'){tone(arg,t,.16,'sawtooth',.06*v,arg*.98);tone(arg/2,t,.14,'square',.03*v);}"
  "else if(kind==='tom'){tone(arg,t,.25,'sine',.3*v,arg*.55);noise(t,.04,.08*v,900,1);}"
"""+a,1)
open('build.py','w',encoding='utf-8').write(b)
print('ok')
