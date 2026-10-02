"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
import { LanguageSelect } from "@/components/notes-app/language-select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

type SettingsFieldGroupProps = ComponentProps<typeof FieldGroup>;

function SettingsFieldGroup({ ...props }: SettingsFieldGroupProps) {
  const t = useTranslations("settings");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <FieldGroup {...props} data-slot="settings-field-group">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="settings-field-group-theme-switch">
            {t("darkMode")}
          </FieldLabel>
          <FieldDescription>{t("darkModeDescription")}</FieldDescription>
        </FieldContent>
        <Switch
          id="settings-field-group-theme-switch"
          checked={resolvedTheme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </Field>
      <Field>
        <FieldLabel>{t("language")}</FieldLabel>
        <LanguageSelect />
      </Field>
    </FieldGroup>
  );
}

export { SettingsFieldGroup, type SettingsFieldGroupProps };
