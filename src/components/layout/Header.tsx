import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { navigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { siteSettingsQuery } from "@/sanity/queries";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const [siteSettings, t, tHeader] = await Promise.all([
    client
      .fetch(
        siteSettingsQuery,
        {},
        { next: { tags: ["sanity", "siteSettings"] } },
      )
      .catch(() => null),
    getTranslations("Navigation"),
    getTranslations("Header"),
  ]);

  const navItems = navigation.map((item) => ({
    href: item.href,
    label: t(item.labelKey),
  }));

  const logoUrl = siteSettings?.logo
    ? urlForImage(siteSettings.logo).height(80).fit("max").url()
    : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-navy text-ivory">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-wide"
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={tHeader("siteName")}
              height={40}
              width={40}
              className="h-10 w-auto"
            />
          ) : (
            tHeader("siteName")
          )}
        </Link>

        <nav
          aria-label="Main"
          className="hidden min-w-0 flex-1 overflow-x-auto md:block"
        >
          <ul className="flex items-center gap-6 whitespace-nowrap text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ivory/90 transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden shrink-0 md:block">
          <LanguageSwitcher />
        </div>

        <Link
          href="/contact"
          className="hidden shrink-0 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold/90 md:inline-block"
        >
          {tHeader("becomeMemberCta")}
        </Link>

        <MobileMenu
          navItems={navItems}
          becomeMemberLabel={tHeader("becomeMemberCta")}
          openLabel={tHeader("openMenu")}
          closeLabel={tHeader("closeMenu")}
        />
      </div>
    </header>
  );
}
