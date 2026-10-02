"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type SettingsDialogProps = ComponentProps<typeof Dialog> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

type SettingsDialogContentProps = ComponentProps<typeof DialogContent>;

function SettingsDialog({
  open,
  onOpenChange,
  children,
  ...props
}: SettingsDialogProps) {
  return (
    <Dialog
      {...props}
      data-slot="settings-dialog"
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </Dialog>
  );
}

function SettingsDialogContent({
  children,
  ...props
}: SettingsDialogContentProps) {
  return (
    <DialogContent
      {...props}
      data-slot="settings-dialog-content"
      data-testid="settings-dialog"
    >
      {children}
    </DialogContent>
  );
}

export {
  SettingsDialog,
  SettingsDialogContent,
  type SettingsDialogContentProps,
  type SettingsDialogProps,
};
