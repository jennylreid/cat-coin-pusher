const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
(async()=>{const g=await make({sourceFile:path.resolve(__dirname,'release.html'),render:false,width:400,height:889,pixelRatio:1,seed:3,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.tick=()=>{ms+=1000/60;t();};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<600;i++)g.tick();g.run('WILD.left=99;');
 console.log('items',J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id)"),'collection',J(g,'WILD_COLLECTION'));
 g.run("for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;");
 for(let n=0;n<3;n++){
 g.run("{const b=addCoin('item','milk',200,40,560,yawTurn(0));}");for(let i=0;i<60;i++)g.tick();
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 let tr=[];for(let i=0;i<8*60;i++){g.tick();if(i%30==0)tr.push(g.run("W2_YAWN?(W2_YAWN.t.toFixed(2)+(W2_YAWN.bottle?'B':'')):'-'"));}
 console.log(n,tr.join(' '),J(g,"CP58_BOTTLE.stats"),J(g,"bodies.filter(b=>b.bottle&&!b.dead).map(b=>{const p=b.rb.translation();return [p.x/M|0,p.y/M|0,p.z/M|0]})"),J(g,'CP58.stats.grabbed'));}
 // push one off the front
 g.run("globalThis.__cl=0;const __c=sfx.cp58Clink;sfx.cp58Clink=function(){__cl++;return __c.apply(this,arguments)};globalThis.__ta=treatAwards.length;globalThis.__have=JSON.stringify(WILD.have);");
 g.run("{const b=bodies.find(b=>b.bottle&&!b.dead);b.rb.setTranslation({x:200*M,y:20*M,z:(T.FRONT+8)*M},true);b.rb.setLinvel({x:0,y:-1,z:2},true);}");
 for(let i=0;i<90;i++)g.tick();
 g.run("{const b=bodies.find(b=>b.bottle&&!b.dead);if(b){b.rb.setTranslation({x:(T.R+12)*M,y:10*M,z:500*M},true);b.rb.setLinvel({x:2,y:-1,z:0},true);}}");
 for(let i=0;i<90;i++)g.tick();
 console.log('after',J(g,"CP58_BOTTLE.stats"),'clinks',g.run('__cl'),'awards',g.run('treatAwards.length-__ta'),'haveSame',g.run('JSON.stringify(WILD.have)===__have'),'errs',J(g,'__errs'));
 g.close();})().catch(e=>{console.error(e);process.exit(1)});
