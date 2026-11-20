"""CP-94 Orange dance: build name + small in-place edits to the Dance break (each passes straight through for the Tuxedo, where
D.rest / D.per / D.px are unset) + the CP-94 block appended before the last </script>.
Usage: python build.py -> release.html on the base in release-version.json"""
from pathlib import Path
import json,hashlib,re
p=Path(__file__).parent;W=p.parent;v=json.loads((p/'release-version.json').read_text())
base=W/v['base']/'release.html';s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==v['baseSHA256'],('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%v['displayName'])]
T='/*CP-94*/'
EDITS+=[
 # judge: the nearest tap slot (rests skipped); off the beat blocks the next tap slot
 ("const adj=stamp-D.latency,k=Math.round((adj-D.p0)/D.beat),err=adj-(D.p0+k*D.beat);",
  "const adj=stamp-D.latency,k=D.rest?danceSlot(D,adj):Math.round((adj-D.p0)/D.beat),err=adj-(D.p0+k*D.beat);"+T),
 ("D.blocked=err<0?k:k+1;","D.blocked=err<0?k:D.rest?danceNextTap(D,k):k+1;"+T),
 # tap log and the learned offset: the slot the judge used; taps near a rest don't teach the offset
 ("const k0=Math.round((stamp-D.p0)/D.beat),raw=","const k0=D.rest?danceSlot(D,stamp-D.latency):Math.round((stamp-D.p0)/D.beat),raw="),
 ("k0>=-DANCE_COUNT_IN&&k0<D.n","k0>=-DANCE_COUNT_IN*(D.per||1)&&k0<D.n&&!(D.rest&&D.rest[k0])"),
 ("off=((o+b/2)%b+b)%b-b/2","off=D.rest?o:((o+b/2)%b+b)%b-b/2"),
 ("f.off/D.beat*68","f.off/D.beat*(D.px||68)"),
 # the lane: no notes on rests, closer spacing and a longer look-ahead on the half-beat grid
 ("for(let k=Math.max(-DANCE_COUNT_IN,Math.floor(x)-1);k<=Math.min(D.n-1,Math.floor(x)+3);k++){const u=k-x;if(u<-.3||u>2.6)continue;",
  "for(let k=Math.max(-DANCE_COUNT_IN*(D.per||1),Math.floor(x)-1);k<=Math.min(D.n-1,Math.floor(x)+(D.ahead?Math.ceil(D.ahead):3));k++){const u=k-x;if(u<-.3||u>(D.ahead||2.6)||(D.rest&&D.rest[k]))continue;"+T),
 ("const nx=200+s*u*68;","const nx=200+s*u*(D.px||68);"),
 ("near=Math.max(0,1-Math.abs(ph)*4)","near=D.rest&&D.rest[Math.round(x)]?0:Math.max(0,1-Math.abs(ph)*4)"),
 ("bi=x<0?-1:Math.floor(x+.5)%4","bi=x<0?-1:Math.floor(x/(D.per||1)+.5)%4"),
 ("if(x<0){const c=Math.ceil(-x);ctx.globalAlpha=fade*Math.min(1,(1-(c+x))*3+.2);",
  "if(x<0){const xq=x/(D.per||1),c=Math.ceil(-xq);ctx.globalAlpha=fade*Math.min(1,(1-(c+xq))*3+.2);"+T),
 ("if(x<0)return {intro:true,t:Math.max(0,(x+DANCE_COUNT_IN)/DANCE_COUNT_IN)*1.667};",
  "if(x<0)return {intro:true,t:Math.max(0,(x/(D.per||1)+DANCE_COUNT_IN)/DANCE_COUNT_IN)*1.667};"+T),
 # the meter: right of the Treat toss slot on the Orange's board (0 elsewhere)
 ("x0=W-Math.max(8,hud.right+10)-124,y=hud.bannerY,w=124,",
  "x0=W-Math.max(8,hud.right+10)-124+(typeof danceMeterShift==='function'?danceMeterShift():0),y=hud.bannerY,w=124-(typeof danceMeterShift==='function'?danceMeterShift():0),"),
 # perfect = every tap slot hit (the Tuxedo: every beat, as before)
 ("D.perfect=D.hits===D.n;","D.perfect=D.hits===(D.taps||D.n);"),
 # sounds: the Orange's voices on the Dance break's music bus (the Tuxedo's voices untouched)
 ("danceLoud(kind,vol=1,delay=0,arg=0){if(inBackground||document.hidden||!ready())return;const m=master,b=this._dBus();master=b;try{this.dance(kind,vol,delay,arg);}finally{master=m;}},",
  "danceLoud(kind,vol=1,delay=0,arg=0){if(inBackground||document.hidden||!ready())return;const m=master,b=this._dBus();master=b;try{this.dance(kind,vol,delay,arg);}finally{master=m;}},"
  "cp94Loud(kind,vol=1,delay=0,arg=0){if(inBackground||document.hidden||!ready())return;const m=master,b=this._dBus();master=b;try{"
  "const v=vol*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0))return;const t=ac.currentTime+Math.max(0,delay);"
  "if(kind==='pluck'){tone(arg,t,.2,'sawtooth',.045*v,arg*.995);tone(arg*2,t,.09,'square',.014*v);tone(arg,t,.24,'triangle',.06*v);}"
  "else if(kind==='cowbell'){tone(587,t,.13,'square',.03*v);tone(845,t,.13,'square',.024*v);noise(t,.03,.04*v,3000,2);}"
  "else if(kind==='clave'){tone(2500,t,.05,'sine',.12*v);tone(1800,t,.035,'triangle',.05*v);}"
  "else if(kind==='conga'){tone(arg,t,.2,'sine',.24*v,arg*.72);noise(t,.02,.06*v,1200,1);}"
  "else if(kind==='shaker'){noise(t,.06,.07*v,7000,1.5);}"
  "else if(kind==='marimba'){tone(arg,t,.3,'sine',.15*v);tone(arg*4,t,.06,'sine',.03*v);bell(t,arg*2,.02*v,.18);}"
  "else if(kind==='sq'){tone(arg,t,.15,'square',.034*v);}"
  "else if(kind==='tri'){tone(arg,t,.24,'triangle',.2*v);}"
  "else if(kind==='blip'){tone(arg,t,.08,'square',.026*v,arg*1.5);}"
  "else if(kind==='chipsnare'){noise(t,.12,.22*v,2600,.6);tone(180,t,.06,'square',.05*v,110);}"
  "else if(kind==='grit'){tone(arg,t,.16,'sawtooth',.06*v,arg*.98);tone(arg/2,t,.14,'square',.03*v);}"
  "else if(kind==='tom'){tone(arg,t,.25,'sine',.3*v,arg*.55);noise(t,.04,.08*v,900,1);}"
  "else if(kind==='stopF'){noise(t,1.4,.2*v,6000,.5);[349.23,440,523.25,698.46].forEach(f=>{tone(f,t,1,'sawtooth',.04*v);tone(f,t,1.2,'triangle',.07*v);});tone(87.31,t,.8,'sine',.4*v,44);}"
  "else this.dance(kind,vol,delay,arg);"
  "}finally{master=m;}}, /* CP-94 Orange dance voices */"),
]
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp94-orange-dance.js','cp98-orange-eyes.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+chr(10)+s[i:]
(p/'edits.json').write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/'release.html').write_bytes(out);print(p/'release.html',hashlib.sha256(out).hexdigest())
