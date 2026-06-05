import { createPublicClient } from "@/lib/supabase/public"

/** Named banner image slots that admins can replace from /admin/media. */
export const SITE_IMAGE_KEYS = [
  "hero",
  "editorial",
  "about",
  "instagram_1",
  "instagram_2",
  "instagram_3",
  "instagram_4",
  "instagram_5",
  "instagram_6",
] as const

export type SiteImageKey = (typeof SITE_IMAGE_KEYS)[number]

export type SiteImages = Record<SiteImageKey, string>

const CLOUD = "https://res.cloudinary.com/dqg1xso34/image/upload/arasilver/library"

/** Default images (hosted on Cloudinary) used until an admin uploads a replacement. */
export const SITE_IMAGE_DEFAULTS: SiteImages = {
  hero: `${CLOUD}/hero-jewelry.jpg`,
  editorial: `${CLOUD}/editorial-model.jpg`,
  about: `${CLOUD}/atelier.jpg`,
  instagram_1: `${CLOUD}/product-earrings.jpg`,
  instagram_2: `${CLOUD}/product-ring.jpg`,
  instagram_3: `${CLOUD}/editorial-model.jpg`,
  instagram_4: `${CLOUD}/product-pendant.jpg`,
  instagram_5: `${CLOUD}/atelier.jpg`,
  instagram_6: `${CLOUD}/product-bracelet.jpg`,
}

/** Human labels for the admin UI. */
export const SITE_IMAGE_LABELS: Record<SiteImageKey, string> = {
  hero: "Главный баннер (Hero)",
  editorial: "Лукбук (Editorial)",
  about: "О бренде — мастерская",
  instagram_1: "Instagram · фото 1",
  instagram_2: "Instagram · фото 2",
  instagram_3: "Instagram · фото 3",
  instagram_4: "Instagram · фото 4",
  instagram_5: "Instagram · фото 5",
  instagram_6: "Instagram · фото 6",
}

/**
 * Reads the current banner image URLs from the `site_images` table, falling
 * back to the bundled defaults for any slot that is missing or unset. Uses the
 * anonymous public client so callers stay ISR-friendly.
 */
export async function getSiteImages(): Promise<SiteImages> {
  const result: SiteImages = { ...SITE_IMAGE_DEFAULTS }
  try {
    const supabase = createPublicClient()
    const { data } = await supabase.from("site_images").select("key, url")
    for (const row of (data ?? []) as { key: string; url: string | null }[]) {
      if (row.url && (SITE_IMAGE_KEYS as readonly string[]).includes(row.key)) {
        result[row.key as SiteImageKey] = row.url
      }
    }
  } catch {
    // Table not created yet / Supabase unreachable → defaults.
  }
  return result
}
