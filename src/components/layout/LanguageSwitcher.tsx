"use client";

import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {routing.locales.map((loc, index) => (
        <span key={loc} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-ivory/30">
              |
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: loc })}
            aria-current={loc === locale}
            disabled={loc === locale}
            className={
              loc === locale
                ? "text-gold"
                : "text-ivory/70 transition-colors hover:text-gold"
            }
          >
            {t(loc)}
          </button>
        </span>
      ))}
    </div>
  );
}
