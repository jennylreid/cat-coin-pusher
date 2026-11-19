
// ---------- CP-80 (Nov 18): the Developer wheel on the Siamese (Laser chase) board ----------
// "Wheel lands on ..." and "spin the wheel now" fake a perfect Dance break (danceStart, then the wheel). The laser board has
// no Dance break on purpose, so its danceStart refused and w2StartWheelNow threw at GO: no wheel. While the Developer-forced
// start builds its finale (W2_DEV_WHEEL), the laser guard lets it through (edit in build.py); a running Laser chase still
// waits, as Treat toss and Pet do. w2StartWheelNow is reached only from those Developer buttons: normal play is unchanged.
var W2_DEV_WHEEL=false;
{const __cp80Wheel=w2StartWheelNow;w2StartWheelNow=function(){if(WILD.chase){WILD.wheelForce=true;return;}W2_DEV_WHEEL=true;try{return __cp80Wheel.apply(this,arguments);}finally{W2_DEV_WHEEL=false;}};}
