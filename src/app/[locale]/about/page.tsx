import { getTranslations, setRequestLocale } from "next-intl/server";

import type { AppLocale } from "@/sanity/locale-content";

const MILESTONE_KEYS = [
  "foundation",
  "firstActivities",
  "danceGroups",
  "culturalEvents",
  "collaborations",
  "today",
] as const;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const t = await getTranslations("AboutPage");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-navy/80">
        {t("intro")}
      </p>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
          {t("journeyTitle")}
        </h2>
        <p className="mt-3 text-navy/70">{t("journeyIntro")}</p>

        <ol className="mt-12 border-l-2 border-gold/40 pl-10">
          {MILESTONE_KEYS.map((key, index) => (
            <li key={key} className="relative pb-14 last:pb-0">
              <span className="absolute top-0.5 -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-navy text-xs font-semibold text-gold">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-navy sm:text-xl">
                {t(`milestones.${key}.title`)}
              </h3>
              <p className="mt-2 leading-relaxed text-navy/70">
                {t(`milestones.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
