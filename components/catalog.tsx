import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

export async function Catalog() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(4)

  const products = (data ?? []) as Product[]

  return (
    <section id="catalog" className="border-b border-border/60">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs tracking-[0.3em] text-muted-foreground uppercase">
              <span className="h-px w-8 bg-muted-foreground/60" aria-hidden="true" />
              Каталог
            </p>
            <h2 className="font-serif text-4xl leading-tight text-balance text-foreground md:text-6xl">
              Избранные
              <br />
              <em className="font-light italic text-muted-foreground">работы</em>
            </h2>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 self-start border border-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
          >
            Весь каталог
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">Товары скоро появятся.</p>
        )}
      </div>
    </section>
  )
}
