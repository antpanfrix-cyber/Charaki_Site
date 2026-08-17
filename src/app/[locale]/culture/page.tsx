import { getTranslations, setRequestLocale } from "next-intl/server";

import type { AppLocale } from "@/sanity/locale-content";

const CARD_KEYS = [
  "dance",
  "music",
  "costumes",
  "customs",
  "cuisine",
] as const;

const CARD_GRADIENTS = [
  "bg-gradient-to-br from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-tr from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-bl from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-tl from-navy via-navy/90 to-gold/50",
  "bg-gradient-to-b from-navy via-navy/90 to-gold/50",
];

export default async function CulturePage({
  params,
}: PageProps<"/[locale]/culture">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const t = await getTranslations("CulturePage");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 leading-relaxed text-navy/70">{t("subtitle")}</p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {CARD_KEYS.map((key, index) => (
          <article
            key={key}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <div
                className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${CARD_GRADIENTS[index]}`}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-6">
              <h2 className="text-lg font-semibold text-navy">
                <a href="#" className="after:absolute after:inset-0">
                  {t(`cards.${key}.title`)}
                </a>
              </h2>
              <p className="text-sm text-navy/70">
                {t(`cards.${key}.description`)}
              </p>
              <span className="mt-auto pt-2 text-sm font-semibold text-gold">
                {t("viewMore")} →
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
