import { describe, expect, it } from "vitest";

import en from "@/messages/en.json";
import es from "@/messages/es.json";
import ptBR from "@/messages/pt-BR.json";

const locales = { en, es, "pt-BR": ptBR } as const;
const requiredStudyObjectTypes = ["flashcard", "study_goal"] as const;

describe("object type messages", () => {
  it.each(Object.entries(locales))(
    "%s includes labels for required study object types",
    (_locale, messages) => {
      for (const objectType of requiredStudyObjectTypes) {
        expect(messages.workspace.objectTypeStudio.objectTypes[objectType]).toBeTruthy();
        expect(messages.workspace.objectTypeStudio.objectTypePlurals[objectType]).toBeTruthy();
      }
    },
  );
});
