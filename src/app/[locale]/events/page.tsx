import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { EmptyState } from "@/components/common/EmptyState";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { pastEventsQuery, upcomingEventsQuery } from "@/sanity/queries";

import type { PastEventsQueryResult } from "../../../../sanity.types";

type EventCardData = PastEventsQueryResult[number];

function EventCard({
  event,
  appLocale,
  t,
}: {
  event: EventCardData;
  appLocale: AppLocale;
  t: Awaited<ReturnType<typeof getTranslations>>;
}) {
  const imageUrl = event.image
    ? urlForImage(event.image).width(600).height(400).fit("crop").url()
    : undefined;
  const location = pick(event.location, appLocale, "");
  const formattedDate = new Date(event.date).toLocaleDateString(appLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-sm transition-shadow hover:shadow-md">
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
          {formattedDate}
          {event.time ? ` · ${event.time}` : ""}
        </span>
        <h3 className="text-lg font-semibold text-navy">
          <Link
            href={`/events/${event.slug}`}
            className="after:absolute after:inset-0"
          >
            {pick(event.title, appLocale, t("untitledFallback"))}
          </Link>
        </h3>
        {location ? <p className="text-sm text-navy/70">{location}</p> : null}
        <span className="mt-auto pt-2 text-sm font-semibold text-gold">
          {t("viewEvent")} →
        </span>
      </div>
    </article>
  );
}

export default async function EventsPage({
  params,
}: PageProps<"/[locale]/events">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [upcomingEvents, pastEvents, t] = await Promise.all([
    client.fetch(upcomingEventsQuery).catch(() => []),
    client.fetch(pastEventsQuery).catch(() => []),
    getTranslations("EventsPage"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {t("title")}
      </h1>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-navy">{t("upcoming")}</h2>
        {upcomingEvents.length === 0 ? (
          <EmptyState message={t("emptyUpcoming")} />
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                appLocale={appLocale}
                t={t}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-navy">{t("past")}</h2>
        {pastEvents.length === 0 ? (
          <EmptyState message={t("emptyPast")} />
        ) : (
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                appLocale={appLocale}
                t={t}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
