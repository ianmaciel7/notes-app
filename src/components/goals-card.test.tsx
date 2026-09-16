import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { GoalsCard } from "@/components/goals-card";
import type { StudyGoalsProgress } from "@/data/types";

describe("GoalsCard", () => {
  const sampleProgress: StudyGoalsProgress = {
    daily: {
      goal: 20,
      count: 15,
      percentage: 75,
      isCompleted: false,
    },
    monthly: {
      goal: 500,
      count: 250,
      percentage: 50,
      isCompleted: false,
    },
    streak: {
      current: 4,
      longest: 7,
      lastActiveDate: "2026-09-16",
    },
  };

  it("renders daily, monthly goals and streak badge", () => {
    render(<GoalsCard goalsProgress={sampleProgress} />);

    expect(screen.getByText("Metas de estudo")).toBeInTheDocument();
    expect(screen.getByText(/4 dias seguidos/i)).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getAllByText(/250/i).length).toBeGreaterThan(0);
  });

  it("opens goals adjustment modal on click", async () => {
    const user = userEvent.setup();
    render(<GoalsCard goalsProgress={sampleProgress} />);

    const adjustBtn = screen.getByRole("button", { name: /ajustar/i });
    await user.click(adjustBtn);

    expect(screen.getByRole("heading", { name: "Metas de estudo" })).toBeInTheDocument();
    expect(screen.getByLabelText(/meta diária/i)).toHaveValue(20);
    expect(screen.getByLabelText(/meta mensal/i)).toHaveValue(500);
  });

  it("does not render streak badge when current streak is 0", () => {
    const zeroStreakProgress: StudyGoalsProgress = {
      ...sampleProgress,
      streak: { current: 0, longest: 0, lastActiveDate: null },
    };

    render(<GoalsCard goalsProgress={zeroStreakProgress} />);
    expect(screen.queryByText(/dia seguido/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dias seguidos/i)).not.toBeInTheDocument();
  });

  it("renders singular streak label and completed celebration messages", () => {
    const completedProgress: StudyGoalsProgress = {
      daily: { goal: 10, count: 10, percentage: 100, isCompleted: true },
      monthly: { goal: 100, count: 100, percentage: 100, isCompleted: true },
      streak: { current: 1, longest: 5, lastActiveDate: "2026-09-16" },
    };

    render(<GoalsCard goalsProgress={completedProgress} />);
    expect(screen.getByText(/1 dia seguido/i)).toBeInTheDocument();
    expect(screen.getByText(/Parabéns! Você atingiu sua meta diária/i)).toBeInTheDocument();
    expect(screen.getByText(/Meta mensal concluída com sucesso!/i)).toBeInTheDocument();
  });
});
