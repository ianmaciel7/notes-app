import type { KnowledgeDatabase } from "@/lib/db";
import type { AiProvider } from "@/lib/ai/ai-gateway";

const AI_SETTINGS_PREFIX = "ai";
const PREFERRED_PROVIDER_SETTING_ID = `${AI_SETTINGS_PREFIX}:preferredProvider`;

function providerKeySettingId(provider: AiProvider) {
  return `${AI_SETTINGS_PREFIX}:${provider}:apiKey`;
}

function normalizeApiKey(apiKey: string) {
  const normalized = apiKey.trim();
  if (!normalized) throw new Error("API key is required.");
  return normalized;
}

export function createByokSettingsStore(database: KnowledgeDatabase) {
  async function setProviderApiKey(provider: AiProvider, apiKey: string) {
    await database.appSettings.put({
      id: providerKeySettingId(provider),
      value: normalizeApiKey(apiKey),
    });
  }

  async function getProviderApiKey(provider: AiProvider) {
    return (await database.appSettings.get(providerKeySettingId(provider)))?.value ?? null;
  }

  async function clearProviderApiKey(provider: AiProvider) {
    await database.appSettings.delete(providerKeySettingId(provider));
  }

  async function setPreferredProvider(provider: AiProvider) {
    await database.appSettings.put({
      id: PREFERRED_PROVIDER_SETTING_ID,
      value: provider,
    });
  }

  async function getPreferredProvider(): Promise<AiProvider> {
    const provider = (await database.appSettings.get(PREFERRED_PROVIDER_SETTING_ID))?.value;
    return provider === "groq" ? "groq" : "gemini";
  }

  return {
    setProviderApiKey,
    getProviderApiKey,
    clearProviderApiKey,
    setPreferredProvider,
    getPreferredProvider,
  };
}
