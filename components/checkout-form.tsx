"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useCart } from "./cart/cart-provider"
import { formatPrice } from "@/lib/format"
import { createOrder } from "@/app/actions/orders"
import type { Address } from "@/lib/types"

const SHIPPING_COST = 10

type UserPrefill = {
  name: string
  email: string
  phone: string
} | null

type Props = {
  userPrefill?: UserPrefill
  savedAddresses?: Address[]
}

export function CheckoutForm({ userPrefill, savedAddresses = [] }: Props) {
  const { items, subtotal, clear } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Controlled shipping fields so saved address can autofill them
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("Россия")
  const [postal, setPostal] = useState("")

  function applyAddress(addr: Address) {
    setAddress(addr.street)
    setCity(addr.city)
    setCountry(addr.country)
    setPostal(addr.postal ?? "")
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const fd = new FormData(form)

    const result = await createOrder({
      customer_name: String(fd.get("name") ?? ""),
      customer_email: String(fd.get("email") ?? ""),
      customer_phone: String(fd.get("phone") ?? ""),
      shipping_address: address || String(fd.get("address") ?? ""),
      shipping_city: city || String(fd.get("city") ?? ""),
      shipping_country: country,
      shipping_postal: postal || String(fd.get("postal") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      items,
    })

    if (result.ok) {
      clear()
      const isGuest = !userPrefill
      const email = String(fd.get("email") ?? "")
      const query = new URLSearchParams({ number: result.order_number })
      if (isGuest) query.set("email", email)
      router.push(`/order/${result.order_id}?${query}`)
    } else {
      setError(result.error)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-3xl italic text-muted-foreground">Ваша корзина пуста</p>
        <Link
          href="/shop"
          className="mt-8 border border-foreground px-8 py-4 text-xs tracking-[0.25em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  const total = subtotal + SHIPPING_COST

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
      <div className="space-y-8">
        {!userPrefill && (
          <div className="border border-border/60 bg-secondary/30 px-5 py-4 text-sm">
            Уже есть аккаунт?{" "}
            <Link
              href="/account/login?next=/checkout"
              className="text-foreground underline-offset-4 hover:underline"
            >
              Войти
            </Link>{" "}
            — данные заполнятся автоматически.
          </div>
        )}

        <fieldset className="space-y-5">
          <legend className="mb-4 text-xs tracking-[0.25em] text-muted-foreground uppercase">Контакты</legend>
          <Field label="Имя и фамилия" name="name" required defaultValue={userPrefill?.name} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required defaultValue={userPrefill?.email} />
            <Field label="Телефон" name="phone" type="tel" required placeholder="+7 ..." defaultValue={userPrefill?.phone} />
          </div>
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-4 text-xs tracking-[0.25em] text-muted-foreground uppercase">Адрес доставки</legend>

          {savedAddresses.length > 0 && (
            <div>
              <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                Сохранённые адреса
              </span>
              <select
                onChange={(e) => {
                  const addr = savedAddresses.find((a) => a.id === e.target.value)
                  if (addr) applyAddress(addr)
                }}
                defaultValue=""
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              >
                <option value="" disabled>Выбрать адрес…</option>
                {savedAddresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.street}, {a.city}{a.is_default ? " (по умолчанию)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Адрес (улица, дом, квартира) *
            </span>
            <input
              type="text"
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Город *</span>
              <input
                type="text"
                name="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Индекс</span>
              <input
                type="text"
                name="postal"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Страна *</span>
            <input
              type="text"
              name="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </label>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-xs tracking-[0.25em] text-muted-foreground uppercase">Комментарий</legend>
          <label className="block">
            <textarea
              name="notes"
              rows={4}
              placeholder="Пожелания по упаковке, гравировке..."
              className="w-full border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-foreground focus:outline-none"
            />
          </label>
        </fieldset>

        {error && (
          <div className="border border-destructive/50 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </div>

      <aside className="h-fit border border-border bg-secondary/30 p-6 lg:sticky lg:top-24">
        <h2 className="mb-5 text-xs tracking-[0.25em] text-muted-foreground uppercase">Ваш заказ</h2>
        <ul className="divide-y divide-border/60">
          {items.map((item) => (
            <li key={item.product_id} className="flex gap-4 py-4">
              <div className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-muted">
                {item.image_url && (
                  <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-serif text-base leading-tight">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">× {item.quantity}</p>
                </div>
                <p className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-border/60 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Подытог</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Доставка</dt>
            <dd className="tabular-nums">{formatPrice(SHIPPING_COST)}</dd>
          </div>
          <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-4">
            <dt className="text-xs tracking-[0.2em] uppercase">Итого</dt>
            <dd className="font-serif text-2xl tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-foreground py-4 text-xs tracking-[0.25em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Отправляем..." : "Подтвердить заказ"}
        </button>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
          После оформления заказа мы свяжемся с вами для подтверждения деталей и способа оплаты.
        </p>
      </aside>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  defaultValue?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
        {required && <span aria-hidden> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-foreground focus:outline-none"
      />
    </label>
  )
}
