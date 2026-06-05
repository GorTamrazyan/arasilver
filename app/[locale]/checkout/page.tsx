import { getTranslations, setRequestLocale } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm } from "@/components/checkout-form"
import type { Address } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let savedAddresses: Address[] = []
  if (user) {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
    savedAddresses = (data ?? []) as Address[]
  }

  const userPrefill = user
    ? {
        name: user.user_metadata?.full_name ?? "",
        email: user.email ?? "",
        phone: user.user_metadata?.phone ?? "",
      }
    : null

  const t = await getTranslations("Checkout")

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{t("kicker")}</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">
            {t("title")} <em className="font-light italic text-muted-foreground">{t("titleItalic")}</em>
          </h1>
        </div>
        <CheckoutForm userPrefill={userPrefill} savedAddresses={savedAddresses} />
      </section>
      <SiteFooter />
    </main>
  )
}
