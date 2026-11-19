# Makes checks100.cjs from UAT 98's check (as regenerated for UAT 99: work/cp99/checks98-on99.cjs). Usage: python make-checks100.py
from pathlib import Path
s=Path(__file__).parent.joinpath('../cp99/checks98-on99.cjs').read_text(encoding='utf-8')
head_end=s.index("const fs=require")
s="""// UAT 100 checks (CP-72, Jenny Nov 18 on UAT 99: "can you shorten the up close pause and if that doesn't work we'll revert
// to your earlier version, prior to my close-up request."): the showing-off close-up held 0.4 s (was 1 s), zoom in/out as
// before; "Zoomies ending" Developer choice Short close-up (default) / Hang (UAT 96). Usage: node checks100.cjs
// -> tickets/CP-72-evidence/uat100/checks100.json + stills zoomies-short-*.png, zoomies-hang-middle-*.png
"""+s[head_end:]
def rep(a,b,n=1):
    global s;assert s.count(a)==n,(a[:90],s.count(a));s=s.replace(a,b)
rep("const DEV=process.env.DEV==='1',V=","const DEV=false,V=")
rep("base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../cp98/edits.json'),'utf8')).base,out=path.resolve(__dirname,'../../tickets/CP-79-evidence/uat99'+(DEV?'-dev':''))",
    "base=path.resolve(__dirname,'../cp99/release.html'),out=path.resolve(__dirname,'../../tickets/CP-72-evidence/uat100')")
rep("async function midRound(file,{seed,level=3,secs=10,fps=60,render=false,w=400,h=889,pr=1}){","async function midRound(file,{seed,level=3,secs=10,fps=60,render=false,w=400,h=889,pr=1,store={}}){")
rep("storage:{'catpusher.uat.devdefault.v1':'1'}}):await make(","storage:{'catpusher.uat.devdefault.v1':'1',...store}}):await make(")
rep("seed,storage:{'catpusher.uat.devdefault.v1':'1'}});\n if(render)","seed,storage:{'catpusher.uat.devdefault.v1':'1',...store}});\n if(render)")
a=s.index(" // 0. the build");b=s.index(" // 1. ")
s=s[:a]+""" // 0. the build
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');let m=[1];if(crypto.createHash('sha256').update(B).digest('hex')!==V.baseSHA256)m=[];for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published UAT 99 + build name + cp72-ending.js (everything else unchanged)',S===B&&m.length===1);}
"""+s[b:]
a=s.index(" // 1. ");b=s.index(" // 2. ")
s=s[:a]+r""" // 1. the kittens' paths against UAT 99: the cream kitten's identical; the ginger kitten's identical up to its hang, in the
 // finish after it, and where it lands; the hang lasts 0.85 s (UAT 99: 1.45 s): the zoom up to the close-up (0.2 s) and back
 // out (0.25 s) take as long as in UAT 99, the close-up is held 0.4 s (UAT 99: 1 s), tilted 20 degrees, puffed and fully
 // visible as before. The "Hang" choice gives exactly UAT 96's hang ('still', as in UAT 99 with style 'still').
 {const P=st=>`(()=>{${st}const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const L=[];for(let u=0;u<=k.len+.001;u+=1/60)L.push(z72KitPos(k,u));const E=z72KitPos(k,k.len);out.push({len:k.len,segs:k.segs.map(s=>s.k+':'+s.d.toFixed(4)),pos:L,end:{x:E.x,z:E.z,h:E.h}});}return out;})()`;
  const FIN=`(()=>{const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const g=k.segs[k.segs.length-1];out.push([0,.25,.5,.75,1].map(u=>g.f(u)));}return out;})()`;
  const g=(await midRound(src,{seed:3})).g;const a=J(g,P('')),J2={finish:J(g,FIN)},hang=J(g,P("CP72E.set('hang');"));g.close();
  const g2=(await midRound(base,{seed:3})).g;const b=J(g2,P('')),Jb={finish:J(g2,FIN)},bStill=J(g2,P("Z72.leapHang.style='still';"));g2.close();
  const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);const r={paths:[]};
  r.hangChoice=same(hang,bStill);r.cream=same(a[1],b[1]);
  const ramp=(H,first)=>{let n=0;const L=first?H:[...H].reverse();for(const p of L){if((p.face||0)>=1)break;n++;}return +(n/60).toFixed(2);};
  for(const n of [0,2,3]){const A=a[n],B=b[n],li=B.segs.length-2,T0=B.pos.findIndex(p=>p.si===li);const row={start:+B.pos[T0].x.toFixed(1)};
   row.before=same(A.pos.slice(0,T0),B.pos.slice(0,T0));row.segsSame=same(A.segs.filter((s,i)=>i!==li),B.segs.filter((s,i)=>i!==li));
   row.finishSame=same(J2.finish[n],Jb.finish[n]);row.end=same(A.end,B.end);
   const H=A.pos.filter(p=>p.si===li),Hb=B.pos.filter(p=>p.si===li);row.hangS=+(H.length/60).toFixed(2);row.baseHangS=+(Hb.length/60).toFixed(2);
   row.fullS=+(H.filter(p=>p.face===1).length/60).toFixed(2);row.baseFullS=+(Hb.filter(p=>p.face===1).length/60).toFixed(2);
   row.zoomIn=[ramp(H,true),ramp(Hb,true)];row.zoomOut=[ramp(H,false),ramp(Hb,false)];
   row.tiltDeg=+(Math.max(...H.map(p=>Math.abs(p.lean||0)))*180/Math.PI).toFixed(2);row.tiltWithFace=H.every(p=>Math.abs(Math.abs(p.lean||0)-(p.face||0)*20*Math.PI/180)<1e-9);
   row.asBefore=H.every(p=>p.puff===1&&p.fade===1)&&Math.abs(Math.max(...H.map(p=>p.grow))-Math.max(...Hb.map(p=>p.grow)))<1e-9;
   r.paths.push(row);}
  notes.paths=r;console.log(JSON.stringify(r));const p0=r.paths[0];
  check('1 against UAT 99: the cream kitten\'s path identical; the ginger kitten\'s identical up to its hang, after it and where it lands; the hang lasts '+p0.hangS+' s (UAT 99: '+p0.baseHangS+' s); zoom in '+p0.zoomIn[0]+' s / out '+p0.zoomOut[0]+' s as in UAT 99 ('+p0.zoomIn[1]+' / '+p0.zoomOut[1]+'); the close-up held '+p0.fullS+' s (UAT 99: '+p0.baseFullS+' s), tilted '+p0.tiltDeg+' degrees; puffed and fully visible; the Hang choice is exactly UAT 96\'s hang',
   r.hangChoice&&r.cream&&r.paths.every(p=>p.before&&p.segsSame&&p.finishSame&&p.end&&p.hangS>=.84&&p.hangS<=.87&&p.fullS>=.38&&p.fullS<=.43&&Math.abs(p.zoomIn[0]-p.zoomIn[1])<=.02&&Math.abs(p.zoomOut[0]-p.zoomOut[1])<=.02&&Math.abs(p.tiltDeg-20)<.01&&p.tiltWithFace&&p.asBefore),r);}
"""+s[b:]
rep("notLongerThanHang:a.len>=b.len-.02&&a.len<=b.len+.47","shorterBy:a.len<=b.len+.001&&a.len>=b.len-.62&&a.len>=8.23")
i=s.index("'2 in play against the base");j=s.index("('",i)
s=s[:i]+"'2 in play against UAT 99 (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on exactly the same frames; the power ends once both kittens have finished, up to 0.6 s (the shorter hold) before UAT 99, never before the 7 s turbo is over "+s[j:]
rep("turboSame:JSON.stringify(a.per.slice(0,b.per.length))===JSON.stringify(b.per)","turboSame:JSON.stringify(a.per)===JSON.stringify(b.per.slice(0,a.per.length))")
rep("for(const [tag,file] of [['',src],['-before',base]]){const {g,tk}=await midRound(file,{seed:7,w,h,pr:2,render:true});",
    "for(const [tag,file,store] of [['',src,{}],['-hang',src,{'catpusher.uat.cp72ending.v1':'hang'}]]){const {g,tk}=await midRound(file,{seed:7,w,h,pr:2,render:true,store});")
