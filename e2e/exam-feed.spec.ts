import { expect, type Page, test } from "@playwright/test";

try {
  process.loadEnvFile(".env.local");
} catch {
  // Optional: fall back to the client's default project id.
}

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "notes-app-dev";
const AUTH_URL = "http://127.0.0.1:9099";
const FIRESTORE_URL = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
// The emulator treats this bearer token as an admin and skips security rules.
const ADMIN_HEADERS = {
  Authorization: "Bearer owner",
  "Content-Type": "application/json",
};

type RestValue = Record<string, unknown>;

function toRestValue(value: unknown): RestValue {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toRestValue) } };
  }
  return {
    mapValue: { fields: toRestFields(value as Record<string, unknown>) },
  };
}

function toRestFields(
  data: Record<string, unknown>,
): Record<string, RestValue> {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, toRestValue(value)]),
  );
}

async function seedDocument(path: string, data: Record<string, unknown>) {
  const response = await fetch(`${FIRESTORE_URL}/${path}`, {
    method: "PATCH",
    headers: ADMIN_HEADERS,
    body: JSON.stringify({ fields: toRestFields(data) }),
  });
  expect(response.ok, `seed ${path}: ${response.status}`).toBe(true);
}

async function readDocument(path: string) {
  const response = await fetch(`${FIRESTORE_URL}/${path}`, {
    headers: ADMIN_HEADERS,
  });
  return response.ok ? response.json() : null;
}

async function listDocuments(path: string): Promise<unknown[]> {
  const response = await fetch(`${FIRESTORE_URL}/${path}`, {
    headers: ADMIN_HEADERS,
  });
  const body = await response.json();
  return body.documents ?? [];
}

async function createUser(email: string, password: string): Promise<string> {
  const response = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=e2e`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  expect(response.ok, `create user: ${response.status}`).toBe(true);
  return (await response.json()).localId;
}

async function seedExam(uid: string, spaceId: string, examId: string) {
  const now = new Date();
  const spacePath = `users/${uid}/spaces/${spaceId}`;
  const base = {
    schemaVersion: 4,
    spaceId,
    lifecycleState: "active",
    stateVersion: 1,
    createdAt: now,
    updatedAt: now,
  };
  const questions = [
    {
      id: "q1",
      statement: "Which service runs stateless containers without servers?",
      options: [
        { id: "a", text: "Cloud Run" },
        { id: "b", text: "Compute Engine" },
      ],
      correctOptionIds: ["a"],
      groundedExplanation: {
        text: "Cloud Run is a fully managed serverless container platform.",
        referenceUrls: ["https://cloud.google.com/run/docs"],
        answerProvenance: "official",
      },
    },
    {
      id: "q2",
      statement: "Which service stores unstructured objects?",
      options: [
        { id: "a", text: "Cloud SQL" },
        { id: "b", text: "Cloud Storage" },
      ],
      correctOptionIds: ["b"],
    },
  ];

  await seedDocument(spacePath, {
    id: spaceId,
    ownerId: uid,
    name: "Exam Space",
    description: "",
    icon: "folder",
    schemaVersion: 1,
    stateVersion: 1,
    createdAt: now,
    updatedAt: now,
  });
  await seedDocument(`${spacePath}/objects/${examId}`, {
    ...base,
    objectTypeId: "exam",
    title: "Cloud Fundamentals",
    properties: {
      provider: "Google Cloud",
      code: "CDL",
      totalQuestionsCount: questions.length,
      passingScorePercentage: 70,
      questionIds: questions.map((question) => question.id),
    },
  });

  for (const [orderIndex, question] of questions.entries()) {
    const { id, ...properties } = question;
    await seedDocument(`${spacePath}/objects/${id}`, {
      ...base,
      objectTypeId: "question",
      title: `Question ${orderIndex + 1}`,
      properties: {
        ...properties,
        examId,
        orderIndex,
        format: "single_choice",
      },
    });
    await seedDocument(`${spacePath}/cards/card-${id}`, {
      schemaVersion: 4,
      spaceId,
      questionId: id,
      cardIndex: 0,
      state: 0,
      due: now,
      stability: 0,
      difficulty: 5,
      elapsedDays: 0,
      scheduledDays: 0,
      reps: 0,
      lapses: 0,
      lastReview: null,
      stateVersion: 1,
      updatedAt: now,
    });
  }
}

async function signInThroughLogin(
  page: Page,
  email: string,
  password: string,
  next: string,
) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(`**${next}`);
}

test.describe("Exam feed", () => {
  test("gives instant feedback and persists attempts with FSRS updates", async ({
    page,
  }) => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const email = `exam-e2e-${suffix}@notesapp.dev`;
    const password = "emulatorPassword123";
    const spaceId = `exam-space-${suffix}`;
    const examId = `exam-${suffix}`;
    const uid = await createUser(email, password);
    await seedExam(uid, spaceId, examId);

    await signInThroughLogin(page, email, password, `/${spaceId}`);

    // The feed is discoverable from the space sidebar, no URL typing needed.
    await page.getByRole("link", { name: "Cloud Fundamentals" }).click();
    await page.waitForURL(`**/${spaceId}/exams/${examId}`);

    const cards = page.locator('[data-slot="question-card"]');
    await expect(cards).toHaveCount(2);

    // Correct answer: instant feedback, non-color indicator and explanation.
    const first = cards.nth(0);
    await first.getByRole("button", { name: /Cloud Run/ }).click();
    await expect(first).toHaveAttribute("data-status", "answeredCorrect");
    await expect(first.getByText("Correct", { exact: true })).toBeVisible();
    await expect(
      first.locator('[data-slot="question-explanation"]'),
    ).toBeVisible();

    // Incorrect answer flags the pick and reveals the right option.
    const second = cards.nth(1);
    await second.getByRole("button", { name: /Cloud SQL/ }).click();
    await expect(second).toHaveAttribute("data-status", "answeredIncorrect");
    await expect(second.getByText("Incorrect", { exact: true })).toBeVisible();
    await expect(second.getByText("Option B is correct")).toBeAttached();

    // Atomic dual-write: two immutable attempts and both cards advanced.
    const spacePath = `users/${uid}/spaces/${spaceId}`;
    await expect
      .poll(async () => (await listDocuments(`${spacePath}/attempts`)).length)
      .toBe(2);
    for (const questionId of ["q1", "q2"]) {
      const card = await readDocument(`${spacePath}/cards/card-${questionId}`);
      expect(card.fields.stateVersion.integerValue).toBe("2");
      expect(card.fields.reps.integerValue).toBe("1");
    }
  });
});
