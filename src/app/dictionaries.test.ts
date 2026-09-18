// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

vi.mock("next/root-params", () => ({
  lang: vi.fn(async () => "en"),
}));

import { getDictionary } from "./[lang]/dictionaries";

describe("getDictionary", () => {
  it("loads the English dictionary", async () => {
    await expect(getDictionary("en")).resolves.toMatchObject({
      home: { deployNow: "Deploy Now" },
    });
  });

  it("loads the Portuguese dictionary", async () => {
    await expect(getDictionary("pt-BR")).resolves.toMatchObject({
      home: { deployNow: "Implantar agora" },
    });
  });

  it("loads dictionary using root-params when no locale is passed", async () => {
    await expect(getDictionary()).resolves.toMatchObject({
      home: { deployNow: "Deploy Now" },
    });
  });

  it("rejects unsupported locales before dictionary lookup with notFound", async () => {
    await expect(getDictionary("fr")).rejects.toThrow();
  });
});
