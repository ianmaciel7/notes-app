"use client";

import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type SpacesNotFoundStatusProps = ComponentProps<"div"> & {
  onBack: () => void;
};

function SpacesNotFoundStatus({
  onBack,
  className,
  ...props
}: SpacesNotFoundStatusProps) {
  const t = useTranslations("spaces");

  return (
    <Empty
      data-slot="spaces-not-found-status"
      {...props}
      data-testid="spaces-not-found-status"
      className={cn("flex flex-1 items-center justify-center p-8", className)}
    >
      <Empty className="max-w-sm border border-dashed p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle>{t("spaceNotFoundTitle")}</EmptyTitle>
          <EmptyDescription>{t("spaceNotFoundDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            data-testid="spaces-not-found-status-back-btn"
          >
            {t("backToSpaces")}
          </Button>
        </EmptyContent>
      </Empty>
    </Empty>
  );
}

export { SpacesNotFoundStatus, type SpacesNotFoundStatusProps };
