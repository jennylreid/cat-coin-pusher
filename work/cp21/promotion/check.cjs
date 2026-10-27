const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const make=require('./runtime.cjs');
(async()=>{
 const g=await make({sourceFile:__dirname+'/release.html'});
 vm.runInContext('panel.querySelector=()=>({})',g.c);
 // The panel binding was captured at load; capture its generated HTML through the canvas stub.
 for(const enabled of [false,true]){
  g.c.__game.S.dev=enabled;g.c.openCredits();
  const h=vm.runInContext('panel.innerHTML',g.c);
  for(const id of ['happy-test','dance-test','tap-areas','safe-guides'])assert.equal(h.includes('id="'+id+'"'),enabled,id);
  assert(h.includes('<h2>Settings</h2>'));
 }
 assert.equal(vm.runInContext('BUILD',g.c),'2026.10.27');
 g.close();
 console.log('Production date and Developer-only Happy, dance, paw outlines and safe-area controls passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
