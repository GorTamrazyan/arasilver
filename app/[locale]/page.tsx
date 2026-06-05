import { setRequestLocale } from "next-intl/server"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Catalog } from "@/components/catalog"
import { Editorial } from "@/components/editorial"
import { About } from "@/components/about"
import { InstagramFeed } from "@/components/instagram-feed"
import { SiteFooter } from "@/components/site-footer"
import { getSiteImages } from "@/lib/site-images"

export const revalidate = 60

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const images = await getSiteImages()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <SiteNav />
      <Hero imageUrl={images.hero} />
      <Catalog />
      <Editorial imageUrl={images.editorial} />
      <About imageUrl={images.about} />
      <InstagramFeed
        images={[
          images.instagram_1,
          images.instagram_2,
          images.instagram_3,
          images.instagram_4,
          images.instagram_5,
          images.instagram_6,
        ]}
      />
      <SiteFooter />
    </main>
  )
}
