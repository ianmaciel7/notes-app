"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
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
  children: ReactNode;
};

type CreateSpaceDialogContentProps = ComponentProps<typeof DialogContent>;
type CreateSpaceDialogHeaderProps = ComponentProps<typeof DialogHeader>;

type CreateSpaceDialogFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (name: string, icon: string) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
};

function CreateSpaceDialog({
  open,
  onOpenChange,
  children,
  ...props
}: CreateSpaceDialogProps) {
  return (
    <Dialog
      data-slot="create-space-dialog"
      {...props}
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
      data-slot="create-space-dialog-content"
      {...props}
      data-testid="create-space-dialog"
    >
      {children}
    </DialogContent>
  );
}

function CreateSpaceDialogHeader({ ...props }: CreateSpaceDialogHeaderProps) {
  const t = useTranslations("spaces");

  return (
    <DialogHeader data-slot="create-space-dialog-header" {...props}>
      <DialogTitle>{t("dialogTitle")}</DialogTitle>
      <DialogDescription>{t("dialogDescription")}</DialogDescription>
    </DialogHeader>
  );
}

function CreateSpaceDialogForm({
  onSubmit,
  isLoading,
  onCancel,
  ...props
}: CreateSpaceDialogFormProps) {
  return (
    <CreateSpaceForm
      data-slot="create-space-dialog-form"
      {...props}
      onSubmitSpace={onSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}

export {
  CreateSpaceDialog,
  CreateSpaceDialogContent,
  CreateSpaceDialogForm,
  CreateSpaceDialogHeader,
  type CreateSpaceDialogFormProps,
  type CreateSpaceDialogContentProps,
  type CreateSpaceDialogHeaderProps,
  type CreateSpaceDialogProps,
};
