
 // Post-solver projection can cross a neighbour's edge even when both final
 // shapes are separate. Preserve the first time of impact along that path.
 for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
  const a=cs[i],b=cs[j],oa=before.get(a.b.uid),ob=before.get(b.b.uid);
  if(!oa||!ob||(oa.y-ob.y)*(a.p.y-b.p.y)>=0)continue;
  if(Math.abs(oa.x-ob.x)>a.hr+b.hr+.1||Math.abs(oa.z-ob.z)>a.hr+b.hr+.1)continue;
  const start=a.c.shape.contactShape(oa,a.q,b.c.shape,ob,b.q,.002),finish=a.c.shape.contactShape(a.p,a.q,b.c.shape,b.p,b.q,.002);
  if(start&&start.distance<.002||finish&&finish.distance<.002)continue;
  const da={x:a.p.x-oa.x,y:a.p.y-oa.y,z:a.p.z-oa.z},db={x:b.p.x-ob.x,y:b.p.y-ob.y,z:b.p.z-ob.z};
  const hit=a.c.shape.castShape(oa,a.q,da,b.c.shape,ob,b.q,db,0,1,true);
  if(!hit||hit.time_of_impact>=1)continue;
  const k=Math.max(0,hit.time_of_impact-.001);
  for(const [r,o,d] of [[a,oa,da],[b,ob,db]]){r.p={x:o.x+d.x*k,y:o.y+d.y*k,z:o.z+d.z*k};r.b.rb.setTranslation(r.p,true);}
 }
