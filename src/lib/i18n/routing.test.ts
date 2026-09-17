import { describe, expect, it } from "vitest";

import { localePath } from "./routing";

describe("localePath", () => {
  it("builds auth paths under the active locale", () => {
    expect(localePath("pt-BR", "/sign-in")).toBe("/pt-BR/sign-in");
    expect(localePath("en", "/")).toBe("/en");
  });
});
