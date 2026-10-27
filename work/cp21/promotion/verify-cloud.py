from pathlib import Path
import urllib.request, hashlib, json, sys
r=Path(__file__).resolve().parents[3]
m=json.loads((Path(__file__).parent/'manifest.json').read_text())
url=(r/'work/prod04/download-url.txt').read_text().strip()
with urllib.request.urlopen(urllib.request.Request(url,headers={'Cache-Control':'no-cache, no-store, max-age=0'}),timeout=30) as response:
    raw=response.read()
    digest=hashlib.sha256(raw).hexdigest()
    j=json.loads(raw)
    baseline='--baseline' in sys.argv
    assert digest==(m['backupHashes']['phone/CatCoinPusher-game.json'] if baseline else m['stagedJSONSHA256']), (digest,j['version'])
    etag=response.headers.get('ETag','')
    assert etag.startswith('"{578FC2C8-E07A-4447-B0E5-3EBC7EA2C0E6}')
    evidence=dict(httpStatus=response.status,etag=etag,bytes=len(raw),sha256=digest,version=j['version'],displayName=j['displayName'],sameProductionSharedItem=True,matchesStaged=not baseline)
    (r/('tickets/CP-21-evidence/production-cloud-'+('baseline' if baseline else 'verification')+'.json')).write_text(json.dumps(evidence,indent=2))
    print(json.dumps(evidence,indent=2))
