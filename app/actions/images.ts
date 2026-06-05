"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { SITE_IMAGE_KEYS, type SiteImageKey } from "@/lib/site-images"

type UploadResult = { ok: true; url: string } | { ok: false; error: string }

async function requireAdminClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.is_admin !== true) return null
  return supabase
}

/** Uploads a banner image to Cloudinary and points the given slot at the URL. */
export async function uploadSiteImage(key: string, formData: FormData): Promise<UploadResult> {
  const supabase = await requireAdminClient()
  if (!supabase) return { ok: false, error: "Нет прав администратора" }

  if (!(SITE_IMAGE_KEYS as readonly string[]).includes(key)) {
    return { ok: false, error: "Неизвестный слот изображения" }
  }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Файл не выбран" }
  }

  let url: string
  try {
    url = await uploadToCloudinary(file, "arasilver/site")
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ошибка загрузки в Cloudinary" }
  }

  const { error: dbErr } = await supabase
    .from("site_images")
    .upsert({ key: key as SiteImageKey, url, updated_at: new Date().toISOString() })
  if (dbErr) return { ok: false, error: dbErr.message }

  revalidatePath("/")
  revalidatePath("/admin/media")
  return { ok: true, url }
}

/** Uploads a product photo to Cloudinary and returns its URL (saved via upsertProduct). */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  const supabase = await requireAdminClient()
  if (!supabase) return { ok: false, error: "Нет прав администратора" }

  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Файл не выбран" }
  }

  try {
    const url = await uploadToCloudinary(file, "arasilver/products")
    return { ok: true, url }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ошибка загрузки в Cloudinary" }
  }
}
