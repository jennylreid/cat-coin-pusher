// CP-80 proposed fix (not in any build yet). One edit + this block.
// Edit (laser board, 'Laser mode has no happy meter or dance break'):
//   danceStart=function(){if(WILD.laser||WILD.chase)return;return __laserDanceStart();};
// ->danceStart=function(){if((WILD.laser&&!W2_DEV_WHEEL)||WILD.chase)return;return __laserDanceStart();};
// Block: the Developer-forced wheel start alone may build its finale on the Siamese board; a running Laser chase still waits.
var W2_DEV_WHEEL=false;{const __f=w2StartWheelNow;w2StartWheelNow=function(){if(WILD.chase){WILD.wheelForce=true;return;}W2_DEV_WHEEL=true;try{return __f.apply(this,arguments);}finally{W2_DEV_WHEEL=false;}};}
