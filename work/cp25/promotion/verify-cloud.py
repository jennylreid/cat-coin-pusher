from pathlib import Path
import urllib.request,json,hashlib,time,base64
r=Path(__file__).resolve().parents[3];p=r/'work/cp25/promotion';e=r/'tickets/CP-25-evidence/promotion'
m=json.loads((p/'manifest.json').read_text());url=(r/'work/prod04/download-url.txt').read_text().strip()+'&cp25verify='+str(time.time_ns())
with urllib.request.urlopen(urllib.request.Request(url,headers={'Cache-Control':'no-cache, no-store, max-age=0'}),timeout=30) as response:
 raw=response.read();digest=hashlib.sha256(raw).hexdigest();etag=response.headers.get('ETag','')
 if digest!=m['stagedJSONSHA256']:print({'status':'cloud not current','sha256':digest,'bytes':len(raw),'etag':etag});raise SystemExit(2)
 obj=json.loads(raw);apk=base64.b64decode(obj['apk']);assert hashlib.sha256(apk).hexdigest()==m['stagedAPKSHA256'];assert obj['files']=={} and obj['version']==m['version'] and obj['apkVersion']==17
 evidence={'httpStatus':response.status,'etag':etag,'jsonSHA256':digest,'embeddedAPKSHA256':hashlib.sha256(apk).hexdigest(),'jsonBytes':len(raw),'apkBytes':len(apk),'version':obj['version'],'displayName':obj['displayName'],'freshCloudJSONAndInstallerMatchStage':True,'phoneReceipt':'pending Jenny'}
 (e/'cloud-verification.json').write_text(json.dumps(evidence,indent=2));print(json.dumps(evidence,indent=2))
