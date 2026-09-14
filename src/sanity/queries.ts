import { defineQuery } from "next-sanity";

// Singletons

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteTitle,
    logo,
    seo,
    email,
    phone,
    address,
    socialLinks
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0] {
    seo,
    hero,
    welcome
  }
`);

export const contactPageQuery = defineQuery(`
  *[_type == "contactPage"][0] {
    seo,
    heading,
    intro,
    address,
    mapEmbedUrl
  }
`);

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0] {
    seo,
    heading,
    intro,
    journey,
    milestones
  }
`);

export const rootsPageQuery = defineQuery(`
  *[_type == "rootsPage"][0] {
    seo,
    heading,
    intro,
    cards,
    sections,
    cta
  }
`);

export const culturePageQuery = defineQuery(`
  *[_type == "culturePage"][0] {
    seo,
    heading,
    intro,
    cards,
    viewMoreLabel
  }
`);

export const archivePageQuery = defineQuery(`
  *[_type == "archivePage"][0] {
    seo,
    heading,
    intro
  }
`);

export const newsPageQuery = defineQuery(`
  *[_type == "newsPage"][0] {
    seo,
    heading,
    intro
  }
`);

export const eventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0] {
    seo,
    heading,
    intro
  }
`);

// News

export const allNewsQuery = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    image
  }
`);

export const newsBySlugQuery = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    title,
    publishedAt,
    category,
    excerpt,
    content,
    image
  }
`);

export const newsSlugsQuery = defineQuery(`
  *[_type == "news" && defined(slug.current)].slug.current
`);

// Events

export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && isUpcoming == true] | order(date asc) {
    _id,
    title,
    "slug": slug.current,
    date,
    time,
    location,
    image,
    description
  }
`);

export const pastEventsQuery = defineQuery(`
  *[_type == "event" && isUpcoming == false] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    date,
    time,
    location,
    image,
    description
  }
`);

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    title,
    date,
    time,
    location,
    image,
    description,
    isUpcoming
  }
`);

export const eventSlugsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)].slug.current
`);

// Archive

export const archiveItemsQuery = defineQuery(`
  *[_type == "archiveItem"] | order(year desc) {
    _id,
    title,
    category,
    year,
    location,
    person,
    image,
    "file": file.asset->{ url, originalFilename, mimeType },
    externalUrl,
    description
  }
`);
