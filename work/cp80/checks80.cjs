const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const make=require('./runtime.cjs');
const {createCanvas,loadImage,Path2D}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp79/release.html'),out=path.resolve(__dirname,'../../tickets/CP-62-evidence/uat80');fs.mkdirSync(out,{recursive:true});
let passed=[],failed=[];function check(n,b){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n);}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function game(file,w=400,h=889){const g=await make({sourceFile:file,render:true,width:w,height:h,pixelRatio:1,seed:5,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=Path2D;g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.tap=(x,y)=>{let s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};g.run("S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e));return __fe(e)}");g.ticks(150);g.tap(200,700);g.ticks(40);return g;}
function shot(g,n){g.c.draw();fs.writeFileSync(path.join(out,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));}
function pixels(im){let c=createCanvas(128,128);c.getContext('2d').drawImage(im,0,0);return Buffer.from(c.getContext('2d').getImageData(0,0,128,128).data);}
async function burst(file){let g=await game(file);g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['milk','mouse','bell','notes','bowtie','yarn','cushion'].entries())queueTreatAward(id,70+i*40,null,false,'item')");let trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}return {trace,sounds:J(g,'__sounds')};}
(async()=>{
let text=fs.readFileSync(src,'utf8'),before=fs.readFileSync(base,'utf8');
let restored=text.replace("const BUILD = '2026.11.16 UAT 80';","const BUILD = '2026.11.16 UAT 79';");
const start=restored.indexOf('\n // CP-62: preload'),end=restored.indexOf('\n',restored.lastIndexOf("CP62_ART['cushion'].push" ));
restored=restored.slice(0,start)+restored.slice(end+1);
for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')))restored=restored.replace(b,a);
restored=restored.replace(fs.readFileSync(path.join(__dirname,'colours.js'),'utf8').replace(/\r\n/g,'\n')+'\n','');
check('Only label, selected cache paintings and isolated colour rendering differ from UAT 79',restored===before);
const g=await game(src),b=await game(base);
for(const [id,o] of [['milk','b'],['mouse','a'],['bell','a'],['notes','c'],['bowtie','a'],['yarn','a']]){let actual=g.run(`wildPrizeArt('${id}')`),approved=await loadImage(fs.readFileSync(path.resolve(__dirname,`../../tickets/CP-62-evidence/${id}-${o}.png`)));check(id+' uses exactly the approved 128px painting',actual.width===128&&actual.height===128&&pixels(actual).equals(pixels(approved)));check(id+' board size, visible-share and aspect unchanged',JSON.stringify(J(g,`[radius('item'),prizeWidth('${id}',1),prizeCenterLift('${id}',1),PRIZE_OPAQUE['${id}'],PRIZE_ASPECT['${id}']]`))===JSON.stringify(J(b,`[radius('item'),prizeWidth('${id}',1),prizeCenterLift('${id}',1),PRIZE_OPAQUE['${id}'],PRIZE_ASPECT['${id}']]`)));}
for(const [id,ticket] of [['notes','62'],['yarn','62'],['cushion','52']]){
 for(const [i,o] of ['a','b','c'].entries()){
 const approved=await loadImage(fs.readFileSync(path.resolve(__dirname,`../../tickets/CP-${ticket}-evidence/${id}-${o}.png`)));
 check(id+' '+o+' colour uses exact approved pixels',pixels(g.run(`CP62_ART['${id}'][${i}]`)).equals(pixels(approved)));
 }
 check(id+' random choices stable and all three colours reachable',g.run(`(()=>{const owners=Array.from({length:90},()=>({})),v=owners.map(o=>cp62Colour('${id}',o));return new Set(v).size===3&&owners.every((o,i)=>cp62Colour('${id}',o)===v[i]);})()`));
 check(id+' colour carries from body through pooled pickup and loss',g.run(`(()=>{const body={id:'${id}'},i=cp62Colour('${id}',body),f=queueTreatAward('${id}',200,body),lost=queueLostPrize(body,0,500);return cp62Colour('${id}',f)===i&&cp62Colour('${id}',lost)===i;})()`));
}
check('Art draws do not consume gameplay RNG or leak shared cache state',g.run(`(()=>{let calls=0;const old=Math.random;Math.random=()=>{calls++;return .5};const im=WILD_ART.notes;try{for(let i=0;i<10;i++)cp62DrawPrize('item','notes',100,100,1,{});return calls===0&&WILD_ART.notes===im;}finally{Math.random=old;}})()`));
check('Seven simultaneous pickups have identical frame trace and sound calls to UAT 79',JSON.stringify(await burst(src))===JSON.stringify(await burst(base)));
const coverage={};for(const [w,h] of [[360,640],[412,915]]){const x=await game(src,w,h),sz=w+'x'+h;
x.run("pglLv().passed=9;pglLv().sel=2;PG.shown={kitchen:1,album:1};for(const id of PG_PRIZES){PG.ever[id]=1;PG.items[id]=3;}if(WILD.phase==='card')wildReset();");x.ticks(10);x.c.draw();shot(x,'home-goals-'+sz);
const p=J(x,'PGA.L.play');x.tap(p.x+p.w/2,p.y+p.h/2);for(let i=0;i<900&&x.run('WILD.phase')!=='play';i++)x.tick();x.ticks(30);
// Evidence fixture: substitute the seven reviewed prizes on the Level 2 board; shipped levels are unchanged.
x.run("{const ids=['milk','mouse','bell','notes','bowtie','yarn','cushion'];const qs=bodies.filter(b=>!b.dead&&b.kind==='item');while(qs.length<ids.length){const i=qs.length;qs.push(addCoin('item',ids[i],i===5?140:260,COIN_HALF*2+halfOf('item')+1,650,yawTurn(0)));}qs.forEach((b,i)=>b.id=ids[i%ids.length]);globalThis.__fixtureCount=qs.length;}");shot(x,'board-'+sz);
x.run("{for(const b of [...bodies])if(b.kind==='item')removeCoin(b);for(const [row,id] of ['notes','yarn','cushion'].entries())for(let i=0;i<3;i++){const b=addCoin('item',id,100+i*100,COIN_HALF*2+halfOf('item')+1,470+row*105,yawTurn(0));CP62_COLOURS.set(b,{id,i});}}");shot(x,'board-colours-'+sz);
x.run("treatAwards.length=0;for(const b of bodies.filter(b=>!b.dead&&b.kind==='item')){queueTreatAward(b.id,b.rb.translation().x/M,b);}for(const f of treatAwards){f.t=.5;}drawTreatAward();");shot(x,'pickup-colours-'+sz);
x.run("globalThis.__seen=[];const __art=wildPrizeArt;wildPrizeArt=function(id){__seen.push(id);return __art(id)};");
x.run("PGU.album.page=0;pgGo('album');");x.ticks(30);shot(x,'album-'+sz);coverage['album-'+sz]=J(x,'[...new Set(__seen)]');
x.run("__seen=[];pgGo('kitchen');");x.ticks(10);shot(x,'kitchen-'+sz);coverage['kitchen-'+sz]=J(x,'[...new Set(__seen)]');
x.run("pgGo('board');cp51Paused=false;WILD.phase='play';cp51Finish();");x.ticks(100);shot(x,'end-card-'+sz);coverage['errors-'+sz]=J(x,'__errs');check('No frame errors at '+sz,coverage['errors-'+sz].length===0);
}
check('Album draws all seven updated prizes at both sizes',['360x640','412x915'].every(sz=>['milk','mouse','bell','notes','bowtie','yarn','cushion'].every(id=>coverage['album-'+sz].includes(id))));
fs.writeFileSync(path.join(out,'checks80.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,coverage},null,2));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});






