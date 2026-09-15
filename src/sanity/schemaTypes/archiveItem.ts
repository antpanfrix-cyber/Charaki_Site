import { defineField, defineType } from "sanity";

const IMAGE_CATEGORIES = ["photographs"];
const FILE_CATEGORIES = [
  "historicalDocuments",
  "oralHistories",
  "videos",
  "audioArchive",
];
const URL_CATEGORIES = ["oralHistories", "videos", "audioArchive"];

export const archiveItem = defineType({
  name: "archiveItem",
  title: "Στοιχείο Αρχείου",
  type: "document",
  description:
    "Χρησιμοποίησέ το για ένα μεμονωμένο τεκμήριο (φωτογραφία, έγγραφο, μαρτυρία) με μεταδεδομένα (κατηγορία, έτος, τοποθεσία) που εμφανίζεται στον κατάλογο του Αρχείου. Για εκτενές αφηγηματικό κείμενο με δική του σελίδα, χρησιμοποίησε Θεματική Σελίδα.",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "localeString",
    }),
    defineField({
      name: "category",
      title: "Κατηγορία",
      type: "string",
      options: {
        list: [
          { title: "Φωτογραφίες", value: "photographs" },
          { title: "Ιστορικά Έγγραφα", value: "historicalDocuments" },
          { title: "Οικογενειακές Ιστορίες", value: "familyStories" },
          { title: "Προφορικές Μαρτυρίες", value: "oralHistories" },
          { title: "Βίντεο", value: "videos" },
          { title: "Ηχητικό Αρχείο", value: "audioArchive" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Έτος",
      type: "number",
    }),
    defineField({
      name: "location",
      title: "Τοποθεσία",
      type: "string",
    }),
    defineField({
      name: "person",
      title: "Σχετική Οικογένεια / Πρόσωπο",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Εικόνα",
      type: "image",
      options: { hotspot: true },
      description: "Χρησιμοποιείται για Φωτογραφίες.",
      hidden: ({ document }) =>
        !IMAGE_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "file",
      title: "Αρχείο",
      type: "file",
      description:
        "Χρησιμοποιείται για Ιστορικά Έγγραφα, Προφορικές Μαρτυρίες, Βίντεο και Ηχητικό Αρχείο.",
      hidden: ({ document }) =>
        !FILE_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "externalUrl",
      title: "Εξωτερικός Σύνδεσμος",
      type: "url",
      description:
        "Προαιρετικός σύνδεσμος σε εξωτερικά φιλοξενούμενα πολυμέσα (π.χ. YouTube, SoundCloud) για Προφορικές Μαρτυρίες, Βίντεο και Ηχητικό Αρχείο.",
      hidden: ({ document }) =>
        !URL_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "description",
      title: "Περιγραφή",
      type: "localeText",
    }),
  ],
});
