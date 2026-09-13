import { defineField, defineType } from "sanity";

export const newsPage = defineType({
  name: "newsPage",
  title: "Σελίδα Νέων",
  type: "document",
  description:
    "Περιεχόμενο της σελίδας Νέων (τίτλος, εισαγωγή, SEO) — όχι τα ίδια τα άρθρα, που διαχειρίζονται ξεχωριστά.",
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
