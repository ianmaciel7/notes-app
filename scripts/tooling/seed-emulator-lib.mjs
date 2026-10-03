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
export const ADMIN_HEADERS = {
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

// One sample per question type (ADR 0018). `examId` and `orderIndex` are added
// when the documents are built; nothing here uses the legacy ExamTopics shape.
const QUESTIONS = [
  {
    id: "q1",
    type: "single-choice",
    prompt:
      "A company wants to run stateless containers without managing servers. Which Google Cloud service fits best?",
    options: [
      {
        id: "a",
        text: "Cloud Run",
        explanation: "Fully managed containers that scale to zero.",
      },
      {
        id: "b",
        text: "Compute Engine",
        explanation: "You manage the virtual machines yourself.",
      },
      { id: "c", text: "Cloud SQL" },
      { id: "d", text: "Cloud Storage" },
    ],
    correctAnswer: "a",
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
    type: "multiple-choice",
    prompt: "Which two services are serverless? (Choose two.)",
    options: [
      { id: "a", text: "Cloud Run" },
      { id: "b", text: "Compute Engine" },
      { id: "c", text: "Cloud Functions" },
      { id: "d", text: "Persistent Disk" },
    ],
    correctAnswer: ["a", "c"],
  },
  {
    id: "q3",
    type: "true-false",
    prompt: "Cloud Run can scale to zero instances when there is no traffic.",
    options: [
      { id: "true", text: "True" },
      { id: "false", text: "False" },
    ],
    correctAnswer: "true",
    explanation: {
      text: "Scaling to zero is a core Cloud Run behavior.",
      referenceUrls: [],
      answerProvenance: "official",
    },
  },
  {
    id: "q4",
    type: "fill-blank",
    prompt:
      "The fully managed container platform from Google Cloud is Cloud ____.",
    correctAnswer: ["Run", "Cloud Run"],
  },
  {
    id: "q5",
    type: "matching",
    prompt: "Match each service with its category.",
    leftItems: [
      { id: "l1", text: "Cloud Run" },
      { id: "l2", text: "Cloud SQL" },
      { id: "l3", text: "Cloud Storage" },
    ],
    rightItems: [
      { id: "r1", text: "Compute" },
      { id: "r2", text: "Relational database" },
      { id: "r3", text: "Object storage" },
      { id: "r4", text: "Networking" },
    ],
    correctAnswer: { l1: "r1", l2: "r2", l3: "r3" },
  },
  {
    id: "q6",
    type: "drag-and-drop",
    prompt: "Place the layers of a typical web request path in order.",
    items: [
      { id: "i1", text: "Load balancer" },
      { id: "i2", text: "Cloud Run service" },
      { id: "i3", text: "Cloud SQL database" },
      { id: "i4", text: "Pub/Sub topic" },
    ],
    slots: [
      { id: "s1", label: "First" },
      { id: "s2", label: "Second" },
      { id: "s3", label: "Third" },
    ],
    correctAnswer: { s1: "i1", s2: "i2", s3: "i3" },
  },
  {
    id: "q7",
    type: "hotspot",
    prompt: "Select the component that stores the application data.",
    image: {
      url: "/seed/architecture.svg",
      alt: "Diagram with a load balancer on the left, a service in the middle and a database on the right",
    },
    areas: [
      {
        id: "lb",
        label: "Load balancer",
        shape: { kind: "rect", x: 5, y: 35, width: 20, height: 30 },
      },
      {
        id: "svc",
        label: "Service",
        shape: { kind: "rect", x: 40, y: 35, width: 20, height: 30 },
      },
      {
        id: "db",
        label: "Database",
        shape: { kind: "rect", x: 75, y: 35, width: 20, height: 30 },
        explanation: "Cloud SQL keeps the relational data.",
      },
    ],
    correctAnswer: ["db"],
  },
  {
    id: "q8",
    type: "case-study",
    prompt: "Read the case study and answer the questions.",
    title: "Acme migration",
    context: "Acme Corp runs a monolith on-premises and wants to modernize it.",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content: "Acme sells widgets online and has seasonal traffic spikes.",
      },
      {
        id: "goals",
        title: "Goals",
        content: "Reduce operational cost and scale automatically.",
      },
    ],
    parts: [
      {
        id: "p1",
        type: "single-choice",
        prompt: "Which approach best fits the goals?",
        options: [
          { id: "a", text: "Serverless containers" },
          { id: "b", text: "More virtual machines" },
        ],
        explanation: "Serverless removes server management and scales out.",
      },
      {
        id: "p2",
        type: "fill-blank",
        prompt: "Which billing model charges only for what runs?",
      },
    ],
    correctAnswer: { p1: "a", p2: ["pay per use", "pay as you go"] },
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

  for (const [orderIndex, { id, ...fields }] of QUESTIONS.entries()) {
    const properties = { ...fields, examId: EXAM_ID, orderIndex };
    documents.push(
      {
        path: `${spacePath}/objects/${id}`,
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
        path: `${spacePath}/cards/card-${id}`,
        data: {
          schemaVersion: 4,
          spaceId: SPACE_ID,
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
