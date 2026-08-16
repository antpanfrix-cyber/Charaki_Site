import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { eventBySlugQuery, eventSlugsQuery } from "@/sanity/queries";

export async function generateStaticParams() {
  const slugs = await client.fetch(eventSlugsQuery).catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export default async function EventDetailPage({
  params,
}: PageProps<"/[locale]/events/[slug]">) {
  const { locale, slug } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [event, t] = await Promise.all([
    client.fetch(eventBySlugQuery, { slug }).catch(() => null),
    getTranslations("EventsPage"),
  ]);

  if (!event) {
    notFound();
  }

  const imageUrl = event.image
    ? urlForImage(event.image).width(1600).height(900).fit("crop").url()
    : undefined;

  const location = pick(event.location, appLocale, "");
  const description = pick(event.description, appLocale, "");
  const formattedDate = new Date(event.date).toLocaleDateString(appLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {pick(event.title, appLocale, t("untitledFallback"))}
      </h1>

      <dl className="mt-4 flex flex-col gap-1 text-sm text-navy/70">
        <div className="flex gap-2">
          <dt className="font-semibold text-gold">
            {formattedDate}
            {event.time ? ` · ${event.time}` : ""}
          </dt>
        </div>
        {location ? (
          <div className="flex gap-2">
            <dd>{location}</dd>
          </div>
        ) : null}
      </dl>

      {imageUrl ? (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image src={imageUrl} alt="" fill className="object-cover" />
        </div>
      ) : null}

      {description ? (
        <p className="mt-10 leading-relaxed text-navy/90">{description}</p>
      ) : null}
    </article>
  );
}
