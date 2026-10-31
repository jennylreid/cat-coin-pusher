package com.jenny.catpusher.uat;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInstaller;
import android.graphics.Color;
import android.graphics.Rect;
import android.view.DisplayCutout;
import android.view.RoundedCorner;
import android.view.WindowManager;
import org.json.JSONArray;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Base64;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;

/**
 * Cat Pusher UAT test build: shows the game full screen.
 *
 * Updates download the same UAT OneDrive JSON directly over HTTPS on a worker thread.
 * Startup and Settings share one versioned-offer path; the document URI is retained.
 * The bundled or last installed game remains playable when offline.
 *
 * The game reads pixels from its own picture to cut it into layers, which Android only allows for file:// pages
 * when file access between them is on; the page only ever loads its own files. Progress is kept in the page's
 * localStorage, which all file:// pages share, so it carries over from the bundled game to updates.
 */
public class MainActivity extends Activity {
    private static final int PICK = 1;
    private static final String ACTION_INSTALLED = "com.jenny.catpusher.uat.INSTALL_STATUS";
    private WebView web;
    private volatile String safeAreaJson = "{}";
    private SharedPreferences prefs;
    private long shownVersion = -1;   // version of the game on screen; 0 = the copy bundled in the APK
    private byte[] pendingApk;        // waiting for permission to install updates from this app
    private boolean offering;         // an "app update" question is on screen
    private boolean offeringGame;
    private final java.util.concurrent.ExecutorService updateWorker = java.util.concurrent.Executors.newSingleThreadExecutor();
    private boolean checking;
    private boolean manualCheck;
    private boolean applying;
    private JSONObject readyUpdate;
    private boolean resultPending;
    private String readyError;
    private String cloudAddress() throws Exception {
        try (InputStream in = getAssets().open("update-url.txt")) {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096]; int count;
            while ((count = in.read(buffer)) != -1) out.write(buffer, 0, count);
            String address = new String(out.toByteArray(), StandardCharsets.UTF_8).trim();
            if (!address.startsWith("https://")) throw new IllegalStateException("Cloud updates are not configured");
            return address;
        }
    }
    private android.speech.tts.TextToSpeech tts;   // the phone's voice, for the game's spoken lines
    private volatile boolean ttsReady;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        prefs = getSharedPreferences("catpusher", MODE_PRIVATE);
        initDiagnostics();
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(28, 17, 41));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setAllowFileAccessFromFileURLs(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view, String url) {
                view.requestApplyInsets();
                sendSafeArea();
            }
        });
        web.addJavascriptInterface(new Bridge(), "Android");
        tts = new android.speech.tts.TextToSpeech(this, status -> {
            if (status != android.speech.tts.TextToSpeech.SUCCESS) return;
            // a deep announcer, like a pinball machine: a male English voice if the phone has one, pitched down
            try {
                android.speech.tts.Voice best = null;
                for (android.speech.tts.Voice v : tts.getVoices()) {
                    String n = v.getName().toLowerCase();
                    if (!v.getLocale().getLanguage().equals("en") || v.isNetworkConnectionRequired()) continue;
                    boolean male = n.contains("male") && !n.contains("female") || n.contains("-iom") || n.contains("-iol") || n.contains("-tpd");
                    if (male && (best == null || v.getLocale().getCountry().equals("US"))) best = v;
                }
                if (best != null) tts.setVoice(best);
            } catch (Exception e) { }
            tts.setPitch(0.6f);
            tts.setSpeechRate(0.9f);
            ttsReady = true;
        });
        if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams attributes = getWindow().getAttributes();
            attributes.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= 30
                ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
                : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(attributes);
        }
        web.setOnApplyWindowInsetsListener((view, insets) -> {
            updateSafeArea(insets);
            return insets; // Background remains edge to edge; do not pad the WebView.
        });
        web.addOnLayoutChangeListener((v,l,t,r,b,ol,ot,or,ob) -> {
            WindowInsets insets = web.getRootWindowInsets();
            if (insets != null) updateSafeArea(insets);
        });
        setContentView(web);
        web.requestApplyInsets();
        loadNewest();
        if (ACTION_INSTALLED.equals(getIntent().getAction())) handleInstallResult(getIntent());
    }

    private void updateSafeArea(WindowInsets insets) {
        if (web.getWidth() <= 0 || web.getHeight() <= 0) return;
        try {
            int[] location = new int[2]; web.getLocationInWindow(location);
            int width = web.getWidth(), height = web.getHeight();
            int left=0, top=0, right=0, bottom=0;
            JSONArray cutouts = new JSONArray(), corners = new JSONArray();
            if (Build.VERSION.SDK_INT >= 28) {
                DisplayCutout cutout = insets.getDisplayCutout();
                if (cutout != null) {
                    left=Math.max(0,cutout.getSafeInsetLeft()-location[0]);
                    top=Math.max(0,cutout.getSafeInsetTop()-location[1]);
                    right=Math.max(0,cutout.getSafeInsetRight());
                    bottom=Math.max(0,cutout.getSafeInsetBottom());
                    for (Rect rect : cutout.getBoundingRects()) {
                        cutouts.put(new JSONObject().put("left",rect.left-location[0]).put("top",rect.top-location[1])
                            .put("right",rect.right-location[0]).put("bottom",rect.bottom-location[1]));
                    }
                }
            }
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars=insets.getInsets(WindowInsets.Type.systemBars());
                left=Math.max(left,bars.left);top=Math.max(top,bars.top);
                right=Math.max(right,bars.right);bottom=Math.max(bottom,bars.bottom);
            } else {
                left=Math.max(left,insets.getSystemWindowInsetLeft());top=Math.max(top,insets.getSystemWindowInsetTop());
                right=Math.max(right,insets.getSystemWindowInsetRight());bottom=Math.max(bottom,insets.getSystemWindowInsetBottom());
            }
            if (Build.VERSION.SDK_INT >= 31) {
                for (int position=0;position<4;position++) {
                    RoundedCorner corner=insets.getRoundedCorner(position);
                    if(corner==null) continue;
                    int radius=corner.getRadius(),cx=corner.getCenter().x-location[0],cy=corner.getCenter().y-location[1];
                    corners.put(new JSONObject().put("position",position).put("radius",radius).put("x",cx).put("y",cy));
                    // Inscribe the HUD's rectangular bounds inside the actual quarter-circle.
                    double diagonal=radius/Math.sqrt(2);
                    boolean isLeft=position==RoundedCorner.POSITION_TOP_LEFT||position==RoundedCorner.POSITION_BOTTOM_LEFT;
                    boolean isTop=position==RoundedCorner.POSITION_TOP_LEFT||position==RoundedCorner.POSITION_TOP_RIGHT;
                    if(isLeft)left=Math.max(left,(int)Math.ceil(cx-diagonal));
                    else right=Math.max(right,(int)Math.ceil(width-cx-diagonal));
                    if(isTop)top=Math.max(top,(int)Math.ceil(cy-diagonal));
                    else bottom=Math.max(bottom,(int)Math.ceil(height-cy-diagonal));
                }
            }
            safeAreaJson=new JSONObject().put("width",width).put("height",height)
                .put("left",Math.max(0,left)).put("top",Math.max(0,top)).put("right",Math.max(0,right)).put("bottom",Math.max(0,bottom))
                .put("cutouts",cutouts).put("corners",corners).toString();
            sendSafeArea();
        } catch(Exception e) { android.util.Log.w("CatPusherUAT","Insets unavailable",e); }
    }
    private void sendSafeArea() {
        web.evaluateJavascript("window.setAndroidSafeArea && window.setAndroidSafeArea("+safeAreaJson+")",null);
    }

    /** Coming back to the app: switch to a newer game if OneDrive has one (otherwise leave the game running). */
    @Override
    protected void onRestart() {
        super.onRestart();
        loadNewest();
    }

    private boolean asking;   // the "connect updates" question is on screen

    private void askForUpdates() {
        if (asking) return;
        asking = true;
        new AlertDialog.Builder(this)
            .setOnDismissListener(d -> asking = false)
            .setTitle("Connect UAT updates")
            .setMessage("Tap Pick file, open OneDrive, then work > CoinPusher > uat and pick CatCoinPusher-UAT-game.json. "
                + "After that the game updates itself every time you open it, and you won't see this again.")
            .setPositiveButton("Pick file", (d, w) -> pick())
            .setNegativeButton("Not now", null)
            .show();
    }

    private void pick() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");   // OneDrive doesn't always label .json files as JSON
        startActivityForResult(i, PICK);
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == PICK_DIAGNOSTIC) {
            if(result==RESULT_OK&&data!=null&&data.getData()!=null)connectDiagnosticDocument(data.getData(),data.getFlags());
            else {diagnosticState="Log-file connection cancelled";sendDiagnosticStatus();}
            return;
        }
        if (request != PICK || result != RESULT_OK || data == null || data.getData() == null) return;
        Uri u = data.getData();
        try {
            getContentResolver().takePersistableUriPermission(u, Intent.FLAG_GRANT_READ_URI_PERMISSION);
        } catch (SecurityException e) {
            // Some providers only grant it for this session; the app will fall back to the last unpacked game.
        }
        prefs.edit().putString("uri", u.toString()).apply();
        loadNewest();
    }

    /**
     * Read the OneDrive file: unpack a new game if there is one, offer a new app if there is one, then show the
     * newest game we have, the one in OneDrive or the one bundled in this APK (assets/version.txt), whichever is newer.
     * Says what happened, so it's clear whether updates are arriving.
     */
    private void loadNewest() {
        showCurrentGame();
        checkCloud(false);
    }

    private void checkCloud(boolean manual) {
        if (offering || offeringGame || applying || pendingApk != null) return;
        manualCheck |= manual;
        if (checking || resultPending) return;
        checking = true;
        final boolean explicit = manualCheck;
        final long currentGame = Math.max(prefs.getLong("unpacked", 0), bundledVersion());
        final int currentApk = versionCode();
        updateWorker.execute(() -> {
            JSONObject update = null;
            String error = null;
            try {
                JSONObject known = new JSONObject(prefs.getString("cloudMetadata", "{}"));
                boolean mayReuse = UpdatePolicy.decide(known.optLong("version", 0), known.optInt("apkVersion", 0),
                    currentGame, currentApk, prefs.getLong("offeredGame", 0), prefs.getInt("offeredApk", 0), explicit)
                    == UpdatePolicy.Action.NONE;
                update = CloudUpdate.read(cloudAddress(), known, mayReuse);
            }
            catch (Exception e) { error = "Couldn't check OneDrive for a fresh update. Try again when connected."; }
            final JSONObject result = update;
            final String failure = error;
            runOnUiThread(() -> {
                checking = false;
                if (isFinishing() || isDestroyed()) return;
                if (!hasWindowFocus()) { readyUpdate = result; readyError = failure; resultPending = true; return; }
                finishCheck(result, failure);
            });
        });
    }

    private void finishCheck(JSONObject update, String failure) {
        boolean manual = manualCheck;
        manualCheck = false;
        if (update == null) {
            if (manual) new AlertDialog.Builder(this).setTitle("Update check unavailable")
                .setMessage(failure == null ? "Couldn't reach OneDrive. Try again when connected." : failure)
                .setPositiveButton("OK", null).show();
            return;
        }
        long version = update.optLong("version", 0);
        int apk = update.optInt("apkVersion", 0);
        try {
            JSONObject metadata = new JSONObject().put("version", version).put("apkVersion", apk)
                .put("displayName", update.optString("displayName", ""))
                .put("_etag", update.optString("_etag", ""));
            prefs.edit().putString("cloudMetadata", metadata.toString()).apply();
        } catch (Exception e) { }
        UpdatePolicy.Action action = UpdatePolicy.decide(version, apk,
            Math.max(prefs.getLong("unpacked", 0), bundledVersion()), versionCode(),
            prefs.getLong("offeredGame", 0), prefs.getInt("offeredApk", 0), manual);
        if (action == UpdatePolicy.Action.NONE) {
            if (manual) new AlertDialog.Builder(this).setTitle("You're up to date")
                .setMessage("Checked the UAT file directly in OneDrive.\n" + releaseName(update)).setPositiveButton("OK", null).show();
            return;
        }
        // A manual request can join an automatic check while its lightweight HEAD is in flight.
        if (update.optJSONObject("files") == null) { checkCloud(true); return; }
        if (action == UpdatePolicy.Action.APK && update.optString("apk", "").isEmpty()) {
            if (manual) new AlertDialog.Builder(this).setTitle("Incomplete app update")
                .setMessage("The UAT file is missing its app installer. Try again later.")
                .setPositiveButton("OK", null).show();
            return;
        }
        // Commit before showing: dismissal, installer return, recreation and reboot cannot loop.
        if (!prefs.edit().putLong("offeredGame", version).putInt("offeredApk", apk).commit()) return;
        if (action == UpdatePolicy.Action.APK) offerAppUpdate(update);
        else offerGameUpdate(update);
    }

    private void showCurrentGame() {
        long v = prefs.getLong("unpacked", 0);
        File page = new File(getFilesDir(), "game/index.html");
        if (v == 0 || !page.exists() || bundledVersion() >= v) v = 0;
        if (v == shownVersion) return;
        shownVersion = v;
        web.loadUrl(v == 0 ? "file:///android_asset/index.html" : Uri.fromFile(page).toString());
    }

    /** The version of the game bundled in this APK (written by build_apk.ps1). */
    private long bundledVersion() {
        try (InputStream in = getAssets().open("version.txt")) {
            byte[] b = new byte[32];
            int n = in.read(b);
            return Long.parseLong(new String(b, 0, Math.max(0, n), StandardCharsets.UTF_8).trim());
        } catch (Exception e) {
            return 0;
        }
    }

    /** Unpack the game from the OneDrive file if it's a version we haven't unpacked yet (and newer than the APK's). */
    private boolean unpackGame(JSONObject o) {
        try {
            long v = o.getLong("version");
            if (v <= Math.max(prefs.getLong("unpacked", 0), bundledVersion())) return false;
            File dir = new File(getFilesDir(), "game");
            File stage = new File(getFilesDir(), "game-stage");
            File backup = new File(getFilesDir(), "game-backup");
            deleteAll(stage);
            if (!stage.mkdirs()) return false;
            JSONObject files = o.getJSONObject("files");
            for (Iterator<String> it = files.keys(); it.hasNext(); ) {
                String name = it.next();
                File f = new File(stage, name);
                if (!f.getCanonicalPath().startsWith(stage.getCanonicalPath() + File.separator))
                    throw new SecurityException("Invalid update path");
                File parent = f.getParentFile();
                if (parent != null) parent.mkdirs();
                try (FileOutputStream fo = new FileOutputStream(f)) {
                    fo.write(Base64.decode(files.getString(name), Base64.DEFAULT));
                }
            }
            if (!new File(stage, "index.html").isFile() || !new File(stage, "lib/rapier.js").isFile())
                throw new IllegalArgumentException("Incomplete update");
            deleteAll(backup);
            if (dir.exists() && !dir.renameTo(backup)) throw new IllegalStateException("Can't preserve current game");
            if (!stage.renameTo(dir)) {
                if (backup.exists()) backup.renameTo(dir);
                throw new IllegalStateException("Can't activate update");
            }
            prefs.edit().putLong("unpacked", v).apply();
            deleteAll(backup);
            return true;
        } catch (Exception e) {
            return false;   // keep the game we already have
        }
    }

    private static void deleteAll(File f) {
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteAll(k);
        f.delete();
    }

    // CP-25: one user-selected diagnostic document, independent of the update URI.
    private static final int PICK_DIAGNOSTIC = 2;
    private static final String LOG_MARKER = DiagnosticPolicy.MARKER;
    private static final int MAX_LOG_BYTES = DiagnosticPolicy.MAX_BYTES;
    private volatile String diagnosticUri;
    private volatile String diagnosticState = "Choose the OneDrive log file once";
    private volatile boolean diagnosticDurable;
    private volatile long diagnosticSavedAt;
    private volatile String diagnosticLatest;
    private final Object diagnosticLocalLock = new Object();
    private final java.util.concurrent.ExecutorService diagnosticWorker = java.util.concurrent.Executors.newSingleThreadExecutor();
    private final java.util.concurrent.ExecutorService diagnosticShareWorker = java.util.concurrent.Executors.newSingleThreadExecutor();
    private final java.util.concurrent.atomic.AtomicBoolean diagnosticSharing = new java.util.concurrent.atomic.AtomicBoolean();
    private DiagnosticWriter diagnosticWriter;

    private void initDiagnostics() {
        diagnosticUri=prefs.getString("diagnosticUri.v1",null);
        diagnosticDurable=diagnosticUri!=null;
        diagnosticState=diagnosticUri==null?"Choose the OneDrive log file once":"Log file linked; next test saves automatically";
        diagnosticWriter=new DiagnosticWriter(diagnosticWorker,text->{
            writeDiagnosticLocal(text);
            if(diagnosticUri!=null) writeDiagnosticDocument(text);
        },error->{diagnosticState="Could not save the log file; reconnect or try Share log";sendDiagnosticStatus();});
    }
    private File diagnosticFile(){return new File(getFilesDir(),"diagnostics-latest.json");}
    private void writeDiagnosticLocal(String text) throws Exception {
        synchronized(diagnosticLocalLock){
            android.util.AtomicFile file=new android.util.AtomicFile(diagnosticFile());
            FileOutputStream out=null;
            try{out=file.startWrite();out.write(text.getBytes(StandardCharsets.UTF_8));file.finishWrite(out);}
            catch(Exception e){if(out!=null)file.failWrite(out);throw e;}
        }
    }
    private JSONObject readDiagnosticDocument(Uri uri) throws Exception {
        try(InputStream in=getContentResolver().openInputStream(uri)){
            if(in==null)throw new java.io.IOException("Log file unavailable");
            ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] buffer=new byte[4096];int count;
            while((count=in.read(buffer))!=-1){if(out.size()+count>MAX_LOG_BYTES)throw new java.io.IOException("Not a diagnostic file");out.write(buffer,0,count);}
            JSONObject object=new JSONObject(out.toString(StandardCharsets.UTF_8.name()));
            if(!DiagnosticPolicy.isSink(object.optString("sink"),object.optString("format")))
                throw new java.io.IOException("Choose CatCoin-UAT-performance.json");
            return object;
        }
    }
    private void writeDiagnosticDocument(String text) throws Exception {
        String destination=diagnosticUri;if(destination==null)return;
        Uri uri=Uri.parse(destination);
        readDiagnosticDocument(uri); // Never overwrite a game/update document selected by mistake.
        byte[] document=DiagnosticPolicy.documentBytes(text);
        diagnosticState="Saving log to selected file…";sendDiagnosticStatus();
        try(OutputStream out=getContentResolver().openOutputStream(uri,"wt")){
            if(out==null)throw new java.io.IOException("Log file is not writable");
            out.write(document);out.flush();
        }
        diagnosticSavedAt=System.currentTimeMillis();
        diagnosticState=diagnosticDurable?"Saved to log file; OneDrive sync may take a moment":"Saved for this session; use Share log if reconnecting is needed";
        sendDiagnosticStatus();
    }
    private String diagnosticStatus(){
        try{return new JSONObject().put("connected",diagnosticUri!=null).put("durable",diagnosticDurable).put("state",diagnosticState).put("savedAt",diagnosticSavedAt).put("hasLog",diagnosticLatest!=null||diagnosticFile().isFile()).toString();}
        catch(Exception e){return "{}";}
    }
    private void sendDiagnosticStatus(){runOnUiThread(()->{if(web!=null&&!isFinishing()&&!isDestroyed())web.evaluateJavascript("window.onDiagnosticStatus && onDiagnosticStatus("+diagnosticStatus()+")",null);});}
    private void pickDiagnosticDocument(){
        new AlertDialog.Builder(this).setTitle("Link performance log")
            .setMessage("Open OneDrive > work > CoinPusher > uat > diagnostics and choose CatCoin-UAT-performance.json. After that, test logs save to that file automatically. Do not choose the game update file.")
            .setPositiveButton("Choose log file",(d,w)->{
                Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION|Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
                String initial=prefs.getString("uri",null);if(initial!=null)intent.putExtra(android.provider.DocumentsContract.EXTRA_INITIAL_URI,Uri.parse(initial));
                startActivityForResult(intent,PICK_DIAGNOSTIC);
            }).setNegativeButton("Cancel",null).show();
    }
    private void connectDiagnosticDocument(Uri uri,int flags){
        diagnosticState="Checking selected log file…";sendDiagnosticStatus();
        diagnosticWorker.execute(()->{
            try{
                if(!DiagnosticPolicy.selectedFile(uri.getScheme(),(flags&Intent.FLAG_GRANT_WRITE_URI_PERMISSION)!=0))throw new java.io.IOException("Write access not granted");
                readDiagnosticDocument(uri);
                int grant=flags&(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
                boolean durable=true;try{getContentResolver().takePersistableUriPermission(uri,grant);}catch(SecurityException e){durable=false;}
                diagnosticUri=uri.toString();diagnosticDurable=durable;
                if(durable)prefs.edit().putString("diagnosticUri.v1",diagnosticUri).apply();else prefs.edit().remove("diagnosticUri.v1").apply();
                diagnosticState=durable?"Log file linked; next test saves automatically":"Log file linked for this app session";sendDiagnosticStatus();
                if(diagnosticLatest!=null)diagnosticWriter.submit(diagnosticLatest);
            }catch(Exception e){diagnosticState="Could not link that file. Choose the prepared log file, or use Share log.";sendDiagnosticStatus();}
        });
    }
    private void receiveDiagnosticLog(String text){
        try{
            if(text==null||text.length()>MAX_LOG_BYTES||text.getBytes(StandardCharsets.UTF_8).length>MAX_LOG_BYTES)return;
            JSONObject log=new JSONObject(text);
            if(!DiagnosticPolicy.payload(log.optString("format"),log.optJSONObject("current")!=null,log.optJSONArray("sampleColumns")!=null,text.getBytes(StandardCharsets.UTF_8).length))return;
            log.put("sink",LOG_MARKER).put("nativeApkVersion",versionCode());
            String encoded=log.toString();if(encoded.getBytes(StandardCharsets.UTF_8).length>MAX_LOG_BYTES)return;
            diagnosticLatest=encoded;diagnosticWriter.submit(encoded);
        }catch(Exception ignored){}
    }
    private void shareDiagnosticLog(){
        if(!diagnosticSharing.compareAndSet(false,true))return;
        diagnosticShareWorker.execute(()->{
            try{
                if(diagnosticLatest!=null)writeDiagnosticLocal(diagnosticLatest);
                if(!diagnosticFile().isFile())throw new java.io.IOException("Play a short test first");
                Uri uri=Uri.parse("content://com.jenny.catpusher.uat.diagnostics/performance.json");
                runOnUiThread(()->{
                    try{
                        Intent send=new Intent(Intent.ACTION_SEND).setType("application/json").putExtra(Intent.EXTRA_STREAM,uri);
                        send.setClipData(android.content.ClipData.newRawUri("CatCoin performance log",uri));send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(send,"Save log to OneDrive"));
                    }catch(Exception e){diagnosticState="Could not open sharing; reconnect the log file instead";sendDiagnosticStatus();
                    }finally{diagnosticSharing.set(false);}
                });
            }catch(Exception e){diagnosticSharing.set(false);diagnosticState="No saved log available yet; play briefly and try again";sendDiagnosticStatus();}
        });
    }

    // ---------- "Check for updates" (a button in the game's 🎒 menu) ----------

    /** What the page can ask for: check for updates now, or pick the update file again. */
    class Bridge {
        @android.webkit.JavascriptInterface public String getDiagnosticStatus(){return diagnosticStatus();}
        @android.webkit.JavascriptInterface public void connectDiagnosticFile(){runOnUiThread(MainActivity.this::pickDiagnosticDocument);}
        @android.webkit.JavascriptInterface public void savePerformanceLog(String text){receiveDiagnosticLog(text);}
        @android.webkit.JavascriptInterface public void sharePerformanceLog(){shareDiagnosticLog();}
        @android.webkit.JavascriptInterface public String getSafeArea() { return safeAreaJson; }
        @android.webkit.JavascriptInterface public void checkUpdates() { runOnUiThread(MainActivity.this::checkNow); }
        @android.webkit.JavascriptInterface public void pickUpdateFile() { runOnUiThread(MainActivity.this::pick); }
        /** Say a short line in a high, cartoony voice (stand-in until recorded voice clips exist). */
        @android.webkit.JavascriptInterface public void speak(String text) {
            if (tts != null && ttsReady) tts.speak(text, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, "line");
        }
    }

    /** Read the OneDrive file right now and say plainly what happened. */
    private void checkNow() { checkCloud(true); }

    /** Keep the selected OneDrive URI, but never replace a board without asking. */
    private void offerGameUpdate(JSONObject o) {
        if (offeringGame) return;
        offeringGame = true;
        new AlertDialog.Builder(this)
            .setTitle("Game update available")
            .setMessage(releaseName(o) + " is ready. Update now? This restarts the current board.")
            .setPositiveButton("Update", (d, w) -> {
                applying = true;
                // Flush the existing game's save before changing the loaded page.
                web.evaluateJavascript("typeof save === 'function' && save()", ignored -> {
                    updateWorker.execute(() -> {
                        boolean ok = unpackGame(o);
                        runOnUiThread(() -> {
                            applying = false;
                            if (isFinishing() || isDestroyed()) return;
                            if (ok) { shownVersion = -1; showCurrentGame(); }
                            Toast.makeText(this, ok ? "Game updated" : "Couldn't apply update. Check for updates to retry.", Toast.LENGTH_LONG).show();
                        });
                    });
                });
            })
            .setNegativeButton("Later", null)
            .setOnDismissListener(d -> offeringGame = false)
            .show();
    }

    private static String releaseName(JSONObject update) {
        String name = update.optString("displayName", "").trim();
        return name.isEmpty() ? "Earlier UAT build" : name;
    }

    // ---------- updating the app itself ----------

    private int versionCode() {
        // The installed build's version must never fall back to zero on a runtime lookup failure.
        return BuildConfig.VERSION_CODE;
    }

    /** If the OneDrive file carries a newer app, ask whether to install it now ("Later" asks again next time). */
    private void offerAppUpdate(JSONObject o) {
        if (offering || pendingApk != null) return;
        final int v = o.optInt("apkVersion", 0);
        final String b64 = o.optString("apk", "");
        if (v <= versionCode() || b64.isEmpty()) return;
        offering = true;
        new AlertDialog.Builder(this)
            .setTitle("App update")
            .setMessage(releaseName(o) + " is ready. Install it now? Your coins and collection stay.")
            .setPositiveButton("Install", (d, w) -> {
                applying = true;
                web.evaluateJavascript("typeof save === 'function' && save()", ignored -> {
                    updateWorker.execute(() -> {
                        byte[] bytes = null;
                        try { bytes = Base64.decode(b64, Base64.DEFAULT); } catch (Exception e) { }
                        final byte[] apk = bytes;
                        runOnUiThread(() -> {
                            applying = false;
                            if (isFinishing() || isDestroyed()) return;
                            if (apk != null) install(apk);
                            else Toast.makeText(this, "Couldn't read the update. Check for updates to retry.", Toast.LENGTH_LONG).show();
                        });
                    });
                });
            })
            .setNegativeButton("Later", null)
            .setOnDismissListener(d -> offering = false)
            .show();
    }

    /** Back from "Allow from this source": carry on with the update. */
    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        web.evaluateJavascript("window.appPaused && appPaused(false); window.diagNativePause && diagNativePause(false)", null);
        if (pendingApk != null && getPackageManager().canRequestPackageInstalls()) {
            byte[] a = pendingApk;
            pendingApk = null;
            install(a);
        }
    }

    /** Hand the new APK to Android's installer, which shows "Do you want to update this app?". */
    private void install(byte[] apk) {
        if (!getPackageManager().canRequestPackageInstalls()) {
            pendingApk = apk;   // first time: allow Cat Pusher UAT to install updates, then come back
            startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + getPackageName())));
            return;
        }
        try {
            PackageInstaller installer = getPackageManager().getPackageInstaller();
            PackageInstaller.SessionParams p = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
            p.setAppPackageName(getPackageName());
            int id = installer.createSession(p);
            try (PackageInstaller.Session session = installer.openSession(id)) {
                try (OutputStream o = session.openWrite("app", 0, apk.length)) {
                    o.write(apk);
                    session.fsync(o);
                }
                String token = java.util.UUID.randomUUID().toString();
                if (!prefs.edit().putString("installToken", token).commit()) throw new IllegalStateException("Can't save installer state");
                Intent done = new Intent(this, MainActivity.class).setAction(ACTION_INSTALLED).putExtra("installToken", token);
                int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
                session.commit(PendingIntent.getActivity(this, 0, done, flags).getIntentSender());
            }
        } catch (Exception e) {
            Toast.makeText(this, "Update didn't install: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    /** The installer reports back here; when it needs your OK, show its confirmation screen. */
    @Override
    protected void onNewIntent(Intent i) {
        super.onNewIntent(i);
        if (ACTION_INSTALLED.equals(i.getAction())) handleInstallResult(i);
    }

    // Only the installer holding our per-session PendingIntent capability can supply this token.
    @android.annotation.SuppressLint("UnsafeIntentLaunch")
    private void handleInstallResult(Intent i) {
        String token = prefs.getString("installToken", null);
        if (token == null || !token.equals(i.getStringExtra("installToken"))) return;
        int status = i.getIntExtra(PackageInstaller.EXTRA_STATUS, -999);
        if (status == PackageInstaller.STATUS_PENDING_USER_ACTION) {
            Intent confirm = i.getParcelableExtra(Intent.EXTRA_INTENT);
            if (confirm != null) startActivity(confirm);
        } else {
            prefs.edit().remove("installToken").apply();
            if (status == PackageInstaller.STATUS_SUCCESS) return;
            String msg = i.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE);
            Toast.makeText(this, msg == null ? "Update didn't install." : msg, Toast.LENGTH_LONG).show();
        }
    }

    // ---------- full screen ----------

    /** Hide the status and navigation bars so the machine fills the screen; a swipe brings them back briefly. */
    @Override
    public void onWindowFocusChanged(boolean focus) {
        super.onWindowFocusChanged(focus);
        if (!focus) return;
        if (resultPending) {
            JSONObject result = readyUpdate; String error = readyError;
            readyUpdate = null; readyError = null; resultPending = false;
            finishCheck(result, error);
        }
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController c = getWindow().getInsetsController();
            if (c != null) {
                c.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                c.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    protected void onDestroy() {
        updateWorker.shutdownNow();
        diagnosticWorker.shutdown();
        diagnosticShareWorker.shutdown();
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }

    /** Pause the game loop and sounds while the app is in the background. */
    @Override
    protected void onPause() {
        super.onPause();
        web.evaluateJavascript("window.appPaused && appPaused(true); window.diagNativePause && diagNativePause(true)", null); // stop the music
        web.onPause();
    }
}
