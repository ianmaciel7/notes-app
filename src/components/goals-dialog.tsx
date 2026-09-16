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

export interface GoalsDialogProps extends Omit<React.ComponentProps<typeof Dialog>, "children" | "onSubmit"> {
  dailyGoal: number;
  monthlyGoal: number;
  onClose: () => void;
  onSubmit: (values: { dailyCardGoal: number; monthlyCardGoal: number }) => Promise<void>;
}

export function GoalsDialog({
  open,
  dailyGoal,
  monthlyGoal,
  onClose,
  onSubmit,
  ...props
}: GoalsDialogProps) {
  if (!open) return null;
  return (
    <GoalsDialogForm
      key={`${dailyGoal}:${monthlyGoal}`}
      dailyGoal={dailyGoal}
      monthlyGoal={monthlyGoal}
      onClose={onClose}
      onSubmit={onSubmit}
      {...props}
    />
  );
}

function GoalsDialogForm({
  dailyGoal,
  monthlyGoal,
  onClose,
  onSubmit,
  ...props
}: Omit<GoalsDialogProps, "open">) {
  const dailyId = useId();
  const monthlyId = useId();
  const [daily, setDaily] = useState(String(dailyGoal));
  const [monthly, setMonthly] = useState(String(monthlyGoal));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsedDaily = Number.parseInt(daily, 10);
    const parsedMonthly = Number.parseInt(monthly, 10);

    if (Number.isNaN(parsedDaily) || parsedDaily < 1) {
      setError("A meta diária deve ser de pelo menos 1 cartão.");
      return;
    }

    if (Number.isNaN(parsedMonthly) || parsedMonthly < 1) {
      setError("A meta mensal deve ser de pelo menos 1 cartão.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({ dailyCardGoal: parsedDaily, monthlyCardGoal: parsedMonthly });
      onClose();
    } catch {
      setError("Não foi possível salvar as metas. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()} {...props}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="pb-2">
          <DialogTitle>Metas de estudo</DialogTitle>
          <DialogDescription>
            Defina sua meta de revisões diárias e mensais para acompanhar seu progresso.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error ? <FieldError errors={[{ message: error }]} /> : null}
          <Field>
            <FieldLabel htmlFor={dailyId}>Meta diária (cartões por dia)</FieldLabel>
            <Input
              id={dailyId}
              type="number"
              min={1}
              max={1000}
              value={daily}
              onChange={(e) => setDaily(e.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={monthlyId}>Meta mensal (cartões por mês)</FieldLabel>
            <Input
              id={monthlyId}
              type="number"
              min={1}
              max={20000}
              value={monthly}
              onChange={(e) => setMonthly(e.target.value)}
              required
            />
          </Field>
          <DialogFooter className="pt-2 flex justify-end gap-2">
            <DialogClose render={<Button type="button" variant="outline" onClick={onClose} disabled={submitting} />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar metas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
