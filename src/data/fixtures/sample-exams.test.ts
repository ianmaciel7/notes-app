import { describe, expect, it } from "vitest";
import type { Exam } from "@/domain/catalog/exam";
import type { Question } from "@/domain/catalog/question";
import sampleData from "./sample-exams.json";

describe("Sample Exams Fixtures", () => {
  const exams = sampleData.exams as unknown as Exam[];
  const questions = sampleData.questions as unknown as Question[];

  it("loads 2 sample exams", () => {
    expect(exams).toHaveLength(2);
    expect(exams.map((e) => e.id)).toEqual([
      "cloud-arch-core",
      "devops-eng-fundamentals",
    ]);
  });

  it("contains all 5 question types across the dataset", () => {
    const types = new Set(questions.map((q) => q.type));
    expect(types).toContain("single-choice");
    expect(types).toContain("multiple-choice");
    expect(types).toContain("drag-and-drop");
    expect(types).toContain("hotspot");
    expect(types).toContain("case-study");
  });

  it("validates hotspot coordinates format [x, y, width, height]", () => {
    const hotspotQuestions = questions.filter((q) => q.type === "hotspot");
    expect(hotspotQuestions.length).toBeGreaterThan(0);

    for (const q of hotspotQuestions) {
      expect(q.hotspotAreas).toBeDefined();
      expect(q.hotspotAreas?.length).toBeGreaterThan(0);
      for (const area of q.hotspotAreas ?? []) {
        expect(area.coordinates).toHaveLength(4);
        expect(typeof area.coordinates[0]).toBe("number");
        expect(typeof area.coordinates[1]).toBe("number");
        expect(typeof area.coordinates[2]).toBe("number");
        expect(typeof area.coordinates[3]).toBe("number");
      }
    }
  });

  it("validates case study context tabs", () => {
    const caseStudyQuestions = questions.filter((q) => q.type === "case-study");
    expect(caseStudyQuestions.length).toBeGreaterThan(0);

    for (const q of caseStudyQuestions) {
      expect(q.caseStudy).toBeDefined();
      expect(q.caseStudy?.tabs.length).toBeGreaterThan(0);
      for (const tab of q.caseStudy?.tabs ?? []) {
        expect(tab.title).toBeTruthy();
        expect(tab.content).toBeTruthy();
      }
    }
  });

  it("validates drag-and-drop slots and items", () => {
    const dragDropQuestions = questions.filter(
      (q) => q.type === "drag-and-drop",
    );
    expect(dragDropQuestions.length).toBeGreaterThan(0);

    for (const q of dragDropQuestions) {
      expect(q.dragDropSlots).toBeDefined();
      expect(q.dragDropItems).toBeDefined();
      expect(typeof q.correctAnswer).toBe("object");
    }
  });
});
