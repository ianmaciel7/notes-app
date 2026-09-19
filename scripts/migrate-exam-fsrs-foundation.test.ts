import { describe, expect, it } from "vitest";
import sampleData from "@/data/fixtures/sample-exams.json";
import {
  convertLegacyQuestion,
  planMigration,
} from "./migrate-exam-fsrs-foundation";

const sampleExams = sampleData.exams as unknown as Array<
  Record<string, unknown>
>;
const sampleQuestions = sampleData.questions as unknown as Array<
  Record<string, unknown>
>;

describe("migration logic", () => {
  it("requires explicit ownerId and spaceId", () => {
    expect(() =>
      planMigration({
        ownerId: "",
        spaceId: "space-1",
        exams: sampleExams,
        questions: sampleQuestions,
      }),
    ).toThrow("MIGRATION_OWNER_UID");

    expect(() =>
      planMigration({
        ownerId: "user-1",
        spaceId: "",
        exams: sampleExams,
        questions: sampleQuestions,
      }),
    ).toThrow("MIGRATION_SPACE_ID");
  });

  it("converts legacy questions with deterministic IDs and valid formats", () => {
    const legacyQ = sampleQuestions[0];
    const { object, revision } = convertLegacyQuestion(
      "user-1",
      "space-1",
      legacyQ,
    );

    expect(object.id).toBe(`q_${String(legacyQ.id)}`);
    expect(object.spaceId).toBe("space-1");
    expect(object.ownerId).toBe("user-1");
    expect(object.type).toBe("question");
    expect(object.lifecycle).toBe("published");
    expect(object.publishedRevisionId).toBe(revision.id);

    expect(revision.id).toBe(`q_${String(legacyQ.id)}_rev_1`);
    expect(revision.publicationState).toBe("published");
    expect(revision.payload.schemaVersion).toBe(1);
    expect(revision.payload.options.length).toBeGreaterThan(0);
    expect(revision.payload.correctOptionIds).toEqual(["opt-redis"]);
  });

  it("converts legacy exams with references to converted question revisions in order", () => {
    const plan = planMigration({
      ownerId: "user-1",
      spaceId: "space-1",
      exams: sampleExams,
      questions: sampleQuestions,
    });

    expect(plan.questions.length).toBe(sampleQuestions.length);
    expect(plan.exams.length).toBe(sampleExams.length);

    const firstExam = plan.exams[0];
    expect(firstExam.object.id).toBe(`e_${String(sampleExams[0].id)}`);
    expect(firstExam.revision.payload.questions.length).toBeGreaterThan(0);
    expect(firstExam.relations.length).toBe(
      firstExam.revision.payload.questions.length,
    );
    expect(firstExam.relations[0].position).toBe(0);
  });

  it("produces deterministic plans on repeated application", () => {
    const plan1 = planMigration({
      ownerId: "user-1",
      spaceId: "space-1",
      exams: sampleExams,
      questions: sampleQuestions,
    });

    const plan2 = planMigration({
      ownerId: "user-1",
      spaceId: "space-1",
      exams: sampleExams,
      questions: sampleQuestions,
    });

    expect(plan1).toEqual(plan2);
  });
});
