import { defineField, defineType } from "sanity";

export const archivePage = defineType({
  name: "archivePage",
  title: "Σελίδα Αρχείου",
  type: "document",
  description:
    "Περιεχόμενο της σελίδας Αρχείου (τίτλος, εισαγωγή, SEO) — όχι τα ίδια τα στοιχεία του αρχείου, που διαχειρίζονται ξεχωριστά.",
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
