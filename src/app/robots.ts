/** @format */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy", "/terms"],
        disallow: [
          "/sign-in",
          "/sign-up",
          "/discover",
          "/generations",
          "/billing",
          "/workflows",
        ],
      },
    ],
    sitemap: "https://soggyroll.art/sitemap.xml",
  };
}
