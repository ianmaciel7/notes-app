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
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()} {...props}>
      <DialogContent className="sm:max-w-md p-6">
        {open ? (
          <GoalsDialogContent
            key={`${dailyGoal}:${monthlyGoal}`}
            dailyGoal={dailyGoal}
            monthlyGoal={monthlyGoal}
            onClose={onClose}
            onSubmit={onSubmit}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function GoalsDialogContent({
  dailyGoal,
  monthlyGoal,
  onClose,
  onSubmit,
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

    if (Number.isNaN(parsedDaily) || parsedDaily < 1 || parsedDaily > 1000) {
      setError("A meta diária deve ser entre 1 e 1.000 cartões.");
      return;
    }

    if (Number.isNaN(parsedMonthly) || parsedMonthly < 1 || parsedMonthly > 20000) {
      setError("A meta mensal deve ser entre 1 e 20.000 cartões.");
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
    <>
      <DialogHeader className="pb-2">
        <DialogTitle>Metas de estudo</DialogTitle>
        <DialogDescription>
          Defina sua meta de revisões diárias e mensais para acompanhar seu progresso.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
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
            aria-invalid={Boolean(error)}
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
            aria-invalid={Boolean(error)}
            required
          />
        </Field>
        <DialogFooter className="pt-2 flex justify-end gap-2">
          <DialogClose render={<Button type="button" variant="outline" disabled={submitting} />}>
            Cancelar
          </DialogClose>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar metas"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
