"""One-off: updates checks86m-body.js for the final return (hold until 4.65 s, down under the cheeks by 4.8 s, tuck behind
the head into rest by 4.9 s), and adds check 7 (opacity on every meow frame) and check 8 (the layer change is invisible)."""
from pathlib import Path
p=Path(__file__).parent
b=(p/'checks86m-body.js').read_text(encoding='utf-8')
R=[("4 marked CP-86 mitts final edits (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===5&&E.edits.slice(1).every(e=>/CP-86 mitts final/.test(e[1]))&&!E.appendedBeforeLastScriptClose.length);",
    "4 marked CP-86 mitts final edits + cp86-final.js (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===5&&E.edits.slice(1).every(e=>/CP-86 mitts final/.test(e[1]))&&E.appendedBeforeLastScriptClose.join()==='cp86-final.js');"),
   ("if(t>=3.8&&t<4.69){","if(t>=3.8&&t<4.64){"),
   ("if(t>=4.65&&t<4.9)ret.push({t,pa,rest});","if(t>=4.62&&t<4.9)ret.push({t,pa,rest,top:A.g.run('cp86MOnTop()')});"),
   # the path: down to under the cheeks, then up into rest; steps measured against its whole length
   ("   const startD=ret.length?Math.max(...ret[0].pa.map((p,k)=>dist(p,ret[0].rest[k]))):0;let maxStep=0,moving=0;",
    "   const startD=ret.length?Math.max(...ret[0].pa.map((p,k)=>dist(p,ret[0].rest[k])))+2*95:0;let maxStep=0,moving=0;const topBefore=ret.filter(x=>x.t<4.8).every(x=>x.top),topAfter=ret.filter(x=>x.t>=4.8).every(x=>!x.top);"),
   ("returnFrames:ret.length,moving,","returnFrames:ret.length,moving,topBefore,topAfter,"),
   ("row.ok=same&&face&&row.early===0&&row.hold<=5.5&&row.holdA<=.08&&ret.length>=(fps===60?14:7)&&moving>=(fps===60?11:5)&&row.maxStepShare<=.35",
    "row.ok=same&&face&&row.early===0&&row.hold<=5.5&&row.holdA<=.08&&ret.length>=(fps===60?14:7)&&moving>=(fps===60?13:6)&&row.maxStepShare<=.35&&topBefore&&topAfter"),
   ("check('1 vs UAT 115 E (60/30 fps x 2 seeds): play identical every frame; face and eyes on the same frames; mitts as UAT 115 E until 4.3 s, held above the head until 4.7 s, then a quick 0.2 s return reaching rest by the face switch (4.9 s): moving every frame, no frame over 35% of the way; at rest outside the meow'",
    "check('1 vs UAT 115 E (60/30 fps x 2 seeds): play identical every frame; face and eyes on the same frames; mitts as UAT 115 E until 4.3 s, held above the head until 4.65 s, then quickly down in front of the face to under the cheeks (by 4.8 s, in front of the head) and up into rest behind the head by the face switch (4.9 s): moving every frame, no frame over 35% of the path; at rest outside the meow'"),
]
for a,c in R:
    assert b.count(a)==1,a[:80];b=b.replace(a,c)
a=" check('6 production untouched',sha(prodJ)===prod0);"
assert b.count(a)==1
b=b.replace(a,r''' // 7. the mitts are fully opaque on every frame of the meow: every mitt drawing (drawRestMitt) during it is at globalAlpha 1,
 // normal blending, no filter, the same size, two mitts every frame (render harness, 60 fps, 412x915 and 360x640)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});
   g.run("globalThis.__al=[];{const f=drawRestMitt;drawRestMitt=function(){if(PGPX&&PGPX.id==='sonic'){const m=ctx.getTransform();__al.push([PGPX.t,ctx.globalAlpha,ctx.globalCompositeOperation,ctx.filter||'none',Math.hypot(m.a,m.b),arguments[0],arguments[1]===undefined?1:arguments[1]]);}return f.apply(this,arguments);};}");
   g.run(TAP);let frames=0;for(let i=0;i<8*60;i++){tk();if(g.run("!!PGPX&&PGPX.id==='sonic'")){g.c.draw();frames++;}else if(frames)break;}
   const al=J(g,'__al'),per={};for(const x of al)per[x[0]]=(per[x[0]]||0)+1;const sizes=[...new Set(al.map(x=>x[4].toFixed(4)+'/'+x[5]))];
   const r={sz:w+'x'+h,frames,draws:al.length,notOpaque:al.filter(x=>x[1]!==1||x[2]!=='source-over'||!['none',''].includes(x[3])||x[6]!==1).length,framesWithout2:Object.values(per).filter(n=>n!==2).length,sizes,errs:J(g,'__errs').length};g.close();
   r.ok=frames>250&&r.draws===2*frames&&r.notOpaque===0&&r.framesWithout2===0&&sizes.length===1&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.opacity=rows;check('7 the mitts are fully opaque on every frame of the meow (alpha 1, normal blending, no filter, same art and size, both drawn every frame)',ok,rows);}
 // 8. the layer change (in front of the head -> behind it, on the first frame at 4.8 s) is invisible: that frame drawn with the
 // mitts in front and behind is the same picture (random sparkles seeded alike for both draws; at 360x640 the harness's
 // own frame-to-frame difference, measured by drawing the same mode twice, is the allowance)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});g.run(TAP);
   for(let i=0;i<9*60;i++){tk();if(+g.run("PGPX&&PGPX.id==='sonic'?PGPX.t:0")>=CP86F_UNDER)break;}
   const t=+g.run('PGPX.t'),grab=()=>{g.run("globalThis.__r=7;Math.random=()=>{__r=(__r*16807)%2147483647;return __r/2147483647;}");g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const real=g.run('cp86MOnTop()');g.run("globalThis.__ot=cp86MOnTop;cp86MOnTop=function(){return true;}");const a=grab(),a2=grab();g.run("cp86MOnTop=function(){return false;}");const b2=grab();g.run("cp86MOnTop=__ot");
   const cnt=(x,y)=>{let n=0;for(let p=0;p<x.length;p+=4)if(x[p]!==y[p]||x[p+1]!==y[p+1]||x[p+2]!==y[p+2])n++;return n;};
   const r={sz:w+'x'+h,t:+t.toFixed(3),onTopThatFrame:real,frontVsBehind:cnt(a,b2),sameModeTwice:cnt(a,a2)};g.close();
   r.ok=r.onTopThatFrame===false&&r.frontVsBehind<=r.sameModeTwice+20;if(!r.ok)ok=false;rows.push(r);}
  notes.layer=rows;check('8 the layer change happens with the mitts under the cheeks, where in front of and behind the head look the same',ok,rows);}
'''.replace('CP86F_UNDER',"+g.run('CP86F.under')")+a,1)
(p/'checks86m-body.js').write_text(b,encoding='utf-8')
print('ok')
