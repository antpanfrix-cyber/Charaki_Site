import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Γκαλερί Εικόνων",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Εικόνες",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Εναλλακτικό Κείμενο",
              type: "string",
              description: "Για προσβασιμότητα και SEO.",
            }),
            defineField({
              name: "caption",
              title: "Λεζάντα",
              type: "string",
            }),
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { media: "images.0" },
    prepare: ({ media }) => ({
      title: "Γκαλερί Εικόνων",
      media,
    }),
  },
});
