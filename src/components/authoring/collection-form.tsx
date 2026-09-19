"use client";

import {
  AlertCircleIcon,
  ArchiveIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  FolderIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ObjectLifecycle, SpaceObjectType } from "@/domain/objects/object";
import {
  archiveCollectionAction,
  createCollectionAction,
  updateCollectionMembersAction,
} from "@/lib/actions/collection-actions";

export interface CollectionItem {
  id: string;
  title: string;
  lifecycle: ObjectLifecycle;
  memberIds: string[];
  updatedAt: string;
}

export interface AvailableObject {
  id: string;
  title: string;
  type: SpaceObjectType;
  lifecycle: ObjectLifecycle;
}

export interface CollectionFormProps {
  spaceId: string;
  initialCollections: CollectionItem[];
  availableObjects: AvailableObject[];
}

export function CollectionForm({
  spaceId,
  initialCollections,
  availableObjects,
}: CollectionFormProps) {
  const [collections, setCollections] =
    React.useState<CollectionItem[]>(initialCollections);
  const [selectedCollectionId, setSelectedCollectionId] = React.useState<
    string | null
  >(initialCollections[0]?.id ?? null);

  const [newTitle, setNewTitle] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [isSavingMembers, setIsSavingMembers] = React.useState(false);
  const [isArchiving, setIsArchiving] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [memberMessage, setMemberMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selectedCollection =
    collections.find((c) => c.id === selectedCollectionId) ?? null;

  const objectsById = React.useMemo(() => {
    const map = new Map<string, AvailableObject>();
    for (const obj of availableObjects) {
      map.set(obj.id, obj);
    }
    return map;
  }, [availableObjects]);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) {
      setCreateError("Collection title is required.");
      return;
    }
    setCreateError(null);
    setIsCreating(true);

    try {
      const res = await createCollectionAction({
        spaceId,
        title: trimmed,
      });

      if (res.ok) {
        const newItem: CollectionItem = {
          id: res.data.id,
          title: res.data.title,
          lifecycle: res.data.lifecycle,
          memberIds: [],
          updatedAt: res.data.updatedAt,
        };
        setCollections((prev) => [newItem, ...prev]);
        setSelectedCollectionId(newItem.id);
        setNewTitle("");
      } else {
        setCreateError(`Failed to create collection: ${res.error.code}`);
      }
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create collection.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddMember = (objectId: string) => {
    if (!selectedCollectionId) return;
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === selectedCollectionId) {
          if (c.memberIds.includes(objectId)) return c;
          return { ...c, memberIds: [...c.memberIds, objectId] };
        }
        return c;
      }),
    );
  };

  const handleRemoveMember = (objectId: string) => {
    if (!selectedCollectionId) return;
    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === selectedCollectionId) {
          return {
            ...c,
            memberIds: c.memberIds.filter((id) => id !== objectId),
          };
        }
        return c;
      }),
    );
  };

  const handleMoveMember = (index: number, direction: "up" | "down") => {
    if (!selectedCollectionId || !selectedCollection) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedCollection.memberIds.length) {
      return;
    }

    const nextMemberIds = [...selectedCollection.memberIds];
    const temp = nextMemberIds[index];
    nextMemberIds[index] = nextMemberIds[targetIndex];
    nextMemberIds[targetIndex] = temp;

    setCollections((prev) =>
      prev.map((c) => {
        if (c.id === selectedCollectionId) {
          return { ...c, memberIds: nextMemberIds };
        }
        return c;
      }),
    );
  };

  const handleSaveMembers = async () => {
    if (!selectedCollectionId || !selectedCollection) return;
    setIsSavingMembers(true);
    setMemberMessage(null);

    try {
      const res = await updateCollectionMembersAction({
        spaceId,
        collectionId: selectedCollectionId,
        memberObjectIds: selectedCollection.memberIds,
      });

      if (res.ok) {
        setMemberMessage({
          type: "success",
          text: "Collection members updated successfully.",
        });
      } else {
        setMemberMessage({
          type: "error",
          text: `Failed to update members: ${res.error.code}`,
        });
      }
    } catch (err) {
      setMemberMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update members.",
      });
    } finally {
      setIsSavingMembers(false);
    }
  };

  const handleArchiveCollection = async (collectionId: string) => {
    setIsArchiving(true);
    try {
      const res = await archiveCollectionAction({
        spaceId,
        collectionId,
      });

      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) =>
            c.id === collectionId ? { ...c, lifecycle: "archived" } : c,
          ),
        );
      }
    } catch {
      // ignore
    } finally {
      setIsArchiving(false);
    }
  };

  // Available objects not in the selected collection
  const unassignedObjects = React.useMemo(() => {
    if (!selectedCollection) return [];
    return availableObjects.filter(
      (obj) => !selectedCollection.memberIds.includes(obj.id),
    );
  }, [availableObjects, selectedCollection]);

  return (
    <div className="space-y-6">
      {/* Create New Collection Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Collection</CardTitle>
          <CardDescription>
            Group questions, exams, and notes into structured study collections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateCollection}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="collection-title">Collection Title</Label>
              <Input
                id="collection-title"
                placeholder="e.g. Unit 1: Foundations"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                aria-invalid={!!createError}
              />
            </div>
            <Button
              type="submit"
              disabled={isCreating}
              className="gap-1.5 sm:w-auto"
            >
              <PlusIcon className="size-4" aria-hidden="true" />
              <span>{isCreating ? "Creating..." : "Create Collection"}</span>
            </Button>
          </form>
          {createError && (
            <p
              role="alert"
              className="mt-2 text-sm font-medium text-destructive"
            >
              {createError}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Collections layout: Left list, Right editor */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Collections List */}
        <div className="space-y-3 md:col-span-1">
          <h2 className="text-base font-semibold text-foreground">
            Collections ({collections.length})
          </h2>
          {collections.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No collections created yet.
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((col) => {
                const isSelected = col.id === selectedCollectionId;
                return (
                  <button
                    type="button"
                    key={col.id}
                    className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border hover:bg-muted/40"
                    }`}
                    onClick={() => setSelectedCollectionId(col.id)}
                    aria-label={`Select collection ${col.title}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FolderIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="truncate">
                        <p className="truncate text-sm font-medium text-foreground">
                          {col.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {col.memberIds.length} object
                          {col.memberIds.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        col.lifecycle === "published"
                          ? "default"
                          : col.lifecycle === "archived"
                            ? "outline"
                            : "secondary"
                      }
                      className="text-xs capitalize"
                    >
                      {col.lifecycle}
                    </Badge>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Collection Member Organizer */}
        <div className="md:col-span-2">
          {selectedCollection ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                <div>
                  <CardTitle className="text-lg">
                    {selectedCollection.title}
                  </CardTitle>
                  <CardDescription>
                    Organize and order objects in this collection.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      selectedCollection.lifecycle === "published"
                        ? "default"
                        : selectedCollection.lifecycle === "archived"
                          ? "outline"
                          : "secondary"
                    }
                    className="capitalize"
                  >
                    {selectedCollection.lifecycle}
                  </Badge>
                  {selectedCollection.lifecycle !== "archived" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleArchiveCollection(selectedCollection.id)
                      }
                      disabled={isArchiving}
                      className="text-muted-foreground hover:text-destructive gap-1"
                    >
                      <ArchiveIcon className="size-3.5" aria-hidden="true" />
                      <span>Archive</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {memberMessage && (
                  <output
                    className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                      memberMessage.type === "success"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {memberMessage.type === "success" ? (
                      <CheckIcon
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <AlertCircleIcon
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span>{memberMessage.text}</span>
                  </output>
                )}

                {/* Member Objects in this collection */}
                <div className="space-y-3">
                  <Label>
                    Collection Members ({selectedCollection.memberIds.length})
                  </Label>
                  {selectedCollection.memberIds.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      No objects in this collection yet. Add items below.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCollection.memberIds.map((objectId, index) => {
                        const obj = objectsById.get(objectId);
                        return (
                          <div
                            key={objectId}
                            className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="w-5 text-xs text-muted-foreground font-mono">
                                #{index + 1}
                              </span>
                              <span className="font-medium text-foreground truncate">
                                {obj?.title || `Object: ${objectId}`}
                              </span>
                              {obj?.type && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs capitalize"
                                >
                                  {obj.type}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Move item ${index + 1} up`}
                                onClick={() => handleMoveMember(index, "up")}
                                disabled={index === 0}
                              >
                                <ArrowUpIcon
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Move item ${index + 1} down`}
                                onClick={() => handleMoveMember(index, "down")}
                                disabled={
                                  index ===
                                  selectedCollection.memberIds.length - 1
                                }
                              >
                                <ArrowDownIcon
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Remove item ${index + 1}`}
                                onClick={() => handleRemoveMember(objectId)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2Icon
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Available Objects to Add */}
                <div className="space-y-3 pt-4 border-t">
                  <Label>Available Objects ({unassignedObjects.length})</Label>
                  {unassignedObjects.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      All available objects are currently in this collection.
                    </p>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                      {unassignedObjects.map((obj) => (
                        <div
                          key={obj.id}
                          className="flex items-center justify-between rounded-lg border border-border p-2 text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="font-medium text-foreground truncate">
                              {obj.title}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] capitalize"
                            >
                              {obj.type}
                            </Badge>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddMember(obj.id)}
                            className="h-7 text-xs gap-1"
                          >
                            <PlusIcon className="size-3" aria-hidden="true" />
                            <span>Add</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-end border-t pt-4">
                <Button
                  type="button"
                  onClick={handleSaveMembers}
                  disabled={isSavingMembers}
                  className="gap-1.5"
                >
                  <SaveIcon className="size-4" aria-hidden="true" />
                  <span>
                    {isSavingMembers ? "Saving..." : "Save Collection Members"}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
              Select a collection on the left or create a new one to organize
              its members.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
