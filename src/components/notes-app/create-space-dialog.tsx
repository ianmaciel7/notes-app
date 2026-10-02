"use client";

import type { ComponentProps, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type CreateSpaceDialogProps = Omit<
  ComponentProps<typeof DialogContent>,
  "children"
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

function CreateSpaceDialog({
  open,
  onOpenChange,
  children,
  ...props
}: CreateSpaceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        {...props}
        data-slot="create-space-dialog"
        data-testid="create-space-dialog"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

export { CreateSpaceDialog, type CreateSpaceDialogProps };
