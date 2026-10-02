"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { LanguageSelect } from "@/components/notes-app/language-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

type SettingsDialogProps = ComponentProps<typeof Dialog> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

type SettingsDialogContentProps = ComponentProps<typeof DialogContent>;
type SettingsDialogFooterProps = ComponentProps<typeof DialogFooter> & {
  onDone: () => void;
};

function SettingsDialog({
  open,
  onOpenChange,
  children,
  ...props
}: SettingsDialogProps) {
  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

function SettingsDialogContent({
  children,
  ...props
}: SettingsDialogContentProps) {
  return (
    <DialogContent {...props} data-testid="settings-dialog">
      {children}
    </DialogContent>
  );
}

function SettingsDialogHeader() {
  const settingsT = useTranslations("settings");

  return (
    <DialogHeader>
      <DialogTitle>{settingsT("settings")}</DialogTitle>
      <DialogDescription>{settingsT("settingsDescription")}</DialogDescription>
    </DialogHeader>
  );
}

function SettingsDialogFields() {
  const settingsT = useTranslations("settings");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="theme-switch">
            {settingsT("darkMode")}
          </FieldLabel>
          <FieldDescription>
            {settingsT("darkModeDescription")}
          </FieldDescription>
        </FieldContent>
        <Switch
          id="theme-switch"
          checked={resolvedTheme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </Field>
      <Field>
        <FieldLabel>{settingsT("language")}</FieldLabel>
        <LanguageSelect />
      </Field>
    </FieldGroup>
  );
}

function SettingsDialogFooter({ onDone, ...props }: SettingsDialogFooterProps) {
  const t = useTranslations("spaces");

  return (
    <DialogFooter {...props}>
      <Button onClick={onDone}>{t("done")}</Button>
    </DialogFooter>
  );
}

export {
  SettingsDialog,
  SettingsDialogContent,
  SettingsDialogFields,
  SettingsDialogFooter,
  SettingsDialogHeader,
  type SettingsDialogContentProps,
  type SettingsDialogFooterProps,
  type SettingsDialogProps,
};
