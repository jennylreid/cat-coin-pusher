package com.jenny.catpusher.uat;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import java.io.File;
import java.io.FileNotFoundException;

/** One explicitly shared, read-only diagnostic file; no arbitrary paths. */
public class DiagnosticProvider extends ContentProvider {
    private File file(Uri uri) throws FileNotFoundException {
        if (!"/performance.json".equals(uri.getPath())) throw new FileNotFoundException("Unknown diagnostic file");
        File file=new File(getContext().getFilesDir(),"diagnostics-latest.json");
        if (!file.isFile()) throw new FileNotFoundException("No diagnostic log yet");
        return file;
    }
    @Override public boolean onCreate() { return true; }
    @Override public String getType(Uri uri) { return "application/json"; }
    @Override public ParcelFileDescriptor openFile(Uri uri,String mode) throws FileNotFoundException {
        if (!"r".equals(mode)) throw new FileNotFoundException("Diagnostic file is read only");
        return ParcelFileDescriptor.open(file(uri),ParcelFileDescriptor.MODE_READ_ONLY);
    }
    @Override public Cursor query(Uri uri,String[] projection,String selection,String[] args,String sort) {
        try {
            File f=file(uri);
            String[] columns=projection!=null?projection:new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE};
            MatrixCursor cursor=new MatrixCursor(columns,1);Object[] row=new Object[columns.length];
            for(int i=0;i<columns.length;i++) row[i]=OpenableColumns.DISPLAY_NAME.equals(columns[i])?"CatCoin-UAT-performance.json":OpenableColumns.SIZE.equals(columns[i])?f.length():null;
            cursor.addRow(row);return cursor;
        } catch(FileNotFoundException e) { return null; }
    }
    @Override public Uri insert(Uri uri,ContentValues values){throw new UnsupportedOperationException();}
    @Override public int update(Uri uri,ContentValues values,String selection,String[] args){throw new UnsupportedOperationException();}
    @Override public int delete(Uri uri,String selection,String[] args){throw new UnsupportedOperationException();}
}
