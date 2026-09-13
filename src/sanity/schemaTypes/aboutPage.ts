import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "Σελίδα Σχετικά με Εμάς",
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
      title: "Εισαγωγικό Κείμενο",
      type: "localeText",
    }),
    defineField({
      name: "journey",
      title: "Ενότητα «Η Πορεία μας»",
      type: "object",
      fields: [
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
    }),
    defineField({
      name: "milestones",
      title: "Σταθμοί Πορείας",
      description:
        "Η χρονολογική λίστα σταθμών που εμφανίζεται στη σελίδα. Η σειρά εδώ καθορίζει τη σειρά εμφάνισης.",
      type: "array",
      of: [
        {
          type: "object",
          name: "milestone",
          fields: [
            defineField({
              name: "title",
              title: "Τίτλος",
              type: "localeString",
            }),
            defineField({
              name: "description",
              title: "Περιγραφή",
              type: "localeText",
            }),
          ],
          preview: {
            select: { title: "title.el" },
          },
        },
      ],
    }),
  ],
});
