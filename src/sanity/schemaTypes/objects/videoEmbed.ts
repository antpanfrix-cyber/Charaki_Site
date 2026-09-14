import { defineField, defineType } from "sanity";

const VIDEO_URL_PATTERN =
  /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i;

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Βίντεο",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Σύνδεσμος Βίντεο",
      type: "url",
      description: "Σύνδεσμος από YouTube ή Vimeo.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true;
          return (
            VIDEO_URL_PATTERN.test(value) ||
            "Μόνο σύνδεσμοι YouTube ή Vimeo γίνονται δεκτοί."
          );
        }),
    }),
    defineField({
      name: "caption",
      title: "Λεζάντα",
      type: "string",
      description: "Προαιρετική.",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Βίντεο",
      subtitle,
    }),
  },
});
