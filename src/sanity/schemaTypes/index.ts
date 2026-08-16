import type { SchemaTypeDefinition } from "sanity";

import { archiveItem } from "./archiveItem";
import { contactPage } from "./contactPage";
import { event } from "./event";
import { homePage } from "./homePage";
import { localeBlockContent } from "./objects/localeBlockContent";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { news } from "./news";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable localized objects
  localeString,
  localeText,
  localeBlockContent,
  // Singletons
  homePage,
  siteSettings,
  contactPage,
  // Collections
  news,
  event,
  archiveItem,
];
