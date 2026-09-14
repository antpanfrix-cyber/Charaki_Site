import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { archiveItem } from "./archiveItem";
import { archivePage } from "./archivePage";
import { contactPage } from "./contactPage";
import { culturePage } from "./culturePage";
import { event } from "./event";
import { eventsPage } from "./eventsPage";
import { gallery } from "./objects/gallery";
import { homePage } from "./homePage";
import { localeBlockContent } from "./objects/localeBlockContent";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { localeTextShort } from "./objects/localeTextShort";
import { news } from "./news";
import { newsPage } from "./newsPage";
import { pageSection } from "./objects/pageSection";
import { rootsPage } from "./rootsPage";
import { siteSettings } from "./siteSettings";
import { topic } from "./topic";
import { videoEmbed } from "./objects/videoEmbed";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Reusable localized objects
  localeString,
  localeText,
  localeTextShort,
  localeBlockContent,
  pageSection,
  videoEmbed,
  gallery,
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
  topic,
];
