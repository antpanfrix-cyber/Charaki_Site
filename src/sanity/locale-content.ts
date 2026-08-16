import type { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

export type LocalizedText = { el: string; en: string };

export function pick(
  field: LocalizedText | null | undefined,
  locale: AppLocale,
  fallback: string,
) {
  return field?.[locale] || fallback;
}
