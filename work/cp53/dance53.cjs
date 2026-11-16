// Dance break beat sync: samples the cat's move every frame (60 fps clock) and finds, beat by beat, the frame where the
// body bobs lowest (and a paw lands); compares it with the judge's beat (D.p0 + k*D.beat). Both builds, all 4 moves,
// sound on and sound off.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(__dirname,'..','..','tickets','CP-45-evidence','uat53','dance');fs.mkdirSync(OUT,{recursive:true});
(async()=>{const res={};
 for(const [tag,src] of [['uat52','../cp52/release.html'],['uat53','release.html']])for(const muted of [false,true])for(const m of [0,1,2,3]){
  const g=await game({src:path.join(__dirname,src),seed:3,render:tag==='uat53'&&m===1&&!muted});strictAudio(g);g.run(`S.muted=${muted}`);
  g.ticks(20);g.tap(200,400);g.ticks(40);g.run(`DANCE.move=${m};danceStartNow()`);g.until("WILD.dance&&WILD.dance.phase==='dance'",2000);g.run(`WILD.dance.move=${m};if(pawDance)pawDance.index=${m}`);
  const S=[];for(let i=0;i<60*5;i++){g.tick();S.push(JSON.parse(g.run(`JSON.stringify((()=>{const D=WILD.dance;if(!D||D.phase!=='dance')return null;const x=(danceNow()-D.p0)/D.beat;return [x,pawMotion(0).y,pawMotion(1).y,pawMotion(-1).y,(pawGaze()||{x:0}).x];})())`)));
   if(g.c.document&&tag==='uat53'&&m===1&&!muted&&i>=60&&i<60+34){const x=S[S.length-1]&&S[S.length-1][0];if(x!=null){g.c.draw();fs.writeFileSync(path.join(OUT,`m1-${String(i).padStart(3,'0')}-x${x.toFixed(2)}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}}}
  const s=S.filter(Boolean),beatS=g.run('WILD.dance?WILD.dance.beat:0.55');const errs=[];
  for(let k=1;k<7;k++){const w=s.filter(r=>r[0]>k-.5&&r[0]<k+.5);if(!w.length)continue;
   const best=m===0?w.reduce((a,b)=>Math.abs(b[4])>Math.abs(a[4])?b:a):w.reduce((a,b)=>b[1]>a[1]?b:a); // body lowest (y nearest 0) / eyes furthest out
   errs.push(Math.round((best[0]-k)*beatS*1000));}
  res[`${tag} move${m} ${muted?'sound off':'sound on'}`]=errs;g.close();}
 console.log(JSON.stringify(res,null,0).replace(/],/g,'],\n'));fs.writeFileSync(path.join(OUT,'beat-sync.json'),JSON.stringify(res,null,1));})();
