const email = "student@example.test";
const password = "correct-horse-battery-staple";
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

console.log(`Seeded ${email}.`);
