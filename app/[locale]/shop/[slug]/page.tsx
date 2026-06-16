import { cache } from "react"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { createPublicClient } from "@/lib/supabase/public"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import { JsonLd } from "@/components/json-ld"
import type { Product } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { routing } from "@/i18n/routing"
import { SITE_NAME, OG_LOCALE, buildAlternates, localeUrl } from "@/lib/seo"

export const revalidate = 60

/** Cached per-request so generateMetadata and the page share one DB query. */
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()
  return (data as Product | null) ?? null
})

export async function generateStaticParams() {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)

  const slugs = (data ?? []) as { slug: string }[]
  return routing.locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const p = await getProduct(slug)

  if (!p) {
    return { title: "404", robots: { index: false, follow: false } }
  }

  const t = await getTranslations({ locale, namespace: "Meta" })
  const description = (p.description?.trim() || t("description")).slice(0, 200)
  const url = localeUrl(locale, `/shop/${slug}`)
  const images = p.image_url ? [{ url: p.image_url, alt: p.name }] : undefined

  return {
    title: p.name,
    description,
    alternates: buildAlternates(locale, `/shop/${slug}`),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: p.name,
      description,
      url,
      locale: OG_LOCALE[locale],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: p.name,
      description,
      images: p.image_url ? [p.image_url] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  setRequestLocale(locale)

  const p = await getProduct(slug)
  if (!p) notFound()

  const supabase = createPublicClient()

  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", p.category)
    .neq("id", p.id)
    .limit(4)

  const related = (relatedData ?? []) as Product[]

  const t = await getTranslations("Product")
  const tCategories = await getTranslations("Categories")

  const productUrl = localeUrl(locale, `/shop/${p.slug}`)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description ?? undefined,
    image: p.image_url ? [p.image_url] : undefined,
    sku: p.id,
    category: tCategories(p.category),
    material: p.material ?? "Sterling silver 925",
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: productUrl,
      price: p.price,
      priceCurrency: p.currency,
      availability:
        p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: localeUrl(locale, "") },
      { "@type": "ListItem", position: 2, name: t("breadcrumbShop"), item: localeUrl(locale, "/shop") },
      { "@type": "ListItem", position: 3, name: p.name, item: productUrl },
    ],
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <SiteNav />

      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10">
        <nav className="flex items-center gap-2 text-xs tracking-[0.15em] text-muted-foreground uppercase">
          <Link href="/" className="hover:text-foreground">
            {t("breadcrumbHome")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-foreground">
            {t("breadcrumbShop")}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{p.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {p.image_url && (
              <Image
                src={p.image_url || "/placeholder.svg"}
                alt={p.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="object-cover"
              />
            )}
          </div>

          <div className="flex flex-col justify-center lg:py-8">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{tCategories(p.category)}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{p.name}</h1>
            <p className="mt-6 font-serif text-3xl tabular-nums">{formatPrice(p.price, p.currency)}</p>

            {p.description && (
              <p className="mt-8 max-w-prose text-base leading-relaxed text-foreground/80">{p.description}</p>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border/60 py-6">
              <div>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{t("materialLabel")}</dt>
                <dd className="mt-2 text-sm">{p.material ?? t("defaultMaterial")}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">{t("stockLabel")}</dt>
                <dd className="mt-2 text-sm">
                  {p.stock > 0 ? t("stockInStock", { stock: p.stock }) : t("stockOnDemand")}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex items-center gap-4">
              <AddToCartButton
                product={{
                  product_id: p.id,
                  slug: p.slug,
                  name: p.name,
                  price: p.price,
                  image_url: p.image_url,
                }}
                disabled={p.stock === 0}
              />
              <WishlistButton
                productId={p.id}
                className="h-12 w-12 border border-border hover:border-foreground"
              />
            </div>

            <div className="mt-10 space-y-3 text-xs tracking-wide text-muted-foreground">
              <p>{t("note1")}</p>
              <p>{t("note2")}</p>
              <p>{t("note3")}</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
            <h2 className="mb-10 font-serif text-3xl md:text-4xl">
              {t("relatedTitle1")} <em className="font-light italic text-muted-foreground">{t("relatedItalic")}</em>
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
