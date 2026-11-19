 // 7. (hotfix) bank a coin, then go Home, open another cat's board and start its round, then a new round on that board:
 // drawn every frame (the slot is drawn; a negative radius throws, as in a browser), each countdown reaches play with no frame errors
 {const rows=[];let ok=true;for(const [cat,next] of [['siamese','orange'],['orange','tortie'],['tortie','siamese']]){const {kind}=CATS[cat],r={cat,next};
   const {g,tk}=await midRound(src,{cat,render:true,secs:2,w:412,h:915,pr:1});
   // the harness's canvas accepts a negative radius; real browsers throw (IndexSizeError), which is what froze the phone: same here
   const dr=()=>{try{g.c.draw();}catch(e){if(!r.drawErr)r.drawErr=String(e).slice(0,120);}};
   g.run("{const P=Object.getPrototypeOf(ctx);for(const k of ['arc','ellipse']){const o=P[k];P[k]=function(...a){const r=k==='arc'?[a[2]]:[a[2],a[3]];if(r.some(v=>v<0))throw new Error('IndexSizeError: negative radius in '+k);return o.apply(this,a);};}}");g.run(COIN(kind));for(let i=0;i<20;i++){tk();dr();}
   g.run("(()=>{const b=wildButton();(typeof __cp51Pointer==='function'?__cp51Pointer:wildPointer)({timeStamp:0,pointerId:-1,preventDefault(){}},{x:b.x+b.w/2,y:b.y+b.h/2});})()");for(let i=0;i<60;i++){tk();dr();}
   g.run(`pgPlay('${next}');if(WILD.phase==='card')wildStartCountdown();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.nextPlay=g.run("WILD.phase")==='play';
   g.run('wildReset();wildStartCountdown();');k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.newRoundPlay=g.run("WILD.phase")==='play';
   r.errs=J(g,'__errs').map(e=>e.slice(0,120));g.close();r.ok=r.nextPlay&&r.newRoundPlay&&!r.errs.length&&!r.drawErr;if(!r.ok)ok=false;rows.push(r);}
  check('7 (hotfix) after banking a coin: Home, another board of another cat, and a new round all reach play, drawn every frame, with no frame errors',ok,rows);}
