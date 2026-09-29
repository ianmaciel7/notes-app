"use client";

import { Book, Briefcase, Code, Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ComponentProps, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  type AllowedSpaceIcon,
  validateCreateSpaceInput,
} from "@/lib/validators/space";

export interface CreateSpaceFormProps
  extends Omit<ComponentProps<"form">, "onSubmit"> {
  onSubmitSpace: (name: string, icon: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ICON_COMPONENTS: Record<AllowedSpaceIcon, typeof Folder> = {
  folder: Folder,
  book: Book,
  briefcase: Briefcase,
  code: Code,
  archive: Folder,
  compass: Folder,
};

export function CreateSpaceForm({
  onSubmitSpace,
  onCancel,
  isLoading = false,
  className,
  ...props
}: CreateSpaceFormProps) {
  const t = useTranslations("spaces");
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<AllowedSpaceIcon>("folder");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateCreateSpaceInput({
      name,
      icon: selectedIcon,
    });

    if (!validation.success || !validation.data) {
      setError(validation.fieldErrors?.name || t("nameRequired"));
      return;
    }

    try {
      setError(null);
      await onSubmitSpace(
        validation.data.name,
        validation.data.icon || "folder",
      );
      setName("");
      setSelectedIcon("folder");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("failedToCreate"));
    }
  };

  return (
    <form
      data-testid="create-space-form"
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <FieldGroup>
        <Field data-invalid={Boolean(error) || undefined}>
          <FieldLabel htmlFor="space-name-input">{t("spaceName")}</FieldLabel>
          <Input
            id="space-name-input"
            placeholder={t("spaceNamePlaceholder")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
            data-testid="space-name-input"
            aria-invalid={Boolean(error) || undefined}
            disabled={isLoading}
          />
          {error && (
            <FieldError data-testid="create-space-error">{error}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel>{t("icon")}</FieldLabel>
          <ToggleGroup
            value={[selectedIcon]}
            onValueChange={(val) => {
              if (val.length > 0) {
                setSelectedIcon(val[0] as AllowedSpaceIcon);
              }
            }}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2 pt-1"
            data-testid="space-icon-selector"
          >
            {(["folder", "book", "briefcase", "code"] as const).map(
              (iconKey) => {
                const IconComp = ICON_COMPONENTS[iconKey];
                return (
                  <ToggleGroupItem
                    key={iconKey}
                    value={iconKey}
                    size="sm"
                    aria-label={t("selectIconAria", { icon: iconKey })}
                    data-testid={`icon-btn-${iconKey}`}
                  >
                    <IconComp />
                  </ToggleGroupItem>
                );
              },
            )}
          </ToggleGroup>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="cancel-create-space"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
          data-testid="submit-create-space"
        >
          {isLoading && <Spinner data-icon="inline-start" />}
          {isLoading ? t("creating") : t("createSpace")}
        </Button>
      </div>
    </form>
  );
}
