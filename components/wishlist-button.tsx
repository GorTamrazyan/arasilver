"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toggleWishlist } from "@/app/actions/wishlist"

type Props = {
  productId: string
  initialInWishlist?: boolean
  className?: string
}

export function WishlistButton({ productId, initialInWishlist, className = "" }: Props) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist ?? false)
  const [checked, setChecked] = useState(initialInWishlist !== undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    if (checked) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setChecked(true); return }
      supabase
        .from("wishlists")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setInWishlist(!!data)
          setChecked(true)
        })
    })
  }, [productId, checked])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(`/account/login?next=${encodeURIComponent(window.location.pathname)}`)
        return
      }
      const optimistic = !inWishlist
      setInWishlist(optimistic)
      startTransition(async () => {
        const result = await toggleWishlist(productId)
        if (!result.ok) setInWishlist(!optimistic)
      })
    })
  }

  return (
    <button
      type="button"
      aria-label={inWishlist ? "Убрать из избранного" : "Добавить в избранное"}
      onClick={handleClick}
      disabled={isPending}
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
