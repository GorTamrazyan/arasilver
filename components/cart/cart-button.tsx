"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "./cart-provider"

export function CartButton() {
  const { itemCount, openCart } = useCart()
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Открыть корзину"
      className="flex items-center gap-1.5 transition-colors hover:text-foreground"
    >
      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
      <span className="text-xs tabular-nums">{itemCount}</span>
    </button>
  )
}
