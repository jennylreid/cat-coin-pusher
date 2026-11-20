
// ---------- CP-99 (Jenny, Nov 19): the Treat toss meter out of the way, beneath the board ----------
// The meter bar (treats caught, treats left, streak) goes in the gap under the table's front edge and above the bottom corner
// text (hudLayout().bottomY), scaled down evenly to fit (the bar is 40 tall). Where that gap is under 30 (short screens such
// as 360x640, where the table reaches the bottom), it sits just under the top bar instead, above the highest treat (about
// y 197). Same bar, same contents; nothing else moves.
function cp99Gap(){const top=skyScreen(200,T.FRONT,0).y+2,bot=hudLayout().bottomY-2;return {top,room:bot-top};}
function cp99Beneath(){return cp99Gap().room>=30;}
function cp99MeterY(){const g=cp99Gap();return g.room>=30?g.top+g.room/2:hudLayout().headerBottom+42;}
function cp99MeterK(){const g=cp99Gap();return g.room>=30?Math.min(1,g.room/40):1;}
// ---------- end CP-99 ----------
