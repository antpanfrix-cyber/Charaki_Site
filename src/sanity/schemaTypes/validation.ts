import type { LocalizedText } from "@/sanity/locale-content";

type LocaleValue = Partial<LocalizedText> | undefined;

const LOCALES = ["el", "en"] as const;

/**
 * Sanity has no length validator for object types, and locale fields
 * (localeString, localeText, localeTextShort) are objects ({ el, en }), not
 * strings — `.max()`/`.min()`/`.length()` fail at runtime with "validator for
 * flag ... not found for type object". Use this in `.custom()` instead to
 * check each language's string length.
 */
export function maxLocaleLength(limit: number) {
  return (value: LocaleValue): true | string => {
    if (!value) return true;

    const tooLong = LOCALES.some(
      (locale) => (value[locale]?.length ?? 0) > limit,
    );

    return tooLong ? `Έως ${limit} χαρακτήρες ανά γλώσσα` : true;
  };
}
