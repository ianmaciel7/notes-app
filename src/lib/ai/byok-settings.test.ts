import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { createByokSettingsStore } from "@/lib/ai/byok-settings";
import { createKnowledgeDatabase } from "@/lib/db";

const opened: ReturnType<typeof createKnowledgeDatabase>[] = [];

afterEach(async () => {
  await Promise.all(opened.map((database) => database.delete()));
  opened.length = 0;
});

function setup() {
  const database = createKnowledgeDatabase(`test-${crypto.randomUUID()}`);
  opened.push(database);
  return { database, store: createByokSettingsStore(database) };
}

describe("BYOK AI settings", () => {
  it("stores and returns trimmed provider API keys from local settings", async () => {
    const { store } = setup();

    await store.setProviderApiKey("gemini", "  gemini-key  ");
    await store.setProviderApiKey("groq", "groq-key");

    await expect(store.getProviderApiKey("gemini")).resolves.toBe("gemini-key");
    await expect(store.getProviderApiKey("groq")).resolves.toBe("groq-key");
  });

  it("rejects empty provider API keys", async () => {
    const { store } = setup();

    await expect(store.setProviderApiKey("gemini", "   ")).rejects.toThrow("API key is required");
  });

  it("clears one provider key without removing the other provider", async () => {
    const { store } = setup();
    await store.setProviderApiKey("gemini", "gemini-key");
    await store.setProviderApiKey("groq", "groq-key");

    await store.clearProviderApiKey("gemini");

    await expect(store.getProviderApiKey("gemini")).resolves.toBeNull();
    await expect(store.getProviderApiKey("groq")).resolves.toBe("groq-key");
  });

  it("persists a preferred provider for future local generation", async () => {
    const { store } = setup();

    await store.setPreferredProvider("groq");

    await expect(store.getPreferredProvider()).resolves.toBe("groq");
  });
});
