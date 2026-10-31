import ctypes as c,json
from pathlib import Path
from ctypes import wintypes as w
class Info(c.Structure):
 _fields_=[('onDisk',c.c_longlong),('validated',c.c_longlong),('modified',c.c_longlong),('properties',c.c_longlong),('pin',c.c_int),('inSync',c.c_int),('fileId',c.c_longlong),('rootId',c.c_longlong),('identityLength',w.DWORD)]
k=c.WinDLL('kernel32',use_last_error=True);k.CreateFileW.argtypes=[w.LPCWSTR,w.DWORD,w.DWORD,c.c_void_p,w.DWORD,w.DWORD,w.HANDLE];k.CreateFileW.restype=w.HANDLE;k.CloseHandle.argtypes=[w.HANDLE]
a=c.WinDLL('CldApi');a.CfGetPlaceholderInfo.argtypes=[w.HANDLE,c.c_int,c.c_void_p,w.DWORD,c.POINTER(w.DWORD)];a.CfGetPlaceholderInfo.restype=c.c_long
out=[]
for name in ['uat/CatCoinPusher-UAT-game.json','uat/CatCoinPusher-UAT.apk','uat/diagnostics/CatCoin-UAT-performance.json','uat']:
 p=Path(name).resolve();h=k.CreateFileW(str(p),0x80,7,None,3,0x02000000,None)
 if h==w.HANDLE(-1).value:out.append({'file':name,'error':c.get_last_error()});continue
 try:
  b=c.create_string_buffer(65536);n=w.DWORD();hr=a.CfGetPlaceholderInfo(h,1,b,len(b),c.byref(n));row={'file':name,'hresult':hex(hr&0xffffffff)}
  if hr==0:
   i=Info.from_buffer_copy(b);row.update(onDisk=i.onDisk,validated=i.validated,modified=i.modified,pin=i.pin,inSync=i.inSync)
  out.append(row)
 finally:k.CloseHandle(h)
print(json.dumps(out,indent=2));Path('tickets/CP-25-evidence/installer-fix/sync-metadata.json').write_text(json.dumps(out,indent=2))
