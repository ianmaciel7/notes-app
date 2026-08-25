"use client";

import * as React from "react";
import {
  type BlockEditorDocument,
  normalizeBlockEditorDocument,
} from "@/editor/document";

const DEFAULT_COMMIT_DELAY = 250;

type UseBufferedDocumentCommitOptions = {
  value: BlockEditorDocument;
  onCommit?: (document: BlockEditorDocument) => void;
  delay?: number;
};

type BufferedDocumentCommit = {
  acceptExternalDocument: (document: BlockEditorDocument) => void;
  cancelPendingCommit: () => void;
  finishComposition: () => void;
  flushCommit: () => void;
  scheduleCommit: (document: BlockEditorDocument) => void;
  startComposition: () => void;
};

function serializeDocument(document: BlockEditorDocument) {
  return JSON.stringify(document);
}

function useBufferedDocumentCommit({
  value,
  onCommit,
  delay = DEFAULT_COMMIT_DELAY,
}: UseBufferedDocumentCommitOptions): BufferedDocumentCommit {
  const onCommitRef = React.useRef(onCommit);
  const externalValueRef = React.useRef(serializeDocument(value));
  const pendingRef = React.useRef<BlockEditorDocument | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const composingRef = React.useRef(false);

  React.useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  const clearTimer = React.useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const flushCommit = React.useCallback(() => {
    clearTimer();
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) return;

    const normalized = normalizeBlockEditorDocument(pending);
    if (!normalized) return;
    const serialized = serializeDocument(normalized);
    if (serialized === externalValueRef.current) return;

    externalValueRef.current = serialized;
    onCommitRef.current?.(normalized);
  }, [clearTimer]);

  const scheduleCommit = React.useCallback(
    (document: BlockEditorDocument) => {
      pendingRef.current = document;
      clearTimer();
      if (composingRef.current || !onCommitRef.current) return;
      timerRef.current = setTimeout(flushCommit, delay);
    },
    [clearTimer, delay, flushCommit],
  );

  const cancelPendingCommit = React.useCallback(() => {
    clearTimer();
    pendingRef.current = null;
  }, [clearTimer]);

  const acceptExternalDocument = React.useCallback(
    (document: BlockEditorDocument) => {
      cancelPendingCommit();
      externalValueRef.current = serializeDocument(document);
    },
    [cancelPendingCommit],
  );

  const startComposition = React.useCallback(() => {
    composingRef.current = true;
    clearTimer();
  }, [clearTimer]);

  const finishComposition = React.useCallback(() => {
    composingRef.current = false;
    const pending = pendingRef.current;
    if (pending) scheduleCommit(pending);
  }, [scheduleCommit]);

  const flushPendingDocument = React.useCallback(() => {
    clearTimer();
    const pending = pendingRef.current;
    pendingRef.current = null;
    if (!pending) return;
    const normalized = normalizeBlockEditorDocument(pending);
    if (!normalized) return;
    const serialized = serializeDocument(normalized);
    if (serialized !== externalValueRef.current) {
      externalValueRef.current = serialized;
      onCommitRef.current?.(normalized);
    }
  }, [clearTimer]);

  React.useEffect(() => {
    window.addEventListener("pagehide", flushPendingDocument);
    window.addEventListener("beforeunload", flushPendingDocument);

    return () => {
      window.removeEventListener("pagehide", flushPendingDocument);
      window.removeEventListener("beforeunload", flushPendingDocument);
      flushPendingDocument();
    };
  }, [flushPendingDocument]);

  return {
    acceptExternalDocument,
    cancelPendingCommit,
    finishComposition,
    flushCommit,
    scheduleCommit,
    startComposition,
  };
}

export { useBufferedDocumentCommit };
