import { createPublicClient } from "@/lib/supabase/public"
import { routing } from "@/i18n/routing"

/** Locales the announcement bar can be edited in (mirrors i18n routing). */
export const ANNOUNCEMENT_LOCALES = routing.locales

export type AnnouncementLocale = (typeof ANNOUNCEMENT_LOCALES)[number]

/** Human labels for the admin UI. */
export const ANNOUNCEMENT_LOCALE_LABELS: Record<string, string> = {
  ru: "Русский",
  en: "English",
  hy: "Հայերեն",
}

/** site_settings key holding the announcement text for a given locale. */
export function announcementKey(locale: string): string {
  return `announcement_${locale}`
}

/**
 * Default announcement text per locale (one item per line). Used until an admin
 * saves their own copy, and as a fallback when Supabase is unreachable.
 */
export const ANNOUNCEMENT_DEFAULTS: Record<string, string> = {
  ru: [
    "Бесплатная доставка по России от 5 000 ₽",
    "Ручная работа · Серебро 925",
    "Новая коллекция «Луна» уже в продаже",
    "Подарочная упаковка в каждом заказе",
  ].join("\n"),
  en: [
    "Free worldwide shipping over $200",
    "Handmade · 925 Sterling Silver",
    "New «Luna» collection now available",
    "Gift packaging with every order",
  ].join("\n"),
  hy: [
    "Անվճար առաքում Հայաստանով մեկ՝ 20 000 ֏-ից",
    "Ձեռագործ · Արծաթ 925",
    "Նոր «Լուսին» հավաքածուն արդեն վաճառքում",
    "Նվիրատու փաթեթավորում յուրաքանչյուր պատվերում",
  ].join("\n"),
}

function defaultFor(locale: string): string {
  return ANNOUNCEMENT_DEFAULTS[locale] ?? ANNOUNCEMENT_DEFAULTS.en
}

function toItems(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

/**
 * Reads the announcement bar items for a locale from `site_settings`, falling
 * back to the bundled defaults when the row is missing/empty or Supabase is
 * unreachable. Uses the anonymous public client to stay ISR-friendly.
 */
export async function getAnnouncementItems(locale: string): Promise<string[]> {
  try {
    const supabase = createPublicClient()
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", announcementKey(locale))
      .maybeSingle()
    const value = (data as { value: string } | null)?.value
    if (value && value.trim()) return toItems(value)
  } catch {
    // Table not created yet / Supabase unreachable → defaults.
  }
  return toItems(defaultFor(locale))
}

/** Reads the raw (multiline) announcement text for every locale, for the admin editor. */
export async function getAllAnnouncementText(): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const locale of ANNOUNCEMENT_LOCALES) result[locale] = defaultFor(locale)
  try {
    const supabase = createPublicClient()
    const keys = ANNOUNCEMENT_LOCALES.map(announcementKey)
    const { data } = await supabase.from("site_settings").select("key, value").in("key", keys)
    for (const row of (data ?? []) as { key: string; value: string | null }[]) {
      const locale = row.key.replace(/^announcement_/, "")
      if ((ANNOUNCEMENT_LOCALES as readonly string[]).includes(locale) && row.value != null) {
        result[locale] = row.value
      }
    }
  } catch {
    // defaults already populated
  }
  return result
}
