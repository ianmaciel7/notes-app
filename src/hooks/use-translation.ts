import {
  getTranslation,
  type TranslationCategory,
  type TranslationKey,
} from "@firebase-oss/ui-core";
import { useUI } from "@firebase-oss/ui-react";

export function useTranslation() {
  const ui = useUI();

  return <T extends TranslationCategory>(
    category: T,
    key: TranslationKey<T>,
    replacements?: Record<string, string>,
  ) => getTranslation(ui, category, key, replacements);
}
