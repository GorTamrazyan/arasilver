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
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="mb-14">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Личный кабинет</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">{displayName}</h1>
        </div>

        <div className="grid gap-16 lg:grid-cols-[240px_1fr] lg:gap-24">
          <aside>
            <nav className="flex flex-row overflow-x-auto lg:flex-col">
              {accountLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="whitespace-nowrap border-b border-border/60 py-5 pr-8 text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground lg:pr-0"
                >
                  {l.label}
                </Link>
              ))}
              <form action={signOut} className="lg:mt-6">
                <button
                  type="submit"
                  className="w-full whitespace-nowrap border-b border-border/60 py-5 text-left text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
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
