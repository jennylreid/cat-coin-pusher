// Equivalent convex separating-axis test: each polygon's inward edge plane
// only needs the farthest point of the other polygon. Near-tangencies use the
// original full projection test to preserve floating-point boundary behavior.
function __coinPolysOverlap(a,b){
 for(const poly of [a,b]){
  const other=poly===a?b:a;
  for(let i=0;i<poly.length;i++){
   const p=poly[i],q=poly[(i+1)%poly.length],nx=p.y-q.y,ny=q.x-p.x,boundary=nx*p.x+ny*p.y;
   let hi=-Infinity;for(const v of other){const d=nx*v.x+ny*v.y;if(d>hi)hi=d;}
   if(Math.abs(hi-boundary)<1e-6)return __coinPolysOverlapOriginal(a,b);
   if(hi<boundary)return false;
  }
 }
 return true;
}
