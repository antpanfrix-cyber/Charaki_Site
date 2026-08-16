import { getTranslations } from "next-intl/server";

import { navigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const t = await getTranslations("Navigation");
  const tHeader = await getTranslations("Header");

  return (
    <header className="sticky top-0 z-50 border-b border-gold/30 bg-navy text-ivory">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-wide"
        >
          {tHeader("siteName")}
        </Link>

        <nav aria-label="Main" className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex items-center gap-6 whitespace-nowrap text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ivory/90 transition-colors hover:text-gold"
                >
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/contact"
          className="shrink-0 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-gold/90"
        >
          {tHeader("becomeMemberCta")}
        </Link>
      </div>
    </header>
  );
}
