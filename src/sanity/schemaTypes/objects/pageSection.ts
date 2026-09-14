import { defineField, defineType } from "sanity";

export const pageSection = defineType({
  name: "pageSection",
  title: "Ενότητα Κειμένου",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "localeString",
    }),
    defineField({
      name: "body",
      title: "Κείμενο",
      type: "localeBlockContent",
    }),
    defineField({
      name: "image",
      title: "Εικόνα",
      type: "image",
      options: { hotspot: true },
      description: "Προαιρετική.",
    }),
  ],
  preview: {
    select: { title: "title.el", media: "image" },
  },
});
