"use client";

import { useState } from "react";
import { ObjectEditFields } from "@/app/_components/objects/detail/object-edit-fields";
import { buildObjectEdit } from "@/app/_components/objects/detail/object-edit-model";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useObjectMutation } from "@/app/_components/objects/use-object-mutation";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

function ObjectEditForm({ entity, onSaved }: { entity: SpaceEntityRecord; onSaved: () => void }) {
  const [snapshot] = useState(entity);
  const [validationError, setValidationError] = useState<string | null>(null);
  const mutation = useObjectMutation(entity);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);
    try {
      const edit = buildObjectEdit(snapshot, new FormData(event.currentTarget));
      if (await mutation.save(edit, snapshot.updatedAt)) onSaved();
    } catch (cause) {
      setValidationError(cause instanceof Error ? cause.message : String(cause));
    }
  }
  return (
    <form onSubmit={(event) => void submit(event)} className="grid gap-4">
      <fieldset disabled={mutation.busy} className="grid gap-4">
        <ObjectEditFields entity={snapshot} />
        {(validationError || mutation.error) && (
          <p role="alert" className="text-destructive">
            {validationError || mutation.error}
          </p>
        )}
        <Button type="submit" disabled={!mutation.enabled || mutation.busy}>
          {mutation.busy ? "Salvando…" : "Salvar alterações"}
        </Button>
      </fieldset>
    </form>
  );
}

export function ObjectEditor({ entity }: { entity: SpaceEntityRecord }) {
  const [open, setOpen] = useState(false);
  const { enabled } = useObjectMutation(entity);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!enabled}
        onClick={() => setOpen(true)}
      >
        Editar objeto
      </Button>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar objeto</DialogTitle>
          <DialogDescription>
            As alterações são salvas neste espaço. Campos não editados são preservados.
          </DialogDescription>
        </DialogHeader>
        {open && <ObjectEditForm entity={entity} onSaved={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
