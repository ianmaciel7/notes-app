"use client";

import { useObjectMutation } from "@/app/_components/objects/use-object-mutation";
import { Button } from "@/components/ui/button";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function TaskStatus({ entity }: { entity: SpaceEntityRecord }) {
  const mutation = useObjectMutation(entity);
  const completed = entity.properties.status === "done" || entity.properties.status === "completed";
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant={completed ? "secondary" : "default"}
        disabled={!mutation.enabled || mutation.busy}
        onClick={() =>
          void mutation.save(
            {
              properties: {
                ...entity.properties,
                status: completed ? "todo" : "done",
                completedAt: completed ? null : new Date().toISOString(),
              },
            },
            entity.updatedAt,
          )
        }
      >
        {completed ? "Reabrir tarefa" : "Concluir tarefa"}
      </Button>
      {mutation.error && (
        <p role="alert" className="text-destructive">
          {mutation.error}
        </p>
      )}
    </div>
  );
}
