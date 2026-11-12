const make=require('./runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{
 const src=path.resolve(process.argv[2]),mode=process.argv[3]||'centre',g=await make({sourceFile:src}),a=g.c.__game;a.selectBoard(+(process.argv[5]||0));
 let maxDepth=0,worst=null,deepFrames=0,longest=0,orderSwaps=0,peakPile=0,framePairs=new Map(),rest=new Map(),maxQuietJitter=0,quietSamples=0;
 for(let f=0;f<60*28;f++){
  if(f<60*20&&f%3===0)a.tryDrop({x:mode==='left'?140:mode==='centre'?200:200+60*Math.sin(f*.037)});
  g.tick();a.world.propagateModifiedBodyPositionsToColliders();const cs=a.bodies.filter(b=>['coin','silver','quake'].includes(b.kind)).map(b=>({b,p:b.rb.translation(),q:b.rb.rotation(),v:b.rb.linvel(),c:b.rb.collider(0)}));
  const current=new Set();
  for(let i=0;i<cs.length;i++){
   const x=cs[i];if(!x.b.fresh&&x.p.z<3.3)peakPile=Math.max(peakPile,x.p.y*100);
   const tilt=Math.acos(Math.max(-1,Math.min(1,1-2*(x.q.x*x.q.x+x.q.z*x.q.z))));
   if(f>60*24&&x.p.z>3.3){let r=rest.get(x.b.uid);if(!r)rest.set(x.b.uid,r={min:tilt,max:tilt});r.min=Math.min(r.min,tilt);r.max=Math.max(r.max,tilt);maxQuietJitter=Math.max(maxQuietJitter,(r.max-r.min)*180/Math.PI);quietSamples++;}
   for(let j=i+1;j<cs.length;j++){
    const y=cs[j];if(Math.abs(x.p.x-y.p.x)>.65||Math.abs(x.p.z-y.p.z)>.65||Math.abs(x.p.y-y.p.y)>.65)continue;
    const contact=x.c.contactCollider(y.c,0);if(!contact)continue;
    const d=-contact.distance*100;if(d>maxDepth){maxDepth=d;worst={frame:f,a:{p:x.p,q:x.q,v:x.v,input:x.b.input},b:{p:y.p,q:y.q,v:y.v,input:y.b.input},contact};}
    if(contact.distance>=-.005)continue;deepFrames++;
    const key=x.b.uid+'-'+y.b.uid;current.add(key);const n=(framePairs.get(key)||0)+1;longest=Math.max(longest,n);framePairs.set(key,n);
   }
  }
  for(const key of framePairs.keys())if(!current.has(key))framePairs.delete(key);
 }
 const result={source:src,mode,maxPenetrationGameUnits:maxDepth,deepContactSamplesOverHalfUnit:deepFrames,longestDeepContactFrames:longest,peakPileHeight:peakPile,quietSamples,quietTiltRangeDegrees:maxQuietJitter,worst};
 console.log(JSON.stringify(result));if(process.argv[4])fs.writeFileSync(process.argv[4],JSON.stringify(result,null,2));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
