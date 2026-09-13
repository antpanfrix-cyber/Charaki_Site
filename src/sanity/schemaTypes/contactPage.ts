import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Σελίδα Επικοινωνίας",
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
      name: "address",
      title: "Διεύθυνση",
      type: "localeString",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Σύνδεσμος Ενσωμάτωσης Google Maps",
      type: "url",
      description:
        "Ο σύνδεσμος 'Ενσωμάτωση χάρτη' (embed) από το Google Maps: ανοίξτε την τοποθεσία στο Google Maps, επιλέξτε Κοινοποίηση > Ενσωμάτωση χάρτη, και αντιγράψτε τη διεύθυνση URL μέσα από το κομμάτι κώδικα (μόνο το src=\"...\").",
    }),
  ],
});
