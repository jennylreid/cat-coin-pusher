// Read-only desktop game fixture. Accessories are review overlays in memory only.
const {game}=require('../../../work/cp43/harness.cjs'),fs=require('fs'),path=require('path');
const {createCanvas,loadImage}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const D=__dirname,root=path.resolve(D,'../../..');
const save=(c,n)=>fs.writeFileSync(path.join(D,n+'.png'),c.toBuffer('image/png'));
(async()=>{
 const g=await game({src:path.join(root,'work/cp85/release.html'),render:true,height:915/412*400,seed:7,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.ticks(140);g.run("S.dev=false;if(!PG)pgInit();PGU.title.t=9;pgTitleDone();PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");
 if(!g.until("WILD.phase==='play'",1200))throw Error('No board');g.ticks(90);
 g.run("WILD.nextBonus=999;WILD.left=60;PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=2;pgpUse('tuxedo');");
 if(!g.run('!!CP63X'))throw Error('No inspection');g.ticks(80);
 const cv=g.c.document.getElementById('cv'),out=createCanvas(412,915),og=out.getContext('2d');
 const shot=n=>{g.c.draw();og.drawImage(cv,0,0,412,915);save(out,n);};
 shot('baseline-412x915');
 // Capture current stand-ins directly through their real draw routines.
 for(const id of ['hat','bowtie','monocle','cane']){const c=createCanvas(1536,1024),ctx=c.getContext('2d');if(id==='monocle'){g.c.__reviewCtx=ctx;g.run('globalThis.__savedCtx=ctx;ctx=__reviewCtx');ctx.scale(1536/420,1024/240);ctx.translate(10,25);g.c.cp63Monocle();g.run('ctx=__savedCtx');}else if(id==='cane'){g.c.__reviewCtx=ctx;g.run('globalThis.__savedCtx=ctx;ctx=__reviewCtx');g.run('CP63X.t=2.5');ctx.scale(3,3);ctx.translate(30,-320);g.c.cp63DrawCane(2.5);g.run('ctx=__savedCtx');g.run('CP63X.t=1.3333333333');}else{ctx.fillStyle='#c3d4d5';ctx.font='48px Arial';ctx.fillText('None today',550,500);}save(c,'current-'+id);}
 g.c.__reviewImages={};
 g.run('const __reviewBase=__cp63Pupils;drawTrackingPupils=function(){__reviewBase();for(const im of Object.values(__reviewImages))ctx.drawImage(im,-10,-25,420,240);};');
 const sheet=createCanvas(824,955),sg=sheet.getContext('2d');sg.fillStyle='#13252b';sg.fillRect(0,0,824,955);
 for(const [i,o]of (process.argv.includes('--partial')?['a']:['a','b']).entries()){g.c.__reviewImages={};for(const id of ['hat','bowtie','monocle'])g.c.__reviewImages[id]=await loadImage(path.join(D,id+'-'+o+'.png'));shot('on-cat-'+o+'-412x915');sg.fillStyle='white';sg.font='bold 23px Arial';sg.fillText('Option '+o.toUpperCase(),i*412+15,29);sg.drawImage(out,i*412,40);}
 save(sheet,'on-cat-contact-sheet');
 if(!process.argv.includes('--partial')){
 g.run("CP63X.t=2.7;cp63DrawCane=function(t){const z=Math.min(cp63CaneZ(t),T.FRONT+30),sp=cp63CaneSpan(z),A=skyScreen(sp.xl,z,14),B=skyScreen(sp.xr,z,14);ctx.drawImage(__reviewCane,262,330,922,185,A.x-5*B.s,A.y-58*B.s,B.x-A.x+29*B.s,68*B.s);};");
 const cs=createCanvas(824,955),cg=cs.getContext('2d');cg.fillStyle='#13252b';cg.fillRect(0,0,824,955);
 for(const [i,o]of ['a','b'].entries()){g.c.__reviewImages={};for(const id of ['hat','bowtie','monocle'])g.c.__reviewImages[id]=await loadImage(path.join(D,id+'-'+o+'.png'));g.c.__reviewCane=await loadImage(path.join(D,'cane-'+o+'.png'));shot('cane-on-board-'+o+'-412x915');cg.fillStyle='white';cg.font='bold 23px Arial';cg.fillText('Cane '+o.toUpperCase(),i*412+15,29);cg.drawImage(out,i*412,40);}save(cs,'cane-on-board-contact-sheet');
 }
 fs.writeFileSync(path.join(D,'preview-validation.json'),JSON.stringify({source:'work/cp85/release.html',build:g.run('BUILD'),preview:[412,915],mode:'Read-only desktop fixture; in-memory accessory overlays',options:['a','b']},null,2));g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
