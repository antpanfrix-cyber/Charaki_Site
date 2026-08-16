import { Link } from "@/i18n/navigation";

import type { HomePageQueryResult } from "../../../sanity.types";

type WelcomeData = NonNullable<NonNullable<HomePageQueryResult>["welcome"]>;

// Resolved (post-`pick()` / post-plain-text-extraction) shape — mapped from
// the schema so a renamed/removed field in `homePage.ts` surfaces here too.
export type WelcomeSectionProps = {
  [K in keyof Required<WelcomeData>]: string;
};

export function WelcomeSection({
  heading,
  text,
  ctaLabel,
}: WelcomeSectionProps) {
  return (
    <section className="bg-ivory text-navy">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold sm:text-3xl">{heading}</h2>
        <p className="mt-6 text-base leading-relaxed text-navy/80 sm:text-lg">
          {text}
        </p>
        <Link
          href="/about"
          className="mt-8 inline-block text-sm font-semibold text-gold transition-colors hover:text-navy"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
