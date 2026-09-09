"use client";

import { Copy, ExternalLink } from "lucide-react";

import { PendingImplementation } from "@/components/pending-implementation";
import { Button, buttonVariants } from "@/components/ui/button";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

type WorkspaceObjectTypeListInfo = Pick<
  SpaceObjectTypeRecord,
  "id" | "pluralName" | "singularName"
>;

type WorkspaceObjectRendererProps = {
  entity: SpaceEntityRecord;
  objectType?: SpaceObjectTypeRecord;
  tabName: string;
};

type WorkspaceObjectListRendererProps = {
  entities: readonly SpaceEntityRecord[];
  objectType: WorkspaceObjectTypeListInfo;
  tabName: string;
};

function readStringProperty(entity: SpaceEntityRecord, keys: string[]) {
  for (const key of keys) {
    const value = entity.properties[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizeUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    return new URL(value).href.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

export function getWorkspaceWeblinkUrl(entity: SpaceEntityRecord) {
  const propertyUrl = readStringProperty(entity, ["url", "URL", "href", "sourceUrl"]);
  return normalizeUrl(propertyUrl);
}

function getObjectTypeName(entity: SpaceEntityRecord, objectType?: SpaceObjectTypeRecord) {
  const name = objectType?.singularName ?? entity.objectTypeId.replace(/[-_]/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function PendingObjectRenderer({ entity, objectType, tabName }: WorkspaceObjectRendererProps) {
  const objectTypeName = getObjectTypeName(entity, objectType);

  return (
    <PendingImplementation
      area={objectTypeName}
      description={`${tabName} should be implemented here.`}
      name={`${objectTypeName} object`}
      variant="workspace"
    />
  );
}

export function WorkspaceObjectListRenderer({
  entities: _entities,
  objectType,
  tabName,
}: WorkspaceObjectListRendererProps) {
  const listName = objectType.pluralName || tabName;

  return (
    <PendingImplementation
      area="Object type list"
      description={`${listName} list view should be implemented here.`}
      name={`${listName} list`}
      variant="workspace"
    />
  );
}

function WorkspaceWeblinkObject({ entity }: { entity: SpaceEntityRecord }) {
  const url = getWorkspaceWeblinkUrl(entity);
  const description = readStringProperty(entity, ["description", "Description", "summary"]);

  if (!url) {
    return (
      <PendingImplementation
        area="Weblink"
        description="Add a URL property to render this saved link."
        name="Weblink URL"
        variant="workspace"
      />
    );
  }

  return (
    <article className="flex h-full min-h-0 w-full flex-col overflow-auto bg-card">
      <div className="border-b border-border px-8 py-7">
        <p className="text-xs font-medium uppercase text-muted-foreground">Weblink</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-3xl font-semibold text-foreground">{entity.title}</h1>
            <a
              className="mt-2 block truncate text-sm text-primary hover:underline"
              href={url}
              rel="noreferrer"
              target="_blank"
            >
              {url}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              className={buttonVariants({ variant: "outline" })}
              href={url}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="size-4" />
              Open
            </a>
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard?.writeText(url);
              }}
            >
              <Copy className="size-4" />
              Copy URL
            </Button>
          </div>
        </div>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 px-8 py-7">
        <PendingImplementation
          area="Weblink notes"
          className="min-h-64"
          description="Notes, saved article content, summary, keywords, category, and topic should be implemented here."
          name="Weblink reader"
        />
      </div>
    </article>
  );
}

export function WorkspaceObjectRenderer(props: WorkspaceObjectRendererProps) {
  if (props.entity.objectTypeId === "weblink" || props.entity.type === "weblink") {
    return <WorkspaceWeblinkObject entity={props.entity} />;
  }

  return <PendingObjectRenderer {...props} />;
}
