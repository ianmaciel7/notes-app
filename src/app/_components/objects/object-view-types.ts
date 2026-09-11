import type { WorkspaceObjectDataViewType } from "@/app/_components/workspace/workspace-object-data-view";
import type { SpaceEntityRecord, SpaceObjectTypeRecord } from "@/lib/spaces/space-types";

export type ObjectTypeListProps = {
  collectionNamesById?: Readonly<Record<string, string>>;
  entities: readonly SpaceEntityRecord[];
  objectType: WorkspaceObjectDataViewType;
  tabName: string;
  onCreateEntity?: () => void;
  onOpenEntity?: (entity: SpaceEntityRecord) => void;
};

export type ObjectTypeDetailProps = {
  entity: SpaceEntityRecord;
  objectType?: SpaceObjectTypeRecord;
  tabName: string;
};
