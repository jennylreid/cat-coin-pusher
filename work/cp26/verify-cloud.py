import urllib.request,hashlib,json,time
from pathlib import Path
root=Path(__file__).resolve().parents[2];stage=root/'work/cp26'
url=(root/'work/uat15/download-url.txt').read_text().strip()
url+=('&' if '?' in url else '?')+'cp26verify='+str(time.time_ns())
request=urllib.request.Request(url,headers={'Cache-Control':'no-cache, no-store, max-age=0'})
with urllib.request.urlopen(request,timeout=30) as response:
    digest=hashlib.sha256();size=0
    while True:
        chunk=response.read(65536)
        if not chunk:break
        digest.update(chunk);size+=len(chunk)
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
    (root/'tickets/CP-26-evidence/cloud-verification.json').write_text(json.dumps(evidence,indent=2))
    print(json.dumps(evidence,indent=2))








