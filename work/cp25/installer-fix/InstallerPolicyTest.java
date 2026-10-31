package com.jenny.catpusher.uat;
public class InstallerPolicyTest {
 public static void main(String[] args) {
  long remote=Long.parseLong(args[0]);
  if(BuildConfig.VERSION_CODE!=7)throw new AssertionError("wrong compiled version");
  for(int installed:new int[]{4,5,6}) {
   check(UpdatePolicy.decide(remote,7,20261030183741L,installed,20261030183741L,6,false),UpdatePolicy.Action.APK);
   check(UpdatePolicy.decide(remote,7,20261030183741L,installed,remote,7,true),UpdatePolicy.Action.APK);
  }
  for(boolean manual:new boolean[]{false,true})
   check(UpdatePolicy.decide(remote,7,remote,BuildConfig.VERSION_CODE,0,0,manual),UpdatePolicy.Action.NONE);
  check(UpdatePolicy.decide(remote+1,7,remote,BuildConfig.VERSION_CODE,remote,7,true),UpdatePolicy.Action.GAME);
  check(UpdatePolicy.decide(20261030183741L,6,remote,BuildConfig.VERSION_CODE,0,0,true),UpdatePolicy.Action.NONE);
  // Reproduces the old fallback's false installer requirement; the compiled version removes this input.
  check(UpdatePolicy.decide(20261030183741L,6,20261030172415L,0,0,0,true),UpdatePolicy.Action.APK);
  check(UpdatePolicy.decide(20261030183741L,6,20261030172415L,BuildConfig.VERSION_CODE,0,0,true),UpdatePolicy.Action.GAME);
  System.out.println("PASS: 12 cases; compiled APK7, old APK4/5/6 upgrade and manual retry, no reoffer, game-only path and stale rejection, old zero-fallback error reproduced");
 }
 static void check(UpdatePolicy.Action actual,UpdatePolicy.Action expected){if(actual!=expected)throw new AssertionError(actual+" != "+expected);}
}
