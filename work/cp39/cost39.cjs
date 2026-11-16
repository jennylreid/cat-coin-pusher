// CP-37 frame cost (desktop, real runtime, @napi-rs/canvas DPR 1.35; not phone FPS). Short runs (240 drawn frames per
// process; long render runs crash the desktop canvas library). Writes tickets/CP-37-evidence/frame-cost.json.
// Draw: UAT 38 vs UAT 38 + the drawing part of the fix (same physics, so the very same boards), Wild and Board 3,
// after 30 s of hold-to-drop. Physics: the time UAT 39's backstop check adds per step, timed on its own.
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const SRC={uat38:path.resolve(__dirname,'../cp38/release.html'),order:path.resolve(__dirname,'../cp37-bug/uat38-orderonly.html'),uat39:path.resolve(__dirname,'release.html')};
const which=process.argv[2],board=process.argv[3],seed=+(process.argv[4]||4);
(async()=>{const g=await game({seed,render:true,src:SRC[which]}),a=g.c.__game,rt=g.realNow;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');g.run('finishBoard=()=>{}');
 for(let s=0;s<30;s++){g.run(`S.coins=Math.max(S.coins,50);if(WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+${seed}),y:DROP_Y};`);g.ticks(60);}
 const P=[],D=[],N=[];
 if(which==='uat39')g.run(`globalThis.__nudgeOnly=function(){for(const b of bodies){if(b.dead||b.kind==='stack'||b.danceDown||(b.input&&b.fresh))continue;const t=b.rb.translation(),z=t.z/M;if(z>CP37_BACK_ZONE)continue;if(screenOf(t.x/M,z,t.y/M).y>=CP37_CHIN_CLEAR)continue;}}`);
 for(let i=0;i<240;i++){if(i%60===0)g.run(`holding=true;holdPos={x:200+70*Math.sin(${30+i/60}*0.9+${seed}),y:DROP_Y};`);let t=rt();g.tick();P.push(rt()-t);t=rt();g.c.draw();D.push(rt()-t);
  if(which==='uat39'){t=rt();g.run('__nudgeOnly()');N.push(rt()-t);}}
 const st=x=>{if(!x.length)return null;const s=x.slice().sort((a,b)=>a-b);return {mean:+(x.reduce((a,b)=>a+b,0)/x.length).toFixed(3),p95:+s[Math.floor(s.length*.95)].toFixed(3)};};
 const r={which,board,seed,bodies:g.run('bodies.filter(b=>!b.dead).length'),stepMs:st(P),drawMs:st(D),backstopCheckMs:st(N)};console.log(JSON.stringify(r));g.close();
 const f=path.resolve(__dirname,'../../tickets/CP-37-evidence/frame-cost.json');fs.mkdirSync(path.dirname(f),{recursive:true});let all=[];try{all=JSON.parse(fs.readFileSync(f))}catch(e){}all.push(r);fs.writeFileSync(f,JSON.stringify(all,null,1));})();
