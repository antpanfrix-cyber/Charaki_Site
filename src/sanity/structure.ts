import type { StructureResolver } from "sanity/structure";

// Document types that should only ever have exactly one instance in the dataset.
export const SINGLETON_TYPES = new Set([
  "homePage",
  "siteSettings",
  "contactPage",
]);

// Singletons already have a hand-written listItem below, so they must be
// filtered out of the generic, auto-generated document type list to avoid
// showing up twice in the sidebar.
const CUSTOM_LIST_TYPES = new Set([...SINGLETON_TYPES]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Homepage")
        .id("homePage")
        .child(
          S.document().schemaType("homePage").documentId("homePage"),
        ),
      S.listItem()
        .title("Contact Page")
        .id("contactPage")
        .child(
          S.document().schemaType("contactPage").documentId("contactPage"),
        ),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !CUSTOM_LIST_TYPES.has(item.getId() ?? ""),
      ),
    ]);
