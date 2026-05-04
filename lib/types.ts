export type ProductCategory = "rings" | "earrings" | "pendants" | "bracelets" | "necklaces"

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  description: string | null
  price: number
  currency: string
  image_url: string | null
  material: string | null
  stock: number
  is_active: boolean
  created_at: string
}

export type CartItem = {
  product_id: string
  slug: string
  name: string
  price: number
  image_url: string | null
  quantity: number
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  shipping_postal: string | null
  notes: string | null
  subtotal: number
  shipping_cost: number
  total: number
  currency: string
  status: OrderStatus
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_slug: string | null
  product_image: string | null
  unit_price: number
  quantity: number
  subtotal: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  rings: "Кольца",
  earrings: "Серьги",
  pendants: "Подвески",
  bracelets: "Браслеты",
  necklaces: "Колье",
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Новый",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
}
