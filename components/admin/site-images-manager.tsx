"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { Upload } from "lucide-react"
import { uploadSiteImage } from "@/app/actions/images"
import { SITE_IMAGE_KEYS, type SiteImageKey, type SiteImages } from "@/lib/site-images"
import { SITE_TEXT_LOCALES, type SiteTexts, type SiteTextSection } from "@/lib/site-texts"
import { SlotTexts } from "./slot-texts"

/** Slots whose photos carry an editable headline (shown beside the photo). */
const TEXT_SECTIONS: SiteImageKey[] = ["hero", "editorial"]

/** Localised label for a banner slot ("instagram_3" → "Instagram · photo 3"). */
function useSlotLabel() {
  const t = useTranslations("Admin.media.imageLabels")
  return (slotKey: SiteImageKey) => {
    const m = /^instagram_(\d+)$/.exec(slotKey)
    if (m) return t("instagram", { n: m[1] })
    return t(slotKey)
  }
}

/** Pulls one section's text out of the per-locale map → locale → field → value. */
function textsForSection(texts: Record<string, SiteTexts>, section: SiteTextSection) {
  const out: Record<string, Record<string, string>> = {}
  for (const locale of SITE_TEXT_LOCALES) out[locale] = { ...texts[locale]?.[section] }
  return out
}

export function SiteImagesManager({
  initial,
  texts,
}: {
  initial: SiteImages
  texts: Record<string, SiteTexts>
}) {
  const withText = SITE_IMAGE_KEYS.filter((k) => TEXT_SECTIONS.includes(k))
  const rest = SITE_IMAGE_KEYS.filter((k) => !TEXT_SECTIONS.includes(k))

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        {withText.map((key) => (
          <Slot
            key={key}
            slotKey={key}
            initialUrl={initial[key]}
            textEditor={
              <SlotTexts
                section={key as SiteTextSection}
                initial={textsForSection(texts, key as SiteTextSection)}
              />
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((key) => (
          <Slot key={key} slotKey={key} initialUrl={initial[key]} />
        ))}
      </div>
    </div>
  )
}

function Slot({
  slotKey,
  initialUrl,
  textEditor,
}: {
  slotKey: SiteImageKey
  initialUrl: string
  textEditor?: React.ReactNode
}) {
  const [url, setUrl] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const t = useTranslations("Admin.media")
  const slotLabel = useSlotLabel()
  const label = slotLabel(slotKey)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    const fd = new FormData()
    fd.append("file", file)
    const res = await uploadSiteImage(slotKey, fd)
    if (res.ok) {
      setUrl(res.url)
      router.refresh()
    } else {
      setError(res.error)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const photo = (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {url && <Image src={url} alt={label} fill sizes="320px" className="object-cover" />}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-border px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-foreground disabled:opacity-60"
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading ? t("uploading") : t("replacePhoto")}
      </button>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )

  if (textEditor) {
    return (
      <div className="border border-border bg-background p-4 md:p-6">
        <p className="mb-4 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="max-w-[320px]">{photo}</div>
          {textEditor}
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border bg-background p-4">
      <p className="mb-3 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </p>
      {photo}
    </div>
  )
}
