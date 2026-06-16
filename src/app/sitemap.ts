/** @format */

import { MetadataRoute } from "next";

const BASE = "https://soggyroll.art";
const UPDATED = new Date("2026-06-16");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
