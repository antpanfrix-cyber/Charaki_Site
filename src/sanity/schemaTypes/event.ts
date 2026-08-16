import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) => {
          const title = doc.title as { en?: string } | undefined;
          return title?.en ?? "";
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: 'e.g. "18:00"',
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "localeString",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
    }),
    defineField({
      name: "isUpcoming",
      title: "Upcoming Event",
      type: "boolean",
      description:
        "Controls whether this event is listed under Upcoming or Past events.",
      initialValue: true,
    }),
  ],
});
