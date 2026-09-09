import { expect, it } from "vitest";

import { defaultLocale } from "@/i18n/request";

it("uses Brazilian Portuguese when a workspace has no saved locale", () => {
  expect(defaultLocale).toBe("pt-BR");
});
