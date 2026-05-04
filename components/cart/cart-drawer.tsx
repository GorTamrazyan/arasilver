"use client"

import Image from "next/image"
import Link from "next/link"
import { X, Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatPrice } from "@/lib/format"
import { useEffect } from "react"

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Корзина">
      <button
        type="button"
        aria-label="Закрыть корзину"
        onClick={closeCart}
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Корзина</p>
            <h2 className="mt-1 font-serif text-2xl">
              {itemCount} {getItemWord(itemCount)}
            </h2>
          </div>
          <button type="button" onClick={closeCart} aria-label="Закрыть">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-serif text-2xl italic text-muted-foreground">Ваша корзина пуста</p>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Выберите украшение из каталога, чтобы начать заказ.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-8 border border-foreground px-6 py-3 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              В каталог
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-border/60">
                {items.map((item) => (
                  <li key={item.product_id} className="flex gap-4 p-6">
                    <div className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-muted">
                      {item.image_url && (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                          <p className="mt-1 text-xs tracking-wide text-muted-foreground">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          aria-label="Удалить"
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            aria-label="Уменьшить"
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            aria-label="Увеличить"
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-muted"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border/60 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Итого</span>
                <span className="font-serif text-2xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-5 text-xs text-muted-foreground">Доставка рассчитывается на следующем шаге.</p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-3 bg-foreground py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90"
              >
                Оформить заказ
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full py-3 text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                Продолжить покупки
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function getItemWord(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return "украшение"
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "украшения"
  return "украшений"
}
