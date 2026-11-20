// ---- Nov 20 follow-up (PM, Nov 20, Jenny) ----
// b) The Ragdoll's Pet the cat meter (the purr strip with DONE) sits beneath the board, the same placement as the Treat toss meter
//    (UAT 130): centred in the room under the board when the strip fits there, otherwise just below the board's front edge.
//    Was a fixed y 468 under the chin. Its fill, timing and DONE behaviour are unchanged; DONE's tap area moves with it.
function petHudY(){try{const g=cp99Gap();if(g.room>=48)return g.top+g.room/2;const f=skyScreen(200,T.FRONT,0).y;return Math.min(f+2+22,H-6-22);}catch(e){return PET_HUD_Y;}}
// a) UAT 130's Pet the cat peak (2.5 s) is reverted to 3.5 s (the default again; a phone left on 2.5 goes back).
try{if(PET.peak===2.5){PET.peak=3.5;const d=JSON.parse(localStorage.getItem(PET_KEY)||'null');if(d&&+d.peak===2.5)petSave();}}catch(e){}
// ---- end Nov 20 follow-up ----
