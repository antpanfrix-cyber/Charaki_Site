import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Freshness is now handled by Next's Data Cache (tags + revalidate + the
  // /api/revalidate webhook), not Sanity's CDN, so server fetches must bypass it.
  useCdn: false,
});
