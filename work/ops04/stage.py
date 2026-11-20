# OPS-04 Package trim, UAT 121 staging: complete game-only update for installed APK7 on the published base in release-version.json.
#   python stage.py --boot-only ; (checks + real Chrome probe/audio checks) ; python stage.py      (DEV=1: dev name, boot121dev)
# Every runtime file is carried over byte for byte from the published base JSON except:
#   removed, provably unused: img/art/uat18-soft-paw.png, img/art/head-waiting.webp (approved art; source kept in work/cp100-103/art)
#   removed, intended (CP-90 rejected): img/art/cp90-ginger-run.webp, cp90-cream-run.webp, cp90-ginger-peek.webp
#   re-saved losslessly (same name, decoded RGBA pixels asserted identical): every PNG over 100 KB
#   replaced: sounds/effects/paw-dance.wav -> paw-dance.flac (decoded PCM asserted identical)
#   index.html: build.py (CP-90 block cut, FLAC path, build name)
from pathlib import Path
import json,base64,hashlib,subprocess,sys,os,io
from PIL import Image
p=Path(__file__).parent;r=p.parents[1];DEV=os.environ.get('DEV')=='1'
sha=lambda b:hashlib.sha256(b).hexdigest()
v=json.loads((p/'release-version.json').read_text());uat=v['displayName'].split()[-1]
B=p.parent/v['base'];pin=json.loads((B/'publication-manifest.json').read_text())
e=r/(f'tickets/OPS-04-evidence/uat{uat}'+('-dev' if DEV else ''));e.mkdir(parents=True,exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();apk=(r/'uat/CatCoinPusher-UAT.apk').read_bytes()
assert sha(raw)==pin['stagedJSONSHA256'] and sha(apk)==pin['apkSHA256'],'UAT channel is not '+pin['displayName']
assert v['baseSHA256']==pin['releaseHTMLSHA256'],'release-version.json base pin is not the published base'
u=json.loads(raw)
assert u['version']==pin['version'] and u['apkVersion']==7 and v['version']>u['version'] and v['apkVersion']==7
assert base64.b64decode(u['files']['index.html'])==(B/'release.html').read_bytes(),'published index.html is not the base release.html'
rel=p/('release-dev.html' if DEV else 'release.html')
def build():subprocess.run(['python',str(p/'build.py')],check=True,env={**os.environ});return rel.read_bytes()
h=build();assert h==build(),'build not reproducible'
pub={k:base64.b64decode(b) for k,b in u['files'].items()}
UNUSED=['img/art/uat18-soft-paw.png','img/art/head-waiting.webp']
CP90=['img/art/cp90-ginger-run.webp','img/art/cp90-cream-run.webp','img/art/cp90-ginger-peek.webp']
for k in UNUSED+CP90:assert k in pub,k
for k in UNUSED:assert Path(k).name not in h.decode('utf-8') and Path(k).stem not in h.decode('utf-8'),k
files=dict(pub);REMOVED={k:len(files.pop(k)) for k in UNUSED+CP90}
files['index.html']=h;RESAVED={}
for k in sorted(files):
    if not k.endswith('.png') or len(files[k])<=100_000:continue
    im=Image.open(io.BytesIO(files[k]));im.load();buf=io.BytesIO();im.save(buf,'PNG',optimize=True);b=buf.getvalue()
    assert Image.open(io.BytesIO(b)).convert('RGBA').tobytes()==im.convert('RGBA').tobytes() and Image.open(io.BytesIO(b)).size==im.size,'not pixel-identical: '+k
    if len(b)<len(files[k]):RESAVED[k]={'from':len(files[k]),'to':len(b),'sha256':sha(b)};files[k]=b
wav=files.pop('sounds/effects/paw-dance.wav');fl=(p/'reenc/paw-dance.flac').read_bytes()
def pcm(b,ext):
    t=p/('_pcm.'+ext);t.write_bytes(b)
    try:return subprocess.run(['ffmpeg','-v','error','-i',str(t),'-f','s16le','-'],capture_output=True,check=True).stdout
    finally:t.unlink()
pw,pf=pcm(wav,'wav'),pcm(fl,'flac');assert pw==pf and len(pw)==2765074*4,'FLAC not sample-identical'
files['sounds/effects/paw-dance.flac']=fl
G=p/(f'boot{uat}'+('dev' if DEV else ''));wrote=0
for f in [x for x in G.rglob('*') if x.is_file()] if G.exists() else []:
    if f.relative_to(G).as_posix() not in files:f.unlink()
for k,b in files.items():
    f=G/k
    if not f.exists() or f.read_bytes()!=b:f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b);wrote+=1
print('boot folder',G,'files',len(files),'written',wrote)
if '--boot-only' in sys.argv or DEV:sys.exit(0)
NEED=['checks121.json','checks64-on121.json','checks72-on121.json','checks94-on121.json','checks72s-on121.json','checks80-on121.json','real-browser-probe.json','audio-check.json']
for n in NEED:assert (e/n).exists(),('missing result',n)
for n in [x for x in NEED if x.startswith('checks')]:
    c=json.loads((e/n).read_text(encoding='utf-8'));assert Path(c['build'])==rel.resolve(),(n,'not run on this release.html')
    assert c['passed'] is True and not c['failed'],(n,c['failed'])
pr=json.loads((e/'real-browser-probe.json').read_text());assert pr['title'] and not pr['errorsNew'] and not pr['missingNew'] and pr['dir']==str(G.resolve()),'real-browser probe failed'
au=json.loads((e/'audio-check.json').read_text());assert au['passed'],'FLAC audio check failed'
out={**{k:x for k,x in u.items() if k!='files'},**{k:v[k] for k in ('version','displayName','apkVersion')},'apk':'','files':{k:base64.b64encode(b).decode() for k,b in files.items()}}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8');size=t.stat().st_size;assert size<60_000_000
carried=[k for k in files if k in pub and files[k]==pub[k]]
m={**{k:v[k] for k in ('version','displayName','apkVersion')},'baselineJSONSHA256':sha(raw),'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha(apk),'releaseHTMLSHA256':sha(h),
   'jsonBytes':size,'baselineJSONBytes':len(raw),'runtimeFiles':len(files),'carriedByteForByte':len(carried),'changedRuntimeFiles':['index.html'],
   'removedUnused':{k:REMOVED[k] for k in UNUSED},'removedCP90':{k:REMOVED[k] for k in CP90},'resavedLossless':RESAVED,
   'replaced':{'sounds/effects/paw-dance.wav':{'bytes':len(wav),'by':'sounds/effects/paw-dance.flac','flacBytes':len(fl),'flacSHA256':sha(fl),'sampleIdentical':True}},
   'embeddedAPKBytes':0,'nativeChange':False,'base':pin['displayName'],'backup':f"uat/backups/before-UAT{uat}-{v['version']}",'evidence':e.relative_to(r).as_posix(),'checks':NEED,
   'authorization':f"UAT {uat}: OPS-04 package trim A+B+C plus the CP-90 painted-kitten removal (PM, Nov 19: \"Go for A+B+C, plus the CP-90 painted-kitten removal\"; Jenny: \"I prefer the original zoomies.\"; PM, Nov 19: UAT 120 out, rebase, check, stage, publish); UAT only"}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print(json.dumps({k:m[k] for k in ('jsonBytes','baselineJSONBytes','runtimeFiles','carriedByteForByte')},indent=1))
