"use client";

import { blockEditorDocumentToPlainText } from "@/editor/document";
import { cn } from "@/lib/utils";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type ObjectViewPreviewProps = {
  readonly className?: string;
  readonly entity: WorkspaceEntity;
};

function previewLines(value: string): readonly string[] {
  return Array.from(
    new Set(
      value
        .split(/\r\n?|\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  ).slice(0, 8);
}

function DocumentPreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "document" && entity.kind !== "quote") return null;
  const lines = previewLines(blockEditorDocumentToPlainText(entity.body));
  return (
    <div data-slot="object-view-document-preview" className="grid w-full gap-5 py-12">
      {lines.map((line) => (
        <p key={line} className="line-clamp-2 text-sm leading-5">
          {line}
        </p>
      ))}
    </div>
  );
}

function TablePreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "table") return null;
  const cells = [...entity.cells]
    .sort((left, right) => left.row - right.row || left.column - right.column)
    .slice(0, 6);
  return (
    <div
      data-slot="object-view-table-preview"
      className="my-auto grid w-full max-w-[20rem] grid-cols-2 overflow-hidden rounded-lg border bg-background text-sm"
    >
      {cells.map((cell) => (
        <span
          key={cell.id}
          className="min-h-9 truncate border-b border-r px-3 py-2 even:border-r-0 [&:nth-last-child(-n+2)]:border-b-0"
        >
          {cell.value || "\u00a0"}
        </span>
      ))}
    </div>
  );
}

function TaskPreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "task") return null;
  return (
    <div
      data-slot="object-view-task-preview"
      className="my-auto flex w-full items-start gap-3 text-sm"
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded-full border",
          entity.completed && "bg-foreground",
        )}
      />
      <p className="line-clamp-6 whitespace-pre-wrap leading-6">
        {entity.body}
      </p>
    </div>
  );
}

function UrlPreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "url") return null;
  return (
    <div data-slot="object-view-url-preview" className="my-auto grid w-full gap-3">
      <p className="truncate text-sm font-medium">{entity.url}</p>
      <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {entity.body}
      </p>
    </div>
  );
}

function FilePreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "file") return null;
  return (
    <div data-slot="object-view-file-preview" className="my-auto grid w-full gap-2">
      <p className="truncate text-sm font-medium">{entity.fileName}</p>
      <p className="text-xs text-muted-foreground">{entity.mimeType}</p>
    </div>
  );
}

function QueryPreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "query") return null;
  return (
    <p
      data-slot="object-view-query-preview"
      className="my-auto w-full line-clamp-7 whitespace-pre-wrap text-sm leading-6"
    >
      {entity.description}
    </p>
  );
}

function TagPreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "tag") return null;
  return (
    <div
      data-slot="object-view-tag-preview"
      className="my-auto w-full rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
    >
      {entity.title}
    </div>
  );
}

function ObjectViewPreview({ className, entity }: ObjectViewPreviewProps) {
  return (
    <div
      data-slot="object-view-preview"
      data-object-kind={entity.kind}
      className={cn(
        "flex min-h-[14.25rem] w-full overflow-hidden rounded-lg border bg-muted/20 px-5 py-4 text-foreground",
        className,
      )}
    >
      <DocumentPreview entity={entity} />
      <TablePreview entity={entity} />
      <TaskPreview entity={entity} />
      <UrlPreview entity={entity} />
      <FilePreview entity={entity} />
      <QueryPreview entity={entity} />
      <TagPreview entity={entity} />
    </div>
  );
}

export { ObjectViewPreview };
export type { ObjectViewPreviewProps };
