"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";

export default function StudioPage() {
  // `history="hash"` defers rendering the actual Studio tree until after the
  // client mounts. Without it, Next.js server-renders the Studio component
  // tree on first load, which crashes under Turbopack with
  // "Cannot read properties of null (reading 'useMemoCache')" — a known
  // incompatibility between Sanity's React-Compiler-built bundle and SSR of
  // "use client" boundaries in Turbopack (next-sanity can't yet opt out of
  // SSR via `next/dynamic(..., { ssr: false })` because Turbopack doesn't
  // support that in the App Router, see next-sanity's NextStudio source).
  return <NextStudio config={config} history="hash" />;
}
