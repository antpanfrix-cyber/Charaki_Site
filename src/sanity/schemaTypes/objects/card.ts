import { defineField, defineType } from "sanity";

import { topicReferenceFilter } from "../topic";
import { maxLocaleLength } from "../validation";

// Shared by rootsPage and culturePage — kept as one definition so a change
// (like the topic reference below) doesn't have to be made twice.
export const card = defineType({
  name: "card",
  title: "Κάρτα",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Τίτλος",
      type: "localeString",
      validation: (rule) => [
        rule.required(),
        rule.custom(maxLocaleLength(60)).warning(),
      ],
    }),
    defineField({
      name: "description",
      title: "Περιγραφή",
      type: "localeTextShort",
      description:
        "Σύντομο εισαγωγικό κείμενο, έως 200 χαρακτήρες. Αν η κάρτα συνδέεται με Θεματική Σελίδα που έχει δικό της κείμενο, αυτό εμφανίζεται μόνο αν λείπει εκείνο.",
    }),
    defineField({
      name: "image",
      title: "Εικόνα",
      type: "image",
      options: { hotspot: true },
      description:
        "Προαιρετική. Αν δεν προστεθεί εικόνα, η κάρτα εμφανίζεται με έγχρωμο φόντο. Αγνοείται αν η συνδεδεμένη Θεματική Σελίδα έχει δική της εικόνα εξωφύλλου.",
    }),
    defineField({
      name: "link",
      title: "Σύνδεσμος",
      type: "string",
      description:
        "Προαιρετικός. Αγνοείται αν έχει επιλεγεί Θεματική Σελίδα παρακάτω — τότε η κάρτα οδηγεί εκεί.",
    }),
    defineField({
      name: "topic",
      title: "Θεματική Σελίδα",
      type: "reference",
      to: [{ type: "topic" }],
      options: { filter: topicReferenceFilter },
      description:
        "Προαιρετικό. Αν επιλεγεί, η κάρτα οδηγεί στην πλήρη Θεματική Σελίδα και παίρνει τίτλο/κείμενο/εικόνα από εκεί (τα παραπάνω πεδία λειτουργούν ως εφεδρικά).",
    }),
  ],
  preview: {
    select: {
      title: "title.el",
      subtitle: "description.el",
      media: "image",
      topicTitle: "topic.title.el",
      topicMedia: "topic.coverImage",
    },
    prepare: ({ title, subtitle, media, topicTitle, topicMedia }) => ({
      title: title || topicTitle || "Χωρίς τίτλο",
      subtitle: topicTitle ? `→ ${topicTitle}` : subtitle,
      media: media || topicMedia,
    }),
  },
});
