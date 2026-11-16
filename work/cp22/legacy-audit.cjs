// Keep the CP-21 predicate, then verify every flag against actual 3-D shapes.
const make=require('./runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{const results=[];
for(let board=0;board<3;board++){
 const g=await make({sourceFile:path.resolve(process.argv[2])}),a=g.c.__game;a.selectBoard(board);let next=0,flags=new Map(),maxActualPen=0,deepActual=0;
 for(let f=0;f<2400;f++){
  if(f/60>=next){a.tryDrop({x:200+60*Math.sin(f*.37)});next+=.6;}
  g.tick();a.world.propagateModifiedBodyPositionsToColliders();
  const cs=a.bodies.filter(b=>b.kind==='coin'||b.kind==='silver').map(b=>{const p=b.rb.translation(),q=b.rb.rotation();return {b,p,ny:1-2*(q.x*q.x+q.z*q.z)};});
  for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
   const x=cs[i],y=cs[j];if(x.ny<.97||y.ny<.97||Math.hypot(x.p.x-y.p.x,x.p.z-y.p.z)>=.46||Math.abs(x.p.y-y.p.y)>=.03)continue;
   const key=x.b.uid+'-'+y.b.uid;flags.set(key,(flags.get(key)||0)+1);
   const contact=x.b.rb.collider(0).contactCollider(y.b.rb.collider(0),0);if(contact){maxActualPen=Math.max(maxActualPen,-contact.distance*100);if(contact.distance<-.005)deepActual++;}
  }
 }
 const r={board:board+1,tapGap:.6,legacyPairs:flags.size,legacyPairsOver10frames:[...flags.values()].filter(n=>n>10).length,maxNativePenetrationForFlags:maxActualPen,nativeSamplesOverHalfUnit:deepActual};results.push(r);console.log(r);g.close();
}fs.writeFileSync('tickets/CP-22-evidence/legacy-verified.json',JSON.stringify(results,null,2));})();
