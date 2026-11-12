function sampleStreamPointer(e){
 if(!holding||e.pointerId!==streamPointer)return;
 const events=typeof e.getCoalescedEvents==='function'?e.getCoalescedEvents():[];
 let latest=e;for(const event of events)if(event.timeStamp>=latest.timeStamp)latest=event;
 const stamp=Number.isFinite(latest.timeStamp)?latest.timeStamp:performance.now();
 if(stamp<streamSampleTime)return;streamSampleTime=stamp;
 holdPos=aimFromScreen(toGame(latest).x);aim=holdPos;aimShow=1;
}
