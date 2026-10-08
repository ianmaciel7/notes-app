import {
  enUs,
  esLa,
  ptBr,
  type RegisteredLocale,
} from "@firebase-oss/ui-translations";
import type { Locale } from "@/lib/i18n/config";

export type FirebaseUiLocale = RegisteredLocale;

const localeMap: Record<Locale, FirebaseUiLocale> = {
  en: enUs,
  "pt-BR": ptBr,
  es: esLa,
};

export function getFirebaseUiLocale(locale: Locale): FirebaseUiLocale {
  return localeMap[locale];
}
