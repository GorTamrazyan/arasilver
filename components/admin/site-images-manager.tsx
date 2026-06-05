"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Upload } from "lucide-react"
import { uploadSiteImage } from "@/app/actions/images"
import { SITE_IMAGE_KEYS, SITE_IMAGE_LABELS, type SiteImageKey, type SiteImages } from "@/lib/site-images"

export function SiteImagesManager({ initial }: { initial: SiteImages }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {SITE_IMAGE_KEYS.map((key) => (
        <Slot key={key} slotKey={key} initialUrl={initial[key]} />
      ))}
    </div>
  )
}

function Slot({ slotKey, initialUrl }: { slotKey: SiteImageKey; initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  return (
    <div className="border border-border bg-background p-4">
      <p className="mb-3 text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {SITE_IMAGE_LABELS[slotKey]}
      </p>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
        {url && <Image src={url} alt={SITE_IMAGE_LABELS[slotKey]} fill sizes="320px" className="object-cover" />}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-border px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-foreground disabled:opacity-60"
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading ? "Загружаем..." : "Заменить фото"}
      </button>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