rep("path.join(out,`zoomies-crazy${tag}-${n}-${sz}.png`)","path.join(out,`zoomies-${tag?'hang':'short'}-${n}-${sz}.png`)")
i=s.index("check('3 at 412x915");j=s.index("stays within the screen",i)
s=s[:i]+"check('3 at 412x915 and 360x640: stills of the short close-up (start, middle, end), and of the Hang choice (middle); the close-up (from a quarter of the way up; its size with the tilt) "+s[j:]
rep(" check('4 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);",
r""" // 4. the choice: default Short close-up ('crazy', held 0.4 s); a saved "hang" starts as UAT 96's hang; anything else saved
 // falls back to the default; choosing saves it on the phone (catpusher.uat.cp72ending.v1)
 {const r={};for(const [tag,store] of [['fresh',{}],['savedHang',{'catpusher.uat.cp72ending.v1':'hang'}],['savedShort',{'catpusher.uat.cp72ending.v1':'short'}],['junk',{'catpusher.uat.cp72ending.v1':'zzz'}]]){
   const g=(await midRound(src,{seed:1,secs:1,store})).g;r[tag]=J(g,"({pick:CP72E.get(),style:Z72.leapHang.style,faceHang:+Z72.leapHang.faceHang.toFixed(3)})");
   if(tag==='fresh'){g.run("CP72E.set('hang')");r.afterSet=J(g,"({pick:CP72E.get(),style:Z72.leapHang.style,saved:localStorage.getItem('catpusher.uat.cp72ending.v1')})");g.run("CP72E.set('nope')");r.afterBad=J(g,"CP72E.get()");}g.close();}
  notes.choice=r;check('4 "Zoomies ending": default Short close-up (style crazy, hang 0.85 s); a saved Hang starts as UAT 96\'s hang (still); junk falls back to Short; choosing saves it on the phone',
   r.fresh.pick==='short'&&r.fresh.style==='crazy'&&r.fresh.faceHang===.85&&r.savedHang.pick==='hang'&&r.savedHang.style==='still'&&r.savedShort.style==='crazy'&&r.junk.pick==='short'&&r.junk.style==='crazy'&&r.afterSet.style==='still'&&r.afterSet.saved==='hang'&&r.afterBad==='hang',r);}
 check('5 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);""")
rep("path.join(out,'checks98-on99.json')","path.join(out,'checks100.json')")
assert 'CP-79' not in s and 'uat99' not in s,[l for l in s.split('\n') if 'CP-79' in l or 'uat99' in l]
Path(__file__).parent.joinpath('checks100.cjs').write_text(s,encoding='utf-8');print('ok')
