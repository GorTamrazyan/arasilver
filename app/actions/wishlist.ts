"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function toggleWishlist(productId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: "not_authenticated" }

  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    await supabase.from("wishlists").delete().eq("id", existing.id)
    revalidatePath("/account/wishlist")
    return { ok: true as const, added: false }
  } else {
    await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId })
    revalidatePath("/account/wishlist")
    return { ok: true as const, added: true }
  }
}

export async function getWishlistIds(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id)
  return (data ?? []).map((r) => r.product_id)
}
