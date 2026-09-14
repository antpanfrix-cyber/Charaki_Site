import type { Image } from "sanity";

import type { AppLocale, LocalizedText } from "@/sanity/locale-content";
import { pick } from "@/sanity/locale-content";

type CardLike = {
  title: LocalizedText;
  description?: LocalizedText | null;
  image?: Image | null;
  link?: string | null;
  topic?: {
    title: LocalizedText;
    excerpt?: LocalizedText | null;
    coverImage?: Image | null;
    slug: string;
  } | null;
};

export type ResolvedCard = {
  title: string;
  description: string;
  image?: Image | null;
  href?: string;
};

/**
 * Card/milestone -> topic reference resolution, shared by roots/culture/about.
 * Per-field fallback chain, not a wholesale override: a linked topic missing
 * an excerpt or cover image still lets the card's own inline text/image show
 * through, instead of going blank.
 *   title:       topic.title      -> card.title
 *   description: topic.excerpt    -> card.description
 *   image:       topic.coverImage -> card.image
 *   href:        topic slug (/topics/<slug>) -> card.link -> none
 */
export function resolveCard(card: CardLike, appLocale: AppLocale): ResolvedCard {
  const topic = card.topic;

  const title = pick(topic?.title ?? card.title, appLocale, "");
  const description = pick(topic?.excerpt ?? card.description, appLocale, "");
  const image = topic?.coverImage ?? card.image;
  const href = topic?.slug ? `/topics/${topic.slug}` : card.link || undefined;

  return { title, description, image, href };
}
