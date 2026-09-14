import { defineField, defineType } from "sanity";

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Πολύγλωσσο Εμπλουτισμένο Κείμενο",
  type: "object",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
      description:
        "Προαιρετικό. Αν μείνει κενό, εμφανίζεται το ελληνικό κείμενο.",
    }),
  ],
});
