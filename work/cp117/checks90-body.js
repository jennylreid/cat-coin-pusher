const K='catpusher.uat.cp90kittens.v1';
const TR="JSON.stringify([PGPX?PGPX.id:'-',PGPX?+PGPX.t.toFixed(3):-1,S.coins,bodies.filter(b=>!b.dead).length,WILD.got,+PUSH_PERIOD.toFixed(5),Z72X?Z72X.kits.map(k=>k.P?[k.P.seg,+k.P.x.toFixed(2),+k.P.z.toFixed(2),+(k.P.h||0).toFixed(2),k.P.puff||0,k.gone?1:0]:null):null,JSON.stringify(Z72.stats.paid)])";
// One Zoomies on the Orange board: the play traced every frame; optionally which art each kitten was drawn with
async function zoom(file,{seed=1,fps=60,mode=null,render=false,w=400,h=889,frames=null,spy=false}={}){
 const store=mode?{[K]:mode}:{};const {g,tk}=await midRound(file,{seed,fps,render,w,h,pr:1,store,cat:'orange'});
 if(spy)g.run(`globalThis.__art=[];globalThis.__f=0;{const z=z72Kitten;z72Kitten=function(x,y,s,C,ph,dir,skid,alpha,lean,puff,rot,pose){const p0=CP90.stats.painted;const r=z.apply(this,arguments);if(!(alpha>0))return r; /* a hidden copy (opacity 0) draws nothing */
   const X=Z72X,P=X&&X.kits.find(k=>k.coat===C&&k.P),pk=X&&X.kits[0]&&X.kits[0].P&&X.kits[0].P.pk;__art.push([__f,C===Z72.coats[1]?'cream':'ginger',CP90.stats.painted>p0?(CP90.peekNow?'peek':'painted'):'original',+alpha.toFixed(4),puff||0,P?P.P.seg:'',pk||'',X?+X.t.toFixed(3):-1]);return r;};}`);
 g.run(TAP);const tr=[],shots={};let i=0;
 for(;i<14*fps&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();tr.push(g.run(TR));if(spy)g.run('__f++');
  if(render){g.c.draw();if(frames&&frames.includes(i)){const cv=g.c.document.getElementById('cv');shots[i]=crypto.createHash('sha256').update(Buffer.from(cv.getContext('2d').getImageData(0,0,cv.width,Math.floor(cv.height*.85)).data.buffer)).digest('hex');}}}
 const r={len:i,hash:crypto.createHash('sha256').update(tr.join('\n')).digest('hex'),shots,art:spy?J(g,'__art'):null,errs:J(g,'__errs'),clean:g.run('!Z72X&&!PGPX'),mode:g.run("typeof CP90!=='undefined'?CP90.get():'none'")};
 g.close();return r;}
