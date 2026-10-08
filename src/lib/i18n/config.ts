export const locales = ["en", "pt-BR", "es"] as const;
export const defaultLocale = "en" as const;
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export type Locale = (typeof locales)[number];

export function isSupportedLocale(
  value: string | null | undefined,
): value is Locale {
  return value !== undefined && locales.includes(value as Locale);
}

export function matchLocale(
  tag: string | null | undefined,
): Locale | undefined {
  if (!tag) {
    return undefined;
  }

  const normalizedTag = tag.trim().toLowerCase();
  const exactLocale = locales.find(
    (locale) => locale.toLowerCase() === normalizedTag,
  );

  if (exactLocale) {
    return exactLocale;
  }

  const primarySubtag = normalizedTag.split("-")[0];
  return locales.find(
    (locale) => locale.toLowerCase().split("-")[0] === primarySubtag,
  );
}

export function negotiateLocale(
  acceptLanguage: string | null | undefined,
): Locale | undefined {
  if (!acceptLanguage) {
    return undefined;
  }

  const candidates = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [range, ...parameters] = part.trim().split(";");
      let quality = 1;

      for (const parameter of parameters) {
        const [name, value] = parameter.trim().split("=");
        if (name?.toLowerCase() !== "q") {
          continue;
        }

        const parsedQuality = Number(value);
        if (
          !Number.isFinite(parsedQuality) ||
          parsedQuality < 0 ||
          parsedQuality > 1
        ) {
          return undefined;
        }

        quality = parsedQuality;
      }

      return { index, quality, range };
    })
    .filter(
      (
        candidate,
      ): candidate is { index: number; quality: number; range: string } =>
        candidate !== undefined &&
        candidate.quality > 0 &&
        candidate.range !== "*",
    )
    .sort(
      (left, right) => right.quality - left.quality || left.index - right.index,
    );

  for (const candidate of candidates) {
    const locale = matchLocale(candidate.range);
    if (locale) {
      return locale;
    }
  }

  return undefined;
}
