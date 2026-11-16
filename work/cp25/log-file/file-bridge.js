function diagnosticFileBridge(){return !!(window.Android&&typeof Android.getDiagnosticStatus==='function'&&typeof Android.savePerformanceLog==='function');}
function diagnosticFileStatus(){try{return diagnosticFileBridge()?JSON.parse(Android.getDiagnosticStatus()):{connected:false,state:'Install the UAT app update to send log files'};}catch(e){return {connected:false,state:'Log connection unavailable'};}}
function onDiagnosticStatus(status){
 const text=panel.querySelector('#diag-file-status');if(text)text.textContent=status.state||'';
 const link=panel.querySelector('#diag-link-file');if(link)link.textContent=status.connected?'Change connected log file':'Connect log file to OneDrive';
}
function diagSendFile(){
 if(!diagnosticFileBridge())return;
 diagFlush('send-file');const status=diagnosticFileStatus();
 if(!status.connected)Android.connectDiagnosticFile();else onDiagnosticStatus({...status,state:'Saving latest log to the connected file…'});
}
function diagShareFile(){if(diagnosticFileBridge()){diagFlush('share-file');Android.sharePerformanceLog();}}
let diagNativeSuspended=false;
function diagNativePause(paused){
 if(paused){stopDrops('background');diagFlush('native-pause');}else diagEvent('native-resume');
 diagNativeSuspended=!!paused;last=performance.now();acc=0;frameSamples.length=0;frameWindow=framePublish=0;perf.fps=perf.slow=perf.physics=perf.draw=0;
}
