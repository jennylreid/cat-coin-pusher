from pathlib import Path
p=Path('work/cp25/log-file');java=p/'android/app/src/main/java/com/jenny/catpusher/uat'
for name in ['DiagnosticWriter.java','DiagnosticProvider.java','DiagnosticPolicy.java']:(java/name).write_text((p/name).read_text(encoding='utf-8'),encoding='utf-8')
s=(java/'MainActivity.java').read_text(encoding='utf-8');native=(p/'native-diagnostics.java').read_text(encoding='utf-8')
native=native.replace('private static final String LOG_MARKER = "catcoin-uat-diagnostic-sink-v1";','private static final String LOG_MARKER = DiagnosticPolicy.MARKER;').replace('private static final int MAX_LOG_BYTES = 131072;','private static final int MAX_LOG_BYTES = DiagnosticPolicy.MAX_BYTES;')
native=native.replace('!LOG_MARKER.equals(object.optString("sink"))||!"CatCoin UAT performance log v1".equals(object.optString("format"))','!DiagnosticPolicy.isSink(object.optString("sink"),object.optString("format"))')
native=native.replace('!"content".equals(uri.getScheme())||(flags&Intent.FLAG_GRANT_WRITE_URI_PERMISSION)==0','!DiagnosticPolicy.selectedFile(uri.getScheme(),(flags&Intent.FLAG_GRANT_WRITE_URI_PERMISSION)!=0)')
native=native.replace('!"CatCoin UAT performance log v1".equals(log.optString("format"))||log.optJSONObject("current")==null||log.optJSONArray("sampleColumns")==null','!DiagnosticPolicy.payload(log.optString("format"),log.optJSONObject("current")!=null,log.optJSONArray("sampleColumns")!=null,text.getBytes(StandardCharsets.UTF_8).length)')
native=native.replace('startActivity(Intent.createChooser(send,"Save log to OneDrive"));','startActivity(Intent.createChooser(send,"Save log to OneDrive"));\n                    }catch(Exception e){diagnosticState="Could not open sharing; reconnect the log file instead";sendDiagnosticStatus();')
s=s.replace('prefs = getSharedPreferences("catpusher", MODE_PRIVATE);','prefs = getSharedPreferences("catpusher", MODE_PRIVATE);\n        initDiagnostics();')
pos=s.index('    // ---------- "Check for updates"');s=s[:pos]+native+'\n'+s[pos:]
s=s.replace('if (request != PICK || result != RESULT_OK', 'if (request == PICK_DIAGNOSTIC) {\n            if(result==RESULT_OK&&data!=null&&data.getData()!=null)connectDiagnosticDocument(data.getData(),data.getFlags());\n            else {diagnosticState="Log-file connection cancelled";sendDiagnosticStatus();}\n            return;\n        }\n        if (request != PICK || result != RESULT_OK')
pos=s.index('        @android.webkit.JavascriptInterface public String getSafeArea()')
s=s[:pos]+'''        @android.webkit.JavascriptInterface public String getDiagnosticStatus(){return diagnosticStatus();}
        @android.webkit.JavascriptInterface public void connectDiagnosticFile(){runOnUiThread(MainActivity.this::pickDiagnosticDocument);}
        @android.webkit.JavascriptInterface public void savePerformanceLog(String text){receiveDiagnosticLog(text);}
        @android.webkit.JavascriptInterface public void sharePerformanceLog(){shareDiagnosticLog();}
'''+s[pos:]
s=s.replace('updateWorker.shutdownNow();','updateWorker.shutdownNow();\n        diagnosticWorker.shutdown();\n        diagnosticShareWorker.shutdown();')
(java/'MainActivity.java').write_text(s,encoding='utf-8')
f=p/'android/app/build.gradle';s=f.read_text(encoding='utf-8').replace('versionCode 4','versionCode 5').replace("versionName '2026.10.15 UAT 1'","versionName '2026.10.30 UAT APK5'");f.write_text(s,encoding='utf-8')
f=p/'android/app/src/main/AndroidManifest.xml';s=f.read_text(encoding='utf-8').replace('    </application>','''        <provider android:name=".DiagnosticProvider" android:authorities="com.jenny.catpusher.uat.diagnostics" android:exported="false" android:grantUriPermissions="true" />
    </application>''');f.write_text(s,encoding='utf-8')
print('Native APK5: bounded worker, selected diagnostic file, read-only share fallback; updater retained')
