import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "localeString" }),
        defineField({
          name: "description",
          title: "Description",
          type: "localeText",
        }),
      ],
    }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "localeString" }),
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "localeString",
        }),
        defineField({
          name: "image",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localeString",
            }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          title: "Secondary CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localeString",
            }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "welcome",
      title: "Welcome Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "localeString",
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "localeBlockContent",
        }),
        defineField({
          name: "ctaLabel",
          title: "CTA Label",
          type: "localeString",
        }),
      ],
    }),
  ],
});
