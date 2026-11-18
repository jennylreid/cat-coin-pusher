# CP-57 title roll-in, UAT 87 prep (Jenny via PM, Nov 17): pick the title sound on the phone.
# - sfx.pg('coin') (each letter of "CatCoin" landing; also the developer-only title pile-up): with Title sound A, B or C, one whole
#   real coin clink per call (the CP-57 candidate taps: soft 7 ms attack, natural ring), pitch 0.96-1.08 with neighbours at least 2%
#   apart, at production's level (each tap's gain matched to production's clink at v 0.8, scaled by v like production). With D, or
#   while the takes are still decoding: production 2026.11.16.2's exact line (one code-made clink, pitch 1-1.4).
# - Developer section in Settings: "Title sound: A/B/C/D" (cycles, saved on the phone, default A) and "Replay title".
# - Nothing else changes. Usage: python build-title87.py <base release.html> <its sha256> <out> [version json]
from pathlib import Path
import json, hashlib, sys, re, base64
p = Path(__file__).parent
BASE, PIN, OUT = Path(sys.argv[1]), sys.argv[2], Path(sys.argv[3])
s = BASE.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(s.encode('utf-8')).hexdigest() == PIN, 'baseline hash mismatch'
if len(sys.argv) > 4:
    v = json.loads(Path(sys.argv[4]).read_text()); m = re.search(r"const BUILD = '([^']*)';", s); s = s.replace(m.group(0), "const BUILD = '%s';" % v['displayName'], 1)
cand = json.loads((p.parent.parent / 'tickets/CP-57-evidence/title-candidates.json').read_text())
G = {k: round(cand[k]['tapGainToMatchProduction'] / .55, 5) for k in 'ABC'}   # through the effects master 0.55, at v 0.8
TAPS = {k: base64.b64encode((p / 'taps' / f'tap-{k}.mp3').read_bytes()).decode() for k in 'ABC'}
def rep(old, new):
    global s
    assert s.count(old) == 1, (old[:80], s.count(old)); s = s.replace(old, new)
rep("else if(kind==='coin'){CP54.coin(.35*v/.8,true);}",
    "else if(kind==='coin'){if(!CP57T.tap(v))this._pgSteel(t,.35*v,1+Math.random()*.4,false);} // CP-57: Title sound A/B/C (real coin clinks); D = production's clink")
anchor = "// decode the takes early\n"
assert s.count(anchor) == 1
block = ("// CP-57 (Jenny, Nov 17): the title's letter sound, picked on the phone (Developer > Title sound A/B/C/D, default A). A-C: one whole\n"
 "// real coin clink per letter (soft attack, natural ring, slight pitch change), at production's level; D: production's own clink.\n"
 "var CP57T={KEY:'catpusher.uat.titlesound.v1',sel:'A',G:" + json.dumps(G) + ",B64:" + json.dumps(TAPS) + ",bufs:{},asked:false,lastP:1,\n"
 " load(){if(this.asked)return;this.asked=true;for(const [k,s] of Object.entries(this.B64)){try{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);\n"
 "  if(!sfx._dec(u.buffer,x=>{this.bufs[k]=x;}))this.asked=false;}catch(e){this.asked=false;}}},\n"
 " tap(v){try{if(this.sel==='D'||S.muted)return false;this.load();const b=this.bufs[this.sel];if(!b)return false;\n"
 "  let p;do{p=.96+Math.random()*.12;}while(Math.abs(p-this.lastP)<.02);this.lastP=p;return sfx._playBufAt(b,this.G[this.sel]*(v/.8),0,p);}catch(e){return false;}}};\n"
 "try{const t=localStorage.getItem(CP57T.KEY);if(['A','B','C','D'].includes(t))CP57T.sel=t;}catch(e){}\n"
 "{const __cp57tUpdate=update;update=function(dt){__cp57tUpdate(dt);if(!S.muted)try{CP57T.load();}catch(e){}};}\n"
 "{const __cp57tDev=pgDevHtml;pgDevHtml=function(){const h=__cp57tDev(),b='min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;padding:0 10px';\n"
 " const row='<div style=\"display:flex;align-items:center;gap:8px;margin:4px 0\"><span style=\"flex:1\">Title sound</span><button id=\"pg-tsnd\" style=\"'+b+'\">'+CP57T.sel+(CP57T.sel==='D'?' (production)':'')+'</button></div>'\n"
 "  +'<button id=\"pg-treplay\" class=\"wide\">Replay title</button>';\n"
 " return h.includes('<button id=\"pg-title\" class=\"wide\">')?h.replace('<button id=\"pg-title\" class=\"wide\">',row+'<button id=\"pg-title\" class=\"wide\">'):h.replace('<h3 style=\"margin-top:10px\"><span>MODES',row+'<h3 style=\"margin-top:10px\"><span>MODES');};}\n"
 "{const __cp57tBind=wildDevBind;wildDevBind=function(panel){__cp57tBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;\n"
 " const ts=box.querySelector('#pg-tsnd');if(ts)ts.onclick=()=>{const L=['A','B','C','D'];CP57T.sel=L[(L.indexOf(CP57T.sel)+1)%4];try{localStorage.setItem(CP57T.KEY,CP57T.sel);}catch(e){}\n"
 "  try{diagEvent('title-sound',CP57T.sel);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};\n"
 " const tr=box.querySelector('#pg-treplay');if(tr)tr.onclick=()=>{panel.style.display='none';PGU.title={t:0,coins:[],snd:0};PGU.screen='title';};};}\n")
s = s.replace(anchor, anchor + block, 1)
OUT.write_text(s, encoding='utf-8', newline=''); print(OUT, hashlib.sha256(s.encode('utf-8')).hexdigest(), G)
