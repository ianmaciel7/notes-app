import { describe, expect, it } from "vitest";

import { localePath } from "./routing";

describe("localePath", () => {
  it("builds auth paths under the active locale", () => {
    expect(localePath("pt-BR", "/sign-in")).toBe("/pt-BR/sign-in");
    expect(localePath("en", "/")).toBe("/en");
  });

  it("keeps the active locale for auth redirects", () => {
    expect(localePath("pt-BR", "/sign-in")).not.toBe("/sign-in");
    expect(localePath("pt-BR", "/sign-in")).toBe("/pt-BR/sign-in");
  });

  it("replaces an existing locale prefix instead of duplicating it", () => {
    expect(localePath("en", "/pt-BR/sign-in")).toBe("/en/sign-in");
    expect(localePath("pt-BR", "/en")).toBe("/pt-BR");
  });

  it("preserves query strings and hashes", () => {
    expect(localePath("pt-BR", "/sign-in?next=/settings#email")).toBe(
      "/pt-BR/sign-in?next=/settings#email",
    );
  });
});
