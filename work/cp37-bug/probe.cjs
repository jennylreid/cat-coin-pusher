const {game}=require('../cp37/harness.cjs'),path=require('path');
const board=process.argv[2]||'wild',WARM=+(process.argv[3]||25);
(async()=>{const g=await game({seed:4,render:false,src:path.resolve(process.argv[4]||'uat37.html')}),a=g.c.__game;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');g.run('finishBoard=()=>{}');
 const hold=s=>g.run(`S.coins=Math.max(S.coins,50);if(globalThis.WILD&&WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9),y:DROP_Y};`);
 for(let s=0;s<WARM;s++){hold(s);g.ticks(60);}
 const st=new Map();let toggles=0,clipFrames=0,deck=[];const hs={};
 for(let f=0;f<300;f++){if(f%60===0)hold(WARM+f/60);g.tick();
  const rows=g.run('bodies.filter(b=>!b.dead&&!b.danceDown).map(b=>{const t=b.rb.translation();return [b.uid,t.z/M,t.y/M,b.r,b.kind]})');
  for(const [u,z,h,r,k] of rows){const c=z-r<189.5;if(c)clipFrames++;const p=st.get(u);if(p!==undefined&&p!==c)toggles++;st.set(u,c);
   if(z<250&&f%60===0)deck.push([+z.toFixed(1),+h.toFixed(1),k]);}
 }
 deck.sort((a,b)=>a[0]-b[0]);
 console.log(JSON.stringify({board,toggles5s:toggles,clipFrames,deckSamples:deck.length,deck:deck.slice(0,30)}));g.close();})();
