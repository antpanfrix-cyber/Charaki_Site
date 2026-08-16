import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "localeString",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
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
      name: "email",
      title: "Contact Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "localeString",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
  ],
});
