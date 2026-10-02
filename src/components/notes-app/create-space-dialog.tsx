"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { CreateSpaceForm } from "@/components/notes-app/create-space-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CreateSpaceDialogProps = ComponentProps<typeof Dialog> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, icon: string) => Promise<void>;
  isLoading: boolean;
};

function CreateSpaceDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  ...props
}: CreateSpaceDialogProps) {
  const t = useTranslations("spaces");
  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="create-space-dialog">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>{t("dialogDescription")}</DialogDescription>
        </DialogHeader>
        <CreateSpaceForm
          onSubmitSpace={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}

export { CreateSpaceDialog, type CreateSpaceDialogProps };
