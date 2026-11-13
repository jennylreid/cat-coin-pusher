// UAT 48 checks: CP-44 Tower wall mode (sound on, strict fake Web Audio, frames drawn with exceptions caught).
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames,breakRun}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','..','tickets','CP-44-evidence','uat48'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
async function g0(seed=2){const g=await game({src,seed,render:true});const st=strictAudio(g);g.run('S.muted=false;S.dev=true');return {g,st,errs:[]};}
const wall=g=>JSON.parse(g.run(`JSON.stringify({towers:bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.tw).map(b=>({slot:b.twSlot,n:b.n,up:+qrot(b.rb.rotation(),{x:0,y:1,z:0}).y.toFixed(3),x:Math.round(b.rb.translation().x/M)})),tops:bodies.filter(b=>!b.dead&&b.twTop).map(b=>({id:b.id,x:Math.round(b.rb.translation().x/M),h:Math.round(b.rb.translation().y/M)})),star:WILD.star,mode:WILD.mode,v2:WILD.v2})`));
(async()=>{
 {const {g}=await g0();check('build label',g.run('BUILD')==='2026.11.12 UAT 48',g.run('BUILD'));
  check('TOWER WALL is listed in the MODES picker after the UAT 45-47 modes',JSON.stringify(g.run('WILD_MODE_ORDER'))===JSON.stringify(['treats','laser','cozy','towers']),g.run('WILD_MODE_ORDER'));
  const errs=[];g.run('MODES_UI.open=true;MODES_UI.t=1');frames(g,25,errs);g.c.draw();fs.writeFileSync(path.join(OUT,'modes-picker.png'),g.c.document.getElementById('cv').toBuffer('image/png'));
  const R=JSON.parse(g.run('JSON.stringify(modesPickerRects())'));check('the picker fits the screen with four modes',R.card.y+R.card.h<=g.run('H')&&!errs.length,{bottom:R.card.y+R.card.h,H:g.run('H'),errs});
  const row=R.rows[3];g.tap(row.x+row.w/2,row.y+row.h/2);frames(g,5,errs);const w=wall(g);
  check('tapping TOWER WALL opens it on its goal card',w.mode==='towers'&&w.v2&&g.run('WILD.phase')==='card',{mode:w.mode,phase:g.run('WILD.phase')});
  g.c.draw();fs.writeFileSync(path.join(OUT,'goal-card.png'),g.c.document.getElementById('cv').toBuffer('image/png'));
  check('five standing towers (13/18/23/18/13 coins) with a prize on each, the star on the middle one',w.towers.length===5&&w.towers.every(t=>t.up>.999)&&JSON.stringify(w.towers.sort((a,b)=>a.slot-b.slot).map(t=>t.n))==='[13,18,23,18,13]'&&w.tops.length===5&&w.tops.some(t=>t.id===w.star&&Math.abs(t.x-200)<6&&t.h>190),w);
  g.close();}
 // a whole Tower wall round: 60 s of hold-to-drop, sound on, no errors; the wall topples
 {const {g,st,errs}=await g0(3);g.run("wildModeEnter('towers');wildStartCountdown()");let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
  g.run('globalThis.__tl=0;const __s=step;');let topples=0;
  for(let s=0;s<60&&!errs.length;s++){g.run(`S.coins=Math.max(S.coins,60);WILD.left=Math.max(WILD.left,20);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);frames(g,60,errs);}
  const left=g.run("bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.tw).length");
  check('60 s of Tower wall play without errors (sound on), the wall topples',!errs.length&&left<5&&st.created>0,{errs,towersStanding:left,audioNodes:st.created});g.close();}
 // sideways topple: a shoved wall tower leans toward its side
 {const {g,errs}=await g0(4);g.run("wildModeEnter('towers');wildStartCountdown()");let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
  g.run("globalThis.__t=bodies.find(b=>b.tw&&b.twSlot===4);__t.moved=__t.limit+1;__t.rb.setLinvel({x:0,y:0,z:.3},true);");let x0=g.run('__t.rb.translation().x/M'),dx=0;for(let i=0;i<40;i++){frames(g,1,errs);if(g.run('__t.dead'))break;dx=g.run('__t.rb.translation().x/M')-x0;}
  check('a right-hand wall tower that starts to tip leans right (toward the side)',g.run('!!__t.twSide')&&(dx>3||g.run('__t.dead')),{twSide:g.run('!!__t.twSide'),dx:+dx.toFixed(1),broke:g.run('__t.dead')});g.close();}
 // Paw save: a stronger flick in Tower wall only
 {const {g,errs}=await g0(5);g.run("wildModeEnter('towers');wildStartCountdown()");let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);frames(g,2,errs);const tw=g.run('PAW40.flick');
  g.run('wildExit();wild2Enter();wildStartCountdown()');k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);frames(g,2,errs);const w2=g.run('PAW40.flick');
  check('Paw save works the same in Tower wall as on Wild 2 (CP-40 flick)',tw===2.6&&w2===2.6,{tw,w2});
  check('Wild 2 without a mode has no wall',g.run("bodies.filter(b=>!b.dead&&b.tw).length")===0);g.close();}
 // the other modes keep their boards
 for(const id of ['treats','laser','cozy']){const {g}=await g0();g.run(`wildModeEnter('${id}')`);check(`${id} mode has no wall`,g.run('WILD.mode')===id&&g.run("bodies.filter(b=>!b.dead&&(b.tw||b.twTop)).length")===0);g.close();}
 {const {g}=await g0();const h=g.run('wildDevHtml()');check('Developer: Tower wall dial and start button',h.includes('tw-dev')&&h.includes('Sideways topple')&&h.includes('tw-start'));g.close();}
 {const r=await breakRun(src,true);check('Wild 2 dance break runs to the end',r.ended&&r.gameRunning&&!r.errs.length,r);}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
