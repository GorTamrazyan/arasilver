import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { ProductCard } from "@/components/product-card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { WishlistButton } from "@/components/wishlist-button"
import type { Product } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { formatPrice } from "@/lib/format"
import { getWishlistIds } from "@/app/actions/wishlist"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle()

  if (!product) notFound()
  const p = product as Product

  const wishlistIds = await getWishlistIds()

  const { data: relatedData } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("category", p.category)
    .neq("id", p.id)
    .limit(4)

  const related = (relatedData ?? []) as Product[]

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <div className="mx-auto max-w-[1400px] px-5 pt-8 md:px-10">
        <nav className="flex items-center gap-2 text-xs tracking-[0.15em] text-muted-foreground uppercase">
          <Link href="/" className="hover:text-foreground">
            Главная
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-foreground">
            Каталог
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
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{CATEGORY_LABELS[p.category]}</p>
            <h1 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{p.name}</h1>
            <p className="mt-6 font-serif text-3xl tabular-nums">{formatPrice(p.price, p.currency)}</p>

            {p.description && (
              <p className="mt-8 max-w-prose text-base leading-relaxed text-foreground/80">{p.description}</p>
            )}

            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border/60 py-6">
              <div>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Материал</dt>
                <dd className="mt-2 text-sm">{p.material ?? "925 Sterling Silver"}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Наличие</dt>
                <dd className="mt-2 text-sm">
                  {p.stock > 0 ? `${p.stock} шт. в наличии` : "Под заказ"}
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
                initialInWishlist={wishlistIds.includes(p.id)}
                className="h-12 w-12 border border-border hover:border-foreground"
              />
            </div>

            <div className="mt-10 space-y-3 text-xs tracking-wide text-muted-foreground">
              <p>— Ручная работа, срок изготовления до 7 дней</p>
              <p>— Доставка по всему миру</p>
              <p>— Упаковка в подарочную коробку</p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border/60">
          <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
            <h2 className="mb-10 font-serif text-3xl md:text-4xl">
              Похожие <em className="font-light italic text-muted-foreground">украшения</em>
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
