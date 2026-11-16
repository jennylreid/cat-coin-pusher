// UAT 66 (CP-49 section 3) checks: the end card's back button reads "Home" (was "Main screen"), same button and behaviour
// (goes to the Home screen); no other player-visible "Main screen" text. Developer off, portrait phone canvas.
// Usage: node checks66.cjs [BUILD] [BASE (UAT 65)] [OUT]   (also run ../cp65/checks65.cjs on this build for the Home screen)
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp65','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-49-evidence','uat66'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
async function G(s){const g=await game({src:s,render:true,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);g.run('S.muted=false;S.dev=false');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(40);return g;}
async function endCard(s,name){const g=await G(s);g.run("PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);g.until("WILD.phase==='end'",60*200);g.ticks(90);shot(g,name);return g;}
(async()=>{
 const text=fs.readFileSync(src,'utf8'),baseText=fs.readFileSync(base,'utf8');
 const vis=t=>(t.match(/'[^'\n]*Main screen[^'\n]*'/g)||[]);
 check('1 no player-visible "Main screen" string left in the build (UAT 65 had one)',vis(text).length===0&&vis(baseText).length===1,{before:vis(baseText),after:vis(text)});
 const a=await endCard(base,'endcard-before-uat65'),b=await endCard(src,'endcard-after-uat66');
 const la=a.run('pgBackText()'),lb=b.run('pgBackText()');notes.labels={before:la,after:lb};
 const ra=J(a,'wildEndRects().back'),rb=J(b,'wildEndRects().back');
 check('2 end card button reads "Home" (was "Main screen"), same place and size',la==='Main screen'&&lb==='Home'&&JSON.stringify(ra)===JSON.stringify(rb),{la,lb,ra,rb});
 b.tap(rb.x+rb.w/2,rb.y+rb.h/2);b.ticks(30);const scr=b.run('PGU.screen');
 check('3 tapping Home goes to the Home screen as before; no errors',scr==='main'&&!J(b,'__errs').length&&!J(a,'__errs').length,{screen:scr,errs:J(b,'__errs')});
 if(scr==='main')shot(b,'home-after-endcard-uat66');
 const res={passed:!failed.length,failed,passedChecks:passed,notes,build:src,base};fs.writeFileSync(path.join(OUT,'checks66.json'),JSON.stringify(res,null,2));
 console.log(failed.length?'FAILED '+failed.length:'ALL PASSED '+passed.length);process.exit(failed.length?1:0);})().catch(e=>{console.error(e);process.exit(1);});
