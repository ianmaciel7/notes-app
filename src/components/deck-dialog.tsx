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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DeckDialogProps {
  open: boolean;
  initial?: { name: string; description: string };
  onClose: () => void;
  onSubmit: (value: { name: string; description: string }) => Promise<void>;
}

export function DeckDialog({ open, initial, onClose, onSubmit }: DeckDialogProps) {
  if (!open) return null;
  return <DeckDialogForm key={`${initial?.name ?? "new"}:${initial?.description ?? ""}`} initial={initial} onClose={onClose} onSubmit={onSubmit} />;
}

function DeckDialogForm({ initial, onClose, onSubmit }: Omit<DeckDialogProps, "open">) {
  const nameId = useId();
  const descriptionId = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Informe o nome do baralho.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o baralho.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-6">
        <DialogHeader className="pb-2">
          <DialogTitle>{initial ? "Editar baralho" : "Novo baralho"}</DialogTitle>
          <DialogDescription>Organize cartões do mesmo assunto em um só lugar.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor={nameId}>Nome</FieldLabel>
            <Input id={nameId} autoFocus value={name} onChange={(event) => setName(event.target.value)} maxLength={80} />
          </Field>
          <Field>
            <FieldLabel htmlFor={descriptionId}>Descrição (opcional)</FieldLabel>
            <Textarea id={descriptionId} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={180} rows={3} />
          </Field>
          {error ? <FieldError errors={[{ message: error }]} /> : null}
          <DialogFooter className="pt-2 flex justify-end gap-2">
            <DialogClose render={<Button variant="outline" type="button" onClick={onClose} />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar baralho"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
