import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { portableTextComponents } from "@/components/media/portable-text-components";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick, pickBlocks } from "@/sanity/locale-content";
import { topicBySlugQuery, topicSlugsQuery } from "@/sanity/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await client
    .fetch(topicSlugsQuery, {}, { next: { tags: ["sanity", "topic"] } })
    .catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/topics/[slug]">): Promise<Metadata> {
  const { slug, locale } = await params;
  const appLocale = locale as AppLocale;

  const topic = await client
    .fetch(topicBySlugQuery, { slug }, { next: { tags: ["sanity", "topic"] } })
    .catch(() => null);

  if (!topic) return {};

  const title = pick(topic.title, appLocale, "");
  const description = pick(topic.excerpt, appLocale, "") || undefined;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function TopicPage({
  params,
}: PageProps<"/[locale]/topics/[slug]">) {
  const { locale, slug } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [topic, t] = await Promise.all([
    client
      .fetch(
        topicBySlugQuery,
        { slug },
        { next: { tags: ["sanity", "topic"] } },
      )
      .catch(() => null),
    getTranslations("TopicPage"),
  ]);

  if (!topic) {
    notFound();
  }

  const imageUrl = topic.coverImage
    ? urlForImage(topic.coverImage).width(1600).height(900).fit("crop").url()
    : undefined;

  const body = pickBlocks(topic.body, appLocale);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {pick(topic.title, appLocale, t("untitledFallback"))}
      </h1>

      {imageUrl ? (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      ) : null}

      <div className="mt-10">
        {Array.isArray(body) && body.length > 0 ? (
          <PortableText value={body} components={portableTextComponents} />
        ) : null}
      </div>
    </article>
  );
}
