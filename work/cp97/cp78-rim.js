// CP-78 Board clean-up (drawing only; board shape, size, camera, colliders unchanged).
// 1. The board clip (__cachedBoardPath) cuts the table art through its wooden rails, so orange-brown slivers of rail showed
//    at the rear corners and along the sides. Once, on the warped table canvas (ART.table), wood-coloured pixels are
//    repainted in the side wall's dark teal (shading kept), so only the teal wall and felt show inside the board.
// 2. A solid dark-teal rim is stroked along the same outline (sides up from the front edge, across the back), half over
//    the art's cut edge and half outside it, so the board's edge is one clean, solid lip against the starfield.
let __cp78RimPath=null,__cp78TableDone=false;
function cp78CleanTable(){__cp78TableDone=true;const c=ART.table;if(!c||!c.getContext)return;
 try{const g=c.getContext('2d'),im=g.getImageData(0,0,c.width,c.height),d=im.data;
  for(let i=0;i<d.length;i+=4){const r=d[i],gr=d[i+1],b=d[i+2];if(d[i+3]<8)continue;
   if(r>50&&r>b+18){const l=(r*.3+gr*.5+b*.2)/255,k=.55+.6*l;d[i]=Math.min(255,9*k);d[i+1]=Math.min(255,58*k);d[i+2]=Math.min(255,53*k);}}
  g.putImageData(im,0,0);}catch(e){}}
function cp78RimPath(){if(__cp78RimPath)return __cp78RimPath;const p=new Path2D(),F=__felt,last=F[F.length-1];
 p.moveTo(last[1]+1,__NF+3);for(let i=F.length-1;i>=0;i-=58)p.lineTo(F[i][1]+1,F[i][0]);p.lineTo(F[0][1]+1,F[0][0]);
 p.lineTo(F[0][2]-1,F[0][0]);for(let i=0;i<F.length;i+=58)p.lineTo(F[i][2]-1,F[i][0]);p.lineTo(last[2]-1,last[0]);p.lineTo(last[2]-1,__NF+3);
 return __cp78RimPath=p;}
function cp78Rim(){const p=cp78RimPath();ctx.save();ctx.lineJoin='round';ctx.lineCap='butt';
 ctx.strokeStyle='#0a2d29';ctx.lineWidth=3.2;ctx.stroke(p);ctx.restore();}
// Repaint the table once while the title is up (not on the first frame of a round), as soon as the art is loaded.
(function cp78Early(){try{if(typeof ART!=='undefined'&&ART.table&&ART.table.getContext){if(!__cp78TableDone)cp78CleanTable();return;}}catch(e){}setTimeout(cp78Early,250);})();
