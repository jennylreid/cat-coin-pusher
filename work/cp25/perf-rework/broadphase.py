from pathlib import Path
p=Path('work/cp25/perf-rework/queries.js');s=p.read_text(encoding='utf-8');s=s.replace('function castQuery(shape,p,q,v,other,op,oq,ov,target,max,stop){','function castQuery(shape,p,q,v,other,op,oq,ov,target,max,stop){\n if(!castMayReach(shape,p,q,v,other,op,oq,ov,target,max))return null;');p.write_text(s,encoding='utf-8')
