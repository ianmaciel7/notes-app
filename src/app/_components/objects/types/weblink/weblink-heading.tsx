"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ObjectActions } from "@/app/_components/objects/detail/object-actions";
import { readStringProperty } from "@/app/_components/objects/detail/object-detail-model";
import { Button, buttonVariants } from "@/components/ui/button";
import { copyWorkspaceText } from "@/lib/spaces/object-transfer";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function WeblinkHeading({ entity, url }: { entity: SpaceEntityRecord; url: string }) {
  const [copyError, setCopyError] = useState<string | null>(null);
  const description = readStringProperty(entity, ["description", "Description", "summary"]);
  return (
    <>
      <p className="text-xs font-medium uppercase text-[var(--app-text-secondary)]">Weblink</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-semibold text-[var(--app-text-primary)]">
            {entity.title}
          </h1>
          <a
            className="mt-2 block truncate text-sm text-primary hover:underline"
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {url}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ObjectActions entity={entity} />
          <a
            className={buttonVariants({ variant: "outline" })}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Open
          </a>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setCopyError(null);
              void copyWorkspaceText(url).catch((error: unknown) =>
                setCopyError(error instanceof Error ? error.message : String(error)),
              );
            }}
          >
            <Copy className="size-4" aria-hidden="true" />
            Copy URL
          </Button>
        </div>
      </div>
      {copyError && (
        <p role="alert" className="text-sm text-destructive">
          {copyError}
        </p>
      )}
      {description && (
        <p className="mt-5 max-w-2xl text-sm text-[var(--app-text-secondary)]">{description}</p>
      )}
    </>
  );
}
