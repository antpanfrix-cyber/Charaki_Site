# The Next.js + Sanity Blueprint

> A reusable architectural reference, extracted from a production build (ChemGreece / ChemiST Con Greece). This document deliberately ignores the current project's content and copy — it documents the **skeleton and mechanisms** so they can be reapplied to any future Next.js + Sanity site: a university department, a conference, an NGO, a corporate marketing site, etc.

---

## Table of Contents

1. [Tech Stack & Architecture](#1-tech-stack--architecture)
2. [Directory Structure](#2-directory-structure)
3. [Sanity CMS Integration](#3-sanity-cms-integration)
4. [Internationalization (i18n)](#4-internationalization-i18n)
5. [Custom UI & Navigation Patterns](#5-custom-ui--navigation-patterns)
6. [Deployment Checklist](#6-deployment-checklist)
7. [Reusable Checklist for a New Project](#7-reusable-checklist-for-a-new-project)

---

## 1. Tech Stack & Architecture

| Layer           | Choice                                             | Rationale                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | **Next.js (App Router)**                           | Server Components by default, colocated data fetching, file-system routing that maps 1:1 to the site's information architecture, native support for `generateStaticParams`/`generateMetadata`/ISR.                                                  |
| Language        | **TypeScript**                                     | The Sanity content model, the GROQ query results, and the component props form a long chain of hand-offs (CMS → query → component). TypeScript is what keeps that chain honest when a schema field is renamed.                                      |
| Styling         | **Tailwind CSS v4 (utility-first, no CSS files)**  | One styling language for the whole team, no naming/BEM debates, trivial dark-mode variants (`dark:`), and utility classes travel with the component instead of living in a separate stylesheet that drifts out of sync.                             |
| CMS             | **Sanity (embedded Studio)**                       | Structured content (not just a blob of HTML), a real desk/document API for singleton pages, GROQ for precise, minimal-payload queries, and a hosted Studio that can be embedded directly inside the Next.js app instead of run/deployed separately. |
| i18n            | **next-intl**                                      | First-class App Router support (Server _and_ Client Components), typed message catalogs, and a locale-aware `Link`/`useRouter` pair that removes manual `/${locale}/...` string-building everywhere in the app.                                     |
| Email / forms   | **Resend** (or equivalent transactional email API) | Serverless-friendly (no SMTP credentials to manage), simple `Route Handler` integration.                                                                                                                                                            |
| Hosting         | **Vercel**                                         | Zero-config Next.js support (ISR, Route Handlers, Image Optimization, Edge/Node runtimes), first-party GitHub integration, environment-variable management per environment (Preview/Production).                                                    |
| Package manager | **pnpm**                                           | Strict, deduplicated `node_modules`, fast installs, honest peer-dependency resolution — important once both `next` and `sanity` (which bundles React internally) live in the same `package.json`.                                                   |

### 1.1 Why App Router (not Pages Router)

- **Server Components as the default.** Data-fetching for CMS content (`client.fetch(...)`) happens directly inside `async function Page()`/`async function Section()` — no `getServerSideProps`/`getStaticProps` indirection, no prop-drilling from page to nested section.
- **Colocated, composable data fetching.** Each section of a page (Hero, About, Stats, Sponsors…) is its own `async` Server Component that fetches only the GROQ slice it needs (see [3.2](#32-groq-query-patterns)). Sections can be developed, tested, and reordered independently.
- **`layout.tsx` per route segment.** A single `[locale]/layout.tsx` owns the `<html>`/`<body>` shell, fonts, theme provider, and global chrome (header/footer) once — every page underneath inherits it for free.
- **Native metadata API.** `generateMetadata` (per-segment, async, can hit the CMS) replaces manual `<Head>` management and composes correctly with the `metadataBase`/title templates described in [3.2](#32-groq-query-patterns).
- **File-convention SEO assets.** `opengraph-image.png`, `icon.png`, `sitemap.ts`, `robots.ts` at the `app/` root are picked up automatically — no manual `<meta>` tags to keep in sync.

### 1.2 Why an Embedded Sanity Studio (not a separately hosted one)

- **One deploy, one repo.** The Studio lives at `/studio` inside the same Next.js app and ships with the same Vercel deployment — no second project, no second CI pipeline, no separate custom domain to manage.
- **Shared TypeScript types.** Schema definitions (`defineType`/`defineField`) and the frontend that consumes them live in the same codebase and can share types (`AppLocale`, `LocalizedText`, etc.).
- **Environment parity.** The Studio reads the exact same `NEXT_PUBLIC_SANITY_*` env vars as the frontend — no drift between "what the Studio edits" and "what the site reads."
- **Trade-off to accept knowingly:** the Studio route (`/studio`) pulls in `sanity`, `@sanity/vision`, and `styled-components` client-side. It must be excluded from the site's own design system concerns (it gets its **own** root `layout.tsx` with a bare `<html>/<body>`, see [2](#2-directory-structure)) and excluded from performance budgets that apply to public-facing pages.

### 1.3 Rendering Strategy

- **Static by default, ISR where content changes without a deploy.** Pages compose Server Components that call `client.fetch()` with `useCdn: true` (Sanity's CDN, edge-cached, eventually consistent — fine for marketing content). A `revalidate` export (seconds) at the segment level controls how stale that CDN response is allowed to get before Next.js re-fetches.
- **`generateStaticParams` for locales and CMS-driven slugs.** Both the locale segment (`el`/`en`) and any `[slug]` detail route (news article, event, conference) pre-render one static page per known value at build time, with new slugs added later served via on-demand ISR fallback.
- **No client-side data fetching for CMS content.** Every `client.fetch()` call happens in a Server Component. Client Components only ever receive already-resolved, already-localized props — this keeps the Sanity API token (when used) off the client bundle and avoids any content-flash.

---

## 2. Directory Structure

```
src/
  app/
    [locale]/                  # Every localized, public-facing route lives here.
      layout.tsx                # ROOT layout (owns <html>/<body>) — see 2.1
      template.tsx               # Optional: per-navigation remount wrapper (e.g. page transitions)
      page.tsx                   # "/" (home)
      about/page.tsx             # "/about"
      conferences/
        page.tsx                 # "/conferences" (list)
        [slug]/page.tsx           # "/conferences/:slug" (detail)
      events/
        page.tsx
        [slug]/page.tsx
      news/
        page.tsx
        [slug]/page.tsx
      contact/page.tsx
    api/                        # Route Handlers — server-only endpoints, NOT localized
      contact/route.ts           # POST — contact form submission (email via Resend)
      newsletter/route.ts        # POST — newsletter signup
    studio/
      layout.tsx                 # SEPARATE root layout — Studio is not localized content
      [[...tool]]/page.tsx        # Catches every /studio/* route, hands off to Sanity Studio
    globals.css                 # Tailwind entry point + design tokens (CSS variables)
    icon.png / opengraph-image.png   # Next.js file-convention favicon / OG image
  components/
    <feature>/                  # One folder per site section: home/, about/, conferences/, contact/…
      *.tsx                      # Server Components that fetch + render a page section
    layout/                     # Header, Footer, LanguageSwitcher, ThemeToggle — global chrome
    media/                      # PortableText serializers, image/video helpers
    ui/                         # Generic, content-agnostic building blocks (buttons, reveal-on-scroll, etc.)
    common/                     # Cross-feature shared pieces (empty states, badges…)
  sanity/
    schemaTypes/
      objects/                   # Reusable field TYPES (not documents): localeString, localeText, localeBlockContent
      <document>.ts               # One file per Sanity document type (news.ts, event.ts, conference.ts…)
      index.ts                    # Aggregates every schema into the `schema` object consumed by sanity.config.ts
    structure.ts                # Desk Structure — custom sidebar, singleton wiring (see 3.1)
    client.ts                   # `next-sanity` client instance (projectId/dataset/apiVersion/useCdn)
    env.ts                      # Typed, centralized read of the NEXT_PUBLIC_SANITY_* env vars
    image.ts                    # `@sanity/image-url` builder helper (urlForImage)
    locale-content.ts           # `pick()` helper — locale-aware field access + fallback (see 4.3 / 5.2)
    queries.ts                  # EVERY GROQ query in the app, as named `defineQuery(...)` exports
  i18n/
    routing.ts                  # next-intl `defineRouting` — locales, defaultLocale, localePrefix
    navigation.ts               # next-intl `createNavigation` — locale-aware Link/useRouter/usePathname
    request.ts                  # next-intl `getRequestConfig` — resolves locale + loads message catalog
  config/
    navigation.ts               # Static site nav structure (nav links, footer links) — intentionally NOT in the CMS
  lib/
    portable-text.ts             # Plain-text extraction from Portable Text (for excerpts/teasers)
    links.ts                     # isInternalPath() — internal vs. external CMS link detection
    display-date.ts              # Shared date-formatting/resolution helpers
  providers/
    theme-provider.tsx           # next-themes wrapper (dark mode)
messages/
  el.json                       # Ελληνικά — UI copy fallback strings, keyed by namespace
  en.json                       # English — same key structure as el.json
scripts/
  init-settings.mjs             # One-off Node script to force-create a singleton doc via the write API
sanity.config.ts                # Root Sanity Studio config (schema + structure + plugins)
sanity.cli.ts                   # Sanity CLI config (project/dataset, used by `sanity` CLI commands)
next.config.ts                  # Next.js config, wrapped with `createNextIntlPlugin`
```

### 2.1 Why `[locale]/layout.tsx` is the ROOT layout, not a nested one

Because **every public route lives under `[locale]`**, and `/studio` is the only sibling route outside it, there is no shared top-level `app/layout.tsx`. Instead:

- `app/[locale]/layout.tsx` renders the full `<html lang={locale}>...<body>` shell — fonts, `ThemeProvider`, `NextIntlClientProvider`, Header/Footer, skip-link.
- `app/studio/layout.tsx` renders its **own**, separate, bare `<html><body>` shell — the Studio is explicit English-only tooling, not localized content, and must not inherit the public site's fonts/theme/providers.

This is a deliberate simplification: it avoids maintaining an unused pass-through root `layout.tsx` whose only job would be `return children`. If a third top-level route appeared that needed to share chrome with the public site, promoting a real root layout would be the correct move at that point — don't build it preemptively.

### 2.2 The `config/` vs. `sanity/` split (static structure vs. dynamic content)

Not everything belongs in the CMS. A hard rule worth keeping: **primary navigation structure (which pages exist, in what order) is a code/deploy-time decision, not a content-editor decision.** It lives in `src/config/navigation.ts` as a typed array. Content _within_ a page (text, images, listings) is CMS-managed. This avoids a footgun where a content editor can accidentally break the site's information architecture (delete the only link to `/contact`) from the Studio.

---

## 3. Sanity CMS Integration

### 3.1 Desk Structure & the Singleton Pattern

**Problem:** Sanity's default Studio sidebar treats every schema `type: "document"` as a _collection_ — it shows a list view with a "Create new" button, even for documents that should only ever have exactly one instance (a Homepage settings doc, a Contact page doc, global Site Settings). Editors can accidentally create a second one, and the frontend query (`*[_type == "homePage"][0]`) would then non-deterministically pick one of two documents.

**Solution — three coordinated pieces:**

**(1) Fix the document ID at creation time and query it directly.**
Instead of letting Sanity auto-generate a random `_id`, the custom Desk Structure item points at one fixed, hardcoded document ID:

```ts
// src/sanity/structure.ts
S.listItem()
  .title("Homepage Settings")
  .id("homePage")
  .child(
    S.document()
      .schemaType("homePage")
      .documentId("homePage"),   // ← fixed ID, not S.documentTypeList()
  ),
```

Because `S.document().schemaType(...).documentId(...)` opens (or creates, on first save) _the one document with that exact ID_, there is structurally no "list" for that type in the sidebar — nothing to browse, nothing to duplicate.

**(2) Track which types are singletons, and de-duplicate the auto-generated list.**
A `SINGLETON_TYPES` set (and a `CUSTOM_LIST_TYPES` set for anything with a hand-written `listItem`, singleton or not) is used to filter Sanity's own `S.documentTypeListItems()` helper, so a type that already has a manual entry doesn't _also_ show up a second time via the generic auto-listing:

```ts
export const SINGLETON_TYPES = new Set(["homePage", "contactPage", "siteSettings", /* … */]);
const CUSTOM_LIST_TYPES = new Set([...SINGLETON_TYPES, "conference", "event"]); // + real collections with custom titles/icons

// in the structure resolver:
...S.documentTypeListItems().filter((item) => !CUSTOM_LIST_TYPES.has(item.getId() ?? ""))
```

**(3) Remove the type from the GLOBAL "Create new" (+) button too.**
Steps 1–2 only fix the _desk list_ sidebar. Sanity Studio also has a global "+" button (and a `Cmd+K` command) that can create _any_ schema type, bypassing the custom structure entirely. That must be blocked separately in `sanity.config.ts`:

```ts
// sanity.config.ts
export default defineConfig({
  // ...
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type !== "global") return prev;
      return prev.filter((item) => !SINGLETON_TYPES.has(item.templateId));
    },
  },
});
```

**(4) Bootstrapping the first document.**
Since there's no "Create new" button for a singleton, the _first_ document (before any editor has saved one) doesn't exist yet — `*[_type == "siteSettings"][0]` returns `null`. Two ways to handle this:

- Let the frontend tolerate `null` gracefully via the **fallback strategy** (see [5.2](#52-fallback-strategy-cms-empty--hardcoded-fallback)) until an editor opens the Studio and saves once (opening `S.document().documentId("siteSettings")` and clicking "Publish" creates it).
- Or run a one-off script using a write-access API token to force-create it immediately (`scripts/init-settings.mjs`, using `client.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" })` — idempotent, safe to re-run).

**(5) Grouping related singletons.**
Multiple site-wide singleton settings docs (analytics IDs, social links, SEO defaults…) don't need to clutter the sidebar root — nest them under one collapsible `S.list()` "Global Settings" folder item, itself just another `listItem` in the structure tree.

### 3.2 GROQ Query Patterns

**Rule: every query lives in one file, `src/sanity/queries.ts`, as a named, typed constant.** No inline GROQ strings scattered through components — a single file makes it possible to see the entire "data contract" between Studio and frontend at a glance, and it's the one place to check before renaming a schema field.

```ts
// src/sanity/queries.ts
import { defineQuery } from "next-sanity";

export const allNewsQuery = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    image
  }
`);

export const newsArticleQuery = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    title, publishedAt, excerpt, image, content
  }
`);

export const newsSlugsQuery = defineQuery(`
  *[_type == "news" && defined(slug.current)].slug.current
`);
```

Recurring shapes worth reusing on every future project:

- **List query:** `*[_type == "X"] | order(<field> desc) { <projection> }` — always project _only_ the fields the view needs (never `...` / full-document spread) to keep payloads small and the type contract explicit.
- **Detail-by-slug query:** `*[_type == "X" && slug.current == $slug][0] { ... }`, parameterized (`$slug`), never string-interpolated — `client.fetch(query, { slug })` passes params safely, avoiding injection and enabling query caching.
- **Slugs-only query** (for `generateStaticParams`): `*[_type == "X" && defined(slug.current)].slug.current` — returns a plain string array, the cheapest possible fetch for build-time route enumeration.
- **Singleton query:** `*[_type == "X"][0] { ... }` — always index `[0]`; the frontend must treat the result as nullable (see 3.1.4 and 5.2).
- **Reference-following / ordering by editor choice:** a singleton "page settings" doc can hold an array of `reference`s (e.g. `featuredConferences: array of reference to conference`) to let an editor hand-pick _and order_ a subset of a collection, dereferenced with `->`:
  ```groq
  *[_type == "conferencesPage"][0] { "featuredConferences": featuredConferences[]->_id }
  ```
  The frontend then merges this editor-chosen ordering with the "everything else, default-sorted" list — see `ConferencesGrid` pattern in [5.1](#51-the-stretched-link-pattern).
- **Nested/dereferenced object projection**, for a singleton field that points at other documents:
  ```groq
  *[_type == "homePage"][0].featuredEvents[]-> { _id, title, "slug": slug.current, image }
  ```

**Fetching:** Server Components call `client.fetch<ReturnType>(query, params)` directly (`src/sanity/client.ts`, `useCdn: true`), in parallel with `Promise.all([...])` whenever a section needs more than one query plus a `next-intl` translation lookup, to avoid unnecessary request waterfalls.

### 3.3 Localized Content Fields (Object-of-Locales Pattern)

Rather than duplicating every document per language (two `news` documents for one article) or relying on Sanity's paid/complex native i18n plugin, define reusable **object field types** that bundle every locale into a single field:

```ts
// src/sanity/schemaTypes/objects/locale-string.ts — for short text (titles, badges)
export const localeString = defineType({
  name: "localeString",
  type: "object",
  fields: [
    defineField({
      name: "el",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "en",
      type: "string",
      validation: (r) => r.required(),
    }),
  ],
});

// src/sanity/schemaTypes/objects/locale-block-content.ts — for rich text (with inline images)
export const localeBlockContent = defineType({
  name: "localeBlockContent",
  type: "object",
  fields: [
    defineField({
      name: "el",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "en",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
});
```

A document schema then just uses `type: "localeString"` / `type: "localeBlockContent"` on any field that needs translation, and the Studio renders both language inputs side by side in the same document — one document per article/event/etc., not one per language. GROQ returns the whole `{ el, en }` object; the frontend picks the active locale at render time (see [4.3](#43-the-pick-helper-locale-aware-field-access)).

### 3.4 PortableText Rendering with Custom Serializers

Rich text fields (`localeBlockContent`) come back from GROQ as a Portable Text array — an abstract JSON tree, not HTML. `@portabletext/react`'s `<PortableText>` component renders it, and **custom serializers** (a `PortableTextComponents` object) control exactly how each block/mark/type is rendered:

```tsx
// src/components/media/portable-text-image-components.tsx
export const portableTextImageComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const url = urlForImage(value).width(1200).fit("max").url();
      return (
        <img
          src={url}
          alt={value.alt || ""}
          className="my-8 w-full rounded-xl"
        />
      );
    },
  },
  // Extend with `marks: { link: (...) => <a .../> }`, `block: { h2: (...) => <h2 .../> }`, etc.
};

// usage:
<PortableText
  value={article.content[locale]}
  components={portableTextImageComponents}
/>;
```

Key decisions worth carrying forward:

- **Inline images use a plain `<img>`, not `next/image`.** `next/image` needs a known aspect ratio ahead of render (fixed `width`/`height` or a `fill` parent with defined dimensions); a Portable Text inline image can be any shape an editor uploads, so forcing one breaks layout. Accept the image-optimization trade-off for this specific, editor-driven, in-body-content case.
- **One shared serializer set, reused everywhere Portable Text appears** (news body, event description, conference description, about-page copy) — consistent typography/image treatment sitewide, defined once.
- **Plain-text extraction for teasers.** List/card views need a short, unformatted excerpt (not full rich text) — a small helper walks the Portable Text block array and concatenates `children[].text`, guarding with `Array.isArray()` before iterating (a field that was migrated from plain `string` to Portable Text can leave _already-published_ documents with the old shape; without the guard, `.filter()` on a string throws — sanitize CMS input defensively wherever a schema has changed shape over the project's lifetime):
  ```ts
  export function getPlainTextExcerpt(
    blocks: PortableTextBlock[] | null | undefined,
    maxLength = 200,
  ): string {
    if (!Array.isArray(blocks) || blocks.length === 0) return "";
    const text = blocks
      .filter((b) => b._type === "block")
      .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
      .join(" ")
      .trim();
    return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
  }
  ```

### 3.5 Image Handling

- `@sanity/image-url` builds CDN-optimized URLs on demand: `urlForImage(image).width(1000).height(750).fit("crop").url()`. Always request the exact dimensions/fit the layout needs — never pipe the raw asset URL to `next/image`.
- `next.config.ts` must whitelist Sanity's CDN host for `next/image` to be allowed to optimize it further:
  ```ts
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }];
  }
  ```
- The `hotspot`/`crop` option (`options: { hotspot: true }` on an `image` field) lets editors pick the focal point in the Studio — respected automatically by `fit("crop")` URLs.

---

## 4. Internationalization (i18n)

### 4.1 Core Setup (three files, `src/i18n/`)

```ts
// routing.ts — the single source of truth for supported locales
export const routing = defineRouting({
  locales: ["el", "en"],
  defaultLocale: "el",
  localePrefix: "always", // every URL is prefixed: /el/..., /en/... — never a bare, ambiguous "/"
});

// navigation.ts — locale-aware replacements for next/link and next/navigation
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// request.ts — resolves the active locale per-request and loads its message catalog
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

`next.config.ts` wraps the Next config with the plugin so the request config is wired in automatically:

```ts
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);
```

**Note on `middleware.ts`:** the standard, recommended next-intl setup additionally ships a `middleware.ts` at the project root that runs `createMiddleware(routing)` — this is what makes an unprefixed request to `/` auto-detect the visitor's browser language and redirect to `/el` or `/en`, and enforces the locale prefix on every request at the edge, before any route handler runs. **Add this file in future projects** — it is the piece that makes "always"-prefixed URLs actually reachable from a bare domain root. (Its absence should be treated as a known gap to close, not a pattern to copy.)

### 4.2 Server Components

Every localized page/section is an `async` Server Component. Two APIs from `next-intl/server` cover all server-side needs:

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // enables static rendering for this locale (pairs with generateStaticParams)
  const t = await getTranslations("AboutPage"); // namespaced lookup into messages/{locale}.json
  return <h1>{t("title")}</h1>;
}
```

- `generateStaticParams` in the root `[locale]/layout.tsx` (`routing.locales.map((locale) => ({ locale }))`) tells Next.js to pre-render every locale at build time.
- `generateMetadata` also runs server-side and can call `getTranslations({ locale, namespace: "Metadata" })` for localized `<title>`/`<meta description>`, plus build `alternates.languages` from `routing.locales` for hreflang tags.
- `notFound()` guards against an invalid `locale` param (`hasLocale(routing.locales, locale)`) reaching the render.

### 4.3 Client Components

Client Components (interactive UI: language switcher, forms, theme toggle) use the **hook** equivalents, exposed by plain `next-intl` (not `/server`):

```tsx
"use client";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname(); // locale-agnostic pathname, from next-intl's own hook
  const router = useRouter(); // locale-aware router

  return (
    <button onClick={() => router.replace(pathname, { locale: "en" })}>
      {t("en")}
    </button>
  );
}
```

This works because `[locale]/layout.tsx` wraps the whole tree in `<NextIntlClientProvider>` (no `messages` prop needed — it inherits the ones resolved server-side by `request.ts` for the current request), making the same message catalog available to `useTranslations` on the client without a second fetch/round-trip.

### 4.4 Message File Structure

`messages/el.json` and `messages/en.json` are **flat, namespaced JSON**, with **identical key structure** in both files:

```json
{
  "SkipLink": { "label": "Μετάβαση στο περιεχόμενο" },
  "LanguageSwitcher": { "el": "Ελληνικά", "en": "Αγγλικά" },
  "ConferencesPage": { "readMore": "Μάθετε περισσότερα" },
  "Metadata": {
    "title": "...",
    "description": "...",
    "keywords": ["...", "..."]
  }
}
```

- **One namespace per feature/section** (`ConferencesPage`, `ContactForm`, `Footer`…), matching `getTranslations("Namespace")` / `useTranslations("Namespace")` calls — keeps lookups short (`t("readMore")` not `t("ConferencesPage.readMore")`) and keeps each JSON block reviewable independently.
- These files hold **UI chrome strings** (buttons, labels, empty states, form validation messages, nav labels) — **not** page content. Page content (article bodies, event descriptions) lives in Sanity. The dividing line: if a content editor should be able to change it without a code deploy, it's Sanity; if it's a fixed piece of interface vocabulary, it's a message file.

---

## 5. Custom UI & Navigation Patterns

### 5.1 The "Stretched Link" Pattern (and the `backdrop-filter` Bug)

**Goal:** an entire card (image + text block) should be clickable as one unit, navigating to the detail page — without wrapping the whole card in a single `<a>` (which would be invalid HTML the moment a _second_, more specific link — e.g. a CTA button — needs to sit inside it: `<a>` cannot contain another `<a>`, and React will throw a hydration error).

**Standard solution — the "stretched link" CSS trick:** put a real `<Link>` around just the title, then stretch it to cover the whole card using an absolutely-positioned pseudo-element:

```tsx
<h2>
  <Link href={href} className="after:absolute after:inset-0">
    {title}
  </Link>
</h2>
```

`after:absolute after:inset-0` creates an invisible `::after` overlay that fills the **nearest positioned (`position: relative/absolute/fixed`) ancestor** — normally the whole card — making the entire card clickable while the actual `<a>` tag stays small and semantically attached to just the title.

**The bug this project hit:** the card was split into two halves — an image half and a `backdrop-blur-xl` (`backdrop-filter: blur(...)`) glassmorphism content-card half, laid out side-by-side, not one single container. Applying `after:absolute after:inset-0` to the title (nested inside the _content-card_ half) only ever stretched to cover _that half_ — the image half stayed unclickable. Increasing `inset` values or trying to push the overlay further did not help, because of a specific, easy-to-miss CSS rule:

> **`backdrop-filter` (like `transform`, `filter`, `will-change: transform`, and a few others) makes an element establish a new _containing block_ for its `position: absolute` descendants** — identical to what `transform` does. An `absolute`-positioned pseudo-element nested inside a `backdrop-filter` element is now positioned **relative to that element**, not relative to whatever `position: relative` ancestor sits further up the tree. It structurally _cannot_ escape the content-card's boundaries to also cover the image half, no matter what `inset`/`top`/`left` values are used.

**The fix — two independent stretched links, not one:**

```tsx
<div className="group relative flex ...">                 {/* row: image + content-card, side by side */}
  <div className="relative ...">                            {/* image half — NO backdrop-filter */}
    <Link href={href} aria-hidden="true" tabIndex={-1} className="absolute inset-0 z-10" />
    <Image ... />
  </div>

  <div className="... backdrop-blur-xl ...">                {/* content-card half — HAS backdrop-filter */}
    <h2>
      <Link href={href} className="after:absolute after:inset-0">{title}</Link>
    </h2>
    {/* an independent CTA link/button is safe here: relative z-10, NOT nested inside the title <Link> */}
    <Link href={ctaHref} className="relative z-10 ...">{ctaText}</Link>
  </div>
</div>
```

1. **Visible link on the title**, `after:absolute after:inset-0`, covering only its own half (the content-card) — this is fine, because that half has no separate clickable child besides the title's own overlay.
2. **A second, invisible link inside the image half** (`aria-hidden="true" tabIndex={-1}`, so it's skipped by screen readers and keyboard `Tab` — it's a pure visual/mouse convenience duplicate of the title link, not a second distinct destination), `absolute inset-0 z-10`, positioned relative to the image half's own `position: relative` container — which has no `backdrop-filter`, so this one behaves as expected.
3. **Any other real link inside the content-card** (a CTA button) stays its own, independent `<a>`/`Link`, `relative z-10` (so it sits above the stretched overlay and remains individually clickable/hoverable), and crucially is **not nested inside** the title's `<Link>` — it's a sibling, not a child, avoiding the invalid-nested-anchor hydration error entirely.

**Generalize this rule:** any time a "clickable card" pattern is split across a `backdrop-filter` (or `transform`/`filter`) boundary, a single stretched-link overlay cannot cross that boundary — plan for one overlay _per containing-block region_, all pointing at the same `href`.

### 5.2 Fallback Strategy (CMS-Empty → Hardcoded Fallback)

**Problem:** during initial build-out (and forever after, for any brand-new singleton an editor hasn't touched yet — see [3.1.4](#31-desk-structure--the-singleton-pattern)), a Sanity query can legitimately return `null` or an empty array. The site must never render broken/undefined text, a crash, or a visibly empty section while waiting for a content editor to fill the Studio.

**Pattern — every CMS-sourced string has a paired next-intl fallback, resolved through one small helper:**

```ts
// src/sanity/locale-content.ts
export type LocalizedText = { el: string; en: string };

export function pick(
  field: LocalizedText | null | undefined,
  locale: AppLocale,
  fallback: string,
) {
  return field?.[locale] || fallback;
}
```

```tsx
// usage in a component:
const t = await getTranslations("ConferencesPage");
const title = pick(conference.title, locale, t("untitledFallback"));
```

Rules that make this durable:

- **The fallback string itself lives in `messages/{locale}.json`**, not hardcoded inline in the component — so even the "nothing in the CMS yet" state is itself translated and centrally editable by a developer (not a content editor — this is a _developer_-owned safety net, distinct from CMS content).
- **`pick()` is used for every single CMS-sourced display string**, without exception, even for fields that "should always be required" in the schema — Studio-side `validation: required()` prevents _saving_ an incomplete document, but does nothing to protect against a document that simply doesn't exist yet at all (a brand-new singleton) or a field added to the schema _after_ older documents were already published (which won't retroactively have a value).
- **Collections get an explicit empty state, not a silently blank section.** A list query returning `[]` (no events yet, no sponsors yet) renders a dedicated "nothing here yet" component (e.g. `ConferencesEmptyState`) rather than an empty `<div>` — visible in dev/staging, reassuring rather than looking broken.
- **Defensive shape-guards for schema migrations.** When a field's _type_ changes shape over the project's life (e.g. `string` → Portable Text array, see [3.4](#34-portabletext-rendering-with-custom-serializers)), already-published documents keep the _old_ shape until an editor re-saves them — code reading that field must tolerate both shapes (or at minimum, `Array.isArray()`-guard before array operations) rather than assuming the current schema definition describes every existing document.

---

## 6. Deployment Checklist

### 6.1 Sanity Project Setup

1. Create the Sanity project (`sanity.io/manage` or `pnpm dlx sanity init` if scaffolding fresh) — note the generated **Project ID**.
2. Decide the **dataset** name (`production` is the default/convention; add a second `development`/`staging` dataset if content-editors need a safe sandbox).
3. Under **API → CORS Origins**, add every origin the Studio (and any client-side Sanity fetches) will be served from:
   - `http://localhost:3000` (local dev) — with **"Allow credentials"** checked if using authenticated/preview requests.
   - The Vercel-generated preview domain pattern (`https://*.vercel.app`, or explicitly add each preview URL as it's created — Sanity does not support wildcard subdomains other than via their own preview-branch tooling).
   - The final production custom domain (`https://yoursite.com`), added _before_ the first production deploy that needs to write to/preview from Sanity — a missing CORS origin manifests as a silent, browser-console-only `fetch` failure, easy to misdiagnose as a Vercel or DNS problem.
4. Under **API → Tokens**, create a **write-access token** (Editor role or higher) only if the project needs server-side writes (a one-off bootstrap script like `scripts/init-settings.mjs`, a webhook-triggered revalidation, or Studio-side preview mode). Read-only public queries via `useCdn: true` need **no token at all** — don't create or ship one unless something genuinely needs write access.

### 6.2 Environment Variables

| Variable                                            | Prefix rule                            | Purpose                                                                                                                                                                           |
| --------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`                     | Public (client + server)               | Identifies the Sanity project to query.                                                                                                                                           |
| `NEXT_PUBLIC_SANITY_DATASET`                        | Public                                 | Which dataset to read (`production`, etc.).                                                                                                                                       |
| `NEXT_PUBLIC_SANITY_API_VERSION`                    | Public                                 | Pinned API version date (`YYYY-MM-DD`) — pin it, don't leave it floating, so a Sanity API change can't silently alter query behavior mid-project.                                 |
| `SANITY_API_TOKEN`                                  | **Server-only — never `NEXT_PUBLIC_`** | Write-access token, only if something server-side needs to write (bootstrap scripts, revalidation webhooks). Leaking this client-side would let any visitor write to the dataset. |
| `RESEND_API_KEY` (or equivalent email provider key) | **Server-only**                        | Used inside Route Handlers (`app/api/*/route.ts`) only — never referenced from a Client Component.                                                                                |
| `NEXT_PUBLIC_SITE_URL`                              | Public                                 | Feeds `metadataBase` for absolute OG/Twitter image URLs; only needed as an override while the production domain isn't fully cut over yet.                                         |

Checklist:

- [ ] `.env.example` committed to the repo, with every variable name present and **empty values** (or safe defaults like `dataset=production`) — never real secrets.
- [ ] `.env.local` in `.gitignore`, holds real local values, never committed.
- [ ] The exact same variable set (with real production values) added in **Vercel → Project Settings → Environment Variables**, scoped correctly per Vercel environment (Production / Preview / Development) — a token meant only for local scripts shouldn't automatically also be exposed to every Preview deploy unless intended.
- [ ] Any variable **without** the `NEXT_PUBLIC_` prefix is confirmed to be read only inside a Server Component, Route Handler, or build-time script — grep for it before shipping if unsure.

### 6.3 Vercel Setup

1. Import the GitHub repository into Vercel (Next.js is auto-detected — no custom build command needed for a standard App Router project).
2. Confirm the **package manager** is correctly detected (pnpm) — a `pnpm-lock.yaml` at the repo root plus `"packageManager": "pnpm@x.y.z"` in `package.json` (Corepack pin) keeps local, CI, and Vercel installs reproducible and prevents a Vercel-side auto-upgrade to a different pnpm major version from silently changing resolution.
3. Pin `"engines": { "node": ">=X.Y.Z" }` in `package.json` to the Node version the framework actually requires, so Vercel's build environment matches local dev.
4. Add every environment variable from [6.2](#62-environment-variables) in Project Settings, **before** the first deploy that needs them (a missing var at build time can silently bake a wrong fallback into a static page rather than failing loudly).
5. **Hobby-tier gotcha:** Vercel's free tier blocks deploys triggered by commits from a Git author who isn't a collaborator with a verified, matching email on the Vercel account. If deploys mysteriously fail to trigger with no build log at all, check the commit author email first — fix with a correctly-configured `git config user.email`/`user.name` (repo-scoped, not global, if multiple projects use different authors) rather than repeatedly force-pushing empty commits.
6. Confirm the production build passes locally first: `pnpm build` (and ideally `tsc --noEmit`, `pnpm lint`, `pnpm format:check`) — cheaper to catch a type error locally than via a failed Vercel build.

### 6.4 Custom Domain & DNS (Cloudflare or any registrar/DNS host)

1. In Vercel → Project → Settings → Domains, add the production domain (and `www` variant if both should resolve).
2. At the DNS host (e.g. Cloudflare):
   - For an **apex/root domain** (`example.com`): add the **A record** Vercel provides (typically `76.76.21.21`), or if the DNS host supports it, an **ALIAS/ANAME/CNAME-flattening** record pointed at `cname.vercel-dns.com` — apex domains can't use a plain `CNAME` per the DNS spec.
   - For a **subdomain/`www`**: a `CNAME` record pointed at `cname.vercel-dns.com`.
   - **If using Cloudflare specifically:** set the DNS record's proxy status to **"DNS only" (grey cloud)**, not proxied ("orange cloud"), for the record(s) pointing at Vercel — Cloudflare's proxy in front of Vercel's own edge network can interfere with Vercel's automatic SSL certificate issuance and its own edge caching/ISR behavior. (An org already fully committed to Cloudflare's WAF/proxy features for other reasons should test this combination explicitly rather than assume it "just works.")
3. Wait for DNS propagation, then confirm Vercel shows the domain as **Valid** with automatic SSL issued (Vercel auto-provisions via Let's Encrypt once DNS resolves correctly).
4. Update `NEXT_PUBLIC_SITE_URL` (if used as an override) once the real domain is live, and remove the override entirely once it's the permanent, stable value baked into code as a fallback (see the `metadataBase` fallback pattern in [3.2](#32-groq-query-patterns) / `[locale]/layout.tsx`'s `generateMetadata`).
5. Re-add the final custom domain to the Sanity CORS origins list ([6.1](#61-sanity-project-setup)) if it wasn't already added — this step is easy to forget until the first "content not loading" report from production that doesn't reproduce locally.

### 6.5 Post-Deploy Smoke Test

- [ ] Both locale roots load (`/el`, `/en` — and, if `middleware.ts` is present per [4.1](#41-core-setup-three-files-src-i18n), confirm bare `/` correctly redirects).
- [ ] `/studio` loads and an editor can log in and open/save a singleton document.
- [ ] At least one CMS-empty fallback state renders correctly (a section with no content yet still shows sensible fallback text, not blank/broken).
- [ ] Contact/newsletter form Route Handlers successfully send a real test email end-to-end.
- [ ] OG/Twitter image and title render correctly when the URL is shared (test via a social-preview debugger).
- [ ] Lighthouse pass on the homepage in production (not just dev) — dev-mode performance numbers are not representative.

---

## 7. Reusable Checklist for a New Project

When starting a new site from this blueprint:

1. Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) → wrap with `next-intl` plugin → add `middleware.ts` from day one (don't defer it — see the note in [4.1](#41-core-setup-three-files-src-i18n)).
2. Set up `src/i18n/{routing,navigation,request}.ts` and the `messages/{locale}.json` pair before writing any page — every subsequent component depends on this being in place.
3. Install `sanity`/`next-sanity`/`@sanity/image-url`/`@sanity/vision`, scaffold `sanity.config.ts` at the repo root with `basePath: "/studio"`, and stub `src/sanity/{client,env,image,queries}.ts`.
4. Design the singleton vs. collection split for the content model **before** writing schemas — decide up front which document types are "exactly one instance" (Homepage settings, Contact page, Site Settings) vs. real collections (News, Events, Team members) — retrofitting the singleton pattern onto an already-populated collection is more painful than deciding correctly at the start.
5. Build the `localeString`/`localeText`/`localeBlockContent` reusable object types first, before any content-document schema — every subsequent schema will reference them.
6. Write the `pick()` fallback helper and commit to using it for every single CMS-sourced string from the very first component, not retrofitted later.
7. Establish the Server-Component-fetches / Client-Component-renders-props boundary early — resist the temptation to fetch CMS data client-side "just this once."
8. Defer the deployment checklist ([6](#6-deployment-checklist)) items (CORS, custom domain, Cloudflare) to when there's a real domain to point — but set up the Vercel project + env vars from the first commit, so every push already gets a working Preview deployment to review.
