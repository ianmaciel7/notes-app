"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ConfirmAlertDialogProps extends Omit<React.ComponentProps<typeof AlertDialog>, "children" | "onOpenChange"> {
  title: string;
  description: string;
  confirmLabel: string;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmAlertDialog({
  open,
  title,
  description,
  confirmLabel,
  onOpenChange,
  onConfirm,
  ...props
}: ConfirmAlertDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setError("");
    onOpenChange?.(nextOpen);
  }

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      await onConfirm();
      handleOpenChange(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível concluir esta ação.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange} {...props}>
      <AlertDialogContent className="sm:max-w-md p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-xs text-destructive font-medium m-0" role="alert">{error}</p> : null}
        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={submitting} onClick={handleConfirm}>
            {submitting ? "Aguarde..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
