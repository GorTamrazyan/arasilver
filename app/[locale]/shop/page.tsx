import { getTranslations, setRequestLocale } from "next-intl/server"
import { createPublicClient } from "@/lib/supabase/public"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { CategoryFilters } from "@/components/category-filters"
import type { Product, ProductCategory } from "@/lib/types"

export const revalidate = 60

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const { category } = await searchParams
  const supabase = createPublicClient()

  const validCategories: ProductCategory[] = ["rings", "earrings", "pendants", "bracelets", "necklaces"]
  const activeCategory =
    category && validCategories.includes(category as ProductCategory) ? (category as ProductCategory) : null

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (activeCategory) query = query.eq("category", activeCategory)

  const { data } = await query
  const products = (data ?? []) as Product[]

  const t = await getTranslations("Shop")
  const tCategories = await getTranslations("Categories")

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
          <div className="mb-10">
            <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
              <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
              {activeCategory ? tCategories(activeCategory) : t("kicker")}
            </p>
            <h1 className="font-serif text-5xl leading-tight text-balance md:text-7xl">
              {activeCategory ? (
                tCategories(activeCategory)
              ) : (
                <>
                  {t("titlePart1")} <em className="font-light italic text-muted-foreground">{t("titleItalic")}</em>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("lede")}
            </p>
          </div>

          <CategoryFilters active={activeCategory} />

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl italic text-muted-foreground">{t("emptyTitle")}</p>
              <p className="mt-3 text-sm text-muted-foreground">{t("emptyLede")}</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
