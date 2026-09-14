import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "@/components/forms/ContactForm";
import { ShareStoryForm } from "@/components/forms/ShareStoryForm";
import { client } from "@/sanity/client";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { contactPageQuery, siteSettingsQuery } from "@/sanity/queries";

export const revalidate = 60;

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [contactPage, siteSettings, t] = await Promise.all([
    client
      .fetch(
        contactPageQuery,
        {},
        { next: { tags: ["sanity", "contactPage"] } },
      )
      .catch(() => null),
    client
      .fetch(
        siteSettingsQuery,
        {},
        { next: { tags: ["sanity", "siteSettings"] } },
      )
      .catch(() => null),
    getTranslations("ContactPage"),
  ]);

  const heading = pick(contactPage?.heading, appLocale, t("headingFallback"));
  const intro = pick(contactPage?.intro, appLocale, t("introFallback"));
  const address = pick(contactPage?.address, appLocale, t("addressFallback"));
  const mapEmbedUrl = contactPage?.mapEmbedUrl;
  const email = siteSettings?.email || "";
  const phone = siteSettings?.phone || "";

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-4 leading-relaxed text-navy/70">{intro}</p>
          <p className="mt-4 text-sm font-semibold tracking-wide text-gold uppercase">
            {address}
          </p>

          {email || phone ? (
            <div className="mt-4 flex flex-col gap-1 text-navy/80">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="transition-colors hover:text-gold"
                >
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="transition-colors hover:text-gold"
                >
                  {phone}
                </a>
              ) : null}
            </div>
          ) : null}

          {mapEmbedUrl ? (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-navy/10">
              <iframe
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
                title={heading}
              />
            </div>
          ) : null}
        </div>

        <ContactForm />
      </div>

      <div className="mt-20">
        <ShareStoryForm />
      </div>
    </div>
  );
}
