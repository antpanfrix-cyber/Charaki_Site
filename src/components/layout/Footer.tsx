import { getTranslations } from "next-intl/server";

import { navigation } from "@/config/navigation";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Navigation");
  const tFooter = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-ivory">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold">{tFooter("fullName")}</p>
            <p className="mt-1 text-sm text-gold">{tFooter("tagline")}</p>
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
