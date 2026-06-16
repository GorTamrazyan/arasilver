"use server"

import { after } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { sendOrderConfirmation } from "@/lib/email/order-confirmation"
import type { CartItem } from "@/lib/types"

export type CreateOrderInput = {
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal?: string
  notes?: string
  items: CartItem[]
  /** Локаль покупателя для языка письма-подтверждения. */
  locale?: string
}

export type CreateOrderResult =
  | { ok: true; order_id: string; order_number: string }
  | { ok: false; error: string }

const SHIPPING_COST = 10

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    if (!input.items || input.items.length === 0) {
      return { ok: false, error: "Корзина пуста" }
    }
    if (!input.customer_name.trim()) return { ok: false, error: "Укажите имя" }
    if (!input.customer_email.trim()) return { ok: false, error: "Укажите email" }
    if (!input.customer_phone.trim()) return { ok: false, error: "Укажите телефон" }
    if (!input.shipping_address.trim()) return { ok: false, error: "Укажите адрес" }
    if (!input.shipping_city.trim()) return { ok: false, error: "Укажите город" }
    if (!input.shipping_country.trim()) return { ok: false, error: "Укажите страну" }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Записи заказа делаем service-role клиентом: гостевой чекаут и RETURNING
    // не зависят от RLS-политик таблицы orders. Цены ниже перепроверяются из
    // БД, поэтому клиент не может подменить сумму.
    const db = createServiceClient()

    // Re-fetch product prices from DB to prevent tampering
    const ids = input.items.map((i) => i.product_id)
    const { data: dbProducts, error: productsError } = await db
      .from("products")
      .select("id, name, slug, price, image_url, stock")
      .in("id", ids)

    if (productsError || !dbProducts) {
      return { ok: false, error: "Не удалось получить товары" }
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]))
    let subtotal = 0
    const validatedItems = input.items.map((item) => {
      const dbP = productMap.get(item.product_id)
      if (!dbP) throw new Error(`Товар ${item.name} недоступен`)
      if (dbP.stock < item.quantity) throw new Error(`Недостаточно «${dbP.name}» на складе`)
      const price = Number(dbP.price)
      const itemSubtotal = price * item.quantity
      subtotal += itemSubtotal
      return {
        product_id: dbP.id,
        product_name: dbP.name,
        product_slug: dbP.slug,
        product_image: dbP.image_url,
        unit_price: price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      }
    })

    const shipping_cost = SHIPPING_COST
    const total = subtotal + shipping_cost

    const { data: order, error: orderError } = await db
      .from("orders")
      .insert({
        customer_name: input.customer_name.trim(),
        customer_email: input.customer_email.trim(),
        customer_phone: input.customer_phone.trim(),
        shipping_address: input.shipping_address.trim(),
        shipping_city: input.shipping_city.trim(),
        shipping_country: input.shipping_country.trim(),
        shipping_postal: input.shipping_postal?.trim() || null,
        notes: input.notes?.trim() || null,
        subtotal,
        shipping_cost,
        total,
        currency: "USD",
        status: "pending",
        ...(user ? { user_id: user.id } : {}),
      })
      .select("id, order_number")
      .single()

    if (orderError || !order) {
      console.log("[v0] order insert error:", orderError)
      return { ok: false, error: "Не удалось создать заказ" }
    }

    const itemsToInsert = validatedItems.map((v) => ({ ...v, order_id: order.id }))
    const { error: itemsError } = await db.from("order_items").insert(itemsToInsert)

    if (itemsError) {
      console.log("[v0] order_items insert error:", itemsError)
      return { ok: false, error: "Не удалось сохранить товары заказа" }
    }

    // Decrement stock
    for (const v of validatedItems) {
      const dbP = productMap.get(v.product_id)!
      await db
        .from("products")
        .update({ stock: Math.max(0, dbP.stock - v.quantity) })
        .eq("id", v.product_id)
    }

    // Письмо-подтверждение шлём ПОСЛЕ ответа (after): не задерживает оформление,
    // а сбой почты не ломает заказ.
    const emailItems = validatedItems.map((v) => ({
      product_name: v.product_name,
      quantity: v.quantity,
      unit_price: v.unit_price,
      subtotal: v.subtotal,
    }))
    after(async () => {
      try {
        await sendOrderConfirmation({
          to: input.customer_email.trim(),
          orderNumber: order.order_number,
          customerName: input.customer_name.trim(),
          items: emailItems,
          subtotal,
          shippingCost: shipping_cost,
          total,
          currency: "USD",
          locale: input.locale,
        })
      } catch (e) {
        console.log("[email] order confirmation failed:", e)
      }
    })

    return { ok: true, order_id: order.id, order_number: order.order_number }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Неизвестная ошибка"
    console.log("[v0] createOrder exception:", message)
    return { ok: false, error: message }
  }
}
