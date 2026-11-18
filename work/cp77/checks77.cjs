// UAT 77 checks (CP-61 follow-up): the YAWN power and the wheel's Yawn both knock off only a few top coins; nothing else
// differs from UAT 76; frozen pickup identical; production untouched. Usage: node checks77.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');const {yawnRun}=require('../cp75/yawn61.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp76/release.html'),out=path.resolve(__dirname,'../../tickets/CP-61-evidence/uat77');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function burst(file){const g=await make({sourceFile:file,render:true,width:400,height:889,pixelRatio:1,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 const edits=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));let r=fs.readFileSync(src,'utf8');for(const [a,b] of edits.slice().reverse())r=r.replace(b,a);
 check('0 only the build name and the two Yawn lines differ from UAT 76',r===fs.readFileSync(base,'utf8'));
 const c=await yawnRun(src,false),p1=await yawnRun(src,'power'),p0=await yawnRun(base,'power'),w1=await yawnRun(src,true);notes={control:c,power:p1,powerUAT76:p0,wheel:w1};
 const ok=y=>y.after.offSides<=8&&y.after.bottom>=c.after.bottom-2&&y.after.emptyCells<=c.after.emptyCells+1&&y.paidIn10s>0;
 check('1 YAWN power on a full board: '+p1.after.offSides+' coins off the sides (UAT 76: '+p0.after.offSides+'), bottom layer '+p1.after.bottom+' (no Yawn '+c.after.bottom+', UAT 76 '+p0.after.bottom+'), gaps '+p1.after.emptyCells+' (no Yawn '+c.after.emptyCells+', UAT 76 '+p0.after.emptyCells+'), '+p1.paidIn10s+' coins paid in the next 10 s (UAT 76 '+p0.paidIn10s+')',
  p1.power==='yawn'&&p0.power==='yawn'&&ok(p1)&&p0.after.offSides>20,{p1:p1.after,p0:p0.after});
 check('2 the wheel Yawn unchanged: '+w1.after.offSides+' off the sides, bottom '+w1.after.bottom+', drops still pay '+w1.paidIn10s,ok(w1));
 check('3 seven simultaneous pickups: identical frame trace and sound calls to UAT 76',(await burst(src))===(await burst(base)));
 check('4 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks77.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
