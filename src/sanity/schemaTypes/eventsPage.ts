import { defineField, defineType } from "sanity";

export const eventsPage = defineType({
  name: "eventsPage",
  title: "Σελίδα Εκδηλώσεων",
  type: "document",
  description:
    "Περιεχόμενο της σελίδας Εκδηλώσεων (τίτλος, εισαγωγή, SEO) — όχι οι ίδιες οι εκδηλώσεις, που διαχειρίζονται ξεχωριστά.",
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Τίτλος", type: "localeString" }),
        defineField({
          name: "description",
          title: "Περιγραφή",
          type: "localeText",
        }),
      ],
    }),
    defineField({
      name: "heading",
      title: "Επικεφαλίδα",
      type: "localeString",
    }),
    defineField({
      name: "intro",
      title: "Εισαγωγικό Κείμενο",
      type: "localeText",
    }),
  ],
});
