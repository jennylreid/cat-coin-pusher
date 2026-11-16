const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'preview.html'),OUT=path.resolve(process.argv[3]||'shots');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({src,render:true,seed:5});g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(40);
 // a quick win on level 1 (collect everything by hand), then the end card
 g.run("PGU.screen='board';pgStartRound()");g.until("WILD.phase==='play'",900);g.ticks(60);
 g.run("for(const id of WILD_COLLECTION){const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)wildPrizeCollected(b,200);}");g.ticks(200);shot(g,'end-win-L1');
 console.log(g.run('JSON.stringify({phase:WILD.phase,win:WILD.win,res:WILD.pgResult,lv:PG.lv,again:pglAgainText(),back:pgBackText()})'));
 // the end card's lower button: the main screen at Level 2
 const R=JSON.parse(g.run('JSON.stringify(wildEndRects())'));g.tap(R.back.x+R.back.w/2,R.back.y+R.back.h/2);g.ticks(40);shot(g,'main-L2-after');
 console.log(g.run('JSON.stringify({screen:PGU.screen,sel:PG.lv.sel,coll:WILD_COLLECTION})'));
 // three levels passed with stars; arrows on the PLAY screen
 g.run("PG.lv.passed=3;PG.lv.stars={1:3,2:2,3:1};PG.lv.sel=2;wildReset();");g.ticks(30);shot(g,'main-L2-arrows');
 const L=JSON.parse(g.run('JSON.stringify(PGA.L)'));console.log('arrows',JSON.stringify({prev:L.prev,next:L.next}));
 g.tap(L.next.x+20,L.next.y+20);g.ticks(10);console.log('after next',g.run('PG.lv.sel'),g.run('JSON.stringify(WILD_COLLECTION)'));
 // the Kitchen and Shop appeared after Level 2 (first recipe)
 console.log(g.run('JSON.stringify({shown:PG.shown,recipes:PG.recipes,side:pgSideRects(0,90).map(r=>r.id)})'));shot(g,'main-L4-side');
 // a second cat: Cats button and the picker
 g.run("pgOpenBoard('orange');PGU.moment=null;");g.ticks(40);shot(g,'main-cats');
 g.run("PGU.pick=true;PGU.pickT=1");g.ticks(5);shot(g,'picker');
 const P=JSON.parse(g.run('JSON.stringify(pglPickRects())'));g.tap(P.rows[1].x+100,P.rows[1].y+30);g.ticks(40);
 console.log(g.run('JSON.stringify({cat:PGU.boardCat,mode:WILD.mode,phase:WILD.phase,screen:PGU.screen,sel:PG.lv.sel,coll:WILD_COLLECTION,name:wildModeName()})'));shot(g,'main-orange');
 // play as Orange: its prizes fall from the sky
 g.run("PGU.screen='board';pgStartRound();globalThis.__drops=[];const lb=wildLandBonus;wildLandBonus=function(o){__drops.push(o.kind+':'+(o.id||''));return lb(o);}");g.until("WILD.phase==='play'",900);
 for(let s=0;s<40&&g.run("WILD.phase==='play'");s++){g.run(`tryDrop({x:${Math.round(200+120*Math.sin(s))},y:DROP_Y})`);g.ticks(27);} shot(g,'board-orange');
 console.log(g.run('JSON.stringify({drops:__drops,catDrops:WILD.pglCatDrops,items:PG.items})'));
 // the cat-coin moment
 g.run("PGU.moment={cat:'siamese',t:1}");g.ticks(2);shot(g,'moment');g.run('PGU.moment=null');
 console.log('errors',g.run('JSON.stringify(__errs)'));
})();
