from pathlib import Path
import hashlib,json,subprocess,shutil
p=Path(__file__).parent;r=p.parents[1]
base=p.parent/'cp87/release.html';pin=json.loads((p.parent/'cp87/publication-manifest.json').read_text())
assert hashlib.sha256(base.read_bytes()).hexdigest()==pin['releaseHTMLSHA256']
v={'displayName':'2026.11.17 UAT 88','version':20261117235959,'apkVersion':7,'base':'cp87'}
(p/'release-version.json').write_text(json.dumps(v))
subprocess.run(['python',str(p.parent/'cp57-title/build-title-final.py'),str(base),pin['releaseHTMLSHA256'],str(p/'title-final.html'),str(p/'release-version.json')],check=True)
s=(p/'title-final.html').read_text(encoding='utf-8')
anchor='async function image(src) { const im = new Image(); im.src = src; await im.decode(); return im; }'
code='\n // CP-69: approved accessory overlays, preloaded with the existing art.\n'
(p/'art').mkdir(exist_ok=True)
for id,source in [('hat','round2/hat-b.png'),('bowtie','round2/bowtie-a.png'),('monocle','monocle-a.png'),('cane','round2/cane-a.png')]:
 name=f'cp69-{id}.png';shutil.copyfile(r/'tickets/CP-69-evidence'/source,p/'art'/name)
 code+=f" WILD_ART['cp69-{id}']=await image('img/art/{name}');\n"
assert s.count(anchor)==1;s=s.replace(anchor,anchor+code)
add=(p/'accessories.js').read_text(encoding='utf-8')+'\n'+(p/'developer.js').read_text(encoding='utf-8')
i=s.rindex('</script>');s=s[:i]+add+'\n'+s[i:]
(p/'release.html').write_bytes(s.encode())
print(hashlib.sha256(s.encode()).hexdigest())
