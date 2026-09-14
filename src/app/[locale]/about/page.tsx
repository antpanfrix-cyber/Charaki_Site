import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { aboutPageQuery } from "@/sanity/queries";

const MILESTONE_KEYS = [
  "foundation",
  "firstActivities",
  "danceGroups",
  "culturalEvents",
  "collaborations",
  "today",
] as const;

export const revalidate = 60;

export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [aboutPage, t] = await Promise.all([
    client
      .fetch(aboutPageQuery, {}, { next: { tags: ["sanity", "aboutPage"] } })
      .catch(() => null),
    getTranslations("AboutPage"),
  ]);

  const heading = pick(aboutPage?.heading, appLocale, t("title"));
  const intro = pick(aboutPage?.intro, appLocale, t("intro"));
  const journeyHeading = pick(
    aboutPage?.journey?.heading,
    appLocale,
    t("journeyTitle"),
  );
  const journeyIntro = pick(
    aboutPage?.journey?.intro,
    appLocale,
    t("journeyIntro"),
  );

  const milestones =
    aboutPage?.milestones && aboutPage.milestones.length > 0
      ? aboutPage.milestones.map((milestone) => ({
          title: pick(milestone.title, appLocale, ""),
          description: pick(milestone.description, appLocale, ""),
        }))
      : MILESTONE_KEYS.map((key) => ({
          title: t(`milestones.${key}.title`),
          description: t(`milestones.${key}.description`),
        }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {heading}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-navy/80">{intro}</p>

      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-navy sm:text-3xl">
          {journeyHeading}
        </h2>
        <p className="mt-3 text-navy/70">{journeyIntro}</p>

        <ol className="mt-12 border-l-2 border-gold/40 pl-10">
          {milestones.map((milestone, index) => (
            <li key={`${milestone.title}-${index}`} className="relative pb-14 last:pb-0">
              <span className="absolute top-0.5 -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-navy text-xs font-semibold text-gold">
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold text-navy sm:text-xl">
                {milestone.title}
              </h3>
              <p className="mt-2 leading-relaxed text-navy/70">
                {milestone.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
