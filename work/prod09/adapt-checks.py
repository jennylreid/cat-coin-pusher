# Makes work/prod09/checks.cjs and checks-uat105.cjs from PROD-08's (same checks; the source is UAT 105, the save comes from
# production 2026.11.17), and adds PROD-09's spot checks to checks-uat105.cjs: Zoomies, Formal inspection, Sonic meow and
# Tortitude identical to UAT 105 tick for tick; the Yawn on two non-Tuxedo cats identical to UAT 105; the board (clean-up)
# drawn identically to UAT 105 on two cats (the footer label masked). Usage: python adapt-checks.py
from pathlib import Path
p=Path(__file__).parent
def make(src,dst,reps,extra=None):
    s=(p/'..'/'prod08'/src).read_text(encoding='utf-8')
    for a,b,n in reps:
        assert s.count(a)==n,(src,a[:80],s.count(a));s=s.replace(a,b)
    if extra:
        a,b=extra;assert s.count(a)==1,(src,'extra');s=s.replace(a,b+a)
    (p/dst).write_text(s,encoding='utf-8');print(dst)
make('checks.cjs','checks.cjs',[
 ("// PROD-08 checks on the production build (work/prod08/release.html = UAT 89 + the production adaptations)","// PROD-09 checks on the production build (work/prod09/release.html = UAT 105 + the production adaptations)",1),
 ("// cp43 harness (adapted from work/prod07/checks.cjs):","// cp43 harness (adapted from work/prod08/checks.cjs):",1),
 ("Save carry-over from a production 2026.11.16.2 save (made by the published game, work/prod07/release.html);","Save carry-over from a production 2026.11.17 save (made by the published game, work/prod08/release.html);",1),
 ("Parity with UAT 89 (work/cp89/release.html)","Parity with UAT 105 (work/cp105/release.html)",1),
 ("// Usage (from work/prod08): node checks.cjs   -> evidence in tickets/PROD-08-evidence/","// Usage (from work/prod09): node checks.cjs   -> evidence in tickets/PROD-09-evidence/",1),
 ("UAT=path.resolve(__dirname,'../cp89/release.html')","UAT=path.resolve(__dirname,'../cp105/release.html')",1),
 ("NOV15=path.resolve(__dirname,'../prod07/release.html')","NOV15=path.resolve(__dirname,'../prod08/release.html')",1),
 ("tickets/PROD-08-evidence","tickets/PROD-09-evidence",1),
 ("f.run('BUILD')==='2026.11.17'","f.run('BUILD')==='2026.11.18'",1),
 ("2026.11.16.2","2026.11.17",None),
 ("UAT 89","UAT 105",None),
],None) if False else None
# the counted replacements above need exact counts; count the open-ended ones first
s=(p/'..'/'prod08'/'checks.cjs').read_text(encoding='utf-8')
R=[("// PROD-08 checks on the production build (work/prod08/release.html = UAT 89 + the production adaptations)","// PROD-09 checks on the production build (work/prod09/release.html = UAT 105 + the production adaptations)"),
 ("// cp43 harness (adapted from work/prod07/checks.cjs):","// cp43 harness (adapted from work/prod08/checks.cjs):"),
 ("UAT=path.resolve(__dirname,'../cp89/release.html')","UAT=path.resolve(__dirname,'../cp105/release.html')"),
 ("NOV15=path.resolve(__dirname,'../prod07/release.html')","NOV15=path.resolve(__dirname,'../prod08/release.html')"),
 ("// Usage (from work/prod08): node checks.cjs","// Usage (from work/prod09): node checks.cjs"),
 ("f.run('BUILD')==='2026.11.17'","f.run('BUILD')==='2026.11.18'")]
for a,b in R:
    assert s.count(a)==1,('checks',a[:70],s.count(a));s=s.replace(a,b)
