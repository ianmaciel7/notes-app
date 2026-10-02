"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type SettingsDialogProps = Omit<
  ComponentProps<typeof DialogContent>,
  "children"
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

function SettingsDialog({
  open,
  onOpenChange,
  children,
  ...props
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...props}
        data-slot="settings-dialog"
        data-testid="settings-dialog"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { SettingsDialog, type SettingsDialogProps };
