import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ρυθμίσεις Ιστότοπου",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Τίτλος Ιστότοπου",
      type: "localeString",
    }),
    defineField({
      name: "logo",
      title: "Λογότυπο",
      type: "image",
    }),
    defineField({
      name: "seo",
      title: "Προεπιλεγμένο SEO",
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
      name: "email",
      title: "Email Επικοινωνίας",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Τηλέφωνο Επικοινωνίας",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Διεύθυνση",
      type: "localeString",
    }),
    defineField({
      name: "socialLinks",
      title: "Σύνδεσμοι Κοινωνικών Δικτύων",
      type: "object",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
  ],
});
