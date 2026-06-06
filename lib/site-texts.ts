import { createPublicClient } from "@/lib/supabase/public"
import { routing } from "@/i18n/routing"

/** Locales the editable headlines can be edited in (mirrors i18n routing). */
export const SITE_TEXT_LOCALES = routing.locales

export type SiteTextLocale = (typeof SITE_TEXT_LOCALES)[number]

/**
 * Editable headline fields grouped by the home-page section / photo they sit
 * on. Only the big headlines of the Hero and Editorial banners are editable —
 * everything else still comes from the bundled translations.
 */
export const SITE_TEXT_FIELDS = {
  hero: ["captionLabel", "captionTitle", "captionSilver", "captionPrice"],
  editorial: ["kicker", "title", "titleItalic", "lede"],
} as const

export type SiteTextSection = keyof typeof SITE_TEXT_FIELDS

/** Resolved headline text for a single locale, e.g. `{ hero: { title1, ... } }`. */
export type SiteTexts = Record<SiteTextSection, Record<string, string>>

/** site_settings key holding one headline field for a section + locale. */
export function siteTextKey(section: string, field: string, locale: string): string {
  return `text_${section}_${field}_${locale}`
}

/** Parses a `text_<section>_<field>_<locale>` key back into its parts (or null). */
function parseTextKey(
  key: string,
): { section: SiteTextSection; field: string; locale: string } | null {
  const parts = key.split("_")
  if (parts.length !== 4 || parts[0] !== "text") return null
  const [, section, field, locale] = parts
  const fields = (SITE_TEXT_FIELDS as Record<string, readonly string[]>)[section]
  if (!fields || !fields.includes(field)) return null
  if (!(SITE_TEXT_LOCALES as readonly string[]).includes(locale)) return null
  return { section: section as SiteTextSection, field, locale }
}

/**
 * Default headlines per locale, mirroring the bundled translations. Used until
 * an admin saves their own copy, and as a fallback when Supabase is unreachable.
 */
export const SITE_TEXT_DEFAULTS: Record<SiteTextLocale, SiteTexts> = {
  hy: {
    hero: {
      captionLabel: "Կերպար №14",
      captionTitle: "«Luna մատանիների շարք»",
      captionSilver: "— արծաթ 925",
      captionPrice: "12 000 ֏-ից",
    },
    editorial: {
      kicker: "Լուքբուք · Գարուն 2026",
      title: "Լուսինը",
      titleItalic: "ծովի վրա",
      lede: "Նոր հավաքածուն՝ տուրք լուսնի լույսին և ափի լռությանը։ Օրգանական ձևեր, փափուկ կորեր և փայլատ արծաթ։",
    },
  },
  ru: {
    hero: {
      captionLabel: "Образ №14",
      captionTitle: "«Стопка колец Luna»",
      captionSilver: "— серебро 925",
      captionPrice: "от 3 200 ₽",
    },
    editorial: {
      kicker: "Лукбук · Весна 2026",
      title: "Луна над",
      titleItalic: "морем",
      lede: "Новая коллекция — оммаж лунному свету и тишине побережья. Органические формы, мягкие изгибы и матовое серебро.",
    },
  },
  en: {
    hero: {
      captionLabel: "Look №14",
      captionTitle: "«Luna ring stack»",
      captionSilver: "— 925 silver",
      captionPrice: "from $34",
    },
    editorial: {
      kicker: "Lookbook · Spring 2026",
      title: "Moon above",
      titleItalic: "the sea",
      lede: "The new collection is an ode to moonlight and the quiet of the coast. Organic shapes, soft curves and matte silver.",
    },
  },
}

function cloneTexts(src: SiteTexts): SiteTexts {
  const out = {} as SiteTexts
  for (const section of Object.keys(SITE_TEXT_FIELDS) as SiteTextSection[]) {
    out[section] = { ...src[section] }
  }
  return out
}

function defaultsFor(locale: string): SiteTexts {
  return SITE_TEXT_DEFAULTS[locale as SiteTextLocale] ?? SITE_TEXT_DEFAULTS.en
}

/**
 * Reads the editable headlines for a locale from `site_settings`, falling back
 * to the bundled defaults for any field that is missing/empty or when Supabase
 * is unreachable. Uses the anonymous public client to stay ISR-friendly.
 */
export async function getSiteTexts(locale: string): Promise<SiteTexts> {
  const result = cloneTexts(defaultsFor(locale))
  try {
    const supabase = createPublicClient()
    const keys: string[] = []
    for (const [section, fields] of Object.entries(SITE_TEXT_FIELDS)) {
      for (const field of fields) keys.push(siteTextKey(section, field, locale))
    }
    const { data } = await supabase.from("site_settings").select("key, value").in("key", keys)
    for (const row of (data ?? []) as { key: string; value: string | null }[]) {
      const parsed = parseTextKey(row.key)
      if (parsed && parsed.locale === locale && row.value != null && row.value !== "") {
        result[parsed.section][parsed.field] = row.value
      }
    }
  } catch {
    // Table not created yet / Supabase unreachable → defaults.
  }
  return result
}

/** Reads every editable headline for every locale, for the admin editor. */
export async function getAllSiteTexts(): Promise<Record<string, SiteTexts>> {
  const result: Record<string, SiteTexts> = {}
  for (const locale of SITE_TEXT_LOCALES) result[locale] = cloneTexts(defaultsFor(locale))
  try {
    const supabase = createPublicClient()
    const { data } = await supabase.from("site_settings").select("key, value").like("key", "text_%")
    for (const row of (data ?? []) as { key: string; value: string | null }[]) {
      const parsed = parseTextKey(row.key)
      if (parsed && row.value != null && row.value !== "") {
        result[parsed.locale][parsed.section][parsed.field] = row.value
      }
    }
  } catch {
    // defaults already populated
  }
  return result
}
