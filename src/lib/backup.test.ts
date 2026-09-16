import { describe, expect, it } from "vitest";

import { parseBackup } from "@/lib/backup";

describe("backup validation", () => {
  it("accepts a complete versioned backup", () => {
    const backup = parseBackup(JSON.stringify({
      schemaVersion: 1,
      exportedAt: "2026-09-15T12:00:00.000Z",
      decks: [],
      cards: [],
      schedules: [],
      reviewLogs: [],
    }));

    expect(backup.schemaVersion).toBe(1);
  });

  it.each([
    ["malformed JSON", "{"],
    ["unsupported version", JSON.stringify({ schemaVersion: 2, exportedAt: "2026-09-15T12:00:00.000Z", decks: [], cards: [], schedules: [], reviewLogs: [] })],
  ])("rejects %s", (_label, value) => {
    expect(() => parseBackup(value)).toThrow("Backup inválido");
  });
});
