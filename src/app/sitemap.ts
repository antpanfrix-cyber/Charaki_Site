import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

const staticRoutes = [
  "/",
  "/about",
  "/roots",
  "/culture",
  "/events",
  "/news",
  "/archive",
  "/contact",
];

function localizedUrl(locale: string, route: string) {
  return `${siteUrl}/${locale}${route === "/" ? "" : route}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: localizedUrl(locale, route),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((altLocale) => [
            altLocale,
            localizedUrl(altLocale, route),
          ]),
        ),
      },
    })),
  );
}
