// ---------- CP-72 rework of the poof (UAT 96; Jenny, Nov 18: "the puffed kitten hangs about 1 s at the top of its final
// leap, about 1.5x bigger during the hang"; before: "I wanted to hold a second longer so I can actually see it. Or maybe it
// should be bigger... I can't see it very well.") ----------
// Only the ginger kitten's final leap: it rises as before, hangs puffed at the top for 1 s (a small hover), growing to 1.5x
// its size there, then finishes the leap as before, shrinking back. It stays fully visible until the hang ends (before, it
// was already fading on the way up) and fades over the rest of the leap. Path, moves and the cream kitten unchanged. The
// double-speed pusher still stops at 7 s of Zoomies (the hang can end after it; the power ends when the kitten has gone).
Z72.leapHang={top:.625,hang:1,big:1.5,edge:90}; // top: the part of the old leap at its highest point; hang (s); size during the hang;
// edge: while it is big, a kitten leaping near a side eases in to within this distance of the middle (table units), so it stays
// on the screen; it eases back as it shrinks and lands where it did before
// The power waits for both kittens to finish (as CP-72 meant, up to 2 s past its 7 s): the game's general power clock
// ended it at exactly 7 s, which would cut the ginger kitten off in mid-hang when its leap ends after that. The pusher's
// double speed still stops at 7 s of Zoomies; only the power (and its locked button) runs on until the kitten has gone.
const __cp72hTick=pgpTick;pgpTick=function(dt){const X=PGPX;
 if(X&&X.id==='zoomies72'&&Z72X&&X.t+dt>=X.dur&&X.t+dt<Z72T.lead+Z72.dur+2&&!Z72X.kits.every(k=>k.gone))X.dur=X.t+dt+1e-4;
 return __cp72hTick(dt);};
// ---------- end CP-72 rework ----------
