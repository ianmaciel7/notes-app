"use client";

import * as React from "react";

import { useWorkspace } from "@/components/space-controller";
import { selectStudyGoalDashboard } from "@/lib/srs/study-goal-dashboard";

const statusLabel = {
  ahead: "Ahead",
  behind: "Behind",
  onTrack: "On track",
} as const;

function formatExamDate(value: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "No exam date";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function WorkspaceStudyGoalDashboard() {
  const { createdEntities, ready } = useWorkspace();
  const dashboard = React.useMemo(
    () => selectStudyGoalDashboard(createdEntities),
    [createdEntities],
  );

  if (!ready) return null;

  return (
    <section className="border-b border-border bg-background px-6 py-4">
      {!dashboard ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-normal">
              Study goal
            </p>
            <h2 className="mt-1 text-base font-semibold text-foreground">No exam goal yet</h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            Create a `study_goal` entity and this dashboard will calculate pacing from real Dexie
            flashcards.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(4,8rem)]">
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-normal">
              Study goal
            </p>
            <h2 className="mt-1 text-base font-semibold text-foreground">{dashboard.goalTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Exam {formatExamDate(dashboard.targetExamDate)} · {dashboard.daysRemaining} days left
            </p>
          </div>

          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {statusLabel[dashboard.status]}
            </p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Daily new</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {dashboard.dailyNewCardQuota}
            </p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Learned</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {dashboard.learnedCards}/{dashboard.totalCards}
            </p>
          </div>
          <div className="rounded-lg border border-border px-3 py-2">
            <p className="text-xs text-muted-foreground">Due now</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{dashboard.dueCards}</p>
          </div>
        </div>
      )}
    </section>
  );
}
