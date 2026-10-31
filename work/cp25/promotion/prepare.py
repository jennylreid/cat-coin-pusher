from pathlib import Path
import json,hashlib,shutil,zipfile
from datetime import datetime,timezone,timedelta
r=Path.cwd();p=r/'work/cp25/promotion';e=r/'tickets/CP-25-evidence/promotion';e.mkdir(exist_ok=True)
sha=lambda b:hashlib.sha256(b).hexdigest()
u=r/'work/cp25/installer-fix';assert sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes())=='3e5c234e56f72b73c25aa3fd7ad8edd41744bf3993bbb2090a6059edef16fb72'
v=int(datetime.now(timezone(timedelta(hours=-4))).strftime('%Y%m%d%H%M%S'));name='2026.10.31'
old=json.loads((r/'phone/CatCoinPusher-game.json').read_bytes());assert old['version']==20261027120233
pin={'version':v,'displayName':name,'apkVersion':17,'oldJSONSHA256':sha((r/'phone/CatCoinPusher-game.json').read_bytes()),'oldAPKSHA256':sha((r/'CatCoinPusher.apk').read_bytes()),'uatAPKSHA256':sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes())}
h=(u/'release.html').read_text(encoding='utf8');adapt=[]
def rep(a,b):
 global h
 assert a in h,a;h=h.replace(a,b);adapt.append({'before':a,'after':b})
rep("const BUILD = '2026.10.30 UAT 24';",f"const BUILD = '{name}';")
rep('<title>Cat Pusher UAT</title>','<title>CatCoin</title>')
rep('catpusher.uat.','catpusher.')
rep('<h2>UAT Settings</h2><button id="diag-send-file" class="wide">Send performance log</button><button id="diag-link-file" class="wide">Connect log file to OneDrive</button><button id="diag-share-file" class="wide">Share log file to OneDrive</button><p id="diag-file-status"></p>', '<h2>Settings</h2>')
# Native OneDrive diagnostics omitted entirely; retain local developer-only export if needed.
a=h.index(" panel.querySelector('#diag-send-file').onclick=");b=h.index(" panel.querySelector('#sound-test').onclick=",a);rep(h[a:b],'')
for id in ['safe-guides','happy-test','pickup-style','pickup-item','pickup-preview']:
 a=h.index('<button id="'+id+'"');b=h.index('</button>',a)+9;tag=h[a:b]
 # Wrap complete existing concatenation groups below, handlers guard hidden elements.
 rep("panel.querySelector('#"+id+"').onclick=", "const "+id.replace('-','_')+"=panel.querySelector('#"+id+"');if("+id.replace('-','_')+")"+id.replace('-','_')+".onclick=")
rep("+'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>'", "+(S.dev?'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>':'')")
rep("+'<button id=\"pickup-style\" class=\"wide\">Pickup style: '+PICKUP_NAMES[pickupChoice]+'</button><button id=\"pickup-item\" class=\"wide\">Preview item: '+PRIZE_NAMES[pickupPreviewItem]+'</button><button id=\"pickup-preview\" class=\"wide\">Preview pickup (no reward)</button>'", "+(S.dev?'<button id=\"pickup-style\" class=\"wide\">Pickup style: '+PICKUP_NAMES[pickupChoice]+'</button><button id=\"pickup-item\" class=\"wide\">Preview item: '+PRIZE_NAMES[pickupPreviewItem]+'</button><button id=\"pickup-preview\" class=\"wide\">Preview pickup (no reward)</button>':'')")
rep("+'<p>Calm is the default gameplay face. Rest is the small smile with raised mitts, used for board clear. The original toothy Waiting face is saved for a future power. Recovery returns from Quake. Happy usage is TBD; preview only.</p>'", "+(S.dev?'<p>Calm is the default gameplay face. Rest is the small smile with raised mitts, used for board clear. The original toothy Waiting face is saved for a future power. Recovery returns from Quake. Happy usage is TBD; preview only.</p>':'')")
# No automatic player diagnostics. All automatic entry points become no-ops outside Developer mode.
for fn in ['diagEvent','diagInput','diagEndHold','diagDrop','diagFrame','diagFlush','diagPersist']:
 import re
 pattern=r'(function '+fn+r'\([^\n]*?\)\{)';h,n=re.subn(pattern,r'\1if(!S.dev)return;',h,count=1);assert n==1,fn
rep("try{const raw=localStorage.getItem(DIAG_KEY);", "try{const raw=S.dev?localStorage.getItem(DIAG_KEY):null;")
(p/'release.html').write_text(h,encoding='utf8',newline='')
# Begin with production native baseline: production identity/preferences/URI retained; no UAT diagnostic bridge/provider.
android=p/'android';shutil.copytree(r/'work/prod04/android',android,ignore=shutil.ignore_patterns('build','.gradle'),dirs_exist_ok=True)
g=android/'app/build.gradle';t=g.read_text();t=t.replace('versionCode 16','versionCode 17').replace("versionName '2026.10.16'",f"versionName '{name}'").replace('    buildTypes {','    buildFeatures { buildConfig true }\n    buildTypes {');g.write_text(t)
j=android/'app/src/main/java/com/jenny/catpusher/MainActivity.java';t=j.read_text();a=t.index('    private int versionCode() {');b=t.index('\n    /**',a);t=t[:a]+'    private int versionCode() { return BuildConfig.VERSION_CODE; }\n'+t[b:];j.write_text(t)
assets=android/'app/src/main/assets'
# Remove obsolete production baseline assets only inside the new isolated staging directory.
assert assets.resolve().is_relative_to(p.resolve())
for f in assets.rglob('*'):
 if f.is_file():f.chmod(0o666);f.unlink()
with zipfile.ZipFile(u/'CatCoinPusher-UAT.apk') as z:
 for f in z.namelist():
  if f.startswith('assets/') and not f.endswith('/'):
   dest=assets/f[7:];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(z.read(f))
(assets/'index.html').write_bytes((p/'release.html').read_bytes());(assets/'version.txt').write_text(str(v));(assets/'update-url.txt').write_bytes((r/'work/prod04/android/app/src/main/assets/update-url.txt').read_bytes())
assert (assets/'update-url.txt').read_text().strip()==(r/'work/prod04/download-url.txt').read_text().strip()
pin['adaptations']=adapt;pin['productionNativeBaseline']='work/prod04/android';pin['diagnostics']='Native OneDrive bridge omitted; automatic local hooks Developer-only'
(p/'manifest.json').write_text(json.dumps(pin,indent=2));print({k:v for k,v in pin.items() if k!='adaptations'})
