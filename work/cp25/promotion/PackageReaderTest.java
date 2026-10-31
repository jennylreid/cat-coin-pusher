package com.jenny.catpusher;
import java.net.*;import java.io.*;import java.nio.file.*;import java.util.*;import java.security.*;import org.json.JSONObject;
public class PackageReaderTest {
 public static void main(String[] args)throws Exception{
 final Path file=Path.of(args[0]);URL.setURLStreamHandlerFactory(protocol->protocol.equals("https")?new URLStreamHandler(){protected URLConnection openConnection(URL url){return new HttpURLConnection(url){public void connect(){}public void disconnect(){}public boolean usingProxy(){return false;}public int getResponseCode(){return 200;}public long getContentLengthLong(){try{return Files.size(file);}catch(Exception e){return 0;}}public String getHeaderField(String name){return name.equals("ETag")?"test-etag":null;}public InputStream getInputStream()throws IOException{return Files.newInputStream(file);}};}}:null);
 JSONObject u=CloudUpdate.read("https://staged.production.invalid/release");if(u.getInt("apkVersion")!=17||u.getJSONObject("files").length()!=0||!u.getString("displayName").equals("2026.10.31"))throw new AssertionError();
 byte[] installer=Base64.getDecoder().decode(u.getString("apk"));String sha=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(installer));if(!sha.equals(args[1]))throw new AssertionError("Installer mismatch");
 JSONObject metadata=new JSONObject().put("_etag","test-etag");if(CloudUpdate.read("https://staged.production.invalid/release",metadata,true)!=metadata)throw new AssertionError();
 System.out.println("PASS: exact production APK16 CloudUpdate source reads full staged APK-only envelope, production identity, label, empty files, complete installer SHA256 and unchanged ETag metadata reuse; desktop JVM only, not phone memory evidence");
 }
}
