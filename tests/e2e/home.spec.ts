import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const AUTH_EMULATOR_OOB_CODES_URL =
  "http://127.0.0.1:9099/emulator/v1/projects/demo-notes-app/oobCodes";
const AUTH_EMULATOR_VERIFICATION_CODES_URL =
  "http://127.0.0.1:9099/emulator/v1/projects/demo-notes-app/verificationCodes";

test("registers, signs in, recovers a password, and protects the study workspace", async ({
  page,
}, testInfo) => {
  const email = `new-student-${testInfo.retry}-${Date.now()}@example.test`;
  const password = "correct-horse-battery-staple";

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).disableRules(["region"]).analyze())
      .violations,
  ).toEqual([]);

  await page.getByRole("link", { name: /sign up/i }).click();
  await expect(page).toHaveURL(/\/sign-up$/);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).disableRules(["region"]).analyze())
      .violations,
  ).toEqual([]);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  await page.getByRole("link", { name: /forgot password/i }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByRole("button", { name: /reset password/i }).click();
  await expect(page.getByText(/check your email/i)).toBeVisible();

  await page.goto("/email-link");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByRole("button", { name: /send sign-in link/i }).click();
  await expect(page.getByText(/sign-in link sent/i)).toBeVisible();

  const codesResponse = await fetch(AUTH_EMULATOR_OOB_CODES_URL);
  const { oobCodes } = (await codesResponse.json()) as {
    oobCodes: Array<{
      email: string;
      oobLink: string;
      requestType: string;
    }>;
  };
  const emailLink = oobCodes.find(
    (code) =>
      code.email === email &&
      code.requestType === "EMAIL_SIGNIN" &&
      code.oobLink,
  );

  expect(emailLink?.oobLink).toBeTruthy();
  await page.goto(emailLink?.oobLink ?? "");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(`Signed in as ${email}`)).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await page.goto("/phone");
  await page.getByLabel(/phone number/i).fill("6505551234");
  const sendCode = page.getByRole("button", { name: /send code/i });
  await expect(sendCode).toBeEnabled();
  await sendCode.click();
  await expect(page.getByLabel(/verification code/i)).toBeVisible();

  const verificationResponse = await fetch(
    AUTH_EMULATOR_VERIFICATION_CODES_URL,
  );
  const { verificationCodes } = (await verificationResponse.json()) as {
    verificationCodes: Array<{ code: string; phoneNumber: string }>;
  };
  const verificationCode = verificationCodes.find(
    (code) => code.phoneNumber === "+16505551234",
  );

  expect(verificationCode?.code).toBeTruthy();
  await page
    .getByLabel(/verification code/i)
    .fill(verificationCode?.code ?? "");
  await page.getByRole("button", { name: /verify code/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in$/);
});

async function latestVerificationCode(phoneNumber: string) {
  const response = await fetch(AUTH_EMULATOR_VERIFICATION_CODES_URL);
  const { verificationCodes } = (await response.json()) as {
    verificationCodes: Array<{ code: string; phoneNumber: string }>;
  };

  return verificationCodes
    .filter((code) => code.phoneNumber === phoneNumber)
    .at(-1)?.code;
}

test("enrolls an SMS second factor and asserts it at sign-in", async ({
  page,
}) => {
  const email = `mfa-student-${Date.now()}@example.test`;
  const password = "correct-horse-battery-staple";

  await page.goto("/sign-up");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.getByRole("button", { name: "Sign out" }).click();

  await page.goto("/email-link");
  await page.getByLabel(/email address/i).fill(email);
  await page.getByRole("button", { name: /send sign-in link/i }).click();
  await expect(page.getByText(/sign-in link sent/i)).toBeVisible();
  const oobResponse = await fetch(AUTH_EMULATOR_OOB_CODES_URL);
  const { oobCodes } = (await oobResponse.json()) as {
    oobCodes: Array<{ email: string; oobLink: string; requestType: string }>;
  };
  const signInLink = oobCodes.find(
    (code) => code.email === email && code.requestType === "EMAIL_SIGNIN",
  );
  await page.goto(signInLink?.oobLink ?? "");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: /^settings$/i }).click();
  await expect(page).toHaveURL(/\/settings$/);
  await page.getByLabel(/display name/i).fill("Test phone");
  await page.getByLabel(/phone number/i).fill("6505559876");
  const sendEnrollmentCode = page.getByRole("button", { name: /send code/i });
  await expect(sendEnrollmentCode).toBeEnabled();
  await sendEnrollmentCode.click();
  await expect(page.getByLabel(/verification code/i)).toBeVisible();
  await page
    .getByLabel(/verification code/i)
    .fill((await latestVerificationCode("+16505559876")) ?? "");
  await page.getByRole("button", { name: /verify code/i }).click();
  await expect(page.getByText(/sms second factor enrolled/i)).toBeVisible();

  // The enrolled state comes from Firebase, so it survives a reload.
  await page.reload();
  await expect(page.getByText(/sms second factor enrolled/i)).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^remove test phone$/i }),
  ).toBeVisible();

  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);

  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.getByRole("button", { name: /send code/i }).click();
  await expect(page.getByLabel(/verification code/i)).toBeVisible();
  await page
    .getByLabel(/verification code/i)
    .fill((await latestVerificationCode("+16505559876")) ?? "");
  await page.getByRole("button", { name: /verify code/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: /^settings$/i }).click();
  await page.getByRole("button", { name: /^remove test phone$/i }).click();
  await expect(page.getByLabel(/phone number/i)).toBeVisible();
});

test("asks for a verified e-mail before offering a second factor", async ({
  page,
}) => {
  await page.goto("/sign-up");
  await page
    .getByLabel(/email address/i)
    .fill(`unverified-${Date.now()}@example.test`);
  await page.getByLabel(/password/i).fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("link", { name: /^settings$/i }).click();
  await expect(page.getByText(/verify your e-mail address/i)).toBeVisible();
  await expect(page.getByLabel(/phone number/i)).toHaveCount(0);
  await page.getByRole("button", { name: /send verification e-mail/i }).click();
  await expect(page.getByText(/verification e-mail sent/i)).toBeVisible();
});

test("signs in with the Emulator-hosted Google provider via popup", async ({
  page,
}) => {
  await page.goto("/sign-in");

  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: /sign in with google/i }).click();
  const popup = await popupPromise;

  await popup.waitForURL(/\/emulator\/auth\/handler/);
  await popup.getByText(/add new account/i).click();
  await popup.getByRole("button", { name: /auto-generate/i }).click();
  await popup.getByRole("button", { name: /sign in with google/i }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/signed in as/i)).toBeVisible();
});

test.describe("embedded Electron browser", () => {
  test.use({
    userAgent: "Mozilla/5.0 Chrome/140 Electron/38.0.0 Safari/537.36",
  });

  test("signs in with the Emulator-hosted Google provider via redirect", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByRole("button", { name: /sign in with google/i }).click();

    await page.waitForURL(/\/emulator\/auth\/handler/);
    await page.getByText(/add new account/i).click();
    await page.getByRole("button", { name: /auto-generate/i }).click();
    await page.getByRole("button", { name: /sign in with google/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/signed in as/i)).toBeVisible();
  });
});
