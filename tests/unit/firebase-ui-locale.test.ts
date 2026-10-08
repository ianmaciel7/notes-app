import { enUs, esLa, ptBr } from "@firebase-oss/ui-translations";
import { describe, expect, it } from "vitest";
import { getFirebaseUiLocale } from "@/lib/i18n/firebase-ui-locale";

describe("getFirebaseUiLocale", () => {
  it("maps each supported locale to the Firebase UI translations", () => {
    expect(getFirebaseUiLocale("en")).toBe(enUs);
    expect(getFirebaseUiLocale("pt-BR")).toBe(ptBr);
    expect(getFirebaseUiLocale("es")).toBe(esLa);
  });
});
