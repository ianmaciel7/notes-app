"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
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
};

function SettingsDialog({ open, onOpenChange, ...props }: SettingsDialogProps) {
  const t = useTranslations("spaces");
  const settingsT = useTranslations("settings");
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Dialog {...props} open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="settings-dialog">
        <DialogHeader>
          <DialogTitle>{settingsT("settings")}</DialogTitle>
          <DialogDescription>
            {settingsT("settingsDescription")}
          </DialogDescription>
        </DialogHeader>
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
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
          </Field>
          <Field>
            <FieldLabel>{settingsT("language")}</FieldLabel>
            <LanguageSelect />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t("done")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { SettingsDialog, type SettingsDialogProps };
