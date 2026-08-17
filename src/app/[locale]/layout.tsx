import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";
import { client } from "@/sanity/client";
import type { AppLocale } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";
import { siteSettingsQuery } from "@/sanity/queries";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = locale as AppLocale;

  const [siteSettings, t] = await Promise.all([
    client.fetch(siteSettingsQuery).catch(() => null),
    getTranslations({ locale: appLocale, namespace: "Metadata" }),
  ]);

  const title = pick(siteSettings?.seo?.title, appLocale, t("title"));
  const description = pick(
    siteSettings?.seo?.description,
    appLocale,
    t("description"),
  );

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: t.raw("keywords"),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((altLocale) => [altLocale, `/${altLocale}`]),
      ),
    },
    openGraph: {
      title,
      description,
      locale: appLocale,
      siteName: title,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
