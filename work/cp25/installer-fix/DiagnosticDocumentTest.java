package com.jenny.catpusher.uat;

import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class DiagnosticDocumentTest {
    static void require(boolean value,String why){if(!value)throw new AssertionError(why);}
    static String decode(byte[] bytes)throws Exception{
        return StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT)
            .onUnmappableCharacter(CodingErrorAction.REPORT).decode(ByteBuffer.wrap(bytes)).toString();
    }
    static void rejects(String text){
        try{DiagnosticPolicy.documentBytes(text);throw new AssertionError("Accepted invalid size");}
        catch(IllegalArgumentException expected){}
    }
    static void checkDocument(String text)throws Exception{
        byte[] padded=DiagnosticPolicy.documentBytes(text);
        require(padded.length==DiagnosticPolicy.MAX_BYTES,"Document byte bound");
        require(decode(padded).stripTrailing().equals(text),"UTF8 JSON unchanged with only trailing JSON whitespace");
        int jsonLength=text.getBytes(StandardCharsets.UTF_8).length;
        for(int i=jsonLength;i<padded.length;i++)require(padded[i]==' ',"Padding must be legal JSON whitespace");
    }
    public static void main(String[] args)throws Exception{
        String shortLog="{\"sink\":\""+DiagnosticPolicy.MARKER+"\",\"format\":\""+DiagnosticPolicy.FORMAT+"\",\"current\":{\"label\":\"猫 🐈 café\"}}";
        checkDocument(shortLog);
        String prefix="{\"value\":\"猫\"}";
        String atLimit=prefix+" ".repeat(DiagnosticPolicy.MAX_BYTES-prefix.getBytes(StandardCharsets.UTF_8).length);
        require(DiagnosticPolicy.documentBytes(atLimit).length==DiagnosticPolicy.MAX_BYTES,"Exact UTF8 byte limit accepted");
        rejects(atLimit+" ");rejects("x".repeat(DiagnosticPolicy.MAX_BYTES-1)+"猫");rejects("");rejects(null);

        // Simulate a provider opening at byte zero but ignoring truncate: ordinary
        // short writes leave stale data; the fixed document overwrites every byte.
        Path file=Files.createTempFile("catcoin-diagnostic-provider-",".json");
        try{
            String oldLog="{\"old\":\""+"x".repeat(DiagnosticPolicy.MAX_BYTES-10)+"\"}";
            byte[] previous=oldLog.getBytes(StandardCharsets.UTF_8);require(previous.length==DiagnosticPolicy.MAX_BYTES,"Valid old JSON fills existing document");Files.write(file,previous);
            try(RandomAccessFile provider=new RandomAccessFile(file.toFile(),"rw")){
                provider.seek(0);provider.write(shortLog.getBytes(StandardCharsets.UTF_8));
            }
            require(!decode(Files.readAllBytes(file)).stripTrailing().equals(shortLog),"Ordinary overwrite demonstrates stale suffix");
            try(RandomAccessFile provider=new RandomAccessFile(file.toFile(),"rw")){
                provider.seek(0);provider.write(DiagnosticPolicy.documentBytes(shortLog));
            }
            require(Files.size(file)==DiagnosticPolicy.MAX_BYTES,"Provider document remains bounded");
            require(decode(Files.readAllBytes(file)).stripTrailing().equals(shortLog),"Padded overwrite removes old suffix without truncate");
        }finally{Files.deleteIfExists(file);}
        require(DiagnosticPolicy.isSink(DiagnosticPolicy.MARKER,DiagnosticPolicy.FORMAT),"Marker guard retained");
        require(!DiagnosticPolicy.isSink("game",DiagnosticPolicy.FORMAT),"Wrong destination guard retained");
        System.out.println("PASS: fixed128KB UTF8 JSON+whitespace; exact/over-limit guards; non-truncating shorter overwrite; destination marker guards");
    }
}
