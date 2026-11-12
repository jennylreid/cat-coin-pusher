const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2});g.run('S.dev=true');g.run("wildEnter();wildExit()");
 g.run(`const __st=WILD.star;globalThis.__log=[];const rbProto=bodies.find(b=>b.kind==='item').rb.__proto__;const __set=rbProto.setTranslation;rbProto.setTranslation=function(t,w){const b=bodies.find(b=>b.rb===this);if(b&&b.kind==='item')__log.push(b.id+' '+Math.round(t.x/M)+','+Math.round(t.y/M)+','+Math.round(t.z/M)+' '+new Error().stack.split(String.fromCharCode(10)).slice(2,5).map(s=>s.trim().slice(3,40)).join('<'));return __set.call(this,t,w);};`);
 g.run("wildModeEnter('towers')");console.log(g.run('WILD.star'),g.run('JSON.stringify(__log,null,1)'));})();
