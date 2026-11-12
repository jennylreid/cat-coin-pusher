from pathlib import Path
import urllib.request,time,json
r=Path(__file__).resolve().parents[3];u=(r/'work/uat15/download-url.txt').read_text().strip();u+=('&' if '?' in u else '?')+'cp25head='+str(time.time_ns())
with urllib.request.urlopen(urllib.request.Request(u,method='HEAD',headers={'Cache-Control':'no-cache'}),timeout=30) as res:print(json.dumps({'etag':res.headers.get('ETag'),'bytes':res.headers.get('Content-Length')}))
