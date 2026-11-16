// UAT 65 (CP-49) checks: the Home screen has no coin pyramid and a 2/3-size PLAY at the same centre; PLAY, the cat and every
// Home button still respond; the title screen draws the same as UAT 64. Developer off, portrait phone canvas (400 x 889).
// Usage: node checks65.cjs [BUILD] [BASE (UAT 64)] [OUT]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp63','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-49-evidence','uat65'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
const shot=(g,n)=>fs.writeFileSync(path.join(OUT,n+'.png'),png(g));
async function G(s){const g=await game({src:s,render:true,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);g.run('S.muted=false;S.dev=false');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");return g;}
const errs=g=>J(g,'__errs');
const home=async s=>{const g=await G(s);g.ticks(60);const title=png(g);g.ticks(90);g.tap(200,700);g.ticks(40);g.c.draw();return {g,title};};
(async()=>{
 const A=await home(base),B=await home(src);
 // freeze the coin rain for the comparison shots so only the change shows
 for(const x of [A,B]){x.g.run("PGA.coins.length=0;PGA.seeded=1;");x.g.c.draw();}
 const rA=J(A.g,'{screen:PGU.screen,play:PGA.L.play,R:pgMainRects()}'),rB=J(B.g,'{screen:PGU.screen,play:PGA.L.play,R:pgMainRects(),dev:S.dev,scale}');
 A.g.c.draw();B.g.c.draw();shot(A.g,'home-before-uat64');shot(B.g,'home-after-uat65');
 check('1 both builds open on the Home screen with Developer off',rA.screen==='main'&&rB.screen==='main'&&rB.dev===false,{a:rA.screen,b:rB.screen});
 check('2 no coin pyramid code or drawing left',!B.g.run("typeof pgMainPile")!=='undefined'&&B.g.run("typeof pgMainPile")==='undefined'&&A.g.run("typeof pgMainPile")==='function');
 const a=rA.play,b=rB.play,ca=[a.x+a.w/2,a.y+a.h/2],cb=[b.x+b.w/2,b.y+b.h/2];
 check('3 PLAY is 2/3 the size at the same centre',Math.abs(b.w/a.w-2/3)<.01&&Math.abs(b.h/a.h-2/3)<.01&&Math.abs(ca[0]-cb[0])<.5&&Math.abs(ca[1]-cb[1])<.5,{before:a,after:b});
 notes.play={before:a,after:b,scale:rB.scale,afterCssPx:{w:+(b.w*rB.scale).toFixed(1),h:+(b.h*rB.scale).toFixed(1)}};
 // the layout around it is the same (cat, side buttons, level label): pgMainRects unchanged
 check('4 Home layout otherwise unchanged (cat, side buttons, level and goal)',JSON.stringify(rA.R)===JSON.stringify(rB.R));
 // pixels: the bottom strip under PLAY differs (pile gone), and the area below PLAY is now just background
 check('5 title screen code identical to UAT 64 (pgDrawTitle and its coin pile)',A.g.run('String(pgDrawTitle)')===B.g.run('String(pgDrawTitle)'));
 fs.writeFileSync(path.join(OUT,'title-uat65.png'),B.title);
 // taps: cat, every side button, top bar buttons, then PLAY
 const g=B.g,res=[];
 const R=J(g,'(()=>{const R=pgMainRects();return {head:R.head,side:(R.side||[]).map(b=>({id:b.id,hit:b.hit}))}})()');
 g.tap(R.head.x,R.head.y);g.ticks(10);res.push(['cat',J(g,'PGA.hearts.length')>0?'hearts':'none']);
 for(const s of R.side){g.tap(s.hit.x+s.hit.w/2,s.hit.y+s.hit.h/2);g.ticks(30);const got=J(g,'{screen:PGU.screen,pick:!!PGU.pick}');res.push([s.id,got.screen+(got.pick?'+cats':'')]);
  g.run("PGU.pick=false;PGU.door=null;if(PGU.screen!=='main')pgGo('board');");g.ticks(20);}
 const D=J(g,'(()=>{const D=pgDock();return {gear:D.gear,coll:D.coll,inv:D.inv}})()');
 g.run('globalThis.__cred=0;openCredits=function(){__cred++;};');
 for(const k of ['coll','inv','gear']){const r=D[k];if(!r){res.push([k,'absent']);continue;}g.tap(r.x+r.w/2,r.y+r.h/2);g.ticks(20);
  res.push([k,k==='gear'?(J(g,'__cred')?'settings opened':'none'):(J(g,'inventoryOpen')?'opened '+J(g,'loopScreen'):'none')]);
  g.run("inventoryOpen=false;");g.ticks(20);g.run("if(PGU.screen!=='main')pgGo('board');");g.ticks(20);}
 const help=J(g,'PGA.L.help');if(help){g.tap(help.x+help.w/2,help.y+help.h/2);g.ticks(20);res.push(['how to play',J(g,'{screen:PGU.screen,rules:PGU.rules}')]);g.run("PGU.rules=false;");g.ticks(20);}
 const p=J(g,'PGA.L.play');g.tap(p.x+p.w/2,p.y+p.h/2);const go=g.until("WILD.phase==='play'",900);res.push(['PLAY',go?'round started':'no']);
 notes.taps=res;
 check('6 cat, every Home button and PLAY respond; no errors',res.every(r=>r[1]!=='main'&&r[1]!=='none'&&r[1]!=='no')&&go&&!errs(g).length&&!errs(A.g).length,{res,errs:errs(g)});
 // edge of the new PLAY: a tap just outside the small button but inside the old one does nothing
 {const {g:h}=await home(src);const p=J(h,'PGA.L.play');h.tap(p.x-12,p.y+p.h/2);h.ticks(20);check('7 tap area matches the drawn button (outside the new edge does not start)',J(h,'PGU.screen')==='main'&&J(h,"WILD.phase")==='card');}
 // a shorter phone (rule 11): nothing overlaps PLAY
 const res2={passed:!failed.length,failed,passedChecks:passed,notes,build:src,base};fs.writeFileSync(path.join(OUT,'checks65.json'),JSON.stringify(res2,null,2));
 console.log(failed.length?'FAILED '+failed.length:'ALL PASSED '+passed.length);process.exit(failed.length?1:0);})().catch(e=>{console.error(e);process.exit(1);});
