// Spatial index only rejects pairs that the existing x/z bounds reject.
// A successful correction re-queries remaining indices, retaining original
// ascending pair order even if that correction moves a coin into a new cell.
 const cell=.55,grid=new Map(),maxHr=Math.max(...cs.map(a=>a.hr));
 const key=(x,z)=>Math.floor(x/cell)+','+Math.floor(z/cell);
 function indexMove(a){const k=key(a.p.x,a.p.z);if(k===a.gridKey)return;if(a.gridKey!==undefined)grid.get(a.gridKey).delete(a.index);let bucket=grid.get(k);if(!bucket)grid.set(k,bucket=new Set());bucket.add(a.index);a.gridKey=k;}
 cs.forEach((a,i)=>{a.index=i;indexMove(a);});
 function neighbours(a,after){const r=a.hr+maxHr+1e-6,out=[];
  for(let x=Math.floor((a.p.x-r)/cell);x<=Math.floor((a.p.x+r)/cell);x++)for(let z=Math.floor((a.p.z-r)/cell);z<=Math.floor((a.p.z+r)/cell);z++){
   const bucket=grid.get(x+','+z);if(bucket)for(const i of bucket)if(i>=after)out.push(i);
  }
  return out.sort((a,b)=>a-b);
 }
