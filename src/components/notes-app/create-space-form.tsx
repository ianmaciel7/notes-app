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

type CreateSpaceFormProps = Omit<ComponentProps<"form">, "onSubmit"> & {
  onSubmitSpace: (name: string, icon: string) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

const ICON_COMPONENTS: Record<AllowedSpaceIcon, typeof Folder> = {
  folder: Folder,
  book: Book,
  briefcase: Briefcase,
  code: Code,
  archive: Folder,
  compass: Folder,
};

function CreateSpaceForm({
  onSubmitSpace,
  onCancel,
  isLoading = false,
  className,
  ...props
}: CreateSpaceFormProps) {
  const t = useTranslations("spaces");
  const { name, setName, selectedIcon, setSelectedIcon, error, setError } =
    useCreateSpaceFormState();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateCreateSpaceInput({
      name,
      icon: selectedIcon,
    });

    if (!validation.success || !validation.data) {
      const code =
        validation.fieldErrors?.name ||
        validation.fieldErrors?.description ||
        validation.fieldErrors?.icon ||
        validation.error ||
        "nameRequired";
      setError(t(`validation.${code}`));
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
    } catch {
      setError(t("failedToCreate"));
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
          <FieldLabel htmlFor="create-space-form-name-input">
            {t("spaceName")}
          </FieldLabel>
          <Input
            id="create-space-form-name-input"
            placeholder={t("spaceNamePlaceholder")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            autoFocus
            data-testid="create-space-form-name-input"
            aria-invalid={Boolean(error) || undefined}
            disabled={isLoading}
          />
          {error && (
            <FieldError data-testid="create-space-form-error">
              {error}
            </FieldError>
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
            data-testid="create-space-form-icon-selector"
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
                    data-testid={`create-space-form-icon-btn-${iconKey}`}
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
            data-testid="create-space-form-cancel"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
          data-testid="create-space-form-submit"
        >
          {isLoading && <Spinner data-icon="inline-start" />}
          {isLoading ? t("creating") : t("createSpace")}
        </Button>
      </div>
    </form>
  );
}

function useCreateSpaceFormState() {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<AllowedSpaceIcon>("folder");
  const [error, setError] = useState<string | null>(null);

  return { name, setName, selectedIcon, setSelectedIcon, error, setError };
}

export { CreateSpaceForm, type CreateSpaceFormProps, useCreateSpaceFormState };
