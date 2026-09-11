"use client";

import { useState } from "react";
import { useWorkspace } from "@/app/_components/workspace/space-controller";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useObjectMutation } from "@/app/_components/objects/use-object-mutation";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";

export function ObjectTrashButton({ entity }: { entity: SpaceEntityRecord }) {
  const [open, setOpen] = useState(false);
  const mutation = useObjectMutation(entity);
  const { setActiveAction, setActiveEntityId, setMainValue } = useWorkspace();

  async function moveToTrash() {
    if (!(await mutation.trash())) return;
    setOpen(false);
    setActiveAction(undefined);
    setActiveEntityId(null);
    setMainValue(entity.objectTypeId);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!mutation.enabled}
        onClick={() => setOpen(true)}
      >
        Mover para a lixeira
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!mutation.busy) setOpen(value);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mover “{entity.title}” para a lixeira?</AlertDialogTitle>
            <AlertDialogDescription>
              O conteúdo será preservado para restauração na lixeira deste espaço.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {mutation.error && (
            <p role="alert" className="text-sm text-destructive">
              {mutation.error}
            </p>
          )}
          <AlertDialogFooter>
            <Button variant="outline" disabled={mutation.busy} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={mutation.busy}
              onClick={() => void moveToTrash()}
            >
              {mutation.busy ? "Movendo…" : "Confirmar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
