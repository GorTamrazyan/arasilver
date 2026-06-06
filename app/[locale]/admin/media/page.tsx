import { getTranslations } from "next-intl/server"
import { AdminShell } from "@/components/admin/admin-shell"
import { SiteImagesManager } from "@/components/admin/site-images-manager"
import { AnnouncementManager } from "@/components/admin/announcement-manager"
import { getSiteImages } from "@/lib/site-images"
import { getAllAnnouncementText } from "@/lib/site-settings"
import { getAllSiteTexts } from "@/lib/site-texts"

export const dynamic = "force-dynamic"

export default async function AdminMediaPage() {
  const t = await getTranslations("Admin.media")
  const [images, announcement, texts] = await Promise.all([
    getSiteImages(),
    getAllAnnouncementText(),
    getAllSiteTexts(),
  ])

  return (
    <AdminShell active="media">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{t("eyebrow")}</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">{t("title")}</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      <div className="mb-14">
        <AnnouncementManager initial={announcement} />
      </div>

      <SiteImagesManager initial={images} texts={texts} />
    </AdminShell>
  )
}
