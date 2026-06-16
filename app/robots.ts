import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Locale-prefixed private areas — wildcards match /hy/admin, /ru/account, …
      disallow: ["/*/admin", "/*/account", "/*/checkout", "/*/order", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
