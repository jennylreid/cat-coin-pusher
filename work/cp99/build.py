"""UAT 99 = CP-79 Yawn sound as a Developer choice + CP-80 the Developer wheel on the Siamese board (edit + cp80-wheel.js)
+ CP-72 add-on: Zoomies sound as a Developer choice (edit: sfx._playBufH + cp72-zsound.js)
+ CP-72: no gold streaks / pusher glow during Zoomies (edit in z72Draw).
CP-79 Yawn sound as a Developer choice (Jenny, Nov 18: "put today, A2, B2 and AB in the next UAT as a Developer choice
(today's is the default). I'll pick on my phone."). Build name + the block cp79-yawn.js (the 3 cleaned sounds embedded).
Usage: python build.py          -> release.html on the base in release-version.json (published UAT 98, pinned once it is out)
       DEV=1 python build.py    -> release-dev.html on published UAT 96 (preparation only, never published)"""
from pathlib import Path
import json,hashlib,os,re
p=Path(__file__).parent;W=p.parent;DEV=os.environ.get('DEV')=='1'
v=json.loads((p/'release-version.json').read_text())
if DEV:base,pin,outn,name=W/'cp96'/'release.html',json.loads((W/'cp96'/'publication-manifest.json').read_text())['releaseHTMLSHA256'],'release-dev.html','2026.11.18 UAT 99 (dev on UAT 96)'
else:base,pin,outn,name=W/v['base']/'release.html',v['baseSHA256'],'release.html',v['displayName']
s=base.read_bytes();assert hashlib.sha256(s).hexdigest()==pin,('base changed',base);s=s.decode('utf-8')
m=re.search(r"const BUILD = '([^']+)';",s);EDITS=[(m.group(0),"const BUILD = '%s';"%name)]
# CP-80: the laser board's danceStart lets the Developer-forced wheel through (cp80-wheel.js sets W2_DEV_WHEEL)
EDITS.append(("danceStart=function(){if(WILD.laser||WILD.chase)return;return __laserDanceStart();};",
              "danceStart=function(){if((WILD.laser&&!W2_DEV_WHEEL)||WILD.chase)return;return __laserDanceStart();}; /* CP-80 */"))
# CP-72 add-on (Zoomies sound): a stoppable buffer player inside sfx (ac and master are private to it); used only by cp72-zsound.js
EDITS.append(("_playBufAt(b,v,delay=0,r=1){",
              "_playBufH(b,v){if(!this._w2ok()||!b||!(v>0))return null;const s=ac.createBufferSource(),g=ac.createGain();s.buffer=b;g.gain.value=v;s.connect(g);g.connect(master);s.start();"
              "return {stop:(f=.15)=>{try{const t=ac.currentTime;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(g.gain.value,t);g.gain.linearRampToValueAtTime(0,t+f);s.stop(t+f+.02);}catch(e){}}};}, /* CP-72 add-on */\n"
              "    _playBufAt(b,v,delay=0,r=1){"))
for a,b in EDITS:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
# CP-72 (Jenny, Nov 18: "remove the gold streaks"): the speed streaks and pusher glow at the top of z72Draw (drawing only)
EDITS.append((" // the pusher: speed streaks on its top and a warm glow on its face each stroke\n const a=Math.min(1,t/.25,(Z72.dur-t)/.4);if(a>0){const ph=pushPhase/PUSH_PERIOD,moving=(ph>.08&&ph<.53)||ph>=.61,fwd=ph<.61;ctx.globalAlpha=a;\n  const L=skyScreen(T.L+30,pusherY,22),R=skyScreen(T.R-30,pusherY,22);\n  if(moving){ctx.strokeStyle='rgba(255,214,120,.85)';ctx.lineCap='round';for(let i=0;i<6;i++){const fx=(i+.5)/6,x=L.x+(R.x-L.x)*fx,len=(fwd?26:16)*L.s*(1+.4*Math.sin(t*30+i*2));ctx.lineWidth=2.6*L.s;ctx.beginPath();ctx.moveTo(x,L.y-4*L.s);ctx.lineTo(x,L.y-4*L.s-len);ctx.stroke();}}\n  ctx.globalAlpha=a*(fwd&&moving?.45:.2);ctx.fillStyle='#ffb03a';ctx.fillRect(L.x,L.y-3*L.s,R.x-L.x,6*L.s);ctx.globalAlpha=1;}\n",
              ' /* CP-72 (Jenny, Nov 18: "remove the gold streaks"): no speed streaks or glow on the pusher during Zoomies. Nothing is drawn;\n'
              '    the canvas state the streaks left behind is kept, so the kittens drawn next look exactly as before. */\n'
              ' const a=Math.min(1,t/.25,(Z72.dur-t)/.4);if(a>0){const ph=pushPhase/PUSH_PERIOD,moving=(ph>.08&&ph<.53)||ph>=.61,L=skyScreen(T.L+30,pusherY,22);\n'
              "  if(moving){ctx.strokeStyle='rgba(255,214,120,.85)';ctx.lineCap='round';ctx.lineWidth=2.6*L.s;}ctx.fillStyle='#ffb03a';ctx.globalAlpha=1;}\n"))
for a,b in EDITS[-1:]:
    n=s.count(a);assert n==1,(a[:60],n);s=s.replace(a,b)
ADD=['cp79-yawn.js','cp80-wheel.js','cp72-zsound.js']
for f in ADD:
    add=(p/f).read_bytes().decode('utf-8');i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/('edits-dev.json' if DEV else 'edits.json')).write_text(json.dumps({'base':str(base),'edits':EDITS,'appendedBeforeLastScriptClose':ADD},indent=1),encoding='utf-8')
out=s.encode('utf-8');(p/outn).write_bytes(out);print(p/outn,hashlib.sha256(out).hexdigest())
