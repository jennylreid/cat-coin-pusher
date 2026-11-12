const {game}=require('./harness.cjs');
(async()=>{const [hop,push]=process.argv.slice(2).map(Number);let tot=0,totAll=0;const rows=[];for(const seed of [5,6])for(const z of [560,640,700]){const g=await game({seed});
 g.run('laserStartNow()');g.until('!!WILD.chase&&WILD.chase.phase==="play"',900);
 g.run(`LASER_HOP=${hop};LASER_PUSH=${push};WILD.chase.paw=0.01;`);
 g.run(`WILD.chase.tw={x:200+${(seed-5.5)*80},y:${z}};laserImpact(WILD.chase)`);g.ticks(100);
 g.run("window.__gut=0");const k=g.run("WILD.chase.knocked"),a=g.run('WILD.chase.knockedAll');tot+=k;totAll+=a;rows.push(z+':'+k+'/'+a+' hit'+g.run('WILD.chase.coinHits+WILD.chase.prizeHits'));g.close();}
 console.log(hop,push,'knocked',tot,'all',totAll,rows.join(' '));})();
