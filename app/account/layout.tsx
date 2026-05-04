import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { signOut } from "@/app/actions/auth"

const accountLinks = [
  { label: "Кабинет", href: "/account" },
  { label: "Заказы", href: "/account/orders" },
  { label: "Избранное", href: "/account/wishlist" },
  { label: "Адреса", href: "/account/addresses" },
  { label: "Профиль", href: "/account/profile" },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Личный кабинет</p>
          <h1 className="mt-3 font-serif text-4xl">{displayName}</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
          <aside>
            <nav className="flex flex-row gap-0 overflow-x-auto border-b border-border/60 lg:flex-col lg:border-b-0">
              {accountLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap border-b border-border/60 py-4 pr-6 text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground lg:pr-0"
                >
                  {l.label}
                </Link>
              ))}
              <form action={signOut} className="lg:mt-4">
                <button
                  type="submit"
                  className="w-full whitespace-nowrap border-b border-border/60 py-4 text-left text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  Выйти
                </button>
              </form>
            </nav>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
