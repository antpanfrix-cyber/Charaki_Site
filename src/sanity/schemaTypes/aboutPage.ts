import { defineField, defineType } from "sanity";

import { topicReferenceFilter } from "./topic";
import { maxLocaleLength } from "./validation";

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
              validation: (rule) => rule.required().custom(maxLocaleLength(60)),
            }),
            defineField({
              name: "description",
              title: "Περιγραφή",
              type: "localeTextShort",
              description: "Σύντομο εισαγωγικό κείμενο, έως 200 χαρακτήρες.",
            }),
            defineField({
              name: "link",
              title: "Σύνδεσμος",
              type: "string",
              description:
                "Προαιρετικός. Αγνοείται αν έχει επιλεγεί Θεματική Σελίδα παρακάτω — τότε ο σταθμός οδηγεί εκεί.",
            }),
            defineField({
              name: "topic",
              title: "Θεματική Σελίδα",
              type: "reference",
              to: [{ type: "topic" }],
              options: { filter: topicReferenceFilter },
              description:
                "Προαιρετικό. Αν επιλεγεί, ο σταθμός οδηγεί στην πλήρη Θεματική Σελίδα και παίρνει τίτλο/κείμενο από εκεί (τα παραπάνω πεδία λειτουργούν ως εφεδρικά).",
            }),
          ],
          preview: {
            select: {
              title: "title.el",
              subtitle: "description.el",
              topicTitle: "topic.title.el",
            },
            prepare: ({ title, subtitle, topicTitle }) => ({
              title: title || topicTitle || "Χωρίς τίτλο",
              subtitle: topicTitle ? `→ ${topicTitle}` : subtitle,
            }),
          },
        },
      ],
    }),
  ],
});
