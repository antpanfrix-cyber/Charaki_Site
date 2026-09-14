import type { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

export type LocalizedText = { el: string; en?: string };

/**
 * Requested locale -> Greek -> caller-supplied fallback. `el` is required on
 * every locale field, so a missing/empty `en` falls back to the real Greek
 * text instead of the generic fallback (which would otherwise read as a
 * silent content hole on /en).
 */
export function pick(
  field: LocalizedText | null | undefined,
  locale: AppLocale,
  fallback: string,
) {
  return field?.[locale] || field?.el || fallback;
}

type LocalizedBlocks<T> = { el?: T[]; en?: T[] } | null | undefined;

/**
 * Same fallback chain as pick(), for localeBlockContent-shaped fields (arrays
 * of Portable Text blocks/images) that don't go through pick() since they
 * aren't plain strings.
 */
export function pickBlocks<T>(
  field: LocalizedBlocks<T>,
  locale: AppLocale,
): T[] | undefined {
  const localized = field?.[locale];
  return localized && localized.length > 0 ? localized : field?.el;
}
