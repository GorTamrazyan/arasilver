-- ARASILVER e-commerce schema
-- Products, orders, order items

create extension if not exists "pgcrypto";

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('rings', 'earrings', 'pendants', 'bracelets', 'necklaces')),
  description text,
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'USD',
  image_url text,
  images jsonb default '[]'::jsonb,
  material text default '925 Sterling Silver',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_is_active on public.products(is_active);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default ('AR-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_country text not null,
  shipping_postal text,
  notes text,
  subtotal numeric(10, 2) not null,
  shipping_cost numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- Order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  product_image text,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Enable RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products: anyone can read active products
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (is_active = true);

-- Admin can do everything on products
drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using (
    auth.jwt() ->> 'email' is not null
    and (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Orders: anyone can create (guest checkout)
drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public" on public.orders
  for insert with check (true);

-- Only admin can view orders
drop policy if exists "orders_admin_select" on public.orders;
create policy "orders_admin_select" on public.orders
  for select using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );

-- Order items: anyone can insert (as part of order creation)
drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public" on public.order_items
  for insert with check (true);

drop policy if exists "order_items_admin_select" on public.order_items;
create policy "order_items_admin_select" on public.order_items
  for select using (
    (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true
  );
