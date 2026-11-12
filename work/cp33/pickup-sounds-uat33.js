    // CP-33 UAT 33: three brighter, fuller pickup sounds to pick from (Developer → Pickup sound), generated here like the
    // other sounds (no audio files). 'full' plays as a prize reaches full size, 'land' as it lands in the bag (a low thump
    // for punch, then a bright hit). vol is the Pickup volume (1 = 100%); 0 or the game's sound setting off = silent.
    pickup(kind,variant,vol){
      if(inBackground||document.hidden||!(vol>0)||!ready())return;
      const t=ac.currentTime,v=vol;
      if(variant===2){ // Pop chord: a quick rising pop, a bright major chord, a sparkle run; landing is a kick and a chord stab.
        if(kind==='full'){
          tone(320,t,.07,'sine',.22*v,1100);
          [659.25,830.61,987.77,1318.51].forEach(f=>{tone(f,t+.03,.45,'triangle',.075*v);tone(f*2,t+.03,.16,'square',.012*v);});
          [1975.53,2637.02,3135.96].forEach((f,i)=>tone(f,t+.1+i*.045,.25,'sine',.035*v));
        }else{
          tone(150,t,.22,'sine',.5*v,45);noise(t,.05,.3*v,1400,.9);
          [987.77,1318.51].forEach(f=>tone(f,t+.01,.22,'triangle',.1*v));tone(1975.53,t+.05,.28,'sine',.05*v);
        }
      }else if(variant===3){ // Glass chime: a soft whoosh and shimmering doubled bells; landing is a thump and a bright clink.
        if(kind==='full'){
          noise(t,.22,.07*v,4500,.5);tone(523.25,t,.35,'triangle',.08*v);
          [1046.5,1318.51,1567.98,2093].forEach((f,i)=>{const a=t+i*.045;tone(f,a,.55,'sine',.07*v);tone(f*1.006,a,.5,'sine',.045*v);tone(f*3,a,.12,'sine',.015*v);});
        }else{
          tone(130,t,.2,'sine',.45*v,48);steelAt(t,.8*v,.8,false);bell(t+.03,2093,.065*v,.5);
        }
      }else{ // 1, Bright bells: a sparkle, a warm body and a rising bell arpeggio; landing is a thump, a snap and a bell.
        if(kind==='full'){
          noise(t,.05,.1*v,7000,.8);tone(659.25,t,.4,'triangle',.1*v);
          bell(t,1318.51,.075*v,.55);bell(t+.06,1661.22,.065*v,.55);bell(t+.12,1975.53,.065*v,.7);
          tone(2637.02,t+.18,.5,'sine',.045*v);tone(3951.07,t+.2,.35,'sine',.02*v);
        }else{
          tone(180,t,.18,'sine',.42*v,55);noise(t,.035,.28*v,2400,.9);
          bell(t+.015,1975.53,.075*v,.45);tone(2637.02,t+.06,.3,'sine',.05*v);
        }
      }
    },
