// CP-69: drawing only. CP63 eye origin, timing, mitt path and sweep remain unchanged.
cp63Monocle=function(){const X=CP63X,t=X.t;
 const k=Math.min(1,t/CP63.monoIn),drop=t<CP63.monoIn?(1-k)*-70+Math.sin(k*Math.PI)*-8:0,bounce=t>=CP63.monoIn&&t<CP63.monoIn+.25?Math.sin((t-CP63.monoIn)/.25*Math.PI)*3:0;
 const out=t>CP63.monoOut?(t-CP63.monoOut)/(CP63.end-CP63.monoOut):0;
 const sx=420/(ART.head.pgW||ART.head.width),sy=240/(ART.head.pgH||ART.head.height),cx=-10+500*sx,cy=-25+515*sy+drop+bounce+out*out*90;
 try{const m=ctx.getTransform(),q=m.transformPoint({x:cx,y:cy}),z=scale*renderPixelRatio;X.eye={x:q.x/z,y:q.y/z};}catch(e){}
 ctx.save();
 ctx.drawImage(WILD_ART['cp69-hat'],-10,-25,420,240);
 // Entire tie canvas shifted down 26 head-space units, clear of the tongue.
 ctx.drawImage(WILD_ART['cp69-bowtie'],-10,1,420,240);
 if(out<1){ctx.globalAlpha=Math.min(1,t/.12)*(1-out);ctx.translate(cx,cy);ctx.rotate(out*1.4);ctx.drawImage(WILD_ART['cp69-monocle'],-10-cx,-25-cy+drop+bounce+out*out*90,420,240);}
 ctx.restore();
};
cp63DrawCane=function(t){const a=cp63CaneVis(t);if(a<=0)return;
 const z=Math.min(cp63CaneZ(t),T.FRONT+30),sp=cp63CaneSpan(z),slide=cp63E((t-CP63.caneIn)/.35),xl=sp.xr-(sp.xr-sp.xl)*slide,A=skyScreen(xl,z,14),B=skyScreen(sp.xr,z,14);
 ctx.save();ctx.globalAlpha=a;
 // Crook rises beyond the unchanged right mitt; shaft follows the original sweep span.
 ctx.translate(A.x-5*B.s,A.y);ctx.rotate(-.4);
 ctx.drawImage(WILD_ART['cp69-cane'],262,330,922,185,0,-28*B.s,B.x-A.x+20*B.s,60*B.s);
 ctx.restore();
};
