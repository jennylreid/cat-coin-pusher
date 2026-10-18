package com.jenny.catpusher;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
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
 * Cat Coin Pusher test build: shows the game full screen.
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
    private static final String ACTION_INSTALLED = "com.jenny.catpusher.INSTALL_STATUS";
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
            .setTitle("Connect production updates")
            .setMessage("Tap Pick file, open OneDrive, then work > CoinPusher > phone and pick CatCoinPusher-game.json. "
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
                .setMessage("Checked the production file directly in OneDrive.\n" + releaseName(update)).setPositiveButton("OK", null).show();
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

    // ---------- "Check for updates" (a button in the game's 🎒 menu) ----------

    /** What the page can ask for: check for updates now, or pick the update file again. */
    class Bridge {
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
        return name.isEmpty() ? "Earlier production build" : name;
    }

    // ---------- updating the app itself ----------

    private int versionCode() {
        try {
            PackageInfo pi = getPackageManager().getPackageInfo(getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? (int) pi.getLongVersionCode() : pi.versionCode;
        } catch (Exception e) {
            return 0;
        }
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
        web.evaluateJavascript("window.appPaused && appPaused(false)", null);
        if (pendingApk != null && getPackageManager().canRequestPackageInstalls()) {
            byte[] a = pendingApk;
            pendingApk = null;
            install(a);
        }
    }

    /** Hand the new APK to Android's installer, which shows "Do you want to update this app?". */
    private void install(byte[] apk) {
        if (!getPackageManager().canRequestPackageInstalls()) {
            pendingApk = apk;   // first time: allow Cat Coin Pusher to install updates, then come back
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
        if (tts != null) tts.shutdown();
        super.onDestroy();
    }

    /** Pause the game loop and sounds while the app is in the background. */
    @Override
    protected void onPause() {
        super.onPause();
        web.evaluateJavascript("window.appPaused && appPaused(true)", null); // stop the music
        web.onPause();
    }
}
