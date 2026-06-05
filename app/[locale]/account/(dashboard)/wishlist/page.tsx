import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from("wishlists")
    .select("product_id, products(*)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  const products = (data ?? [])
    .map((row: any) => row.products as Product)
    .filter(Boolean)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-3xl italic text-muted-foreground">Избранное пусто</p>
        <p className="mt-4 text-sm text-muted-foreground">
          Нажмите ♡ на любом украшении, чтобы сохранить его здесь.
        </p>
        <Link
          href="/shop"
          className="mt-8 border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-8 text-xs tracking-[0.25em] text-muted-foreground uppercase">{products.length} украшений</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} wishlistIds={[p.id]} />
        ))}
      </div>
    </div>
  )
}
