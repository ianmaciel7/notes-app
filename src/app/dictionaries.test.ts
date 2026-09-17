// @vitest-environment node

import { describe, expect, it } from "vitest";

import { getDictionary } from "./[lang]/dictionaries";

describe("getDictionary", () => {
  it("loads the requested locale's typed messages", async () => {
    await expect(getDictionary("pt-BR")).resolves.toMatchObject({
      home: { deployNow: "Implantar agora" },
    });
  });
});
