import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { QuestionCard } from "@/components/notes-app/question-card";
import { AuthContext } from "@/lib/auth-context";
import messages from "@/messages/en.json";
import type { QuestionObject } from "@/types/object";

const timestamp = new Date("2026-10-03T12:00:00Z");

function buildQuestion(
  properties: Partial<QuestionObject["properties"]> = {},
): QuestionObject {
  return {
    id: "question-1",
    spaceId: "space-1",
    schemaVersion: 4,
    objectTypeId: "question",
    title: "Serverless containers",
    lifecycleState: "active",
    stateVersion: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    properties: {
      type: "single-choice",
      prompt:
        "A company wants to run stateless containers without managing servers. Which Google Cloud service fits best?",
      options: [
        { id: "a", text: "Cloud Run" },
        { id: "b", text: "Compute Engine" },
        { id: "c", text: "Cloud SQL" },
        { id: "d", text: "Cloud Storage" },
      ],
      correctAnswer: "a",
      examId: "exam-1",
      orderIndex: 0,
      ...properties,
    } as any,
  };
}

/** Signed-out context: answers are graded locally and nothing is written. */
function StoryProviders({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <AuthContext
        value={{ user: null, isLoading: false, signOutUser: async () => {} }}
      >
        <div className="max-w-2xl p-4">{children}</div>
      </AuthContext>
    </NextIntlClientProvider>
  );
}

function Story({ question }: { question: QuestionObject }) {
  return (
    <StoryProviders>
      <QuestionCard
        spaceId="space-1"
        question={question}
        card={null}
        index={0}
        total={12}
      />
    </StoryProviders>
  );
}

/** Click any option to see instant correct/incorrect feedback. */
export const Unanswered = () => <Story question={buildQuestion()} />;

/** Clicking an option expands the grounded explanation and reference links. */
export const WithGroundedExplanation = () => (
  <Story
    question={buildQuestion({
      explanation: {
        text: "Cloud Run runs stateless containers on a fully managed platform and scales to zero.",
        referenceUrls: [
          "https://cloud.google.com/run/docs/overview/what-is-cloud-run",
        ],
        answerProvenance: "official",
      },
    })}
  />
);

/** Multiple choice evaluates once the required number of options is selected. */
export const MultipleChoice = () => (
  <Story
    question={buildQuestion({
      type: "multiple-choice",
      prompt: "Which two services are serverless? (Choose two.)",
      correctAnswer: ["a", "c"],
      options: [
        { id: "a", text: "Cloud Run" },
        { id: "b", text: "Compute Engine" },
        { id: "c", text: "Cloud Functions" },
        { id: "d", text: "Persistent Disk" },
      ],
    })}
  />
);
