// ---- UAT 138: the no-food Yawn goes for special coins and prizes (Jenny, Nov 20: "Yawn should remove special coins or prizes
// if at all possible. It's really not much of a loss if you lose 3 paw coins."; "if at all possible" = "if they're on the
// board") ----
// When the Yawn has no food to eat, its gutter push (CP-71) now targets a special coin or a prize whenever there is one anywhere on
// the open table, not only one near a side: the one nearest its side edge, pushed into that side's gutter with the same visible
// mitt push (driven by the physics over the side; nothing shrinks or vanishes), with up to three coins beside it. Plain paw coins
// only when no special coin or prize is on the board. Food (cheese, shrimp, tuna, biscuit, sardine, egg, milk) is never pushed:
// a Yawn with food in reach eats it as before. Tower blocks are never targets. The frozen pickup is untouched.
const CP138Y={stats:{prizes:0,special:0,plain:0}};
cp71GCoin=function(b){return !!b&&!b.dead&&!!b.rb&&b.kind!=='stack'&&b.kind!=='power'&&!(b.kind==='item'&&CP58_FOOD.includes(b.id));};
CP71G.wide=9999; // a special coin or prize counts wherever it is on the open table
{const __t138=cp58CoinTargets;cp58CoinTargets=function(){const r=__t138.apply(this,arguments);try{const a=r&&r[0];if(a){if(a.kind==='item')CP138Y.stats.prizes++;else if(!cp71GPlain(a))CP138Y.stats.special++;else CP138Y.stats.plain++;}}catch(e){}return r;};}
// ---- end UAT 138 Yawn ----
