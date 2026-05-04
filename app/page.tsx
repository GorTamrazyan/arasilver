import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { Catalog } from "@/components/catalog"
import { Editorial } from "@/components/editorial"
import { About } from "@/components/about"
import { InstagramFeed } from "@/components/instagram-feed"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <AnnouncementBar />
      <SiteNav />
      <Hero />
      <Catalog />
      <Editorial />
      <About />
      <InstagramFeed />
      <SiteFooter />
    </main>
  )
}
