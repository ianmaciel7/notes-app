"use client";

import { useId, useState, type FormEvent } from "react";
import { BookOpen, Check, FileQuestion, Layers, Plus, Trash2 } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CardRecord, CardType, ExamOption } from "@/data/types";

export interface CardDialogSubmitValue {
  front: string;
  back: string;
  type?: CardType;
  sourceTitle?: string;
  sourceAuthor?: string;
  sourceUrl?: string;
  options?: ExamOption[];
  explanation?: string;
}

export interface CardDialogProps extends Omit<React.ComponentProps<typeof Dialog>, "children" | "onSubmit"> {
  initial?: Partial<CardRecord>;
  onClose: () => void;
  onSubmit: (value: CardDialogSubmitValue) => Promise<void>;
}

export function CardDialog({ open, initial, onClose, onSubmit, ...props }: CardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()} {...props}>
      <DialogContent className="sm:max-w-[580px] p-6 max-h-[90vh] overflow-y-auto">
        {open ? (
          <CardDialogContent
            key={`${initial?.id ?? "new"}:${initial?.type ?? "anki"}`}
            initial={initial}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function CardDialogContent({ initial, onClose, onSubmit }: Omit<CardDialogProps, "open">) {
  const frontId = useId();
  const backId = useId();
  const sourceTitleId = useId();
  const sourceAuthorId = useId();
  const sourceUrlId = useId();
  const explanationId = useId();

  const [cardType, setCardType] = useState<CardType>(initial?.type ?? "anki");
  const [front, setFront] = useState(initial?.front ?? "");
  const [back, setBack] = useState(initial?.back ?? "");
  const [sourceTitle, setSourceTitle] = useState(initial?.sourceTitle ?? "");
  const [sourceAuthor, setSourceAuthor] = useState(initial?.sourceAuthor ?? "");
  const [sourceUrl, setSourceUrl] = useState(initial?.sourceUrl ?? "");
  const [explanation, setExplanation] = useState(initial?.explanation ?? "");
  const [options, setOptions] = useState<ExamOption[]>(
    initial?.options && initial.options.length > 0
      ? initial.options
      : [
          { id: "opt-1", text: "", isCorrect: true },
          { id: "opt-2", text: "", isCorrect: false },
        ],
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleAddOption() {
    const nextId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setOptions((prev) => [...prev, { id: nextId, text: "", isCorrect: false }]);
  }

  function handleRemoveOption(id: string) {
    if (options.length <= 2) {
      setError("Uma questão deve conter pelo menos 2 alternativas.");
      return;
    }
    setOptions((prev) => {
      const filtered = prev.filter((o) => o.id !== id);
      if (!filtered.some((o) => o.isCorrect) && filtered.length > 0) {
        filtered[0].isCorrect = true;
      }
      return filtered;
    });
  }

  function handleOptionTextChange(id: string, text: string) {
    setOptions((prev) =>
      prev.map((o) => (o.id === id ? { ...o, text } : o)),
    );
  }

  function handleSetCorrectOption(id: string) {
    setOptions((prev) =>
      prev.map((o) => ({ ...o, isCorrect: o.id === id })),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (cardType === "anki") {
      if (!front.trim() || !back.trim()) {
        setError("Preencha a frente e o verso do cartão.");
        return;
      }
    } else if (cardType === "readwise") {
      if (!front.trim()) {
        setError("Informe o texto do destaque/citação.");
        return;
      }
    } else if (cardType === "exam_topic") {
      if (!front.trim()) {
        setError("Informe o enunciado da questão.");
        return;
      }
      const validOptions = options.map((opt) => ({ ...opt, text: opt.text.trim() }));
      if (validOptions.some((opt) => !opt.text)) {
        setError("Preencha o texto de todas as alternativas.");
        return;
      }
      if (!validOptions.some((opt) => opt.isCorrect)) {
        setError("Marque a alternativa correta.");
        return;
      }
    }

    setSaving(true);
    try {
      const payload: CardDialogSubmitValue = {
        front: front.trim(),
        back: (cardType === "exam_topic" ? (explanation.trim() || back.trim() || "Resposta confirmada") : (back.trim() || front.trim())),
        type: cardType,
        sourceTitle: sourceTitle.trim() || undefined,
        sourceAuthor: sourceAuthor.trim() || undefined,
        sourceUrl: sourceUrl.trim() || undefined,
        options: cardType === "exam_topic" ? options.map((opt) => ({ ...opt, text: opt.text.trim() })) : undefined,
        explanation: cardType === "exam_topic" ? (explanation.trim() || undefined) : undefined,
      };

      await onSubmit(payload);
      onClose();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o cartão.");
    } finally {
      setSaving(false);
    }
  }

  const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <>
      <DialogHeader className="pb-2">
        <DialogTitle>{initial?.front ? "Editar cartão" : "Novo cartão"}</DialogTitle>
        <DialogDescription>
          Escolha o formato de estudo ideal para este conteúdo.
        </DialogDescription>
      </DialogHeader>

      <form className="space-y-4 pt-2" onSubmit={handleSubmit}>
        <Tabs
          value={cardType}
          onValueChange={(val) => setCardType(val as CardType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full h-9">
            <TabsTrigger value="anki" className="gap-1.5 text-xs font-semibold">
              <Layers className="size-3.5" />
              <span>Anki</span>
            </TabsTrigger>
            <TabsTrigger value="readwise" className="gap-1.5 text-xs font-semibold">
              <BookOpen className="size-3.5" />
              <span>Readwise</span>
            </TabsTrigger>
            <TabsTrigger value="exam_topic" className="gap-1.5 text-xs font-semibold">
              <FileQuestion className="size-3.5" />
              <span>Simulado</span>
            </TabsTrigger>
          </TabsList>

          {/* ANKI FORM */}
          <TabsContent value="anki" className="space-y-4 pt-3">
            <Field>
              <FieldLabel htmlFor={frontId}>Frente</FieldLabel>
              <Textarea
                id={frontId}
                autoFocus
                value={front}
                onChange={(event) => setFront(event.target.value)}
                placeholder="Pergunta ou conceito a ser lembrado..."
                maxLength={600}
                rows={3}
                aria-invalid={Boolean(error && !front.trim())}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={backId}>Verso</FieldLabel>
              <Textarea
                id={backId}
                value={back}
                onChange={(event) => setBack(event.target.value)}
                placeholder="Resposta direta..."
                maxLength={1200}
                rows={4}
                aria-invalid={Boolean(error && !back.trim())}
              />
            </Field>
          </TabsContent>

          {/* READWISE FORM */}
          <TabsContent value="readwise" className="space-y-4 pt-3">
            <Field>
              <FieldLabel htmlFor={frontId}>Destaque / Citação</FieldLabel>
              <Textarea
                id={frontId}
                autoFocus
                value={front}
                onChange={(event) => setFront(event.target.value)}
                placeholder="Trecho destacado ou ideia principal do livro..."
                maxLength={1200}
                rows={4}
                aria-invalid={Boolean(error && !front.trim())}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={backId}>Comentário ou Síntese (opcional)</FieldLabel>
              <Textarea
                id={backId}
                value={back}
                onChange={(event) => setBack(event.target.value)}
                placeholder="Suas próprias notas, reflexões ou resumo..."
                maxLength={800}
                rows={3}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Field>
                <FieldLabel htmlFor={sourceTitleId}>Título da Obra</FieldLabel>
                <Input
                  id={sourceTitleId}
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  placeholder="ex: Hábitos Atômicos"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={sourceAuthorId}>Autor(a)</FieldLabel>
                <Input
                  id={sourceAuthorId}
                  value={sourceAuthor}
                  onChange={(e) => setSourceAuthor(e.target.value)}
                  placeholder="ex: James Clear"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor={sourceUrlId}>Link de Referência / Artigo</FieldLabel>
              <Input
                id={sourceUrlId}
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </TabsContent>

          {/* SIMULADO FORM */}
          <TabsContent value="exam_topic" className="space-y-4 pt-3">
            <Field>
              <FieldLabel htmlFor={frontId}>Enunciado da Questão</FieldLabel>
              <Textarea
                id={frontId}
                autoFocus
                value={front}
                onChange={(event) => setFront(event.target.value)}
                placeholder="Texto base e pergunta da questão de concurso/certificação..."
                maxLength={1200}
                rows={4}
                aria-invalid={Boolean(error && !front.trim())}
              />
            </Field>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel className="m-0">Alternativas</FieldLabel>
                {options.length < 8 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleAddOption}
                  >
                    <Plus className="size-3" />
                    <span>Adicionar alternativa</span>
                  </Button>
                ) : null}
              </div>

              <div className="space-y-2">
                {options.map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={option.isCorrect ? "default" : "outline"}
                      size="icon"
                      className="size-8 shrink-0 font-bold text-xs"
                      title={option.isCorrect ? "Alternativa Correta" : "Marcar como correta"}
                      onClick={() => handleSetCorrectOption(option.id)}
                    >
                      {option.isCorrect ? <Check className="size-4" /> : (optionLetters[idx] ?? idx + 1)}
                    </Button>
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                      placeholder={`Texto da alternativa ${optionLetters[idx] ?? idx + 1}...`}
                      className="flex-1 text-xs"
                    />
                    {options.length > 2 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor={explanationId}>Gabarito & Justificativa Técnica</FieldLabel>
              <Textarea
                id={explanationId}
                value={explanation}
                onChange={(event) => setExplanation(event.target.value)}
                placeholder="Explicação comentada sobre por que a alternativa está certa..."
                maxLength={1000}
                rows={3}
              />
            </Field>
          </TabsContent>
        </Tabs>

        {error ? <FieldError errors={[{ message: error }]} /> : null}

        <DialogFooter className="pt-2 flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" type="button" />}>
            Cancelar
          </DialogClose>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar cartão"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
