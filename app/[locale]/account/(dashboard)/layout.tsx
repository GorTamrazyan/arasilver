import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { AccountNav } from "@/components/account/account-nav"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-[1400px] overflow-x-clip px-5 py-10 md:px-10 md:py-24">
        <div className="mb-8 md:mb-14">
          <h1 className="font-serif text-3xl break-words md:text-5xl">{displayName}</h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-24">
          <aside className="min-w-0">
            <AccountNav />
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
