import { defineField, defineType } from "sanity";

const LENGTH_WARNING =
  "Έως 200 χαρακτήρες. Για εκτενές κείμενο φτιάξε Θεματική Σελίδα και σύνδεσέ την με την κάρτα.";

export const localeTextShort = defineType({
  name: "localeTextShort",
  title: "Πολύγλωσσο Κείμενο (Σύντομο εισαγωγικό)",
  type: "object",
  description:
    "Σύντομο εισαγωγικό κείμενο για κάρτες-teaser, έως 200 χαρακτήρες.",
  fields: [
    defineField({
      name: "el",
      title: "Ελληνικά",
      type: "text",
      rows: 3,
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning(LENGTH_WARNING),
      ],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
      description:
        "Προαιρετικό. Αν μείνει κενό, εμφανίζεται το ελληνικό κείμενο.",
      validation: (rule) => rule.max(200).warning(LENGTH_WARNING),
    }),
  ],
});
