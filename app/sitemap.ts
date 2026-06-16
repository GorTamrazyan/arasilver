import type { MetadataRoute } from "next"
import { createPublicClient } from "@/lib/supabase/public"
import { routing } from "@/i18n/routing"
import { SITE_URL } from "@/lib/seo"

export const revalidate = 3600

const CATEGORIES = ["rings", "earrings", "pendants", "bracelets", "necklaces"]

function languagesFor(path: string) {
  const languages: Record<string, string> = {}
  for (const l of routing.locales) languages[l] = `${SITE_URL}/${l}${path}`
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("products")
    .select("slug, created_at")
    .eq("is_active", true)

  const products = (data ?? []) as { slug: string; created_at: string }[]
  const entries: MetadataRoute.Sitemap = []

  // Home + shop landing — fully localized with hreflang alternates.
  for (const path of ["", "/shop"]) {
    for (const l of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${l}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: languagesFor(path) },
      })
    }
  }

  // Category filters.
  for (const c of CATEGORIES) {
    const path = `/shop?category=${c}`
    for (const l of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${l}${path}`,
        changeFrequency: "weekly",
        priority: 0.6,
      })
    }
  }

  // Product detail pages.
  for (const p of products) {
    const path = `/shop/${p.slug}`
    for (const l of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${l}${path}`,
        lastModified: p.created_at ? new Date(p.created_at) : undefined,
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: languagesFor(path) },
      })
    }
  }

  return entries
}
