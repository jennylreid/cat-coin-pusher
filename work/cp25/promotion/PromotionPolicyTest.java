package com.jenny.catpusher;
public class PromotionPolicyTest {
 static void eq(UpdatePolicy.Action a,UpdatePolicy.Action b){if(a!=b)throw new AssertionError(a+" != "+b);}
 public static void main(String[] args){long v=Long.parseLong(args[0]);if(BuildConfig.VERSION_CODE!=17)throw new AssertionError();
  eq(UpdatePolicy.decide(v,17,20261027120233L,16,0,0,false),UpdatePolicy.Action.APK);
  eq(UpdatePolicy.decide(v,17,20261027120233L,16,v,17,false),UpdatePolicy.Action.NONE);
  eq(UpdatePolicy.decide(v,17,20261027120233L,16,v,17,true),UpdatePolicy.Action.APK);
  for(boolean manual:new boolean[]{false,true})eq(UpdatePolicy.decide(v,17,v,BuildConfig.VERSION_CODE,0,0,manual),UpdatePolicy.Action.NONE);
  eq(UpdatePolicy.decide(v+1,17,v,17,v,17,false),UpdatePolicy.Action.GAME);
  eq(UpdatePolicy.decide(v-1,16,v,17,0,0,true),UpdatePolicy.Action.NONE);
  System.out.println("PASS: APK16 automatic offer, decline suppression, manual retry; generated APK17 version, no reoffer automatic/manual, future game-only path, stale rejection");
 }
}
