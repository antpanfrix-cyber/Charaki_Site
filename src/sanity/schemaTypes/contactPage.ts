import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
      name: "heading",
      title: "Heading",
      type: "localeString",
    }),
    defineField({
      name: "intro",
      title: "Intro Text",
      type: "localeText",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "localeString",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
    }),
  ],
});
