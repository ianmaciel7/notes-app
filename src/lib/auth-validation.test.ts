import { describe, expect, it } from "vitest";

import {
  emailSchema,
  getSafeRedirectUrl,
  loginSchema,
  passwordSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth-validation";

describe("auth-validation", () => {
  describe("getSafeRedirectUrl", () => {
    it("allows valid relative paths and paths with query params or hashes", () => {
      expect(getSafeRedirectUrl("/")).toBe("/");
      expect(getSafeRedirectUrl("/dashboard")).toBe("/dashboard");
      expect(getSafeRedirectUrl("/decks/123/study")).toBe("/decks/123/study");
      expect(getSafeRedirectUrl("/library?sort=desc&tag=science")).toBe("/library?sort=desc&tag=science");
      expect(getSafeRedirectUrl("/notes#heading-1")).toBe("/notes#heading-1");
      expect(getSafeRedirectUrl("  /settings  ")).toBe("/settings");
    });

    it("allows nested query strings without protocol scheme", () => {
      expect(getSafeRedirectUrl("/auth?redirect=/dashboard&step=2")).toBe("/auth?redirect=/dashboard&step=2");
      expect(getSafeRedirectUrl("/login?returnTo=%2Fdecks%2F42")).toBe("/login?returnTo=%2Fdecks%2F42");
    });

    it("blocks protocol-relative URLs", () => {
      expect(getSafeRedirectUrl("//malicious.com")).toBe("/");
      expect(getSafeRedirectUrl("//attacker.com/steal-token")).toBe("/");
      expect(getSafeRedirectUrl("//")).toBe("/");
      expect(getSafeRedirectUrl("  //evil.com  ")).toBe("/");
    });

    it("blocks backslash protocol-relative tricks", () => {
      expect(getSafeRedirectUrl("/\\malicious.com")).toBe("/");
      expect(getSafeRedirectUrl("/\\attacker.com/path")).toBe("/");
    });

    it("blocks absolute URLs with schemes", () => {
      expect(getSafeRedirectUrl("https://attacker.com")).toBe("/");
      expect(getSafeRedirectUrl("http://evil.com/phishing")).toBe("/");
      expect(getSafeRedirectUrl("ftp://ftp.example.com")).toBe("/");
      expect(getSafeRedirectUrl("custom-scheme://action")).toBe("/");
      expect(getSafeRedirectUrl("/redirect?target=https://evil.com")).toBe("/");
    });

    it("blocks javascript and data URI schemes", () => {
      expect(getSafeRedirectUrl("javascript:alert(1)")).toBe("/");
      expect(getSafeRedirectUrl("javascript:void(0)")).toBe("/");
      expect(getSafeRedirectUrl("data:text/html,<script>alert(1)</script>")).toBe("/");
    });

    it("blocks CRLF injection characters", () => {
      expect(getSafeRedirectUrl("/dashboard\r\nSet-Cookie:malicious=1")).toBe("/");
      expect(getSafeRedirectUrl("/\nevil")).toBe("/");
      expect(getSafeRedirectUrl("/\revil")).toBe("/");
    });

    it("handles null, undefined, empty strings and non-string inputs with default or custom fallback", () => {
      expect(getSafeRedirectUrl(null)).toBe("/");
      expect(getSafeRedirectUrl(undefined)).toBe("/");
      expect(getSafeRedirectUrl("")).toBe("/");
      expect(getSafeRedirectUrl("   ")).toBe("/");
      expect(getSafeRedirectUrl(123 as unknown as string)).toBe("/");
      expect(getSafeRedirectUrl(null, "/custom-fallback")).toBe("/custom-fallback");
      expect(getSafeRedirectUrl(undefined, "/library")).toBe("/library");
      expect(getSafeRedirectUrl("https://evil.com", "/custom-fallback")).toBe("/custom-fallback");
      expect(getSafeRedirectUrl("/valid-route", "/custom-fallback")).toBe("/valid-route");
    });
  });

  describe("emailSchema", () => {
    it("validates and trims valid email addresses", () => {
      expect(emailSchema.safeParse("user@example.com").success).toBe(true);
      expect(emailSchema.parse("  user@example.com  ")).toBe("user@example.com");
    });

    it("fails for empty or invalid email addresses", () => {
      const emptyResult = emailSchema.safeParse("");
      expect(emptyResult.success).toBe(false);
      if (!emptyResult.success) {
        expect(emptyResult.error.issues[0]?.message).toBe("Informe o endereço de e-mail.");
      }

      const invalidResult = emailSchema.safeParse("not-an-email");
      expect(invalidResult.success).toBe(false);
      if (!invalidResult.success) {
        expect(invalidResult.error.issues[0]?.message).toBe("Formato de e-mail inválido.");
      }
    });
  });

  describe("passwordSchema", () => {
    it("validates passwords with 6 or more characters", () => {
      expect(passwordSchema.safeParse("123456").success).toBe(true);
      expect(passwordSchema.safeParse("long-secure-password").success).toBe(true);
    });

    it("fails for passwords shorter than 6 characters", () => {
      const result = passwordSchema.safeParse("12345");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("A senha deve conter no mínimo 6 caracteres.");
      }
    });
  });

  describe("loginSchema", () => {
    it("validates correct login payload", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "secretpassword",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
        expect(result.data.password).toBe("secretpassword");
      }
    });

    it("rejects empty or invalid email", () => {
      const emptyEmailResult = loginSchema.safeParse({
        email: "",
        password: "secretpassword",
      });
      expect(emptyEmailResult.success).toBe(false);

      const invalidEmailResult = loginSchema.safeParse({
        email: "invalid-email",
        password: "secretpassword",
      });
      expect(invalidEmailResult.success).toBe(false);
    });

    it("rejects empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Informe a senha.");
      }
    });
  });

  describe("registerSchema", () => {
    it("validates correct registration payload with displayName", () => {
      const result = registerSchema.safeParse({
        displayName: "  Maria Silva  ",
        email: "maria@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.displayName).toBe("Maria Silva");
        expect(result.data.email).toBe("maria@example.com");
      }
    });

    it("validates registration payload without displayName", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects displayName longer than 60 characters", () => {
      const result = registerSchema.safeParse({
        displayName: "A".repeat(61),
        email: "user@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Nome muito longo.");
      }
    });

    it("rejects password with less than 6 characters", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "123",
        confirmPassword: "123",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("A senha deve conter no mínimo 6 caracteres.");
      }
    });

    it("rejects when confirmPassword is empty", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === "Confirme sua senha.")).toBe(true);
      }
    });

    it("rejects when passwords do not match", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "password123",
        confirmPassword: "different-password",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.message === "As senhas não coincidem.")).toBe(true);
      }
    });
  });

  describe("resetPasswordSchema", () => {
    it("validates correct email for password reset", () => {
      const result = resetPasswordSchema.safeParse({
        email: "reset@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty or invalid email for password reset", () => {
      const emptyResult = resetPasswordSchema.safeParse({ email: "" });
      expect(emptyResult.success).toBe(false);

      const invalidResult = resetPasswordSchema.safeParse({ email: "invalid-email" });
      expect(invalidResult.success).toBe(false);
    });
  });
});
