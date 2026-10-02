"use client";

import { Folder, Plus } from "lucide-react";
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

type SpacesEmptyProps = ComponentProps<"div"> & {
  onCreate: () => void;
  t: (key: string) => string;
};

function SpacesEmpty({ onCreate, t, className, ...props }: SpacesEmptyProps) {
  return (
    <div
      data-testid="spaces-empty"
      className={cn("flex flex-1 items-center justify-center p-8", className)}
      {...props}
    >
      <Empty className="max-w-sm border border-dashed p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Folder />
          </EmptyMedia>
          <EmptyTitle>{t("emptyTitle")}</EmptyTitle>
          <EmptyDescription>{t("emptyDescription")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            size="sm"
            onClick={onCreate}
            data-testid="spaces-empty-create-btn"
          >
            <Plus data-icon="inline-start" />
            {t("createFirstSpace")}
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export { SpacesEmpty, type SpacesEmptyProps };
