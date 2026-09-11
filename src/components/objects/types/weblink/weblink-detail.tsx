import { ObjectBlocks } from "@/components/objects/detail/object-blocks";
import {
  getReadableProperties,
  getWeblinkUrl,
  hasObjectBody,
} from "@/components/objects/detail/object-detail-model";
import { ObjectPropertyValues } from "@/components/objects/detail/object-properties";
import {
  ObjectDetail,
  ObjectDetailContent,
  ObjectDetailHeader,
} from "@/components/objects/object-detail";
import type { ObjectTypeDetailProps } from "@/components/objects/object-view-types";
import { WeblinkHeading } from "@/components/objects/types/weblink/weblink-heading";
import { PendingImplementation } from "@/components/pending-implementation";
import { WorkspaceEmptyState } from "@/components/space-surface";
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
      <PendingImplementation
        area="Weblink"
        description="Add a URL property to render this saved link."
        name="Weblink URL"
        variant="workspace"
      />
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
