"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { Address, AddressInput } from "@/lib/types"

async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Не авторизован")
  return { supabase, user }
}

export async function updateProfile(input: { full_name: string; phone: string }) {
  const { supabase } = await requireUser()
  const { error } = await supabase.auth.updateUser({
    data: { full_name: input.full_name.trim(), phone: input.phone.trim() },
  })
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/account/profile")
  return { ok: true as const }
}

export async function changePassword(input: { current: string; next: string }) {
  const { supabase, user } = await requireUser()
  // Re-authenticate with current password first
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: input.current,
  })
  if (signInError) return { ok: false as const, error: "Неверный текущий пароль" }
  const { error } = await supabase.auth.updateUser({ password: input.next })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}

export async function resetPassword(password: string) {
  const { supabase } = await requireUser()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { ok: false as const, error: error.message }
  return { ok: true as const }
}

export async function addAddress(input: AddressInput) {
  const { supabase, user } = await requireUser()
  if (input.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
  }
  const { error } = await supabase.from("addresses").insert({ ...input, user_id: user.id })
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/account/addresses")
  return { ok: true as const }
}

export async function updateAddress(id: string, input: AddressInput) {
  const { supabase, user } = await requireUser()
  if (input.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .neq("id", id)
  }
  const { error } = await supabase
    .from("addresses")
    .update(input)
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/account/addresses")
  return { ok: true as const }
}

export async function deleteAddress(id: string) {
  const { supabase, user } = await requireUser()
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/account/addresses")
  return { ok: true as const }
}

export async function setDefaultAddress(id: string) {
  const { supabase, user } = await requireUser()
  await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return { ok: false as const, error: error.message }
  revalidatePath("/account/addresses")
  return { ok: true as const }
}
