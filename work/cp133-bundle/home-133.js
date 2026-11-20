// ---- UAT 133 items 1, 5, 7 (Jenny, Nov 20; tickets/NEXT-ROUND.md) ----
// 1. Goal boards: the top bar shows only the drops left. The round's coin count ("200 coins") is hidden there (it isn't spent:
//    goal boards never use the wallet), and the drops pill is the wider one the endless board uses, so its pause bars no longer
//    cut off "drops". (Edits in build: the CP-92 HUD rules now ask hudWide133().)
function hudWide133(){try{return !!((typeof endActive==='function'&&endActive())||(typeof LAB==='object'&&LAB.on&&LAB.on()&&WILD.on));}catch(e){return false;}}
// 5. The two small top-right Home icons are gone, with their tap areas (the round SHOP and COLLECTIONS buttons replace them).
//    MODES (Developer) and the gear stay where they are.
{const __d133=pgDock;pgDock=function(){const D=__d133.apply(this,arguments);try{if(PG&&!PG_HOME_OFF){const off={x:-9999,y:-9999,w:0,h:0};D.coll=off;D.inv=off;}}catch(e){}return D;};}
// 7. "Endless" is internal naming: players never see it. The board's banner shows just the board's name; the Home card keeps
//    the cat's name and only the coin refill line ("+1 coin in 0:23", or "Coins full"); the top bar already shows the count.
//    Developer may keep the word. (Edits in build.)
// ---- end UAT 133 items 1, 5, 7 ----
