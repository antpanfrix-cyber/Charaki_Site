import Image from "next/image";

import { Link } from "@/i18n/navigation";

import type { HomePageQueryResult } from "../../../sanity.types";

type HeroData = NonNullable<NonNullable<HomePageQueryResult>["hero"]>;

// Resolved (post-`pick()`) shape of a CTA — mapped from the schema's CTA
// object so a renamed/removed field in `homePage.ts` surfaces here too.
type ResolvedCta = {
  [K in keyof Required<NonNullable<HeroData["primaryCta"]>>]: string;
};

export type HeroSectionProps = {
  title: string;
  tagline: string;
  imageUrl?: string;
  primaryCta: ResolvedCta;
  secondaryCta: ResolvedCta;
};

export function HeroSection({
  title,
  tagline,
  imageUrl,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-navy text-ivory">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-navy/70" />

      <div className="relative mx-auto w-full max-w-4xl px-6 pt-32 pb-20 text-center">
        <h1 className="text-3xl font-semibold text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-gold sm:text-xl">{tagline}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold/90"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="rounded-full border border-ivory px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-ivory hover:text-navy"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
