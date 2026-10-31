from pathlib import Path
import json,hashlib,base64,zipfile,subprocess,os
r=Path.cwd();p=r/'work/cp25/promotion';e=r/'tickets/CP-25-evidence/promotion';m=json.loads((p/'manifest.json').read_text());sha=lambda b:hashlib.sha256(b).hexdigest();build=Path('C:/Users/jenny/.codex/visualizations/2026/10/31/01a19261-80fa-7c93-9fbf-bc2e3d7615ee/cp25-prod-build');apk=build/'outputs/apk/debug/app-debug.apk';sdk=Path('C:/Users/jenny/Android/sdk/build-tools/34.0.0');os.environ['JAVA_HOME']='C:/Users/jenny/Android/jdk17'
cert=lambda f:subprocess.check_output([str(sdk/'apksigner.bat'),'verify','--print-certs',str(f)],text=True)
newcert=cert(apk);oldcert=cert(r/'CatCoinPusher.apk');assert newcert==oldcert
badging=subprocess.check_output([str(sdk/'aapt.exe'),'dump','badging',str(apk)],text=True);assert "name='com.jenny.catpusher' versionCode='17' versionName='2026.10.31'" in badging
classes='';runtime={}
with zipfile.ZipFile(apk) as z,zipfile.ZipFile(r/'uat/CatCoinPusher-UAT.apk') as u:
 assert z.testzip() is None
 for name in z.namelist():
  if name.endswith('.dex'):
   f=e/name;f.write_bytes(z.read(name));dump=subprocess.check_output([str(sdk/'dexdump.exe'),str(f)],text=True);classes+='\n'.join(line for line in dump.splitlines() if 'Class descriptor' in line)+'\n'
 for c in ['MainActivity','MainActivity$Bridge','CloudUpdate','UpdatePolicy','UpdatePolicy$Action','BuildConfig']:assert f"'Lcom/jenny/catpusher/{c};'" in classes,c
 assert 'Diagnostic' not in classes and 'catpusher/uat/' not in classes
 for n in u.namelist():
  if n.startswith('assets/') and n not in ['assets/index.html','assets/update-url.txt','assets/version.txt'] and not n.endswith('/'):
   assert z.read(n)==u.read(n),n;runtime[n[7:]]=sha(z.read(n))
 assert z.read('assets/index.html')==(p/'release.html').read_bytes()
 assert z.read('assets/version.txt').decode()==str(m['version'])
 assert z.read('assets/update-url.txt')==(r/'work/prod04/android/app/src/main/assets/update-url.txt').read_bytes()
(e/'dex-classes.txt').write_text(classes);(e/'runtime-hashes.json').write_text(json.dumps(runtime,indent=2))
# APK16's production CloudUpdate reader accepts empty files; APK17 is selected first.
old=json.loads((r/'phone/CatCoinPusher-game.json').read_bytes());out={**old,**{k:m[k] for k in ['version','displayName','apkVersion']},'apk':base64.b64encode(apk.read_bytes()).decode(),'files':{}}
assert out['channel']=='catpusher' and out['applicationId']=='com.jenny.catpusher'
raw=json.dumps(out,separators=(',',':')).encode();assert len(raw)<49_600_000 and len(raw)<(r/'phone/CatCoinPusher-game.json').stat().st_size
(p/'CatCoinPusher-game.json').write_bytes(raw);(p/'CatCoinPusher.apk').write_bytes(apk.read_bytes())
m.update(stagedJSONSHA256=sha(raw),stagedAPKSHA256=sha(apk.read_bytes()),jsonBytes=len(raw),apkBytes=apk.stat().st_size,runtimeFiles=1+len(runtime),unchangedNonHTMLRuntimeFiles=len(runtime),signatureVerified=True,signerSHA256=newcert.split('SHA-256 digest: ')[1].splitlines()[0],manifestIdentityVerified=True,dexStartupVerified=True,buildAndLint='passed; fresh outputs, offline, no build cache, all tasks rerun',envelope='APK-only: complete installer; empty files; runtime bundled once',publication='not published; awaiting first-open save decision')
(p/'manifest.json').write_text(json.dumps(m,indent=2));(e/'package-verification.json').write_text(json.dumps(m,indent=2));print({k:v for k,v in m.items() if k!='adaptations'})
