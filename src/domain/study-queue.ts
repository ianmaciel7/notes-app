import type { CardRecord, CardSchedule, SessionGoal } from "@/data/types";

export function buildStudyQueue(
  cards: CardRecord[],
  schedules: CardSchedule[],
  now: Date,
  goal: SessionGoal,
) {
  const schedulesByCard = new Map(schedules.map((schedule) => [schedule.cardId, schedule]));

  const due = cards
    .filter((card) => {
      const schedule = schedulesByCard.get(card.id);
      return schedule && new Date(schedule.due).getTime() <= now.getTime();
    })
    .sort((a, b) => {
      const aDue = schedulesByCard.get(a.id)!.due;
      const bDue = schedulesByCard.get(b.id)!.due;
      return aDue.localeCompare(bDue);
    });

  const fresh = cards
    .filter((card) => !schedulesByCard.has(card.id))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const queue = [...due, ...fresh];
  return goal === "all" ? queue : queue.slice(0, goal);
}
