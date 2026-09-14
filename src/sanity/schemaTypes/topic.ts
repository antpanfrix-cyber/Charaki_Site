import { defineField, defineType } from "sanity";

export const TOPIC_CATEGORIES = [
  { title: "Ρίζες", value: "roots" },
  { title: "Πολιτισμός & Παράδοση", value: "culture" },
  { title: "Σχετικά με Εμάς", value: "about" },
] as const;

const CATEGORY_BY_DOCUMENT_TYPE: Record<string, string> = {
  rootsPage: "roots",
  culturePage: "culture",
  aboutPage: "about",
};

/**
 * Restricts the `topic` reference picker on a card/milestone to topics whose
 * category matches the page it lives on (e.g. a rootsPage card can only pick
 * a "roots" topic) — this is a Studio UI filter only, not a write-time
 * constraint on the data itself.
 */
export function topicReferenceFilter({
  document,
}: {
  document?: { _type?: string };
}) {
  const category = document?._type
    ? CATEGORY_BY_DOCUMENT_TYPE[document._type]
    : undefined;

  return category
    ? { filter: "category == $category", params: { category } }
    : { filter: "false" };
}

export const topic = defineType({
  name: "topic",
  title: "Θεματική Σελίδα",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Σύντομος Σύνδεσμος (Slug)",
      type: "slug",
      description:
        "Δημιουργείται αυτόματα από τον ελληνικό τίτλο και χρησιμοποιείται στη διεύθυνση URL της σελίδας (π.χ. /topics/onoma-thematikis). Πατήστε 'Generate' για να το δημιουργήσετε ή να το ανανεώσετε.",
      options: {
        source: (doc) => {
          const title = doc.title as { el?: string } | undefined;
          return title?.el ?? "";
        },
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Ενότητα",
      type: "string",
      description:
        "Καθορίζει σε ποιες σελίδες (και ποιες κάρτες) μπορεί να συνδεθεί αυτή η Θεματική Σελίδα.",
      options: {
        list: [...TOPIC_CATEGORIES],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Σύντομη Περιγραφή",
      type: "localeTextShort",
      description:
        "Εμφανίζεται στην κάρτα που οδηγεί σε αυτή τη σελίδα. Προαιρετική — αν λείπει, η κάρτα δείχνει το δικό της κείμενο.",
    }),
    defineField({
      name: "coverImage",
      title: "Εικόνα Εξωφύλλου",
      type: "image",
      options: { hotspot: true },
      description:
        "Εμφανίζεται στην κάρτα που οδηγεί σε αυτή τη σελίδα και στην κορυφή της Θεματικής Σελίδας. Προαιρετική.",
    }),
    defineField({
      name: "body",
      title: "Πλήρες Περιεχόμενο",
      type: "localeBlockContent",
      description:
        "Το πλήρες κείμενο, φωτογραφίες, γκαλερί και βίντεο της σελίδας.",
    }),
  ],
  preview: {
    select: { title: "title.el", media: "coverImage", category: "category" },
    prepare: ({ title, media, category }) => ({
      title: title || "Χωρίς τίτλο",
      subtitle: category,
      media,
    }),
  },
});
