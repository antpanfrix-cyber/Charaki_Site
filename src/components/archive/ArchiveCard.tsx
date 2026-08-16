import type { getTranslations } from "next-intl/server";

import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";

import type { ArchiveItemsQueryResult } from "../../../sanity.types";

type ArchiveItem = ArchiveItemsQueryResult[number];

type ArchiveCardProps = {
  item: ArchiveItem;
  appLocale: AppLocale;
  t: Awaited<ReturnType<typeof getTranslations<"ArchivePage">>>;
  tCategory: Awaited<ReturnType<typeof getTranslations<"ArchiveCategory">>>;
};

export function ArchiveCard({
  item,
  appLocale,
  t,
  tCategory,
}: ArchiveCardProps) {
  const title = pick(item.title, appLocale, t("untitledFallback"));
  const description = pick(item.description, appLocale, "");
  const imageUrl = item.image
    ? urlForImage(item.image).width(800).fit("max").url()
    : undefined;

  return (
    <article className="mb-8 break-inside-avoid overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- variable-shape archival photo, drives the masonry height
        <img src={imageUrl} alt="" className="w-full" />
      ) : null}
      <div className="flex flex-col gap-2 p-6">
        <span className="w-fit rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold uppercase">
          {tCategory(item.category)}
        </span>
        <h3 className="text-lg font-semibold text-navy">{title}</h3>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-navy/60">
          {item.year ? <span>{item.year}</span> : null}
          {item.location ? <span>{item.location}</span> : null}
          {item.person ? <span>{item.person}</span> : null}
        </div>
        {description ? (
          <p className="text-sm text-navy/70">{description}</p>
        ) : null}
        {item.externalUrl ? (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-gold hover:text-navy"
          >
            {t("openLink")} →
          </a>
        ) : item.file ? (
          <a
            href={item.file.url}
            download={item.file.originalFilename ?? undefined}
            className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-gold hover:text-navy"
          >
            {t("downloadFile")} →
          </a>
        ) : null}
      </div>
    </article>
  );
}
