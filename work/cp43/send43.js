// ---------- UAT 43 (CP-39): "Send performance log" says what happened ----------
// The app writes the log on its own thread and reports back through onDiagnosticStatus (state text and savedAt). The
// button now shows "Sending…" while it waits, then "Log sent ✓ 3:54 PM" (green), or the app's error in red. A
// "Log sent ✓" toast shows in the game too. If the app doesn't answer in 8 s it says so and suggests Share log.
let diagSend=null; // {at: ms when tapped, timer}
function diagSendButton(text,color,disabled){const b=panel.querySelector&&panel.querySelector('#diag-send-file');if(!b)return;b.textContent=text;b.style.background=color||'';b.style.color=color?'#fff':'';b.disabled=!!disabled;}
function diagClock(ms){const d=new Date(ms);let h=d.getHours(),m=d.getMinutes();const ap=h<12?'AM':'PM';h=h%12||12;return h+':'+String(m).padStart(2,'0')+' '+ap;}
const __s43Status=onDiagnosticStatus;
onDiagnosticStatus=function(status){
 __s43Status(status);
 if(!diagSend||!status)return;const st=String(status.state||'');
 if(/could not|unavailable|cancel|not writable|no saved log/i.test(st)){clearTimeout(diagSend.timer);diagSend=null;diagSendButton('Log not sent ✗ (tap to try again)','#b3261e',false);
  const t=panel.querySelector&&panel.querySelector('#diag-file-status');if(t){t.textContent=st;t.style.color='#ff8a80';}try{diagEvent('send-file-failed',st.slice(0,80));}catch(e){}return;}
 if(status.savedAt&&status.savedAt>=diagSend.at-1000){clearTimeout(diagSend.timer);const when=diagClock(status.savedAt);diagSend=null;
  diagSendButton('Log sent ✓ '+when,'#2e7d32',false);const t=panel.querySelector&&panel.querySelector('#diag-file-status');if(t){t.textContent=st;t.style.color='#b9f6ca';}
  try{floats.push({text:'LOG SENT ✓',x:200,y:H*.4,t:0,big:true});}catch(e){}}
};
diagSendFile=function(){
 if(!diagnosticFileBridge()){diagSendButton('Log can’t be sent from this app version','#b3261e',false);return;}
 const status=diagnosticFileStatus();
 if(!status.connected){Android.connectDiagnosticFile();return;} // the app asks for the OneDrive file first
 if(diagSend)return; // already sending
 diagSend={at:Date.now(),timer:setTimeout(()=>{if(!diagSend)return;diagSend=null;diagSendButton('No answer from the app ✗ (try again, or Share log)','#b3261e',false);},8000)};
 diagSendButton('Sending…','#6a5a8a',true);diagFlush('send-file');
};
