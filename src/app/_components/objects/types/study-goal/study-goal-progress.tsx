"use client";

import { useWorkspace } from "@/app/_components/workspace/space-controller";
import type { SpaceEntityRecord } from "@/lib/spaces/space-types";
import { selectStudyGoalDashboard } from "@/lib/srs/study-goal-dashboard";

export function StudyGoalProgress({ entity }: { entity: SpaceEntityRecord }) {
  const { createdEntities } = useWorkspace() as { createdEntities: SpaceEntityRecord[] };
  const dashboard = selectStudyGoalDashboard(
    createdEntities.filter((item) => item.spaceId === entity.spaceId),
    new Date(),
    entity.id,
  );
  if (!dashboard) return <p>Edite esta meta para definir a data da prova.</p>;
  const values = [
    ["Cartões", dashboard.totalCards],
    ["Aprendidos", dashboard.learnedCards],
    ["Para revisar", dashboard.dueCards],
    ["Novos por dia", dashboard.dailyNewCardQuota],
    ["Dias restantes", dashboard.daysRemaining],
  ] as const;
  return (
    <section aria-label="Progresso da meta" className="rounded-lg border p-4">
      <h2 className="mb-3 font-medium">Progresso da meta</h2>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {values.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
