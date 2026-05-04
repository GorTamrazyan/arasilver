"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { OrderStatus, ProductCategory } from "@/lib/types"

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

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/admin/products")
  revalidatePath("/shop")
  return { ok: true as const }
}
