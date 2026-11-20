# OPS-04 analysis (light): inventory of the published UAT 117 runtime (work/cp117/boot117 = the files of the published JSON,
# checked against its manifest), reference counts in index.html, lossless re-encodes with identity proofs, size projections.
# Writes analysis.json and reenc/. Never opens the game JSON itself.  python analyse.py
from pathlib import Path
import json,hashlib,io,subprocess,re
from PIL import Image
p=Path(__file__).parent;r=p.parents[1];B=r/'work/cp117/boot117';man=json.loads((r/'work/cp117/publication-manifest.json').read_text())
sha=lambda b:hashlib.sha256(b).hexdigest();b64=lambda n:4*((n+2)//3)
files={f.relative_to(B).as_posix():f for f in B.rglob('*') if f.is_file()}
assert len(files)==man['runtimeFiles'] and sha((B/'index.html').read_bytes())==man['releaseHTMLSHA256'],'boot117 is not the published UAT 117 runtime'
html=(B/'index.html').read_text(encoding='utf-8')
inv=[{'file':k,'bytes':f.stat().st_size,'nameRefs':html.count(Path(k).name)} for k,f in sorted(files.items(),key=lambda x:-x[1].stat().st_size)]
UNUSED=['img/art/uat18-soft-paw.png','img/art/head-waiting.webp']
for u in UNUSED:assert html.count(Path(u).name)==0 and html.count(Path(u).stem)==0,u
(p/'reenc').mkdir(exist_ok=True);png=[]
for k in [i['file'] for i in inv if i['file'].endswith('.png') and i['bytes']>100_000 and i['file'] not in UNUSED]:
    im=Image.open(files[k]);im.load();buf=io.BytesIO();im.save(buf,'PNG',optimize=True);b=buf.getvalue()
    same=Image.open(io.BytesIO(b)).convert('RGBA').tobytes()==im.convert('RGBA').tobytes()
    if same and len(b)<files[k].stat().st_size:(p/'reenc'/Path(k).name).write_bytes(b);png.append({'file':k,'from':files[k].stat().st_size,'to':len(b),'pixelIdentical':same,'sha256':sha(b)})
wav=files['sounds/effects/paw-dance.wav'];fl=p/'reenc/paw-dance.flac'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-compression_level','12',str(fl)],check=True)
pcm=lambda f:sha(subprocess.run(['ffmpeg','-v','error','-i',str(f),'-f','s16le','-'],capture_output=True,check=True).stdout)
flac={'file':'sounds/effects/paw-dance.wav','to':'sounds/effects/paw-dance.flac','from':wav.stat().st_size,'bytes':fl.stat().st_size,'sampleIdentical':pcm(wav)==pcm(fl)}
J=man['jsonBytes'];A=J-sum(b64(files[u].stat().st_size)+len(u)+6 for u in UNUSED)
Bsz=A-sum(b64(x['from'])-b64(x['to']) for x in png);C=Bsz-(b64(flac['from'])-b64(flac['bytes']))
out={'base':man['displayName'],'jsonBytes':J,'runtimeBytes':sum(i['bytes'] for i in inv),'unused':UNUSED,'png':png,'flac':flac,
     'projected':{'A_remove_unused':A,'B_plus_png':Bsz,'C_plus_flac':C},'inventory':inv}
(p/'analysis.json').write_text(json.dumps(out,indent=1));print(json.dumps({k:out[k] for k in ('jsonBytes','projected','flac')},indent=1));print('png',sum(x['from']-x['to'] for x in png),len(png))
