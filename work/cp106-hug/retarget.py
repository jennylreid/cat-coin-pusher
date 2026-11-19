# CP-74 UAT 106: retargets the UAT 104 build/stage/check scripts (copied from work/cp104) to UAT 106 on published UAT 105.
import json
from pathlib import Path
D=Path(__file__).parent
(D/'release-version.json').write_text(json.dumps({"displayName":"2026.11.18 UAT 106","version":20261118000017,"apkVersion":7,"base":"cp105","baseSHA256":"d08597d1a6e355071a67742cd070a687156b7dd40ea791d3d71b1f57b4e6db39"}))
def ed(f,pairs):
    p=D/f;s=p.read_text(encoding='utf-8')
    for a,b in pairs:
        if s.count(a)==0:print('MISSING',f,a[:70])
        s=s.replace(a,b)
    p.write_text(s,encoding='utf-8')
ed('build.py',[('"""UAT 104 = UAT 103 + CP-74','"""UAT 106 = UAT 105 + CP-74 try 6 (Jenny, Nov 18: "This passes for UAT. It\'s not perfect, but it\'s so much better.");\nfirst'),('on published UAT 103','on published UAT 105')])
ed('stage.py',[('CP-74 UAT 104 staging, on published UAT 103 (from work/cp103/stage.py)','CP-74 UAT 106 staging, on published UAT 105 (from work/cp104/stage.py)'),
 ('published UAT 103 JSON','published UAT 105 JSON'),('hugcheck.cjs boot104','hugcheck.cjs boot106'),("'checks104.json'","'checks106.json'"),
 ("checks*-on104.json","checks*-on106.json"),("'checks64-on104.json'","'checks64-on106.json'")])
p=D/'stage.py';s=p.read_text(encoding='utf-8');a=s.index("'authorization':");b=s.index("}\n(p/'publication-manifest.json')")
s=s[:a]+"""'authorization':f"UAT {uat}: CP-74 Hug try 6 (Jenny, Nov 18: \\"This passes for UAT. It's not perfect, but it's so much better. I want to take a look at it in the build.\\"); PM: \\"Build try 6 on the published UAT 105 as UAT 106 ... You have a go to publish\\"; UAT only\""""+s[b:]
p.write_text(s,encoding='utf-8')
ed('verify-cloud.py',[('cp104','cp106-hug')])
ed('hugcheck.cjs',[('work/cp104/hugcheck.html','work/cp106-hug/hugcheck.html'),('UAT 104 (CP-74)','UAT 106 (CP-74)')])
ed('hugcheck.html',[("'boot104'","'boot106'"),("'2026.11.18 UAT 104'","'2026.11.18 UAT 106'"),('UAT 104 (CP-74)','UAT 106 (CP-74)')])
ed('run-pre.sh',[('UAT 104 pre-publish','UAT 106 pre-publish'),('checks104 checks64-on104','checks106 checks64-on106'),('(checks104)','(checks106)'),('(checks64-on104,','(checks64-on106,'),
 ('hugcheck.cjs boot104 > ../../tickets/CP-74-evidence/uat104/','hugcheck.cjs boot106 > ../../tickets/CP-74-evidence/uat106/')])
ed('gen-checks.py',[('UAT 104 (CP-74)','UAT 106 (CP-74)'),('UAT 103 regression','UAT 105 regression'),('uat104','uat106'),('-on104','-on106')])
ed('checks106.cjs',[('// UAT 104 checks','// UAT 106 checks'),('node checks104.cjs -> tickets/CP-74-evidence/uat104/checks104.json','node checks106.cjs -> tickets/CP-74-evidence/uat106/checks106.json'),
 ("'../../tickets/CP-74-evidence/uat104'","'../../tickets/CP-74-evidence/uat106'"),("'checks104.json'","'checks106.json'"),('published UAT 103','published UAT 105'),
 ('game104/uat104.html','game106/uat106.html'),("UAT 103\\'s colliders","UAT 105\\'s colliders"),("UAT 103's Hug","UAT 105's Hug"),('identically to UAT 103','identically to UAT 105'),('normal play identical to UAT 103','normal play identical to UAT 105')])
print('done')
