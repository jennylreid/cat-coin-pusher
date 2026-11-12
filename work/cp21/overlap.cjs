// CP-21: physical interpenetration of coins while playing. Usage: node overlap.cjs <html> [board] [gap]
const path=require('path'),make=require('C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs');
(async()=>{const src=path.resolve(process.argv[2]),board=+(process.argv[3]||0),gap=+(process.argv[4]||.4);
 const g=await make({sourceFile:src,seed:42}),a=g.c.__game;a.selectBoard(board);
 let next=0,hits=new Map(),deep=0,frames=0,maxPen=0,ex=[];
 for(let f=0;f<60*40;f++){
  if(f/60>=next){a.tryDrop({x:200+60*Math.sin(f*0.37)});next+=gap;}
  g.tick();frames++;
  const cs=a.bodies.filter(b=>b.kind==='coin'||b.kind==='silver');
  const P=cs.map(b=>{const t=b.rb.translation(),r=b.rb.rotation();const up=2*(r.x*r.y+r.w*r.z),ny=1-2*(r.x*r.x+r.z*r.z);return {b,x:t.x*100,y:t.y*100,z:t.z*100,flat:ny}});
  for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const p=P[i],q=P[j];if(p.flat<.97||q.flat<.97)continue;const h=Math.hypot(p.x-q.x,p.z-q.z);if(h>=52-6)continue;const dy=Math.abs(p.y-q.y);const TH=+(process.env.TH||3);if(dy<TH){const pen=(4-dy);maxPen=Math.max(maxPen,pen);const key=p.b.uid+'-'+q.b.uid;hits.set(key,(hits.get(key)||0)+1);if(ex.length<8&&hits.get(key)==1)ex.push({t:+(f/60).toFixed(2),h:+h.toFixed(1),dy:+dy.toFixed(1),y:[+p.y.toFixed(1),+q.y.toFixed(1)],z:[+p.z.toFixed(0),+q.z.toFixed(0)],input:[!!p.b.input,!!q.b.input]});}}
 }
 const long=[...hits.values()].filter(v=>v>10).length;
 console.log(JSON.stringify({src:path.basename(src),board,pairs:hits.size,pairsOver10frames:long,examples:ex}));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
