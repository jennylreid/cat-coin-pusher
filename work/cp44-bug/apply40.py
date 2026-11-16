# CP-40 patch: python apply40.py <src.html> <dst.html>  (inserts pawsave40.js before start-up)
import sys
s=open(sys.argv[1],encoding='utf-8').read();a="Promise.all([RAPIER.init(), loadArt()])";assert s.count(a)==1
open(sys.argv[2],'w',encoding='utf-8',newline='').write(s.replace(a,open('pawsave40.js',encoding='utf-8').read()+'\n'+a))
