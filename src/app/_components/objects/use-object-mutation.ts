"use client";

import { useMemo, useRef, useState } from "react";
import { useWorkspace } from "@/app/_components/workspace/space-controller";
import { db } from "@/lib/db";
import { createSpaceRepository } from "@/lib/spaces/space-repository";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import type { FSRSRating } from "@/lib/srs/fsrs";

export function useObjectMutation(entity: SpaceEntityRecord) {
  const { ready, spaceId } = useWorkspace() as { ready?: boolean; spaceId: string };
  const repository = useMemo(() => createSpaceRepository(db), []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);
  const enabled = ready === true && spaceId === entity.spaceId;

  async function run(operation: () => Promise<unknown>) {
    if (locked.current || !enabled) return false;
    locked.current = true;
    setBusy(true);
    setError(null);
    try {
      await operation();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  return {
    busy,
    error,
    enabled,
    save: (changes: Partial<SpaceEntityRecord> & Record<string, unknown>, revision?: string) =>
      run(() => repository.updateEntity(entity.spaceId, entity.id, changes, revision)),
    review: (rating: FSRSRating) =>
      run(() => repository.recordFlashcardReview(entity.spaceId, entity.id, rating)),
    trash: () => run(() => repository.trashEntity(entity.spaceId, entity.id)),
  };
}
