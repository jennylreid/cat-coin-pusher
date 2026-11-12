# One-off: Developer dials for the Wild timer and starting coins (PM, Nov 11).
from pathlib import Path
p=Path(__file__).parent/'wild35.js';s=p.read_text(encoding='utf-8')
def r(a,b):
    global s
    assert s.count(a)==1,a;s=s.replace(a,b)
r("const WILD_COLLECTION=","var WILD_SECONDS=70,WILD_COINS=130; // Developer dials (Settings > Wild board) can change both; saved on this phone\nconst WILD_COLLECTION=")
r("WILD_SECONDS=70,WILD_COINS=130,WILD_TURBO_AT=25","WILD_TURBO_AT=25")
s+='''// Developer dials: Wild timer (30-180 s) and Wild starting coins (30-400). Defaults 70 s and 130 coins.
const WILD_DIAL_KEY='catpusher.uat.wild.v1',WILD_DIALS={seconds:[70,30,180,5,'Wild timer',' s'],coins:[130,30,400,10,'Wild starting coins','']};
try{const w=JSON.parse(localStorage.getItem(WILD_DIAL_KEY)||'null');if(w){if(Number.isFinite(+w.seconds))WILD_SECONDS=Math.min(180,Math.max(30,+w.seconds));if(Number.isFinite(+w.coins))WILD_COINS=Math.min(400,Math.max(30,+w.coins));}}catch(e){}
function wildDial(k){return k==='seconds'?WILD_SECONDS:WILD_COINS;}
function stepWildDial(k,dir){const [,lo,hi,st]=WILD_DIALS[k],x=Math.min(hi,Math.max(lo,wildDial(k)+dir*st));if(k==='seconds')WILD_SECONDS=x;else WILD_COINS=x;try{localStorage.setItem(WILD_DIAL_KEY,JSON.stringify({seconds:WILD_SECONDS,coins:WILD_COINS}));}catch(e){}}
function wildDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="wild-dev"><h3><span>Wild board</span><span>tuning</span></h3>'+Object.keys(WILD_DIALS).map(k=>'<div style="display:flex;align-items:center;gap:8px;margin:6px 0"><button data-wild="'+k+'" data-dir="-1" style="'+b+'">−</button><span style="flex:1;text-align:center">'+WILD_DIALS[k][4]+': '+wildDial(k)+WILD_DIALS[k][5]+'</span><button data-wild="'+k+'" data-dir="1" style="'+b+'">+</button></div>').join('')+'<p style="margin:4px 0;font-size:13px;opacity:.8">Used from the next Wild round (GO or Play again).</p><button id="wild-dev-reset" class="wide">Wild defaults (70 s, 130 coins)</button></div>';}
function wildDevBind(panel){const box=panel.querySelector&&panel.querySelector('#wild-dev');if(!box)return;
 for(const btn of box.querySelectorAll('[data-wild]'))btn.onclick=()=>{stepWildDial(btn.dataset.wild,+btn.dataset.dir);try{diagEvent('wild-tuning',btn.dataset.wild+'='+wildDial(btn.dataset.wild));}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 box.querySelector('#wild-dev-reset').onclick=()=>{WILD_SECONDS=70;WILD_COINS=130;try{localStorage.removeItem(WILD_DIAL_KEY);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};}
'''
p.write_text(s,encoding='utf-8')
b=Path(__file__).parent/'build.py';t=b.read_text(encoding='utf-8')
t=t.replace("""a = s.index('// Local UAT diagnostics:')""","""# Developer dials for the Wild timer and starting coins, under the Prize feedback dials.
rep("Reset tuning to defaults</button></div>':'')", "Reset tuning to defaults</button></div>':'')+(S.dev?wildDevHtml():'')")
rep("openCredits();panel.scrollTop=top;};}", "openCredits();panel.scrollTop=top;};}wildDevBind(panel);")
a = s.index('// Local UAT diagnostics:')""")
b.write_text(t,encoding='utf-8')
print('ok')
