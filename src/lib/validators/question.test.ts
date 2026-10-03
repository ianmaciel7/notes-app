import { describe, expect, it } from "vitest";
import { validateQuestionProperties } from "./question";

const valid = {
  statement: " Which service? ",
  options: [
    { id: "a", text: "Cloud Run" },
    { id: "b", text: "Compute Engine" },
  ],
  correctOptionIds: ["a"],
  examId: "exam-1",
  orderIndex: 0,
  format: "single_choice",
};

describe("validateQuestionProperties", () => {
  it("accepts a valid single choice question", () => {
    const result = validateQuestionProperties(valid);
    expect(result.success).toBe(true);
    expect(result.data?.statement).toBe("Which service?");
    expect(result.data).not.toHaveProperty("groundedExplanation");
  });

  it("accepts multiple choice with a grounded explanation", () => {
    const result = validateQuestionProperties({
      ...valid,
      format: "multiple_choice",
      correctOptionIds: ["a", "b"],
      groundedExplanation: {
        text: " Because. ",
        referenceUrls: ["https://example.com", 1],
        answerProvenance: "official",
      },
    });
    expect(result.success).toBe(true);
    expect(result.data?.groundedExplanation).toEqual({
      text: "Because.",
      referenceUrls: ["https://example.com"],
      answerProvenance: "official",
    });
  });

  it("defaults missing referenceUrls to an empty array", () => {
    const result = validateQuestionProperties({
      ...valid,
      groundedExplanation: { text: "x", answerProvenance: "ai" },
    });
    expect(result.data?.groundedExplanation?.referenceUrls).toEqual([]);
  });

  it("rejects non-object input", () => {
    expect(validateQuestionProperties(undefined).error).toBe("invalidInput");
  });

  it("reports missing statement, exam, order, and format", () => {
    const result = validateQuestionProperties({
      ...valid,
      statement: "",
      examId: "",
      orderIndex: -1,
      format: "essay",
    });
    expect(result.fieldErrors).toMatchObject({
      statement: "statementRequired",
      examId: "examIdRequired",
      orderIndex: "invalidOrderIndex",
      format: "invalidFormat",
    });
  });

  it("rejects malformed and too few options", () => {
    expect(
      validateQuestionProperties({ ...valid, options: "x" }).fieldErrors
        ?.options,
    ).toBe("invalidOption");
    expect(
      validateQuestionProperties({ ...valid, options: [null] }).fieldErrors
        ?.options,
    ).toBe("invalidOption");
    expect(
      validateQuestionProperties({ ...valid, options: [{ id: "", text: "x" }] })
        .fieldErrors?.options,
    ).toBe("invalidOption");
    expect(
      validateQuestionProperties({
        ...valid,
        options: [{ id: "a", text: " " }],
      }).fieldErrors?.options,
    ).toBe("invalidOption");
    expect(
      validateQuestionProperties({
        ...valid,
        options: [{ id: "a", text: "x" }],
      }).fieldErrors?.options,
    ).toBe("minOptionsRequired");
  });

  it("validates correct option ids", () => {
    expect(
      validateQuestionProperties({ ...valid, correctOptionIds: [] }).fieldErrors
        ?.correctOptionIds,
    ).toBe("correctOptionsRequired");
    expect(
      validateQuestionProperties({ ...valid, correctOptionIds: ["zzz"] })
        .fieldErrors?.correctOptionIds,
    ).toBe("correctOptionsRequired");
    expect(
      validateQuestionProperties({ ...valid, correctOptionIds: ["a", "b"] })
        .fieldErrors?.correctOptionIds,
    ).toBe("singleChoiceMismatch");
  });

  it("validates grounded explanation", () => {
    expect(
      validateQuestionProperties({ ...valid, groundedExplanation: "x" })
        .fieldErrors?.groundedExplanation,
    ).toBe("invalidExplanation");
    expect(
      validateQuestionProperties({
        ...valid,
        groundedExplanation: { text: " ", answerProvenance: "ai" },
      }).fieldErrors?.groundedExplanation,
    ).toBe("invalidExplanation");
    expect(
      validateQuestionProperties({
        ...valid,
        groundedExplanation: { text: "x", answerProvenance: "bogus" },
      }).fieldErrors?.groundedExplanation,
    ).toBe("invalidProvenance");
  });
});
