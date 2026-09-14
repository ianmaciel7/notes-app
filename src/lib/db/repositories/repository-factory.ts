import type { KnowledgeDatabase } from "../schema";
import { CollectionRepository } from "./collection-repository";
import { EntityRepository } from "./entity-repository";
import { RelationRepository } from "./relation-repository";
import { SpaceRepository } from "./space-repository";
import { SyncMutationRepository } from "./sync-mutation-repository";
import { TagRepository } from "./tag-repository";
import { TrashRepository } from "./trash-repository";

export {
  CollectionRepository,
  EntityRepository,
  RelationRepository,
  SpaceRepository,
  SyncMutationRepository,
  TagRepository,
  TrashRepository,
};

export interface Repositories {
  spaces: SpaceRepository;
  entities: EntityRepository;
  collections: CollectionRepository;
  tags: TagRepository;
  relations: RelationRepository;
  trash: TrashRepository;
  syncMutations: SyncMutationRepository;
}

export function createRepositories(db: KnowledgeDatabase): Repositories {
  return {
    spaces: new SpaceRepository(db),
    entities: new EntityRepository(db),
    collections: new CollectionRepository(db),
    tags: new TagRepository(db),
    relations: new RelationRepository(db),
    trash: new TrashRepository(db),
    syncMutations: new SyncMutationRepository(db),
  };
}
