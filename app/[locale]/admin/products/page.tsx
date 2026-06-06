import { getTranslations } from "next-intl/server"
import { createClient } from "@/lib/supabase/server"
import { AdminShell } from "@/components/admin/admin-shell"
import { ProductsManager } from "@/components/admin/products-manager"
import type { Product } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin.products")
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false })
  const products = (data ?? []) as Product[]

  return (
    <AdminShell active="products">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">{t("eyebrow")}</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{t("title")}</h1>
        </div>
      </div>
      <ProductsManager initialProducts={products} />
    </AdminShell>
  )
}
