// Pure helpers for seeding the local Firebase emulators with a Google-linked
// user and a sample exam. The Auth emulator's "Sign-in with Google" widget only
// lists accounts that carry the `google.com` provider, so users are created
// through `signInWithIdp` with a mock id_token instead of `signUp`.

export const AUTH_URL = "http://127.0.0.1:9099";
export const FIRESTORE_HOST = "http://127.0.0.1:8080";
export const DEFAULT_USER = { email: "demo@notesapp.dev", name: "Demo User" };
export const SPACE_ID = "demo-space";
export const EXAM_ID = "gcp-cdl";

// The emulator treats this bearer token as an admin and skips security rules.
const ADMIN_HEADERS = {
  Authorization: "Bearer owner",
  "Content-Type": "application/json",
};

export function toRestValue(value) {
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
  return { mapValue: { fields: toRestFields(value) } };
}

export function toRestFields(data) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, toRestValue(value)]),
  );
}

/** OIDC claim names (snake_case) kept out of declared identifiers. */
const CLAIMS = { emailVerified: "email_verified" };

/** Mock Google credential body understood by the Auth emulator. */
export function googleIdpPostBody({ email, name }) {
  const idToken = JSON.stringify({
    sub: `google-${email}`,
    email,
    [CLAIMS.emailVerified]: true,
    name,
  });
  return `providerId=google.com&id_token=${idToken}`;
}

const QUESTIONS = [
  {
    id: "q1",
    format: "single_choice",
    statement:
      "A company wants to run stateless containers without managing servers. Which Google Cloud service fits best?",
    options: [
      ["a", "Cloud Run"],
      ["b", "Compute Engine"],
      ["c", "Cloud SQL"],
      ["d", "Cloud Storage"],
    ],
    correct: ["a"],
    explanation: {
      text: "Cloud Run runs stateless containers on a fully managed platform and scales to zero.",
      referenceUrls: [
        "https://cloud.google.com/run/docs/overview/what-is-cloud-run",
      ],
      answerProvenance: "official",
    },
  },
  {
    id: "q2",
    format: "multiple_choice",
    statement: "Which two services are serverless? (Choose two.)",
    options: [
      ["a", "Cloud Run"],
      ["b", "Compute Engine"],
      ["c", "Cloud Functions"],
      ["d", "Persistent Disk"],
    ],
    correct: ["a", "c"],
  },
  {
    id: "q3",
    format: "single_choice",
    statement: "Which service stores unstructured objects such as images?",
    options: [
      ["a", "Cloud SQL"],
      ["b", "Cloud Storage"],
      ["c", "Bigtable"],
    ],
    correct: ["b"],
    explanation: {
      text: "Cloud Storage is object storage for unstructured data.",
      referenceUrls: [],
      answerProvenance: "official",
    },
  },
];

/** Documents (relative to the Firestore root) for one user's sample exam. */
export function buildExamSeed({ uid, now }) {
  const spacePath = `users/${uid}/spaces/${SPACE_ID}`;
  const base = {
    schemaVersion: 4,
    spaceId: SPACE_ID,
    lifecycleState: "active",
    stateVersion: 1,
    createdAt: now,
    updatedAt: now,
  };
  const documents = [
    {
      path: spacePath,
      data: {
        id: SPACE_ID,
        ownerId: uid,
        name: "Cloud Study",
        description: "",
        icon: "folder",
        schemaVersion: 1,
        stateVersion: 1,
        createdAt: now,
        updatedAt: now,
      },
    },
    {
      path: `${spacePath}/objects/${EXAM_ID}`,
      data: {
        ...base,
        objectTypeId: "exam",
        title: "Google Cloud Digital Leader",
        properties: {
          provider: "Google Cloud",
          code: "CDL",
          totalQuestionsCount: QUESTIONS.length,
          passingScorePercentage: 70,
          questionIds: QUESTIONS.map((question) => question.id),
        },
      },
    },
  ];

  for (const [orderIndex, question] of QUESTIONS.entries()) {
    const properties = {
      statement: question.statement,
      options: question.options.map(([id, text]) => ({ id, text })),
      correctOptionIds: question.correct,
      examId: EXAM_ID,
      orderIndex,
      format: question.format,
    };
    if (question.explanation) {
      properties.groundedExplanation = question.explanation;
    }
    documents.push(
      {
        path: `${spacePath}/objects/${question.id}`,
        data: {
          ...base,
          objectTypeId: "question",
          title: `Question ${orderIndex + 1}`,
          properties,
        },
      },
      {
        // Placeholder memory values satisfy firestore.rules (difficulty 1..10);
        // scheduleCard ignores them while the card is New.
        path: `${spacePath}/cards/card-${question.id}`,
        data: {
          schemaVersion: 4,
          spaceId: SPACE_ID,
          questionId: question.id,
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
        },
      },
    );
  }

  return documents;
}

async function ensureOk(response, label) {
  if (!response.ok) {
    throw new Error(
      `${label} failed: ${response.status} ${await response.text()}`,
    );
  }
  return response;
}

/**
 * Creates (or links) the Google identity for `email` and returns its uid.
 * An existing account with the same email keeps its uid, so seeded data stays
 * attached to the account you already use.
 */
export async function ensureGoogleUser({ fetchFn, user }) {
  const response = await ensureOk(
    await fetchFn(
      `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=seed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestUri: "http://localhost",
          returnSecureToken: true,
          returnIdpCredential: true,
          postBody: googleIdpPostBody(user),
        }),
      },
    ),
    `signInWithIdp(${user.email})`,
  );
  return (await response.json()).localId;
}

export async function writeDocument({ fetchFn, projectId, path, data }) {
  const url = `${FIRESTORE_HOST}/v1/projects/${projectId}/databases/(default)/documents/${path}`;
  await ensureOk(
    await fetchFn(url, {
      method: "PATCH",
      headers: ADMIN_HEADERS,
      body: JSON.stringify({ fields: toRestFields(data) }),
    }),
    `write ${path}`,
  );
}

/** Seeds every user; returns `{ email, uid, url }` per user. */
export async function seedEmulator({
  fetchFn = fetch,
  projectId,
  users,
  now = new Date(),
}) {
  const results = [];
  for (const user of users) {
    const uid = await ensureGoogleUser({ fetchFn, user });
    for (const { path, data } of buildExamSeed({ uid, now })) {
      await writeDocument({ fetchFn, projectId, path, data });
    }
    results.push({
      email: user.email,
      uid,
      url: `/${SPACE_ID}/exams/${EXAM_ID}`,
    });
  }
  return results;
}

/** Parses repeated `--email <address>` flags; falls back to the demo user. */
export function parseUsers(argv) {
  const users = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--email" && argv[index + 1]) {
      const email = argv[index + 1];
      users.push({ email, name: email.split("@")[0] });
      index += 1;
    }
  }
  return users.length > 0 ? users : [DEFAULT_USER];
}
