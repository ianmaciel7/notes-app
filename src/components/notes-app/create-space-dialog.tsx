"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type CreateSpaceDialogProps = ComponentProps<typeof Dialog> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

type CreateSpaceDialogContentProps = ComponentProps<typeof DialogContent>;

function CreateSpaceDialog({
  open,
  onOpenChange,
  children,
  ...props
}: CreateSpaceDialogProps) {
  return (
    <Dialog
      {...props}
      data-slot="create-space-dialog"
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </Dialog>
  );
}

function CreateSpaceDialogContent({
  children,
  ...props
}: CreateSpaceDialogContentProps) {
  return (
    <DialogContent
      {...props}
      data-slot="create-space-dialog-content"
      data-testid="create-space-dialog"
    >
      {children}
    </DialogContent>
  );
}

export {
  CreateSpaceDialog,
  CreateSpaceDialogContent,
  type CreateSpaceDialogContentProps,
  type CreateSpaceDialogProps,
};
