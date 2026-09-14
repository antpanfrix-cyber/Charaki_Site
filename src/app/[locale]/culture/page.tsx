import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { resolveCard } from "@/lib/resolve-card";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { culturePageQuery } from "@/sanity/queries";

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

export const revalidate = 60;

export default async function CulturePage({
  params,
}: PageProps<"/[locale]/culture">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [culturePage, t] = await Promise.all([
    client
      .fetch(
        culturePageQuery,
        {},
        { next: { tags: ["sanity", "culturePage"] } },
      )
      .catch(() => null),
    getTranslations("CulturePage"),
  ]);

  const heading = pick(culturePage?.heading, appLocale, t("title"));
  const intro = pick(culturePage?.intro, appLocale, t("subtitle"));
  const viewMoreLabel = pick(
    culturePage?.viewMoreLabel,
    appLocale,
    t("viewMore"),
  );

  const cards =
    culturePage?.cards && culturePage.cards.length > 0
      ? culturePage.cards.map((card) => {
          const resolved = resolveCard(card, appLocale);
          return {
            ...resolved,
            imageUrl: resolved.image
              ? urlForImage(resolved.image)
                  .width(800)
                  .height(600)
                  .fit("crop")
                  .url()
              : undefined,
          };
        })
      : CARD_KEYS.map((key) => ({
          title: t(`cards.${key}.title`),
          description: t(`cards.${key}.description`),
          imageUrl: undefined,
          href: undefined,
        }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
          {heading}
        </h1>
        <p className="mt-4 leading-relaxed text-navy/70">{intro}</p>
      </div>

      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const isClickable = Boolean(card.href);
          return (
            <article
              key={`${card.title}-${index}`}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm outline-none transition-shadow hover:shadow-lg ${isClickable ? "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2" : ""}`}
            >
              <div className="relative aspect-4/3 w-full overflow-hidden">
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
              </div>
              <div className="flex flex-1 flex-col gap-2 p-6">
                <h2 className="text-lg font-semibold text-navy">
                  {isClickable ? (
                    <a
                      href={card.href}
                      className="outline-none after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {card.title}
                    </a>
                  ) : (
                    card.title
                  )}
                </h2>
                <p className="text-sm text-navy/70">{card.description}</p>
                {isClickable ? (
                  <span className="mt-auto pt-2 text-sm font-semibold text-gold">
                    {viewMoreLabel} →
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
