from pathlib import Path
p=Path('work/cp25/perf-rework/queries.js');s=p.read_text();s=s.replace('queryNative=[];','queryNative=[],queryGeometry=new Map();',1).replace('queryNative=[];queryShapes','queryNative=[];queryGeometry=new Map();queryShapes');s=s.replace('if(!raw){raw=shape.intoRaw();queryShapes.set(shape,raw);queryNative.push(raw);}', 'if(!raw){const key=JSON.stringify(shape);raw=queryGeometry.get(key);if(!raw){raw=shape.intoRaw();queryGeometry.set(key,raw);queryNative.push(raw);}queryShapes.set(shape,raw);}')
s=s.replace('try{return RAPIER.ShapeContact.fromRaw(nativeShape(shape).contactShape(rp,rq,nativeShape(other),ro,rot,prediction));}', '''try{const hit=nativeShape(shape).contactShape(rp,rq,nativeShape(other),ro,rot,prediction);if(!hit)return null;
  try{return {distance:hit.distance(),normal1:RAPIER.VectorOps.fromRaw(hit.normal1())};}finally{hit.free();}
 }''')
s=s.replace('try{return RAPIER.ShapeCastHit.fromRaw(null,nativeShape(shape).castShape(rp,rq,rv,nativeShape(other),ro,rot,rov,target,max,stop));}', '''try{const hit=nativeShape(shape).castShape(rp,rq,rv,nativeShape(other),ro,rot,rov,target,max,stop);if(!hit)return null;
  try{return {time_of_impact:hit.time_of_impact()};}finally{hit.free();}
 }''')
p.write_text(s)
p=Path('work/cp25/perf-rework/compare.cjs');s=p.read_text().replace("p+label+'/release.html'", "label==='candidate'?p+'candidate.html':p+label+'/release.html'").replace("out+'comparison-fixed.json'", "out+(process.argv.length>2?'profile-'+process.argv[2]+'.json':'comparison-fixed.json')");p.write_text(s)
