import { ObjectBlocks } from "@/app/_components/objects/detail/object-blocks";
import {
  getReadableProperties,
  getWeblinkUrl,
  hasObjectBody,
} from "@/app/_components/objects/detail/object-detail-model";
import { ObjectHeading } from "@/app/_components/objects/detail/object-heading";
import { ObjectPropertyValues } from "@/app/_components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/app/_components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/app/_components/objects/object-view-types";
import { WeblinkHeading } from "@/app/_components/objects/types/weblink/weblink-heading";
import { WorkspaceEmptyState } from "@/app/_components/workspace/space-surface";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

const hiddenKeys = ["url", "href", "sourceUrl"];

function WeblinkNotes({ entity }: { entity: SpaceEntityRecord }) {
  const hasBody = hasObjectBody(entity);
  const hasProperties = getReadableProperties(entity, hiddenKeys).length > 0;
  if (!hasBody && !hasProperties) {
    return (
      <WorkspaceEmptyState
        className="border-[var(--app-border-el)] bg-[var(--app-bg-front)]"
        title="Sem notas"
        description="Este link ainda não tem blocos ou propriedades extras salvas."
      />
    );
  }
  return (
    <div className="space-y-5 text-sm leading-6">
      {hasBody && <ObjectBlocks entity={entity} />}
      <ObjectPropertyValues entity={entity} hiddenKeys={hiddenKeys} />
    </div>
  );
}

export function WeblinkDetail({ entity }: ObjectTypeDetailProps) {
  const url = getWeblinkUrl(entity);
  if (!url) {
    return (
      <ObjectDetail data-object-view="weblink-detail">
        <ObjectDetailHeader>
          <ObjectHeading entity={entity} tabName={entity.title} />
        </ObjectDetailHeader>
        <ObjectDetailContent>
          <WorkspaceEmptyState
            title="Link sem URL"
            description="Use Editar objeto para salvar uma URL HTTP ou HTTPS."
          />
        </ObjectDetailContent>
      </ObjectDetail>
    );
  }
  return (
    <ObjectDetail data-object-view="weblink-detail">
      <ObjectDetailHeader>
        <WeblinkHeading entity={entity} url={url} />
      </ObjectDetailHeader>
      <ObjectDetailContent>
        <WeblinkNotes entity={entity} />
      </ObjectDetailContent>
    </ObjectDetail>
  );
}
