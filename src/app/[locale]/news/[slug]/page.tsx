import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { portableTextComponents } from "@/components/media/portable-text-components";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { newsBySlugQuery, newsSlugsQuery } from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(newsSlugsQuery).catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export default async function NewsArticlePage({
  params,
}: PageProps<"/[locale]/news/[slug]">) {
  const { locale, slug } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [article, t, tCategory] = await Promise.all([
    client.fetch(newsBySlugQuery, { slug }).catch(() => null),
    getTranslations("NewsPage"),
    getTranslations("NewsCategory"),
  ]);

  if (!article) {
    notFound();
  }

  const imageUrl = article.image
    ? urlForImage(article.image).width(1600).height(900).fit("crop").url()
    : undefined;

  const body = article.content?.[appLocale];
  const excerpt = pick(article.excerpt, appLocale, "");

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <span className="text-xs font-semibold tracking-wide text-gold uppercase">
        {tCategory(article.category)}
      </span>
      <h1 className="mt-2 text-3xl font-semibold text-navy sm:text-4xl">
        {pick(article.title, appLocale, t("untitledFallback"))}
      </h1>
      <time
        dateTime={article.publishedAt}
        className="mt-3 block text-sm text-navy/60"
      >
        {new Date(article.publishedAt).toLocaleDateString(appLocale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      {imageUrl ? (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      ) : null}

      <div className="mt-10">
        {Array.isArray(body) && body.length > 0 ? (
          <PortableText value={body} components={portableTextComponents} />
        ) : excerpt ? (
          <p className="leading-relaxed text-navy/90">{excerpt}</p>
        ) : null}
      </div>
    </article>
  );
}
