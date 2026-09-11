import { hasObjectBody } from "@/components/objects/detail/object-detail-model";
import { WorkspaceEmptyState } from "@/components/space-surface";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { cn } from "@/lib/utils";

type Block = SpaceEntityRecord["blocks"][number];

function ObjectBlock({ block }: { block: Block }) {
  const content = block.content.trim();
  if (block.type === "divider") return <hr className="my-5 border-[var(--app-border-el)]" />;
  if (!content) return null;
  switch (block.type) {
    case "heading_1":
      return (
        <h2 className="mt-6 text-2xl font-semibold text-[var(--app-text-primary)]">
          {content}
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-5 text-xl font-semibold text-[var(--app-text-primary)]">{content}</h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-4 text-base font-semibold text-[var(--app-text-primary)]">{content}</h4>
      );
    case "quote":
    case "callout":
      return (
        <blockquote
          className={cn(
            "rounded-lg border-l-2 border-[var(--app-border-front)] bg-[var(--app-bg-el)]",
            "px-4 py-3 text-[var(--app-text-secondary)]",
          )}
        >
          {content}
        </blockquote>
      );
    case "code":
      return (
        <pre
          className={cn(
            "overflow-x-auto rounded-lg bg-[var(--app-bg-el)] p-3",
            "text-sm text-[var(--app-text-primary)]",
          )}
        >
          <code>{content}</code>
        </pre>
      );
    case "bullet_list":
    case "numbered_list":
      return (
        <p className="pl-4 text-[var(--app-text-primary)]">
          {block.type === "bullet_list" ? "• " : "1. "}
          {content}
        </p>
      );
    default:
      return <p className="text-[var(--app-text-primary)]">{content}</p>;
  }
}

export function ObjectBlocks({ entity }: { entity: SpaceEntityRecord }) {
  return (
    <div data-slot="object-blocks" className="space-y-3 text-sm leading-6">
      {entity.blocks.map((block) => (
        <ObjectBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

export function ObjectBody({ entity }: { entity: SpaceEntityRecord }) {
  if (hasObjectBody(entity)) return <ObjectBlocks entity={entity} />;
  return (
    <WorkspaceEmptyState
      className="border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
      title="Sem conteúdo"
      description="Este objeto ainda não tem blocos salvos."
    />
  );
}
