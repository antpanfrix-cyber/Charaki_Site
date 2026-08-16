import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EmptyState } from "@/components/common/EmptyState";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { allNewsQuery } from "@/sanity/queries";

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [news, t, tCategory] = await Promise.all([
    client.fetch(allNewsQuery).catch(() => []),
    getTranslations("NewsPage"),
    getTranslations("NewsCategory"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {t("title")}
      </h1>

      {news.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => {
            const imageUrl = item.image
              ? urlForImage(item.image)
                  .width(600)
                  .height(400)
                  .fit("crop")
                  .url()
              : undefined;
            const excerpt = pick(item.excerpt, appLocale, "");

            return (
              <article
                key={item._id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {imageUrl ? (
                  <div className="relative aspect-3/2 w-full overflow-hidden bg-navy/5">
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <span className="text-xs font-semibold tracking-wide text-gold uppercase">
                    {tCategory(item.category)}
                  </span>
                  <h2 className="text-lg font-semibold text-navy">
                    <Link
                      href={`/news/${item.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {pick(item.title, appLocale, t("untitledFallback"))}
                    </Link>
                  </h2>
                  {excerpt ? (
                    <p className="text-sm text-navy/70">{excerpt}</p>
                  ) : null}
                  <span className="mt-auto pt-2 text-sm font-semibold text-gold">
                    {t("readMore")} →
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
