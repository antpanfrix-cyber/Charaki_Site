import { defineField, defineType } from "sanity";

export const news = defineType({
  name: "news",
  title: "Νέα",
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
        "Δημιουργείται αυτόματα από τον αγγλικό τίτλο και χρησιμοποιείται στη διεύθυνση URL της σελίδας (π.χ. /news/onoma-arthrou). Πατήστε 'Generate' για να το δημιουργήσετε ή να το ανανεώσετε.",
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
      name: "publishedAt",
      title: "Ημερομηνία Δημοσίευσης",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Κατηγορία",
      type: "string",
      options: {
        list: [
          { title: "Ανακοίνωση", value: "announcement" },
          { title: "Εκδήλωση", value: "event" },
          { title: "Κοινότητα", value: "community" },
          { title: "Πολιτισμός", value: "culture" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Σύνοψη",
      type: "localeText",
    }),
    defineField({
      name: "content",
      title: "Περιεχόμενο",
      type: "localeBlockContent",
    }),
    defineField({
      name: "image",
      title: "Κύρια Εικόνα",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
