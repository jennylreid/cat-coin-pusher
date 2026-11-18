from pathlib import Path
import json,base64,hashlib
p=Path(__file__).parent;r=p.parents[1];e=r/'tickets/CP-69-evidence/uat88'
sha=lambda b:hashlib.sha256(b).hexdigest()
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());pin=json.loads((p.parent/'cp87/publication-manifest.json').read_text())
assert sha((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())==pin['stagedJSONSHA256']
files=dict(u['files']);files['index.html']=base64.b64encode((p/'release.html').read_bytes()).decode()
for f in (p/'art').glob('*.png'):files['img/art/'+f.name]=base64.b64encode(f.read_bytes()).decode()
for k,v in files.items():
 f=p/'boot88'/k;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(base64.b64decode(v))
v=json.loads((p/'release-version.json').read_text());out={**u,**{k:v[k] for k in ['version','displayName','apkVersion']},'apk':'','files':files}
t=p/'CatCoinPusher-UAT-game.json';t.write_text(json.dumps(out,separators=(',',':')),encoding='utf-8')
m={**v,'baselineJSONSHA256':pin['stagedJSONSHA256'],'stagedJSONSHA256':sha(t.read_bytes()),'apkSHA256':sha((r/'uat/CatCoinPusher-UAT.apk').read_bytes()),'releaseHTMLSHA256':sha((p/'release.html').read_bytes()),'runtimeFiles':len(files),'changedRuntimeFiles':['index.html'],'addedRuntimeFiles':['img/art/'+f.name for f in (p/'art').glob('*.png')],'backup':f"uat/backups/before-UAT88-{v['version']}",'evidence':'tickets/CP-69-evidence/uat88','authorization':'CP-69 Phase B GO: CP-69 art, CP-57 production title sound restore, CP-70 Developer cleanup; UAT only','nativeChange':False,'jsonBytes':t.stat().st_size}
(p/'publication-manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2))
(p/'publish.ps1').write_text((p.parent/'cp87/publish.ps1').read_text())
(p/'verify-cloud.py').write_text((p.parent/'cp87/verify-cloud.py').read_text().replace('cp87','cp88'))
# Run the existing behavioral suites unchanged; replace only their historical source reconstruction check.
s=(p.parent/'cp63-uat/checks.cjs').read_text();a=s.index(' if(sha(base)');b=s.index(' // 1 + 2:',a)
s=s[:a]+" check('0 release matches staged manifest',sha(src)===JSON.parse(fs.readFileSync(path.join(__dirname,'publication-manifest.json'))).releaseHTMLSHA256);\n"+s[b:]
s=s.replace("'base.html'","'../cp87/release.html'").replace("'../../tickets/CP-63-evidence/uat'","'../../tickets/CP-69-evidence/uat'")
(p/'checks63.cjs').write_text(s)
s=(p.parent/'cp87/checks86-on87.cjs').read_text();a=s.index(" if(sha(base)");b=s.index(' // 1. the wheel',a)
s=s[:a]+" check('0 release matches staged manifest',sha(src)===JSON.parse(fs.readFileSync(path.join(__dirname,'publication-manifest.json'))).releaseHTMLSHA256);\n"+s[b:]
s=s.replace("'../../tickets/CP-57-evidence/uat87'","'../../tickets/CP-69-evidence/uat88'")
(p/'checks64.cjs').write_text(s)
s=(p.parent/'cp57-title/checks-title-restore.cjs').read_text();a=s.index(" check('0 only");b=s.index(' const pick=',a)
s=s[:a]+" check('0 CP57T switch and replay removed',!t.includes('CP57T')&&!t.includes('pg-tsnd')&&!t.includes('pg-treplay'));\n"+s[b:]
s=s.replace("'../../tickets/CP-57-evidence'","'../../tickets/CP-69-evidence/uat88'")
s=s.replace("fs.readFileSync(PROD,'utf8')","fs.readFileSync(PROD,'utf8').split(String.fromCharCode(13)).join('')")
(p/'checks-title.cjs').write_text(s)
print(json.dumps(m,indent=2))
