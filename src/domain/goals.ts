import type {
  ReviewLogRecord,
  StudyGoalsProgress,
  UserSettingsRecord,
} from "@/data/types";

export const DEFAULT_DAILY_GOAL = 20;
export const DEFAULT_MONTHLY_GOAL = 500;

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getStartOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getStartOfMonth(date: Date): Date {
  const start = new Date(date);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function calculateDailyProgress(
  logs: ReviewLogRecord[],
  goal: number,
  now: Date,
) {
  const todayKey = toLocalDateKey(now);
  const todayLogs = logs.filter((log) => {
    const logDate = new Date(log.reviewedAt);
    return toLocalDateKey(logDate) === todayKey;
  });

  const count = todayLogs.length;
  const safeGoal = Math.max(1, goal);
  const percentage = Math.min(100, Math.round((count / safeGoal) * 100));

  return {
    goal: safeGoal,
    count,
    percentage,
    isCompleted: count >= safeGoal,
  };
}

export function calculateMonthlyProgress(
  logs: ReviewLogRecord[],
  goal: number,
  now: Date,
) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthLogs = logs.filter((log) => {
    const logDate = new Date(log.reviewedAt);
    return (
      logDate.getFullYear() === currentYear &&
      logDate.getMonth() === currentMonth
    );
  });

  const count = monthLogs.length;
  const safeGoal = Math.max(1, goal);
  const percentage = Math.min(100, Math.round((count / safeGoal) * 100));

  return {
    goal: safeGoal,
    count,
    percentage,
    isCompleted: count >= safeGoal,
  };
}

export function calculateStreak(logs: ReviewLogRecord[], now: Date) {
  if (!logs.length) {
    return {
      current: 0,
      longest: 0,
      lastActiveDate: null,
    };
  }

  const uniqueDateKeys = Array.from(
    new Set(logs.map((log) => toLocalDateKey(new Date(log.reviewedAt)))),
  ).sort();

  if (!uniqueDateKeys.length) {
    return {
      current: 0,
      longest: 0,
      lastActiveDate: null,
    };
  }

  const lastActiveDate = uniqueDateKeys[uniqueDateKeys.length - 1];
  const todayKey = toLocalDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDateKey(yesterday);

  const dateSet = new Set(uniqueDateKeys);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(now);

  // If haven't studied today yet, check if studied yesterday
  if (!dateSet.has(todayKey)) {
    if (dateSet.has(yesterdayKey)) {
      checkDate = yesterday;
    } else {
      checkDate = new Date(0); // broken
    }
  }

  if (checkDate.getTime() > 0) {
    const cursor = new Date(checkDate);
    while (dateSet.has(toLocalDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // Calculate longest streak across all history
  let longestStreak = 0;
  let running = 0;
  let prevDate: Date | null = null;

  for (const dateKey of uniqueDateKeys) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (prevDate) {
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        running += 1;
      } else {
        running = 1;
      }
    } else {
      running = 1;
    }

    if (running > longestStreak) {
      longestStreak = running;
    }

    prevDate = currentDate;
  }

  return {
    current: currentStreak,
    longest: longestStreak,
    lastActiveDate,
  };
}

export function calculateGoalsProgress(
  logs: ReviewLogRecord[],
  settings: Partial<UserSettingsRecord> | undefined,
  now: Date,
): StudyGoalsProgress {
  const dailyGoal = settings?.dailyCardGoal ?? DEFAULT_DAILY_GOAL;
  const monthlyGoal = settings?.monthlyCardGoal ?? DEFAULT_MONTHLY_GOAL;

  return {
    daily: calculateDailyProgress(logs, dailyGoal, now),
    monthly: calculateMonthlyProgress(logs, monthlyGoal, now),
    streak: calculateStreak(logs, now),
  };
}
