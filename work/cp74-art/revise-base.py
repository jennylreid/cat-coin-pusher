from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];out=p/'revision2';out.mkdir(exist_ok=True)
raw=(r/'uat/CatCoinPusher-UAT-game.json').read_bytes();u=json.loads(raw)
assert u['version']>=20261118000012
files=u['files'];h=base64.b64decode(files['index.html']);src=h.decode('utf-8')
assert 'cp78Rim' in src
(out/'current.html').write_bytes(h)
for name,val in files.items():
 if name.startswith('img/art/'):
  b=base64.b64decode(val);f=out/'art'/Path(name).name;f.parent.mkdir(exist_ok=True);f.write_bytes(b)
blk=(r/'work/cp74-hug/cp74-hug.js').read_text(encoding='utf-8')+'\n'+(r/'work/cp74-hug/demo.js').read_text(encoding='utf-8')
i=src.rindex('</script>');src=src[:i]+blk+'\n'+src[i:]
(out/'preview.html').write_text(src,encoding='utf-8')
meta={'displayName':u['displayName'],'version':u['version'],'packageSHA256':hashlib.sha256(raw).hexdigest(),'indexSHA256':hashlib.sha256(h).hexdigest(),'source':'uat/CatCoinPusher-UAT-game.json','previewOnly':True}
(out/'baseline.json').write_text(json.dumps(meta,indent=2),encoding='utf-8');print(json.dumps(meta))
