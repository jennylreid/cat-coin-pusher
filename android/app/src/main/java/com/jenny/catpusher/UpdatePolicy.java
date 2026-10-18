package com.jenny.catpusher;

/** One release offer, shared by automatic and manual checks. No Android dependencies. */
final class UpdatePolicy {
    enum Action { NONE, GAME, APK }
    static Action decide(long remoteGame, int remoteApk, long currentGame, int currentApk,
                         long lastOfferedGame, int lastOfferedApk, boolean manual) {
        if (!manual && remoteGame <= lastOfferedGame && remoteApk <= lastOfferedApk)
            return Action.NONE;
        if (remoteApk > currentApk) return Action.APK;
        if (remoteGame > currentGame) return Action.GAME;
        return Action.NONE;
    }
}
