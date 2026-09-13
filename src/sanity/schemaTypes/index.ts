import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { archiveItem } from "./archiveItem";
import { archivePage } from "./archivePage";
import { contactPage } from "./contactPage";
import { culturePage } from "./culturePage";
import { event } from "./event";
import { eventsPage } from "./eventsPage";
import { homePage } from "./homePage";
import { localeBlockContent } from "./objects/localeBlockContent";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { news } from "./news";
import { newsPage } from "./newsPage";
import { rootsPage } from "./rootsPage";
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
  aboutPage,
  rootsPage,
  culturePage,
  archivePage,
  newsPage,
  eventsPage,
  // Collections
  news,
  event,
  archiveItem,
];
