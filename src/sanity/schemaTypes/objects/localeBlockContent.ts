import { defineField, defineType } from "sanity";

// Shared by el/en below — keeps the two arrays' block types from drifting
// apart. `image` stays `_type: "image"` (just gains alt/caption) so existing
// Portable Text content keeps rendering unchanged.
const richContentTypes = [
  { type: "block" },
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
  { type: "videoEmbed" },
  { type: "gallery" },
];

export const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Πολύγλωσσο Εμπλουτισμένο Κείμενο",
  type: "object",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "array",
      of: richContentTypes,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: richContentTypes,
      description:
        "Προαιρετικό. Αν μείνει κενό, εμφανίζεται το ελληνικό κείμενο.",
    }),
  ],
});
