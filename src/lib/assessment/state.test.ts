import { describe, expect, it } from "vitest";
import type { Question } from "@/domain/catalog/question";
import {
  type AssessmentQuestionProgress,
  getInitialQuestionId,
  groupQuestionsByDomain,
} from "./state";

const questions = [
  { id: "q1", domainId: "network", order: 1 },
  { id: "q2", domainId: "compute", order: 2 },
  { id: "q3", domainId: "network", order: 3 },
] as Question[];

describe("assessment state helpers", () => {
  it("opens the first unanswered question when reopening an assessment", () => {
    const progress: AssessmentQuestionProgress = {
      q1: { isCompleted: true },
      q2: { isCompleted: false },
    };

    expect(getInitialQuestionId(questions, progress)).toBe("q2");
  });

  it("opens the first question when every question is answered", () => {
    const progress: AssessmentQuestionProgress = {
      q1: { isCompleted: true },
      q2: { isCompleted: true },
      q3: { isCompleted: true },
    };

    expect(getInitialQuestionId(questions, progress)).toBe("q1");
  });

  it("groups questions without changing canonical order", () => {
    const groups = groupQuestionsByDomain(questions, {
      network: "Network",
      compute: "Compute",
    });

    expect(groups.map((group) => group.title)).toEqual(["Network", "Compute"]);
    expect(groups[0].questions.map((question) => question.id)).toEqual([
      "q1",
      "q3",
    ]);
    expect(groups[1].questions.map((question) => question.id)).toEqual(["q2"]);
  });
});
