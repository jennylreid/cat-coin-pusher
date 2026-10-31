package com.jenny.catpusher.uat;

import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/** Bounded latest-value writer: at most one executing and one pending payload. */
final class DiagnosticWriter {
    interface Backend { void write(String text) throws Exception; }
    interface Failure { void failed(Exception error); }
    private final Executor executor;
    private final Backend backend;
    private final Failure failure;
    private final AtomicReference<String> pending = new AtomicReference<>();
    private final AtomicBoolean running = new AtomicBoolean();
    DiagnosticWriter(Executor executor, Backend backend, Failure failure) {
        this.executor=executor; this.backend=backend; this.failure=failure;
    }
    void submit(String text) {
        pending.set(text);
        schedule();
    }
    private void schedule() {
        if (!running.compareAndSet(false,true)) return;
        try { executor.execute(this::drain); }
        catch (RuntimeException e) { running.set(false); failure.failed(e); }
    }
    private void drain() {
        try {
            String text;
            while ((text=pending.getAndSet(null))!=null) {
                try { backend.write(text); } catch (Exception e) { failure.failed(e); }
            }
        } finally {
            running.set(false);
            if (pending.get()!=null) schedule();
        }
    }
}
