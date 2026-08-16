import type { PortableTextComponents } from "@portabletext/react";

import { urlForImage } from "@/sanity/image";

// Reused everywhere Portable Text appears (news body, event/archive descriptions
// if they grow richer later) — one shared serializer set, defined once (Blueprint 3.4).
export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed text-navy/90">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold text-navy">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold text-navy">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold pl-4 text-navy/70 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-gold underline underline-offset-2 hover:text-navy"
      >
        {children}
      </a>
    ),
  },
  types: {
    // Inline image uses a plain <img>, not next/image: a Portable Text image
    // can be any shape an editor uploads, so forcing an aspect ratio breaks layout.
    image: ({ value }) => {
      const url = urlForImage(value).width(1200).fit("max").url();
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={typeof value?.alt === "string" ? value.alt : ""}
          className="my-8 w-full rounded-xl"
        />
      );
    },
  },
};
