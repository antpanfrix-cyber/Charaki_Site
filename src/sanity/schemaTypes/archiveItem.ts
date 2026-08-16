import { defineField, defineType } from "sanity";

const IMAGE_CATEGORIES = ["photographs"];
const FILE_CATEGORIES = [
  "historicalDocuments",
  "oralHistories",
  "videos",
  "audioArchive",
];
const URL_CATEGORIES = ["oralHistories", "videos", "audioArchive"];

export const archiveItem = defineType({
  name: "archiveItem",
  title: "Archive Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Photographs", value: "photographs" },
          { title: "Historical Documents", value: "historicalDocuments" },
          { title: "Family Stories", value: "familyStories" },
          { title: "Oral Histories", value: "oralHistories" },
          { title: "Videos", value: "videos" },
          { title: "Audio Archive", value: "audioArchive" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "person",
      title: "Associated Family / Person",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Used for Photographs.",
      hidden: ({ document }) =>
        !IMAGE_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description:
        "Used for Historical Documents, Oral Histories, Videos, and Audio Archive items.",
      hidden: ({ document }) =>
        !FILE_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description:
        "Optional link to externally hosted media (e.g. YouTube, SoundCloud) for Oral Histories, Videos, and Audio Archive items.",
      hidden: ({ document }) =>
        !URL_CATEGORIES.includes(document?.category as string),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
    }),
  ],
});
