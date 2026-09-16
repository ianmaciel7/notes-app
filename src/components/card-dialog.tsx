"use client";

import { useId, useState, type FormEvent } from "react";

import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CardDialogProps {
  open: boolean;
  initial?: { front: string; back: string };
  onClose: () => void;
  onSubmit: (value: { front: string; back: string }) => Promise<void>;
}

export function CardDialog({ open, initial, onClose, onSubmit }: CardDialogProps) {
  if (!open) return null;
  return <CardDialogForm key={`${initial?.front ?? "new"}:${initial?.back ?? ""}`} initial={initial} onClose={onClose} onSubmit={onSubmit} />;
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
    <Modal open title={initial ? "Editar cartão" : "Novo cartão"} description="Escreva uma pergunta objetiva e uma resposta direta." onClose={onClose}>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="field-group"><Label htmlFor={frontId}>Frente</Label><Textarea id={frontId} autoFocus value={front} onChange={(event) => setFront(event.target.value)} maxLength={600} rows={4} /></div>
        <div className="field-group"><Label htmlFor={backId}>Verso</Label><Textarea id={backId} value={back} onChange={(event) => setBack(event.target.value)} maxLength={1200} rows={5} /></div>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="modal-actions">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar cartão"}</Button>
        </footer>
      </form>
    </Modal>
  );
}
