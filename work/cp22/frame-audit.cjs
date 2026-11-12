const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const noop=()=>{};
(async()=>{const source=path.resolve(process.argv[2]),drawEvery=+(process.argv[3]||0),drawCount=+(process.argv[5]||1),g=await make({sourceFile:source,render:!!drawEvery}),a=g.c.__game;g.c.Path2D=native.Path2D;
if(drawEvery){vm.runInContext('drawRestMitt(130);',g.c);const ctx=new Proxy({getTransform:()=>({a:1,b:0,c:0,d:1,e:0,f:0}),measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});g.c.__dummyCtx=ctx;g.c.document.createElement=()=>({width:400,height:889,style:{},getContext:()=>ctx});vm.runInContext('ctx=__dummyCtx;__boardLayer=null;__railMatte=null;',g.c);}
g.c.__coinOrderAudit={};let maxPen=0,deep=0,orderChanges=0,hash=crypto.createHash('sha256');
for(let f=0;f<60*24;f++){
 if(f<60*18&&f%21===0)a.tryDrop({x:200+60*Math.sin(f*.37)});
 g.tick();const ids=a.bodies.map(b=>b.uid).join(',');if(drawEvery&&f%drawEvery===0)for(let d=0;d<drawCount;d++)g.c.draw();if(ids!==a.bodies.map(b=>b.uid).join(','))orderChanges++;
 const cs=a.bodies.filter(b=>['coin','silver','quake'].includes(b.kind));a.world.propagateModifiedBodyPositionsToColliders();
 for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){
  const x=cs[i].rb.translation(),y=cs[j].rb.translation();if(Math.abs(x.x-y.x)>.65||Math.abs(x.y-y.y)>.65||Math.abs(x.z-y.z)>.65)continue;
  const c=cs[i].rb.collider(0).contactCollider(cs[j].rb.collider(0),0);if(c){maxPen=Math.max(maxPen,-c.distance*100);if(c.distance<-.005)deep++;}
 }
 if(f%60===0)hash.update(JSON.stringify(cs.sort((a,b)=>a.uid-b.uid).map(b=>[b.uid,b.rb.translation(),b.rb.rotation()])));
}
const r={source,drawEvery,maxPenetration:maxPen,deepSamples:deep,renderReorderedPhysicsFrames:orderChanges,trajectoryHash:hash.digest('hex'),occlusion:g.c.__coinOrderAudit};console.log(r);if(process.argv[4])fs.writeFileSync(process.argv[4],JSON.stringify(r,null,2));g.close();})();
