export type SystemEntityType =
  | "page"
  | "file"
  | "highlight"
  | "flashcard"
  | "study_goal"
  | "tag"
  | (string & {});

export type ContentBlock = {
  id: string;
  type:
    | "paragraph"
    | "heading_1"
    | "heading_2"
    | "heading_3"
    | "bullet_list"
    | "numbered_list"
    | "code"
    | "callout"
    | "quote"
    | "divider";
  content: string;
  annotations?: Record<string, boolean | string>;
  metadata?: Record<string, unknown>;
};

export type EntityRelation = {
  propertyId: string;
  propertyName: string;
  targetEntityId: string;
  targetEntityType: string;
  createdAt: string;
};

export type BaseEntity = {
  id: string;
  type: SystemEntityType;
  title: string;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  coverImage?: string;
  blocks: ContentBlock[];
  tags: string[];
  relations: EntityRelation[];
  properties: Record<string, unknown>;
  _syncStatus?: "synced" | "pending" | "conflict";
};
