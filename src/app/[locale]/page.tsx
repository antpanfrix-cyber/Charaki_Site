import { getTranslations, setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { getPlainTextExcerpt } from "@/lib/portable-text";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { homePageQuery } from "@/sanity/queries";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  // Sanity may be unreachable (no project connected yet, network hiccup, etc.)
  // — degrade to the next-intl fallback strings below rather than failing the render.
  const [homePage, t] = await Promise.all([
    client.fetch(homePageQuery).catch(() => null),
    getTranslations("HomePage"),
  ]);

  const hero = homePage?.hero;
  const welcome = homePage?.welcome;

  const heroImageUrl = hero?.image
    ? urlForImage(hero.image).width(1920).height(1080).fit("crop").url()
    : undefined;

  return (
    <>
      <HeroSection
        title={pick(hero?.title, appLocale, t("heroTitleFallback"))}
        tagline={pick(hero?.tagline, appLocale, t("heroTaglineFallback"))}
        imageUrl={heroImageUrl}
        primaryCta={{
          label: pick(
            hero?.primaryCta?.label,
            appLocale,
            t("heroPrimaryCtaFallback"),
          ),
          href: hero?.primaryCta?.href || "/about",
        }}
        secondaryCta={{
          label: pick(
            hero?.secondaryCta?.label,
            appLocale,
            t("heroSecondaryCtaFallback"),
          ),
          href: hero?.secondaryCta?.href || "/roots",
        }}
      />
      <WelcomeSection
        heading={pick(
          welcome?.heading,
          appLocale,
          t("welcomeHeadingFallback"),
        )}
        text={
          getPlainTextExcerpt(welcome?.text?.[appLocale], 600) ||
          t("welcomeTextFallback")
        }
        ctaLabel={pick(welcome?.ctaLabel, appLocale, t("welcomeCtaFallback"))}
      />
    </>
  );
}
