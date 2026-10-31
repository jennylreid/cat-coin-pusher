package com.jenny.catpusher.uat;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

/** Download the same UAT OneDrive item through HTTPS, outside Android's document cache. */
final class CloudUpdate {
    static JSONObject read(String address, JSONObject known, boolean mayReuse) throws Exception {
        if (mayReuse && known != null && !known.optString("_etag", "").isEmpty()) {
            HttpURLConnection head = (HttpURLConnection) new URL(address).openConnection();
            head.setRequestMethod("HEAD");
            head.setConnectTimeout(15000); head.setReadTimeout(15000);
            head.setUseCaches(false);
            head.setRequestProperty("Cache-Control", "no-cache, no-store, max-age=0");
            try {
                if (head.getResponseCode() == 200 && known.getString("_etag").equals(head.getHeaderField("ETag")))
                    return known;
            } finally { head.disconnect(); }
        }
        return read(address);
    }

    static JSONObject read(String address) throws Exception {
        URL url = new URL(address);
        long deadline = System.nanoTime() + 120_000_000_000L;
        for (int redirect = 0; redirect <= 8; redirect++) {
            if (!"https".equalsIgnoreCase(url.getProtocol())) throw new IOException("HTTPS required");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(15000);
            connection.setReadTimeout(30000);
            connection.setUseCaches(false);
            connection.setInstanceFollowRedirects(false);
            connection.setRequestProperty("Cache-Control", "no-cache, no-store, max-age=0");
            connection.setRequestProperty("Pragma", "no-cache");
            connection.setRequestProperty("Accept", "application/json, application/octet-stream");
            try {
                int status = connection.getResponseCode();
                if (status == 301 || status == 302 || status == 303 || status == 307 || status == 308) {
                    String location = connection.getHeaderField("Location");
                    if (location == null) throw new IOException("Missing download redirect");
                    url = new URL(url, location);
                    continue;
                }
                if (status != 200) throw new IOException("OneDrive returned HTTP " + status);
                long length = connection.getContentLengthLong();
                if (length > 128 * 1024 * 1024) throw new IOException("Update is too large");
                try (InputStream in = connection.getInputStream(); ByteArrayOutputStream out = new ByteArrayOutputStream(length > 0 ? (int) length : 65536)) {
                    byte[] buffer = new byte[65536];
                    int count;
                    while ((count = in.read(buffer)) != -1) {
                        if (System.nanoTime() > deadline) throw new IOException("Download timed out");
                        if (out.size() + count > 128 * 1024 * 1024) throw new IOException("Update is too large");
                        out.write(buffer, 0, count);
                    }
                    JSONObject update = new JSONObject(out.toString(StandardCharsets.UTF_8.name()));
                    if (!"catpusher-uat".equals(update.optString("channel"))
                            || !"com.jenny.catpusher.uat".equals(update.optString("applicationId")))
                        throw new IOException("This is not the UAT update file");
                    if (update.optLong("version", 0) <= 0 || update.optInt("apkVersion", 0) <= 0
                            || update.optJSONObject("files") == null)
                        throw new IOException("Incomplete update file");
                    String etag = connection.getHeaderField("ETag");
                    if (etag != null) update.put("_etag", etag);
                    return update;
                }
            } finally { connection.disconnect(); }
        }
        throw new IOException("Too many OneDrive redirects");
    }
}
