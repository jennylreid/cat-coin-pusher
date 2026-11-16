const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const example={a:{kind:'item',id:'cheese',p:{x:1.4,y:.17,z:6.1},q:{x:0,y:0,z:0,w:1}},b:{kind:'coin',p:{x:1.4,y:.04,z:6.3},q:{x:0,y:0,z:0,w:1}},description:'Coin supporting the front of the cheese; identical poses before and after.'},out=[];
 for(const [label,file] of [['before','uat11/release.html'],['after','draft.html']]){
  const g=await make({sourceFile:path.resolve('work/cp22',file),render:true,height:888.889});g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();g.c.__fixture=example;
  vm.runInContext(`for(const b of bodies.slice())removeCoin(b);for(const v of [__fixture.a,__fixture.b])addCoin(v.kind,v.id,v.p.x/M,v.p.y/M,v.p.z/M,v.q);`,g.c);
  g.snapshot('tickets/CP-22-evidence/uat12-treat-'+label+'.png');
  const t=example.a.kind==='item'?example.a:example.b;g.c.__t=t;
  const c=vm.runInContext('(()=>{const c=screenOf(__t.p.x/M,__t.p.z/M,__t.p.y/M);return {x:200+(c.x-200)*VIEW.z,y:VIEW.y+c.y*VIEW.zy};})()',g.c),cv=g.c.document.getElementById('cv'),crop=native.createCanvas(400,380);
  crop.getContext('2d').drawImage(cv,c.x*2.7-200,c.y*2.7-230,400,380,0,0,400,380);fs.writeFileSync('tickets/CP-22-evidence/uat12-treat-'+label+'-detail.png',crop.toBuffer('image/png'));g.close();
 }fs.writeFileSync('tickets/CP-22-evidence/uat12-treat-fixture.json',JSON.stringify(example,null,2));
})();
