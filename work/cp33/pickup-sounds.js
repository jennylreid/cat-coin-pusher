    // CP-33 UAT 34: Jenny's pick from the sound audition (ledge-3-bell, landing-thump), generated here like the other
    // sounds. 'bell' plays as a prize drops over the ledge, 'thump' as it lands in the bag. vol is the Pickup volume
    // (1 = 100%) times the burst level; delay (s) spaces bells that drop together. Sound off or background = silent.
    pickup(kind,vol,delay=0){
      if(inBackground||document.hidden||!(vol>0)||!ready())return;
      const t=ac.currentTime+delay,v=vol;
      if(kind==='bell'){ // one big bright struck bell with a click and an octave shimmer
        noise(t,.02,.25*v,6000,.7);bell(t,1567.98,.36*v,1.5);bell(t,3135.96,.09*v,.8);tone(783.99,t,.8,'triangle',.12*v);
      }else{ // soft landing: a short low thud with a little felt texture
        tone(120,t,.15,'sine',.32*v,55);noise(t,.04,.07*v,420,.8);
      }
    },
