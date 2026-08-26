"use client";

import Image from "next/image";
import { blockEditorDocumentToPlainText } from "@/editor/document";
import { cn } from "@/lib/utils";
import type { WorkspaceEntity } from "@/lib/workspace-objects";

type ObjectViewPreviewProps = {
  readonly className?: string;
  readonly entity: WorkspaceEntity;
};

type MediaAssetRendererProps = {
  readonly className?: string;
  readonly downloadLabel?: string;
  readonly entity: Extract<WorkspaceEntity, { kind: "file" }>;
  readonly onDownload?: () => void;
  readonly onRemove?: () => void;
  readonly removeLabel?: string;
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
    <div
      data-slot="object-view-document-preview"
      className="grid w-full gap-5 py-12"
    >
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
    <div
      data-slot="object-view-url-preview"
      className="my-auto grid w-full gap-3"
    >
      <p className="truncate text-sm font-medium">{entity.url}</p>
      <p className="line-clamp-5 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
        {entity.body}
      </p>
    </div>
  );
}

function MediaAssetPreview({
  entity,
  label,
}: {
  readonly entity: Extract<WorkspaceEntity, { kind: "file" }>;
  readonly label: string;
}) {
  if (!entity.previewUrl) {
    return (
      <p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
        Preview will be restored from local media storage when bytes are
        available.
      </p>
    );
  }

  if (entity.objectTypeId === "image") {
    return (
      <Image
        src={entity.previewUrl}
        alt={label}
        width={640}
        height={360}
        unoptimized
        className="max-h-64 w-full rounded-lg border object-contain"
      />
    );
  }

  if (entity.objectTypeId === "audio") {
    return (
      <audio controls src={entity.previewUrl} className="w-full">
        <track kind="captions" />
      </audio>
    );
  }

  if (entity.objectTypeId === "pdf") {
    return (
      <object
        data={entity.previewUrl}
        type="application/pdf"
        aria-label={label}
        className="h-72 w-full rounded-lg border bg-background"
      >
        <a className="text-sm underline" href={entity.previewUrl}>
          Open PDF
        </a>
      </object>
    );
  }

  return (
    <a
      href={entity.previewUrl}
      download={entity.fileName}
      className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
    >
      {entity.fileName}
    </a>
  );
}

function MediaAssetActions({
  downloadLabel,
  onDownload,
  onRemove,
  removeLabel,
}: Pick<
  MediaAssetRendererProps,
  "downloadLabel" | "onDownload" | "onRemove" | "removeLabel"
>) {
  if (!onDownload && !onRemove) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {onDownload && (
        <button
          type="button"
          className="h-8 rounded-md border px-3 text-sm hover:bg-muted"
          onClick={onDownload}
        >
          {downloadLabel}
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          className="h-8 rounded-md border px-3 text-sm text-destructive hover:bg-muted"
          onClick={onRemove}
        >
          {removeLabel}
        </button>
      )}
    </div>
  );
}

function MediaAssetRenderer({
  className,
  downloadLabel = "Download",
  entity,
  onDownload,
  onRemove,
  removeLabel = "Remove",
}: MediaAssetRendererProps) {
  const label = entity.title || entity.fileName;
  return (
    <div
      data-slot="media-asset-renderer"
      data-media-kind={entity.objectTypeId}
      className={cn("my-auto grid w-full gap-3", className)}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{entity.fileName}</p>
        <p className="text-xs text-muted-foreground">
          {entity.mimeType || "Unknown type"} / {entity.size} B
        </p>
      </div>
      <MediaAssetPreview entity={entity} label={label} />
      <MediaAssetActions
        downloadLabel={downloadLabel}
        onDownload={onDownload}
        onRemove={onRemove}
        removeLabel={removeLabel}
      />
    </div>
  );
}

function FilePreview({ entity }: { readonly entity: WorkspaceEntity }) {
  if (entity.kind !== "file") return null;
  return <MediaAssetRenderer entity={entity} />;
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

export { MediaAssetRenderer, ObjectViewPreview };
export type { MediaAssetRendererProps, ObjectViewPreviewProps };
