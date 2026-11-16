import sys
p=sys.argv[1];s=open(p,encoding='utf8').read()
def sub(a,b):
    global s
    assert s.count(a)==1,a[:60]; s=s.replace(a,b)
sub("const __WARP_Y0=120,__WARP_Y1=680;",
 "const __NF=__plane(T.FRONT).py,__EXT=Math.max(0,__NF-__front1),__GXR=__plane(T.FRONT).gx/__plane(640).gx; // CP-21: longer table, rows keep their size\nconst __WARP_Y0=120,__WARP_Y1=680+__EXT;")
sub("for(let r=0;r<c.height;r++){const yo=__WARP_Y0+(r+.5)/d,m=__camBack(yo),f=__rowFunnel(yo)",
 "for(let r=0;r<c.height;r++){const y0=__WARP_Y0+(r+.5)/d,yo=y0<=__front1-4?y0:y0<__NF-4?__front1-4:y0-__EXT,wr=y0<=__front1-4?1:y0<__NF-4?1+(__GXR-1)*(y0-__front1+4)/Math.max(1,__EXT):__GXR,m=__camBack(yo),f=__rowFunnel(yo)*wr")
sub("ctx.rect(0,__WARP_Y0,400,__front1-__WARP_Y0);ctx.rect(0,__front1,40,__WARP_Y1-__front1);ctx.rect(358,__front1,42,__WARP_Y1-__front1);",
 "ctx.rect(0,__WARP_Y0,400,__NF-__WARP_Y0);ctx.rect(0,__NF,40,__WARP_Y1-__NF);ctx.rect(358,__NF,42,__WARP_Y1-__NF);")
open(sys.argv[2],'w',encoding='utf8').write(s)
