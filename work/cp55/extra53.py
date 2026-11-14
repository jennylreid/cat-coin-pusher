# UAT 53 additions (exec'd by patch53.py after UAT 52's extra52.py, same rep()).
# 1. Pickups: the frozen default (Pop) stays as it is; only the Quake coin moves onto it (pickup53.js, after Jenny's OK).
# 2. No "Wild" in what a player sees (Jenny, Nov 14: "get rid of the name wild too"). The Tuxedo's board is called "Tuxedo"
# for now (PM, Nov 14; the final name waits on Jenny: goal card title and board readout TUXEDO); the others keep their mode names. The old boards
# (WILD!, WILD 2 button, Wild board) are reached only from MODES, which shows only with Developer on.
rep("tuxedo:{name:'Tuxedo',mode:null,board:'Wild 2',", "tuxedo:{name:'Tuxedo',mode:null,board:'Tuxedo',")
s += '''
const __pgModeName=wildModeName;wildModeName=function(){return PG&&!PG_HOME_OFF&&!wildMode()?'TUXEDO':__pgModeName();};
'''
rep("mb('wild2','Wild 2 (Tuxedo)')", "mb('wild2','Tuxedo')")
# 3. Dance break: the cat dances on the tap beat (Jenny, Nov 14: "Can the cat dance to the beat, the same beat that you need
# to tap?"). Each move lands on every beat of the judge's clock (D.p0 + k*D.beat, the instant the beat sound is heard and the
# ring pulses): paws slam down and the body bobs to its lowest point on the beat, alternating sides beat by beat; move 0's
# eyes reach each side on the beat. The learned tap offset stays on the taps (it is the player's touch delay), so tapping
# when the cat lands is judged on the beat. The count-in intro and the finale are unchanged.
s += '''
function danceBeatX(){const D=WILD.on&&WILD.dance;if(!D||!pawDance||!pawDance.dbreak||D.phase==='finale')return null;const x=(danceNow()-D.p0)/D.beat;return x>=0&&x<D.n?x:null;}
function danceBeatShape(x){const D=WILD.dance,k=Math.floor(x),ph=x-k;return {k,s:k%2?-1:1,lift:Math.sin(Math.PI*ph),e:Math.max(0,Math.min(1,(D.n-x)/.5,(x+.25)/.25))};}
const __dbMotion=pawMotion;
pawMotion=function(side=0){const x=danceBeatX();if(x==null)return __dbMotion(side);const m=WILD.dance.move,{k,s,lift,e}=danceBeatShape(x);
 if(m===0)return {x:0,y:0,r:0};
 if(m===1){if(!side)return {x:12*e*s*lift,y:-15*e*lift,r:.075*e*s*lift};const mine=(side>0)===(k%2===0);return {x:-side*12*e,y:-(mine?58:10)*e*lift,r:(mine?.38:.1)*e*side*lift};}
 if(m===2)return side?{x:22*e*s*lift,y:-24*e*lift*(side>0===(k%2===0)?1.6:.6),r:.32*e*s*lift}:{x:24*e*s*lift,y:-19*e*lift,r:.12*e*s*lift};
 return side?{x:-side*20*e,y:-68*e*lift,r:side*.32*e*lift}:{x:10*e*s*lift,y:-30*e*lift,r:.07*e*s*lift};};
const __dbGaze=pawGaze;
pawGaze=function(){const x=danceBeatX();if(x==null||WILD.dance.move!==0)return __dbGaze();const {e}=danceBeatShape(x),c=Math.cos(Math.PI*x);return {x:1.7*e*c,y:-.3*e*Math.abs(c)};};
'''
