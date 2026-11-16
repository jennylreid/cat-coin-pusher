const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('release.html'),render:false,seed:5});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
const snap=()=>JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),p.x/M,p.y/M,p.z/M]}))"));
for(const n of [1,5]){g.run(`PG.lv.sel=${n};PG.lv.passed=9;wildReset()`);const a=snap();g.run('wildReset()');const b=snap();
 let mx=0,kind=null;for(let i=0;i<Math.min(a.length,b.length);i++){const d=Math.hypot(a[i][1]-b[i][1],a[i][2]-b[i][2],a[i][3]-b[i][3]);if(d>mx){mx=d;kind=a[i][0]+' vs '+b[i][0];}}
 console.log(n,'counts',a.length,b.length,'maxdiff',mx.toFixed(4),kind);
 g.run(`PG.open.orange=1;pgSwitchBoard('orange');PG.lv.sel=${n};wildReset()`);const c=snap();let m2=0,k2=null;for(let i=0;i<Math.min(a.length,c.length);i++){const d=Math.hypot(a[i][1]-c[i][1],a[i][2]-c[i][2],a[i][3]-c[i][3]);if(d>m2){m2=d;k2=a[i][0]+' vs '+c[i][0];}}
 console.log(n,'orange counts',a.length,c.length,'maxdiff',m2.toFixed(3),k2);g.run("pgSwitchBoard('tuxedo')");}
})();
