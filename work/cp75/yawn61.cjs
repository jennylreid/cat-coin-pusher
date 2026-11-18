// CP-61 Yawn check helper: full board on Level 3, the wheel's Yawn (or none, the control), then the bottom layer and pushing.
const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
const {Path2D}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const FILL="(()=>{let k=0;for(let y=380;y<=700&&k<120;y+=14)for(let x=80;x<=320&&k<120;x+=14){addCoin('coin',null,x,40+(k%3)*8,y,randomTurn(.1));k++;}return k;})()";
const LAYER="(()=>{const bins={};let top=0,bottom=0;for(const b of bodies){if(b.dead||!(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))continue;const p=b.rb.translation(),x=p.x/M,y=p.y/M,z=p.z/M;if(z<380||z>570)continue;if(y<COIN_HALF*1.8){bottom++;bins[Math.floor((x-200)/(COIN_R*2))+','+Math.floor((z-380)/(COIN_R*2))]=1;}else top++;}let empty=0;for(let i=-4;i<4;i++)for(let j=0;j<Math.floor(190/(COIN_R*2));j++){const zc=380+(j+.5)*COIN_R*2;if(Math.abs(i+.5)*COIN_R*2<tableHalfAt(zc)-COIN_R*2&&!bins[i+','+j])empty++;}return {bottom,top,emptyCells:empty};})()";
const PIECES="bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5')).length";
async function yawnRun(file,yawn,seed=5){const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 const sc=()=>g.run('scale');g.run("S.dev=false;S.muted=true;");g.ticks(150);g.pointer('pointerdown',200*sc(),700*sc());g.pointer('pointerup',200*sc(),700*sc());g.ticks(40);
 g.run("PG.lv.passed=Math.max(PG.lv.passed,2);PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(!g.run("WILD.phase==='play'")&&k++<900)g.tick();
 g.run('WILD.nextBonus=999;WILD.left=999;');g.run(FILL);g.ticks(240);
 const before={...J(g,LAYER),pieces:J(g,PIECES)};g.run("globalThis.__side=0;const __rc=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side++;}catch(e){}return __rc.apply(this,arguments);};");
 if(yawn==='power')g.run("PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();globalThis.__pgpx=PGPX&&PGPX.id;");else if(yawn)g.run('w2StartYawn();');g.ticks(200);
 const after={...J(g,LAYER),pieces:J(g,PIECES),offSides:J(g,'__side')};
 // drops still push: 10 s of taps across the back, count coins paid over the front
 const c0=J(g,'S.coins+S.drops');for(let i=0;i<600;i++){if(i%24===0){const x=120+(i/24%5)*40;g.pointer('pointerdown',x*sc(),560*sc());g.tick();g.pointer('pointerup',x*sc(),560*sc());}else g.tick();}
 const paid=J(g,'S.coins+S.drops')-c0;return {power:yawn==='power'?J(g,"globalThis.__pgpx||null"):undefined,before,after,paidIn10s:paid,errs:J(g,"typeof __errs==='undefined'?[]:__errs")};}
module.exports={yawnRun};
if(require.main===module)(async()=>{for(const f of process.argv.slice(2))for(const y of [false,true])console.log(path.basename(path.dirname(path.resolve(f))),y?'yawn':'control',JSON.stringify(await yawnRun(path.resolve(f),y)));})();