(async()=>{
 // 0. the build
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');let m=[1];if(crypto.createHash('sha256').update(B).digest('hex')!==V.baseSHA256)m=[];for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published UAT 116 + build name + cp90-kittens.js (everything else unchanged)',S===B&&m.length===1);}
 // 1. Original: exactly today's Zoomies: the play identical to UAT 116 every frame (2 seeds x 60/30 fps), and the picture
 // identical on 8 frames from the run to the peek (render harness, 400x889, top 85%: below it the footer label differs by name)
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const a=await zoom(src,{seed,fps,mode:'original'}),b=await zoom(base,{seed,fps});
   const row={fps,seed,len:[a.len,b.len],same:a.hash===b.hash,mode:a.mode,errs:a.errs.length+b.errs.length};rows.push(row);if(!(row.same&&a.mode==='original'&&!row.errs&&a.clean))ok=false;}
  const F=[40,100,170,240,310,380,450,500]; /* all within the shortest run (526 frames at 60 fps) */const a=await zoom(src,{seed:3,mode:'original',render:true,frames:F}),b=await zoom(base,{seed:3,render:true,frames:F});
  const pics=F.map(f=>a.shots[f]&&a.shots[f]===b.shots[f]);if(!pics.every(Boolean))ok=false;notes.original={rows,pictures:pics};
  check('1 Original: the play identical to UAT 116 on every frame (2 seeds x 60/30 fps) and the picture identical on 8 frames from the run to the peek',ok,{rows,pics});}
 // 2. Painted: the play identical to UAT 116 on every frame (the art is drawing only)
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const a=await zoom(src,{seed,fps}),b=await zoom(base,{seed,fps});
   const row={fps,seed,same:a.hash===b.hash,mode:a.mode,errs:a.errs.length+b.errs.length};rows.push(row);if(!(row.same&&a.mode==='painted'&&!row.errs&&a.clean))ok=false;}
  notes.paintedPlay=rows;check('2 Painted (the default): the play identical to UAT 116 on every frame (2 seeds x 60/30 fps); clean after',ok,rows);}
 // 3. Painted: which art each kitten is drawn with on every frame. Painted whenever not puffed; the puff (spook jump, final leap,
 // hang, drop to the edge) is the original drawing; the peek's hold and duck are the painted peek. Every switch is a one-frame
 // switch, never a fade: painted art is drawn at full opacity except during the kittens' pop-in (as the original is)
 {const r=await zoom(src,{seed:1,render:true,spy:true}),A=r.art;const by={ginger:[],cream:[]};for(const a of A)by[a[1]].push(a);
  const sw={};let ok=!r.errs.length;
  for(const [name,L] of Object.entries(by)){const out=[];for(let i=1;i<L.length;i++)if(L[i][2]!==L[i-1][2])out.push({frame:L[i][0],t:L[i][7],from:L[i-1][2],to:L[i][2],seg:L[i][5],pk:L[i][6],puff:L[i][4]});sw[name]=out;}
  const bad=A.filter(a=>a[2]!=='original'&&(a[4]>0||(a[3]<1&&a[5]!=='pop'&&a[5]!=='leap')));const leapOut=A.filter(a=>a[2]!=='original'&&a[3]<1&&a[5]==='leap').map(a=>a[1]);
  const lostPuff=A.filter(a=>a[4]>0&&a[2]!=='original');const dropPainted=A.filter(a=>a[1]==='ginger'&&a[6]==='drop'&&a[2]!=='original');
  const g=sw.ginger.map(s=>s.to+'@'+(s.pk||s.seg)),c=sw.cream.map(s=>s.to+'@'+(s.pk||s.seg));
  const gOK=JSON.stringify(g)===JSON.stringify(['original@spook','painted@run','original@leap','peek@hold']),cOK=JSON.stringify(c)===JSON.stringify(['original@spook','painted@run']);
  if(!(gOK&&cOK&&!bad.length&&!lostPuff.length&&!dropPainted.length))ok=false;notes.switches={ginger:sw.ginger,cream:sw.cream,frames:A.length,leapOutFrames:leapOut.length,leapOutKittens:[...new Set(leapOut)]};
  check('3 Painted: each kitten switches art only on these frames, instantly, never fading: ginger '+g.join(', ')+'; cream '+c.join(', ')+'; the puff always the original drawing; painted art at full opacity except where the original itself changes opacity (the pop-in, and the cream kitten fading as it leaps off the front: '+leapOut.length+' frames, as approved)',ok,{ginger:sw.ginger,cream:sw.cream,bad:bad.slice(0,3)});}
 // 4. stills at 412x915 and 360x640, Painted and Original on the same frames: both kittens running, the spook puff, the hang
 // puff, the peek; and a side-by-side sheet (Painted left, Original right)
 {const beats=[['1-both-running',"(()=>{const X=Z72X;return !!X&&X.kits.length===2&&X.kits.every(k=>k.P&&!k.gone&&k.P.seg==='run'&&!(k.P.puff>0));})()"],
   ['2-spook-puff',"(()=>{const k=Z72X&&Z72X.kits.find(k=>k.P&&k.P.seg==='spook'&&k.P.u>=.3);return !!k;})()"],
   ['3-hang-puff',"(()=>{const k=Z72X&&Z72X.kits[0];return !!(k&&k.P&&!k.gone&&k.P.si===k.segs.length-4&&k.P.u>=.5);})()"],
   ['4-peek',"(()=>{const k=Z72X&&Z72X.kits[0];return !!(k&&k.P&&k.P.pk==='hold'&&k.P.pu>=.5);})()"]];
  const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;const pics={};
   for(const mode of ['painted','original']){const {g,tk}=await midRound(src,{seed:7,w,h,pr:2,render:true,store:{[K]:mode},cat:'orange'});g.run(TAP);const got=[];
    for(const [n,c] of beats){let i=0;while(!g.run(c)&&i++<900)tk();if(i<900){g.c.draw();const f=path.join(out,`kittens-${mode}-${n}-${sz}.png`);fs.writeFileSync(f,g.c.document.getElementById('cv').toBuffer('image/png'));got.push(n);(pics[n]=pics[n]||{})[mode]=f;}}
    rows.push({sz,mode,got,errs:J(g,'__errs').length});if(got.length!==4||J(g,'__errs').length)ok=false;g.close();}
   // side by side (Painted | Original) for each beat
   const {createCanvas,loadImage}=require(NAPI);for(const [n] of beats){const P=pics[n];if(!P||!P.painted||!P.original){ok=false;continue;}
    const a=await loadImage(P.painted),b=await loadImage(P.original),cv=createCanvas(a.width*2+16,a.height),x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.drawImage(a,0,0);x.drawImage(b,a.width+16,0);
    x.font='bold 40px sans-serif';x.fillStyle='#fff';x.strokeStyle='#000';x.lineWidth=6;for(const [t,X0] of [['Painted',20],['Original',a.width+36]]){x.strokeText(t,X0,60);x.fillText(t,X0,60);}
    fs.writeFileSync(path.join(out,`kittens-side-by-side-${n}-${sz}.png`),cv.toBuffer('image/png'));}}
  notes.stills=rows;check('4 stills at 412x915 and 360x640, Painted and Original on the same frames (both kittens running, spook puff, hang puff, peek) and side-by-side sheets; no frame errors',ok,rows);}
 // 5. the choice: Painted by default; a saved Original starts as Original; anything else saved falls back to Painted; choosing saves it
 {const r={};for(const [tag,store] of [['fresh',{}],['savedOriginal',{[K]:'original'}],['savedPainted',{[K]:'painted'}],['junk',{[K]:'zzz'}]]){
   const {g}=await midRound(src,{seed:1,secs:1,store,cat:'orange'});r[tag]=J(g,'CP90.get()');
   if(tag==='fresh'){g.run("CP90.set('original')");r.afterSet=[J(g,'CP90.get()'),J(g,`localStorage.getItem('${K}')`)];g.run("CP90.set('nope')");r.afterBad=J(g,'CP90.get()');r.art=J(g,'Object.keys(CP90.art).sort()');}g.close();}
  notes.choice=r;check('5 "Zoomies kittens": Painted by default; a saved Original starts as Original; junk falls back to Painted; choosing saves it on the phone',
   r.fresh==='painted'&&r.savedOriginal==='original'&&r.savedPainted==='painted'&&r.junk==='painted'&&r.afterSet[0]==='original'&&r.afterSet[1]==='original'&&r.afterBad==='original',r);} // the art files loading is checked in real Chrome (kitcheck) and by the stills (check 4)
 check('6 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks90.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
