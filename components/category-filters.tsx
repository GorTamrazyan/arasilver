import Link from "next/link"
import type { ProductCategory } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"

const categories: { value: ProductCategory | null; label: string }[] = [
  { value: null, label: "Все" },
  { value: "rings", label: CATEGORY_LABELS.rings },
  { value: "earrings", label: CATEGORY_LABELS.earrings },
  { value: "pendants", label: CATEGORY_LABELS.pendants },
  { value: "bracelets", label: CATEGORY_LABELS.bracelets },
  { value: "necklaces", label: CATEGORY_LABELS.necklaces },
]

export function CategoryFilters({ active }: { active: ProductCategory | null }) {
  return (
    <div className="mb-12 flex flex-wrap gap-2">
      {categories.map((c) => {
        const isActive = c.value === active
        const href = c.value ? `/shop?category=${c.value}` : "/shop"
        return (
          <Link
            key={c.label}
            href={href}
            className={`border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </Link>
        )
      })}
    </div>
  )
}
