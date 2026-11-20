
// ---------- UAT 134 item H: the Ragdoll's Dance break: grey shoulders on either side of the white chest (Jenny, Nov 20,
// UAT 133: both together). The CP-101 grey shoulders draw again during the Dance break, and UAT 133's white chest draws over
// them, so the grey shows on either side of the white. The Hug is unchanged (passed in UAT 133: white chest only).
// CP133C.mode='grey' still gives the grey shoulders alone; CP133C.mode='none' neither.
cp101BodyOn=function(){if(CP133C.mode==='none')return false;return __rchestOn.apply(this,arguments);};
// ---------- end UAT 134 item H ----------
