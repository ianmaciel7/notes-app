"use client";

import { useId, useState, type FormEvent } from "react";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <Modal open title={initial ? "Editar baralho" : "Novo baralho"} description="Organize cartões do mesmo assunto em um só lugar." onClose={onClose}>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field-group"><Label htmlFor={nameId}>Nome</Label><Input id={nameId} autoFocus value={name} onChange={(event) => setName(event.target.value)} maxLength={80} /></div>
        <div className="field-group"><Label htmlFor={descriptionId}>Descrição (opcional)</Label><Textarea id={descriptionId} value={description} onChange={(event) => setDescription(event.target.value)} maxLength={180} rows={3} /></div>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="modal-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar baralho"}</Button>
        </footer>
      </form>
    </Modal>
  );
}
