"use client"

import { ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCart } from "./cart-provider"

export function CartButton() {
  const t = useTranslations("Cart")
  const { itemCount, openCart } = useCart()
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={t("ariaOpen")}
      className="flex items-center gap-1.5 transition-colors hover:text-foreground"
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      <span className="text-xs tabular-nums">{itemCount}</span>
    </button>
  )
}
