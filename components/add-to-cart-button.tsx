"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useCart } from "./cart/cart-provider"
import type { CartItem } from "@/lib/types"

export function AddToCartButton({
  product,
  disabled = false,
}: {
  product: Omit<CartItem, "quantity">
  disabled?: boolean
}) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
      <div className="flex items-center border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Уменьшить количество"
          className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-muted"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center text-sm tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Увеличить количество"
          className="flex h-12 w-12 items-center justify-center transition-colors hover:bg-muted"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => addItem(product, qty)}
        disabled={disabled}
        className="flex-1 bg-foreground px-8 py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disabled ? "Нет в наличии" : "Добавить в корзину"}
      </button>
    </div>
  )
}
