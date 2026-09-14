import { getLocale, getTranslations } from "next-intl/server";

import { navigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { siteSettingsQuery } from "@/sanity/queries";

const SOCIAL_PLATFORMS = ["facebook", "instagram", "youtube"] as const;
type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

function SocialIcon({ platform }: { platform: SocialPlatform }) {
  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            fill="currentColor"
            d="M13.5 21v-8.5H16l.5-3.5h-3V6.8c0-1 .3-1.8 1.8-1.8H16.6V1.8C16.3 1.8 15.3 1.7 14.1 1.7c-2.5 0-4.2 1.5-4.2 4.3V9H7.4v3.5h2.5V21h3.6z"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

export async function Footer() {
  const appLocale = (await getLocale()) as AppLocale;

  const [siteSettings, t, tFooter, tContact] = await Promise.all([
    client
      .fetch(
        siteSettingsQuery,
        {},
        { next: { tags: ["sanity", "siteSettings"] } },
      )
      .catch(() => null),
    getTranslations("Navigation"),
    getTranslations("Footer"),
    getTranslations("ContactPage"),
  ]);

  const year = new Date().getFullYear();
  const email = siteSettings?.email || "";
  const phone = siteSettings?.phone || "";
  const address = pick(
    siteSettings?.address,
    appLocale,
    tContact("addressFallback"),
  );

  const socialLinks = siteSettings?.socialLinks;
  const activeSocialLinks = SOCIAL_PLATFORMS.map((platform) => ({
    platform,
    href: socialLinks?.[platform],
  })).filter(
    (link): link is { platform: SocialPlatform; href: string } => !!link.href,
  );

  return (
    <footer className="bg-navy text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold">{tFooter("fullName")}</p>
            <p className="mt-1 text-sm text-gold">{tFooter("tagline")}</p>

            <div className="mt-4 flex flex-col gap-1 text-sm text-ivory/80">
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
              {address ? <p>{address}</p> : null}
            </div>

            {activeSocialLinks.length > 0 ? (
              <div className="mt-4 flex items-center gap-4">
                {activeSocialLinks.map(({ platform, href }) => (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={platform}
                    className="text-ivory/80 transition-colors hover:text-gold"
                  >
                    <SocialIcon platform={platform} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:flex sm:flex-col sm:gap-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ivory/80 transition-colors hover:text-gold"
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-ivory/10 pt-6 text-xs text-ivory/60">
          {tFooter("copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
