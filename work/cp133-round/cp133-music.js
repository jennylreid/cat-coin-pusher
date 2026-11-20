
// ---------- Next round #2: the dance music picks (Jenny, Nov 20: Orange = B (Wild mambo), Ragdoll = A (Music box); "drop the
// other candidates from the game (and the A/B/C row/menus for those cats)") ----------
// The Orange always dances to B and the Ragdoll to A, whatever was saved before. The other candidates' tracks are taken out,
// the Engineer tools menus for them are hidden, and the Developer A/B/C row under the dance lane is gone (these two cats were
// the only ones with a choice). The Tuxedo's dance is unchanged.
CP94.CHOICES=['B'];CP94.get=function(){return 'B';};CP94.set=function(){};
CP101.CHOICES=['A'];CP101.get=function(){return 'A';};CP101.set=function(){};
for(const k of ['A','C'])delete CP94_TRACKS[k];
for(const k of ['B','C'])delete CP101_TRACKS[k];
cp102Music=function(){return null;}; // no A/B/C row
const __rmusCredits=openCredits;
openCredits=function(){const r=__rmusCredits.apply(this,arguments);try{for(const id of ['#cp94-music','#cp101-music']){const n=panel.querySelector&&panel.querySelector(id);if(n)n.style.display='none';}}catch(e){}return r;};
// ---------- end next round #2 ----------
