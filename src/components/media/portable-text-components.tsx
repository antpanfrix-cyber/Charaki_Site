import type { PortableTextComponents } from "@portabletext/react";

import { urlForImage } from "@/sanity/image";

function videoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id =
        parsed.searchParams.get("v") || parsed.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

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
      const alt = typeof value?.alt === "string" ? value.alt : "";
      const caption = typeof value?.caption === "string" ? value.caption : "";
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} className="w-full rounded-xl" />
          {caption ? (
            <figcaption className="mt-2 text-center text-sm text-navy/60">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      const url = typeof value?.url === "string" ? value.url : "";
      const caption = typeof value?.caption === "string" ? value.caption : "";
      const embedUrl = url ? videoEmbedUrl(url) : null;
      if (!embedUrl) return null;

      return (
        <div className="my-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              src={embedUrl}
              title={caption || "Βίντεο"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {caption ? (
            <p className="mt-2 text-center text-sm text-navy/60">
              {caption}
            </p>
          ) : null}
        </div>
      );
    },
    // No lightbox: each thumbnail links to the full-size original in a new
    // tab instead, keeping this a Server Component (no client JS needed).
    gallery: ({ value }) => {
      const images = Array.isArray(value?.images) ? value.images : [];
      if (images.length === 0) return null;

      return (
        <div className="my-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image: Record<string, unknown>, index: number) => {
            const thumbUrl = urlForImage(image)
              .width(400)
              .height(400)
              .fit("crop")
              .url();
            const fullUrl = urlForImage(image).url();
            const alt = typeof image?.alt === "string" ? image.alt : "";
            const caption =
              typeof image?.caption === "string" ? image.caption : "";

            return (
              <a
                key={(image._key as string) ?? index}
                href={fullUrl}
                target="_blank"
                rel="noopener"
                className="group block overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbUrl}
                  alt={alt}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {caption ? (
                  <span className="mt-1 block text-xs text-navy/60">
                    {caption}
                  </span>
                ) : null}
              </a>
            );
          })}
        </div>
      );
    },
  },
};
