import type { StructureResolver } from "sanity/structure";

// Document types that should only ever have exactly one instance in the dataset.
export const SINGLETON_TYPES = new Set([
  "homePage",
  "siteSettings",
  "contactPage",
  "aboutPage",
  "rootsPage",
  "culturePage",
  "archivePage",
  "newsPage",
  "eventsPage",
]);

// Singletons already have a hand-written listItem below, so they must be
// filtered out of the generic, auto-generated document type list to avoid
// showing up twice in the sidebar.
const CUSTOM_LIST_TYPES = new Set([...SINGLETON_TYPES]);

function singletonListItem(
  S: Parameters<StructureResolver>[0],
  schemaType: string,
  title: string,
) {
  return S.listItem()
    .title(title)
    .id(schemaType)
    .child(S.document().schemaType(schemaType).documentId(schemaType));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Περιεχόμενο")
    .items([
      singletonListItem(S, "homePage", "Αρχική Σελίδα"),
      singletonListItem(S, "contactPage", "Σελίδα Επικοινωνίας"),
      singletonListItem(S, "siteSettings", "Ρυθμίσεις Ιστότοπου"),
      S.divider(),
      S.listItem()
        .title("Σελίδες")
        .id("pages")
        .child(
          S.list()
            .title("Σελίδες")
            .items([
              singletonListItem(S, "aboutPage", "Σχετικά με Εμάς"),
              singletonListItem(S, "rootsPage", "Οι Ρίζες μας"),
              singletonListItem(S, "culturePage", "Πολιτισμός & Παράδοση"),
              singletonListItem(S, "archivePage", "Αρχείο"),
              singletonListItem(S, "newsPage", "Νέα"),
              singletonListItem(S, "eventsPage", "Εκδηλώσεις"),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !CUSTOM_LIST_TYPES.has(item.getId() ?? ""),
      ),
    ]);
