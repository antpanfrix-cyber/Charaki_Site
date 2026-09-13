import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Ρυθμίσεις Ιστότοπου",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Τίτλος Ιστότοπου",
      type: "localeString",
      description:
        "Χρησιμοποιείται εσωτερικά· δεν εμφανίζεται ακόμα κάπου στη σελίδα.",
    }),
    defineField({
      name: "logo",
      title: "Λογότυπο",
      type: "image",
      description:
        "Εμφανίζεται στην κεφαλίδα (Header) πάνω αριστερά. Αν δεν ανέβει εικόνα, εμφανίζεται το κειμενικό λογότυπο.",
    }),
    defineField({
      name: "seo",
      title: "Προεπιλεγμένο SEO",
      type: "object",
      description:
        "Χρησιμοποιείται ως προεπιλογή για τον τίτλο/περιγραφή της καρτέλας του browser και τα αποτελέσματα αναζήτησης, όταν μια σελίδα δεν έχει δικό της SEO.",
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
      name: "email",
      title: "Email Επικοινωνίας",
      type: "string",
      description:
        "Εμφανίζεται στο υποσέλιδο (Footer) και στη σελίδα Επικοινωνίας, ως σύνδεσμος αποστολής email.",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Τηλέφωνο Επικοινωνίας",
      type: "string",
      description:
        "Εμφανίζεται στο υποσέλιδο (Footer) και στη σελίδα Επικοινωνίας, ως σύνδεσμος κλήσης.",
    }),
    defineField({
      name: "address",
      title: "Διεύθυνση",
      type: "localeString",
      description: "Εμφανίζεται στο υποσέλιδο (Footer).",
    }),
    defineField({
      name: "socialLinks",
      title: "Σύνδεσμοι Κοινωνικών Δικτύων",
      type: "object",
      description:
        "Εμφανίζονται ως εικονίδια στο υποσέλιδο (Footer). Όσα πεδία μείνουν κενά δεν εμφανίζονται καθόλου.",
      fields: [
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
  ],
});
