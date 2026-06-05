"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"
import { toggleWishlist } from "@/app/actions/wishlist"

type Props = {
  productId: string
  initialInWishlist?: boolean
  className?: string
}

export function WishlistButton({ productId, initialInWishlist, className = "" }: Props) {
  const t = useTranslations("Wishlist")
  const [inWishlist, setInWishlist] = useState(initialInWishlist ?? false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Only fetch from DB when the server didn't provide initial state
  useEffect(() => {
    if (initialInWishlist !== undefined) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from("wishlists")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => setInWishlist(!!data))
    })
  }, [productId, initialInWishlist])

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/account/login?next=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    const next = !inWishlist
    setInWishlist(next) // optimistic
    setLoading(true)

    try {
      const result = await toggleWishlist(productId)
      if (!result.ok) setInWishlist(!next) // revert on failure
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      aria-label={inWishlist ? t("remove") : t("add")}
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center transition-opacity disabled:opacity-60 ${className}`}
    >
      <Heart
        className="h-4 w-4 transition-all"
        fill={inWishlist ? "currentColor" : "none"}
        strokeWidth={1.5}
      />
    </button>
  )
}
