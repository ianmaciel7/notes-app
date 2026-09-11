"use client";

import { useState } from "react";
import { readEntityField } from "@/components/objects/detail/object-edit-model";
import { Button } from "@/components/ui/button";
import { useObjectMutation } from "@/hooks/use-object-mutation";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

const ratings = [
  { value: 1, label: "Repetir" },
  { value: 2, label: "Difícil" },
  { value: 3, label: "Bom" },
  { value: 4, label: "Fácil" },
] as const;

export function FlashcardReview({ entity }: { entity: SpaceEntityRecord }) {
  const [revealed, setRevealed] = useState(false);
  const mutation = useObjectMutation(entity);
  const front = readEntityField(entity, "front");
  const back = readEntityField(entity, "back");
  return (
    <section aria-label="Revisão de flashcard" className="grid gap-4 rounded-lg border p-4">
      <h2 className="text-lg font-medium">{front || entity.title}</h2>
      {!front || !back ? (
        <p className="text-muted-foreground">Edite a pergunta e a resposta antes de revisar.</p>
      ) : null}
      {revealed ? (
        <>
          <p className="whitespace-pre-wrap">{back}</p>
          <div className="flex flex-wrap gap-2">
            {ratings.map((rating) => (
              <Button
                key={rating.value}
                type="button"
                variant="outline"
                disabled={!mutation.enabled || mutation.busy || !entity.srs}
                onClick={async () => {
                  if (await mutation.review(rating.value)) setRevealed(false);
                }}
              >
                {rating.label}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <Button
          type="button"
          variant="secondary"
          disabled={!front || !back}
          onClick={() => setRevealed(true)}
        >
          Mostrar resposta
        </Button>
      )}
      {entity.srs && (
        <p className="text-sm text-muted-foreground">
          Próxima revisão: {entity.srs.dueDate.slice(0, 10)} · Revisões:{" "}
          {entity.srs.repetitionCount}
        </p>
      )}
      {mutation.error && (
        <p role="alert" className="text-destructive">
          {mutation.error}
        </p>
      )}
    </section>
  );
}
