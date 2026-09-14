import { defineField, defineType } from "sanity";

export const rootsPage = defineType({
  name: "rootsPage",
  title: "Σελίδα Ρίζες",
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
      type: "localeString",
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
      name: "sections",
      title: "Ενότητες Κειμένου",
      description:
        "Εδώ μπαίνουν τα μεγάλα κείμενα (ιστορικό, αναμνήσεις κ.λπ.) που δεν χωράνε σε μια κάρτα-teaser. Εμφανίζονται κάτω από τις κάρτες, σε στήλη ανάγνωσης.",
      type: "array",
      of: [{ type: "pageSection" }],
    }),
    defineField({
      name: "cta",
      title: "Κουμπί Δράσης",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Ετικέτα", type: "localeString" }),
        defineField({
          name: "href",
          title: "Σύνδεσμος",
          type: "string",
          description:
            "Διεύθυνση προορισμού του κουμπιού: εσωτερική διαδρομή (π.χ. /archive) ή πλήρες εξωτερικό URL (π.χ. https://...).",
        }),
      ],
    }),
  ],
});
