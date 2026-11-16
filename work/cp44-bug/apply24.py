# CP-24 patch: python apply24.py <src.html> <dst.html> [dial=value ...]
import sys,re
src,dst=sys.argv[1],sys.argv[2];dials=dict(a.split('=') for a in sys.argv[3:])
h=open(src,encoding='utf-8').read()
old="for(const s of [-1,1]){const x=200+s*(halfW+COIN_R*0.9),hh=2,len=T.FRONT+100-GUARD_END;world.createCollider(RAPIER.ColliderDesc.cuboid(2*M,hh*M,len/2*M).setTranslation(x*M,hh*M,(GUARD_END+len/2)*M).setFriction(0.2),fixed);}"
new="for(const s of [-1,1]){const x=200+s*(halfW+COIN_R*CP24.lipOut),hh=CP24.lipH/2,len=T.FRONT+100-GUARD_END;world.createCollider(RAPIER.ColliderDesc.cuboid(2*M,hh*M,len/2*M).setTranslation(x*M,hh*M,(GUARD_END+len/2)*M).setFriction(0.2).setCollisionGroups(CP24.lipGroups),fixed);}"
assert h.count(old)==1;h=h.replace(old,new)
m=re.findall(r'for\(const o of obstacles\)\{\s*const cp=o\.p,e=o\.ext;',h);assert len(m)==1,len(m)
h=h.replace(m[0],m[0]+'if(!__cp24Interact(a.c,o.c))continue;')
fix=open('fix24.js',encoding='utf-8').read()
for k,v in dials.items():
    fix,n=re.subn(r'\b'+k+r':[^,}]+',k+':'+v,fix,count=1);assert n==1,k
anchor="Promise.all([RAPIER.init(), loadArt()])";assert h.count(anchor)==1
h=h.replace(anchor,fix+'\n'+anchor)
open(dst,'w',encoding='utf-8',newline='').write(h)
