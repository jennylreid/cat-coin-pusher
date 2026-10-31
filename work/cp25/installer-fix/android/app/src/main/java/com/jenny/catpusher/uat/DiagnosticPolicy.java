package com.jenny.catpusher.uat;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
/** Guards both ends of the diagnostic bridge without granting general file access. */
final class DiagnosticPolicy {
    static final String MARKER="catcoin-uat-diagnostic-sink-v1";
    static final String FORMAT="CatCoin UAT performance log v1";
    static final int MAX_BYTES=131072;
    static boolean selectedFile(String scheme,boolean writable){return "content".equals(scheme)&&writable;}
    static boolean isSink(String marker,String format){return MARKER.equals(marker)&&FORMAT.equals(format);}
    static boolean payload(String format,boolean current,boolean columns,int bytes){return FORMAT.equals(format)&&current&&columns&&bytes>0&&bytes<=MAX_BYTES;}
    /** Some document providers overwrite from zero without honoring truncation.
     * Fill the entire bounded document with JSON followed by legal whitespace. */
    static byte[] documentBytes(String text){
        if(text==null)throw new IllegalArgumentException("Missing diagnostic log");
        byte[] json=text.getBytes(StandardCharsets.UTF_8);
        if(json.length==0||json.length>MAX_BYTES)throw new IllegalArgumentException("Diagnostic log is too large or empty");
        byte[] document=new byte[MAX_BYTES];
        System.arraycopy(json,0,document,0,json.length);
        Arrays.fill(document,json.length,document.length,(byte)' ');
        return document;
    }
}
