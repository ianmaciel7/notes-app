const projectId = "demo-notes-app";
const email = "student@example.test";
const password = "correct-horse-battery-staple";

// Fixed lowercase UUID v4 ids keep the committed fixture deterministic (ADR 0010).
const spaces = [
  {
    description: "Notes and flashcards for the current semester.",
    icon: "book-open",
    id: "6f1c2d3e-4a5b-4c6d-8e7f-0a1b2c3d4e5f",
    name: "Studies",
  },
  {
    icon: "graduation-cap",
    id: "9b8a7c6d-5e4f-4a3b-9c2d-1e0f9a8b7c6d",
    name: "Exam preparation",
  },
];

const response = await fetch(
  "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key",
  {
    body: JSON.stringify({ email, password, returnSecureToken: true }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  },
);

if (!response.ok) {
  throw new Error(`Could not seed Auth Emulator: ${await response.text()}`);
}

const { idToken, localId: uid } = await response.json();

// Written as the seeded user so firestore.rules validate every Space.
const documents = `projects/${projectId}/databases/(default)/documents`;
const writes = spaces.map((space) => {
  const fields = {
    icon: { stringValue: space.icon },
    id: { stringValue: space.id },
    name: { stringValue: space.name },
    ownerId: { stringValue: uid },
    stateVersion: { integerValue: "1" },
  };
  if (space.description) {
    fields.description = { stringValue: space.description };
  }
  return {
    currentDocument: { exists: false },
    update: { fields, name: `${documents}/users/${uid}/spaces/${space.id}` },
    updateTransforms: ["createdAt", "updatedAt"].map((fieldPath) => ({
      fieldPath,
      setToServerValue: "REQUEST_TIME",
    })),
  };
});

const commit = await fetch(`http://127.0.0.1:8080/v1/${documents}:commit`, {
  body: JSON.stringify({ writes }),
  headers: {
    Authorization: `Bearer ${idToken}`,
    "Content-Type": "application/json",
  },
  method: "POST",
});

if (!commit.ok) {
  throw new Error(`Could not seed Spaces: ${await commit.text()}`);
}

console.log(`Seeded ${email} with ${spaces.length} Spaces.`);
