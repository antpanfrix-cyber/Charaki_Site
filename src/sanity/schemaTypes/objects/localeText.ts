import { defineField, defineType } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
});
