import { routing } from "@/i18n/routing"

/**
 * Absolute base URL of the site, used for canonical / hreflang / Open Graph /
 * sitemap. Set NEXT_PUBLIC_SITE_URL in the environment for production
 * (e.g. https://arasilver.am). Falls back to a sensible default otherwise.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://arasilver.am").replace(/\/+$/, "")

export const SITE_NAME = "ARASILVER"

/** Default share image (relative to SITE_URL via metadataBase). */
export const DEFAULT_OG_IMAGE = "/hero-jewelry.jpg"

/** Maps our locale codes to Open Graph locale identifiers. */
export const OG_LOCALE: Record<string, string> = {
  hy: "hy_AM",
  ru: "ru_RU",
  en: "en_US",
}

/**
 * Builds canonical + hreflang alternates for a locale-agnostic path.
 * Pass "" for the home page, or "/shop", "/shop/some-slug", etc.
 */
export function buildAlternates(locale: string, barePath = "") {
  const path = barePath === "" || barePath.startsWith("/") ? barePath : `/${barePath}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${SITE_URL}/${l}${path}`
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`

  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages,
  }
}

/** Absolute URL for a locale-prefixed path. */
export function localeUrl(locale: string, barePath = "") {
  const path = barePath === "" || barePath.startsWith("/") ? barePath : `/${barePath}`
  return `${SITE_URL}/${locale}${path}`
}
