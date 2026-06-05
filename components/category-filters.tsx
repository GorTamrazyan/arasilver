import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import type { ProductCategory } from "@/lib/types"

const categoryKeys: { value: ProductCategory | null; key: string }[] = [
  { value: null, key: "all" },
  { value: "rings", key: "rings" },
  { value: "earrings", key: "earrings" },
  { value: "pendants", key: "pendants" },
  { value: "bracelets", key: "bracelets" },
  { value: "necklaces", key: "necklaces" },
]

export function CategoryFilters({ active }: { active: ProductCategory | null }) {
  const t = useTranslations("Categories")

  return (
    <div className="mb-12 flex flex-wrap gap-2">
      {categoryKeys.map((c) => {
        const isActive = c.value === active
        const label = t(c.key)
        return (
          <Link
            key={c.key}
            href={c.value ? { pathname: "/shop", query: { category: c.value } } : "/shop"}
            className={`border px-4 py-2 text-xs tracking-[0.2em] uppercase transition-colors ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground/70 hover:border-foreground hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
