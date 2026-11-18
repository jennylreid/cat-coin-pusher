// ---------- CP-73 follow-up (UAT 93; Jenny, Nov 18: "CP-73 Formal inspection: cane shaft goes behind the mitt, crook
// showing above it, so the mitt looks like it's holding it.") ----------
// Drawing only: the same cane art at the same size, the same tip on the board (same sweep line and slide-in), now aimed at
// the right mitt. The collar sits inside the mitt, so the shaft runs behind it and the crook shows just above it. The cane
// is drawn with the board, before the mitts, so the mitt covers the shaft. The mitt's path, the sweep, picks and timing are
// unchanged. When the mitt lets go after the sweep, the cane stays where the mitt left it and fades as before.
const CP73C={gx:-12,gy:-42,collar:830}; // grip point from the mitt's centre (screen units); source pixel of the collar
function cp73Grip(t){const M=cp63Mitt(1,Math.min(t,CP63.sweep1+.08));return {x:M.x+CP73C.gx,y:M.y+CP73C.gy};}
cp63DrawCane=function(t){const a=cp63CaneVis(t);if(a<=0)return;
 const z=Math.min(cp63CaneZ(t),T.FRONT+30),sp=cp63CaneSpan(z),slide=cp63E((t-CP63.caneIn)/.35),xl=sp.xr-(sp.xr-sp.xl)*slide,A=skyScreen(xl,z,14),B=skyScreen(sp.xr,z,14);
 const L=B.x-A.x+20*B.s,H=60*B.s,G=cp73Grip(t); // UAT 92's length and thickness
 ctx.save();ctx.globalAlpha=a;ctx.translate(G.x,G.y);ctx.rotate(Math.atan2(G.y-A.y,G.x-A.x));
 ctx.drawImage(WILD_ART['cp69-cane'],262,330,922,185,-L*CP73C.collar/922,-H*127/185,L,H);
 ctx.restore();};
// ---------- end CP-73 follow-up ----------
