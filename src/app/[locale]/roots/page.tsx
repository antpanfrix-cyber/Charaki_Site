import { getTranslations, setRequestLocale } from "next-intl/server";

import type { AppLocale } from "@/sanity/locale-content";

const CARD_KEYS = [
  "asiaMinor",
  "refugees",
  "familyStories",
  "historicalArchive",
] as const;

const CARD_GRADIENTS = [
  "bg-gradient-to-br from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-tr from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-bl from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-tl from-navy via-navy/90 to-gold/50",
];

export default async function RootsPage({
  params,
}: PageProps<"/[locale]/roots">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const t = await getTranslations("RootsPage");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-gold italic">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {CARD_KEYS.map((key, index) => (
          <div
            key={key}
            className="group relative aspect-4/5 overflow-hidden rounded-2xl shadow-sm sm:aspect-16/11"
          >
            <div
              className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${CARD_GRADIENTS[index]}`}
            />
            <div className="absolute inset-0 bg-navy/50" />
            <div className="relative z-10 flex h-full flex-col justify-end p-8">
              <h2 className="text-xl font-semibold text-ivory sm:text-2xl">
                {t(`cards.${key}.title`)}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/85">
                {t(`cards.${key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-gold"
        >
          {t("cta")} →
        </a>
      </div>
    </div>
  );
}
