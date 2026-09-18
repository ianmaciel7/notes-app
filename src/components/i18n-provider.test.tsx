import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { I18nProvider } from "@/components/i18n-provider";
import ptBR from "@/lib/i18n/dictionaries/pt-BR.json";

describe("I18nProvider", () => {
  afterEach(() => {
    document.documentElement.lang = "en";
    localStorage.clear();
  });

  it("syncs the document language with the active locale", async () => {
    render(
      <I18nProvider dictionary={ptBR} locale="pt-BR">
        <div />
      </I18nProvider>,
    );

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("pt-BR");
    });
  });
});
