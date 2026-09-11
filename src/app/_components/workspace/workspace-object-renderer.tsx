"use client";

// Compatibility exports for the workspace; concrete types own their list and detail.
export { getWeblinkUrl as getWorkspaceWeblinkUrl } from "@/app/_components/objects/detail/object-detail-model";
export { EmbeddedObjectList as WorkspaceListRenderer } from "@/app/_components/objects/embedded-object-list";
export { ObjectDetailResolver as WorkspaceObjectRenderer } from "@/app/_components/objects/object-detail-resolver";
export {
  ObjectListResolver as WorkspaceObjectListRenderer,
  ObjectListResolver as WorkspaceObjectTypeListView,
} from "@/app/_components/objects/object-list-resolver";
