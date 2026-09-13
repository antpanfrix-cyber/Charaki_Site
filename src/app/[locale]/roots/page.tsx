import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { rootsPageQuery } from "@/sanity/queries";

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

  const [rootsPage, t] = await Promise.all([
    client.fetch(rootsPageQuery).catch(() => null),
    getTranslations("RootsPage"),
  ]);

  const heading = pick(rootsPage?.heading, appLocale, t("title"));
  const intro = pick(rootsPage?.intro, appLocale, t("subtitle"));
  const ctaLabel = pick(rootsPage?.cta?.label, appLocale, t("cta"));
  const ctaHref = rootsPage?.cta?.href || "#";

  const cards =
    rootsPage?.cards && rootsPage.cards.length > 0
      ? rootsPage.cards.map((card) => ({
          title: pick(card.title, appLocale, ""),
          description: pick(card.description, appLocale, ""),
          imageUrl: card.image
            ? urlForImage(card.image).width(800).height(600).fit("crop").url()
            : undefined,
        }))
      : CARD_KEYS.map((key) => ({
          title: t(`cards.${key}.title`),
          description: t(`cards.${key}.description`),
          imageUrl: undefined,
        }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 text-lg text-gold italic">{intro}</p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {cards.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            className="group relative aspect-4/5 overflow-hidden rounded-2xl shadow-sm sm:aspect-16/11"
          >
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]}`}
              />
            )}
            <div className="absolute inset-0 bg-navy/50" />
            <div className="relative z-10 flex h-full flex-col justify-end p-8">
              <h2 className="text-xl font-semibold text-ivory sm:text-2xl">
                {card.title}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-ivory/85">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-navy px-8 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-gold"
        >
          {ctaLabel} →
        </a>
      </div>
    </div>
  );
}
