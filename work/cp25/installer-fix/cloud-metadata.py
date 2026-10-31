from pathlib import Path
import urllib.request,json,time
r=Path(__file__).resolve().parents[3];url=(r/'work/uat15/download-url.txt').read_text().strip();url+=('&' if '?' in url else '?')+'cp25range='+str(time.time_ns())
req=urllib.request.Request(url,headers={'Cache-Control':'no-cache, no-store, max-age=0','Range':'bytes=0-1023'})
with urllib.request.urlopen(req,timeout=30) as res:
 raw=res.read(1024);prefix=raw.decode('utf-8','replace');import re
 print(json.dumps({'status':res.status,'prefix':prefix[:160],'headers':{k:res.headers.get(k) for k in ['ETag','Content-Length','Content-Range','Last-Modified','Age','Date','Cache-Control','X-Cache']},'version':(re.search(r'"version":\s*(\d+)',prefix) or [None,None])[1],'apkVersion':(re.search(r'"apkVersion":\s*(\d+)',prefix) or [None,None])[1]},indent=2))
