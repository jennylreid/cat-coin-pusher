// Every level at the start: grid rows, towers on the grid, prizes on tower tops; still standing 1 s after GO. Screenshots.
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'release.html'),OUT=path.resolve(process.argv[3]||'../../tickets/CP-48-evidence/uat63');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({src,render:true,seed:5});g.run('S.muted=false;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);const all=[];
 const info=()=>JSON.parse(g.run(`JSON.stringify((()=>{const r={};for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver')){const t=b.rb.translation();if(t.y/M>COIN_HALF*2)continue;const z=Math.round(t.z/M/10)*10;r[z]=(r[z]||0)+1;}
  const st=bodies.filter(b=>!b.dead&&b.kind==='stack').map(t=>{const p=t.rb.translation();return {n:t.n,x:Math.round(p.x/M),z:Math.round(p.z/M),bottom:+(p.y/M-t.half).toFixed(1)}});
  const tops=bodies.filter(b=>!b.dead&&b.kind==='item'&&(b.twTop||b.pglOn)).map(b=>[b.id,+(b.rb.translation().y/M).toFixed(1)]);
  return {rows:Object.keys(r).sort((a,b)=>a-b).map(k=>r[k]),onTop:bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')&&b.rb.translation().y/M>COIN_HALF*2).length,stacks:st,tops,plain:w43PlainCount(),towerCoins:st.reduce((s,t)=>s+t.n,0)};})())`));
 for(let n=1;n<=10;n++){g.run(`PG.lv.passed=9;PG.lv.sel=${n};wildReset();PGU.screen='board';WILD.phase='card';`);g.ticks(2);const a=info();
  g.run("PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);g.ticks(60);shot(g,'level'+String(n).padStart(2,'0')+'-start');const b=info();
  const r={n,name:g.run('pglLevel().name'),start:a.plain+a.towerCoins,grid:a.plain,towers:a.stacks.map(s=>s.n),rows:a.rows.join(','),onTopAtStart:a.onTop,towerBottoms:a.stacks.map(s=>s.bottom),tops:a.tops,afterGo:{stacks:b.stacks.length,bottoms:b.stacks.map(s=>s.bottom),tops:b.tops.length,rows:b.rows.join(',')}};
  all.push(r);console.log(JSON.stringify(r));}
 fs.writeFileSync(path.join(OUT,'levels-start.json'),JSON.stringify(all,null,1));})();
