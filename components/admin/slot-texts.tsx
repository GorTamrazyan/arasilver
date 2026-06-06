"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveSiteTexts } from "@/app/actions/admin"
import { ANNOUNCEMENT_LOCALE_LABELS } from "@/lib/site-settings"
import { SITE_TEXT_LOCALES, SITE_TEXT_FIELDS, siteTextKey, type SiteTextSection } from "@/lib/site-texts"

/** Russian field labels for the admin editor (admin UI is Russian-facing). */
const FIELD_LABELS: Record<SiteTextSection, Record<string, string>> = {
  hero: {
    captionLabel: "Подпись · метка",
    captionTitle: "Подпись · название",
    captionSilver: "Подпись · материал",
    captionPrice: "Подпись · цена",
  },
  editorial: {
    kicker: "Надзаголовок",
    title: "Заголовок",
    titleItalic: "Вторая часть (курсив)",
    lede: "Описание",
  },
}

/** initial: locale → field → value, for one section. */
type LocaleFieldValues = Record<string, Record<string, string>>

export function SlotTexts({
  section,
  initial,
}: {
  section: SiteTextSection
  initial: LocaleFieldValues
}) {
  const [values, setValues] = useState<LocaleFieldValues>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fields = SITE_TEXT_FIELDS[section]

  function update(locale: string, field: string, value: string) {
    setValues((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }))
    setSaved(false)
  }

  async function onSave() {
    setSaving(true)
    setError(null)
    setSaved(false)
    const payload: Record<string, string> = {}
    for (const locale of SITE_TEXT_LOCALES) {
      for (const field of fields) {
        payload[siteTextKey(section, field, locale)] = (values[locale]?.[field] ?? "").trim()
      }
    }
    const res = await saveSiteTexts(payload)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    } else {
      setError(res.error)
    }
    setSaving(false)
  }

  return (
    <div className="flex h-full flex-col">
      <p className="mb-3 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        Текст на фото
      </p>

      <div className="space-y-5">
        {SITE_TEXT_LOCALES.map((locale) => (
          <div key={locale}>
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {ANNOUNCEMENT_LOCALE_LABELS[locale] ?? locale}
            </span>
            <div className="space-y-2">
              {fields.map((field) => (
                <label key={field} className="block">
                  <span className="mb-1 block text-[10px] tracking-[0.15em] text-muted-foreground/80 uppercase">
                    {FIELD_LABELS[section][field] ?? field}
                  </span>
                  <input
                    type="text"
                    value={values[locale]?.[field] ?? ""}
                    onChange={(e) => update(locale, field, e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm focus:border-foreground focus:outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="bg-foreground px-5 py-2.5 text-[10px] tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Сохраняем..." : "Сохранить текст"}
        </button>
        {saved && (
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Сохранено
          </span>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  )
}