s=s.replace('tickets/PROD-08-evidence','tickets/PROD-09-evidence').replace('work/prod07/release.html','work/prod08/release.html').replace('2026.11.16.2','2026.11.17').replace('UAT 89','UAT 105').replace('PROD-08','PROD-09')
(p/'checks.cjs').write_text(s,encoding='utf-8');print('checks.cjs')
s=(p/'..'/'prod08'/'checks-uat89.cjs').read_text(encoding='utf-8')
s=s.replace('(work/cp89/release.html)','(work/cp105/release.html)').replace("base=path.resolve(__dirname,'../cp89/release.html')","base=path.resolve(__dirname,'../cp105/release.html')").replace('tickets/PROD-08-evidence','tickets/PROD-09-evidence')
s=s.replace("checks-uat89.json","checks-uat105.json").replace("uat89:","uat105:").replace("prod08:","prod09:").replace('UAT 89','UAT 105').replace('PROD-08','PROD-09').replace('work/prod07/checks-cp59.cjs','work/prod08/checks-uat89.cjs')
EXTRA=r"""
 // 5. PROD-09 spot checks against UAT 105 (Developer off): each power played through its button on its cat's board, traced
 // tick by tick (Formal inspection = Tuxedo, Zoomies = Orange, Sonic meow = Siamese, Tortitude = Tortie); the Yawn (wheel slice)
 // on two non-Tuxedo cats (CP-75 faces); the board drawn the same (CP-78 clean-up) on two cats, footer label masked
 async function catRound(file,cat,seed=5){const g=await game(file,seed);g.run(`for(const c of PG_CATS)PG.open[c]=true;pglLv().passed=Math.max(2,PG_SWITCH_LEVEL);pglLv().sel=3;pgSave();PG.current='${cat}';if(WILD.phase==='card')wildReset();pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
  if(!g.until("WILD.phase==='play'",900))throw new Error('no play '+cat);return g;}
 const PT="[PGPX?PGPX.id:'-',PGPX?+PGPX.t.toFixed(3):-1,S.coins,bodies.filter(b=>!b.dead).length,WILD.got,WILD.phase,board.status,+PUSH_PERIOD.toFixed(5)]";
 async function powerRun(file,cat){const g=await catRound(file,cat);g.ticks(240);g.run(`WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers['${cat}']=1;`);
  g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");const id=J(g,"PGPX?PGPX.id:null");const tr=[];
  for(let i=0;i<16*60;i++){g.tick();tr.push(g.run('JSON.stringify('+PT+')'));}return {id,hash:crypto.createHash('sha256').update(tr.join('\n')).digest('hex'),ended:J(g,'!PGPX'),errs:J(g,'__errs')};}
 notes.powers=[];for(const cat of ['tuxedo','orange','siamese','tortie']){const a=await powerRun(base,cat),b=await powerRun(src,cat);notes.powers.push({cat,id:b.id,same:a.hash===b.hash,ended:b.ended,errs:b.errs.length});
  check('5 '+cat+' power ('+b.id+') identical to UAT 105 tick by tick, ends cleanly, no frame errors',a.hash===b.hash&&!!b.id&&b.ended&&!b.errs.length&&!a.errs.length,{id:[a.id,b.id],ended:b.ended});}
 {const yi=J(await game(src),"W2_WHEEL.findIndex(s=>/yawn/i.test(s.label))");notes.yawn=[];
  async function yawnRun(file,cat){const g=await catRound(file,cat);g.ticks(240);g.run('w2ForceSlice='+yi+';WILD.danceForce=true');const st={};const tr=[];let saw=false;
   for(let tk=0;tk<60*50;tk++){beatTap(g,'all',st);if(J(g,WAITING))g.tap(200,560);g.tick();tr.push(g.run('JSON.stringify('+TR+')'));if(J(g,'typeof W2_YAWN!=="undefined"&&!!W2_YAWN'))saw=true;}
   return {saw,hash:crypto.createHash('sha256').update(tr.join('\n')).digest('hex'),errs:J(g,'__errs')};}
  for(const cat of ['orange','ragdoll']){const a=await yawnRun(base,cat),b=await yawnRun(src,cat);notes.yawn.push({cat,saw:b.saw,same:a.hash===b.hash});
   check('6 the Yawn on the '+cat+' board (wheel slice) identical to UAT 105 tick by tick, no frame errors',b.saw&&a.hash===b.hash&&!b.errs.length,{saw:[a.saw,b.saw]});}}
 {notes.board=[];for(const cat of ['tuxedo','orange']){const px={};for(const [k,file] of [['u',base],['p',src]]){const g=await catRound(file,cat);g.ticks(120);g.c.draw();const cv=g.c.document.getElementById('cv'),ctx=cv.getContext('2d');
    const H=cv.height,W=cv.width,img=ctx.getImageData(0,0,W,Math.floor(H*.85)).data;px[k]=crypto.createHash('sha256').update(Buffer.from(img.buffer)).digest('hex');
    if(k==='p')fs.writeFileSync(path.join(out,'board-'+cat+'-prod09.png'),cv.toBuffer('image/png'));}
   notes.board.push({cat,same:px.u===px.p});check('7 the '+cat+' board (CP-78 clean-up) draws the same as UAT 105 (top 85% of the screen: below it UAT 105 shows its Developer timing strip and the footer label differs by name)',px.u===px.p);}}
"""
a=" check('4 production untouched',sha(prodJ)===prod0);"
assert s.count(a)==1;s=s.replace(a,EXTRA+a)
assert 'cp89' not in s and 'UAT 89' not in s,[l[:80] for l in s.split('\n') if 'cp89' in l or 'UAT 89' in l]
(p/'checks-uat105.cjs').write_text(s,encoding='utf-8');print('checks-uat105.cjs')
