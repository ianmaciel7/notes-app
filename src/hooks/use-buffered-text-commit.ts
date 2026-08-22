"use client";

import * as React from "react";

type BufferedTextCommitOptions<TValue> = {
  value: TValue;
  onCommit: (value: TValue) => void;
  delay?: number;
  format?: (value: TValue) => string;
  parse?: (draft: string) => TValue;
};

type BufferedTextInputProps = {
  value: string;
  onBlur: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onCompositionEnd: () => void;
  onCompositionStart: () => void;
  onFocus: () => void;
};

function defaultFormat<TValue>(value: TValue) {
  return typeof value === "string" ? value : String(value ?? "");
}

function defaultParse<TValue>(draft: string) {
  return draft as TValue;
}

function useBufferedTextCommit<TValue>({
  value,
  onCommit,
  delay = 250,
  format = defaultFormat,
  parse = defaultParse,
}: BufferedTextCommitOptions<TValue>) {
  const formattedValue = format(value);
  const [draft, setDraftState] = React.useState(formattedValue);
  const [isDirty, setIsDirty] = React.useState(false);
  const commitRef = React.useRef(onCommit);
  const delayRef = React.useRef(delay);
  const draftRef = React.useRef(draft);
  const editingRef = React.useRef(false);
  const formattedValueRef = React.useRef(formattedValue);
  const isComposingRef = React.useRef(false);
  const parseRef = React.useRef(parse);
  const pendingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    commitRef.current = onCommit;
    delayRef.current = delay;
    parseRef.current = parse;
  }, [delay, onCommit, parse]);

  React.useEffect(() => {
    formattedValueRef.current = formattedValue;
    if (editingRef.current || draftRef.current === formattedValue) return;
    draftRef.current = formattedValue;
    setDraftState(formattedValue);
    setIsDirty(false);
  }, [formattedValue]);

  const clearPendingCommit = React.useCallback(() => {
    if (!pendingTimerRef.current) return;
    clearTimeout(pendingTimerRef.current);
    pendingTimerRef.current = null;
  }, []);

  const commitText = React.useCallback(
    (text: string) => {
      clearPendingCommit();
      if (text === formattedValueRef.current) {
        setIsDirty(false);
        return;
      }
      commitRef.current(parseRef.current(text));
      formattedValueRef.current = text;
      setIsDirty(false);
    },
    [clearPendingCommit],
  );

  const scheduleCommit = React.useCallback(
    (text: string) => {
      clearPendingCommit();
      if (isComposingRef.current) return;
      if (text === formattedValueRef.current) {
        setIsDirty(false);
        return;
      }
      setIsDirty(true);
      pendingTimerRef.current = setTimeout(() => {
        pendingTimerRef.current = null;
        commitText(text);
      }, delayRef.current);
    },
    [clearPendingCommit, commitText],
  );

  const setDraft = React.useCallback(
    (nextDraft: string) => {
      editingRef.current = true;
      draftRef.current = nextDraft;
      setDraftState(nextDraft);
      scheduleCommit(nextDraft);
    },
    [scheduleCommit],
  );

  const commitNow = React.useCallback(() => {
    commitText(draftRef.current);
  }, [commitText]);

  React.useEffect(
    () => () => {
      clearPendingCommit();
      if (draftRef.current !== formattedValueRef.current) {
        commitRef.current(parseRef.current(draftRef.current));
      }
    },
    [clearPendingCommit],
  );

  const inputProps = React.useMemo<BufferedTextInputProps>(
    () => ({
      value: draft,
      onBlur: () => {
        editingRef.current = false;
        commitNow();
      },
      onChange: (event) => setDraft(event.target.value),
      onCompositionEnd: () => {
        isComposingRef.current = false;
        scheduleCommit(draftRef.current);
      },
      onCompositionStart: () => {
        isComposingRef.current = true;
        clearPendingCommit();
      },
      onFocus: () => {
        editingRef.current = true;
      },
    }),
    [clearPendingCommit, commitNow, draft, scheduleCommit, setDraft],
  );

  return {
    draft,
    setDraft,
    inputProps,
    commitNow,
    isDirty,
  };
}

export { useBufferedTextCommit };
