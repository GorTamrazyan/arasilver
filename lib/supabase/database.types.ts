// Минимальная типизация схемы Supabase для таблиц, к которым обращается
// service-role клиент (создание заказа и платёжный слой). Остальное приложение
// работает с нетипизированным клиентом; здесь типы нужны, чтобы insert/update
// проверялись компилятором без any.

type PaymentRow = {
  id: string
  order_id: string
  provider: "arca" | "idram" | "mock"
  provider_payment_id: string | null
  status: "pending" | "paid" | "failed" | "cancelled"
  amount_minor: number
  currency: string
  raw_callback: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

type OrderRow = {
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
  status: string
  user_id: string | null
  created_at: string
  updated_at: string
}

type OrderItemRow = {
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

type ProductRow = {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  stock: number
}

export type Database = {
  public: {
    Tables: {
      payments: {
        Row: PaymentRow
        Insert: Partial<PaymentRow> & Pick<PaymentRow, "order_id" | "provider">
        Update: Partial<PaymentRow>
        Relationships: []
      }
      orders: {
        Row: OrderRow
        Insert: Partial<OrderRow>
        Update: Partial<OrderRow>
        Relationships: []
      }
      order_items: {
        Row: OrderItemRow
        Insert: Partial<OrderItemRow> &
          Pick<OrderItemRow, "order_id" | "product_name" | "unit_price" | "quantity" | "subtotal">
        Update: Partial<OrderItemRow>
        Relationships: []
      }
      products: {
        Row: ProductRow
        Insert: Partial<ProductRow> & Pick<ProductRow, "name" | "slug" | "price">
        Update: Partial<ProductRow>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
