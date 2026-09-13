import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Εκδήλωση",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "localeString",
    }),
    defineField({
      name: "slug",
      title: "Σύντομος Σύνδεσμος (Slug)",
      type: "slug",
      description:
        "Δημιουργείται αυτόματα από τον αγγλικό τίτλο και χρησιμοποιείται στη διεύθυνση URL της σελίδας (π.χ. /events/onoma-ekdilosis). Πατήστε 'Generate' για να το δημιουργήσετε ή να το ανανεώσετε.",
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
      title: "Ημερομηνία",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "time",
      title: "Ώρα",
      type: "string",
      description: 'π.χ. "18:00"',
    }),
    defineField({
      name: "location",
      title: "Τοποθεσία",
      type: "localeString",
    }),
    defineField({
      name: "image",
      title: "Εικόνα",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Περιγραφή",
      type: "localeText",
    }),
    defineField({
      name: "isUpcoming",
      title: "Επερχόμενη Εκδήλωση",
      type: "boolean",
      description:
        "Καθορίζει αν η εκδήλωση εμφανίζεται στις Επερχόμενες ή στις Παλαιότερες εκδηλώσεις.",
      initialValue: true,
    }),
  ],
});
