import { AdminShell } from "@/components/admin/admin-shell"
import { SiteImagesManager } from "@/components/admin/site-images-manager"
import { getSiteImages } from "@/lib/site-images"

export const dynamic = "force-dynamic"

export default async function AdminMediaPage() {
  const images = await getSiteImages()

  return (
    <AdminShell active="media">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Медиа</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Фото на сайте</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Замените баннеры главной страницы. Изменения появляются на сайте в течение минуты.
        </p>
      </div>

      <SiteImagesManager initial={images} />
    </AdminShell>
  )
}
