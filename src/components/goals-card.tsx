"use client";

import { useState } from "react";
import { CheckCircle2, Flame, SlidersHorizontal, Target } from "lucide-react";

import { GoalsDialog } from "@/components/goals-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db, saveUserSettings } from "@/data/db";
import type { StudyGoalsProgress } from "@/data/types";
import { cn } from "@/lib/utils";

export interface GoalsCardProps extends React.ComponentProps<typeof Card> {
  goalsProgress: StudyGoalsProgress;
}

export function GoalsCard({ goalsProgress, className, ...props }: GoalsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { daily, monthly, streak } = goalsProgress;

  return (
    <>
      <Card className={cn("transition-shadow hover:shadow-md", className)} {...props}>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary text-primary flex items-center justify-center">
              <Target size={18} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight">Metas de estudo</CardTitle>
              <CardDescription className="text-xs">Seu ritmo diário e mensal de revisões</CardDescription>
            </div>
          </div>

          <CardAction className="flex items-center gap-2 self-auto">
            {streak.current > 0 ? (
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5"
              >
                <Flame size={14} className="fill-amber-500 text-amber-500" />
                <span>
                  {streak.current} {streak.current === 1 ? "dia seguido" : "dias seguidos"}
                </span>
              </Badge>
            ) : null}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-xs h-8 gap-1.5"
            >
              <SlidersHorizontal size={13} />
              <span>Ajustar</span>
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
          {/* Meta Diária */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground flex items-center gap-1.5">
                Hoje
                {daily.isCompleted ? (
                  <CheckCircle2 size={13} className="text-primary fill-secondary" />
                ) : null}
              </span>
              <span className="text-muted-foreground font-mono">
                <strong className="text-foreground font-semibold">{daily.count}</strong> / {daily.goal} cartões ({daily.percentage}%)
              </span>
            </div>
            <Progress
              value={daily.percentage}
              className="h-2.5 bg-muted rounded-full"
              aria-label={`Meta de hoje: ${daily.count} de ${daily.goal} cartões`}
            />
            {daily.isCompleted ? (
              <p className="text-[11px] text-primary font-medium mt-1">
                🎉 Parabéns! Você atingiu sua meta diária de hoje.
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1">
                Faltam {Math.max(0, daily.goal - daily.count)} cartões para bater a meta de hoje.
              </p>
            )}
          </div>

          {/* Meta Mensal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground flex items-center gap-1.5">
                Este mês
                {monthly.isCompleted ? (
                  <CheckCircle2 size={13} className="text-primary fill-secondary" />
                ) : null}
              </span>
              <span className="text-muted-foreground font-mono">
                <strong className="text-foreground font-semibold">{monthly.count}</strong> / {monthly.goal} cartões ({monthly.percentage}%)
              </span>
            </div>
            <Progress
              value={monthly.percentage}
              className="h-2.5 bg-muted rounded-full"
              aria-label={`Meta do mês: ${monthly.count} de ${monthly.goal} cartões`}
            />
            {monthly.isCompleted ? (
              <p className="text-[11px] text-primary font-medium mt-1">
                🏆 Meta mensal concluída com sucesso!
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-1">
                {monthly.count} cartões revisados de {monthly.goal} planejados.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <GoalsDialog
        open={modalOpen}
        dailyGoal={daily.goal}
        monthlyGoal={monthly.goal}
        onClose={() => setModalOpen(false)}
        onSubmit={async (values) => {
          await saveUserSettings(db, values);
        }}
      />
    </>
  );
}
