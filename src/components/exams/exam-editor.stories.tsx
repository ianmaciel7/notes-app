import type { Story } from "@ladle/react";
import type { ExamAuthoringViewDto } from "@/data/exam-authoring";
import type { QuestionSummaryDto } from "@/data/questions-v2";
import { ExamEditor } from "./exam-editor";

export default {
  title: "Exams / ExamEditor",
};

const mockAvailableQuestions: QuestionSummaryDto[] = [
  {
    id: "q-1",
    spaceId: "space-1",
    title: "What is an Amazon VPC CIDR block?",
    format: "single-choice",
    lifecycle: "published",
    latestRevisionId: "q-1_rev_2",
    publishedRevisionId: "q-1_rev_2",
    tags: ["aws", "networking"],
    updatedAt: "2026-09-19T00:00:00.000Z",
  },
  {
    id: "q-2",
    spaceId: "space-1",
    title: "Which storage services provide POSIX-compliant file systems?",
    format: "multiple-choice",
    lifecycle: "published",
    latestRevisionId: "q-2_rev_1",
    publishedRevisionId: "q-2_rev_1",
    tags: ["aws", "storage"],
    updatedAt: "2026-09-19T00:00:00.000Z",
  },
  {
    id: "q-3",
    spaceId: "space-1",
    title: "S3 Standard provides 99.999999999% durability.",
    format: "true-false",
    lifecycle: "published",
    latestRevisionId: "q-3_rev_1",
    publishedRevisionId: "q-3_rev_1",
    tags: ["aws", "s3"],
    updatedAt: "2026-09-19T00:00:00.000Z",
  },
];

const mockDraftExam: ExamAuthoringViewDto = {
  id: "exam-draft",
  spaceId: "space-1",
  ownerId: "user-1",
  title: "AWS Certified Solutions Architect - Associate",
  lifecycle: "draft",
  latestRevisionId: "exam-draft_rev_1",
  draftPayload: {
    schemaVersion: 1,
    instructions:
      "This practice exam consists of multiple-choice and single-choice questions. Passing score is 72%.",
    passingPercentage: 72,
    questions: [
      {
        questionId: "q-1",
        questionRevisionId: "q-1_rev_1", // older revision to show upgrade warning
        points: 2,
      },
      {
        questionId: "q-2",
        questionRevisionId: "q-2_rev_1",
        points: 3,
      },
    ],
  },
  updatedAt: "2026-09-19T00:00:00.000Z",
};

const mockEmptyExam: ExamAuthoringViewDto = {
  id: "exam-empty",
  spaceId: "space-1",
  ownerId: "user-1",
  title: "New Exam (Empty)",
  lifecycle: "draft",
  latestRevisionId: "exam-empty_rev_1",
  draftPayload: {
    schemaVersion: 1,
    instructions: "",
    passingPercentage: 70,
    questions: [],
  },
  updatedAt: "2026-09-19T00:00:00.000Z",
};

export const DraftWithQuestions: Story = () => (
  <div className="max-w-4xl p-4">
    <ExamEditor
      spaceId="space-1"
      exam={mockDraftExam}
      availableQuestions={mockAvailableQuestions}
    />
  </div>
);

export const EmptyDraft: Story = () => (
  <div className="max-w-4xl p-4">
    <ExamEditor
      spaceId="space-1"
      exam={mockEmptyExam}
      availableQuestions={mockAvailableQuestions}
    />
  </div>
);
