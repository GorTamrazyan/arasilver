"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { OrderStatus, ProductCategory } from "@/lib/types"
import { ANNOUNCEMENT_LOCALES, announcementKey } from "@/lib/site-settings"
import { SITE_TEXT_LOCALES, SITE_TEXT_FIELDS, siteTextKey } from "@/lib/site-texts"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.is_admin !== true) {
    throw new Error("Нет прав администратора")
  }
  return supabase
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await requireAdmin()
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin")
  return { ok: true as const }
}

export type ProductInput = {
  id?: string
  slug: string
  name: string
  category: ProductCategory
  description: string
  price: number
  image_url: string
  material: string
  stock: number
  is_active: boolean
}

export async function upsertProduct(input: ProductInput) {
  const supabase = await requireAdmin()
  if (input.id) {
    const { error } = await supabase
      .from("products")
      .update({
        slug: input.slug,
        name: input.name,
        category: input.category,
        description: input.description,
        price: input.price,
        image_url: input.image_url,
        material: input.material,
        stock: input.stock,
        is_active: input.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
    if (error) return { ok: false as const, error: error.message }
  } else {
    const { error } = await supabase.from("products").insert({
      slug: input.slug,
      name: input.name,
      category: input.category,
      description: input.description,
      price: input.price,
      image_url: input.image_url,
      material: input.material,
      stock: input.stock,
      is_active: input.is_active,
    })
    if (error) return { ok: false as const, error: error.message }
  }
  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
  return { ok: true as const }
}

/** Saves the announcement bar text for every locale (value = one item per line). */
export async function saveAnnouncement(byLocale: Record<string, string>) {
  const supabase = await requireAdmin()
  const rows = ANNOUNCEMENT_LOCALES.map((locale) => ({
    key: announcementKey(locale),
    value: byLocale[locale] ?? "",
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from("site_settings").upsert(rows)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/")
  revalidatePath("/admin/media")
  return { ok: true as const }
}

/**
 * Saves editable home-page headlines. Accepts a flat map of
 * `text_<section>_<field>_<locale>` → value; unknown keys are ignored.
 */
export async function saveSiteTexts(values: Record<string, string>) {
  const supabase = await requireAdmin()

  const allowed = new Set<string>()
  for (const locale of SITE_TEXT_LOCALES) {
    for (const [section, fields] of Object.entries(SITE_TEXT_FIELDS)) {
      for (const field of fields) allowed.add(siteTextKey(section, field, locale))
    }
  }

  const rows = Object.entries(values)
    .filter(([key]) => allowed.has(key))
    .map(([key, value]) => ({ key, value: value ?? "", updated_at: new Date().toISOString() }))

  if (rows.length === 0) return { ok: true as const }

  const { error } = await supabase.from("site_settings").upsert(rows)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/")
  revalidatePath("/admin/media")
  return { ok: true as const }
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/shop")
  return { ok: true as const }
}
