import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Product } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { formatPrice } from "@/lib/format"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {product.image_url && (
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-4 left-4 bg-background px-3 py-1 text-[10px] tracking-[0.25em] uppercase">
            Осталось {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-4 left-4 bg-foreground px-3 py-1 text-[10px] tracking-[0.25em] text-background uppercase">
            Нет в наличии
          </span>
        )}
        <div className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center bg-background opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
            {CATEGORY_LABELS[product.category]}
          </p>
          <h3 className="mt-2 font-serif text-xl text-foreground">{product.name}</h3>
        </div>
        <p className="pt-6 text-sm tabular-nums text-foreground">{formatPrice(product.price, product.currency)}</p>
      </div>
    </Link>
  )
}
