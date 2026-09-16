import type {
  CardErrorSummary,
  CardRecord,
  CardSchedule,
  DeckRecord,
  OverallErrorStats,
  ReviewLogRecord,
  SessionGoal,
} from "@/data/types";

export function calculateErrorStats(
  logs: ReviewLogRecord[],
  schedules: CardSchedule[],
): OverallErrorStats {
  const totalReviews = logs.length;
  let againCount = 0;
  let hardCount = 0;
  let goodCount = 0;
  let easyCount = 0;

  for (const log of logs) {
    switch (log.rating) {
      case "again":
        againCount += 1;
        break;
      case "hard":
        hardCount += 1;
        break;
      case "good":
        goodCount += 1;
        break;
      case "easy":
        easyCount += 1;
        break;
    }
  }

  const retentionRate =
    totalReviews > 0
      ? Math.round(((goodCount + easyCount) / totalReviews) * 100)
      : 0;
  const errorRate =
    totalReviews > 0 ? Math.round((againCount / totalReviews) * 100) : 0;
  const totalLapses = schedules.reduce((acc, s) => acc + (s.lapses || 0), 0);

  // A card is considered problematic if it has at least 1 lapse or at least 1 again rating
  const cardsWithErrors = new Set<string>();
  for (const schedule of schedules) {
    if (schedule.lapses > 0) {
      cardsWithErrors.add(schedule.cardId);
    }
  }
  for (const log of logs) {
    if (log.rating === "again") {
      cardsWithErrors.add(log.cardId);
    }
  }

  return {
    totalReviews,
    againCount,
    hardCount,
    goodCount,
    easyCount,
    retentionRate,
    errorRate,
    totalLapses,
    problematicCardsCount: cardsWithErrors.size,
  };
}

export function identifyProblematicCards(
  cards: CardRecord[],
  schedules: CardSchedule[],
  logs: ReviewLogRecord[],
  decks: DeckRecord[] = [],
): CardErrorSummary[] {
  const schedulesByCard = new Map(
    schedules.map((schedule) => [schedule.cardId, schedule]),
  );
  const decksById = new Map(decks.map((deck) => [deck.id, deck.name]));

  const logsByCard = new Map<string, ReviewLogRecord[]>();
  for (const log of logs) {
    const cardLogs = logsByCard.get(log.cardId) || [];
    cardLogs.push(log);
    logsByCard.set(log.cardId, cardLogs);
  }

  const summaries: CardErrorSummary[] = [];

  for (const card of cards) {
    const cardSchedule = schedulesByCard.get(card.id);
    const cardLogs = logsByCard.get(card.id) || [];

    // Sort logs descending by reviewedAt
    cardLogs.sort(
      (a, b) =>
        new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime(),
    );

    const errorCount = cardLogs.filter((l) => l.rating === "again").length;
    const totalReviews = cardLogs.length;
    const lapses = cardSchedule?.lapses ?? 0;
    const errorRate =
      totalReviews > 0 ? Math.round((errorCount / totalReviews) * 100) : 0;

    const latestLog = cardLogs[0];

    // Only include cards that have at least one error, lapse, or difficulty
    if (errorCount > 0 || lapses > 0) {
      summaries.push({
        cardId: card.id,
        deckId: card.deckId,
        deckName: decksById.get(card.deckId),
        front: card.front,
        back: card.back,
        lapses,
        errorCount,
        totalReviews,
        errorRate,
        lastRating: latestLog?.rating,
        lastReviewedAt: latestLog?.reviewedAt,
      });
    }
  }

  // Sort by error severity: most lapses/errors first, then highest error rate
  return summaries.sort((a, b) => {
    const aSeverity = a.errorCount * 2 + a.lapses;
    const bSeverity = b.errorCount * 2 + b.lapses;
    if (bSeverity !== aSeverity) return bSeverity - aSeverity;
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
    return (
      new Date(b.lastReviewedAt || 0).getTime() -
      new Date(a.lastReviewedAt || 0).getTime()
    );
  });
}

export function buildMistakeStudyQueue(
  cards: CardRecord[],
  schedules: CardSchedule[],
  logs: ReviewLogRecord[],
  goal: SessionGoal = "all",
): CardRecord[] {
  const problematic = identifyProblematicCards(cards, schedules, logs);
  const cardsById = new Map(cards.map((card) => [card.id, card]));

  const queue: CardRecord[] = [];
  for (const item of problematic) {
    const card = cardsById.get(item.cardId);
    if (card) {
      queue.push(card);
    }
  }

  return goal === "all" ? queue : queue.slice(0, goal);
}
