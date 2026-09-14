import { defineField, defineType } from "sanity";

export const culturePage = defineType({
  name: "culturePage",
  title: "Σελίδα Πολιτισμός",
  type: "document",
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
      title: "Εισαγωγικό Κείμενο (Υπότιτλος)",
      type: "localeText",
    }),
    defineField({
      name: "cards",
      title: "Κάρτες Θεματικών Ενοτήτων",
      description:
        "Η σειρά εδώ καθορίζει τη σειρά εμφάνισης των καρτών στη σελίδα.",
      type: "array",
      of: [{ type: "card" }],
    }),
    defineField({
      name: "viewMoreLabel",
      title: "Ετικέτα «Δείτε Περισσότερα»",
      type: "localeString",
    }),
  ],
});
