import urllib.request,hashlib,json,time
from pathlib import Path
root=Path(__file__).resolve().parents[3];stage=root/'work/cp25/installer-fix'
url=(root/'work/uat15/download-url.txt').read_text().strip()
url+=('&' if '?' in url else '?')+'cp25verify='+str(time.time_ns())
with urllib.request.urlopen(urllib.request.Request(url,method='HEAD',headers={'Cache-Control':'no-cache'}),timeout=30) as response:
    if response.headers.get('ETag','')=='\"{5FCB1BAF-F716-4F1D-9283-4B6D9B86F317},59\"':
        print('Cloud still UAT23; awaiting sync');raise SystemExit(2)
request=urllib.request.Request(url,headers={'Cache-Control':'no-cache, no-store, max-age=0'})
started=time.monotonic()
with urllib.request.urlopen(request,timeout=30) as response:
    digest=hashlib.sha256();size=0
    while True:
        chunk=response.read(65536)
        if not chunk:break
        digest.update(chunk);size+=len(chunk)
        if time.monotonic()-started>120:raise TimeoutError("Verification exceeded120 seconds")
    manifest=json.loads((stage/'publication-manifest.json').read_text())
    if digest.hexdigest()!=manifest['stagedJSONSHA256']:
        print(json.dumps({'status':'cloud bytes not yet current','observedSHA256':digest.hexdigest(),'expectedSHA256':manifest['stagedJSONSHA256'],'bytes':size,'etag':response.headers.get('ETag','')}))
        raise SystemExit(2)
    etag=response.headers.get('ETag','')
    evidence={'httpStatus':response.status,'etag':etag,'bytes':size,'sha256':digest.hexdigest(),
        'version':manifest['version'],'sameSharedItemAsBaseline':etag.startswith('"{5FCB1BAF-F716-4F1D-9283-4B6D9B86F317}'),
        'anonymousDownload':True,'displayName':manifest['displayName'],
        'phoneEvidence':'pending'}
    assert evidence['sameSharedItemAsBaseline']
    (root/'tickets/CP-25-evidence/installer-fix/cloud-verification.json').write_text(json.dumps(evidence,indent=2))
    print(json.dumps(evidence,indent=2))







