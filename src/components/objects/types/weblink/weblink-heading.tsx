"use client";

import { Copy, ExternalLink } from "lucide-react";
import { readStringProperty } from "@/components/objects/detail/object-detail-model";
import { Button, buttonVariants } from "@/components/ui/button";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function WeblinkHeading({ entity, url }: { entity: SpaceEntityRecord; url: string }) {
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
          <a
            className={buttonVariants({ variant: "outline" })}
            href={url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4" aria-hidden="true" />Open
          </a>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              void navigator.clipboard?.writeText(url).catch(() => undefined);
            }}
          >
            <Copy className="size-4" aria-hidden="true" />Copy URL
          </Button>
        </div>
      </div>
      {description && (
        <p className="mt-5 max-w-2xl text-sm text-[var(--app-text-secondary)]">{description}</p>
      )}
    </>
  );
}
