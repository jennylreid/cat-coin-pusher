 // 2b. E and F: the first pose held until 3.0 s, the travel between 3.0 s and the eyes opening, the second pose exactly when the
 // eyes open (the first frame cp86Open() is 1) and after; the travel is continuous (largest target step per frame reported)
 {const rows=[];let ok=true;for(const pick of ['E','F'])for(const fps of [60,30]){const {g,tk}=await midRound(src,{cat:'siamese',seed:8,fps,pick});g.run(TAP);
   const P=J(g,'CP86M.POSE'),a=P[pick].seq[0],z=P[pick].seq[1],r={pick,fps,swap:J(g,'CP86M.swap'),openAt:+g.run('CP86.openAt'),before:0,openFrame:null,after:0,maxStep:0};let prev=null;
   // the target the pose k alone would give (the same code path, with this pick's entry swapped for pose k for one call)
   const tg=k=>J(g,`(()=>{const s=CP86M.POSE,keep=s['${pick}'];s['${pick}']=s['${k}'];const v=[cp86MTarget(-1),cp86MTarget(1)];s['${pick}']=keep;return v;})()`);
   for(let i=0;i<9*fps;i++){tk();if(!g.run("!!PGPX&&PGPX.id==='sonic'")){if(r.openFrame!==null)break;continue;}const t=+g.run('PGPX.t'),T=J(g,'[cp86MTarget(-1),cp86MTarget(1)]'),open=+g.run('cp86Open()');
    const A=tg(a),Z=tg(z),dA=Math.max(...T.map((p,k)=>dist(p,A[k])+60*Math.abs(p.a-A[k].a))),dZ=Math.max(...T.map((p,k)=>dist(p,Z[k])+60*Math.abs(p.a-Z[k].a)));
    if(t<3)r.before=Math.max(r.before,dA);if(open){if(r.openFrame===null)r.openFrame={t:+t.toFixed(3),off:+dZ.toFixed(6)};r.after=Math.max(r.after,dZ);}
    if(prev)r.maxStep=Math.max(r.maxStep,...T.map((p,k)=>dist(p,prev[k])));prev=T;}
   r.errs=J(g,'__errs').length;g.close();r.ok=r.swap[1]===r.openAt&&r.before<1e-9&&!!r.openFrame&&r.openFrame.off<1e-6&&r.after<1e-6&&r.maxStep<400/fps*1.2&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.EF=rows;check('2b E and F: the first pose until 3.0 s, then travel, reaching the second pose exactly as the eyes open (3.75 s) and holding it; no jump in the travel',ok,rows);}
