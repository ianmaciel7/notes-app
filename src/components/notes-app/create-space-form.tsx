"use client";

import { Book, Briefcase, Code, Folder } from "lucide-react";
import { type ComponentProps, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  type AllowedSpaceIcon,
  validateCreateSpaceInput,
} from "@/lib/validators/space";

export interface CreateSpaceFormProps extends ComponentProps<"div"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSpace: (name: string, icon: string) => Promise<void>;
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
  open,
  onOpenChange,
  onSubmitSpace,
  isLoading = false,
  className,
  ...props
}: CreateSpaceFormProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<AllowedSpaceIcon>("folder");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validateCreateSpaceInput({
      name,
      icon: selectedIcon,
    });

    if (!validation.success || !validation.data) {
      setError(validation.fieldErrors?.name || "Space name is required");
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
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create space");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="create-space-form"
        className={className}
        {...props}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create Space</DialogTitle>
            <DialogDescription>
              Create an isolated knowledge space for your notes and objects.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <Field>
              <FieldLabel htmlFor="space-name-input">Space Name</FieldLabel>
              <Input
                id="space-name-input"
                placeholder="e.g. Personal, Work, Research"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                data-testid="space-name-input"
                disabled={isLoading}
              />
              {error && (
                <FieldError data-testid="create-space-error">
                  {error}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Icon</FieldLabel>
              <div
                className="flex items-center gap-2 pt-1"
                data-testid="space-icon-selector"
              >
                {(["folder", "book", "briefcase", "code"] as const).map(
                  (iconKey) => {
                    const IconComp = ICON_COMPONENTS[iconKey];
                    const isSelected = selectedIcon === iconKey;
                    return (
                      <Button
                        key={iconKey}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="icon-sm"
                        onClick={() => setSelectedIcon(iconKey)}
                        disabled={isLoading}
                        aria-label={`Select ${iconKey} icon`}
                        data-testid={`icon-btn-${iconKey}`}
                      >
                        <IconComp className="size-4" />
                      </Button>
                    );
                  },
                )}
              </div>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !name.trim()}
              data-testid="submit-create-space"
            >
              {isLoading ? "Creating..." : "Create Space"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
