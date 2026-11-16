const make=require('./runtime.cjs'),path=require('path');
(async()=>{const g=await make({sourceFile:path.resolve('work/cp22/draft.html')});const a=g.c.__game;
for(let f=0;f<1200;f++){if(f%21===0)a.tryDrop({x:140});g.tick();}
console.log(a.board,g.inspect());console.log(a.bodies.filter(b=>b.input).map(b=>({p:b.rb.translation(),v:b.rb.linvel(),q:b.rb.rotation(),landed:b.contactLanded})).slice(-12));g.close();})();
