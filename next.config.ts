import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Sanity Studio's internals (e.g. `sanity`'s scheduling UI) import `swr` in a way
  // that breaks Turbopack's RSC module-condition resolution when bundled server-side.
  // Keeping these packages external avoids that and matches Sanity's own guidance
  // for embedding the Studio in a Next.js App Router project.
  serverExternalPackages: ["sanity", "@sanity/vision"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
