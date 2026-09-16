"use client";

import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

interface CardDialogProps {
  open: boolean;
  initial?: { front: string; back: string };
  onClose: () => void;
  onSubmit: (value: { front: string; back: string }) => Promise<void>;
}

export function CardDialog({ open, initial, onClose, onSubmit }: CardDialogProps) {
  if (!open) return null;
  return (
    <CardDialogForm
      key={`${initial?.front ?? "new"}:${initial?.back ?? ""}`}
      initial={initial}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function CardDialogForm({ initial, onClose, onSubmit }: Omit<CardDialogProps, "open">) {
  const frontId = useId();
  const backId = useId();
  const [front, setFront] = useState(initial?.front ?? "");
  const [back, setBack] = useState(initial?.back ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!front.trim() || !back.trim()) {
      setError("Preencha a frente e o verso do cartão.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ front: front.trim(), back: back.trim() });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o cartão.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-6">
        <DialogHeader className="pb-2">
          <DialogTitle>{initial ? "Editar cartão" : "Novo cartão"}</DialogTitle>
          <DialogDescription>Escreva uma pergunta objetiva e uma resposta direta.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor={frontId}>Frente</FieldLabel>
            <Textarea
              id={frontId}
              autoFocus
              value={front}
              onChange={(event) => setFront(event.target.value)}
              maxLength={600}
              rows={4}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={backId}>Verso</FieldLabel>
            <Textarea
              id={backId}
              value={back}
              onChange={(event) => setBack(event.target.value)}
              maxLength={1200}
              rows={5}
            />
          </Field>
          {error ? <FieldError errors={[{ message: error }]} /> : null}
          <DialogFooter className="pt-2 flex justify-end gap-2">
            <DialogClose render={<Button variant="outline" type="button" onClick={onClose} />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar cartão"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
