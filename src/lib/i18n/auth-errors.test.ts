import { describe, expect, it } from "vitest";

import { getAuthErrorMessage } from "./auth-errors";

describe("getAuthErrorMessage", () => {
  it("translates known auth errors in English", () => {
    const error = { code: "auth/invalid-credential" };
    expect(getAuthErrorMessage(error, "en")).toBe(
      "The email or password is incorrect.",
    );
  });

  it("translates known auth errors in Portuguese", () => {
    const error = { code: "auth/invalid-credential" };
    expect(getAuthErrorMessage(error, "pt-BR")).toBe(
      "O e-mail ou a senha estão incorretos.",
    );
  });

  it("translates network errors into generic network message", () => {
    const error = { code: "auth/network-request-failed" };
    expect(getAuthErrorMessage(error, "pt-BR")).toBe(
      "Não foi possível conectar. Verifique sua conexão e tente novamente.",
    );
  });

  it("falls back to generic unknown auth error for unrecognized codes", () => {
    const error = { code: "auth/something-random" };
    expect(getAuthErrorMessage(error, "en")).toBe(
      "Unable to complete authentication. Please try again.",
    );
    expect(getAuthErrorMessage(error, "pt-BR")).toBe(
      "Não foi possível concluir a autenticação. Tente novamente.",
    );
  });

  it("safely handles non-object and null errors without throwing", () => {
    expect(getAuthErrorMessage(null, "en")).toBe(
      "Unable to complete authentication. Please try again.",
    );
    expect(getAuthErrorMessage("raw string", "en")).toBe(
      "Unable to complete authentication. Please try again.",
    );
  });
});
