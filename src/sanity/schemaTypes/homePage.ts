import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Αρχική Σελίδα",
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
      name: "hero",
      title: "Κεντρική Ενότητα (Hero)",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Τίτλος", type: "localeString" }),
        defineField({
          name: "tagline",
          title: "Σύνθημα",
          type: "localeString",
        }),
        defineField({
          name: "image",
          title: "Εικόνα Φόντου",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "primaryCta",
          title: "Κύριο Κουμπί Δράσης",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Ετικέτα",
              type: "localeString",
            }),
            defineField({
              name: "href",
              title: "Σύνδεσμος",
              type: "string",
              description:
                "Διεύθυνση προορισμού του κουμπιού: εσωτερική διαδρομή (π.χ. /archive) ή πλήρες εξωτερικό URL (π.χ. https://...).",
            }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          title: "Δευτερεύον Κουμπί Δράσης",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Ετικέτα",
              type: "localeString",
            }),
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
    }),
    defineField({
      name: "welcome",
      title: "Ενότητα Καλωσορίσματος",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Επικεφαλίδα",
          type: "localeString",
        }),
        defineField({
          name: "text",
          title: "Κείμενο",
          type: "localeBlockContent",
        }),
        defineField({
          name: "ctaLabel",
          title: "Ετικέτα Κουμπιού",
          type: "localeString",
        }),
      ],
    }),
  ],
});
