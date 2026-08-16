import { defineField, defineType } from "sanity";

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized Block Content",
  type: "object",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
});
