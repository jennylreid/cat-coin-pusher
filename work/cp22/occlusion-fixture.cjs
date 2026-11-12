const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const audit=JSON.parse(fs.readFileSync('work/cp22/frame-occlusion.json','utf8')),example=audit.occlusion.examples[0],results=[];
for(const [label,file]of [['before','uat10/release.html'],['after','draft.html']]){
 const g=await make({sourceFile:path.resolve('work/cp22',file),render:true,height:888.889});g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();g.c.__fixture=example;g.c.__coinOrderAudit={};
 vm.runInContext(`for(const b of bodies.slice())removeCoin(b);
 globalThis.__pair=[__fixture.a,__fixture.b].map(v=>addCoin('coin',null,v.p.x/M,v.p.y/M,v.p.z/M,v.q));`,g.c);
 const [a,b]=g.c.__pair;g.c.__game.world.propagateModifiedBodyPositionsToColliders();const hit=a.rb.collider(0).contactCollider(b.rb.collider(0),.1);
 const output='tickets/CP-22-evidence/occlusion-'+label+'.png';g.snapshot(output);
 const cv=g.c.document.getElementById('cv'),crop=native.createCanvas(520,430),cx=crop.getContext('2d');cx.drawImage(cv,280,880,520,430,0,0,520,430);fs.writeFileSync('tickets/CP-22-evidence/occlusion-'+label+'-detail.png',crop.toBuffer('image/png'));
 results.push({label,nativeGap:hit?.distance,occlusion:g.c.__coinOrderAudit});g.close();
}
fs.writeFileSync('tickets/CP-22-evidence/occlusion-fixture.json',JSON.stringify(results,null,2));console.log(results);})();
