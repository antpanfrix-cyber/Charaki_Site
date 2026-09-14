import { defineField, defineType } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Πολύγλωσσο Κείμενο (Σύντομο)",
  type: "object",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      description:
        "Προαιρετικό. Αν μείνει κενό, εμφανίζεται το ελληνικό κείμενο.",
    }),
  ],
});
