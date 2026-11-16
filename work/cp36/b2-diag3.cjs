// Find the first tick where UAT 35 and UAT 36 (Pop) diverge on Board 2, and what drew random numbers there.
const make=require('../cp33/runtime.cjs'),vm=require('vm'),path=require('path');
async function tr(src){const g=await make({sourceFile:path.resolve(__dirname,src),seed:5});const a=g.c.__game,run=s=>vm.runInContext(s,g.c);
 run("var __rc=0,__rs=[];(()=>{const R=Math.random;Math.random=function(){__rc++;if(__rs.length<4000)__rs.push((new Error().stack.split(String.fromCharCode(10))[2]||'').trim().replace(/:[0-9]+:[0-9]+/g,String()).slice(0,90));return R();};})();selectBoard(1);S.coins=300;");
 const log=[];let t=0,last=-9;while(t<25){let d='';if(t-last>=.2){d=a.tryDrop({x:200+60*Math.sin(t*1.7),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;
  log.push(run("JSON.stringify([__rc,S.coins,bodies.filter(b=>!b.dead).length,callouts.length,sweetUntil,happyUntil,board.status])")+' drop='+d+' rs='+run("JSON.stringify(__rs.splice(0))"));}
 g.close();return log;}
(async()=>{const A=await tr('../cp35/release.html'),B=await tr('release.html');
 for(let i=0;i<A.length;i++)if(A[i]!==B[i]){console.log('first diff at tick',i,'t=',(i/60).toFixed(2));for(let j=Math.max(0,i-2);j<=i+1;j++){console.log('35',A[j].slice(0,600));console.log('36',B[j].slice(0,600));}break;}})();
