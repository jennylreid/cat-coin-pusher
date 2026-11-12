    // CP-42 Laser chase sounds, built with the same safe helpers as Wild 2 (_mt, _mn always connect to a real node).
    // vol is scaled by the Pickup volume dial; sound off or background = silent. arg: hit count, knocked-off count.
    laser(kind,vol=1,arg=0){
      // per-sound trim so the small ones (dot, wiggle, whoosh, miss) carry over the music on a phone speaker (levels.json)
      const K={start:2.5,dot:3,wind:2.5,pounce:2.5,prize:2,miss:2.5,over:2,end:1.6,none:2}[kind]||1;
      const v=vol*K*(typeof pickupFx==='object'?pickupFx.volume:1);if(!(v>0)||!this._w2ok())return;const t=ac.currentTime;
      if(kind==='start'){ // a laser "zip" up, a bright buzz, then a cat's chirp ("mrrp?")
        this._mt(220,t,.22,'sawtooth',.05*v,master,2400);this._mt(1760,t+.2,.16,'square',.025*v,master,1700);this._mn(t,.2,.05*v,3200,2);
        this._mt(520,t+.38,.09,'triangle',.11*v,master,760);this._mt(700,t+.48,.16,'triangle',.1*v,master,980);bell(t+.62,1567.98,.05*v,.7);}
      else if(kind==='dot'){ // the dot jumps to the finger: a tiny bright "tik"
        this._mt(2600,t,.035,'square',.025*v,master,3400);this._mn(t,.03,.03*v,6000,2);}
      else if(kind==='wind'){ // the butt wiggle before a pounce: three soft rustles, rising
        for(let i=0;i<3;i++)this._mn(t+i*.055,.05,.045*v*(1+i*.25),900+i*450,1.6);this._mt(330,t,.16,'triangle',.03*v,master,500);}
      else if(kind==='pounce'){ // the leap: a quick whoosh
        this._mn(t,.12,.09*v,1600,.9,master,.05);this._mt(900,t,.1,'sine',.03*v,master,300);}
      else if(kind==='thump'){ // the paw lands: a soft low thump, then coins scatter (more coins, more clinks)
        const n=Math.max(0,Math.min(9,arg|0));this._mt(130,t,.2,'sine',.5*v,master,48);this._mn(t,.07,.24*v,700,1.1);this._mt(260,t,.06,'triangle',.08*v,master,120);
        for(let i=0;i<n;i++){const f=2400+Math.random()*2200;bell(t+.03+i*.028+Math.random()*.02,f,.035*v,.22);this._mn(t+.03+i*.028,.025,.05*v,5200,3);}}
      else if(kind==='prize'){ // a prize got swatted: a fat bonk and a bright rising "ding-ding"
        this._mt(260,t,.16,'square',.07*v,master,520);[1046.5,1318.5,1760].forEach((f,i)=>bell(t+.05+i*.07,f,.07*v,.6));}
      else if(kind==='miss'){ // the paw comes down on nothing: a soft whiff
        this._mn(t,.22,.07*v,600,.7,master,.06);this._mt(300,t,.16,'sine',.03*v,master,180);}
      else if(kind==='over'){ // something knocked off goes over the front: a ding that climbs with the count
        const k=Math.max(0,Math.min(14,(arg|0)-1)),f=880*Math.pow(2,k/12);this._mt(f,t,.12,'triangle',.07*v);this._mt(f*2,t+.02,.08,'sine',.03*v);}
      else if(kind==='end'){const n=Math.max(1,Math.min(8,arg|0));for(let i=0;i<n;i++)this._mt(587.33*Math.pow(2,i/12*2),t+i*.06,.18,'triangle',.07*v);
        [1174.66,1479.98,1760].forEach((f,i)=>bell(t+n*.06+i*.08,f,.06*v,.9));}
      else if(kind==='none'){this._mt(392,t,.18,'triangle',.06*v,master,330);this._mt(311.13,t+.2,.3,'triangle',.06*v,master,262);}
    },
