import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArchiveCard } from "@/components/archive/ArchiveCard";
import { EmptyState } from "@/components/common/EmptyState";
import { client } from "@/sanity/client";
import type { AppLocale } from "@/sanity/locale-content";
import { archiveItemsQuery } from "@/sanity/queries";

export default async function ArchivePage({
  params,
}: PageProps<"/[locale]/archive">) {
  const { locale } = await params;
  const appLocale = locale as AppLocale;
  setRequestLocale(appLocale);

  const [items, t, tCategory] = await Promise.all([
    client.fetch(archiveItemsQuery).catch(() => []),
    getTranslations("ArchivePage"),
    getTranslations("ArchiveCategory"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-navy sm:text-4xl">
        {t("title")}
      </h1>

      {items.length === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <div className="mt-10 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {items.map((item) => (
            <ArchiveCard
              key={item._id}
              item={item}
              appLocale={appLocale}
              t={t}
              tCategory={tCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
}
